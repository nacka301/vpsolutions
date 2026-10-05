# VP Solutions - Portfolio Web Stranica

Moderna prezentacijska web stranica za usluge web developmenta, aplikacija i digitalnog marketinga.

## 🚀 Značajke

- **Responzivan dizajn** - Savršeno funkcionira na svim uređajima
- **Moderne animacije** - Smooth scrolling i interaktivni elementi
- **Portfolio modali** - Detaljan prikaz projekata
- **WhatsApp integracija** - Floating button za brzi kontakt
- **Kontakt forma** - Funkcionalana forma za poruke
- **SEO optimizirano** - Pripravljeno za tražilice

## 📁 Struktura projekta

```
vpsolutions/
├── index.html          # Glavna HTML stranica
├── privacy.html        # Politika privatnosti
├── style.css           # CSS stilovi
├── script.js           # JavaScript funkcionalnosti
├── api/
│   └── send-email.js   # Vercel serverless funkcija za kontakt formu (Brevo)
├── images/             # Slike (og-image, portfolio)
├── notes/              # Interne bilješke (SEO, Google My Business)
├── sitemap.xml         # Sitemap
├── robots.txt          # Upute za tražilice
├── package.json        # Ovisnosti (sib-api-v3-sdk)
└── README.md           # Dokumentacija
```

## 🎨 Sekcije

1. **Hero** - Uvodni banner s call-to-action
2. **Usluge** - Web stranice, Aplikacije, Marketing
3. **Portfolio** - Primjeri projekata s modalima
4. **O meni** - Zašto odabrati mene
5. **Kontakt** - Forma i kontakt informacije

## 📱 Kontakt

- **Email:** vpsolutions.booking@gmail.com

## 🌐 Deployment na Vercel

### Brzo postavljanje:

1. **Napravi GitHub repozitorij:**
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git branch -M main
   git remote add origin <tvoj-github-repo-url>
   git push -u origin main
   ```

2. **Deploy na Vercel:**
   - Idi na [vercel.com](https://vercel.com)
   - Klikni "Import Project"
   - Odaberi GitHub repozitorij
   - Klikni "Deploy"

### Ili koristi Vercel CLI:

```bash
# Instaliraj Vercel CLI (ako nemaš)
npm i -g vercel

# Deploy
vercel

# Production deploy
vercel --prod
```

## 🔧 Održavanje

### Promjena kontakt podataka:
- Email: `index.html` (kontakt sekcija) i `api/send-email.js` (adresa primatelja)
- WhatsApp broj: `index.html` (floating button href)

### Dodavanje portfolio projekata:
1. Dodaj novi `.portfolio-item` u HTML
2. Kreiraj odgovarajući `.portfolio-modal`
3. Ažuriraj JavaScript za otvaranje modala

### Promjena boja:
- Glavni CSS varijable se nalaze na vrhu `style.css`
- Promijeni `:root` varijable za cijelu temu

## 📊 Performanse

- ✅ Bez vanjskih dependencija (brzina učitavanja)
- ✅ Optimizirane slike (placeholderi s CSS)
- ✅ Minimalan JavaScript
- ✅ Clean HTML/CSS kod

## 🛠️ Tehnologije

- HTML5
- CSS3 (Grid, Flexbox, Animations)
- Vanilla JavaScript (bez frameworka)
- Responsive Design
- Progressive Enhancement

## 📝 Licenca

© 2025 VP Solutions. Sva prava pridržana.

---

**Izradio:** David
**Made with ❤️ in Croatia**
