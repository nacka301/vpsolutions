// Vercel Serverless funkcija za slanje emaila preko Brevo (Sendinblue) + lagana anti-spam zaštita (honeypot + timing)
const SibApiV3Sdk = require('sib-api-v3-sdk');

module.exports = async function handler(req, res) {
  // Samo POST metoda
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  // Brevo API ključ iz environment varijabli
  const defaultClient = SibApiV3Sdk.ApiClient.instance;
  const apiKey = defaultClient.authentications['api-key'];
  apiKey.apiKey = process.env.BREVO_API_KEY;

  const {
    formType,
    name,
    email,
    phone,
    message,
    website,
    business,
    goals,
    hp,
    ts
  } = req.body || {};
  // Anti-spam: honeypot i minimalno vrijeme na formi
  if (hp && String(hp).trim() !== '') {
    // Tihi success (ne šaljemo email) kako bismo zavarali botove
    return res.status(200).json({ success: true, message: 'OK' });
  }
  const now = Date.now();
  const submittedAt = ts ? Number(ts) : 0;
  if (!submittedAt || isNaN(submittedAt) || (now - submittedAt) < 2000) {
    return res.status(400).json({ error: 'Molimo pošaljite zahtjev ponovno.' });
  }

  // Validacija i sanitizacija inputa
  const isAudit = (formType === 'audit');

  // Validacija polja po tipu forme
  if (isAudit) {
    if (!email || !website) {
      return res.status(400).json({ error: 'Molimo unesite email i URL web stranice.' });
    }
  } else {
    if (!name || !email || !message) {
      return res.status(400).json({ error: 'Molimo popunite sva obavezna polja' });
    }
  }

  // Email validacija
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return res.status(400).json({ error: 'Neispravna email adresa' });
  }

  // Sanitizacija - escapeanje HTML karaktera
  const escapeHtml = (text) => {
    const map = {
      '&': '&amp;',
      '<': '&lt;',
      '>': '&gt;',
      '"': '&quot;',
      "'": '&#039;'
    };
    return text.replace(/[&<>"']/g, m => map[m]);
  };

  const safe = (v) => v ? escapeHtml(String(v)) : '';
  const safeName = safe(name) || 'Nije navedeno';
  const safeEmail = safe(email);
  const safePhone = phone ? safe(phone) : 'Nije navedeno';
  const safeMessage = safe(message);
  const safeWebsite = safe(website);
  const safeBusiness = safe(business) || 'Nije navedeno';
  const safeGoals = safe(goals) || 'Nije navedeno';

  // Email koji će se poslati tebi
  const sendSmtpEmail = new SibApiV3Sdk.SendSmtpEmail();
  sendSmtpEmail.to = [{ email: 'vpsolutions.booking@gmail.com', name: 'VP Solutions' }];
  sendSmtpEmail.sender = { email: 'vpsolutions.booking@gmail.com', name: 'VP Solutions Website' };

  if (isAudit) {
    sendSmtpEmail.subject = `Novi mini‑audit zahtjev - ${safeWebsite}`;
    sendSmtpEmail.replyTo = { email: email, name: safeBusiness !== 'Nije navedeno' ? safeBusiness : 'Audit korisnik' };
    sendSmtpEmail.htmlContent = `
      <html>
        <body style="font-family: Arial, sans-serif; padding: 20px;">
          <h2 style="color: #6366f1;">Novi mini‑audit zahtjev</h2>
          <div style="background: #f8fafc; padding: 20px; border-radius: 10px; margin: 20px 0;">
            <p><strong>Web:</strong> <a href="${safeWebsite}" target="_blank" rel="noopener">${safeWebsite}</a></p>
            <p><strong>Brand/tvrtka:</strong> ${safeBusiness}</p>
            <p><strong>Email:</strong> <a href="mailto:${email}">${safeEmail}</a></p>
          </div>
          <h3 style="color: #334155;">Ciljevi / napomena:</h3>
          <div style="background: #ffffff; padding: 15px; border-left: 4px solid #6366f1;">
            <p>${safeGoals.replace(/\n/g, '<br>')}</p>
          </div>
        </body>
      </html>
    `;
    sendSmtpEmail.textContent = `
Mini-audit zahtjev

Web: ${website}
Brand/tvrtka: ${business || 'Nije navedeno'}
Email: ${email}

Ciljevi/napomena:
${goals || ''}
    `;
  } else {
    sendSmtpEmail.subject = `Novi upit sa stranice - ${safeName}`;
    sendSmtpEmail.replyTo = { email: email, name: safeName };
    sendSmtpEmail.htmlContent = `
      <html>
        <body style="font-family: Arial, sans-serif; padding: 20px;">
          <h2 style="color: #6366f1;">Novi upit sa stranice</h2>
          <div style="background: #f8fafc; padding: 20px; border-radius: 10px; margin: 20px 0;">
            <p><strong>Ime:</strong> ${safeName}</p>
            <p><strong>Email:</strong> <a href=\"mailto:${email}\">${safeEmail}</a></p>
            <p><strong>Telefon:</strong> ${safePhone}</p>
          </div>
          <h3 style="color: #334155;">Poruka:</h3>
          <div style="background: #ffffff; padding: 15px; border-left: 4px solid #6366f1;">
            <p>${safeMessage.replace(/\n/g, '<br>')}</p>
          </div>
        </body>
      </html>
    `;
    sendSmtpEmail.textContent = `
Novi upit sa stranice

Ime: ${name}
Email: ${email}
Telefon: ${phone || 'Nije navedeno'}

Poruka:
${message}
    `;
  }

  try {
    const apiInstance = new SibApiV3Sdk.TransactionalEmailsApi();
    await apiInstance.sendTransacEmail(sendSmtpEmail);

    // Auto‑odgovor korisniku
    if (email) {
      try {
        const ack = new SibApiV3Sdk.SendSmtpEmail();
        ack.to = [{ email: email }];
        ack.sender = { email: 'vpsolutions.booking@gmail.com', name: 'VP Solutions' };
        ack.subject = isAudit ? 'Mini‑audit zaprimljen ✅' : 'Vaš upit je zaprimljen ✅';
        ack.htmlContent = isAudit
          ? `
          <p>Pozdrav${safeBusiness && safeBusiness !== 'Nije navedeno' ? ' ' + safeBusiness : ''},</p>
          <p>Hvala Vam na interesu za mini‑audit. Pregledat ću stranicu <a href="${safeWebsite}">${safeWebsite}</a> i u roku 24 sata poslati 3 konkretne preporuke kako povećati broj upita.</p>
          <p>Lijep pozdrav,<br>VP Solutions</p>
          `
          : `
          <p>Pozdrav ${safeName !== 'Nije navedeno' ? safeName : ''},</p>
          <p>Hvala na poruci! Javit ću Vam se u roku 24 sata s povratnim informacijama.</p>
          <blockquote style="border-left: 4px solid #6366f1; padding-left: 10px; color:#334155;">
            ${safeMessage.replace(/\n/g, '<br>')}
          </blockquote>
          <p>Lijep pozdrav,<br>VP Solutions</p>
          `;
        await apiInstance.sendTransacEmail(ack);
      } catch (ackErr) {
        console.warn('Auto-ack email failed:', ackErr?.message);
      }
    }

    return res.status(200).json({ success: true, message: 'Email poslan!' });
  } catch (error) {
    console.error('Brevo greška:', error);
    console.error('Error response:', error.response);
    console.error('Error body:', error.response ? error.response.body : 'No body');
    
    return res.status(500).json({ 
      success: false, 
      error: 'Greška pri slanju emaila'
    });
  }
}
