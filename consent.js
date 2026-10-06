// Lagana privola za kolačiće. Analytics i Meta Pixel se učitavaju TEK nakon pristanka.
(function () {
  var GA_ID = 'G-Z0YGB2DQ6Q';
  var FB_ID = 'META_PIXEL_ID'; // TODO: zamijeni stvarnim Meta Pixel ID-om

  function loadGA() {
    if (window.__gaLoaded) return; window.__gaLoaded = true;
    var s = document.createElement('script');
    s.async = true; s.src = 'https://www.googletagmanager.com/gtag/js?id=' + GA_ID;
    document.head.appendChild(s);
    window.dataLayer = window.dataLayer || [];
    window.gtag = function () { window.dataLayer.push(arguments); };
    gtag('js', new Date());
    gtag('config', GA_ID);
  }

  function loadPixel() {
    if (window.__fbLoaded) return; window.__fbLoaded = true;
    !function (f, b, e, v, n, t, s) {
      if (f.fbq) return; n = f.fbq = function () { n.callMethod ? n.callMethod.apply(n, arguments) : n.queue.push(arguments); };
      if (!f._fbq) f._fbq = n; n.push = n; n.loaded = !0; n.version = '2.0'; n.queue = [];
      t = b.createElement(e); t.async = !0; t.src = v;
      s = b.getElementsByTagName(e)[0]; s.parentNode.insertBefore(t, s);
    }(window, document, 'script', 'https://connect.facebook.net/en_US/fbevents.js');
    try {
      fbq('init', FB_ID);
      fbq('track', 'PageView');
      if (document.body.dataset.fbViewcontent) fbq('track', 'ViewContent');
    } catch (e) { /* placeholder ID */ }
  }

  function loadAll() { loadGA(); loadPixel(); }

  function hide() {
    var c = document.getElementById('consent');
    if (c) { c.classList.remove('show'); c.setAttribute('aria-hidden', 'true'); }
  }
  function show() {
    var c = document.getElementById('consent');
    if (c) { c.classList.add('show'); c.setAttribute('aria-hidden', 'false'); }
  }
  function set(v) { try { localStorage.setItem('vps_consent', v); } catch (e) { } }
  function get() { try { return localStorage.getItem('vps_consent'); } catch (e) { return null; } }

  document.addEventListener('DOMContentLoaded', function () {
    var a = document.getElementById('consentAccept');
    var d = document.getElementById('consentDeny');
    if (a) a.addEventListener('click', function () { set('granted'); loadAll(); hide(); });
    if (d) d.addEventListener('click', function () { set('denied'); hide(); });

    var v = get();
    if (v === 'granted') loadAll();
    else if (v !== 'denied') show();
  });
})();
