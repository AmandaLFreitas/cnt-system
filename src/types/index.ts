
export interface Student {
  id: string;
  fullName: string;
  guardian?: string; // Responsável (se menor de idade)
  phone: string;
  birthDate: string;
  course: string;
  courseStartDate: string;
  email?: string;
  scheduleId: string; // Referência ao horário
}

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

export interface ClassSchedule {
  id: string;
  name: string;
  days: ('monday' | 'tuesday' | 'wednesday' | 'thursday' | 'saturday')[];
  times: string[];
  hoursPerClass: number;
}
