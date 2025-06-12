
export interface Student {
  id: string;
  fullName: string;
  birthDate: string;
  course: string;
  email?: string;
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
