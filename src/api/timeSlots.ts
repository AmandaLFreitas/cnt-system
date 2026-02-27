import { TimeSlotCapacity } from '../types';
import { fetchJson } from './client';

export const timeSlotsAPI = {
  async getAll(): Promise<TimeSlotCapacity[]> {
    return fetchJson<TimeSlotCapacity[]>('/api/time-slots');
  },

  async getByDay(day: string): Promise<TimeSlotCapacity[]> {
    return fetchJson<TimeSlotCapacity[]>(`/api/time-slots/day/${day}`);
  },

  async getBySlotId(slotId: string): Promise<TimeSlotCapacity> {
    return fetchJson<TimeSlotCapacity>(`/api/time-slots/${slotId}`);
  },

  async updateVacancies(slotId: string, totalVacancies: number): Promise<TimeSlotCapacity> {
    return fetchJson<TimeSlotCapacity>(`/api/time-slots/${slotId}`, {
      method: 'PATCH',
      body: JSON.stringify({ totalVacancies })
    });
  },

  async initializeDefaults(): Promise<{ message: string }> {
    return fetchJson<{ message: string }>('/api/time-slots/initialize-defaults', {
      method: 'POST',
      body: JSON.stringify({})
    });
  }
};
