// VP Solutions — interakcije. Sadržaj radi i bez ovoga; ovo je progresivno poboljšanje.

const hasGSAP = typeof window.gsap !== 'undefined';
const hasST = hasGSAP && typeof window.ScrollTrigger !== 'undefined';
const hasLenis = typeof window.Lenis !== 'undefined';
const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const motion = !reduced;
const isDesktop = window.matchMedia('(min-width: 960px)').matches;

// Web3Forms (javni access key — smije stajati u kodu)
const WEB3FORMS_KEY = '7e9b91d8-5669-4b96-9432-53ab8b53315a';

if (hasST) gsap.registerPlugin(ScrollTrigger);

/* ---------- Lenis smooth scroll (samo desktop) ---------- */
let lenis = null;
if (hasLenis && hasGSAP && motion && isDesktop) {
  lenis = new Lenis({ duration: 1.1, smoothWheel: true });
  document.documentElement.classList.add('lenis');
  lenis.on('scroll', () => { if (hasST) ScrollTrigger.update(); });
  gsap.ticker.add((t) => lenis.raf(t * 1000));
  gsap.ticker.lagSmoothing(0);
}

/* ---------- Smooth anchor + zatvaranje izbornika ---------- */
const navToggle = document.getElementById('navToggle');
const menu = document.getElementById('menu');

function setMenu(open) {
  if (!menu || !navToggle) return;
  menu.classList.toggle('open', open);
  menu.setAttribute('aria-hidden', String(!open));
  navToggle.setAttribute('aria-expanded', String(open));
  navToggle.innerHTML = open
    ? '<svg class="icon" aria-hidden="true"><use href="#i-x"/></svg>'
    : '<svg class="icon" aria-hidden="true"><use href="#i-menu"/></svg>';
  document.body.style.overflow = open ? 'hidden' : '';
}
if (navToggle) navToggle.addEventListener('click', () => setMenu(!menu.classList.contains('open')));
document.addEventListener('keydown', (e) => { if (e.key === 'Escape') setMenu(false); });

document.querySelectorAll('a[href^="#"]').forEach(a => {
  a.addEventListener('click', (e) => {
    const id = a.getAttribute('href');
    if (id === '#' || id === '#top') { }
    const target = id === '#top' ? document.body : document.querySelector(id);
    if (!target) return;
    e.preventDefault();
    setMenu(false);
    const top = id === '#top' ? 0 : target.getBoundingClientRect().top + window.scrollY - 70;
    if (lenis) lenis.scrollTo(top);
    else window.scrollTo({ top, behavior: reduced ? 'auto' : 'smooth' });
  });
});

/* ---------- Nav blur + sticky CTA ---------- */
const nav = document.getElementById('nav');
const stickyCta = document.getElementById('stickyCta');
const heroEl = document.querySelector('.hero');
const contactEl = document.getElementById('kontakt');

function onScroll() {
  const y = window.scrollY;
  if (nav) nav.classList.toggle('scrolled', y > 24);
  if (stickyCta && heroEl) {
    let show = y > heroEl.offsetHeight - 120;
    if (contactEl && contactEl.getBoundingClientRect().top < window.innerHeight) show = false;
    stickyCta.classList.toggle('show', show);
    stickyCta.setAttribute('aria-hidden', String(!show));
  }
}
window.addEventListener('scroll', onScroll, { passive: true });
onScroll();

/* ---------- Split naslova u riječi ---------- */
function splitWords(el) {
  const text = el.textContent;
  el.textContent = '';
  el.classList.add('is-split');
  text.split(/(\s+)/).forEach(tok => {
    if (tok.trim() === '') { el.appendChild(document.createTextNode(' ')); return; }
    const word = document.createElement('span');
    word.className = 'word';
    const inner = document.createElement('i');
    inner.textContent = tok;
    word.appendChild(inner);
    el.appendChild(word);
  });
  return el.querySelectorAll('.word i');
}

if (motion && hasGSAP) {
  // Hero naslov — reveal pri učitavanju
  const heroTitle = document.querySelector('.hero-title.split');
  if (heroTitle) {
    const words = splitWords(heroTitle);
    gsap.set(words, { yPercent: 110 });
    gsap.to(words, { yPercent: 0, duration: 0.9, ease: 'power3.out', stagger: 0.06, delay: 0.15 });
  }
  // Završni CTA naslov — reveal na scroll
  const ctaTitle = document.querySelector('.cta-title.split');
  if (ctaTitle && hasST) {
    const words = splitWords(ctaTitle);
    gsap.set(words, { yPercent: 110 });
    gsap.to(words, { yPercent: 0, duration: 0.9, ease: 'power3.out', stagger: 0.06,
      scrollTrigger: { trigger: ctaTitle, start: 'top 85%' } });
  }
}

/* ---------- Fade-up reveal ---------- */
const revealEls = Array.from(document.querySelectorAll('.reveal'));
if (motion && hasST) {
  revealEls.forEach(el => el.classList.add('pre'));
  ScrollTrigger.batch('.reveal', {
    start: 'top 88%',
    onEnter: batch => batch.forEach((el, i) => setTimeout(() => { el.classList.remove('pre'); el.classList.add('in'); }, i * 80)),
  });
} else if (motion && 'IntersectionObserver' in window) {
  revealEls.forEach(el => el.classList.add('pre'));
  const io = new IntersectionObserver((entries) => {
    entries.forEach(en => { if (en.isIntersecting) { en.target.classList.remove('pre'); en.target.classList.add('in'); io.unobserve(en.target); } });
  }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });
  revealEls.forEach(el => io.observe(el));
}

/* ---------- Kinetička traka (scroll-linked) ---------- */
if (motion && hasST) {
  const track = document.getElementById('marquee');
  if (track) gsap.to(track, { xPercent: -50, ease: 'none',
    scrollTrigger: { trigger: '.marquee', start: 'top bottom', end: 'bottom top', scrub: true } });
}

/* ---------- Parallax slika u karticama radova ---------- */
if (motion && hasST && isDesktop) {
  document.querySelectorAll('[data-parallax]').forEach(img => {
    gsap.fromTo(img, { yPercent: -5 }, { yPercent: 5, ease: 'none',
      scrollTrigger: { trigger: img.closest('.work-media'), start: 'top bottom', end: 'bottom top', scrub: true } });
  });
}

/* ---------- UTM capture ---------- */
const utmField = document.getElementById('utmField');
(function captureUtm() {
  try {
    const sp = new URLSearchParams(location.search);
    const keys = ['utm_source', 'utm_medium', 'utm_campaign', 'utm_content', 'utm_term'];
    const found = {};
    keys.forEach(k => { const v = sp.get(k); if (v) found[k] = v; });
    let stored = sessionStorage.getItem('vps_utm');
    if (Object.keys(found).length) { stored = JSON.stringify(found); sessionStorage.setItem('vps_utm', stored); }
    if (utmField && stored) utmField.value = stored;
  } catch (e) { /* no-op */ }
})();

/* ---------- Dvokoračna forma ---------- */
const form = document.getElementById('contactForm');
const projectType = document.getElementById('projectType');
const stepChosen = document.getElementById('stepChosen');
const stepBack = document.getElementById('stepBack');
const choiceGrid = document.getElementById('choiceGrid');

if (choiceGrid && form) {
  choiceGrid.querySelectorAll('.choice').forEach(btn => {
    btn.addEventListener('click', () => {
      const val = btn.dataset.value || '';
      if (projectType) projectType.value = val;
      if (stepChosen) stepChosen.innerHTML = `Odabrano: <b>${val}</b>`;
      form.setAttribute('data-step', '2');
      const firstInput = form.querySelector('.step-2 input[name="name"]');
      if (firstInput) setTimeout(() => firstInput.focus(), 50);
    });
  });
}
if (stepBack && form) {
  stepBack.addEventListener('click', () => {
    form.setAttribute('data-step', '1');
    if (projectType) projectType.value = '';
  });
}

/* ---------- Slanje forme (zadržan /api/send-email ugovor) ---------- */
const formStatus = form ? form.querySelector('.form-status') : null;
let lastSubmit = 0;
const COOLDOWN = 60000;

if (form) {
  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const now = Date.now();
    if (now - lastSubmit < COOLDOWN) {
      showStatus(`Pričekajte ${Math.ceil((COOLDOWN - (now - lastSubmit)) / 1000)} s prije ponovnog slanja.`, 'error');
      return;
    }
    const button = form.querySelector('button[type="submit"]');
    const original = button.textContent;
    button.textContent = 'Šaljem...';
    button.disabled = true;

    const fd = new FormData(form);
    const pt = (fd.get('projectType') || '').toString().trim();
    const utm = (fd.get('utm') || '').toString().trim();
    let message = (fd.get('message') || '').toString();
    const prefix = [];
    if (pt) prefix.push(`Vrsta projekta: ${pt}`);
    if (utm) prefix.push(`UTM: ${utm}`);
    if (prefix.length) message = prefix.join('\n') + '\n\n' + message;

    // Honeypot: ako je skriveno polje popunjeno, tiho "uspjeh" (bot)
    const hpVal = form.querySelector('input[name="hp"]')?.value || '';
    if (hpVal) {
      showStatus('Hvala! Vaš upit je poslan.', 'success');
      form.reset(); form.setAttribute('data-step', '1');
      button.textContent = original; button.disabled = false;
      return;
    }

    const data = {
      access_key: WEB3FORMS_KEY,
      subject: 'Novi upit — VP Solutions',
      from_name: 'VP Solutions web',
      name: fd.get('name'),
      email: fd.get('email'),
      message
    };

    try {
      const res = await fetch('https://api.web3forms.com/submit', {
        method: 'POST', headers: { 'Content-Type': 'application/json', Accept: 'application/json' }, body: JSON.stringify(data)
      });
      const result = await res.json();
      if (res.ok && result.success) {
        lastSubmit = now;
        showStatus('Hvala! Vaš upit je poslan. Javljam se na email u najkraćem roku.', 'success');
        form.reset();
        form.setAttribute('data-step', '1');
        if (projectType) projectType.value = '';
        if (typeof fbq === 'function') fbq('track', 'Lead');
      } else {
        showStatus(result.message || 'Došlo je do greške. Pokušajte ponovno.', 'error');
      }
    } catch (err) {
      showStatus(`Greška u mreži: ${err.message}. Pišite mi na email.`, 'error');
    }
    button.textContent = original;
    button.disabled = false;
  });
}

function showStatus(text, type) {
  if (!formStatus) return;
  formStatus.textContent = text;
  formStatus.className = `form-status ${type}`;
  clearTimeout(showStatus._t);
  showStatus._t = setTimeout(() => { formStatus.className = 'form-status'; }, 8000);
}

/* ---------- Sigurnosna mreža: sadržaj mora biti vidljiv ----------
   Ako animacija ne krene (npr. kartica učitana u pozadini, rAF pauziran),
   nakon kratkog vremena osiguraj da je hero i vidljivi sadržaj otkriven. */
setTimeout(() => {
  document.querySelectorAll('.hero-title .word i, .cta-title .word i').forEach(i => {
    if (hasGSAP) { try { gsap.set(i, { yPercent: 0 }); } catch (e) { i.style.transform = 'none'; } }
    else i.style.transform = 'none';
  });
  document.querySelectorAll('.reveal.pre').forEach(el => {
    if (el.getBoundingClientRect().top < window.innerHeight) { el.classList.remove('pre'); el.classList.add('in'); }
  });
}, 1800);

/* ---------- ts timestamp + godina ---------- */
document.addEventListener('DOMContentLoaded', () => {
  document.querySelectorAll('form#contactForm input[name="ts"]').forEach(el => { el.value = Date.now().toString(); });
  const y = document.getElementById('year');
  if (y) y.textContent = new Date().getFullYear();
});
