import { useState, useMemo } from 'react';
import { Student, WeekDay, AVAILABLE_TIMES } from '../types';
import { mockCourses } from '../data/mockData';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Clock, Users, ArrowLeft, User, Monitor, Calendar } from 'lucide-react';

interface TimeSlotViewProps {
  students: Student[];
  onBack: () => void;
  onShowScheduleView: () => void;
}

const TimeSlotView = ({ students, onBack, onShowScheduleView }: TimeSlotViewProps) => {
  const [selectedDay, setSelectedDay] = useState<WeekDay>('monday');
  const [selectedTimeSlot, setSelectedTimeSlot] = useState<string>('');
  const [courses] = useState(mockCourses);
  
  const TOTAL_COMPUTERS = 20;

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

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('pt-BR');
  };

  const getStudentCourseInfo = (student: Student) => {
    const course = courses.find(c => c.name === student.course);
    return course;
  };

  const availableDays = Object.keys(AVAILABLE_TIMES).filter(
    day => AVAILABLE_TIMES[day as WeekDay].length > 0
  ) as WeekDay[];

  const studentsInTimeSlot = useMemo(() => {
    if (!selectedTimeSlot) return [];
    
    return students.filter(student => {
      const daySchedule = student.schedule?.[selectedDay];
      return daySchedule && daySchedule.includes(selectedTimeSlot);
    });
  }, [students, selectedDay, selectedTimeSlot]);

  const allStudentsInDay = useMemo(() => {
    return students.filter(student => {
      const daySchedule = student.schedule?.[selectedDay];
      return daySchedule && daySchedule.length > 0;
    });
  }, [students, selectedDay]);

  const enrolledCount = studentsInTimeSlot.length;
  const availableSlots = TOTAL_COMPUTERS - enrolledCount;

  return (
    <div className="space-y-4 p-2 md:space-y-6 md:p-6">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div className="flex items-center space-x-4">
          <Button variant="outline" onClick={onBack} className="px-3" size="sm">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Voltar
          </Button>
          <div>
            <h2 className="text-xl md:text-3xl font-bold text-gray-900 dark:text-gray-100">Visualização por Horário</h2>
            <p className="text-gray-600 dark:text-gray-400 mt-1 text-sm md:text-base">Selecione o dia e horário para ver os alunos</p>
          </div>
        </div>
        
        <div className="flex gap-2">
          <Button 
            onClick={onShowScheduleView}
            size="sm"
            className="bg-blue-600 hover:bg-blue-700 text-white text-sm"
          >
            <Calendar className="mr-2 h-4 w-4" />
            <span className="hidden sm:inline">Ver Grade Completa</span>
            <span className="sm:hidden">Grade</span>
          </Button>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2 text-sm md:text-lg">
            <Clock className="h-4 w-4 md:h-5 md:w-5" />
            <span>Filtros</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <label className="text-sm font-medium">Dia da Semana</label>
              <Select value={selectedDay} onValueChange={(value: string) => {
                setSelectedDay(value as WeekDay);
                setSelectedTimeSlot('');
              }}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {availableDays.map(day => (
                    <SelectItem key={day} value={day}>
                      {getDayName(day)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Horário</label>
              <Select value={selectedTimeSlot} onValueChange={setSelectedTimeSlot}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecione um horário" />
                </SelectTrigger>
                <SelectContent>
                  {AVAILABLE_TIMES[selectedDay].map(timeSlot => (
                    <SelectItem key={timeSlot.id} value={timeSlot.id}>
                      {timeSlot.time} ({timeSlot.hours}h)
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {selectedTimeSlot && (
        <Card className="bg-blue-50 dark:bg-blue-950/50 border-blue-200 dark:border-blue-800">
          <CardContent className="pt-6">
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 text-center">
              <div>
                <div className="flex items-center justify-center space-x-2 mb-2">
                  <Monitor className="h-4 w-4 md:h-5 md:w-5 text-blue-600" />
                  <span className="text-xs md:text-sm font-medium text-gray-600 dark:text-gray-400">Total de Vagas</span>
                </div>
                <div className="text-lg md:text-2xl font-bold text-blue-600">{TOTAL_COMPUTERS}</div>
              </div>
              <div>
                <div className="flex items-center justify-center space-x-2 mb-2">
                  <Users className="h-4 w-4 md:h-5 md:w-5 text-green-600" />
                  <span className="text-xs md:text-sm font-medium text-gray-600 dark:text-gray-400">Alunos Inscritos</span>
                </div>
                <div className="text-lg md:text-2xl font-bold text-green-600">{enrolledCount}</div>
              </div>
              <div>
                <div className="flex items-center justify-center space-x-2 mb-2">
                  <Monitor className="h-4 w-4 md:h-5 md:w-5 text-orange-600" />
                  <span className="text-xs md:text-sm font-medium text-gray-600 dark:text-gray-400">Vagas Disponíveis</span>
                </div>
                <div className="text-lg md:text-2xl font-bold text-orange-600">{availableSlots}</div>
              </div>
              <div>
                <div className="flex items-center justify-center space-x-2 mb-2">
                  <Clock className="h-4 w-4 md:h-5 md:w-5 text-purple-600" />
                  <span className="text-xs md:text-sm font-medium text-gray-600 dark:text-gray-400">Ocupação</span>
                </div>
                <div className="text-lg md:text-2xl font-bold text-purple-600">
                  {TOTAL_COMPUTERS > 0 ? Math.round((enrolledCount / TOTAL_COMPUTERS) * 100) : 0}%
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {selectedTimeSlot && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2 text-sm md:text-lg">
              <Users className="h-4 w-4 md:h-5 md:w-5" />
              <span>Alunos no {getDayName(selectedDay)} - {AVAILABLE_TIMES[selectedDay].find(t => t.id === selectedTimeSlot)?.time}</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            {studentsInTimeSlot.length > 0 ? (
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="text-xs md:text-sm">Aluno</TableHead>
                      <TableHead className="text-xs md:text-sm">Curso</TableHead>
                      <TableHead className="text-xs md:text-sm">Data de Início</TableHead>
                      <TableHead className="text-xs md:text-sm">Data de Término</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {studentsInTimeSlot.map(student => {
                      const courseInfo = getStudentCourseInfo(student);
                      return (
                        <TableRow key={student.id}>
                          <TableCell className="font-medium">
                            <div className="flex items-center space-x-2">
                              <User className="h-3 w-3 md:h-4 md:w-4 text-blue-600 flex-shrink-0" />
                              <span className="truncate text-xs md:text-sm">{student.fullName}</span>
                            </div>
                          </TableCell>
                          <TableCell>
                            <Badge variant="outline" className="text-xs">{student.course}</Badge>
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center space-x-1">
                              <Calendar className="h-3 w-3 md:h-4 md:w-4 text-green-600 flex-shrink-0" />
                              <span className="text-xs md:text-sm">{formatDate(student.courseStartDate)}</span>
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center space-x-1">
                              <Calendar className="h-3 w-3 md:h-4 md:w-4 text-red-600 flex-shrink-0" />
                              <span className="text-xs md:text-sm">
                                {courseInfo 
                                  ? formatDate(courseInfo.endDate)
                                  : 'Data não disponível'
                                }
                              </span>
                            </div>
                          </TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
              </div>
            ) : (
              <div className="text-center py-8 text-gray-500">
                <Users className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                <p className="text-sm md:text-base">Nenhum aluno encontrado para este horário</p>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {!selectedTimeSlot && allStudentsInDay.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2 text-sm md:text-lg">
              <Users className="h-4 w-4 md:h-5 md:w-5" />
              <span>Todos os alunos na {getDayName(selectedDay)}</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-center py-4 text-gray-600 dark:text-gray-400">
              <p className="text-sm md:text-base">{allStudentsInDay.length} aluno{allStudentsInDay.length !== 1 ? 's' : ''} tem aula na {getDayName(selectedDay)}</p>
              <p className="text-xs md:text-sm mt-1">Selecione um horário específico para ver os detalhes</p>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default TimeSlotView;
