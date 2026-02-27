import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

function isIso8601Z(s: string) {
  return /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(?:\.\d+)?Z$/.test(s);
}

async function main() {
  console.log('Scanning students.birth_date for non-ISO values...');
  // Use raw query to inspect stored values as returned by sqlite
  const rows: Array<{ id: string; birth_date: any }> = await prisma.$queryRaw`
    SELECT id, birth_date FROM students
  ` as any;

  const invalid: Array<{ id: string; value: any }> = [];

  for (const r of rows) {
    const v = r.birth_date;
    if (v === null || v === undefined) continue;
    if (typeof v === 'string') {
      if (!isIso8601Z(v)) invalid.push({ id: r.id, value: v });
    } else if (typeof v === 'number') {
      invalid.push({ id: r.id, value: v });
    } else if (v instanceof Date) {
      // OK
    } else {
      invalid.push({ id: r.id, value: v });
    }
  }

  if (invalid.length === 0) {
    console.log('OK: all birth_date values look ISO (or Date objects).');
    process.exit(0);
  }

  console.error('Found non-ISO birth_date values:');
  for (const it of invalid) {
    console.error(`- id=${it.id} value=${JSON.stringify(it.value)}`);
  }
  process.exit(2);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
