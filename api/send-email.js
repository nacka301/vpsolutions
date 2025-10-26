// Vercel Serverless funkcija za slanje emaila preko Brevo (Sendinblue)
const SibApiV3Sdk = require('sib-api-v3-sdk');

export default async function handler(req, res) {
  // Samo POST metoda
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  // Brevo API ključ iz environment varijabli
  const defaultClient = SibApiV3Sdk.ApiClient.instance;
  const apiKey = defaultClient.authentications['api-key'];
  apiKey.apiKey = process.env.BREVO_API_KEY;

  const { name, email, phone, message } = req.body;

  // Email koji će se poslati tebi
  const sendSmtpEmail = new SibApiV3Sdk.SendSmtpEmail();
  
  sendSmtpEmail.subject = `Novi upit sa stranice - ${name}`;
  sendSmtpEmail.to = [{ email: 'vpsolutions.booking@gmail.com', name: 'VP Solutions' }];
  sendSmtpEmail.replyTo = { email: email, name: name };
  sendSmtpEmail.sender = { email: 'vpsolutions.booking@gmail.com', name: 'VP Solutions Website' };
  
  sendSmtpEmail.htmlContent = `
    <html>
      <body style="font-family: Arial, sans-serif; padding: 20px;">
        <h2 style="color: #6366f1;">Novi upit sa stranice</h2>
        <div style="background: #f8fafc; padding: 20px; border-radius: 10px; margin: 20px 0;">
          <p><strong>Ime:</strong> ${name}</p>
          <p><strong>Email:</strong> <a href="mailto:${email}">${email}</a></p>
          <p><strong>Telefon:</strong> ${phone || 'Nije navedeno'}</p>
        </div>
        <h3 style="color: #334155;">Poruka:</h3>
        <div style="background: #ffffff; padding: 15px; border-left: 4px solid #6366f1;">
          <p>${message.replace(/\n/g, '<br>')}</p>
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
