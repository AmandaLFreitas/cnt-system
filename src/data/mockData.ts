
import { Student, AttendanceRecord, Course } from '../types';

export const mockStudents: Student[] = [
  {
    id: '1',
    fullName: 'Ana Clara Silva Santos',
    birthDate: '1995-03-15',
    course: 'Desenvolvimento Web Full Stack',
    email: 'ana.clara@email.com'
  },
  {
    id: '2',
    fullName: 'João Pedro Oliveira Costa',
    birthDate: '1998-07-22',
    course: 'Design Gráfico e UX/UI',
    email: 'joao.pedro@email.com'
  },
  {
    id: '3',
    fullName: 'Maria Eduarda Ferreira Lima',
    birthDate: '1997-11-08',
    course: 'Marketing Digital',
    email: 'maria.eduarda@email.com'
  },
  {
    id: '4',
    fullName: 'Carlos Eduardo Pereira Souza',
    birthDate: '1996-05-30',
    course: 'Desenvolvimento Web Full Stack',
    email: 'carlos.eduardo@email.com'
  },
  {
    id: '5',
    fullName: 'Beatriz Almeida Rodrigues',
    birthDate: '1999-09-12',
    course: 'Design Gráfico e UX/UI',
    email: 'beatriz.almeida@email.com'
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
