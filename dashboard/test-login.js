fetch('http://localhost:3000/api/auth/login', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ phone: 'baraka_anvar@hoyr.uz', password: '1' })
}).then(res => res.json()).then(console.log).catch(console.error);
