import { useMutation, useQueryClient } from '@tanstack/react-query';
import { fetchJson } from '../client';

type CreateAttendancePayload = {
  studentId: string;
  date: string;
  status: 'present' | 'absent';
  classHours: number;
};

async function createAttendance(record: CreateAttendancePayload) {
  return fetchJson('/api/attendances', { method: 'POST', body: JSON.stringify(record) });
}

export function useSaveAttendance() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (records: CreateAttendancePayload[]) => {
      for (const r of records) {
        // eslint-disable-next-line no-await-in-loop
        await createAttendance(r);
      }
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['attendances'] });
    },
  });
}

