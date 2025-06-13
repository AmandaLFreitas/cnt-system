
import { useState, useMemo } from 'react';
import { Student, WeekDay, AVAILABLE_TIMES } from '../types';
import { mockStudents } from '../data/mockData';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Clock, ArrowLeft, User } from 'lucide-react';

interface ScheduleViewProps {
  onBack: () => void;
}

const ScheduleView = ({ onBack }: ScheduleViewProps) => {
  const [students] = useState<Student[]>(mockStudents);

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

  const getStudentsByDayAndHour = (day: WeekDay, timeSlotId: string) => {
    return students.filter(student => {
      if (student.schedule && student.schedule[day]) {
        return student.schedule[day].includes(timeSlotId);
      }
      return false;
    });
  };

  const weekDays: WeekDay[] = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];

  const scheduleData = useMemo(() => {
    const data: { [key in WeekDay]: { [timeSlotId: string]: Student[] } } = {
      monday: {},
      tuesday: {},
      wednesday: {},
      thursday: {},
      friday: {},
      saturday: {}
    };

    weekDays.forEach(day => {
      const availableSlots = AVAILABLE_TIMES[day] || [];
      availableSlots.forEach(slot => {
        data[day][slot.id] = getStudentsByDayAndHour(day, slot.id);
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

        {weekDays.map(day => {
          const availableSlots = AVAILABLE_TIMES[day] || [];
          
          return (
            <TabsContent key={day} value={day} className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Clock className="h-5 w-5" />
                    <span>{getDayName(day)}</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {availableSlots.length > 0 ? (
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Horário</TableHead>
                          <TableHead>Qtd. Alunos</TableHead>
                          <TableHead>Alunos</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {availableSlots.map(slot => {
                          const studentsInSlot = scheduleData[day][slot.id] || [];
                          return (
                            <TableRow key={slot.id}>
                              <TableCell className="font-medium">
                                <div className="flex items-center space-x-2">
                                  <Clock className="h-4 w-4 text-blue-600" />
                                  <span>{slot.time}</span>
                                </div>
                              </TableCell>
                              <TableCell>
                                <Badge variant={studentsInSlot.length > 0 ? "default" : "secondary"}>
                                  {studentsInSlot.length} aluno{studentsInSlot.length !== 1 ? 's' : ''}
                                </Badge>
                              </TableCell>
                              <TableCell>
                                {studentsInSlot.length > 0 ? (
                                  <div className="space-y-1">
                                    {studentsInSlot.map(student => (
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
                  ) : (
                    <div className="text-center py-8 text-gray-500">
                      <Clock className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                      <p>Não há aulas neste dia</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
          );
        })}
      </Tabs>
    </div>
  );
};

export default ScheduleView;
