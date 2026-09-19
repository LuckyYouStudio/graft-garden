'use strict';

const assert = require('node:assert/strict');
const createFruitAudio = require('./audio.js');

assert.equal(typeof createFruitAudio, 'function');
assert.deepEqual(createFruitAudio.TICK_FREQS, [807, 538, 1087]);
assert.deepEqual(createFruitAudio.LUCKY_FREQS, [495, 980, 1486, 1981]);

const audio = createFruitAudio({ AudioContext: null });
for (const method of [
  'click', 'bet', 'start', 'tick', 'stop', 'win', 'lose', 'lucky', 'reveal',
  'transfer', 'riskStart', 'riskWin', 'riskLose', 'setMuted', 'setVolume',
  'getState', 'stopAll', 'unlock'
]) {
  assert.equal(typeof audio[method], 'function', `${method} should be exposed`);
}

assert.equal(audio.click(), false, 'missing AudioContext should be silent');
assert.equal(audio.tick(4, 0.5), false, 'missing AudioContext should not throw');
assert.equal(audio.start(), false, 'missing AudioContext should not block start');
assert.equal(audio.setMuted(true), true);
assert.equal(audio.setVolume(0.4), 0.4);
assert.equal(audio.getState().muted, true);
assert.equal(audio.getState().volume, 0.4);
assert.equal(audio.stopAll(), true);

audio.unlock().then((unlocked) => {
  assert.equal(unlocked, false, 'unlock resolves false when WebAudio is unavailable');
  console.log('audio tests passed');
}).catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
