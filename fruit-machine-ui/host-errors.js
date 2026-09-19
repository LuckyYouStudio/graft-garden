(function (root, factory) {
  const api = factory();
  if (typeof module === 'object' && module.exports) module.exports = api;
  else root.GraftHostErrors = api;
})(typeof window !== 'undefined' ? window : globalThis, function () {
  'use strict';
  function message(error, locale) {
    const en = locale === 'en';
    const raw = [error?.shortMessage, error?.details, error?.message].filter(Boolean).join('\n') || String(error || '');
    // InvalidGameData() selector; both game contracts use this error.
    if (/InvalidGameData|0xbcefcde4/i.test(raw)) {
      return en
        ? 'The wager does not match the selected contract. In the simulator, select GraftGardenGame and click Restart harness.'
        : '下注参数与所选合约不匹配。请在模拟器选择 GraftGardenGame，再点击 Restart harness。';
    }
    if (/user rejected|user denied|user cancelled|user canceled/i.test(raw) || error?.code === 4001) {
      return en ? 'The request was cancelled. No new round was confirmed.' : '请求已取消，尚未确认新一局。';
    }
    if (/insufficient funds|insufficient balance/i.test(raw)) {
      return en ? 'Insufficient balance. Reduce the wager and try again.' : '余额不足，请减少下注后重试。';
    }
    if (/fetch failed|failed to fetch|network error|ECONNREFUSED|timed? ?out/i.test(raw)) {
      return en ? 'Cannot reach the host. Check that the local simulator and chain are still running.' : '暂时无法连接主机，请确认本地模拟器和链服务仍在运行。';
    }
    if (/revert|Request Arguments:|Contract Call:/i.test(raw)) {
      return en ? 'The contract rejected this request. Check the selected game and wager, then retry.' : '合约拒绝了本次请求，请检查所选游戏和下注金额后重试。';
    }
    // Keep useful short errors, but never fill the game board with viem's
    // calldata, RPC URL, stack or dependency version dump.
    const summary = (error?.shortMessage || error?.message || '').split(/\r?\n|Request Arguments:|Details:|Version:/)[0]
      .replace(/0x[0-9a-f]{40,}/gi, '[…]').trim();
    if (!summary) return en ? 'The request failed. Please try again.' : '请求失败，请重试。';
    return summary.length > 180 ? summary.slice(0, 177) + '…' : summary;
  }
  return { message };
});

