import { fetchJson } from './client';
import { mockCourses } from '@/data/mockData';

export type ApiCourse = { id: string; name: string; totalHours: number; startDate: string; endDate: string };

export async function listCourses(): Promise<ApiCourse[]> {
  return fetchJson<ApiCourse[]>('/api/courses');
}

export async function createCourse(course: Omit<ApiCourse, 'id'>): Promise<ApiCourse> {
  return fetchJson<ApiCourse>('/api/courses', {
    method: 'POST',
    body: JSON.stringify(course),
  });
}

export async function ensureDefaultCourses(): Promise<ApiCourse[]> {
  const existing = await listCourses().catch(() => []);
  if (existing.length > 0) return existing;
  const created: ApiCourse[] = [];
  for (const c of mockCourses) {
    const payload = { name: c.name, totalHours: c.totalHours, startDate: c.startDate, endDate: c.endDate };
    const res = await createCourse(payload).catch(() => null as any);
    if (res) created.push(res);
  }
  return listCourses().catch(() => created);
}

