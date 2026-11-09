/* CoreByte Solutions — enquiry & "notify me" forms.
 * Forms post to our own server (/api/contact, /api/notify). The server validates,
 * sanitises and sends via EmailJS using secret keys that never reach the browser.
 * Without JavaScript the forms still work as normal POSTs. */
(function () {
  'use strict';

  var EMAIL_RE = /^[^\s@<>()[\]\\,;:"]+@[^\s@<>()[\]\\,;:"]+\.[A-Za-z]{2,}$/;
  var PHONE_RE = /^[+()\-.\s0-9]{6,20}$/;

  var RULES = {
    contact: {
      name: function (v) { return v.trim().length >= 2 ? '' : 'Enter your name.'; },
      email: function (v) { return EMAIL_RE.test(v.trim()) ? '' : 'Enter a valid email address, like name@company.com.'; },
      phone: function (v) { return !v.trim() || PHONE_RE.test(v.trim()) ? '' : 'Use digits, spaces and + only.'; },
      service: function (v) { return v ? '' : 'Choose the service you need.'; },
      message: function (v) { return v.trim().length >= 10 ? '' : 'Tell us a little more, at least 10 characters.'; }
    },
    notify: {
      email: function (v) { return EMAIL_RE.test(v.trim()) ? '' : 'Enter a valid email address.'; }
    }
  };

  function setError(form, name, msg) {
    var field = form.elements[name];
    var out = form.querySelector('[data-error-for="' + name + '"]');
    if (field) {
      if (msg) field.setAttribute('aria-invalid', 'true');
      else field.removeAttribute('aria-invalid');
    }
    if (out) out.textContent = msg || '';
  }

  function validate(form, rules) {
    var firstBad = null;
    Object.keys(rules).forEach(function (name) {
      var el = form.elements[name];
      if (!el) return;
      var msg = rules[name](el.value || '');
      setError(form, name, msg);
      if (msg && !firstBad) firstBad = el;
    });
    return firstBad;
  }

  Array.prototype.forEach.call(document.querySelectorAll('[data-ajax-form]'), function (form) {
    var kind = form.getAttribute('data-ajax-form');
    var rules = RULES[kind] || {};
    var statusEl = form.querySelector('[data-form-status]');
    var success = form.querySelector('[data-form-success]');
    var submit = form.querySelector('button[type="submit"]');

    // Live re-validation once a field has been flagged.
    form.addEventListener('input', function (e) {
      var name = e.target.name;
      if (rules[name] && e.target.getAttribute('aria-invalid') === 'true') {
        setError(form, name, rules[name](e.target.value || ''));
      }
    });
    form.addEventListener('change', function (e) {
      var name = e.target.name;
      if (rules[name] && e.target.tagName === 'SELECT') setError(form, name, rules[name](e.target.value || ''));
    });

    form.addEventListener('submit', function (e) {
      e.preventDefault();
      if (statusEl) { statusEl.textContent = ''; statusEl.classList.remove('is-ok'); }

      var bad = validate(form, rules);
      if (bad) { bad.focus(); return; }

      var data = {};
      Array.prototype.forEach.call(form.elements, function (el) {
        if (el.name && !el.disabled) data[el.name] = el.value;
      });

      submit.classList.add('is-loading');
      submit.setAttribute('aria-busy', 'true');
      submit.disabled = true;

      fetch(form.getAttribute('action'), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify(data),
        credentials: 'same-origin'
      })
        .then(function (res) {
          return res.json().catch(function () { return {}; }).then(function (json) { return { ok: res.ok, json: json }; });
        })
        .then(function (r) {
          if (r.ok && r.json.ok) {
            form.classList.add('is-sent');
            if (success) {
              success.hidden = false;
              var title = success.querySelector('[data-success-title]');
              if (title) title.focus({ preventScroll: false });
            }
            form.reset();
            return;
          }
          if (r.json.errors) Object.keys(r.json.errors).forEach(function (k) { setError(form, k, r.json.errors[k]); });
          if (statusEl) statusEl.textContent = r.json.message || 'Your message could not be sent. Try again in a minute.';
        })
        .catch(function () {
          if (statusEl) statusEl.textContent = 'Couldn’t reach the server. Check your connection and try again.';
        })
        .then(function () {
          submit.classList.remove('is-loading');
          submit.removeAttribute('aria-busy');
          submit.disabled = false;
        });
    });

    var resetBtn = form.querySelector('[data-form-reset]');
    if (resetBtn) {
      resetBtn.addEventListener('click', function () {
        form.classList.remove('is-sent');
        if (success) success.hidden = true;
        var first = form.querySelector('input:not([type="hidden"]):not([tabindex="-1"])');
        if (first) first.focus();
        if (history.replaceState && /[?&]sent=1/.test(location.search)) history.replaceState(null, '', location.pathname + '#enquiry');
      });
    }
  });
})();
