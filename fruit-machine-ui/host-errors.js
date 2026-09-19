(function (root, factory) {
  const api = factory(typeof module === 'object' && module.exports ? require('./i18n.js') : root.GraftI18n);
  if (typeof module === 'object' && module.exports) module.exports = api;
  else root.GraftHostErrors = api;
})(typeof window !== 'undefined' ? window : globalThis, function (i18n) {
  'use strict';
  function message(error, locale) {
    const t = key => i18n.t(locale, key);
    const raw = [error?.shortMessage, error?.details, error?.message].filter(Boolean).join('\n') || String(error || '');
    // InvalidGameData() selector; both game contracts use this error.
    if (/InvalidGameData|0xbcefcde4/i.test(raw)) {
      return t('errorContract');
    }
    if (/user rejected|user denied|user cancelled|user canceled/i.test(raw) || error?.code === 4001) {
      return t('errorCancelled');
    }
    if (/insufficient funds|insufficient balance/i.test(raw)) {
      return t('errorInsufficient');
    }
    if (/fetch failed|failed to fetch|network error|ECONNREFUSED|timed? ?out/i.test(raw)) {
      return t('errorNetwork');
    }
    if (/revert|Request Arguments:|Contract Call:/i.test(raw)) {
      return t('errorReverted');
    }
    // Keep useful short errors, but never fill the game board with viem's
    // calldata, RPC URL, stack or dependency version dump.
    const summary = (error?.shortMessage || error?.message || '').split(/\r?\n|Request Arguments:|Details:|Version:/)[0]
      .replace(/0x[0-9a-f]{40,}/gi, '[…]').trim();
    if (!summary) return t('errorGeneric');
    return summary.length > 180 ? summary.slice(0, 177) + '…' : summary;
  }
  return { message };
});
