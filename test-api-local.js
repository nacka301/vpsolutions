// Test lokalne Vercel serverless funkcije
const handler = require('./api/send-email.js');

// Mock request
const req = {
  method: 'POST',
  body: {
    name: 'Test Ime',
    email: 'test@example.com',
    phone: '0998535380',
    message: 'Test poruka'
  }
};

// Mock response
const res = {
  status: function(code) {
    console.log('Status:', code);
    return this;
  },
  json: function(data) {
    console.log('Response:', JSON.stringify(data, null, 2));
    return this;
  }
};

// Mock environment
// Postavi BREVO_API_KEY u okruženju prije pokretanja (npr. BREVO_API_KEY=... node test-api-local.js)

console.log('🧪 Testiram API funkciju lokalno...\n');

handler(req, res)
  .then(() => {
    console.log('\n✅ Test završen!');
  })
  .catch((error) => {
    console.error('\n❌ Error:', error);
  });
