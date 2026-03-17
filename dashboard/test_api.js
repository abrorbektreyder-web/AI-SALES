
const fetch = require('node-fetch');

async function test() {
  const payload = {
    name: "Debug User",
    company: "MyCo",
    email: "debug" + Math.floor(Math.random() * 1000) + "@example.com",
    phone: "99890123" + Math.floor(Math.random() * 10000),
    password: "password123",
    role: "ROP"
  };

  console.log("Testing registration with payload:", payload);

  try {
    const res = await fetch("http://localhost:3000/api/auth/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload)
    });

    const data = await res.json();
    console.log("Status:", res.status);
    console.log("Response:", JSON.stringify(data, null, 2));
  } catch (err) {
    console.error("Error calling API:", err);
  }
}

test();
