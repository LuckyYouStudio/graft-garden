#!/usr/bin/env node
'use strict';

// Independent reference model for Graft Garden. It enumerates all 8^3 wind
// triples and is deliberately separate from Solidity so paytable drift fails
// loudly before a contract is wired into the host.
const assert = require('node:assert/strict');

const MODES = {
  harvest: { h2: 38n, h3: 80n },
  bloom: { h2: 0n, h3: 194n },
};
const DENOM = 25n;
const RTP_BPS = 9700n;

function pathNode(layout, lane, season) {
  if (layout === 'trellis' || season === 0) return lane;
  if (season === 1) return (lane % 4) * 2 + Math.floor(lane / 4);
  return (lane % 2) * 4 + Math.floor(lane / 2);
}

function hitsFor(winds, layout, lane) {
  return winds.reduce((n, wind, season) => {
    const distance = (pathNode(layout, lane, season) + 8 - wind) & 7;
    return n + (distance < 4 ? 1 : 0);
  }, 0);
}

function lanePayout(mode, hits, stake) {
  const table = MODES[mode];
  if (hits === 2) return stake * table.h2 / DENOM;
  if (hits === 3) return stake * table.h3 / DENOM;
  return 0n;
}

function outcomes(stakes, mode, layout) {
  const rows = [];
  for (let a = 0; a < 8; ++a) for (let b = 0; b < 8; ++b) for (let c = 0; c < 8; ++c) {
    const winds = [a, b, c];
    const hits = Array.from({ length: 8 }, (_, lane) => hitsFor(winds, layout, lane));
    const payout = hits.reduce((sum, h, lane) => sum + lanePayout(mode, h, stakes[lane]), 0n);
    rows.push({ winds, hits, payout });
  }
  return rows;
}

function summarize(stakes, mode, layout) {
  const rows = outcomes(stakes, mode, layout);
  const maxPayout = rows.reduce((m, row) => row.payout > m ? row.payout : m, 0n);
  const topCount = rows.filter(row => row.payout === maxPayout).length;
  const wager = stakes.reduce((sum, n) => sum + n, 0n);
  const expected = wager * RTP_BPS / 10000n;
  const averageNumerator = rows.reduce((sum, row) => sum + row.payout, 0n);
  assert.equal(averageNumerator * 10000n, wager * RTP_BPS * 512n,
    `${mode}/${layout}: expected value drift`);
  return {
    wager: String(wager),
    expectedPayout: String(expected),
    maxPayout: String(maxPayout),
    topCount,
    topProbabilityWad: String(BigInt(topCount) * 1000000000000000000n / 512n),
    laneDistributions: Array.from({ length: 8 }, (_, lane) => {
      const counts = [0, 0, 0, 0];
      rows.forEach(row => ++counts[row.hits[lane]]);
      return counts;
    }),
  };
}

// Every allocation is 25 base units so all 38/25, 80/25 and 194/25 payouts
// are integral. These allocations exercise single, sparse and multi-lane risk.
const allocations = [
  [25n, 0n, 0n, 0n, 0n, 0n, 0n, 0n],
  [25n, 50n, 0n, 0n, 0n, 0n, 0n, 0n],
  [25n, 50n, 75n, 100n, 125n, 150n, 175n, 200n],
];

const result = { rtpBps: Number(RTP_BPS), outcomes: 512, modes: {} };
for (const mode of Object.keys(MODES)) {
  result.modes[mode] = {};
  for (const layout of ['trellis', 'graft']) {
    result.modes[mode][layout] = allocations.map(stakes => summarize(stakes, mode, layout));
  }
}

// The single-lane binomial distribution is layout-independent and proves the
// advertised 97% line EV directly.
for (const mode of Object.keys(MODES)) {
  for (const layout of ['trellis', 'graft']) {
    const one = summarize(allocations[2], mode, layout);
    for (const distribution of one.laneDistributions) {
      assert.deepEqual(distribution, [64, 192, 192, 64]);
    }
  }
}

console.log(JSON.stringify(result, null, 2));
