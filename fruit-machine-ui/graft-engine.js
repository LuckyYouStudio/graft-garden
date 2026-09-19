(function (root) {
  'use strict';

  // The standalone model mirrors GraftGardenGame.sol. Three independent 3-bit
  // winds light four consecutive nodes on an eight-node ring. A lane follows
  // one node per season; the graft layout remaps those nodes between seasons.
  var MODES = Object.freeze({
    harvest: Object.freeze({ id: 'harvest', h2: 38, h3: 80, label: '稳态收成', labelEn: 'Harvest' }),
    bloom: Object.freeze({ id: 'bloom', h2: 0, h3: 194, label: '共振绽放', labelEn: 'Bloom' }),
  });
  var LAYOUTS = Object.freeze({
    trellis: Object.freeze({ id: 'trellis', label: '格架', labelEn: 'Trellis' }),
    graft: Object.freeze({ id: 'graft', label: '嫁接', labelEn: 'Graft' }),
  });
  var LANES = Object.freeze([
    { id: 'root', sprite: 'sprite-bar', label: '根须', labelEn: 'Root' },
    { id: 'bud', sprite: 'sprite-seven', label: '花芽', labelEn: 'Bud' },
    { id: 'starfruit', sprite: 'sprite-star', label: '星果', labelEn: 'Starfruit' },
    { id: 'melon', sprite: 'sprite-watermelon', label: '瓜藤', labelEn: 'Melon' },
    { id: 'bellflower', sprite: 'sprite-bell', label: '铃兰', labelEn: 'Bellflower' },
    { id: 'lemon', sprite: 'sprite-lemon', label: '柠枝', labelEn: 'Lemon' },
    { id: 'orange', sprite: 'sprite-orange', label: '橙枝', labelEn: 'Orange' },
    { id: 'apple', sprite: 'sprite-apple', label: '苹果', labelEn: 'Apple' },
  ]);
  function pathNode(layout, lane, season) {
    if (layout === 'trellis' || season === 0) return lane;
    if (season === 1) return (lane % 4) * 2 + Math.floor(lane / 4);
    return (lane % 2) * 4 + Math.floor(lane / 2);
  }
  function isLit(node, wind) { return ((node + 8 - wind) & 7) < 4; }
  function payoutFor(mode, hits, stake) {
    var n = BigInt(stake || 0);
    if (n < 0n || n % 25n !== 0n) throw new RangeError('Lane stake must be a nonnegative multiple of 25 base units');
    if (mode !== 'harvest' && mode !== 'bloom') throw new RangeError('Invalid mode');
    if (hits === 2) return n * BigInt(MODES[mode].h2) / 25n;
    if (hits === 3) return n * BigInt(MODES[mode].h3) / 25n;
    return 0n;
  }
  function resolve(winds, stakes, mode, layout) {
    if (!MODES[mode] || !LAYOUTS[layout]) throw new RangeError('Invalid mode or layout');
    if (!Array.isArray(winds) || winds.length !== 3 || winds.some(v => !Number.isInteger(v) || v < 0 || v > 7)) throw new RangeError('Three valid winds required');
    if (!Array.isArray(stakes) || stakes.length !== 8) throw new RangeError('Eight stakes required');
    var selectedMode = mode, selectedLayout = layout, safeWinds = winds.slice();
    var hits = [], paths = [], payout = 0n;
    for (var lane = 0; lane < 8; lane += 1) {
      var laneHits = 0, lanePath = [];
      for (var season = 0; season < 3; season += 1) {
        var node = pathNode(selectedLayout, lane, season);
        var lit = isLit(node, safeWinds[season]);
        lanePath.push({ season: season, node: node, lit: lit });
        if (lit) laneHits += 1;
      }
      hits.push(laneHits); paths.push(lanePath);
      payout += payoutFor(selectedMode, laneHits, stakes && stakes[lane] || 0);
    }
    return { winds: safeWinds, hits: hits, paths: paths, payout: payout, mode: selectedMode, layout: selectedLayout };
  }
  function randomWinds(randomInt) {
    if (typeof randomInt !== 'function') throw new TypeError('Random source required');
    return [randomInt(8), randomInt(8), randomInt(8)];
  }
  function trackNodes() {
    return Array.from({ length: 24 }, function (_, index) {
      return { season: Math.floor(index / 8), node: index % 8 };
    });
  }
  root.GraftEngine = Object.freeze({ VERSION: 1, RTP_BPS: 9700, MODES: MODES, LAYOUTS: LAYOUTS, LANES: LANES, pathNode: pathNode, isLit: isLit, payoutFor: payoutFor, resolve: resolve, randomWinds: randomWinds, TRACK: trackNodes() });
  if (typeof module !== 'undefined' && module.exports) module.exports = root.GraftEngine;
})(typeof window !== 'undefined' ? window : globalThis);
