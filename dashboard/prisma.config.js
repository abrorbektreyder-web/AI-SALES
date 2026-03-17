import { defineConfig } from '@prisma/config';

export default defineConfig({
  schema: 'prisma/schema.prisma',
  // DATABASE_URL va boshqa sozlamalar avtomat ravishda env dan olinadi
});
