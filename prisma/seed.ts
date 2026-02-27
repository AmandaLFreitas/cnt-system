import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  const courses = [
    { name: 'Informática Básica', totalHours: 80, startDate: '2024-01-15T00:00:00Z', endDate: '2024-04-15T23:59:59Z' },
    { name: 'Excel Avançado', totalHours: 60, startDate: '2024-02-01T00:00:00Z', endDate: '2024-05-01T23:59:59Z' },
    { name: 'Word e PowerPoint', totalHours: 40, startDate: '2024-03-01T00:00:00Z', endDate: '2024-06-01T23:59:59Z' },
    { name: 'Programação Web', totalHours: 120, startDate: '2024-01-10T00:00:00Z', endDate: '2024-07-10T23:59:59Z' },
    { name: 'Design Gráfico', totalHours: 100, startDate: '2024-02-15T00:00:00Z', endDate: '2024-08-15T23:59:59Z' },
  ];

  const createdCourses = [] as { id: string; name: string }[];
  for (const c of courses) {
    const upserted = await prisma.course.upsert({
      where: { name: c.name },
      update: {},
      create: {
        name: c.name,
        totalHours: c.totalHours,
        startDate: new Date(c.startDate),
        endDate: new Date(c.endDate),
      },
    });
    createdCourses.push({ id: upserted.id, name: upserted.name });
  }

  const findCourseId = (name: string) => createdCourses.find(c => c.name === name)?.id as string;

  const students = [
    { fullName: 'João Silva Santos', phone: '(11) 99999-9999', birthDate: '1995-03-15T00:00:00Z', courseName: 'Informática Básica' },
    { fullName: 'Maria Oliveira Costa', phone: '(11) 98888-8888', birthDate: '1988-07-22T00:00:00Z', courseName: 'Excel Avançado' },
    { fullName: 'Pedro Mendes Lima', phone: '(11) 97777-7777', birthDate: '2010-12-10T00:00:00Z', guardian: 'Carlos Mendes', fatherName: 'Carlos Mendes Lima', motherName: 'Ana Paula Mendes', courseName: 'Word e PowerPoint' },
    { fullName: 'Ana Carolina Souza', phone: '(11) 96666-6666', birthDate: '1992-05-08T00:00:00Z', email: 'ana.souza@email.com', courseName: 'Programação Web' },
    { fullName: 'Roberto da Silva', phone: '(11) 95555-5555', birthDate: '1985-11-30T00:00:00Z', cpf: '123.456.789-10', courseName: 'Design Gráfico' },
  ];

  for (const s of students) {
    const courseId = findCourseId(s.courseName);
    await prisma.student.create({
      data: {
        fullName: s.fullName,
        phone: s.phone,
        birthDate: new Date(s.birthDate),
        email: s.email,
        cpf: s.cpf,
        guardian: s.guardian,
        fatherName: s.fatherName,
        motherName: s.motherName,
        course: { connect: { id: courseId } },
      },
    });
  }
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

