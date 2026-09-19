import {
  createPublicClient,
  createWalletClient,
  http,
  parseEther,
  type Chain,
  type Hex,
} from 'viem';
import { privateKeyToAccount } from 'viem/accounts';

import {
  depositLocalVrfBalance,
  LOCAL_VRF_NODE_PRIVATE_KEY,
  setupLocalVerifyNetwork,
  startLocalVerifyNetworkNode,
} from './local-verify-network.ts';

const rpcUrl = process.env.RPC_URL ?? 'http://127.0.0.1:8545';
const depositClients = (process.env.DEPOSIT_CLIENTS ?? '')
  .split(',')
  .map(address => address.trim())
  .filter(Boolean) as `0x${string}`[];
const depositAmount = parseEther(process.env.DEPOSIT_ETH ?? '1000');

function resolveNodePrivateKeyFromEnv(): Hex {
  const raw = process.env.NODE_PRIVATE_KEY;
  if (!raw) return LOCAL_VRF_NODE_PRIVATE_KEY;
  return (raw.startsWith('0x') ? raw : `0x${raw}`) as Hex;
}

async function waitForRpc(): Promise<number> {
  const probe = createPublicClient({ transport: http(rpcUrl) });
  const deadline = Date.now() + 120_000;
  while (true) {
    try {
      return await probe.getChainId();
    } catch (error) {
      if (Date.now() > deadline) throw error;
      await new Promise(resolve => setTimeout(resolve, 500));
    }
  }
}

async function main() {
  console.log(`[local-verify-network] Waiting for RPC at ${rpcUrl} ...`);
  const chainId = await waitForRpc();
  const chain: Chain = {
    id: chainId,
    name: 'local',
    nativeCurrency: { name: 'Ether', symbol: 'ETH', decimals: 18 },
    rpcUrls: { default: { http: [rpcUrl] } },
  };

  const nodePrivateKey = resolveNodePrivateKeyFromEnv();
  const account = privateKeyToAccount(nodePrivateKey);
  const publicClient = createPublicClient({ chain, transport: http(rpcUrl) });
  const walletClient = createWalletClient({ account, chain, transport: http(rpcUrl) });
  const clients = { publicClient, walletClient, nodePrivateKey };

  const routerAddress = await setupLocalVerifyNetwork(clients);
  console.log(`[local-verify-network] Router deployed at ${routerAddress} (chainId ${chainId})`);
  console.log(`[local-verify-network] Node operator ${account.address}`);

  for (const consumer of depositClients) {
    await depositLocalVrfBalance({
      ...clients,
      routerAddress,
      account: consumer,
      amount: depositAmount,
    });
    console.log(`[local-verify-network] Deposited a balance for ${consumer}`);
  }
  if (depositClients.length === 0) {
    console.log(
      '[local-verify-network] No DEPOSIT_CLIENTS given — consumers must call deposit(consumer) on the router before requesting randomness, or send the fee as msg.value.',
    );
  }

  startLocalVerifyNetworkNode({ ...clients, routerAddress });
}

main().catch(error => {
  console.error('[local-verify-network] Fatal:', error);
  process.exit(1);
});
