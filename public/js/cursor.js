/* CoreByte Solutions — desktop cursor ring, glow, magnetic buttons, card spotlight.
 * Runs only on devices with a fine pointer and hover; never on touch screens.
 * The ring is pointer-events:none so it can't block clicks; the native cursor stays visible. */
(function () {
  'use strict';

  var finePointer = window.matchMedia('(hover: hover) and (pointer: fine)');
  if (!finePointer.matches) return;
  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ---------------- Card spotlight (static highlight, fine even with reduced motion) ---------------- */
  document.addEventListener('pointermove', function (e) {
    var card = e.target.closest && e.target.closest('[data-spotlight]');
    if (!card) return;
    var r = card.getBoundingClientRect();
    card.style.setProperty('--mx', (e.clientX - r.left) + 'px');
    card.style.setProperty('--my', (e.clientY - r.top) + 'px');
  }, { passive: true });

  if (reduce) return;

  var doc = document.documentElement;
  var ring = document.querySelector('.cursor-ring');
  var glow = document.querySelector('.cursor-glow');
  if (!ring || !glow) return;
  ring.classList.add('is-hidden');
  glow.style.opacity = '0';
  doc.classList.add('has-cursor');

  var x = -100, y = -100, rx = x, ry = y, gx = x, gy = y;
  var running = false;
  var HOVER = 'a, button, summary, label, input, select, textarea, [data-magnetic], [data-spotlight]';

  function loop() {
    rx += (x - rx) * 0.22;
    ry += (y - ry) * 0.22;
    gx += (x - gx) * 0.08;
    gy += (y - gy) * 0.08;
    ring.style.transform = 'translate3d(' + rx + 'px,' + ry + 'px,0)';
    glow.style.transform = 'translate3d(' + gx + 'px,' + gy + 'px,0)';
    if (Math.abs(x - rx) + Math.abs(y - ry) + Math.abs(x - gx) + Math.abs(y - gy) > 0.5) {
      requestAnimationFrame(loop);
    } else {
      running = false;
    }
  }
  function kick() { if (!running) { running = true; requestAnimationFrame(loop); } }

  window.addEventListener('pointermove', function (e) {
    if (e.pointerType && e.pointerType !== 'mouse') return;
    if (x < 0) { rx = gx = e.clientX; ry = gy = e.clientY; }
    x = e.clientX; y = e.clientY;
    ring.classList.remove('is-hidden');
    glow.style.opacity = '';
    kick();
  }, { passive: true });

  document.addEventListener('pointerover', function (e) {
    var t = e.target.closest && e.target.closest(HOVER);
    // Text fields keep the plain I-beam feel: no enlarged ring.
    var isField = t && /^(INPUT|TEXTAREA|SELECT)$/.test(t.tagName);
    ring.classList.toggle('is-hover', Boolean(t) && !isField && !t.hasAttribute('data-spotlight'));
  });
  document.addEventListener('pointerdown', function () { ring.classList.add('is-down'); });
  document.addEventListener('pointerup', function () { ring.classList.remove('is-down'); });
  document.addEventListener('mouseleave', function () { ring.classList.add('is-hidden'); });
  window.addEventListener('blur', function () { ring.classList.add('is-hidden'); });

  /* ---------------- Magnetic buttons ---------------- */
  var MAX = 7;
  Array.prototype.forEach.call(document.querySelectorAll('[data-magnetic]'), function (el) {
    el.addEventListener('pointermove', function (e) {
      var r = el.getBoundingClientRect();
      var dx = (e.clientX - (r.left + r.width / 2)) / (r.width / 2);
      var dy = (e.clientY - (r.top + r.height / 2)) / (r.height / 2);
      el.style.transform = 'translate(' + (dx * MAX).toFixed(2) + 'px,' + (dy * MAX * 0.6).toFixed(2) + 'px)';
    });
    el.addEventListener('pointerleave', function () { el.style.transform = ''; });
  });
})();
