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
process.env.BREVO_API_KEY = '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';

console.log('🧪 Testiram API funkciju lokalno...\n');

handler(req, res)
  .then(() => {
    console.log('\n✅ Test završen!');
  })
  .catch((error) => {
    console.error('\n❌ Error:', error);
  });
