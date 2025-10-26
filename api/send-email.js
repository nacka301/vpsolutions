// Vercel Serverless funkcija za slanje emaila preko Brevo (Sendinblue)
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

  const { name, email, phone, message } = req.body;

  // Validacija i sanitizacija inputa
  if (!name || !email || !message) {
    return res.status(400).json({ error: 'Molimo popunite sva obavezna polja' });
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

  const safeName = escapeHtml(name);
  const safeEmail = escapeHtml(email);
  const safePhone = phone ? escapeHtml(phone) : 'Nije navedeno';
  const safeMessage = escapeHtml(message);

  // Email koji će se poslati tebi
  const sendSmtpEmail = new SibApiV3Sdk.SendSmtpEmail();
  
  sendSmtpEmail.subject = `Novi upit sa stranice - ${safeName}`;
  sendSmtpEmail.to = [{ email: 'vpsolutions.booking@gmail.com', name: 'VP Solutions' }];
  sendSmtpEmail.replyTo = { email: email, name: safeName };
  sendSmtpEmail.sender = { email: 'vpsolutions.booking@gmail.com', name: 'VP Solutions Website' };
  
  sendSmtpEmail.htmlContent = `
    <html>
      <body style="font-family: Arial, sans-serif; padding: 20px;">
        <h2 style="color: #6366f1;">Novi upit sa stranice</h2>
        <div style="background: #f8fafc; padding: 20px; border-radius: 10px; margin: 20px 0;">
          <p><strong>Ime:</strong> ${safeName}</p>
          <p><strong>Email:</strong> <a href="mailto:${email}">${safeEmail}</a></p>
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

  try {
    const apiInstance = new SibApiV3Sdk.TransactionalEmailsApi();
    await apiInstance.sendTransacEmail(sendSmtpEmail);
    
    return res.status(200).json({ success: true, message: 'Email poslan!' });
  } catch (error) {
    console.error('Brevo greška:', error);
    return res.status(500).json({ 
      success: false, 
      error: 'Greška pri slanju emaila',
      details: error.message 
    });
  }
}
