// SPDX-License-Identifier: MIT
pragma solidity ^0.8.30;

import { ICasinoGameV2, SessionContext, SessionPhase, StepResult } from './ICasinoGameV2.sol';

/// @notice Single-spin Fruit Tiger ring game. Lucky bonus expansion is kept
/// out of the first production contract so quoteRiskParams remains exactly 94%
/// for the fixed paytable below; the UI demo can still preview Lucky modes.
contract FruitTigerGame is ICasinoGameV2 {
  uint256 private constant BPS = 10_000;
  uint256 private constant WAD = 1e18;
  uint256 private constant TOTAL_WEIGHT = 100_000;
  uint8 private constant VERSION = 1;
  uint8 private constant RING_MODE = 0;

  // Track order: top left-to-right, right top-to-bottom, bottom right-to-left,
  // left bottom-to-top. Symbol ids: BAR, 77, STAR, WATERMELON, BELL, LEMON,
  // ORANGE, APPLE; 255 is Lucky.
  // Values are payout multipliers in basis points: 120x = 1,200,000.
  // Total weight is 100,000. With one unit on each of the 8 lanes, ordinary
  // outcomes contribute exactly 752,000 / (100,000 * 8) = 94% RTP.

  error InvalidGameData();
  error InvalidAction();

  function quoteCaps(uint256 wager, bytes calldata data)
    external
    pure
    override
    returns (uint256 maxEscrowStake, uint256 maxReservedProfit)
  {
    (uint256 total, uint256 maxPayout) = _bounds(wager, data);
    maxEscrowStake = total;
    maxReservedProfit = maxPayout > total ? maxPayout - total : 0;
  }

  function quoteRiskParams(uint256 wager, bytes calldata data)
    external
    pure
    override
    returns (uint256 maxPayout, uint256 probabilityWad, uint256 expectedPayout, uint256 subJackpotVarianceScaled)
  {
    (uint256 total, uint256 bound) = _bounds(wager, data);
    maxPayout = bound;
    uint256[8] memory bets = _decodeBets(data);
    uint256 expectedNumerator;
    uint256 topWeight;
    uint32 topMultiplier;
    for (uint256 i; i < 24; ++i) {
      uint256 payout = _payout(i, bets);
      expectedNumerator += payout * _weight(i);
      if (_multiplier(i) > topMultiplier) {
        topMultiplier = _multiplier(i);
        topWeight = _weight(i);
      }
    }
    expectedPayout = expectedNumerator / TOTAL_WEIGHT;
    probabilityWad = (topWeight * WAD) / TOTAL_WEIGHT;
    subJackpotVarianceScaled = 0;
    total; // keep the decoded total explicit for audit readability
  }

  function onSessionStart(SessionContext calldata ctx)
    external
    pure
    override
    returns (StepResult memory result)
  {
    (uint256 total, uint256 maxPayout) = _bounds(ctx.wagerBase, ctx.gameData);
    result.newGameState = abi.encode(uint8(VERSION), uint8(255), uint8(255), uint32(0), uint8(0), bytes32(0));
    result.escrowDelta = 0;
    result.reservedProfitDelta = int256(maxPayout > total ? maxPayout - total : 0);
    result.nextPhase = SessionPhase.WAITING_RANDOMNESS;
    result.requestRandomnessNow = true;
    result.payout = 0;
  }

  function onPlayerAction(SessionContext calldata, bytes calldata)
    external
    pure
    override
    returns (StepResult memory)
  {
    revert InvalidAction();
  }

  function onRandomness(SessionContext calldata ctx, bytes32 randomness)
    external
    pure
    override
    returns (StepResult memory result)
  {
    uint256[8] memory bets = _decodeBets(ctx.gameData);
    uint8 index = _sampleIndex(randomness);
    uint8 symbol = _symbol(index);
    uint256 payout = _payout(index, bets);
    result.newGameState = abi.encode(VERSION, index, symbol, _multiplier(index), symbol == 255 ? uint8(1) : uint8(0), randomness);
    result.nextPhase = SessionPhase.SETTLED;
    result.requestRandomnessNow = false;
    result.payout = payout;
  }

  function quoteForfeitPayout(SessionContext calldata) external pure override returns (uint256) {
    return 0;
  }

  function _decodeBets(bytes calldata data) private pure returns (uint256[8] memory bets) {
    (uint8 version, uint8 mode, uint256[8] memory decoded) = abi.decode(data, (uint8, uint8, uint256[8]));
    if (version != VERSION || mode != RING_MODE) revert InvalidGameData();
    return decoded;
  }

  function _bounds(uint256 wager, bytes calldata data) private pure returns (uint256 total, uint256 maxPayout) {
    uint256[8] memory bets = _decodeBets(data);
    for (uint256 i; i < 8; ++i) total += bets[i];
    if (total == 0 || total != wager) revert InvalidGameData();
    for (uint256 i; i < 24; ++i) {
      uint256 payout = _payout(i, bets);
      if (payout > maxPayout) maxPayout = payout;
    }
  }

  function _payout(uint256 index, uint256[8] memory bets) private pure returns (uint256) {
    uint8 symbol = _symbol(index);
    if (symbol == 255) return 0;
    return (uint256(bets[symbol]) * _multiplier(index)) / BPS;
  }

  function _sampleIndex(bytes32 randomness) private pure returns (uint8) {
    uint256 value = uint256(randomness);
    uint256 remainder = type(uint256).max % TOTAL_WEIGHT + 1;
    uint256 limit = type(uint256).max - remainder + 1;
    uint256 counter;
    while (value >= limit) {
      value = uint256(keccak256(abi.encode(randomness, ++counter)));
    }
    uint256 draw = value % TOTAL_WEIGHT;
    uint256 cumulative;
    for (uint8 i; i < 24; ++i) {
      cumulative += _weight(i);
      if (draw < cumulative) return i;
    }
    return 23;
  }

  function _symbol(uint256 index) private pure returns (uint8) {
    uint8[24] memory values = [uint8(6),4,0,0,7,7,5,3,3,255,7,6,6,4,1,1,7,5,5,2,2,255,7,4];
    return values[index];
  }

  function _multiplier(uint256 index) private pure returns (uint32) {
    uint32[24] memory values = [uint32(100_000),200_000,500_000,1_200_000,50_000,30_000,150_000,200_000,30_000,0,50_000,30_000,100_000,200_000,30_000,400_000,50_000,30_000,150_000,300_000,30_000,0,50_000,30_000];
    return values[index];
  }

  function _weight(uint256 index) private pure returns (uint32) {
    uint32[24] memory values = [uint32(7500),1666,500,20,6250,6500,2900,1667,6500,240,6250,6500,7500,1667,6500,1000,6250,6500,2900,3000,6500,240,6250,5200];
    return values[index];
  }
}
