/* CoreByte Solutions — hero visual: typed sample messages + animation pausing.
 * The JSON shown is illustrative sample data, not a real ICEGATE/SCMTR payload.
 * Edit SAMPLES below to change it. */
(function () {
  'use strict';

  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  var SAMPLES = {
    SF: '{\n  "messageType": "SF",\n  "shippingBill": "1234567",\n  "container": "TGHU4829156",\n  "packages": "1-5",\n  "custodian": "ACU-LDH"\n}',
    ASR: '{\n  "messageType": "ASR",\n  "shippingBill": "1234567",\n  "transshipmentMode": "RAIL",\n  "nextPortOfUnloading": "INMUN1",\n  "transhipper": "ATP-0042"\n}',
    DP: '{\n  "messageType": "DP",\n  "shippingBill": "1234567",\n  "trainNo": "CT-4821",\n  "container": "TGHU4829156",\n  "transhipper": "ATP-0042"\n}'
  };
  var STATUS = {
    SF: 'ACK received · officer approval',
    ASR: 'ACK received · validated against SF',
    DP: 'ACK received · CIM no. & date issued'
  };
  var ORDER = ['SF', 'ASR', 'DP'];

  function esc(s) { return s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;'); }
  function highlight(s) {
    return esc(s)
      .replace(/("[^"\n]*")(\s*:)/g, '<span class="k">$1</span>$2')
      .replace(/(:\s*)("[^"\n]*"?)/g, '$1<span class="s">$2</span>');
  }

  /* ---------------- Terminal typing ---------------- */
  var term = document.querySelector('[data-terminal]');
  if (term) {
    var code = term.querySelector('[data-term-code]');
    var status = term.querySelector('[data-term-status]');
    var statusText = term.querySelector('[data-term-status-text]');
    var tabs = term.querySelectorAll('[data-term-tab]');
    var idx = 0;
    var timer = 0;
    var visible = true;

    var setTab = function (name) {
      Array.prototype.forEach.call(tabs, function (t) { t.classList.toggle('is-active', t.getAttribute('data-term-tab') === name); });
    };

    var play = function () {
      clearTimeout(timer);
      var name = ORDER[idx];
      var full = SAMPLES[name];
      var n = 0;
      setTab(name);
      status.classList.remove('is-on');
      if (statusText) statusText.textContent = STATUS[name];
      var step = function () {
        if (!visible) { timer = setTimeout(step, 400); return; }
        n = Math.min(full.length, n + 2);
        code.innerHTML = highlight(full.slice(0, n));
        if (n < full.length) { timer = setTimeout(step, 24); return; }
        status.classList.add('is-on');
        timer = setTimeout(function () { idx = (idx + 1) % ORDER.length; play(); }, 2600);
      };
      step();
    };

    if (reduce) {
      setTab('SF');
      code.innerHTML = highlight(SAMPLES.SF);
      status.classList.add('is-on');
    } else {
      code.innerHTML = highlight(SAMPLES.SF);
      setTab('SF');
      if ('IntersectionObserver' in window) {
        new IntersectionObserver(function (entries) { visible = entries[0].isIntersecting && !document.hidden; }).observe(term);
      }
      document.addEventListener('visibilitychange', function () { visible = !document.hidden; });
      var startDelay = document.documentElement.classList.contains('no-loader') ? 900 : 1900;
      setTimeout(play, startDelay);
    }
  }

  /* ---------------- Pause SVG (SMIL) animations off-screen or for reduced motion ---------------- */
  Array.prototype.forEach.call(document.querySelectorAll('.route__svg, .cargo__svg'), function (svg) {
    if (typeof svg.pauseAnimations !== 'function') return;
    if (reduce) { svg.pauseAnimations(); return; }
    if ('IntersectionObserver' in window) {
      new IntersectionObserver(function (entries) {
        entries[0].isIntersecting ? svg.unpauseAnimations() : svg.pauseAnimations();
      }).observe(svg);
    }
  });
})();
