# 📧 Kako Postaviti Formspree Za Kontakt Formu

## Korak 1: Registracija na Formspree (BESPLATNO)

1. Idi na: **https://formspree.io/**
2. Klikni **"Get Started"** ili **"Sign Up"**
3. Registriraj se s emailom: **vpsolutions.booking@gmail.com**
4. Potvrdi email (proveri inbox)

## Korak 2: Kreiraj Novi Form

1. Nakon logina, klikni **"+ New Form"**
2. **Name:** "VP Solutions - Contact Form"
3. **Email:** vpsolutions.booking@gmail.com (ovdje će stizati upiti!)
4. Klikni **"Create Form"**

## Korak 3: Kopiraj Form ID

Nakon kreiranja, vidjet ćeš nešto kao:

```
https://formspree.io/f/xyzABC123
```

**VAŽNO:** Kopiraj samo zadnji dio: `xyzABC123`

## Korak 4: Stavi Form ID u HTML

1. Otvori `index.html`
2. Pronađi liniju (oko linije 290):
   ```html
   <form class="contact-form" id="contactForm" action="https://formspree.io/f/YOUR_FORM_ID" method="POST">
   ```
3. Zamijeni `YOUR_FORM_ID` sa svojim ID-em:
   ```html
   <form class="contact-form" id="contactForm" action="https://formspree.io/f/xyzABC123" method="POST">
   ```

## Korak 5: Testiraj!

1. Otvori stranicu u browseru
2. Ispuni kontakt formu
3. Klikni "Pošaljite upit"
4. Proveri email: **vpsolutions.booking@gmail.com**

## 🎯 Što će se dogoditi:

- ✅ Svaki upit sa stranice stiže na tvoj Gmail
- ✅ Formspree šalje email s podacima: ime, email, poruka
- ✅ Možeš odgovarati direktno iz Gmaila
- ✅ **BESPLATNO** za prvih 50 upita mjesečno
- ✅ Nakon 50, moraš uzeti paid plan ($10/mj) ili kreirati novi account

## 📊 Gdje vidjet upite:

### Opcija 1: Gmail
- Svi upiti stižu na: vpsolutions.booking@gmail.com
- Format: "New submission from VP Solutions - Contact Form"

### Opcija 2: Formspree Dashboard
- Idi na: https://formspree.io/forms
- Vidi sve upite, exportaj ih, itd.

## 🔧 Dodatne opcije (opcionalno):

### Auto-reply klijentima:
1. U Formspree dashboardu, idi na form
2. Settings → Auto-reply
3. Uključi i napiši poruku koja će se automatski slati klijentima

### Email notifikacije:
- Već uključeno po defaultu
- Svaki upit = email notifikacija

### Spam zaštita:
- Formspree već ima reCAPTCHA zaštitu ugrađenu

## ❓ Problem?

Ako ne radi:
1. Provjeri jesi li zamijenio `YOUR_FORM_ID` sa pravim ID-em
2. Provjeri da je email potvrđen u Formspree
3. Provjeri spam folder u Gmailu
4. Kontaktiraj Formspree support (jako brzi su!)

---

**Gotovo!** Sada će svi upiti sa stranice stizati direktno na tvoj email! 🎉
