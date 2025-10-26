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

// Kontakt forma sa SendGrid (preko Vercel serverless funkcije)
const contactForm = document.querySelector('.contact-form');
const formStatus = document.querySelector('.form-status');

if (contactForm) {
    contactForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        
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
            message: formData.get('message')
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
                formStatus.textContent = '✅ Hvala! Vaš upit je poslan. Odgovorit ću Vam na email u najkraćem roku.';
                formStatus.className = 'form-status success';
                formStatus.style.display = 'block';
                contactForm.reset();
            } else {
                // Greška
                formStatus.textContent = '❌ Došlo je do greške. Pokušajte ponovo ili me kontaktirajte direktno na WhatsApp.';
                formStatus.className = 'form-status error';
                formStatus.style.display = 'block';
            }
        } catch (error) {
            formStatus.textContent = '❌ Došlo je do greške. Molim Vas kontaktirajte me direktno putem WhatsApp ili emaila.';
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

// WhatsApp floating button - sakrij ga na vrhu stranice
const whatsappFloat = document.querySelector('.whatsapp-float');

window.addEventListener('scroll', () => {
    if (window.scrollY > 300) {
        whatsappFloat.style.opacity = '1';
        whatsappFloat.style.visibility = 'visible';
    } else {
        whatsappFloat.style.opacity = '0';
        whatsappFloat.style.visibility = 'hidden';
    }
});

// Postavi početno stanje
if (whatsappFloat) {
    whatsappFloat.style.transition = 'all 0.3s ease';
    if (window.scrollY <= 300) {
        whatsappFloat.style.opacity = '0';
        whatsappFloat.style.visibility = 'hidden';
    }
}

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
