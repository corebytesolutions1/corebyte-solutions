/* CoreByte Solutions — core UI: header, navigation drawer, mega menus, ripple, toast. */
(function () {
  'use strict';

  var doc = document.documentElement;
  var body = document.body;
  var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  var desktopNav = window.matchMedia('(min-width: 1100px)');

  window.CB = window.CB || {};
  window.CB.reduceMotion = function () { return reduceMotion.matches; };

  // Mark the loader as seen for this browser session.
  try { sessionStorage.setItem('cb-loaded', '1'); } catch (e) { /* storage blocked */ }

  /* ---------------- Toast ---------------- */
  var toastEl = document.querySelector('[data-toast]');
  var toastTimer;
  window.CB.toast = function (msg) {
    if (!toastEl) return;
    toastEl.textContent = msg;
    toastEl.classList.add('is-on');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(function () { toastEl.classList.remove('is-on'); }, 2400);
  };

  /* ---------------- Scroll lock (iOS-safe) ---------------- */
  var lockY = 0;
  var locked = false;
  window.CB.lockScroll = function () {
    if (locked) return;
    locked = true;
    lockY = window.scrollY || window.pageYOffset;
    body.style.position = 'fixed';
    body.style.top = -lockY + 'px';
    body.style.left = '0';
    body.style.right = '0';
    body.style.width = '100%';
  };
  window.CB.unlockScroll = function () {
    if (!locked) return;
    locked = false;
    body.style.position = '';
    body.style.top = '';
    body.style.left = '';
    body.style.right = '';
    body.style.width = '';
    var prev = doc.style.scrollBehavior;
    doc.style.scrollBehavior = 'auto';
    window.scrollTo(0, lockY);
    doc.style.scrollBehavior = prev;
  };

  /* ---------------- Focus trap helper ---------------- */
  var FOCUSABLE = 'a[href], button:not([disabled]), input:not([disabled]):not([type="hidden"]), select, textarea, [tabindex]:not([tabindex="-1"])';
  window.CB.trapFocus = function (container, e) {
    if (e.key !== 'Tab') return;
    var items = Array.prototype.filter.call(container.querySelectorAll(FOCUSABLE), function (el) {
      return el.offsetParent !== null || el === document.activeElement;
    });
    if (!items.length) return;
    var first = items[0];
    var last = items[items.length - 1];
    if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
    else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
  };

  /* ---------------- Header state ---------------- */
  var header = document.querySelector('[data-header]');
  var ticking = false;
  function onScroll() {
    if (ticking) return;
    ticking = true;
    requestAnimationFrame(function () {
      if (header) header.classList.toggle('is-scrolled', (window.scrollY || 0) > 8);
      ticking = false;
    });
  }
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  /* ---------------- Navigation drawer ---------------- */
  var nav = document.querySelector('[data-nav]');
  var toggle = document.querySelector('[data-nav-toggle]');
  var closeBtn = document.querySelector('[data-nav-close]');
  var scrim = document.querySelector('[data-nav-scrim]');
  var menuItems = Array.prototype.slice.call(document.querySelectorAll('[data-menu-item]'));
  var drawerOpen = false;

  function setMenu(item, open) {
    var btn = item.querySelector('[data-menu-btn]');
    item.classList.toggle('is-open', open);
    item.classList.remove('is-closed');
    if (btn) btn.setAttribute('aria-expanded', String(open));
  }
  function closeAllMenus(except) {
    menuItems.forEach(function (it) { if (it !== except) setMenu(it, false); });
  }

  function openDrawer() {
    if (!nav || drawerOpen) return;
    drawerOpen = true;
    scrim.hidden = false;
    // force reflow so the scrim transition runs
    void scrim.offsetWidth;
    scrim.classList.add('is-visible');
    nav.classList.add('is-open');
    toggle.setAttribute('aria-expanded', 'true');
    window.CB.lockScroll();
    setTimeout(function () { if (closeBtn) closeBtn.focus(); }, 60);
  }
  function closeDrawer(returnFocus) {
    if (!nav || !drawerOpen) return;
    drawerOpen = false;
    nav.classList.remove('is-open');
    scrim.classList.remove('is-visible');
    toggle.setAttribute('aria-expanded', 'false');
    window.CB.unlockScroll();
    closeAllMenus();
    setTimeout(function () { if (!drawerOpen) scrim.hidden = true; }, 320);
    if (returnFocus !== false && toggle) toggle.focus();
  }
  window.CB.closeDrawer = closeDrawer;

  if (toggle) toggle.addEventListener('click', function () { drawerOpen ? closeDrawer() : openDrawer(); });
  if (closeBtn) closeBtn.addEventListener('click', function () { closeDrawer(); });
  if (scrim) scrim.addEventListener('click', function () { closeDrawer(); });

  if (nav) {
    nav.addEventListener('keydown', function (e) {
      if (drawerOpen) window.CB.trapFocus(nav, e);
    });
    // Close the drawer after choosing a destination.
    nav.addEventListener('click', function (e) {
      var link = e.target.closest('a[href]');
      if (!link) return;
      if (drawerOpen) closeDrawer(false);
      else closeAllMenus();
    });
  }

  // Submenu buttons: accordion in the drawer, click/keyboard dropdown on desktop.
  menuItems.forEach(function (item) {
    var btn = item.querySelector('[data-menu-btn]');
    if (!btn) return;
    btn.addEventListener('click', function (e) {
      e.stopPropagation();
      var open = !item.classList.contains('is-open');
      closeAllMenus(item);
      setMenu(item, open);
      if (!open && desktopNav.matches) item.classList.add('is-closed');
    });
    item.addEventListener('mouseleave', function () {
      if (!desktopNav.matches) return;
      item.classList.remove('is-closed');
      setMenu(item, false);
    });
  });

  document.addEventListener('click', function (e) {
    if (desktopNav.matches && !e.target.closest('[data-menu-item]')) closeAllMenus();
  });

  document.addEventListener('keydown', function (e) {
    if (e.key !== 'Escape') return;
    if (drawerOpen) { closeDrawer(); return; }
    var open = menuItems.filter(function (it) { return it.classList.contains('is-open') || it.contains(document.activeElement); });
    open.forEach(function (it) {
      setMenu(it, false);
      it.classList.add('is-closed');
      var btn = it.querySelector('[data-menu-btn]');
      if (btn && it.contains(document.activeElement)) btn.focus();
    });
  });

  // Leaving drawer breakpoint while open: reset.
  var onBp = function () { if (desktopNav.matches) closeDrawer(false); closeAllMenus(); };
  if (desktopNav.addEventListener) desktopNav.addEventListener('change', onBp);
  else if (desktopNav.addListener) desktopNav.addListener(onBp);

  /* ---------------- Click ripple ---------------- */
  document.addEventListener('pointerdown', function (e) {
    if (reduceMotion.matches) return;
    var btn = e.target.closest('.btn, .mode-switch__btn, .mode-choice, .mode-opt');
    if (!btn) return;
    var rect = btn.getBoundingClientRect();
    var size = Math.max(rect.width, rect.height);
    var r = document.createElement('span');
    r.className = 'ripple';
    r.style.width = r.style.height = size + 'px';
    r.style.left = (e.clientX - rect.left - size / 2) + 'px';
    r.style.top = (e.clientY - rect.top - size / 2) + 'px';
    if (getComputedStyle(btn).position === 'static') btn.style.position = 'relative';
    btn.appendChild(r);
    setTimeout(function () { r.remove(); }, 650);
  });

  /* ---------------- External links safety net ---------------- */
  Array.prototype.forEach.call(document.querySelectorAll('a[target="_blank"]'), function (a) {
    var rel = (a.getAttribute('rel') || '').split(/\s+/);
    if (rel.indexOf('noopener') === -1) rel.push('noopener');
    if (rel.indexOf('noreferrer') === -1) rel.push('noreferrer');
    a.setAttribute('rel', rel.join(' ').trim());
  });
})();
