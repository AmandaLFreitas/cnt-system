import { fetchJson, toIsoDateTime } from './client';

type ApiCourse = { id: string; name: string; totalHours: number; startDate: string; endDate: string };
type ApiStudent = {
  id: string;
  fullName: string;
  cpf?: string;
  guardian?: string;
  fatherName?: string;
  motherName?: string;
  phone: string;
  birthDate: string;
  courseId?: string;
  courseStartDate?: string;
  courseEndDate?: string;
  schedule?: string;
  email?: string;
  address?: string;
  cep?: string;
  street?: string;
  number?: string;
  neighborhood?: string;
  city?: string;
  state?: string;
  isCompleted?: boolean;
  completionDate?: string;
  course?: ApiCourse | null;
};

export async function listStudents(): Promise<ApiStudent[]> {
  return fetchJson<ApiStudent[]>('/api/students');
}

export async function createStudent(payload: {
  student: {
    fullName: string;
    cpf?: string;
    guardian?: string;
    fatherName?: string;
    motherName?: string;
    phone: string;
    birthDate: string;
    courseStartDate?: string;
    courseEndDate?: string;
    schedule?: string;
    email?: string;
    address?: string;
    cep?: string;
    street?: string;
    number?: string;
    neighborhood?: string;
    city?: string;
    state?: string;
  };
  courseId: string;
}): Promise<ApiStudent> {
  const data: any = {
    fullName: payload.student.fullName,
    phone: payload.student.phone,
    birthDate: toIsoDateTime(payload.student.birthDate),
    courseId: payload.courseId,
  };

  // Adicionar campos opcionais só se tiverem valor
  if (payload.student.cpf) data.cpf = payload.student.cpf;
  if (payload.student.guardian) data.guardian = payload.student.guardian;
  if (payload.student.fatherName) data.fatherName = payload.student.fatherName;
  if (payload.student.motherName) data.motherName = payload.student.motherName;
  if (payload.student.courseStartDate) data.courseStartDate = toIsoDateTime(payload.student.courseStartDate);
  if (payload.student.courseEndDate) data.courseEndDate = toIsoDateTime(payload.student.courseEndDate);
  if (payload.student.schedule) data.schedule = payload.student.schedule;
  if (payload.student.email) data.email = payload.student.email;
  if (payload.student.address) data.address = payload.student.address;
  if (payload.student.cep) data.cep = payload.student.cep;
  if (payload.student.street) data.street = payload.student.street;
  if (payload.student.number) data.number = payload.student.number;
  if (payload.student.neighborhood) data.neighborhood = payload.student.neighborhood;
  if (payload.student.city) data.city = payload.student.city;
  if (payload.student.state) data.state = payload.student.state;

  return fetchJson<ApiStudent>('/api/students', { method: 'POST', body: JSON.stringify(data) });
}

export async function updateStudent(id: string, payload: {
  student: Partial<{
    fullName: string;
    cpf?: string;
    guardian?: string;
    fatherName?: string;
    motherName?: string;
    phone: string;
    birthDate: string;
    courseStartDate?: string;
    courseEndDate?: string;
    schedule?: string;
    email?: string;
    address?: string;
    cep?: string;
    street?: string;
    number?: string;
    neighborhood?: string;
    city?: string;
    state?: string;
  }>;
  courseId?: string;
}): Promise<ApiStudent> {
  const data: any = {
    ...payload.student,
  };
  
  if (data.birthDate) data.birthDate = toIsoDateTime(data.birthDate);
  if (data.courseStartDate) data.courseStartDate = toIsoDateTime(data.courseStartDate);
  if (data.courseEndDate) data.courseEndDate = toIsoDateTime(data.courseEndDate);
  
  if (payload.courseId) {
    data.courseId = payload.courseId;
  }
  return fetchJson<ApiStudent>(`/api/students/${id}`, { method: 'PATCH', body: JSON.stringify(data) });
}

