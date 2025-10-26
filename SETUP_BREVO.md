# 📧 Kako Postaviti Brevo (Sendinblue)

## ✅ Prednosti Brevo:

- **300 emaila/dan BESPLATNO** (vs SendGrid 100/dan)
- Jednostavnije postavljanje
- Nema potrebe za verifikacijom emaila prvih 30 dana
- Bolji besplatni plan

## Korak 1: Napravi Brevo Account

1. Idi na: **https://www.brevo.com/**
2. Klikni **"Sign up free"**
3. Registriraj se s emailom: **vpsolutions.booking@gmail.com**
4. Potvrdi email u inboxu

## Korak 2: Kreiraj API Key

1. U Brevo dashboardu, klikni na **profil** (gore desno)
2. Odaberi **"SMTP & API"**
3. U sekciji **"API Keys"**, klikni **"Generate a new API key"**
4. **Name:** "VP Solutions Website"
5. Klikni **"Generate"**
6. **VAŽNO:** Kopiraj API ključ (prikazuje se samo jednom!)
   - Npr: `xkeysib-xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx`

## Korak 3: Dodaj Sender Email (Opcionalno ali preporučeno)

1. U Brevo dashboardu, idi na **"Senders"**
2. Klikni **"Add a sender"**
3. Unesi:
   - **Email:** vpsolutions.booking@gmail.com
   - **Name:** VP Solutions
4. Provjeriti Gmail za verifikacijski link
5. Klikni link i potvrdi

## Korak 4: Instaliraj Dependencies

```bash
cd c:\Users\David\Documents\stranice\moja_stranica
npm install
```

## Korak 5: Dodaj API Key u Vercel

### A) Preko Vercel web interface:

1. Idi na: **https://vercel.com/**
2. Otvori svoj projekt
3. Idi na **Settings → Environment Variables**
4. Dodaj novu varijablu:
   - **Name:** `BREVO_API_KEY`
   - **Value:** (zalijepi svoj Brevo API key)
   - **Environments:** Označi sve (Production, Preview, Development)
5. Klikni **"Save"**

### B) Preko Vercel CLI:

```bash
vercel env add BREVO_API_KEY
# Paste your API key when prompted
```

## Korak 6: Deploy na Vercel

```bash
# Instaliraj Vercel CLI (ako nemaš)
npm i -g vercel

# Deploy
vercel

# Production deploy
vercel --prod
```

## Korak 7: Testiraj

1. Otvori svoju stranicu na Vercelu
2. Scroll do kontakt forme
3. Ispuni formu i klikni "Pošaljite upit"
4. Provjeri **vpsolutions.booking@gmail.com** - trebao bi dobiti email!

## 📊 Brevo Dashboard - Praćenje Emailova

1. U Brevo dashboardu, idi na **"Statistics"**
2. Možeš vidjeti:
   - Koliko emailova je poslano
   - Tko ih je primio
   - Kada su poslani
   - Da li su otvoreni (ako uključiš tracking)

## 🎯 Struktura projekta:

```
moja_stranica/
├── api/
│   └── send-email.js       ← Brevo serverless funkcija
├── index.html
├── style.css
├── script.js
├── package.json            ← Brevo SDK dependency
└── vercel.json
```

## 💰 Brevo Cijene (vs SendGrid):

### Brevo FREE Plan:
- ✅ **300 emaila/dan**
- ✅ Neograničen broj kontakata
- ✅ Email kampanje
- ✅ SMS (9 SMS kredita)

### SendGrid FREE Plan:
- ❌ Samo 100 emaila/dan
- ❌ Samo 30 dana bez domenе verifikacije

## 🔧 Troubleshooting:

### Ako ne radi:
1. Provjeri je li API key ispravno kopiran
2. Provjeri environment variable u Vercel dashboardu
3. Re-deploy nakon dodavanja API ključa
4. Provjeri Brevo dashboard za greške u "Logs"

### Greška: "Unauthorized"
- API ključ nije ispravno postavljen u Vercel environment variables

### Greška: "Sender not verified"
- Dodaj i verificiraj sender email u Brevo dashboardu

## 📧 Napomena o Gmail-u:

Brevo će slati emailove s tvojeg Gmail-a (**vpsolutions.booking@gmail.com**), ali:
- Emails mogu završiti u **spam folderu** prvi put
- Označi ih kao "not spam" da bi budući mailovi dolazili u inbox
- Ili postavi SPF/DKIM zapise za domenu (naprednija opcija)

---

**Gotovo!** Sada sve poruke sa stranice stižu na tvoj Gmail preko Brevo! 🎉

**Besplatno:** 300 emaila/dan - više nego dovoljno! 🚀
