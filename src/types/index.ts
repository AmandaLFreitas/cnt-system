
export interface Student {
  id: string;
  fullName: string;
  cpf?: string;
  guardian?: string; // Responsável (se menor de idade)
  fatherName?: string; // Nome do pai (se menor)
  motherName?: string; // Nome da mãe (se menor)
  phone: string;
  birthDate: string;
  course: string;
  courseStartDate: string;
  email?: string;
  address?: string;
  schedule: StudentSchedule; // Horário específico do aluno
  isCompleted?: boolean; // Se o curso foi finalizado
  completionDate?: string; // Data de finalização do curso
}

export interface StudentSchedule {
  monday?: string[];
  tuesday?: string[];
  wednesday?: string[];
  thursday?: string[];
  friday?: string[];
  saturday?: string[];
}

export type WeekDay = 'monday' | 'tuesday' | 'wednesday' | 'thursday' | 'friday' | 'saturday';

export interface AttendanceRecord {
  id: string;
  studentId: string;
  date: string;
  status: 'present' | 'absent';
  classHours: number;
}

export interface Course {
  id: string;
  name: string;
  totalHours: number;
  startDate: string;
  endDate: string;
}

// Horários disponíveis por dia
export interface TimeSlot {
  id: string;
  time: string;
  hours: number;
}

export const AVAILABLE_TIMES: { [key in WeekDay]: TimeSlot[] } = {
  monday: [
    { id: 'mon-08-09', time: '08:00 - 09:00', hours: 1 },
    { id: 'mon-09-10', time: '09:00 - 10:00', hours: 1 },
    { id: 'mon-10-11', time: '10:00 - 11:00', hours: 1 },
    { id: 'mon-13-14', time: '13:30 - 14:30', hours: 1 },
    { id: 'mon-14-15', time: '14:30 - 15:30', hours: 1 },
    { id: 'mon-15-16', time: '15:30 - 16:30', hours: 1 },
    { id: 'mon-16-17', time: '16:30 - 17:30', hours: 1 }
  ],
  tuesday: [
    { id: 'tue-08-09', time: '08:00 - 09:00', hours: 1 },
    { id: 'tue-09-10', time: '09:00 - 10:00', hours: 1 },
    { id: 'tue-10-11', time: '10:00 - 11:00', hours: 1 },
    { id: 'tue-13-14', time: '13:30 - 14:30', hours: 1 },
    { id: 'tue-14-15', time: '14:30 - 15:30', hours: 1 },
    { id: 'tue-15-16', time: '15:30 - 16:30', hours: 1 },
    { id: 'tue-16-17', time: '16:30 - 17:30', hours: 1 }
  ],
  wednesday: [
    { id: 'wed-08-09', time: '08:00 - 09:00', hours: 1 },
    { id: 'wed-09-10', time: '09:00 - 10:00', hours: 1 },
    { id: 'wed-10-11', time: '10:00 - 11:00', hours: 1 },
    { id: 'wed-13-14', time: '13:30 - 14:30', hours: 1 },
    { id: 'wed-14-15', time: '14:30 - 15:30', hours: 1 },
    { id: 'wed-15-16', time: '15:30 - 16:30', hours: 1 },
    { id: 'wed-16-17', time: '16:30 - 17:30', hours: 1 }
  ],
  thursday: [
    { id: 'thu-08-09', time: '08:00 - 09:00', hours: 1 },
    { id: 'thu-09-10', time: '09:00 - 10:00', hours: 1 },
    { id: 'thu-10-11', time: '10:00 - 11:00', hours: 1 },
    { id: 'thu-13-14', time: '13:30 - 14:30', hours: 1 },
    { id: 'thu-14-15', time: '14:30 - 15:30', hours: 1 },
    { id: 'thu-15-16', time: '15:30 - 16:30', hours: 1 },
    { id: 'thu-16-17', time: '16:30 - 17:30', hours: 1 }
  ],
  friday: [], // Sexta não tem aulas
  saturday: [
    { id: 'sat-08-10', time: '08:00 - 10:00', hours: 2 },
    { id: 'sat-10-12', time: '10:00 - 12:00', hours: 2 }
  ]
};
