#!/usr/bin/env node
// Run with the SDK's `npm start` already running. Uses local test tokens only.
import assert from 'node:assert/strict';
import { readFileSync, writeFileSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import solc from 'solc';
import {
  createPublicClient, createWalletClient, defineChain, http, encodeAbiParameters,
  decodeAbiParameters, parseAbiParameters, encodeFunctionData, parseAbi,
  parseEventLogs, toHex, keccak256,
} from 'viem';
import { privateKeyToAccount } from 'viem/accounts';

const here = dirname(fileURLToPath(import.meta.url));
const simulator = resolve(here, '..');
const contracts = resolve(simulator, 'contracts');
const sourceName = 'GraftGardenGame.sol';
const output = JSON.parse(solc.compile(JSON.stringify({
  language: 'Solidity',
  sources: { [sourceName]: { content: readFileSync(resolve(contracts, sourceName), 'utf8') } },
  settings: {
    optimizer: { enabled: true, runs: 200 }, viaIR: true,
    outputSelection: { '*': { '*': ['abi', 'evm.deployedBytecode.object'] } },
  },
}), { import: path => ({ contents: readFileSync(resolve(contracts, path), 'utf8') }) }));
assert.deepEqual((output.errors ?? []).filter(e => e.severity === 'error'), [], 'Solidity must compile');
const artifact = output.contracts[sourceName].GraftGardenGame;
const deployed = JSON.parse(readFileSync(resolve(simulator, 'local-node/deployed.json'), 'utf8'));
const game = deployed.games.find(g => g.name === 'GraftGardenGame')?.address;
assert.ok(game, 'Start SDK local-node so GraftGardenGame is deployed');
const chain = defineChain({
  id: deployed.chainId, name: 'Local Graft Verification',
  nativeCurrency: { name: 'Ether', symbol: 'ETH', decimals: 18 },
  rpcUrls: { default: { http: [deployed.rpcUrl] } },
});
const client = createPublicClient({ chain, transport: http(deployed.rpcUrl), pollingInterval: 150 });
const code = await client.getCode({ address: game });
assert.equal(keccak256(code), keccak256(`0x${artifact.evm.deployedBytecode.object}`),
  'deployed contract differs from source; wait for local-node watcher and rerun');
// Published Hardhat development account. Never use this key on a public network.
const account = privateKeyToAccount('0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80');
assert.equal(await client.getChainId(), 31337, 'integration transactions are restricted to local chain 31337');
assert.match(new URL(deployed.rpcUrl).hostname, /^(localhost|127\.0\.0\.1)$/);
const wallet = createWalletClient({ account, chain, transport: http(deployed.rpcUrl) });
const dataTypes = parseAbiParameters('uint8 version, uint8 mode, uint8 layout, uint256[8] stakes');
const stateTypes = parseAbiParameters('uint8 version, uint8 mode, uint8 layout, uint8[3] seasons, uint8[8] hits');
const encode = (stakes, mode, layout, version = 1) => encodeAbiParameters(dataTypes, [version, mode, layout, stakes]);
const sum = xs => xs.reduce((a, b) => a + b, 0n);
const context = (stakes, mode, layout) => ({
  sessionId: 1n, player: account.address, vault: deployed.vault,
  wagerBase: sum(stakes), escrowedStake: sum(stakes), reservedProfit: 0n,
  step: 0, gameData: encode(stakes, mode, layout), gameState: '0x',
});
const read = (functionName, args) => client.readContract({ address: game, abi: artifact.abi, functionName, args });
const estimate = (functionName, args) => client.estimateGas({
  account, to: game, data: encodeFunctionData({ abi: artifact.abi, functionName, args }),
});

// Independent reference: walk each lane's physical nodes, with no mask math.
function reference(stakes, mode, layout, packed) {
  const winds = [packed & 7, (packed >> 3) & 7, (packed >> 6) & 7];
  const hits = stakes.map((_, lane) => winds.reduce((count, wind, season) => {
    const node = !layout || !season ? lane : season === 1
      ? (lane % 4) * 2 + Math.floor(lane / 4)
      : (lane % 2) * 4 + Math.floor(lane / 2);
    return count + (((node + 8 - wind) & 7) < 4 ? 1 : 0);
  }, 0));
  const payout = sum(hits.map((hit, lane) => stakes[lane] * BigInt(
    mode ? (hit === 3 ? 194 : 0) : hit === 3 ? 80 : hit === 2 ? 38 : 0) / 25n));
  return { winds, hits, payout };
}

// Independent check of optimized subset-mask enumeration for every wind triple.
function maskOutcome(stakes, mode, layout, packed) {
  const base = wind => ((15 << wind) | (15 >> (8 - wind))) & 255;
  const permute = (mask, nodes) => nodes.reduce((out, node, lane) => out | (((mask >> node) & 1) << lane), 0);
  const a = base(packed & 7);
  let b = base((packed >> 3) & 7), c = base((packed >> 6) & 7);
  if (layout) {
    b = permute(b, [0, 2, 4, 6, 1, 3, 5, 7]);
    c = permute(c, [0, 4, 1, 5, 2, 6, 3, 7]);
  }
  const three = a & b & c;
  const two = ((a & b) | (a & c) | (b & c)) ^ three;
  const units = mask => sum(stakes.filter((_, lane) => mask & (1 << lane))) / 25n;
  return mode ? units(three) * 194n : units(two) * 38n + units(three) * 80n;
}

const fixture = [25n, 50n, 75n, 100n, 125n, 150n, 175n, 200n];
const allocations = [
  ...Array.from({ length: 8 }, (_, active) => Array.from({ length: 8 }, (_, lane) => lane === active ? 25n : 0n)),
  [25n, 50n, 0n, 0n, 0n, 0n, 0n, 0n],
  Array(8).fill(25n), fixture,
  fixture.map(stake => stake * 10n ** 18n),
];
const report = {
  game, chainId: chain.id, sourceBytecodeHash: keccak256(code), rtpBps: 9700,
  exhaustiveOutcomeCalls: 0, quoteFixtures: 0, invalidCases: 0, modes: [], sessions: [],
};
for (let mode = 0; mode < 2; ++mode) for (let layout = 0; layout < 2; ++layout) {
  for (const stakes of allocations) {
    const rows = Array.from({ length: 512 }, (_, packed) => {
      const row = reference(stakes, mode, layout, packed);
      assert.equal(maskOutcome(stakes, mode, layout, packed), row.payout, 'subset masks equal independent lane walk');
      return row;
    });
    const max = rows.reduce((m, row) => row.payout > m ? row.payout : m, 0n);
    const count = BigInt(rows.filter(row => row.payout === max).length);
    const wager = sum(stakes);
    assert.equal(sum(rows.map(r => r.payout)) * 10000n, wager * 9700n * 512n, 'exact 97% RTP for every allocation');
    const args = [wager, encode(stakes, mode, layout)];
    assert.deepEqual(await read('quoteCaps', args), [wager, max > wager ? max - wager : 0n]);
    assert.deepEqual(await read('quoteRiskParams', args), [max, count * 10n ** 18n / 512n, wager * 9700n / 10000n, 0n]);
    ++report.quoteFixtures;
  }
  const ctx = context(fixture, mode, layout);
  const start = await read('onSessionStart', [ctx]);
  const caps = await read('quoteCaps', [ctx.wagerBase, ctx.gameData]);
  assert.equal(start.nextPhase, 1);
  assert.equal(start.requestRandomnessNow, true);
  assert.equal(start.escrowDelta, 0n);
  assert.equal(start.reservedProfitDelta, caps[1]);
  assert.equal(start.payout, 0n);
  assert.deepEqual(decodeAbiParameters(stateTypes, start.newGameState), [1, mode, layout, Array(3).fill(255), Array(8).fill(255)]);
  const settledContext = { ...ctx, reservedProfit: caps[1], step: 1, gameState: start.newGameState };
  // Small batches keep test RPC load bounded, while checking every VRF outcome.
  for (let from = 0; from < 512; from += 16) {
    await Promise.all(Array.from({ length: 16 }, async (_, offset) => {
      const packed = from + offset;
      const ref = reference(fixture, mode, layout, packed);
      const random = toHex((1n << 240n) | BigInt(packed), { size: 32 });
      const actual = await read('onRandomness', [settledContext, random]);
      assert.equal(actual.nextPhase, 3);
      assert.equal(actual.requestRandomnessNow, false);
      assert.equal(actual.escrowDelta, 0n);
      assert.equal(actual.reservedProfitDelta, 0n);
      assert.equal(actual.payout, ref.payout);
      assert.ok(actual.payout <= ctx.wagerBase + caps[1]);
      assert.deepEqual(decodeAbiParameters(stateTypes, actual.newGameState), [1, mode, layout, ref.winds, ref.hits]);
      ++report.exhaustiveOutcomeCalls;
    }));
  }
  assert.equal(await read('quoteForfeitPayout', [ctx]), 0n);
  await assert.rejects(read('onPlayerAction', [ctx, '0x']));
  report.modes.push({ mode, layout, gas: {
    quoteCaps: await estimate('quoteCaps', [ctx.wagerBase, ctx.gameData]),
    quoteRiskParams: await estimate('quoteRiskParams', [ctx.wagerBase, ctx.gameData]),
    onSessionStart: await estimate('onSessionStart', [ctx]),
    onRandomness: await estimate('onRandomness', [settledContext, toHex(511n, { size: 32 })]),
  } });
  console.log(`Verified mode=${mode} layout=${layout}: all 512 outcomes + ${allocations.length} quote allocations`);
}
const tooBig = (((1n << 128n) - 1n) / 25n) * 25n;
const badInputs = [
  [900n, '0x'], [900n, encode(fixture, 0, 0, 2)], [900n, encode(fixture, 2, 0)],
  [900n, encode(fixture, 0, 2)], [901n, encode(fixture, 0, 0)],
  [0n, encode(Array(8).fill(0n), 0, 0)],
  [1n, encode([1n, ...Array(7).fill(0n)], 0, 0)],
  [tooBig, encode([tooBig, ...Array(7).fill(0n)], 0, 0)],
  [tooBig + 25n, encode([tooBig + 25n, ...Array(7).fill(0n)], 0, 0)],
];
for (const [wager, gameData] of badInputs) {
  for (const fn of ['quoteCaps', 'quoteRiskParams']) await assert.rejects(read(fn, [wager, gameData]));
  const badCtx = { ...context(fixture, 0, 0), wagerBase: wager, gameData };
  await assert.rejects(read('onSessionStart', [badCtx]));
  await assert.rejects(read('onRandomness', [badCtx, toHex(1n, { size: 32 })]));
  ++report.invalidCases;
}

const hostAbi = parseAbi([
  'function openSession(address game,address vault,uint256 wager,bytes gameData) returns (uint256 sessionId,bytes32 requestId)',
  'function getSessionCommitment(uint256 sessionId) view returns (bytes32)',
  'event CasinoSessionOpened(uint256 indexed sessionId,address indexed game,address indexed player,address vault,uint256 wager)',
  'event CasinoSessionAdvanced(uint256 indexed sessionId,uint32 indexed step,bytes32 requestId,bytes32 randomness,bytes session)',
  'event CasinoSessionSettled(uint256 indexed sessionId,address indexed game,address indexed player,uint8 phase,uint256 payout,bytes32 randomness,bytes gameState)',
]);
const tokenAbi = parseAbi([
  'function approve(address spender,uint256 value) returns (bool)',
  'function balanceOf(address account) view returns (uint256)',
]);
const approval = await wallet.writeContract({ address: deployed.token, abi: tokenAbi, functionName: 'approve', args: [deployed.host, 3600n] });
assert.equal((await client.waitForTransactionReceipt({ hash: approval })).status, 'success');
for (let mode = 0; mode < 2; ++mode) for (let layout = 0; layout < 2; ++layout) {
  const balanceBefore = await client.readContract({ address: deployed.token, abi: tokenAbi, functionName: 'balanceOf', args: [account.address] });
  const hash = await wallet.writeContract({
    address: deployed.host, abi: hostAbi, functionName: 'openSession',
    args: [game, deployed.vault, 900n, encode(fixture, mode, layout)],
  });
  const receipt = await client.waitForTransactionReceipt({ hash });
  assert.equal(receipt.status, 'success');
  const opened = parseEventLogs({ abi: hostAbi, eventName: 'CasinoSessionOpened', logs: receipt.logs })[0];
  const advanced = parseEventLogs({ abi: hostAbi, eventName: 'CasinoSessionAdvanced', logs: receipt.logs })[0];
  assert.ok(opened && advanced, 'real host starts session and requests VRF');
  const sessionId = opened.args.sessionId;
  const deadline = Date.now() + 45000;
  let terminal;
  while (!terminal && Date.now() < deadline) {
    const logs = await client.getContractEvents({
      address: deployed.host, abi: hostAbi, eventName: 'CasinoSessionSettled',
      args: { sessionId }, fromBlock: receipt.blockNumber, toBlock: 'latest',
    });
    terminal = logs[0];
    if (!terminal) await new Promise(resolveWait => setTimeout(resolveWait, 200));
  }
  assert.ok(terminal, 'real local Verify Network must settle within 45 seconds');
  const packed = Number(BigInt(terminal.args.randomness) & 511n);
  const ref = reference(fixture, mode, layout, packed);
  assert.equal(terminal.args.phase, 3);
  assert.equal(terminal.args.payout, ref.payout);
  assert.deepEqual(decodeAbiParameters(stateTypes, terminal.args.gameState), [1, mode, layout, ref.winds, ref.hits]);
  const balanceAfter = await client.readContract({ address: deployed.token, abi: tokenAbi, functionName: 'balanceOf', args: [account.address] });
  assert.equal(balanceAfter, balanceBefore - 900n + ref.payout, 'actual token accounting matches contract outcome');
  assert.equal(await client.readContract({ address: deployed.host, abi: hostAbi, functionName: 'getSessionCommitment', args: [sessionId] }), toHex(0n, { size: 32 }));
  const fulfillment = await client.getTransactionReceipt({ hash: terminal.transactionHash });
  report.sessions.push({ mode, layout, sessionId, winds: ref.winds, payout: ref.payout, openSessionGas: receipt.gasUsed, fulfillmentGas: fulfillment.gasUsed });
  console.log(`Real host + VRF settled session ${sessionId} (mode=${mode}, layout=${layout})`);
}
const reportPath = resolve(here, '../../../../reference-analysis/GRAFT_CONTRACT_VERIFICATION.json');
writeFileSync(reportPath, JSON.stringify(report, (_, v) => typeof v === 'bigint' ? v.toString() : v, 2) + '\n');
console.log(`PASS: Solidity compilation, 24,576 mask/reference comparisons, ${report.exhaustiveOutcomeCalls} actual contract outcomes, ${report.quoteFixtures} quotes, ${report.invalidCases} invalid data cases, and four real local VRF sessions.\nReport: ${reportPath}`);

