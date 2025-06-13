
import { useState } from 'react';
import { StudentSchedule, WeekDay, AVAILABLE_TIMES } from '../types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Clock } from 'lucide-react';

interface CustomScheduleEditorProps {
  schedule?: StudentSchedule;
  onChange: (schedule: StudentSchedule) => void;
}

const CustomScheduleEditor = ({ schedule, onChange }: CustomScheduleEditorProps) => {
  const [localSchedule, setLocalSchedule] = useState<StudentSchedule>(
    schedule || {}
  );

  const weekDays: { key: WeekDay; label: string }[] = [
    { key: 'monday', label: 'Segunda-feira' },
    { key: 'tuesday', label: 'Terça-feira' },
    { key: 'wednesday', label: 'Quarta-feira' },
    { key: 'thursday', label: 'Quinta-feira' },
    { key: 'friday', label: 'Sexta-feira' },
    { key: 'saturday', label: 'Sábado' }
  ];

  const handleTimeSlotToggle = (day: WeekDay, timeSlotId: string, checked: boolean) => {
    const newSchedule = { ...localSchedule };
    
    if (!newSchedule[day]) {
      newSchedule[day] = [];
    }
    
    if (checked) {
      newSchedule[day] = [...(newSchedule[day] || []), timeSlotId];
    } else {
      newSchedule[day] = (newSchedule[day] || []).filter(id => id !== timeSlotId);
    }
    
    // Remove o dia se não tiver horários
    if (newSchedule[day]?.length === 0) {
      delete newSchedule[day];
    }
    
    setLocalSchedule(newSchedule);
    onChange(newSchedule);
  };

  const getTotalWeeklyHours = () => {
    let totalHours = 0;
    Object.entries(localSchedule).forEach(([day, timeIds]) => {
      if (timeIds && timeIds.length > 0) {
        timeIds.forEach(timeId => {
          const timeSlot = AVAILABLE_TIMES[day as WeekDay]?.find(slot => slot.id === timeId);
          if (timeSlot) {
            totalHours += timeSlot.hours;
          }
        });
      }
    });
    return totalHours;
  };

  return (
    <Card className="bg-white border-gray-200">
      <CardHeader>
        <CardTitle className="flex items-center space-x-2 text-gray-900">
          <Clock className="h-5 w-5" />
          <span>Selecionar Horários</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-4">
          {weekDays.map((day) => {
            const availableSlots = AVAILABLE_TIMES[day.key] || [];
            const selectedSlots = localSchedule[day.key] || [];
            
            if (availableSlots.length === 0) {
              return null; // Não mostrar sexta-feira
            }
            
            return (
              <div key={day.key} className="space-y-2">
                <h4 className="font-medium text-gray-900">{day.label}</h4>
                <div className="grid gap-2 grid-cols-1 sm:grid-cols-2">
                  {availableSlots.map((slot) => (
                    <div key={slot.id} className="flex items-center space-x-2">
                      <Checkbox
                        id={slot.id}
                        checked={selectedSlots.includes(slot.id)}
                        onCheckedChange={(checked) => 
                          handleTimeSlotToggle(day.key, slot.id, checked as boolean)
                        }
                      />
                      <label htmlFor={slot.id} className="text-sm text-gray-900 cursor-pointer">
                        {slot.time} ({slot.hours}h)
                      </label>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
        
        <div className="p-3 bg-blue-50 rounded-lg border border-blue-200">
          <div className="flex justify-between items-center">
            <span className="text-sm font-medium text-blue-900">
              Total de horas semanais:
            </span>
            <span className="text-lg font-bold text-blue-900">
              {getTotalWeeklyHours()}h
            </span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default CustomScheduleEditor;
