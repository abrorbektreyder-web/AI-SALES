const { Client } = require('pg');
require('dotenv').config();

async function main() {
  const url = process.env.DATABASE_URL;
  console.log('Testing connection to:', url.replace(/:[^:@]+@/, ':***@'));
  const client = new Client({ connectionString: url });
  try {
    await client.connect();
    const res = await client.query('SELECT now()');
    console.log('Success!', res.rows[0]);
    await client.end();
  } catch (e) {
    console.error('Failed!', e.message);
    process.exit(1);
  }
}

main();
