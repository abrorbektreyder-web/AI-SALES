const { Client } = require('pg');
require('dotenv').config();

async function main() {
  const url = process.env.DATABASE_URL;
  console.log('Checking tables in:', url.replace(/:[^:@]+@/, ':***@'));
  const client = new Client({ connectionString: url });
  try {
    await client.connect();
    const res = await client.query("SELECT tablename FROM pg_catalog.pg_tables WHERE schemaname = 'public'");
    console.log('Tables found:', res.rows.map(r => r.tablename));
    await client.end();
  } catch (e) {
    console.error('Failed!', e.message);
    process.exit(1);
  }
}

main();
