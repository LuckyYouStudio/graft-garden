(function (root, factory) {
  if (typeof module === 'object' && module.exports) module.exports = factory;
  else root.bindBetControls = factory;
})(typeof self !== 'undefined' ? self : this, function bindBetControls(options) {
  'use strict';
  const view = options.view || window;
  const doc = options.document || document;
  const delay = options.holdDelay ?? 350;
  const interval = options.repeatDelay ?? 90;
  const buttons = Array.from(options.buttons);
  const listeners = [];
  let active = null;
  let timer = null;

  function listen(target, name, fn, config) {
    target.addEventListener(name, fn, config);
    listeners.push(() => target.removeEventListener(name, fn, config));
  }

  function cancel() {
    if (timer !== null) view.clearTimeout(timer);
    timer = null;
    const press = active;
    active = null;
    if (!press) return;
    press.button.classList.remove('holding');
    if (press.pointerId !== undefined) {
      try {
        if (press.button.hasPointerCapture(press.pointerId)) press.button.releasePointerCapture(press.pointerId);
      } catch (_) { /* capture may already have been released by the browser */ }
    }
  }

  function add(press) {
    if (press.button.disabled || !options.canBet()) return false;
    return options.increment(Number(press.button.dataset.lane)) !== false;
  }

  function repeat(press) {
    if (active !== press) return;
    if (!add(press)) return cancel();
    timer = view.setTimeout(() => repeat(press), interval);
  }

  function begin(button, input) {
    if (active || button.disabled || !options.canBet()) return;
    const press = { button, ...input };
    active = press;
    button.classList.add('holding');
    if (press.pointerId !== undefined) {
      try { button.setPointerCapture(press.pointerId); } catch (_) { /* window release is also monitored */ }
    }
    if (!add(press)) return cancel();
    timer = view.setTimeout(() => repeat(press), delay);
  }

  buttons.forEach(button => {
    listen(button, 'pointerdown', event => {
      if (event.button !== 0 || event.isPrimary === false) return;
      begin(button, { pointerId: event.pointerId });
    });
    listen(button, 'lostpointercapture', event => {
      if (active?.button === button && active.pointerId === event.pointerId) cancel();
    });
    listen(button, 'click', event => {
      // Mouse/touch click follows pointerdown, which already added one.
      // detail=0 and no pointerType is keyboard/assistive activation.
      if (event.detail === 0 && !event.pointerType && !active && !button.disabled && options.canBet()) {
        options.increment(Number(button.dataset.lane));
      }
    });
    listen(button, 'keydown', event => {
      if (event.key !== ' ' && event.key !== 'Enter') return;
      event.preventDefault();
      if (!event.repeat) begin(button, { key: event.key });
    });
    listen(button, 'blur', () => {
      if (active?.button === button) cancel();
    });
    listen(button, 'contextmenu', event => event.preventDefault());
    listen(button, 'dragstart', event => event.preventDefault());
  });

  function release(event) {
    if (active && active.pointerId === event.pointerId) cancel();
  }
  listen(view, 'pointerup', release, true);
  listen(view, 'pointercancel', release, true);
  listen(view, 'keyup', event => {
    if (active?.key === event.key) {
      event.preventDefault();
      cancel();
    }
  }, true);
  listen(view, 'blur', cancel);
  listen(view, 'pagehide', cancel);
  listen(doc, 'visibilitychange', () => { if (doc.hidden) cancel(); });

  return {
    cancel,
    destroy() { cancel(); listeners.forEach(remove => remove()); }
  };
});
