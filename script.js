// VP Solutions — interakcije (jednostavno, bez frameworka)

// ---------- Mobilni izbornik (full screen) ----------
const navToggle = document.getElementById('navToggle');
const mobileMenu = document.getElementById('mobileMenu');

function setMenu(open) {
  if (!mobileMenu || !navToggle) return;
  mobileMenu.classList.toggle('open', open);
  mobileMenu.setAttribute('aria-hidden', String(!open));
  navToggle.setAttribute('aria-expanded', String(open));
  navToggle.innerHTML = open
    ? '<svg class="icon" aria-hidden="true"><use href="#i-x"/></svg>'
    : '<svg class="icon" aria-hidden="true"><use href="#i-menu"/></svg>';
  document.body.style.overflow = open ? 'hidden' : '';
}

if (navToggle) {
  navToggle.addEventListener('click', () => setMenu(!mobileMenu.classList.contains('open')));
}
if (mobileMenu) {
  mobileMenu.querySelectorAll('a').forEach(link => link.addEventListener('click', () => setMenu(false)));
}
document.addEventListener('keydown', (e) => { if (e.key === 'Escape') setMenu(false); });

// ---------- Navbar blur pri scrollu + sticky CTA ----------
const navbar = document.getElementById('navbar');
const stickyCta = document.getElementById('stickyCta');
const hero = document.getElementById('home');
const contactSection = document.getElementById('kontakt');

function onScroll() {
  const y = window.scrollY;
  if (navbar) navbar.classList.toggle('scrolled', y > 24);

  // Sticky CTA: pojavi se nakon hero, a sakrij se kad dođemo do kontakta
  if (stickyCta && hero) {
    let show = y > hero.offsetHeight - 120;
    if (contactSection && contactSection.getBoundingClientRect().top < window.innerHeight) {
      show = false;
    }
    stickyCta.classList.toggle('show', show);
    stickyCta.setAttribute('aria-hidden', String(!show));
  }
}
window.addEventListener('scroll', onScroll, { passive: true });
onScroll();

// ---------- Fade-up reveal (poštuje prefers-reduced-motion) ----------
const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const revealEls = document.querySelectorAll('.reveal');

if (prefersReduced || !('IntersectionObserver' in window)) {
  revealEls.forEach(el => el.classList.add('is-visible'));
} else {
  const io = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        io.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });
  revealEls.forEach(el => io.observe(el));
}

// ---------- Chips: vrsta projekta ----------
const chipGroup = document.getElementById('projectChips');
const projectTypeInput = document.getElementById('projectType');
if (chipGroup && projectTypeInput) {
  chipGroup.querySelectorAll('.chip').forEach(chip => {
    chip.addEventListener('click', () => {
      const wasActive = chip.classList.contains('active');
      chipGroup.querySelectorAll('.chip').forEach(c => {
        c.classList.remove('active');
        c.setAttribute('aria-pressed', 'false');
      });
      if (!wasActive) {
        chip.classList.add('active');
        chip.setAttribute('aria-pressed', 'true');
        projectTypeInput.value = chip.dataset.value || '';
      } else {
        projectTypeInput.value = '';
      }
    });
  });
}

// ---------- Kontakt forma (zadržan API ugovor: /api/send-email) ----------
const contactForm = document.querySelector('.contact-form');
const formStatus = contactForm ? contactForm.querySelector('.form-status') : null;

let lastSubmitTime = 0;
const SUBMIT_COOLDOWN = 60000; // 1 min između slanja

if (contactForm) {
  contactForm.addEventListener('submit', async (e) => {
    e.preventDefault();

    const now = Date.now();
    if (now - lastSubmitTime < SUBMIT_COOLDOWN) {
      const remaining = Math.ceil((SUBMIT_COOLDOWN - (now - lastSubmitTime)) / 1000);
      showStatus(`Molimo pričekajte ${remaining} s prije ponovnog slanja.`, 'error');
      return;
    }

    const button = contactForm.querySelector('button[type="submit"]');
    const originalText = button.textContent;
    button.textContent = 'Šaljem...';
    button.disabled = true;

    const fd = new FormData(contactForm);
    const projectType = (fd.get('projectType') || '').toString().trim();
    let message = (fd.get('message') || '').toString();
    if (projectType) message = `Vrsta projekta: ${projectType}\n\n${message}`;

    const data = {
      name: fd.get('name'),
      email: fd.get('email'),
      message: message,
      hp: contactForm.querySelector('input[name="hp"]')?.value || '',
      ts: contactForm.querySelector('input[name="ts"]')?.value || ''
    };

    try {
      const response = await fetch('/api/send-email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });
      const result = await response.json();

      if (response.ok && result.success) {
        lastSubmitTime = now;
        showStatus('Hvala! Vaš upit je poslan. Javljamo se na email u najkraćem roku.', 'success');
        contactForm.reset();
        contactForm.querySelectorAll('.chip').forEach(c => c.classList.remove('active'));
        if (projectTypeInput) projectTypeInput.value = '';
      } else {
        showStatus(result.error || 'Došlo je do greške. Pokušajte ponovno.', 'error');
      }
    } catch (error) {
      showStatus(`Greška u mreži: ${error.message}. Pišite nam na email.`, 'error');
    }

    button.textContent = originalText;
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

// ---------- Anti-spam timestamp + godina ----------
document.addEventListener('DOMContentLoaded', () => {
  const nowStr = Date.now().toString();
  document.querySelectorAll('form.contact-form input[name="ts"]').forEach(el => { el.value = nowStr; });

  const yearEl = document.getElementById('year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();
});
