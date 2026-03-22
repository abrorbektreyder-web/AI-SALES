import { startPrismaDevServer } from '@prisma/dev';
import fs from 'fs';

async function main() {
  try {
    const server = await startPrismaDevServer({
      name: 'default',
      debug: false,
      persistenceMode: 'stateful'
    });
    const dbUrl = server.database.prismaORMConnectionString;
    console.log('Database URL:', dbUrl);
    
    let env = fs.readFileSync('.env', 'utf-8');
    env = env.replace(/^DATABASE_URL=.*$/m, `DATABASE_URL="${dbUrl}"`);
    fs.writeFileSync('.env', env);
    console.log('Updated .env successfully. Keeping alive...');
    
    // Also update Python engine .env if necessary
    try {
      let pyEnv = fs.readFileSync('../ai-engine/.env', 'utf-8');
      pyEnv = pyEnv.replace(/^DATABASE_URL=.*$/m, `DATABASE_URL="${dbUrl}"`);
      fs.writeFileSync('../ai-engine/.env', pyEnv);
      console.log('Updated ai-engine .env successfully.');
    } catch (e) {
       // Ignore if not found
    }

    // keep alive without stdin
    setInterval(() => {}, 3600000);
  } catch (err) {
    if (err.name === 'ServerAlreadyRunningError') {
      console.log('ServerAlreadyRunningError - Please kill old instance first.');
    } else {
      console.error(err);
    }
  }
}
main();
