import {
  encodeAbiParameters,
  encodeFunctionData,
  getAddress,
  keccak256,
  parseAbiItem,
  toFunctionSelector,
  type Abi,
  type AbiFunction,
  type Account,
  type Address,
  type Chain,
  type Hex,
  type PublicClient,
  type Transport,
  type WalletClient,
} from 'viem';
import { privateKeyToAccount } from 'viem/accounts';

import {
  balancesFacetAbi,
  balancesFacetBytecode,
  configFacetAbi,
  configFacetBytecode,
  ecvrfVerifierAbi,
  ecvrfVerifierBytecode,
  nodesFacetAbi,
  nodesFacetBytecode,
  routerAbi,
  routerBytecode,
  routerInitAbi,
  routerInitBytecode,
  trustedNodeEnclaveKeyVerifierAbi,
  trustedNodeEnclaveKeyVerifierBytecode,
  vrfFacetAbi,
  vrfFacetBytecode,
} from './artifacts.ts';
import { generateVrfProof, publicKeyArrayFromPrivateKey, type VrfProof } from './ecvrf.ts';

// Anvil/Hardhat default mnemonic account #3 — dedicated to the local VRF node
// (both the enclave signing key and the gas-paying operator).
export const LOCAL_VRF_NODE_PRIVATE_KEY: Hex =
  '0x7c852118294e51e653712a81e05800f419141751be58f605c371e15141b007a6';

// What a fulfillment spends besides the callback: the request id, the signature recovery, the
// node and request writes, the events, and the echoed callback data as calldata (about 17 gas a
// byte). The router requires 64/63 of the callback gas limit (EIP-150 keeps 1/64 back from the
// call) plus its post-callback reserve to be left when it makes the call, so this covers what it
// spends before that point; the unused rest is refunded.
const FULFILLMENT_GAS_BESIDES_CALLBACK = 250_000n;
const FULFILLMENT_GAS_PER_CALLBACK_DATA_BYTE = 17n;

export type LocalVrfClients = {
  publicClient: PublicClient;
  walletClient: WalletClient<Transport, Chain, Account>;
};

export type LocalVrfNodeKey = {
  nodePrivateKey?: Hex;
};

/**
 * A request as the router assigns it. Only its id is stored on the router; the fields are hashed
 * into the id, emitted, and echoed back verbatim at fulfillment.
 */
export type RandomnessRequest = {
  consumer: Address;
  sequence: bigint;
  fulfiller: Address;
  assignedAt: number;
  fee: bigint;
  gasPrice: bigint;
  callbackGasLimit: number;
  callbackData: Hex;
};

export const randomnessRequestedEvent = parseAbiItem(
  'event RandomnessRequested(bytes32 indexed requestId, address indexed consumer, address indexed fulfiller, (address consumer, uint64 sequence, address fulfiller, uint40 assignedAt, uint96 fee, uint96 gasPrice, uint32 callbackGasLimit, bytes callbackData) request)',
);

export const randomnessFulfilledEvent = parseAbiItem(
  'event RandomnessFulfilled(bytes32 indexed requestId, bytes32 randomness, uint256[4] proof, bytes enclaveSignature)',
);

function resolveNodePrivateKey(nodePrivateKey?: Hex): Hex {
  return nodePrivateKey ?? LOCAL_VRF_NODE_PRIVATE_KEY;
}

function assertWalletMatchesNodeKey(
  walletClient: WalletClient<Transport, Chain, Account>,
  nodePrivateKey: Hex,
) {
  const nodeAccount = privateKeyToAccount(nodePrivateKey);
  if (getAddress(walletClient.account.address) !== getAddress(nodeAccount.address)) {
    throw new Error(
      `Local VRF node wallet must match nodePrivateKey address (${nodeAccount.address}), got ${walletClient.account.address}`,
    );
  }
  return nodeAccount;
}

async function deploy(
  { publicClient, walletClient }: LocalVrfClients,
  abi: Abi,
  bytecode: Hex,
): Promise<Address> {
  const hash = await walletClient.deployContract({ abi, bytecode });
  const receipt = await publicClient.waitForTransactionReceipt({ hash });
  if (!receipt.contractAddress) {
    throw new Error(`Deployment transaction ${hash} did not create a contract`);
  }
  return receipt.contractAddress;
}

/** The selectors a facet contributes to the diamond: every function in its ABI. */
function facetSelectors(abi: Abi): Hex[] {
  return abi
    .filter((entry): entry is AbiFunction => entry.type === 'function')
    .map(toFunctionSelector);
}

export function randomnessRequestFromLogArgs(args: {
  requestId?: Hex;
  request?: RandomnessRequest;
}): { requestId: Hex; request: RandomnessRequest } | undefined {
  const { requestId, request } = args;
  if (requestId === undefined || request === undefined) return undefined;
  return { requestId, request };
}

/**
 * Deploys the router diamond (its facets, the trusted-node attestation verifier, and the ECVRF
 * verifier challenges run), trusts the node's key for its own wallet as operator, and registers
 * the node with the router's stake. Returns the router address.
 */
export async function setupLocalVerifyNetwork({
  publicClient,
  walletClient,
  nodePrivateKey,
}: LocalVrfClients & LocalVrfNodeKey): Promise<Address> {
  const resolvedKey = resolveNodePrivateKey(nodePrivateKey);
  const nodeAccount = assertWalletMatchesNodeKey(walletClient, resolvedKey);
  const clients = { publicClient, walletClient };

  const routerAddress = await deploy(clients, routerAbi, routerBytecode);
  const attestationVerifierAddress = await deploy(
    clients,
    trustedNodeEnclaveKeyVerifierAbi,
    trustedNodeEnclaveKeyVerifierBytecode,
  );
  const ecvrfVerifierAddress = await deploy(clients, ecvrfVerifierAbi, ecvrfVerifierBytecode);
  const initAddress = await deploy(clients, routerInitAbi, routerInitBytecode);

  const facets = [
    { abi: vrfFacetAbi, bytecode: vrfFacetBytecode },
    { abi: nodesFacetAbi, bytecode: nodesFacetBytecode },
    { abi: balancesFacetAbi, bytecode: balancesFacetBytecode },
    { abi: configFacetAbi, bytecode: configFacetBytecode },
  ] as const;
  const cuts = [];
  for (const facet of facets) {
    cuts.push({
      target: await deploy(clients, facet.abi, facet.bytecode),
      action: 0, // FacetCutAction.Add
      selectors: facetSelectors(facet.abi),
    });
  }
  const cutHash = await walletClient.writeContract({
    abi: routerAbi,
    address: routerAddress,
    functionName: 'diamondCut',
    args: [
      cuts,
      initAddress,
      encodeFunctionData({
        abi: routerInitAbi,
        functionName: 'init',
        args: [attestationVerifierAddress, ecvrfVerifierAddress],
      }),
    ],
  });
  await publicClient.waitForTransactionReceipt({ hash: cutHash });

  const trustHash = await walletClient.writeContract({
    abi: trustedNodeEnclaveKeyVerifierAbi,
    address: attestationVerifierAddress,
    functionName: 'setTrustedNode',
    args: [nodeAccount.address, nodeAccount.address],
  });
  await publicClient.waitForTransactionReceipt({ hash: trustHash });

  const nodeStake = await publicClient.readContract({
    abi: configFacetAbi,
    address: routerAddress,
    functionName: 'nodeStake',
  });
  const registerHash = await walletClient.writeContract({
    abi: nodesFacetAbi,
    address: routerAddress,
    functionName: 'registerNode',
    args: [[...publicKeyArrayFromPrivateKey(resolvedKey)], '0x'],
    value: nodeStake,
  });
  await publicClient.waitForTransactionReceipt({ hash: registerHash });

  return routerAddress;
}

/** Deposits `amount` on the router under `account`, the consumer whose requests it pays for. */
export async function depositLocalVrfBalance({
  publicClient,
  walletClient,
  routerAddress,
  account,
  amount,
}: LocalVrfClients & { routerAddress: Address; account: Address; amount: bigint }) {
  const hash = await walletClient.writeContract({
    abi: balancesFacetAbi,
    address: routerAddress,
    functionName: 'deposit',
    args: [account],
    value: amount,
  });
  await publicClient.waitForTransactionReceipt({ hash });
}

/** Looks the echoed request up from the router's `RandomnessRequested` log. */
export async function findLocalVrfRequest({
  publicClient,
  routerAddress,
  requestId,
  fromBlock = 0n,
}: {
  publicClient: PublicClient;
  routerAddress: Address;
  requestId: Hex;
  fromBlock?: bigint;
}): Promise<RandomnessRequest> {
  const logs = await publicClient.getLogs({
    address: routerAddress,
    event: randomnessRequestedEvent,
    args: { requestId },
    fromBlock,
    toBlock: 'latest',
  });
  const found = logs.map(log => randomnessRequestFromLogArgs(log.args)).find(Boolean);
  if (!found) {
    throw new Error(`RandomnessRequested log not found for ${requestId}`);
  }
  return found.request;
}

export async function signLocalVrfFulfillment({
  nodePrivateKey,
  chainId,
  routerAddress,
  requestId,
  proof,
}: {
  nodePrivateKey: Hex;
  chainId: number;
  routerAddress: Address;
  requestId: Hex;
  proof: VrfProof;
}) {
  const proofCommitment = keccak256(encodeAbiParameters([{ type: 'uint256[4]' }], [proof]));
  return privateKeyToAccount(nodePrivateKey).signTypedData({
    domain: {
      name: 'VerifyNetworkVRF',
      version: '2',
      chainId,
      verifyingContract: routerAddress,
    },
    types: {
      Fulfillment: [
        { name: 'requestId', type: 'bytes32' },
        { name: 'proofCommitment', type: 'bytes32' },
      ],
    },
    primaryType: 'Fulfillment',
    message: { requestId, proofCommitment },
  });
}

/** The gas a fulfillment of `request` is sent with: enough for the whole callback gas limit. */
export function fulfillmentGas(request: RandomnessRequest): bigint {
  const callbackDataBytes = BigInt((request.callbackData.length - 2) / 2);
  return (
    (BigInt(request.callbackGasLimit) * 64n) / 63n +
    FULFILLMENT_GAS_BESIDES_CALLBACK +
    FULFILLMENT_GAS_PER_CALLBACK_DATA_BYTE * callbackDataBytes
  );
}

export async function fulfillLocalVrfRequest({
  publicClient,
  walletClient,
  routerAddress,
  requestId,
  request,
  nodePrivateKey,
}: LocalVrfClients &
  LocalVrfNodeKey & { routerAddress: Address; requestId: Hex; request?: RandomnessRequest }) {
  const resolvedKey = resolveNodePrivateKey(nodePrivateKey);
  assertWalletMatchesNodeKey(walletClient, resolvedKey);
  const echoedRequest =
    request ?? (await findLocalVrfRequest({ publicClient, routerAddress, requestId }));
  const proof = generateVrfProof(resolvedKey, requestId);
  const signature = await signLocalVrfFulfillment({
    nodePrivateKey: resolvedKey,
    chainId: await publicClient.getChainId(),
    routerAddress,
    requestId,
    proof,
  });

  const hash = await walletClient.writeContract({
    abi: vrfFacetAbi,
    address: routerAddress,
    functionName: 'fulfillRandomness',
    args: [echoedRequest, [...proof], signature],
    gas: fulfillmentGas(echoedRequest),
  });
  return publicClient.waitForTransactionReceipt({ hash });
}

export function startLocalVerifyNetworkNode({
  publicClient,
  walletClient,
  routerAddress,
  nodePrivateKey,
}: LocalVrfClients & LocalVrfNodeKey & { routerAddress: Address }) {
  const resolvedKey = resolveNodePrivateKey(nodePrivateKey);
  const nodeAccount = assertWalletMatchesNodeKey(walletClient, resolvedKey);
  // Single operator wallet — serialize fulfillments to avoid nonce races.
  let queue: Promise<void> = Promise.resolve();

  publicClient.watchEvent({
    address: routerAddress,
    event: randomnessRequestedEvent,
    poll: true,
    pollingInterval: 200,
    onLogs: logs => {
      for (const log of logs) {
        const assigned = randomnessRequestFromLogArgs(log.args);
        if (!assigned) continue;
        if (getAddress(assigned.request.fulfiller) !== getAddress(nodeAccount.address)) continue;

        queue = queue
          .then(async () => {
            console.log(`[LocalVerifyNetworkNode] Fulfilling requestId=${assigned.requestId}`);
            await fulfillLocalVrfRequest({
              publicClient,
              walletClient,
              routerAddress,
              requestId: assigned.requestId,
              request: assigned.request,
              nodePrivateKey: resolvedKey,
            });
            console.log(`[LocalVerifyNetworkNode] Fulfilled requestId=${assigned.requestId}`);
          })
          .catch(error => {
            console.error(
              `[LocalVerifyNetworkNode] Failed to fulfill ${assigned.requestId}:`,
              error,
            );
          });
      }
    },
    onError: error => {
      console.error('[LocalVerifyNetworkNode] Watcher error:', error);
    },
  });

  console.log(`[LocalVerifyNetworkNode] Watching ${routerAddress} as node ${nodeAccount.address}`);
}
