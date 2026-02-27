import { useQuery } from '@tanstack/react-query';
import { listStudents } from '../students';

export function useStudents() {
  return useQuery({ queryKey: ['students'], queryFn: listStudents });
}

