import { Student, AttendanceRecord, Course, ClassSchedule } from '../types';

export const mockSchedules: ClassSchedule[] = [
  {
    id: '1',
    name: 'Manhã (Seg-Qui)',
    days: ['monday', 'tuesday', 'wednesday', 'thursday'],
    times: ['08:00-09:00', '09:00-10:00', '10:00-11:00'],
    hoursPerClass: 1
  },
  {
    id: '2',
    name: 'Tarde (Seg-Qui)',
    days: ['monday', 'tuesday', 'wednesday', 'thursday'],
    times: ['13:30-14:30', '14:30-15:30', '15:30-16:30', '16:30-17:30'],
    hoursPerClass: 1
  },
  {
    id: '3',
    name: 'Sábado Manhã',
    days: ['saturday'],
    times: ['08:00-10:00', '10:00-12:00'],
    hoursPerClass: 2
  },
  {
    id: '4',
    name: 'Horário Personalizado',
    days: [],
    times: [],
    hoursPerClass: 0
  }
];

export const mockStudents: Student[] = [
  {
    id: '1',
    fullName: 'Ana Clara Silva Santos',
    guardian: 'Maria Silva Santos',
    phone: '(11) 99999-1234',
    birthDate: '2005-03-15',
    course: 'Desenvolvimento Web Full Stack',
    courseStartDate: '2024-01-15',
    email: 'ana.clara@email.com',
    scheduleId: '1'
  },
  {
    id: '2',
    fullName: 'João Pedro Oliveira Costa',
    phone: '(11) 98888-5678',
    birthDate: '1998-07-22',
    course: 'Design Gráfico e UX/UI',
    courseStartDate: '2024-02-01',
    email: 'joao.pedro@email.com',
    scheduleId: '2'
  },
  {
    id: '3',
    fullName: 'Maria Eduarda Ferreira Lima',
    guardian: 'José Ferreira Lima',
    phone: '(11) 97777-9012',
    birthDate: '2006-11-08',
    course: 'Marketing Digital',
    courseStartDate: '2024-01-20',
    email: 'maria.eduarda@email.com',
    scheduleId: '4',
    customSchedule: {
      days: ['tuesday', 'thursday'],
      hoursPerDay: {
        tuesday: 2,
        thursday: 3
      }
    }
  },
  {
    id: '4',
    fullName: 'Carlos Eduardo Pereira Souza',
    phone: '(11) 96666-3456',
    birthDate: '1996-05-30',
    course: 'Desenvolvimento Web Full Stack',
    courseStartDate: '2024-01-15',
    email: 'carlos.eduardo@email.com',
    scheduleId: '4',
    customSchedule: {
      days: ['monday', 'wednesday', 'friday'],
      hoursPerDay: {
        monday: 1,
        wednesday: 2,
        friday: 1
      }
    }
  },
  {
    id: '5',
    fullName: 'Beatriz Almeida Rodrigues',
    guardian: 'Ana Almeida Rodrigues',
    phone: '(11) 95555-7890',
    birthDate: '2007-09-12',
    course: 'Design Gráfico e UX/UI',
    courseStartDate: '2024-02-01',
    email: 'beatriz.almeida@email.com',
    scheduleId: '4',
    customSchedule: {
      days: ['saturday'],
      hoursPerDay: {
        saturday: 4
      }
    }
  }
];

export const mockCourses: Course[] = [
  {
    id: '1',
    name: 'Desenvolvimento Web Full Stack',
    totalHours: 320,
    startDate: '2024-01-15',
    endDate: '2024-08-15'
  },
  {
    id: '2',
    name: 'Design Gráfico e UX/UI',
    totalHours: 280,
    startDate: '2024-02-01',
    endDate: '2024-07-30'
  },
  {
    id: '3',
    name: 'Marketing Digital',
    totalHours: 240,
    startDate: '2024-01-20',
    endDate: '2024-07-20'
  }
];

export const mockAttendanceRecords: AttendanceRecord[] = [
  // Ana Clara
  { id: '1', studentId: '1', date: '2024-06-01', status: 'present', classHours: 4 },
  { id: '2', studentId: '1', date: '2024-06-03', status: 'present', classHours: 4 },
  { id: '3', studentId: '1', date: '2024-06-05', status: 'absent', classHours: 0 },
  { id: '4', studentId: '1', date: '2024-06-08', status: 'present', classHours: 4 },
  { id: '5', studentId: '1', date: '2024-06-10', status: 'present', classHours: 4 },
  
  // João Pedro
  { id: '6', studentId: '2', date: '2024-06-01', status: 'present', classHours: 3 },
  { id: '7', studentId: '2', date: '2024-06-03', status: 'present', classHours: 3 },
  { id: '8', studentId: '2', date: '2024-06-05', status: 'present', classHours: 3 },
  { id: '9', studentId: '2', date: '2024-06-08', status: 'absent', classHours: 0 },
  
  // Maria Eduarda
  { id: '10', studentId: '3', date: '2024-06-01', status: 'present', classHours: 4 },
  { id: '11', studentId: '3', date: '2024-06-03', status: 'present', classHours: 4 },
  { id: '12', studentId: '3', date: '2024-06-05', status: 'present', classHours: 4 },
  { id: '13', studentId: '3', date: '2024-06-08', status: 'present', classHours: 4 },
  
  // Carlos Eduardo
  { id: '14', studentId: '4', date: '2024-06-01', status: 'absent', classHours: 0 },
  { id: '15', studentId: '4', date: '2024-06-03', status: 'present', classHours: 4 },
  { id: '16', studentId: '4', date: '2024-06-05', status: 'present', classHours: 4 },
  
  // Beatriz
  { id: '17', studentId: '5', date: '2024-06-01', status: 'present', classHours: 3 },
  { id: '18', studentId: '5', date: '2024-06-03', status: 'present', classHours: 3 },
  { id: '19', studentId: '5', date: '2024-06-05', status: 'absent', classHours: 0 }
];
