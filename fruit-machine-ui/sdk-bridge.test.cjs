const assert = require('node:assert/strict');
const fs = require('node:fs');
const vm = require('node:vm');
const path = require('node:path');
const { encodeAbiParameters, parseAbiParameters } = require('../casino-sdk/casino-sdk/node_modules/viem');
const source = fs.readFileSync(path.join(__dirname, 'sdk-bridge.js'), 'utf8');
const dataAbi = parseAbiParameters('uint8,uint8,uint8,uint256[8]');
const stateAbi = parseAbiParameters('uint8,uint8,uint8,uint8[3],uint8[8]');
function environment(embedded = false) {
  const timers = new Set();
  const context = { console, URL, BigInt, document: { referrer: '' },
    setTimeout(fn, ms) { const id = setTimeout(() => { timers.delete(id); fn(); }, ms); timers.add(id); return id; },
    clearTimeout(id) { timers.delete(id); clearTimeout(id); } };
  context.window = context;
  context.parent = embedded ? {} : context;
  vm.runInNewContext(source, context);
  return { api: context.FruitCasinoBridge, timers };
}
const plain = value => JSON.parse(JSON.stringify(value));
const state = (mode = 0, layout = 0, seasons = [0,0,0], hits = [3,3,3,3,0,0,0,0]) => encodeAbiParameters(stateAbi, [1, mode, layout, seasons, hits]);
const pendingState = state(0, 0, [255,255,255], Array(8).fill(255));
async function main() {
  const { api } = environment();
  const stakes = [25n,50n,0n,100n,125n,150n,175n,200n];
  const encoded = api.encodeGameData(stakes, { mode: 1, layoutId: 1 });
  assert.equal(encoded, encodeAbiParameters(dataAbi, [1,1,1,stakes]), 'Encoding must match the standard ABI encoder');
  const decoded = api.decodeGameData(encoded);
  assert.deepEqual(plain(decoded.stakes), stakes.map(String));
  assert.equal(decoded.wager, '825');
  assert.equal(decoded.mode, 1);
  assert.equal(decoded.layoutId, 1);
  const huge = [100000000000000000000n,0n,0n,0n,0n,0n,0n,0n];
  assert.equal(api.decodeGameData(api.encodeGameData(huge)).stakes[0], String(huge[0]), 'Must preserve token base-unit precision');
  for (const values of [Array(8).fill(0), [1,0,0,0,0,0,0,0], [25,0], [Number.MAX_SAFE_INTEGER + 1,0,0,0,0,0,0,0], [-25,0,0,0,0,0,0,0], ['2.5',0,0,0,0,0,0,0]]) assert.throws(() => api.encodeGameData(values));
  assert.throws(() => api.encodeGameData(stakes, { mode: 2 }));
  assert.throws(() => api.encodeGameData(stakes, { layoutId: 2 }));
  const tooLarge = (((1n << 128n) / 16n) / 25n + 1n) * 25n;
  assert.throws(() => api.encodeGameData([tooLarge,0,0,0,0,0,0,0]));
  assert.equal(api.decodeGameData(encoded + '00'), null);
  assert.equal(api.decodeGameData(encodeAbiParameters(dataAbi, [2,0,0,stakes])), null);
  assert.deepEqual(plain(api.decodeGameState(state()).hits), [3,3,3,3,0,0,0,0]);
  assert.equal(api.decodeGameState(pendingState).pending, true);
  assert.equal(api.decodeGameState(state(0,0,[0,0,0],[2,3,3,3,0,0,0,0])), null, 'Do not accept invented/inconsistent hits');
  assert.equal(api.decodeGameState(state(0,0,[8,0,0])), null);
  assert.equal(api.decodeGameState(state() + '00'), null);
  assert.equal(api.decodeGameState('0x' + '00'.repeat(192)), null, 'Reject the obsolete FruitTiger state');
  for (let layout = 0; layout < 2; layout++) for (let packed = 0; packed < 512; packed++) {
    const seasons = [packed & 7, (packed >> 3) & 7, (packed >> 6) & 7];
    const maps = layout === 0 ? [[0,1,2,3,4,5,6,7],[0,1,2,3,4,5,6,7],[0,1,2,3,4,5,6,7]] : [[0,1,2,3,4,5,6,7],[0,2,4,6,1,3,5,7],[0,4,1,5,2,6,3,7]];
    const litNodes = seasons.map(wind => new Set(Array.from({length:4}, (_, n) => (wind+n)%8)));
    const hits = Array.from({length:8}, (_, lane) => maps.reduce((sum, map, season) => sum + Number(litNodes[season].has(map[lane])), 0));
    assert.ok(api.decodeGameState(state(0,layout,seasons,hits)), `Valid ABI state rejected at layout=${layout}, winds=${seasons}`);
  }
  const direct = api.create();
  assert.equal(direct.getStatus(), 'standalone');
  assert.equal(await direct.connect(), null);
  await assert.rejects(direct.openSession({ wager:'25', stakes:[25,0,0,0,0,0,0,0] }), /not connected/);
  direct.destroy();

  const env = environment(true);
  let guest, connections = 0, disconnects = 0;
  const openedCalls = [], revealCalls = [], cancelCalls = [];
  const host = {
    async openSession(input) { openedCalls.push(input); return { sessionKey:'31337:42', transactionHash:'0x01' }; },
    async revealOutcome(input) { revealCalls.push(input); },
    async cancelStuckRandomness(input) { cancelCalls.push(input); return { transactionHash:'0x02' }; }
  };
  const sdk = { connectGameToHost(methods) { connections++; guest = methods; return { promise:Promise.resolve(host), destroy() { disconnects++; } }; } };
  const bridge = env.api.create({ sdk });
  await Promise.all([bridge.connect(), bridge.connect()]);
  assert.equal(connections, 1, 'Concurrent connects should share one handshake');
  assert.equal(bridge.getStatus(), 'ready');
  await assert.rejects(bridge.openSession({ wager:'25', stakes:[25,0,0,0,0,0,0,0] }), /wallet is not ready/);
  const snapshot = rows => ({ apiVersion:1, wallet:{status:'ready'}, token:{symbol:'TEST',decimals:18}, balances:{smartVaultBalance:'100000000000000000000'}, sessions:{items:rows} });
  const row = (phase, gameState = state()) => ({sessionId:'42',sessionKey:'31337:42',phase,isSettled:phase>=3,payout:'80',raw:{gameState}});
  await guest.setState(snapshot([]));
  await assert.rejects(bridge.openSession({ wager:'50', stakes:[25,0,0,0,0,0,0,0] }), /Wager must equal/);
  const open = await bridge.openSession({wager:'25',stakes:[25,0,0,0,0,0,0,0],mode:0,layoutId:0});
  assert.equal(open.sessionKey,'31337:42');
  assert.equal(openedCalls[0].gameData, encodeAbiParameters(dataAbi,[1,0,0,[25n,0n,0n,0n,0n,0n,0n,0n]]));
  await guest.setState(snapshot([row(1,pendingState)]));
  await assert.rejects(bridge.revealOutcome('42'), /terminal/);
  await bridge.cancelStuckRandomness('42');
  assert.equal(cancelCalls.length,1);
  const waiting1 = bridge.waitForSettlement('31337:42');
  const waiting2 = bridge.waitForSettlement('31337:42');
  assert.equal(env.timers.size,2);
  await guest.setState(snapshot([row(3)]));
  const results = await Promise.all([waiting1,waiting2]);
  assert.equal(results[0].phase,3);
  assert.equal(results[1].outcome.pending,false);
  assert.equal(env.timers.size,0,'All simultaneous waiters must resolve and clear timers');
  await bridge.revealOutcome('42');
  assert.equal(revealCalls.length,1);
  await assert.rejects(bridge.cancelStuckRandomness('42'), /waiting for randomness/);
  assert.equal((await bridge.waitForSettlement('31337:42')).phase,3,'Already settled rows should resolve immediately');
  for (const phase of [4,5]) {
    await guest.setState(snapshot([row(phase,pendingState)]));
    const result = await bridge.waitForSettlement('31337:42');
    assert.equal(result.phase,phase);
    assert.equal(result.outcome,null,'Cancelled/forfeited rounds must not animate a guessed win');
  }
  await guest.setState(snapshot([row(3,pendingState)]));
  await assert.rejects(bridge.waitForSettlement('31337:42'), /invalid Graft Garden/);
  await guest.setState(snapshot([]));
  await assert.rejects(bridge.waitForSettlement('timeout', 5), error => error.code === 'SETTLEMENT_TIMEOUT' && error.sessionKey === 'timeout');
  assert.equal(env.timers.size,0);
  const destroy1 = bridge.waitForSettlement('destroy');
  const destroy2 = bridge.waitForSettlement('destroy');
  const rejected = Promise.all([assert.rejects(destroy1,/destroyed/),assert.rejects(destroy2,/destroyed/)]);
  bridge.destroy();
  await rejected;
  assert.equal(env.timers.size,0,'Destroy must clear pending timers');
  assert.equal(disconnects,1);
  await assert.rejects(bridge.waitForSettlement('destroy'),/destroyed/);
  console.log('sdk-bridge: ABI parity, all 1024 layouts/outcomes, malformed states, wallet/session guards, cancellation, timeout and cleanup passed');
}
main().catch(error => { console.error(error); process.exitCode = 1; });
