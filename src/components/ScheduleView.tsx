
import { useState, useMemo } from 'react';
import { Student, WeekDay } from '../types';
import { mockStudents, mockSchedules } from '../data/mockData';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Clock, Users, ArrowLeft, User } from 'lucide-react';

interface ScheduleViewProps {
  onBack: () => void;
}

const ScheduleView = ({ onBack }: ScheduleViewProps) => {
  const [students] = useState<Student[]>(mockStudents);
  const [schedules] = useState(mockSchedules);

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

  const getStudentsByDayAndHour = (day: WeekDay, hour: string) => {
    return students.filter(student => {
      // Verifica horário personalizado
      if (student.customSchedule) {
        return student.customSchedule.days.includes(day);
      }
      
      // Verifica horário padrão
      const schedule = schedules.find(s => s.id === student.scheduleId);
      if (schedule && schedule.days.includes(day)) {
        // Para horários padrão, considera que o aluno está presente em todos os horários do dia
        return true;
      }
      
      return false;
    });
  };

  const timeSlots = [
    '08:00', '09:00', '10:00', '11:00', '12:00',
    '13:00', '14:00', '15:00', '16:00', '17:00', '18:00'
  ];

  const weekDays: WeekDay[] = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];

  const scheduleData = useMemo(() => {
    const data: { [key in WeekDay]: { [hour: string]: Student[] } } = {
      monday: {},
      tuesday: {},
      wednesday: {},
      thursday: {},
      friday: {},
      saturday: {}
    };

    weekDays.forEach(day => {
      timeSlots.forEach(hour => {
        data[day][hour] = getStudentsByDayAndHour(day, hour);
      });
    });

    return data;
  }, [students]);

  return (
    <div className="space-y-6">
      <div className="flex items-center space-x-4">
        <Button variant="outline" onClick={onBack} className="px-3">
          <ArrowLeft className="h-4 w-4 mr-2" />
          Voltar
        </Button>
        <div>
          <h2 className="text-3xl font-bold text-gray-900">Visualização por Horário</h2>
          <p className="text-gray-600 mt-1">Controle de alunos por dia e horário</p>
        </div>
      </div>

      <Tabs defaultValue="monday" className="w-full">
        <TabsList className="grid w-full grid-cols-6">
          {weekDays.map(day => (
            <TabsTrigger key={day} value={day} className="text-sm">
              {getDayName(day).substring(0, 3)}
            </TabsTrigger>
          ))}
        </TabsList>

        {weekDays.map(day => (
          <TabsContent key={day} value={day} className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Clock className="h-5 w-5" />
                  <span>{getDayName(day)}</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Horário</TableHead>
                      <TableHead>Qtd. Alunos</TableHead>
                      <TableHead>Alunos</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {timeSlots.map(hour => {
                      const studentsInHour = scheduleData[day][hour] || [];
                      return (
                        <TableRow key={hour}>
                          <TableCell className="font-medium">
                            <div className="flex items-center space-x-2">
                              <Clock className="h-4 w-4 text-blue-600" />
                              <span>{hour}</span>
                            </div>
                          </TableCell>
                          <TableCell>
                            <Badge variant={studentsInHour.length > 0 ? "default" : "secondary"}>
                              {studentsInHour.length} aluno{studentsInHour.length !== 1 ? 's' : ''}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            {studentsInHour.length > 0 ? (
                              <div className="space-y-1">
                                {studentsInHour.map(student => (
                                  <div key={student.id} className="flex items-center space-x-2">
                                    <User className="h-3 w-3 text-gray-500" />
                                    <span className="text-sm">{student.fullName}</span>
                                    <Badge variant="outline" className="text-xs">
                                      {student.course}
                                    </Badge>
                                  </div>
                                ))}
                              </div>
                            ) : (
                              <span className="text-gray-500 text-sm">Nenhum aluno</span>
                            )}
                          </TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>
        ))}
      </Tabs>
    </div>
  );
};

export default ScheduleView;
