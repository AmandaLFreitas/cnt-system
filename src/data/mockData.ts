
import { Student, Course, AttendanceRecord } from '../types';

export const mockCourses: Course[] = [
  {
    id: '1',
    name: 'Informática Básica',
    totalHours: 80,
    startDate: '2024-01-15',
    endDate: '2024-04-15'
  },
  {
    id: '2', 
    name: 'Excel Avançado',
    totalHours: 60,
    startDate: '2024-02-01',
    endDate: '2024-05-01'
  },
  {
    id: '3',
    name: 'Word e PowerPoint',
    totalHours: 40,
    startDate: '2024-03-01',
    endDate: '2024-06-01'
  },
  {
    id: '4',
    name: 'Programação Web',
    totalHours: 120,
    startDate: '2024-01-10',
    endDate: '2024-07-10'
  },
  {
    id: '5',
    name: 'Design Gráfico',
    totalHours: 100,
    startDate: '2024-02-15',
    endDate: '2024-08-15'
  }
];

export const mockStudents: Student[] = [
  {
    id: '1',
    fullName: 'João Silva Santos',
    phone: '(11) 99999-9999',
    birthDate: '1995-03-15',
    course: 'Informática Básica',
    courseStartDate: '2024-01-15',
    schedule: {
      monday: ['mon-08-09', 'mon-09-10'],
      wednesday: ['wed-14-15', 'wed-15-16']
    }
  },
  {
    id: '2',
    fullName: 'Maria Oliveira Costa',
    phone: '(11) 98888-8888',
    birthDate: '1988-07-22',
    course: 'Excel Avançado',
    courseStartDate: '2024-02-01',
    schedule: {
      tuesday: ['tue-13-14', 'tue-14-15'],
      thursday: ['thu-15-16', 'thu-16-17']
    }
  },
  {
    id: '3',
    fullName: 'Pedro Mendes Lima',
    phone: '(11) 97777-7777',
    birthDate: '2010-12-10',
    guardian: 'Carlos Mendes',
    fatherName: 'Carlos Mendes Lima',
    motherName: 'Ana Paula Mendes',
    course: 'Word e PowerPoint',
    courseStartDate: '2024-03-01',
    schedule: {
      monday: ['mon-13-14'],
      wednesday: ['wed-13-14'],
      friday: []
    }
  },
  {
    id: '4',
    fullName: 'Ana Carolina Souza',
    phone: '(11) 96666-6666',
    birthDate: '1992-05-08',
    course: 'Programação Web',
    courseStartDate: '2024-01-10',
    email: 'ana.souza@email.com',
    address: 'Rua das Flores, 123 - Centro',
    schedule: {
      tuesday: ['tue-08-09', 'tue-09-10'],
      thursday: ['thu-08-09', 'thu-09-10'],
      saturday: ['sat-08-10']
    }
  },
  {
    id: '5',
    fullName: 'Roberto da Silva',
    phone: '(11) 95555-5555',
    birthDate: '1985-11-30',
    course: 'Design Gráfico',
    courseStartDate: '2024-02-15',
    cpf: '123.456.789-10',
    schedule: {
      monday: ['mon-15-16', 'mon-16-17'],
      wednesday: ['wed-15-16', 'wed-16-17'],
      saturday: ['sat-10-12']
    }
  },
  {
    id: '6',
    fullName: 'Carlos Alberto Pereira',
    phone: '(11) 94444-4444',
    birthDate: '1990-01-20',
    course: 'Informática Básica',
    courseStartDate: '2024-01-15',
    schedule: {
      monday: ['mon-10-11'],
      wednesday: ['wed-14-15']
    }
  },
  {
    id: '7',
    fullName: 'Júlia Fernandes',
    phone: '(11) 93333-3333',
    birthDate: '1998-09-12',
    course: 'Excel Avançado',
    courseStartDate: '2024-02-01',
    schedule: {
      tuesday: ['tue-15-16'],
      thursday: ['thu-16-17']
    }
  },
  {
    id: '8',
    fullName: 'Marcos Vinícius Pereira',
    phone: '(11) 92222-2222',
    birthDate: '1987-02-03',
    course: 'Programação Web',
    courseStartDate: '2024-01-10',
    schedule: {
      saturday: ['sat-08-10']
    }
  },
  {
    id: '9',
    fullName: 'Fernanda Souza',
    phone: '(11) 91111-1111',
    birthDate: '1993-06-18',
    course: 'Design Gráfico',
    courseStartDate: '2024-02-15',
    schedule: {
      tuesday: ['tue-08-09'],
      thursday: ['thu-09-10']
    }
  },
  {
    id: '10',
    fullName: 'Beatriz Lima',
    phone: '(11) 90000-0000',
    birthDate: '2001-11-01',
    course: 'Word e PowerPoint',
    courseStartDate: '2024-03-01',
    schedule: {
      monday: ['mon-09-10']
    }
  },
  {
    id: '11',
    fullName: 'André Santos',
    phone: '(11) 98877-6655',
    birthDate: '1996-04-05',
    course: 'Excel Avançado',
    courseStartDate: '2024-02-01',
    schedule: {
      tuesday: ['tue-13-14']
    }
  },
  {
    id: '12',
    fullName: 'Paula Nogueira',
    phone: '(11) 97766-5544',
    birthDate: '1999-08-22',
    course: 'Informática Básica',
    courseStartDate: '2024-01-15',
    schedule: {
      wednesday: ['wed-15-16']
    }
  },
  {
    id: '13',
    fullName: 'Tiago Oliveira',
    phone: '(11) 96655-4433',
    birthDate: '1989-12-30',
    course: 'Programação Web',
    courseStartDate: '2024-01-10',
    schedule: {
      thursday: ['thu-13-14'],
      saturday: ['sat-10-12']
    }
  }
];

export const mockAttendance: AttendanceRecord[] = [
  {
    id: '1',
    studentId: '1',
    date: '2024-01-15',
    status: 'present',
    classHours: 2
  },
  {
    id: '2',
    studentId: '1',
    date: '2024-01-17',
    status: 'absent',
    classHours: 2
  },
  {
    id: '3',
    studentId: '2',
    date: '2024-02-01',
    status: 'present',
    classHours: 2
  }
];
