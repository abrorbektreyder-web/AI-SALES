const { Client } = require('pg');

async function check(url) {
  const client = new Client({ connectionString: url });
  try {
    await client.connect();
    const res = await client.query('SELECT 1');
    console.log('Success for url:', url);
    await client.end();
  } catch (e) {
    console.log('Failed for url:', url, e.message);
  }
}

async function main() {
  await check('postgresql://postgres:postgres@localhost:5432/postgres');
  await check('postgresql://postgres:postgres@localhost:5432/ai_sales');
  await check('postgresql://postgres:postgres@localhost:5432/ai_sales_pilot');
}

main();
