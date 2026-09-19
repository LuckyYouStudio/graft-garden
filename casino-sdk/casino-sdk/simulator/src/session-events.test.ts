import assert from 'node:assert/strict';
import { test } from 'node:test';
import { encodeAbiParameters, encodeEventTopics, type Hex, type Log, type PublicClient } from 'viem';
import { casinoSessionEventsAbi } from './casino-abi';
import { createSessionEventFeed, type CasinoSessionChainEvent } from './session-events';
import { createSessionStore } from './session-store';

const proxy = '0x0000000000000000000000000000000000000010';
const game = '0x0000000000000000000000000000000000000011';
const player = '0x0000000000000000000000000000000000000012';
const vault = '0x0000000000000000000000000000000000000013';
const zeroWord = `0x${'00'.repeat(32)}` as Hex;

function deferred<T>() {
  let resolve!: (value: T) => void;
  const promise = new Promise<T>(accept => { resolve = accept; });
  return { promise, resolve };
}

function historyLogs(): Log[] {
  const opening = {
    address: proxy, blockHash: zeroWord, blockNumber: 1n, transactionHash: `0x${'01'.repeat(32)}`,
    logIndex: 0, transactionIndex: 0, removed: false,
    topics: encodeEventTopics({ abi: casinoSessionEventsAbi, eventName: 'CasinoSessionOpened', args: { sessionId: 7n, game, player } }),
    data: encodeAbiParameters([{ type: 'address' }, { type: 'uint256' }], [vault, 100n]),
  } as Log;
  const settlement = {
    ...opening, blockNumber: 2n, transactionHash: `0x${'02'.repeat(32)}`,
    topics: encodeEventTopics({ abi: casinoSessionEventsAbi, eventName: 'CasinoSessionSettled', args: { sessionId: 7n, game, player } }),
    data: encodeAbiParameters([{ type: 'uint8' }, { type: 'uint256' }, { type: 'bytes32' }, { type: 'bytes' }], [3, 152n, zeroWord, '0x1234']),
  } as Log;
  return [opening, settlement];
}

const nextTask = () => new Promise<void>(resolve => setImmediate(resolve));

test('history waits for every block then publishes final rows without intermediate microtask snapshots', async () => {
  const settlementBlock = deferred<{ timestamp: bigint }>();
  const delivered: CasinoSessionChainEvent[] = [];
  const flashblocks: CasinoSessionChainEvent[] = [];
  const observedPhases: number[] = [];
  const store = createSessionStore(31337);
  const client = {
    getBlockNumber: async () => 2n,
    getLogs: async () => historyLogs(),
    getBlock: async ({ blockNumber }: { blockNumber: bigint }) => blockNumber === 2n ? settlementBlock.promise : { timestamp: 100n },
  } as unknown as PublicClient;
  const feed = createSessionEventFeed({ publicClient: client, proxy, flashblockLagMs: () => 0, indexerLagMs: () => 5000 });
  feed.subscribeIndexed(event => { delivered.push(event); store.applyEvent(event); });
  feed.subscribeFlashblock(event => flashblocks.push(event));
  store.subscribe(() => queueMicrotask(() => {
    observedPhases.push(store.listByPlayerAndGame(player, game)[0]!.phase);
  }));
  try {
    await nextTask();
    assert.equal(delivered.length, 0, 'a partial historical round must not escape during timestamp RPC');
    settlementBlock.resolve({ timestamp: 101n });
    await nextTask();
    assert.deepEqual(delivered.map(event => event.eventName), ['CasinoSessionOpened', 'CasinoSessionSettled']);
    assert.deepEqual(observedPhases, [3, 3]);
    assert.equal(store.listByPlayerAndGame(player, game)[0]!.payout, '152');
    assert.deepEqual(flashblocks, [], 'history is indexed-only and bypasses configured live lag');
  } finally {
    feed.stop();
  }
});

test('stopping while history normalizes never publishes the abandoned replay', async () => {
  const block = deferred<{ timestamp: bigint }>();
  const delivered: CasinoSessionChainEvent[] = [];
  let blockCalls = 0;
  const logs = historyLogs();
  logs[1] = { ...logs[1]!, blockNumber: 1n };
  const client = {
    getBlockNumber: async () => 1n,
    getLogs: async () => logs,
    getBlock: async () => { blockCalls++; return block.promise; },
  } as unknown as PublicClient;
  const feed = createSessionEventFeed({ publicClient: client, proxy, flashblockLagMs: () => 0, indexerLagMs: () => 0 });
  feed.subscribeIndexed(event => delivered.push(event));
  await nextTask();
  assert.equal(blockCalls, 1, 'events from the same block share a timestamp lookup');
  feed.stop();
  block.resolve({ timestamp: 100n });
  await nextTask();
  assert.deepEqual(delivered, []);
});
