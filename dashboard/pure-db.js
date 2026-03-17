import { PGlite } from '@electric-sql/pglite';
import { PGLiteSocketServer } from '@electric-sql/pglite-socket';

async function main() {
  const dataDir = 'C:\\Users\\Asus\\AppData\\Local\\prisma-dev-default\\.pglite';
  console.log('Starting PGlite DB on port 51214...');
  
  const db = new PGlite(dataDir);
  const server = new PGLiteSocketServer({
    db: db,
    port: 51214
  });

  await server.start();
  console.log('---DATABASE_READY_ON_51214---');
  
  // Keep process alive
  setInterval(() => {}, 1000);
}

main().catch(err => {
  console.error('CRITICAL_DB_ERROR:', err);
  process.exit(1);
});
