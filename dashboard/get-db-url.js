// file to get url
import { startPrismaDevServer } from '@prisma/dev';

async function main() {
  try {
    const server = await startPrismaDevServer({
      name: 'default',
      debug: false,
      persistenceMode: 'stateful'
    });
    console.log('ACTIVE_DATABASE_URL=' + server.database.prismaORMConnectionString);
    process.exit(0);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
}

main();
