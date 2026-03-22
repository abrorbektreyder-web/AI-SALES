const { Client } = require('pg');

async function testPasswords() {
  const passwords = ['postgres', '1234', 'admin', 'root', 'password', '123456', 'qwerty', '', 'postgres123'];
  let found = false;

  for (const pwd of passwords) {
    const client = new Client({
      user: 'postgres',
      host: 'localhost',
      database: 'postgres',
      password: pwd,
      port: 5432,
    });

    try {
      await client.connect();
      console.log(`\n✅ MUVAFFAQIYATLI PAROL TOPILDI: '${pwd}'\n`);
      found = true;
      await client.end();
      break;
    } catch (err) {
      // ignore
    }
  }

  if (!found) {
    console.log('\n❌ KO\'P ISHLATILADIGAN PAROLLAR MOS KELMADI.\n');
  }
}

testPasswords();
