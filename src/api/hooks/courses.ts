import { useQuery } from '@tanstack/react-query';
import { ensureDefaultCourses, listCourses } from '../courses';

export function useCourses() {
  return useQuery({ queryKey: ['courses'], queryFn: async () => {
    const courses = await listCourses().catch(async () => []);
    if (courses.length === 0) {
      return ensureDefaultCourses();
    }
    return courses;
  }});
}

