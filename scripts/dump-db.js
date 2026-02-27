const { PrismaClient, Prisma } = require('@prisma/client');

const prisma = new PrismaClient();

async function main() {
  const tables = await prisma.$queryRawUnsafe(
    "SELECT name FROM sqlite_master WHERE type='table' AND name NOT LIKE 'sqlite_%' ORDER BY name;"
  );

  const result = [];
  for (const row of tables) {
    const name = row.name;
    const columns = await prisma.$queryRawUnsafe(`PRAGMA table_info('${name}')`);
    const records = await prisma.$queryRawUnsafe(`SELECT * FROM "${name}"`);
    result.push({
      table: name,
      structure: columns.map(c => ({ cid: c.cid, name: c.name, type: c.type, notnull: !!c.notnull, dflt_value: c.dflt_value, pk: !!c.pk })),
      rows: records,
    });
  }

  const replacer = (_k, v) => (typeof v === 'bigint' ? v.toString() : v);
  const json = JSON.stringify(result, replacer, 2);
  const fs = require('fs');
  fs.writeFileSync(require('path').join(__dirname, 'db_dump.json'), json);
  process.stdout.write(json);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
