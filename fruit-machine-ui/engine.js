(function (root, factory) {
  if (typeof module === 'object' && module.exports) {
    module.exports = factory();
  } else {
    root.FruitEngine = factory();
  }
})(typeof self !== 'undefined' ? self : this, function () {
  'use strict';

  // The order of this table is also the order used by the eight betting lanes.
  var SYMBOLS = Object.freeze([
    Object.freeze({ id: 'bar', label: 'BAR', multiplier: 120 }),
    Object.freeze({ id: 'seven', label: '7', multiplier: 40 }),
    Object.freeze({ id: 'star', label: 'STAR', multiplier: 30 }),
    Object.freeze({ id: 'watermelon', label: 'WATERMELON', multiplier: 20 }),
    Object.freeze({ id: 'bell', label: 'BELL', multiplier: 20 }),
    Object.freeze({ id: 'lemon', label: 'LEMON', multiplier: 15 }),
    Object.freeze({ id: 'orange', label: 'ORANGE', multiplier: 10 }),
    Object.freeze({ id: 'apple', label: 'APPLE', multiplier: 5 })
  ]);

  var SYMBOL_BY_ID = Object.create(null);
  var SYMBOL_INDEX = Object.create(null);
  SYMBOLS.forEach(function (symbol, index) {
    SYMBOL_BY_ID[symbol.id] = symbol;
    SYMBOL_INDEX[symbol.id] = index;
  });

  function symbolCell(symbol, multiplier) {
    var symbolInfo = SYMBOL_BY_ID[symbol];
    if (!symbolInfo) throw new Error('Unknown track symbol: ' + symbol);
    return Object.freeze({
      symbol: symbol,
      multiplier: multiplier == null ? symbolInfo.multiplier : multiplier,
      kind: 'symbol'
    });
  }

  function luckyCell(side) {
    return Object.freeze({ symbol: 'lucky', multiplier: 0, kind: 'lucky', side: side });
  }

  // Clockwise index 0..23.  The order mirrors the 7/5/7/5 perimeter layout.
  var TRACK = Object.freeze([
    // top, left to right
    symbolCell('orange'), symbolCell('bell'), symbolCell('bar', 50),
    symbolCell('bar'), symbolCell('apple'), symbolCell('apple', 3),
    symbolCell('lemon'),
    // right, top to bottom
    symbolCell('watermelon'), symbolCell('watermelon', 3), luckyCell('right'),
    symbolCell('apple'), symbolCell('orange', 3),
    // bottom, right to left
    symbolCell('orange'), symbolCell('bell'), symbolCell('seven', 3),
    symbolCell('seven'), symbolCell('apple'), symbolCell('lemon', 3),
    symbolCell('lemon'),
    // left, bottom to top
    symbolCell('star'), symbolCell('star', 3), luckyCell('left'),
    symbolCell('apple'), symbolCell('bell', 3)
  ]);

  // Conservative local demo weights. The public versions of this game family
  // do not publish a verified per-cell table; these weights make high prizes
  // rare and keep the demo's expected payout below the previous uniform 1/24
  // behavior. They are not production odds.
  var CELL_WEIGHTS = Object.freeze([
    7500, 1666, 500, 20, 6250, 6500, 2900,
    1667, 6500, 240, 6250, 6500,
    7500, 1667, 6500, 1000, 6250, 6500, 2900,
    3000, 6500, 240, 6250, 5200
  ]);
  var TOTAL_CELL_WEIGHT = CELL_WEIGHTS.reduce(function (sum, weight) { return sum + weight; }, 0);
  var TARGET_RTP_BPS = 9400;

  var ORDINARY_INDICES = Object.freeze(TRACK.reduce(function (indices, cell, index) {
    if (cell.kind === 'symbol') indices.push(index);
    return indices;
  }, []));

  var LUCKY_MODES = Object.freeze([
    Object.freeze({ id: 'eat', label: '吃灯', count: 0 }),
    Object.freeze({ id: 'send', label: '幸运送灯', count: 0 }),
    Object.freeze({ id: 'scatter', label: '仙女散花', count: 5 }),
    Object.freeze({ id: 'fortune', label: '财神赐福', count: 8 })
  ]);

  // Local demo configuration only. These weights are not verified original
  // cabinet probabilities and must not be presented as an official paytable.
  var DEMO_LUCKY_WEIGHTS = Object.freeze({ eat: 15, send: 55, scatter: 20, fortune: 10 });

  var NORMAL_MODE = Object.freeze({ id: 'normal', label: '普通开奖' });

  function assertRandomIntFn(randomIntFn) {
    if (typeof randomIntFn !== 'function') {
      throw new TypeError('randomIntFn must be a function');
    }
  }

  function draw(randomIntFn, limit) {
    assertRandomIntFn(randomIntFn);
    if (!Number.isSafeInteger(limit) || limit <= 0) {
      throw new RangeError('random limit must be a positive integer');
    }
    var value = randomIntFn(limit);
    if (!Number.isSafeInteger(value) || value < 0 || value >= limit) {
      throw new RangeError('randomIntFn must return an integer in [0, limit)');
    }
    return value;
  }

  function validateBets(bets) {
    if (!Array.isArray(bets) || bets.length !== SYMBOLS.length) {
      throw new TypeError('bets must be an array of eight lanes');
    }
    bets.forEach(function (stake, index) {
      if (!Number.isSafeInteger(stake) || stake < 0 || stake > 99) {
        throw new RangeError('bet at lane ' + index + ' must be an integer from 0 to 99');
      }
    });
    var total = bets.reduce(function (sum, stake) { return sum + stake; }, 0);
    if (total <= 0) throw new RangeError('total bet must be greater than zero');
    return total;
  }

  function totalBet(bets) {
    return validateBets(bets);
  }

  function assertTrackIndex(index) {
    if (!Number.isSafeInteger(index) || index < 0 || index >= TRACK.length) {
      throw new RangeError('track index must be an integer from 0 to 23');
    }
  }

  function ordinaryTargets(bonusIndices) {
    if (!Array.isArray(bonusIndices)) throw new TypeError('bonus indices must be an array');
    var seen = Object.create(null);
    return bonusIndices.map(function (target) {
      if (!Number.isSafeInteger(target)) throw new TypeError('bonus index must be an integer');
      assertTrackIndex(target);
      if (TRACK[target].kind !== 'symbol') throw new RangeError('Lucky bonus target must be an ordinary track cell');
      if (seen[target]) throw new RangeError('Lucky bonus targets must be unique');
      seen[target] = true;
      return target;
    });
  }

  function settle(index, bets, bonusIndices) {
    assertTrackIndex(index);
    validateBets(bets);
    var extras = bonusIndices == null ? [] : bonusIndices;
    var cell = TRACK[index];
    if (cell.kind === 'lucky') {
      var targetIndices = ordinaryTargets(extras);
      var luckyHits = targetIndices.map(function (targetIndex) {
        var target = TRACK[targetIndex];
        var targetStake = bets[SYMBOL_INDEX[target.symbol]];
        return { index: targetIndex, symbol: target.symbol, multiplier: target.multiplier, stake: targetStake, payout: targetStake * target.multiplier };
      });
      return {
        payout: luckyHits.reduce(function (sum, item) { return sum + item.payout; }, 0),
        hits: luckyHits,
        bonus: true
      };
    }

    var stake = bets[SYMBOL_INDEX[cell.symbol]];
    var hit = {
      index: index,
      symbol: cell.symbol,
      multiplier: cell.multiplier,
      stake: stake,
      payout: stake * cell.multiplier
    };
    return { payout: hit.payout, hits: [hit], bonus: false };
  }

  function sampleIndex(randomIntFn) {
    var value = draw(randomIntFn, TOTAL_CELL_WEIGHT);
    for (var i = 0; i < CELL_WEIGHTS.length; i += 1) {
      if (value < CELL_WEIGHTS[i]) return i;
      value -= CELL_WEIGHTS[i];
    }
    return TRACK.length - 1;
  }

  function makeBonusIndices(randomIntFn) {
    var ordinaryOffset = draw(randomIntFn, ORDINARY_INDICES.length);
    return [ORDINARY_INDICES[ordinaryOffset]];
  }

  function sampleLuckyMode(randomIntFn) {
    var roll = draw(randomIntFn, 100);
    var cumulative = 0;
    for (var i = 0; i < LUCKY_MODES.length; i += 1) {
      cumulative += DEMO_LUCKY_WEIGHTS[LUCKY_MODES[i].id];
      if (roll < cumulative) return LUCKY_MODES[i];
    }
    throw new Error('Demo Lucky weights must total 100');
  }

  function makeLuckyIndices(randomIntFn, mode) {
    var knownMode = LUCKY_MODES.find(function (candidate) { return mode && candidate.id === mode.id; });
    if (!knownMode) throw new RangeError('Unknown Lucky mode');
    if (knownMode.id === 'eat') return [];
    assertRandomIntFn(randomIntFn);
    var count = knownMode.id === 'send' ? 1 + draw(randomIntFn, 3) : knownMode.count;
    // Partial Fisher-Yates: bounded sampling without replacement, including
    // when an injected test random source always returns the same value.
    var pool = ORDINARY_INDICES.slice();
    var selected = [];
    var adjacent = function (a, b) {
      var distance = Math.abs(a - b);
      return distance === 1 || distance === TRACK.length - 1;
    };
    for (var i = 0; i < count; i += 1) {
      var available = pool.slice(i).filter(function (candidate) {
        return selected.every(function (existing) { return !adjacent(candidate, existing); });
      });
      if (available.length === 0) available = pool.slice(i);
      var chosen = available[draw(randomIntFn, available.length)];
      var offset = pool.indexOf(chosen);
      pool[offset] = pool[i];
      pool[i] = chosen;
      selected.push(chosen);
    }
    return selected;
  }

  function resolveRound(index, bets, randomIntFn) {
    assertTrackIndex(index);
    validateBets(bets);
    var mode = TRACK[index].kind === 'lucky' ? sampleLuckyMode(randomIntFn) : NORMAL_MODE;
    var targets = mode.id === 'normal' ? [] : makeLuckyIndices(randomIntFn, mode);
    var result = settle(index, bets, targets);
    return {
      payout: result.payout,
      hits: result.hits,
      bonus: result.bonus,
      mode: { id: mode.id, label: mode.label },
      targetIndex: index
    };
  }

  function assertCredits(value, label) {
    if (!Number.isSafeInteger(value) || value < 0) {
      throw new RangeError(label + ' must be a nonnegative safe integer');
    }
  }

  // Demo double-or-nothing rule: 1..7 small, 8..14 big. The complete amount
  // is returned at 2x on a win and 0 on a loss; it is not an extra 2x profit.
  function resolveRisk(amount, side, number) {
    assertCredits(amount, 'risk amount');
    if (amount === 0) throw new RangeError('risk amount must be greater than zero');
    if (!Number.isSafeInteger(amount * 2)) throw new RangeError('risk payout exceeds the safe integer range');
    if (side !== 'small' && side !== 'big') throw new RangeError('risk side must be small or big');
    if (!Number.isSafeInteger(number) || number < 1 || number > 14) {
      throw new RangeError('risk number must be an integer from 1 to 14');
    }
    var won = side === (number <= 7 ? 'small' : 'big');
    return { won: won, number: number, side: side, payout: won ? amount * 2 : 0 };
  }

  function transferFunds(balances, direction, amount) {
    if (!balances || typeof balances !== 'object') throw new TypeError('balances must be an object');
    assertCredits(balances.wealth, 'wealth');
    assertCredits(balances.bonus, 'bonus');
    if (!Number.isSafeInteger(balances.wealth + balances.bonus)) {
      throw new RangeError('total credits exceed the safe integer range');
    }
    if (direction !== 'toBonus' && direction !== 'toWealth') {
      throw new RangeError('transfer direction must be toBonus or toWealth');
    }
    if (amount === undefined) amount = 1;
    assertCredits(amount, 'transfer amount');
    var moved = Math.min(amount, direction === 'toBonus' ? balances.wealth : balances.bonus);
    return {
      wealth: balances.wealth + (direction === 'toBonus' ? -moved : moved),
      bonus: balances.bonus + (direction === 'toBonus' ? moved : -moved),
      moved: moved
    };
  }

  return Object.freeze({
    SYMBOLS: SYMBOLS,
    TRACK: TRACK,
    CELL_WEIGHTS: CELL_WEIGHTS,
    TOTAL_CELL_WEIGHT: TOTAL_CELL_WEIGHT,
    TARGET_RTP_BPS: TARGET_RTP_BPS,
    totalBet: totalBet,
    settle: settle,
    sampleIndex: sampleIndex,
    makeBonusIndices: makeBonusIndices,
    LUCKY_MODES: LUCKY_MODES,
    sampleLuckyMode: sampleLuckyMode,
    makeLuckyIndices: makeLuckyIndices,
    DEMO_LUCKY_WEIGHTS: DEMO_LUCKY_WEIGHTS,
    resolveRound: resolveRound,
    resolveRisk: resolveRisk,
    transferFunds: transferFunds
  });
});
