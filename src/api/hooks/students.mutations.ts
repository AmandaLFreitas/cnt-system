import { useMutation, useQueryClient } from '@tanstack/react-query';
import { createStudent, updateStudent } from '../students';

export function useCreateStudent() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: createStudent,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['students'] });
    },
  });
}

export function useUpdateStudent() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: Parameters<typeof updateStudent>[1] }) => updateStudent(id, payload),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['students'] });
    },
  });
}

