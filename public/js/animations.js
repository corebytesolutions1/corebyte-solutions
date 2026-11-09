/* CoreByte Solutions — scroll reveals, timeline progress, count-ups. */
(function () {
  'use strict';

  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var hasIO = 'IntersectionObserver' in window;

  /* ---------------- Reveal on scroll ---------------- */
  var revealEls = document.querySelectorAll('[data-reveal], [data-stack]');
  if (!hasIO || reduce) {
    Array.prototype.forEach.call(revealEls, function (el) { el.classList.add('is-in'); });
  } else {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        entry.target.classList.add('is-in');
        io.unobserve(entry.target);
      });
    }, { rootMargin: '0px 0px -8% 0px', threshold: 0.08 });
    Array.prototype.forEach.call(revealEls, function (el) { io.observe(el); });

    // Elements inside a section hidden by the current mode become visible after a mode switch.
    document.addEventListener('cb:mode', function () {
      Array.prototype.forEach.call(document.querySelectorAll('[data-reveal]:not(.is-in), [data-stack]:not(.is-in)'), function (el) {
        io.unobserve(el);
        io.observe(el);
      });
    });
  }

  /* ---------------- Timeline progress rail ---------------- */
  var timelines = Array.prototype.slice.call(document.querySelectorAll('[data-timeline]'));
  if (timelines.length) {
    var active = new Set();
    var raf = 0;
    var update = function () {
      raf = 0;
      var vh = window.innerHeight;
      active.forEach(function (tl) {
        var r = tl.getBoundingClientRect();
        var p = (vh * 0.8 - r.top) / Math.max(r.height, 1);
        p = Math.max(0, Math.min(1, p));
        tl.style.setProperty('--p', reduce ? 1 : p.toFixed(3));
      });
    };
    var request = function () { if (!raf) raf = requestAnimationFrame(update); };
    if (hasIO) {
      var tio = new IntersectionObserver(function (entries) {
        entries.forEach(function (e) { e.isIntersecting ? active.add(e.target) : active.delete(e.target); });
        request();
      });
      timelines.forEach(function (t) { tio.observe(t); });
    } else {
      timelines.forEach(function (t) { active.add(t); });
    }
    window.addEventListener('scroll', request, { passive: true });
    window.addEventListener('resize', request);
    request();
  }

  /* ---------------- Count-up numbers ---------------- */
  var counters = document.querySelectorAll('[data-count]');
  var fmt = function (n) { return Math.round(n).toLocaleString('en-IN'); };
  if (counters.length && hasIO && !reduce) {
    var cio = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        var el = entry.target;
        cio.unobserve(el);
        var target = Number(el.getAttribute('data-count')) || 0;
        var start = performance.now();
        var dur = 1100;
        var tick = function (now) {
          var t = Math.min(1, (now - start) / dur);
          var eased = 1 - Math.pow(1 - t, 3);
          el.textContent = fmt(target * eased);
          if (t < 1) requestAnimationFrame(tick);
        };
        requestAnimationFrame(tick);
      });
    }, { threshold: 0.6 });
    Array.prototype.forEach.call(counters, function (el) { cio.observe(el); });
  }
})();
