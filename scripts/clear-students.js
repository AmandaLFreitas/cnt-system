const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function run() {
  const aBefore = await prisma.$queryRawUnsafe(`SELECT COUNT(*) AS c FROM "attendance_records" WHERE student_id IN (SELECT id FROM "students")`);
  const sBefore = await prisma.$queryRawUnsafe(`SELECT COUNT(*) AS c FROM "students"`);

  const attendancesToDelete = Number(aBefore[0].c || 0);
  const studentsToDelete = Number(sBefore[0].c || 0);

  if (attendancesToDelete > 0) {
    await prisma.$executeRawUnsafe(`DELETE FROM "attendance_records" WHERE student_id IN (SELECT id FROM "students")`);
  }

  if (studentsToDelete > 0) {
    await prisma.$executeRawUnsafe(`DELETE FROM "students"`);
  }

  // Reset sequence if applicable (SQLite only for INTEGER AUTOINCREMENT tables)
  let sequenceReset = false;
  const seqTbl = await prisma.$queryRawUnsafe(`SELECT name FROM sqlite_master WHERE type='table' AND name='sqlite_sequence'`);
  if (Array.isArray(seqTbl) && seqTbl.length > 0) {
    const seqRow = await prisma.$queryRawUnsafe(`SELECT name FROM sqlite_sequence WHERE name='students'`);
    if (Array.isArray(seqRow) && seqRow.length > 0) {
      await prisma.$executeRawUnsafe(`UPDATE sqlite_sequence SET seq=0 WHERE name='students'`);
      sequenceReset = true;
    }
  }

  const out = {
    attendanceDeleted: attendancesToDelete,
    studentsDeleted: studentsToDelete,
    sequenceReset,
    note: 'IDs de alunos são String (cuid); reset de sequence nem sempre se aplica.'
  };
  console.log(JSON.stringify(out, null, 2));
}

run().finally(async () => {
  await prisma.$disconnect();
});

