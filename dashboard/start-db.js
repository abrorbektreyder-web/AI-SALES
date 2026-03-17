import { startPrismaDevServer } from '@prisma/dev';

async function main() {
  console.log('Starting Prisma Dev local database...');
  try {
    const server = await startPrismaDevServer({
      name: 'default',
      debug: true,
      persistenceMode: 'stateful'
    });
    console.log('Database started!');
    console.log('HTTP URL:', server.http.url);
    console.log('Database URL:', server.database.prismaORMConnectionString);
    
    // Keep the process alive
    process.stdin.resume();
  } catch (err) {
    if (err.name === 'ServerAlreadyRunningError') {
      console.log('Database server is already running.');
    } else {
      console.error('Failed to start database:', err);
    }
  }
}

main();
