
import { useState } from 'react';
import { StudentSchedule, WeekDay } from '../types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Clock, Plus, Minus } from 'lucide-react';

interface CustomScheduleEditorProps {
  schedule?: StudentSchedule;
  onChange: (schedule: StudentSchedule) => void;
}

const CustomScheduleEditor = ({ schedule, onChange }: CustomScheduleEditorProps) => {
  const [localSchedule, setLocalSchedule] = useState<StudentSchedule>(
    schedule || { days: [], hoursPerDay: {} }
  );

  const weekDays: { key: WeekDay; label: string }[] = [
    { key: 'monday', label: 'Segunda-feira' },
    { key: 'tuesday', label: 'Terça-feira' },
    { key: 'wednesday', label: 'Quarta-feira' },
    { key: 'thursday', label: 'Quinta-feira' },
    { key: 'friday', label: 'Sexta-feira' },
    { key: 'saturday', label: 'Sábado' }
  ];

  const handleDayToggle = (day: WeekDay, checked: boolean) => {
    const newSchedule = { ...localSchedule };
    
    if (checked) {
      // Adicionar dia
      newSchedule.days = [...new Set([...newSchedule.days, day])];
      if (!newSchedule.hoursPerDay[day]) {
        newSchedule.hoursPerDay[day] = 1;
      }
    } else {
      // Remover dia
      newSchedule.days = newSchedule.days.filter(d => d !== day);
      delete newSchedule.hoursPerDay[day];
    }
    
    setLocalSchedule(newSchedule);
    onChange(newSchedule);
  };

  const handleHoursChange = (day: WeekDay, hours: number) => {
    const newSchedule = {
      ...localSchedule,
      hoursPerDay: {
        ...localSchedule.hoursPerDay,
        [day]: Math.max(1, Math.min(8, hours)) // Mínimo 1h, máximo 8h
      }
    };
    
    setLocalSchedule(newSchedule);
    onChange(newSchedule);
  };

  const getTotalWeeklyHours = () => {
    return Object.values(localSchedule.hoursPerDay).reduce((total, hours) => total + (hours || 0), 0);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <Clock className="h-5 w-5" />
          <span>Horário Personalizado</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-3">
          <Label className="text-sm font-medium">Selecione os dias da semana:</Label>
          
          {weekDays.map((day) => {
            const isSelected = localSchedule.days.includes(day.key);
            const hours = localSchedule.hoursPerDay[day.key] || 1;
            
            return (
              <div key={day.key} className="flex items-center justify-between p-3 border rounded-lg">
                <div className="flex items-center space-x-3">
                  <Checkbox
                    id={day.key}
                    checked={isSelected}
                    onCheckedChange={(checked) => handleDayToggle(day.key, checked as boolean)}
                  />
                  <Label htmlFor={day.key} className="font-medium">
                    {day.label}
                  </Label>
                </div>
                
                {isSelected && (
                  <div className="flex items-center space-x-2">
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => handleHoursChange(day.key, hours - 1)}
                      disabled={hours <= 1}
                    >
                      <Minus className="h-3 w-3" />
                    </Button>
                    
                    <div className="flex items-center space-x-1 min-w-[80px] justify-center">
                      <Input
                        type="number"
                        min="1"
                        max="8"
                        value={hours}
                        onChange={(e) => handleHoursChange(day.key, parseInt(e.target.value) || 1)}
                        className="w-16 text-center"
                      />
                      <span className="text-sm text-gray-600">h</span>
                    </div>
                    
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => handleHoursChange(day.key, hours + 1)}
                      disabled={hours >= 8}
                    >
                      <Plus className="h-3 w-3" />
                    </Button>
                  </div>
                )}
              </div>
            );
          })}
        </div>
        
        {localSchedule.days.length > 0 && (
          <div className="p-3 bg-blue-50 rounded-lg border border-blue-200">
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium text-blue-900">
                Total de horas semanais:
              </span>
              <span className="text-lg font-bold text-blue-900">
                {getTotalWeeklyHours()}h
              </span>
            </div>
            <div className="text-xs text-blue-700 mt-1">
              Dias selecionados: {localSchedule.days.length}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default CustomScheduleEditor;
