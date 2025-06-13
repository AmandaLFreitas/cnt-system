
import { useState } from 'react';
import { StudentSchedule, WeekDay, AVAILABLE_TIMES } from '../types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Clock } from 'lucide-react';

interface ScheduleSelectorProps {
  schedule: StudentSchedule;
  onChange: (schedule: StudentSchedule) => void;
}

const ScheduleSelector = ({ schedule, onChange }: ScheduleSelectorProps) => {
  const getDayName = (day: WeekDay) => {
    const dayNames = {
      'monday': 'Segunda-feira',
      'tuesday': 'Terça-feira', 
      'wednesday': 'Quarta-feira',
      'thursday': 'Quinta-feira',
      'friday': 'Sexta-feira',
      'saturday': 'Sábado'
    };
    return dayNames[day];
  };

  const handleTimeToggle = (day: WeekDay, timeId: string, checked: boolean) => {
    const newSchedule = { ...schedule };
    
    if (!newSchedule[day]) {
      newSchedule[day] = [];
    }
    
    if (checked) {
      newSchedule[day] = [...(newSchedule[day] || []), timeId];
    } else {
      newSchedule[day] = (newSchedule[day] || []).filter(id => id !== timeId);
    }
    
    // Remove o dia se não tiver horários
    if (newSchedule[day]?.length === 0) {
      delete newSchedule[day];
    }
    
    onChange(newSchedule);
  };

  const getWeeklyHours = () => {
    let totalHours = 0;
    Object.entries(schedule).forEach(([day, timeIds]) => {
      if (timeIds) {
        timeIds.forEach(timeId => {
          const timeSlot = AVAILABLE_TIMES[day as WeekDay].find(slot => slot.id === timeId);
          if (timeSlot) {
            totalHours += timeSlot.hours;
          }
        });
      }
    });
    return totalHours;
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <Clock className="h-5 w-5" />
          <span>Horários de Aula</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {Object.entries(AVAILABLE_TIMES).map(([day, timeSlots]) => {
          if (timeSlots.length === 0) return null; // Pula sexta-feira
          
          return (
            <div key={day} className="space-y-3">
              <Label className="text-sm font-medium text-gray-700">
                {getDayName(day as WeekDay)}
              </Label>
              <div className="grid gap-2 pl-4">
                {timeSlots.map((timeSlot) => {
                  const isSelected = schedule[day as WeekDay]?.includes(timeSlot.id) || false;
                  
                  return (
                    <div key={timeSlot.id} className="flex items-center space-x-2">
                      <Checkbox
                        id={timeSlot.id}
                        checked={isSelected}
                        onCheckedChange={(checked) => 
                          handleTimeToggle(day as WeekDay, timeSlot.id, checked as boolean)
                        }
                      />
                      <Label htmlFor={timeSlot.id} className="text-sm">
                        {timeSlot.time} ({timeSlot.hours}h)
                      </Label>
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}
        
        {getWeeklyHours() > 0 && (
          <div className="p-3 bg-blue-50 rounded-lg border border-blue-200">
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium text-blue-900">
                Total de horas semanais:
              </span>
              <span className="text-lg font-bold text-blue-900">
                {getWeeklyHours()}h
              </span>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default ScheduleSelector;
