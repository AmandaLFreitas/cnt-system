import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  try {
    console.log('Limpando banco de dados...');
    
    // Delete all attendance records first (FK constraint)
    await prisma.attendanceRecord.deleteMany({});
    console.log('✓ Attendance records deletados');
    
    // Delete all students
    await prisma.student.deleteMany({});
    console.log('✓ Students deletados');
    
    // Delete all courses
    await prisma.course.deleteMany({});
    console.log('✓ Courses deletados');
    
    console.log('✓ Banco de dados limpo com sucesso!');
  } catch (error) {
    console.error('Erro ao limpar banco:', error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

main();
