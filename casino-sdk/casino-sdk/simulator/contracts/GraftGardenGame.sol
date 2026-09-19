// SPDX-License-Identifier: MIT
pragma solidity ^0.8.30;

import { ICasinoGameV2, SessionContext, SessionPhase, StepResult } from './ICasinoGameV2.sol';

/// @title Graft Garden (Orchard Resonance)
/// @notice A three-season, three-node fruit-path game for the Chain casino SDK.
///
/// Each lane is a path root -> bloom -> harvest.  In every season a uniformly
/// selected wind (0..7) lights four consecutive nodes on an eight-node ring.
/// A lane's hit count is the number of its path nodes lit in the three seasons.
/// The 24 visible nodes therefore describe the outcome, but no single classic
/// "stop on a paying square" outcome is copied.
contract GraftGardenGame is ICasinoGameV2 {
  uint256 private constant WAD = 1e18;
  uint256 private constant RTP_BPS = 9_700;
  uint256 private constant SEASONS = 3;
  uint256 private constant WINDS = 8;
  uint256 private constant OUTCOMES = 512; // 8 ** 3
  uint8 private constant VERSION = 1;
  uint8 private constant MODE_HARVEST = 0;
  uint8 private constant MODE_BLOOM = 1;
  uint8 private constant LAYOUT_TRELLIS = 0;
  uint8 private constant LAYOUT_GRAFT = 1;
  uint256 private constant STAKE_UNIT = 25;

  error InvalidGameData();
  error InvalidAction();

  struct Round {
    uint8 mode;
    uint8 layoutId;
    uint256[8] stakes;
  }

  function quoteCaps(uint256 wager, bytes calldata data)
    external
    pure
    override
    returns (uint256 maxEscrowStake, uint256 maxReservedProfit)
  {
    Round memory round = _decode(wager, data);
    (uint256 maxPayout,) = _enumerate(round);
    maxEscrowStake = wager;
    maxReservedProfit = maxPayout > wager ? maxPayout - wager : 0;
  }

  function quoteRiskParams(uint256 wager, bytes calldata data)
    external
    pure
    override
    returns (
      uint256 maxPayout,
      uint256 probabilityWad,
      uint256 expectedPayout,
      uint256 subJackpotVarianceScaled
    )
  {
    Round memory round = _decode(wager, data);
    uint256 topCount;
    (maxPayout, topCount) = _enumerate(round);
    probabilityWad = (topCount * WAD) / OUTCOMES;
    expectedPayout = (wager * RTP_BPS) / 10_000;
    subJackpotVarianceScaled = 0;
  }

  function onSessionStart(SessionContext calldata ctx)
    external
    pure
    override
    returns (StepResult memory result)
  {
    Round memory round = _decode(ctx.wagerBase, ctx.gameData);
    (uint256 maxPayout,) = _enumerate(round);
    uint8[3] memory pendingSeasons;
    uint8[8] memory pendingHits;
    for (uint256 i; i < 3; ++i) pendingSeasons[i] = type(uint8).max;
    for (uint256 i; i < 8; ++i) pendingHits[i] = type(uint8).max;
    result.newGameState = abi.encode(VERSION, round.mode, round.layoutId, pendingSeasons, pendingHits);
    result.escrowDelta = 0;
    result.reservedProfitDelta = int256(maxPayout > ctx.wagerBase ? maxPayout - ctx.wagerBase : 0);
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
    Round memory round = _decode(ctx.wagerBase, ctx.gameData);
    uint8[3] memory seasons;
    uint8[8] memory hits;
    uint256 bits = uint256(randomness);
    for (uint256 season; season < 3; ++season) {
      seasons[season] = uint8(bits & 7); // 3 bits: exactly uniform over 0..7.
      bits >>= 3;
    }
    uint256 payout;
    for (uint256 lane; lane < 8; ++lane) {
      uint8 hitCount;
      for (uint256 season; season < 3; ++season) {
        uint8 node = _pathNode(round.layoutId, uint8(lane), uint8(season));
        uint8 distance = uint8((uint256(node) + 8 - seasons[season]) & 7);
        if (distance < 4) ++hitCount;
      }
      hits[lane] = hitCount;
      payout += _lanePayout(round.mode, hitCount, round.stakes[lane]);
    }
    result.newGameState = abi.encode(VERSION, round.mode, round.layoutId, seasons, hits);
    result.escrowDelta = 0;
    result.reservedProfitDelta = 0;
    result.nextPhase = SessionPhase.SETTLED;
    result.requestRandomnessNow = false;
    result.payout = payout;
  }

  function quoteForfeitPayout(SessionContext calldata) external pure override returns (uint256) {
    return 0;
  }

  function _decode(uint256 wager, bytes calldata data) private pure returns (Round memory round) {
    uint8 version;
    (version, round.mode, round.layoutId, round.stakes) = abi.decode(data, (uint8, uint8, uint8, uint256[8]));
    if (version != VERSION || (round.mode != MODE_HARVEST && round.mode != MODE_BLOOM)) revert InvalidGameData();
    if (round.layoutId != LAYOUT_TRELLIS && round.layoutId != LAYOUT_GRAFT) revert InvalidGameData();
    uint256 total;
    for (uint256 i; i < 8; ++i) {
      uint256 stake = round.stakes[i];
      if (stake > type(uint128).max || stake % STAKE_UNIT != 0) revert InvalidGameData();
      total += stake;
    }
    if (total == 0 || total != wager || total > type(uint128).max / 16) revert InvalidGameData();
  }

  function _enumerate(Round memory round) private pure returns (uint256 maxPayout, uint256 topCount) {
    // Payout is linear in the stakes. Precompute all lane-subset stakes once,
    // then evaluate each wind triple using its exactly-two/exactly-three masks.
    // _decode guarantees divisibility by 25, so this is exactly _lanePayout,
    // with no aggregate-rounding discrepancy and no 512 * 8 inner lane loop.
    uint256[256] memory units;
    for (uint256 lane; lane < 8; ++lane) {
      uint256 bit = 1 << lane;
      uint256 stakeUnits = round.stakes[lane] / STAKE_UNIT;
      for (uint256 subset; subset < bit; ++subset) {
        units[subset | bit] = units[subset] + stakeUnits;
      }
    }
    uint8[8] memory season1Masks;
    uint8[8] memory season2Masks;
    for (uint8 wind; wind < 8; ++wind) {
      uint8 mask = _baseMask(wind);
      season1Masks[wind] = round.layoutId == LAYOUT_GRAFT ? _graftBloomMask(mask) : mask;
      season2Masks[wind] = round.layoutId == LAYOUT_GRAFT ? _graftHarvestMask(mask) : mask;
    }
    for (uint256 packed; packed < OUTCOMES; ++packed) {
      uint8 mask0 = _baseMask(uint8(packed & 7));
      uint8 mask1 = season1Masks[(packed >> 3) & 7];
      uint8 mask2 = season2Masks[(packed >> 6) & 7];
      uint8 allThree = mask0 & mask1 & mask2;
      uint256 payout;
      if (round.mode == MODE_HARVEST) {
        uint8 exactlyTwo = ((mask0 & mask1) | (mask0 & mask2) | (mask1 & mask2)) ^ allThree;
        payout = units[exactlyTwo] * 38 + units[allThree] * 80;
      } else {
        payout = units[allThree] * 194;
      }
      if (payout > maxPayout) {
        maxPayout = payout;
        topCount = 1;
      } else if (payout == maxPayout) {
        ++topCount;
      }
    }
  }

  /// @dev Four adjacent nodes on an eight-node ring, represented as lane bits.
  function _baseMask(uint8 wind) private pure returns (uint8) {
    return uint8((uint16(0x0f) << wind) | (uint16(0x0f) >> (8 - wind)));
  }

  // Graft bloom path maps lane -> node [0,2,4,6,1,3,5,7].
  function _graftBloomMask(uint8 nodeMask) private pure returns (uint8) {
    return uint8(
      (nodeMask & 1) |
      ((nodeMask & 4) >> 1) |
      ((nodeMask & 16) >> 2) |
      ((nodeMask & 64) >> 3) |
      ((nodeMask & 2) << 3) |
      ((nodeMask & 8) << 2) |
      ((nodeMask & 32) << 1) |
      (nodeMask & 128)
    );
  }

  // Graft harvest path maps lane -> node [0,4,1,5,2,6,3,7].
  function _graftHarvestMask(uint8 nodeMask) private pure returns (uint8) {
    return uint8(
      (nodeMask & 1) |
      ((nodeMask & 2) << 1) |
      ((nodeMask & 4) << 2) |
      ((nodeMask & 8) << 3) |
      ((nodeMask & 16) >> 3) |
      ((nodeMask & 32) >> 2) |
      ((nodeMask & 64) >> 1) |
      (nodeMask & 128)
    );
  }

  function _lanePayout(uint8 mode, uint8 hits, uint256 stake) private pure returns (uint256) {
    if (mode == MODE_HARVEST) {
      if (hits == 2) return (stake * 38) / 25;
      if (hits == 3) return (stake * 80) / 25;
    } else if (hits == 3) {
      return (stake * 194) / 25;
    }
    return 0;
  }

  function _pathNode(uint8 layoutId, uint8 lane, uint8 season) private pure returns (uint8) {
    if (layoutId == LAYOUT_TRELLIS) return lane;
    if (season == 0) return lane;
    if (season == 1) return uint8((uint256(lane % 4) * 2) + (lane / 4));
    return uint8(uint256(lane % 2) * 4 + (lane / 2));
  }
}
