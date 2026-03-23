const jwt = require('jsonwebtoken');

// generate dummy token for ROP
const token = jwt.sign(
  { userId: '123', phone: '+998901111111', role: 'ROP', name: 'Test ROP' },
  process.env.JWT_SECRET || 'dev-only-secret-key-do-not-use-in-prod',
  { expiresIn: '7d' }
);

async function check() {
  try {
    const res = await fetch('http://localhost:3000/api/agents', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({
        name: 'Odilbek',
        phone: '+998931122334',
        password: 'securepass'
      })
    });
    
    const data = await res.json();
    console.log('Status:', res.status);
    console.log('Response:', data);
  } catch(e) {
    console.error('Fetch error:', e);
  }
}

check();
