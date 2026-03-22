const { Client } = require('pg');

async function createDb() {
  const client = new Client({
    user: 'postgres',
    host: 'localhost',
    database: 'postgres',
    password: 'postgres',
    port: 5432,
  });

  try {
    await client.connect();
    // Drop db if exists forcefully (sometimes other connections keep it alive, but this is new)
    try {
        await client.query('DROP DATABASE IF EXISTS ai_sales_pilot;');
    } catch {}
    
    await client.query('CREATE DATABASE ai_sales_pilot;');
    console.log('Database ai_sales_pilot created successfully!');
  } catch (err) {
    if (err.message.includes('already exists')) {
        console.log('Database ai_sales_pilot already exists, continuing...');
    } else {
        console.error('Error creating db:', err);
    }
  } finally {
    await client.end();
  }
}

createDb();
