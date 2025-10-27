// Hamburger menu
const hamburger = document.querySelector('.hamburger');
const navMenu = document.querySelector('.nav-menu');

hamburger.addEventListener('click', () => {
    navMenu.classList.toggle('active');
    hamburger.classList.toggle('active');
});

// Zatvori menu kada klikneš na link
document.querySelectorAll('.nav-menu a').forEach(link => {
    link.addEventListener('click', () => {
        navMenu.classList.remove('active');
        hamburger.classList.remove('active');
    });
});

// Smooth scrolling
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// Navbar scroll effect
window.addEventListener('scroll', () => {
    const navbar = document.querySelector('.navbar');
    if (window.scrollY > 100) {
        navbar.style.background = 'rgba(255, 255, 255, 0.98)';
        navbar.style.boxShadow = '0 2px 30px rgba(0, 0, 0, 0.15)';
    } else {
        navbar.style.background = 'rgba(255, 255, 255, 0.95)';
        navbar.style.boxShadow = '0 2px 20px rgba(0, 0, 0, 0.1)';
    }
});

// Animacija pri scrollanju
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -100px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
        }
    });
}, observerOptions);

// Dodaj animacije na sve kartice i elemente
document.querySelectorAll('.service-card, .portfolio-item, .stat-item').forEach(el => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(30px)';
    el.style.transition = 'all 0.6s ease-out';
    observer.observe(el);
});

// Kontakt forma sa rate limiting i GDPR
const contactForm = document.querySelector('.contact-form');
const formStatus = document.querySelector('.form-status');

// Rate limiting - sprečava spam
let lastSubmitTime = 0;
const SUBMIT_COOLDOWN = 60000; // 1 minuta između submita

if (contactForm) {
    contactForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        // Provjera rate limiting
        const now = Date.now();
        if (now - lastSubmitTime < SUBMIT_COOLDOWN) {
            const remainingSeconds = Math.ceil((SUBMIT_COOLDOWN - (now - lastSubmitTime)) / 1000);
            formStatus.textContent = `⏱️ Molimo pričekajte ${remainingSeconds} sekundi prije ponovnog slanja.`;
            formStatus.className = 'form-status error';
            formStatus.style.display = 'block';
            return;
        }
        
        const button = contactForm.querySelector('button[type="submit"]');
        const originalText = button.textContent;
        
        // Prikaži loading state
        button.textContent = 'Šaljem...';
        button.disabled = true;
        
        // Prikupi podatke iz forme
        const formData = new FormData(contactForm);
        const data = {
            name: formData.get('name'),
            email: formData.get('email'),
            phone: formData.get('phone'),
            message: formData.get('message'),
            hp: contactForm.querySelector('input[name="hp"]')?.value || '',
            ts: contactForm.querySelector('input[name="ts"]')?.value || ''
        };
        
        try {
            const response = await fetch('/api/send-email', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(data)
            });
            
            const result = await response.json();
            
            if (response.ok && result.success) {
                // Uspješno poslano
                lastSubmitTime = now; // Postavi vrijeme zadnjeg submita
                formStatus.textContent = '✅ Hvala! Vaš upit je poslan. Odgovorit ću Vam na email u najkraćem roku.';
                formStatus.className = 'form-status success';
                formStatus.style.display = 'block';
                contactForm.reset();
            } else {
                // Greška - prikaži detaljne informacije
                console.error('API Error Response:', result);
                let errorMsg = result.error || 'Došlo je do greške';
                if (result.details) errorMsg += ` (${result.details})`;
                if (result.brevoError) errorMsg += `\n\nBrevo: ${result.brevoError}`;
                if (result.apiKey) errorMsg += `\n${result.apiKey}`;
                
                formStatus.textContent = `❌ ${errorMsg}`;
                formStatus.className = 'form-status error';
                formStatus.style.display = 'block';
            }
        } catch (error) {
            console.error('Network/Parse Error:', error);
            formStatus.textContent = `❌ Network greška: ${error.message}. Kontaktirajte me na WhatsApp.`;
            formStatus.className = 'form-status error';
            formStatus.style.display = 'block';
        }
        
        // Vrati button u normalno stanje
        button.textContent = originalText;
        button.disabled = false;
        
        // Sakrij poruku nakon 7 sekundi
        setTimeout(() => {
            formStatus.style.display = 'none';
        }, 7000);
    });
}

// Mini‑audit forma
const auditForm = document.querySelector('#auditForm');
const auditStatus = document.querySelector('#auditStatus');

if (auditForm) {
    auditForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const btn = auditForm.querySelector('button[type="submit"]');
        const original = btn.textContent;
        btn.textContent = 'Šaljem...';
        btn.disabled = true;

        const fd = new FormData(auditForm);
        const payload = {
            formType: 'audit',
            website: fd.get('website'),
            business: fd.get('business'),
            email: fd.get('email'),
            goals: fd.get('goals') || '',
            hp: auditForm.querySelector('input[name="hp"]')?.value || '',
            ts: auditForm.querySelector('input[name="ts"]')?.value || ''
        };

        try {
            const resp = await fetch('/api/send-email', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            });
            const result = await resp.json();
            if (resp.ok && result.success) {
                auditStatus.textContent = '✅ Hvala! Mini‑audit stiže na email uskoro.';
                auditStatus.className = 'form-status success';
                auditStatus.style.display = 'block';
                auditForm.reset();
            } else {
                console.error('Audit API Error:', result);
                auditStatus.textContent = `❌ ${result.error || 'Greška pri slanju.'}`;
                auditStatus.className = 'form-status error';
                auditStatus.style.display = 'block';
            }
        } catch (err) {
            auditStatus.textContent = `❌ Network greška: ${err.message}`;
            auditStatus.className = 'form-status error';
            auditStatus.style.display = 'block';
        }

        btn.textContent = original;
        btn.disabled = false;

        setTimeout(() => (auditStatus.style.display = 'none'), 7000);
    });
}

// Postavi timestamp na učitavanje (anti-spam time check)
document.addEventListener('DOMContentLoaded', () => {
    const now = Date.now().toString();
    document.querySelectorAll('form.contact-form input[name="ts"]').forEach(el => {
        el.value = now;
    });
});

// Parallax efekat za hero sekciju
window.addEventListener('scroll', () => {
    const scrolled = window.pageYOffset;
    const heroAnimation = document.querySelector('.hero-animation');
    
    if (heroAnimation) {
        heroAnimation.style.transform = `translateY(${scrolled * 0.3}px)`;
    }
});

// Dodatne animacije za pristup sekciju
const approachObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry, index) => {
        if (entry.isIntersecting) {
            setTimeout(() => {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateX(0)';
            }, index * 100);
        }
    });
}, { threshold: 0.1 });

document.querySelectorAll('.approach-item').forEach(item => {
    item.style.opacity = '0';
    item.style.transform = 'translateX(-30px)';
    item.style.transition = 'all 0.6s ease-out';
    approachObserver.observe(item);
});

// Dodaj hover efekt na portfolio items
document.querySelectorAll('.portfolio-item').forEach(item => {
    item.addEventListener('mouseenter', function() {
        const placeholder = this.querySelector('.portfolio-placeholder');
        if (placeholder) {
            placeholder.style.transform = 'scale(1.1)';
        }
    });
    
    item.addEventListener('mouseleave', function() {
        const placeholder = this.querySelector('.portfolio-placeholder');
        if (placeholder) {
            placeholder.style.transform = 'scale(1)';
        }
    });
});

// Dark mode toggle (opcionalno - možeš dodati gumb za prebacivanje)
function toggleDarkMode() {
    document.body.classList.toggle('dark-mode');
    localStorage.setItem('darkMode', document.body.classList.contains('dark-mode'));
}

// Učitaj dark mode preference iz localStorage
if (localStorage.getItem('darkMode') === 'true') {
    document.body.classList.add('dark-mode');
}

// Portfolio modal funkcionalnost
const portfolioItems = document.querySelectorAll('.portfolio-item');
const modals = document.querySelectorAll('.portfolio-modal');
const modalCloses = document.querySelectorAll('.modal-close');

// Otvori modal kad klikneš na portfolio item
portfolioItems.forEach(item => {
    item.addEventListener('click', () => {
        const modalId = item.getAttribute('data-modal');
        const modal = document.getElementById(modalId);
        if (modal) {
            modal.classList.add('active');
            document.body.style.overflow = 'hidden'; // Blokiraj scroll
        }
    });
});

// Zatvori modal kad klikneš na X
modalCloses.forEach(close => {
    close.addEventListener('click', () => {
        const modal = close.closest('.portfolio-modal');
        modal.classList.remove('active');
        document.body.style.overflow = 'auto'; // Vrati scroll
    });
});

// Zatvori modal kad klikneš izvan njega
modals.forEach(modal => {
    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            modal.classList.remove('active');
            document.body.style.overflow = 'auto';
        }
    });
});

// Zatvori modal s ESC tipkom
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
        modals.forEach(modal => {
            modal.classList.remove('active');
        });
        document.body.style.overflow = 'auto';
    }
});

console.log('🚀 Stranica učitana - Made with ❤️ by David');
