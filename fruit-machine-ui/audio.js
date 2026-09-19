(function (root, factory) {
  if (typeof module === 'object' && module.exports) module.exports = factory;
  else root.FruitAudio = factory({ global: root });
})(typeof self !== 'undefined' ? self : this, function (options) {
  'use strict';
  options = options || {};
  var host = options.global || (typeof window !== 'undefined' ? window : {});
  var AudioCtor = options.AudioContext || host.AudioContext;
  var ctx = null; var master = null; var muted = false; var volume = 0.55;
  var storage = host && host.localStorage;
  try { muted = storage && storage.getItem('fruitAudioMuted') === '1'; volume = Number(storage && storage.getItem('fruitAudioVolume') || 0.55); } catch (_) {}

  function ensure() {
    if (!AudioCtor) return null;
    if (!ctx) { ctx = new AudioCtor(); master = ctx.createGain(); master.gain.value = muted ? 0 : volume; master.connect(ctx.destination); }
    if (ctx.state === 'suspended' && ctx.resume) ctx.resume().catch(function () {});
    return ctx;
  }
  function tone(freq, duration, type, gain, delay) {
    var ac = ensure(); if (!ac || muted) return false;
    var start = ac.currentTime + (delay || 0); var osc = ac.createOscillator(); var amp = ac.createGain();
    osc.type = type || 'square'; osc.frequency.setValueAtTime(freq, start); amp.gain.setValueAtTime(0.0001, start);
    amp.gain.exponentialRampToValueAtTime(Math.max(0.0001, gain || 0.08), start + 0.008);
    amp.gain.exponentialRampToValueAtTime(0.0001, start + duration); osc.connect(amp); amp.connect(master); osc.start(start); osc.stop(start + duration + 0.02); return true;
  }
  function chord(notes, gap, type, gain) { var played = false; notes.forEach(function (note, i) { played = tone(note, 0.16, type || 'square', gain || 0.09, i * (gap || 0.06)) || played; }); return played; }
  function unlock() { var ac = ensure(); if (!ac) return Promise.resolve(false); return ac.resume ? ac.resume().then(function () { return true; }).catch(function () { return false; }) : Promise.resolve(true); }
  function click() { return tone(720, 0.035, 'square', 0.045); }
  function bet() { return chord([875, 1175], 0.035, 'square', 0.055); }
  function start() { return chord([220, 330, 440], 0.05, 'square', 0.06); }
  function tick(index, progress) { if (typeof index === 'object') { progress = index.progress; index = index.index; } var p = Number(progress) || 0; return tone(807 + Math.min(280, p * 280), 0.038, 'square', 0.04); }
  function stop() { return chord([538, 807, 1077], 0.07, 'triangle', 0.07); }
  function win(payload) { var mul = payload && payload.multiplier || 1; return mul >= 20 ? chord([523, 659, 784, 1047, 1319], 0.075, 'square', 0.11) : chord([523, 659, 784], 0.08, 'triangle', 0.09); }
  function lose() { return tone(220, 0.22, 'sawtooth', 0.05); }
  function lucky(mode) { return mode && mode.id === 'eat' ? tone(440, 0.4, 'sawtooth', 0.08) : chord([495, 980, 1486, 1981], 0.09, 'square', 0.1); }
  function reveal(index, count) { var played = false; for (var i = 0; i < (count || 1); i += 1) played = tone(500 + (i % 4) * 180, 0.08, 'square', 0.08, i * 0.16) || played; return played; }
  function transfer(direction) { return chord(direction === 'toBonus' ? [330, 495, 660] : [660, 495, 330], 0.06, 'triangle', 0.07); }
  function riskStart() { return tone(495, 0.08, 'square', 0.06); }
  function riskWin() { return chord([523, 659, 784, 1047], 0.07, 'square', 0.1); }
  function riskLose() { return chord([330, 247, 196], 0.08, 'sawtooth', 0.06); }
  function setMuted(value) { muted = Boolean(value); try { if (storage) storage.setItem('fruitAudioMuted', muted ? '1' : '0'); } catch (_) {} if (master) master.gain.value = muted ? 0 : volume; return true; }
  function setVolume(value) { volume = Math.max(0, Math.min(1, Number(value) || 0)); try { if (storage) storage.setItem('fruitAudioVolume', String(volume)); } catch (_) {} if (master && !muted) master.gain.value = volume; return volume; }
  function getState() { return { muted: muted, volume: volume, supported: Boolean(AudioCtor) }; }
  function stopAll() { if (ctx && ctx.close) ctx.close().catch(function () {}); ctx = null; master = null; return true; }
  return { TICK_FREQS: [807, 538, 1087], LUCKY_FREQS: [495, 980, 1486, 1981], unlock: unlock, click: click, bet: bet, start: start, tick: tick, stop: stop, win: win, lose: lose, lucky: lucky, reveal: reveal, transfer: transfer, riskStart: riskStart, riskWin: riskWin, riskLose: riskLose, setMuted: setMuted, setVolume: setVolume, getState: getState, stopAll: stopAll };
});

if (typeof module === 'object' && module.exports) {
  module.exports.TICK_FREQS = [807, 538, 1087];
  module.exports.LUCKY_FREQS = [495, 980, 1486, 1981];
}
