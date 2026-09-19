const assert = require('node:assert/strict');
const engine = require('./engine.js');

assert.deepEqual(engine.SYMBOLS.map((s) => s.id), [
  'bar', 'seven', 'star', 'watermelon', 'bell', 'lemon', 'orange', 'apple'
]);
assert.equal(engine.TRACK.length, 24);
assert.equal(engine.CELL_WEIGHTS.length, 24);
assert.equal(engine.TOTAL_CELL_WEIGHT, engine.CELL_WEIGHTS.reduce((sum, weight) => sum + weight, 0));
assert.deepEqual(engine.DEMO_LUCKY_WEIGHTS, { eat: 15, send: 55, scatter: 20, fortune: 10 });

// Video bet example: [BAR, 77, STAR, WATERMELON, BELL, LEMON, ORANGE, APPLE].
const videoBets = [1, 30, 32, 34, 1, 1, 1, 1];
assert.equal(engine.totalBet(videoBets), 101);
assert.equal(engine.settle(14, videoBets).payout, 90); // 77 x3
assert.equal(engine.settle(5, videoBets).payout, 3); // APPLE x3
assert.equal(engine.settle(3, videoBets).payout, 120); // BAR
assert.equal(engine.settle(9, videoBets).payout, 0); // Lucky without targets = no hit

// Normal results have a single hit and the exact track multiplier.
const normal = engine.resolveRound(14, videoBets, () => 0);
assert.deepEqual(normal.mode, { id: 'normal', label: '普通开奖' });
assert.equal(normal.targetIndex, 14);
assert.equal(normal.bonus, false);
assert.deepEqual(normal.hits.map((h) => h.index), [14]);
assert.equal(normal.payout, 90);

// Lucky mode boundaries use the explicitly-labelled local demo weights.
assert.equal(engine.sampleLuckyMode(() => 0).id, 'eat');
assert.equal(engine.sampleLuckyMode(() => 14).id, 'eat');
assert.equal(engine.sampleLuckyMode(() => 15).id, 'send');
assert.equal(engine.sampleLuckyMode(() => 69).id, 'send');
assert.equal(engine.sampleLuckyMode(() => 70).id, 'scatter');
assert.equal(engine.sampleLuckyMode(() => 89).id, 'scatter');
assert.equal(engine.sampleLuckyMode(() => 90).id, 'fortune');
assert.equal(engine.sampleLuckyMode(() => 99).id, 'fortune');

// makeLuckyIndices is bounded partial Fisher-Yates: constant random cannot loop,
// and each selected track cell is unique while symbols may repeat.
assert.deepEqual(engine.makeLuckyIndices(() => 0, { id: 'eat' }), []);
for (const [id, minCount, maxCount] of [['send', 1, 3], ['scatter', 5, 5], ['fortune', 8, 8]]) {
  const indices = engine.makeLuckyIndices(() => 0, { id });
  assert.equal(indices.length >= minCount && indices.length <= maxCount, true);
  assert.equal(new Set(indices).size, indices.length);
  assert.equal(indices.every((i) => engine.TRACK[i].kind === 'symbol'), true);
}
const spread = engine.makeLuckyIndices(() => 0, { id: 'fortune' });
for (let i = 1; i < spread.length; i += 1) {
  const distance = Math.abs(spread[i] - spread[i - 1]);
  assert.notEqual(distance, 1);
  assert.notEqual(distance, engine.TRACK.length - 1);
}
assert.throws(() => engine.makeLuckyIndices(() => 0, { id: 'unknown' }), /Unknown Lucky mode/);
const luckyRound = engine.resolveRound(9, videoBets, (limit) => limit - 1);
assert.equal(luckyRound.bonus, true);
assert.equal(luckyRound.mode.id, 'fortune'); // 99 first roll; later rolls pick cells
assert.equal(new Set(luckyRound.hits.map((h) => h.index)).size, luckyRound.hits.length);
assert.equal(luckyRound.payout, luckyRound.hits.reduce((sum, h) => sum + h.payout, 0));

// Explicit settle Lucky targets can share symbols but never the same cell.
const multi = engine.settle(9, videoBets, [0, 3, 4, 5]);
assert.equal(multi.hits.length, 4);
assert.equal(multi.payout, multi.hits.reduce((sum, h) => sum + h.payout, 0));
assert.throws(() => engine.settle(9, videoBets, [0, 0]), /unique/);
assert.throws(() => engine.settle(9, videoBets, [9]), /ordinary/);
assert.equal(engine.sampleIndex(() => 0), 0);
assert.equal(engine.sampleIndex(() => engine.TOTAL_CELL_WEIGHT - 1), 23);
assert.throws(() => engine.sampleIndex(() => engine.TOTAL_CELL_WEIGHT), /\[0, limit\)/);

// Risk game demo: small=1..7, big=8..14, win returns 2x and loss 0.
assert.deepEqual(engine.resolveRisk(10, 'small', 1), { won: true, number: 1, side: 'small', payout: 20 });
assert.deepEqual(engine.resolveRisk(10, 'big', 14), { won: true, number: 14, side: 'big', payout: 20 });
assert.deepEqual(engine.resolveRisk(10, 'small', 14), { won: false, number: 14, side: 'small', payout: 0 });
assert.deepEqual(engine.resolveRisk(10, 'big', 7), { won: false, number: 7, side: 'big', payout: 0 });
for (const args of [[0, 'small', 1], [-1, 'small', 1], [1.5, 'small', 1], [1, 'mid', 1], [1, 'small', 0], [1, 'small', 15], [Number.MAX_SAFE_INTEGER, 'big', 14]]) {
  assert.throws(() => engine.resolveRisk(...args));
}

// Transfers preserve the total, clamp to available funds, and reject invalid input.
let funds = { wealth: 10, bonus: 3 };
let moved = engine.transferFunds(funds, 'toBonus');
assert.deepEqual(moved, { wealth: 9, bonus: 4, moved: 1 });
assert.equal(moved.wealth + moved.bonus, funds.wealth + funds.bonus);
assert.deepEqual(engine.transferFunds(funds, 'toBonus', 99), { wealth: 0, bonus: 13, moved: 10 });
assert.deepEqual(engine.transferFunds(funds, 'toWealth', 99), { wealth: 13, bonus: 0, moved: 3 });
assert.deepEqual(engine.transferFunds(funds, 'toBonus', 0), { wealth: 10, bonus: 3, moved: 0 });
for (const args of [[funds, 'bad', 1], [funds, 'toBonus', -1], [funds, 'toBonus', 1.2], [{ wealth: -1, bonus: 0 }, 'toBonus', 1], [{ wealth: 1, bonus: 1.5 }, 'toBonus', 1]]) {
  assert.throws(() => engine.transferFunds(...args));
}

console.log('engine tests passed');
