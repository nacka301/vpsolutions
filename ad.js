// Lagana logika za oglasne stranice (bez GSAP-a): forma, sticky CTA, anti-spam.
(function () {
  var WEB3FORMS_KEY = '7e9b91d8-5669-4b96-9432-53ab8b53315a';
  var form = document.getElementById('adForm');
  var status = form ? form.querySelector('.form-status') : null;
  var sticky = document.getElementById('stickyCta');
  var hero = document.querySelector('.ad-hero');
  var last = 0, COOLDOWN = 60000;

  function onScroll() {
    if (!sticky || !hero) return;
    var show = window.scrollY > hero.offsetHeight - 120;
    sticky.classList.toggle('show', show);
    sticky.setAttribute('aria-hidden', String(!show));
  }
  window.addEventListener('scroll', onScroll, { passive: true });

  document.querySelectorAll('a[href^="#"]').forEach(function (a) {
    a.addEventListener('click', function (e) {
      var t = document.querySelector(a.getAttribute('href'));
      if (!t) return; e.preventDefault();
      window.scrollTo({ top: t.getBoundingClientRect().top + window.scrollY - 20, behavior: 'smooth' });
    });
  });

  function showStatus(text, type) {
    if (!status) return;
    status.textContent = text; status.className = 'form-status ' + type;
    clearTimeout(showStatus._t); showStatus._t = setTimeout(function () { status.className = 'form-status'; }, 8000);
  }

  if (form) {
    form.addEventListener('submit', async function (e) {
      e.preventDefault();
      var now = Date.now();
      if (now - last < COOLDOWN) { showStatus('Pričekajte trenutak prije ponovnog slanja.', 'error'); return; }
      var btn = form.querySelector('button[type="submit"]');
      var orig = btn.textContent; btn.textContent = 'Šaljem...'; btn.disabled = true;

      var fd = new FormData(form);
      var lines = [];
      var pt = (fd.get('projectType') || '').toString().trim();
      if (pt) lines.push('Vrsta projekta: ' + pt);
      form.querySelectorAll('[data-extra]').forEach(function (el) {
        if (el.value) lines.push((el.dataset.extra || el.name) + ': ' + el.value);
      });
      var utm = (fd.get('utm') || '').toString().trim();
      if (utm) lines.push('UTM: ' + utm);
      var msg = (fd.get('message') || '').toString();
      var message = (lines.length ? lines.join('\n') + '\n\n' : '') + msg;

      // Honeypot
      var hpVal = form.querySelector('input[name="hp"]') ? form.querySelector('input[name="hp"]').value : '';
      if (hpVal) { showStatus('Hvala! Upit je poslan.', 'success'); form.reset(); btn.textContent = orig; btn.disabled = false; return; }

      var data = {
        access_key: WEB3FORMS_KEY,
        subject: 'Novi upit — VP Solutions (oglas)',
        from_name: 'VP Solutions web',
        name: fd.get('name'), email: fd.get('email'), message: message
      };
      try {
        var res = await fetch('https://api.web3forms.com/submit', { method: 'POST', headers: { 'Content-Type': 'application/json', Accept: 'application/json' }, body: JSON.stringify(data) });
        var result = await res.json();
        if (res.ok && result.success) {
          last = now;
          showStatus('Hvala! Upit je poslan. Javljam se u najkraćem roku.', 'success');
          form.reset();
          if (typeof fbq === 'function') fbq('track', 'Lead');
        } else { showStatus(result.message || 'Došlo je do greške. Pokušajte ponovno.', 'error'); }
      } catch (err) { showStatus('Greška u mreži. Pišite mi na email.', 'error'); }
      btn.textContent = orig; btn.disabled = false;
    });
  }

  document.addEventListener('DOMContentLoaded', function () {
    document.querySelectorAll('input[name="ts"]').forEach(function (el) { el.value = Date.now().toString(); });
    var y = document.getElementById('year'); if (y) y.textContent = new Date().getFullYear();
    // UTM capture
    try {
      var sp = new URLSearchParams(location.search), keys = ['utm_source', 'utm_medium', 'utm_campaign', 'utm_content', 'utm_term'], f = {};
      keys.forEach(function (k) { var v = sp.get(k); if (v) f[k] = v; });
      var stored = sessionStorage.getItem('vps_utm');
      if (Object.keys(f).length) { stored = JSON.stringify(f); sessionStorage.setItem('vps_utm', stored); }
      var uf = document.getElementById('utmField'); if (uf && stored) uf.value = stored;
    } catch (e) { }
    onScroll();
  });
})();
