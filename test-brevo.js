// Test script za Brevo API
const SibApiV3Sdk = require('sib-api-v3-sdk');

// Brevo API ključ
const BREVO_API_KEY = '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';

const defaultClient = SibApiV3Sdk.ApiClient.instance;
const apiKey = defaultClient.authentications['api-key'];
apiKey.apiKey = BREVO_API_KEY;

const sendSmtpEmail = new SibApiV3Sdk.SendSmtpEmail();

sendSmtpEmail.subject = "TEST - Brevo API radi!";
sendSmtpEmail.to = [{ email: 'vpsolutions.booking@gmail.com', name: 'VP Solutions' }];
sendSmtpEmail.sender = { email: 'vpsolutions.booking@gmail.com', name: 'Test Script' };

sendSmtpEmail.htmlContent = `
  <html>
    <body>
      <h2>🎉 Brevo API radi savršeno!</h2>
      <p>Ako vidiš ovu poruku, znači da je Brevo API ključ ispravan i sve funkcionira.</p>
      <p><strong>Test uspješan!</strong></p>
    </body>
  </html>
`;

sendSmtpEmail.textContent = "TEST - Brevo API radi! Ako vidiš ovu poruku, sve funkcionira.";

console.log('📧 Šaljem test email preko Brevo API...\n');

const apiInstance = new SibApiV3Sdk.TransactionalEmailsApi();

apiInstance.sendTransacEmail(sendSmtpEmail)
  .then(function(data) {
    console.log('✅ SUCCESS! Email je poslan!');
    console.log('📬 Provjeri inbox: vpsolutions.booking@gmail.com');
    console.log('\nDetalji:', data);
  })
  .catch(function(error) {
    console.error('❌ GREŠKA pri slanju emaila:');
    console.error(error);
  });
