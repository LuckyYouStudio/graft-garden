(function (root) {
  'use strict';
  // The wire protocol matches casino-sdk/src/guest.ts and GraftGardenGame.sol.
  var PHASE = Object.freeze({ NONE: 0, WAITING_RANDOMNESS: 1, WAITING_PLAYER_ACTION: 2, SETTLED: 3, FORFEITED: 4, CANCELLED: 5 });
  var TERMINAL = Object.freeze({ 3: true, 4: true, 5: true });
  var MAX_UINT128 = (1n << 128n) - 1n;
  var MAX_WAGER = MAX_UINT128 / 16n;
  function uint(value, name) {
    if (typeof value === 'number' && (!Number.isSafeInteger(value) || value < 0)) throw new TypeError(name + ' must be a safe unsigned integer');
    if (typeof value !== 'bigint' && typeof value !== 'number' && (typeof value !== 'string' || !/^\d+$/.test(value))) throw new TypeError(name + ' must be an unsigned integer');
    var n = BigInt(value);
    if (n < 0n || n > (1n << 256n) - 1n) throw new RangeError(name + ' must fit uint256');
    return n;
  }
  function selection(value, name) {
    var n = uint(value == null ? 0 : value, name);
    if (n > 1n) throw new RangeError(name + ' must be 0 or 1');
    return Number(n);
  }
  function word(value) { return uint(value, 'ABI word').toString(16).padStart(64, '0'); }
  function readWords(data, count) {
    if (typeof data !== 'string' || !new RegExp('^0x[0-9a-fA-F]{' + count * 64 + '}$').test(data)) return null;
    var words = [];
    for (var i = 0; i < count; i += 1) words.push(BigInt('0x' + data.slice(2 + i * 64, 2 + (i + 1) * 64)));
    return words;
  }
  function validateStakes(stakes) {
    if (!Array.isArray(stakes) || stakes.length !== 8) throw new TypeError('Graft Garden needs exactly eight stakes');
    var total = 0n;
    var values = stakes.map(function (stake) {
      var n = uint(stake, 'stake');
      if (n > MAX_UINT128 || n % 25n !== 0n) throw new RangeError('Each stake must fit uint128 and be a multiple of 25 token base units');
      total += n;
      return n;
    });
    if (total === 0n || total > MAX_WAGER) throw new RangeError('Total stake must be positive and at most uint128.max / 16');
    return { stakes: values, total: total };
  }
  // abi.encode(uint8 version, uint8 mode, uint8 layoutId, uint256[8] stakes)
  function encodeGameData(stakes, options) {
    options = options || {};
    var values = Array.isArray(stakes) ? stakes : stakes && (stakes.stakes || stakes.bets);
    var checked = validateStakes(values);
    return '0x' + [1, selection(options.mode, 'mode'), selection(options.layoutId, 'layoutId')].concat(checked.stakes).map(word).join('');
  }
  function decodeGameData(data) {
    var words = readWords(data, 11);
    if (!words || words[0] !== 1n || words[1] > 1n || words[2] > 1n) return null;
    try {
      var checked = validateStakes(words.slice(3));
      var stakes = checked.stakes.map(String);
      return { schemaVersion: 1, mode: Number(words[1]), layoutId: Number(words[2]), stakes: stakes, bets: stakes.slice(), wager: String(checked.total) };
    } catch (_) { return null; }
  }
  function pathNode(layoutId, lane, season) {
    if (layoutId === 0 || season === 0) return lane;
    return season === 1 ? (lane % 4) * 2 + Math.floor(lane / 4) : (lane % 2) * 4 + Math.floor(lane / 2);
  }
  // abi.encode(uint8 version, uint8 mode, uint8 layoutId, uint8[3] seasons, uint8[8] hits)
  // Reject obsolete schemas and inconsistent hits rather than inventing outcomes.
  function decodeGameState(state) {
    var words = readWords(state, 14);
    if (!words || words[0] !== 1n || words[1] > 1n || words[2] > 1n) return null;
    var pending = words.slice(3).every(function (value) { return value === 255n; });
    if (!pending && (words.slice(3, 6).some(function (value) { return value > 7n; }) || words.slice(6).some(function (value) { return value > 3n; }))) return null;
    var seasons = words.slice(3, 6).map(Number), hits = words.slice(6).map(Number), layoutId = Number(words[2]);
    if (!pending) {
      for (var lane = 0; lane < 8; lane += 1) {
        var expected = seasons.reduce(function (sum, wind, season) { return sum + (((pathNode(layoutId, lane, season) + 8 - wind) & 7) < 4 ? 1 : 0); }, 0);
        if (hits[lane] !== expected) return null;
      }
    }
    return { schemaVersion: 1, mode: Number(words[1]), layoutId: layoutId, seasons: seasons, hits: hits, pending: pending };
  }
  function getOrigin() {
    if (!root.document || !root.document.referrer) return '*';
    try { return new URL(root.document.referrer).origin; } catch (_) { return '*'; }
  }
  function findSdk(options) {
    if (options && options.sdk && typeof options.sdk.connectGameToHost === 'function') return options.sdk;
    var candidates = [root.ChainCasinoSDK, root.CasinoSDK, root.Casino, root.chainCasinoSDK];
    for (var i = 0; i < candidates.length; i += 1) {
      var candidate = candidates[i];
      if (candidate && candidate.guest && typeof candidate.guest.connectGameToHost === 'function') return candidate.guest;
      if (candidate && typeof candidate.connectGameToHost === 'function') return candidate;
    }
    return null;
  }
  function sessionPhase(row) {
    if (row && Number.isInteger(row.phase) && row.phase >= 0 && row.phase <= 5) return row.phase;
    return row && Object.prototype.hasOwnProperty.call(PHASE, row.phaseName) ? PHASE[row.phaseName] : null;
  }
  function terminalResult(row) {
    var phase = sessionPhase(row);
    if (!TERMINAL[phase]) {
      if (row.isSettled) throw new Error('Terminal session is missing a recognized phase');
      return null;
    }
    if (phase !== PHASE.SETTLED) return { row: row, phase: phase, outcome: null };
    var outcome = row.raw && decodeGameState(row.raw.gameState);
    if (!outcome || outcome.pending) throw new Error('Settled session has invalid Graft Garden state');
    if (typeof row.payout !== 'string' || !/^\d+$/.test(row.payout)) throw new Error('Settled session is missing its authoritative payout');
    return { row: row, phase: phase, outcome: outcome };
  }
  function createBridge(options) {
    options = options || {};
    var listeners = new Set(), pending = new Map();
    var latestSnapshot = null, hostApi = null, connection = null, connectPromise = null, sizeObserver = null;
    var destroyed = false, status = root.parent === root ? 'standalone' : 'connecting';
    var lastReportedHeight = null;
    function emit(next) { listeners.forEach(function (listener) { try { listener(next); } catch (_) {} }); }
    function sessionItems() { return latestSnapshot && latestSnapshot.sessions && latestSnapshot.sessions.items || []; }
    function setSnapshot(snapshot) {
      if (destroyed) return;
      latestSnapshot = snapshot || null;
      emit({ type: 'snapshot', snapshot: latestSnapshot });
      sessionItems().forEach(function (row) {
        if (!row || !row.sessionKey) return;
        var waiters = pending.get(row.sessionKey);
        if (!waiters || !waiters.length) return;
        try {
          var result = terminalResult(row);
          if (result) waiters.slice().forEach(function (waiter) { waiter.resolve(result); });
        } catch (error) { waiters.slice().forEach(function (waiter) { waiter.reject(error); }); }
      });
      if (typeof options.onSnapshot === 'function') options.onSnapshot(latestSnapshot);
    }
    function reportContentSize() {
      if (!hostApi || typeof hostApi.reportContentSize !== 'function' || !root.document) return;
      var body = root.document.body, doc = root.document.documentElement;
      var surface = root.document.querySelector && root.document.querySelector('[data-game-content]');
      // Report intrinsic game content, not document.scrollHeight (at least the
      // old iframe height), otherwise a once-tall frame can never shrink.
      var minHeight = surface
        ? Math.ceil(Math.max(surface.scrollHeight, surface.offsetHeight, surface.getBoundingClientRect().bottom + (root.scrollY || 0)))
        : Math.ceil(Math.max(body ? body.scrollHeight : 0, body ? body.offsetHeight : 0, doc ? doc.scrollHeight : 0, doc ? doc.offsetHeight : 0));
      if (minHeight > 0 && minHeight !== lastReportedHeight) {
        lastReportedHeight = minHeight;
        void Promise.resolve(hostApi.reportContentSize({ minHeight: minHeight })).catch(function () { lastReportedHeight = null; });
      }
    }
    function connect() {
      if (destroyed) return Promise.reject(new Error('Casino bridge destroyed'));
      if (status === 'ready') return Promise.resolve(hostApi);
      if (connectPromise) return connectPromise;
      if (root.parent === root) { status = 'standalone'; emit({ type: 'status', status: status }); return Promise.resolve(null); }
      function failed(error) {
        if (destroyed) return null;
        status = 'unavailable';
        emit({ type: 'status', status: status, error: error });
        if (typeof options.onError === 'function') options.onError(error);
        return null;
      }
      try {
        var sdk = findSdk(options);
        var guestMethods = { setState: function (snapshot) { setSnapshot(snapshot); return Promise.resolve(); } };
        connection = sdk ? sdk.connectGameToHost(guestMethods) : null;
        if (!connection) {
          var penpal = root.Penpal;
          if (!penpal || typeof penpal.connect !== 'function' || typeof penpal.WindowMessenger !== 'function') throw new Error('Casino SDK bridge unavailable: load @chain/casino-sdk/guest or vendor/penpal.min.js');
          connection = penpal.connect({ messenger: new penpal.WindowMessenger({ remoteWindow: root.parent, allowedOrigins: [getOrigin()] }), methods: guestMethods });
        }
        connectPromise = Promise.resolve(connection.promise).then(function (api) {
          if (destroyed) return null;
          if (!api || typeof api.openSession !== 'function' || typeof api.revealOutcome !== 'function') throw new Error('Host does not implement Casino SDK v1');
          hostApi = api; status = 'ready'; reportContentSize();
          if (root.ResizeObserver && root.document && root.document.documentElement && hostApi.reportContentSize) {
            sizeObserver = new root.ResizeObserver(reportContentSize);
            sizeObserver.observe(root.document.documentElement);
            if (root.document.body) sizeObserver.observe(root.document.body);
            var surface = root.document.querySelector && root.document.querySelector('[data-game-content]');
            if (surface) sizeObserver.observe(surface);
          }
          emit({ type: 'status', status: status });
          if (typeof options.onReady === 'function') options.onReady(hostApi);
          return api;
        }).catch(failed);
      } catch (error) { connectPromise = Promise.resolve(failed(error)); }
      return connectPromise;
    }
    async function openSession(input) {
      if (destroyed || !hostApi) throw new Error('Casino host is not connected');
      if (!latestSnapshot || latestSnapshot.apiVersion !== 1 || !latestSnapshot.wallet || latestSnapshot.wallet.status !== 'ready') throw new Error('Casino wallet is not ready');
      input = input || {};
      var wager = uint(input.wager, 'wager').toString();
      var gameData = input.gameData || encodeGameData(input.stakes || input.bets, input);
      var decoded = decodeGameData(gameData);
      if (!decoded || decoded.wager !== wager) throw new Error('Wager must equal the eight encoded Graft Garden stakes');
      var opened = await hostApi.openSession({ wager: wager, gameData: gameData });
      if (!opened || typeof opened.sessionKey !== 'string' || !opened.sessionKey) throw new Error('Host returned no session key');
      emit({ type: 'opened', sessionKey: opened.sessionKey, transactionHash: opened.transactionHash, gameData: gameData });
      return opened;
    }
    function waitForSettlement(sessionKey, timeoutMs) {
      if (destroyed) return Promise.reject(new Error('Casino bridge destroyed'));
      if (typeof sessionKey !== 'string' || !sessionKey) return Promise.reject(new TypeError('sessionKey is required'));
      timeoutMs = timeoutMs == null ? 120000 : timeoutMs;
      if (!Number.isFinite(timeoutMs) || timeoutMs <= 0) return Promise.reject(new RangeError('Settlement timeout must be positive'));
      var existing = sessionItems().find(function (row) { return row.sessionKey === sessionKey; });
      try { var result = existing && terminalResult(existing); if (result) return Promise.resolve(result); } catch (error) { return Promise.reject(error); }
      return new Promise(function (resolve, reject) {
        var finished = false, timer;
        function remove() {
          if (finished) return false;
          finished = true; clearTimeout(timer);
          var list = pending.get(sessionKey) || [], idx = list.indexOf(waiter);
          if (idx >= 0) list.splice(idx, 1);
          if (!list.length) pending.delete(sessionKey);
          return true;
        }
        var waiter = { resolve: function (value) { if (remove()) resolve(value); }, reject: function (error) { if (remove()) reject(error); } };
        var list = pending.get(sessionKey) || []; list.push(waiter); pending.set(sessionKey, list);
        timer = setTimeout(function () {
          var error = new Error('Timed out waiting for session settlement; the on-chain session may still be pending');
          error.code = 'SETTLEMENT_TIMEOUT'; error.sessionKey = sessionKey; waiter.reject(error);
        }, timeoutMs);
      });
    }
    async function revealOutcome(sessionId) {
      if (destroyed || !hostApi) throw new Error('Casino host is not connected');
      var row = sessionItems().find(function (item) { return item.sessionId === sessionId; });
      if (!row || !TERMINAL[sessionPhase(row)]) throw new Error('Only a terminal session can be revealed');
      return hostApi.revealOutcome({ sessionId: sessionId });
    }
    async function cancelStuckRandomness(sessionId) {
      if (destroyed || !hostApi || typeof hostApi.cancelStuckRandomness !== 'function') throw new Error('Host does not support cancelling randomness');
      var row = sessionItems().find(function (item) { return item.sessionId === sessionId; });
      if (!row || sessionPhase(row) !== PHASE.WAITING_RANDOMNESS) throw new Error('Only a session waiting for randomness can be cancelled');
      // The host/contract enforces its timeout. A transaction hash is not settlement.
      return hostApi.cancelStuckRandomness({ sessionId: sessionId });
    }
    function subscribe(listener) { if (typeof listener !== 'function') return function () {}; listeners.add(listener); return function () { listeners.delete(listener); }; }
    function destroy() {
      if (destroyed) return;
      destroyed = true; status = 'destroyed';
      pending.forEach(function (list) { list.slice().forEach(function (waiter) { waiter.reject(new Error('Casino bridge destroyed')); }); }); pending.clear();
      if (sizeObserver) sizeObserver.disconnect(); sizeObserver = null;
      if (connection && typeof connection.destroy === 'function') connection.destroy();
      connection = null; hostApi = null; listeners.clear();
    }
    var api = { connect: connect, subscribe: subscribe, openSession: openSession, waitForSettlement: waitForSettlement, revealOutcome: revealOutcome, cancelStuckRandomness: cancelStuckRandomness, encodeGameData: encodeGameData, decodeGameData: decodeGameData, decodeGameState: decodeGameState, getSnapshot: function () { return latestSnapshot; }, getHostApi: function () { return hostApi; }, getStatus: function () { return status; }, destroy: destroy, phases: PHASE };
    if (options.autoConnect !== false) void connect();
    return api;
  }
  root.FruitCasinoBridge = Object.freeze({ create: createBridge, encodeGameData: encodeGameData, decodeGameData: decodeGameData, decodeGameState: decodeGameState, phases: PHASE, schemaVersion: 1, defaultRtpBps: 9700 });
})(typeof window !== 'undefined' ? window : globalThis);
