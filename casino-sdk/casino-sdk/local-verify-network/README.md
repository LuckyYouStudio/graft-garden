# @chain/local-verify-network

Local simulator of the [Verify Network](https://verify.network) VRF. It deploys the **real**
router diamond (vendored ABI + bytecode of the `Router`, its facets, and the verifiers) to a local
chain and runs a single node that fulfills randomness requests exactly like the production
network: it watches `RandomnessRequested` events, generates a real ECVRF proof
(`SECP256K1-SHA256-TAI`), signs the EIP-712 `Fulfillment` payload with the registered node key,
and submits `fulfillRandomness`.

Randomness consumers integrate against the same `IVerifyNetworkRouter` /
`IVerifyNetworkVrfReceiver` interfaces locally as on testnet/mainnet — no mocks.

## Standalone usage

Run a local chain that uses the default Anvil/Hardhat test mnemonic (by default the node signs and
pays gas with account #3; override with `NODE_PRIVATE_KEY`), then:

```sh
npm install
npm start
```

The CLI waits for the RPC, deploys the router stack (the diamond, its four facets, the ECVRF
verifier, the trusted-node attestation verifier), registers the node, prints the router
address, and keeps fulfilling requests until stopped.

Environment variables:

| Variable           | Default                 | Purpose                                                            |
| ------------------ | ----------------------- | ------------------------------------------------------------------ |
| `RPC_URL`          | `http://127.0.0.1:8545` | JSON-RPC endpoint of the local chain                               |
| `NODE_PRIVATE_KEY` | Anvil/Hardhat acct `#3` | Node enclave + gas-paying key (must be funded on the local chain)  |
| `DEPOSIT_CLIENTS`  | _(empty)_               | Comma-separated consumer addresses to give a balance on the router |
| `DEPOSIT_ETH`      | `1000`                  | ETH deposited per consumer in `DEPOSIT_CLIENTS`                    |

Consumers not listed in `DEPOSIT_CLIENTS` must call `deposit(consumer)` on the router before
requesting randomness, or send the fee as `msg.value` with the request.

## Programmatic usage

```ts
import {
  setupLocalVerifyNetwork,
  startLocalVerifyNetworkNode,
  depositLocalVrfBalance,
  fulfillLocalVrfRequest,
} from '@chain/local-verify-network';
```

`setupLocalVerifyNetwork` deploys and registers, `startLocalVerifyNetworkNode` runs the watcher,
and `fulfillLocalVrfRequest` fulfills a single request on demand — handy in contract tests where
you want settlement to happen at an exact point instead of on a poll interval.

Pass `nodePrivateKey` to any of those helpers (and use a matching `walletClient`) to override the
default Anvil/Hardhat account `#3` key.

## Notes

- `src/artifacts.ts` is vendored from the verify-network-effect repo's Hardhat artifacts by
  `scripts/vendor-artifacts.ts`; re-run it after router contract changes there. The contracts
  package's `test/VerifyNetworkRouterInterface.test.ts` holds the hand-vendored Solidity
  interfaces to what it vendors.
- The router verifies only the node's EIP-712 signature at fulfillment time (verification is
  optimistic; ECVRF proofs are checked on-chain only in `challengeFulfillment`), but this
  simulator submits real proofs, so challenge flows and proof-verification UIs work locally.
