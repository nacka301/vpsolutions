# 📧 Kako Postaviti SendGrid

## Korak 1: Napravi SendGrid Account

1. Idi na: **https://sendgrid.com/**
2. Klikni **"Start for Free"**
3. Registriraj se (besplatno - 100 emaila/dan)
4. Potvrdi email

## Korak 2: Verificiraj Email Adresu (VAŽNO!)

1. U SendGrid dashboardu, idi na: **Settings → Sender Authentication**
2. Klikni **"Verify a Single Sender"**
3. Unesi podatke:
   - **From Name:** VP Solutions
   - **From Email:** vpsolutions.booking@gmail.com
   - **Reply To:** vpsolutions.booking@gmail.com
4. SendGrid će poslati verifikacijski email na **vpsolutions.booking@gmail.com**
5. **Otvori Gmail i klikni na link za verifikaciju**

## Korak 3: Kreiraj API Key

1. U SendGrid dashboardu, idi na: **Settings → API Keys**
2. Klikni **"Create API Key"**
3. **Name:** "VP Solutions Website"
4. **Permissions:** "Full Access" (ili samo "Mail Send")
5. Klikni **"Create & View"**
6. **VAŽNO:** Kopiraj API ključ (prikazuje se samo jednom!)
   - Npr: `SG.xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx`

## Korak 4: Dodaj API Key u Vercel

### A) Ako koristiš Vercel web interface:

1. Idi na: **https://vercel.com/**
2. Otvori svoj projekt
3. Idi na **Settings → Environment Variables**
4. Dodaj novu varijablu:
   - **Name:** `SENDGRID_API_KEY`
   - **Value:** (zalijepi svoj API key)
   - **Environments:** Production, Preview, Development (označi sve)
5. Klikni **"Save"**

### B) Ako koristiš Vercel CLI:

```bash
vercel env add SENDGRID_API_KEY
# Paste your API key when prompted
```

## Korak 5: Deploy na Vercel

```bash
# Instaliraj Vercel CLI (ako nemaš)
npm i -g vercel

# Deploy
vercel

# Ili za production
vercel --prod
```

## Korak 6: Testiraj

1. Otvori svoju stranicu na Vercelu
2. Ispuni kontakt formu
3. Klikni "Pošaljite upit"
4. Provjeri **vpsolutions.booking@gmail.com**

## 🎯 Struktura projekta:

```
moja_stranica/
├── api/
│   └── send-email.js       ← SendGrid serverless funkcija
├── index.html
├── style.css
├── script.js
├── package.json            ← Dependencies
└── vercel.json
```

## ❗ Važne napomene:

1. **Email mora biti verificiran** u SendGrid-u
2. **Besplatni plan:** 100 emaila/dan (dovoljno za početak)
3. **API ključ čuvaj sigurno** - nemoj ga dijeliti
4. Prva 30 dana možeš slati samo na verificirane emailove
5. Nakon 30 dana i verifikacije domena, možeš slati svima

## 🔧 Ako ne radi:

1. Provjeri je li email verificiran u SendGrid
2. Provjeri environment variable u Vercel dashboardu
3. Provjeri SendGrid activity log za greške
4. Re-deploy projekt nakon dodavanja API ključa

## 💰 Cijene:

- **Free:** 100 emaila/dan (dovoljno za početak)
- **Essentials:** $19.95/mj - 50,000 emaila/mj
- **Pro:** $89.95/mj - 1,500,000 emaila/mj

---

**Gotovo!** Sada sve poruke sa stranice stižu na tvoj Gmail! 🎉
