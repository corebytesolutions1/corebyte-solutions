/* CoreByte Solutions — Technology / Import-Export mode switcher.
 * The chosen mode is saved in localStorage ('cb-mode') and applied before
 * first paint by a tiny inline script in <head>, so there is no flash. */
(function () {
  'use strict';

  var KEY = 'cb-mode';
  var doc = document.documentElement;
  var path = location.pathname.replace(/\/+$/, '') || '/';
  var isHome = path === '/';
  var isTrade = path === '/trade';
  var overlay = document.querySelector('[data-mode-overlay]');
  var lastFocus = null;

  function save(mode) { try { localStorage.setItem(KEY, mode); } catch (e) { /* ignore */ } }
  function current() { return doc.getAttribute('data-mode') === 'trade' ? 'trade' : 'tech'; }

  function syncControls() {
    var m = current();
    Array.prototype.forEach.call(document.querySelectorAll('[data-mode-btn]'), function (b) {
      b.setAttribute('aria-pressed', String(b.getAttribute('data-mode-btn') === m));
    });
  }

  function label(m) { return m === 'trade' ? 'CHA & Import / Export mode' : 'Technology mode'; }

  /** Apply a mode on the current page, with a short cross-fade on the homepage. */
  function apply(mode, opts) {
    opts = opts || {};
    if (mode !== 'tech' && mode !== 'trade') return;
    if (current() === mode) { syncControls(); return; }
    var reduce = window.CB && window.CB.reduceMotion && window.CB.reduceMotion();
    var swap = function () {
      doc.setAttribute('data-mode', mode);
      syncControls();
      if (opts.scrollTop) window.scrollTo({ top: 0, behavior: 'auto' });
      document.dispatchEvent(new CustomEvent('cb:mode', { detail: { mode: mode } }));
    };
    if (!opts.animate || reduce) { swap(); }
    else {
      doc.classList.add('is-switching');
      setTimeout(function () {
        swap();
        requestAnimationFrame(function () { doc.classList.remove('is-switching'); });
      }, 280);
    }
    if (opts.toast !== false && window.CB && window.CB.toast) window.CB.toast(label(mode));
  }

  /** Decide whether to switch in place or navigate to the page for that mode. */
  function choose(mode, opts) {
    save(mode);
    doc.classList.remove('needs-mode');
    if (isTrade && mode === 'tech') { location.href = '/'; return; }
    if (!isHome && !isTrade && mode === 'trade') { location.href = '/trade'; return; }
    apply(mode, Object.assign({ animate: true, scrollTop: isHome && opts && opts.scrollTop }, opts || {}));
  }

  /* ---------------- Overlay (first visit) ---------------- */
  function onOverlayKey(e) {
    if (e.key === 'Escape') { e.preventDefault(); closeOverlay(true); return; }
    if (window.CB && window.CB.trapFocus) window.CB.trapFocus(overlay, e);
  }
  function openOverlay() {
    if (!overlay) return;
    lastFocus = document.activeElement;
    overlay.hidden = false;
    if (window.CB && window.CB.lockScroll) window.CB.lockScroll();
    var first = overlay.querySelector('[data-choose-mode]');
    setTimeout(function () { if (first) first.focus({ preventScroll: true }); }, 50);
    overlay.addEventListener('keydown', onOverlayKey);
  }
  function closeOverlay(dismissed) {
    if (!overlay || overlay.hidden) return;
    if (dismissed) { save(current()); doc.classList.remove('needs-mode'); }
    overlay.classList.add('is-closing');
    overlay.removeEventListener('keydown', onOverlayKey);
    setTimeout(function () {
      overlay.hidden = true;
      overlay.classList.remove('is-closing');
      if (window.CB && window.CB.unlockScroll) window.CB.unlockScroll();
      if (lastFocus && lastFocus.focus) lastFocus.focus({ preventScroll: true });
    }, 280);
  }
  if (overlay) {
    overlay.addEventListener('click', function (e) {
      if (e.target === overlay) closeOverlay(true);
    });
  }

  /* ---------------- Wiring ---------------- */
  document.addEventListener('click', function (e) {
    var choice = e.target.closest('[data-choose-mode]');
    if (choice) {
      var m = choice.getAttribute('data-choose-mode');
      var fromOverlay = overlay && overlay.contains(choice);
      if (fromOverlay) closeOverlay(false);
      choose(m, { scrollTop: !fromOverlay });
      return;
    }

    var floating = e.target.closest('[data-mode-btn]');
    if (floating) {
      choose(floating.getAttribute('data-mode-btn'), { scrollTop: true });
      return;
    }

    var setter = e.target.closest('[data-set-mode]');
    if (setter) {
      var mode = setter.getAttribute('data-set-mode');
      save(mode);
      doc.classList.remove('needs-mode');
      var href = setter.getAttribute('href');
      // Links that point at another page just navigate (mode is already saved).
      if (href && href !== '#' && (href.replace(/\/+$/, '') || '/') !== path) return;
      e.preventDefault();
      if (window.CB && window.CB.closeDrawer) window.CB.closeDrawer(false);
      if (isTrade && mode === 'tech') { location.href = '/'; return; }
      apply(mode, { animate: true, scrollTop: true });
    }
  });

  syncControls();

  // Show the welcome overlay once, after the loader finishes.
  if (doc.classList.contains('needs-mode') && overlay) {
    var delay = doc.classList.contains('no-loader') ? 350 : 1250;
    if (window.CB && window.CB.reduceMotion && window.CB.reduceMotion()) delay = 100;
    setTimeout(openOverlay, delay);
  }
})();
