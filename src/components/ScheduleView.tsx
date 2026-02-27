import { useState, useMemo } from 'react';
import { Student, WeekDay, AVAILABLE_TIMES } from '../types';
import { mockCourses } from '../data/mockData';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ArrowLeft, Calendar, Users, Monitor, User, Clock, Eye } from 'lucide-react';

interface ScheduleViewProps {
  students: Student[];
  onBack: () => void;
}

const ScheduleView = ({ students, onBack }: ScheduleViewProps) => {
  const [selectedDay, setSelectedDay] = useState<WeekDay>('monday');
  const [viewMode, setViewMode] = useState<'day' | 'week'>('day');
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

  const getShortDayName = (day: WeekDay) => {
    const dayNames = {
      'monday': 'SEG',
      'tuesday': 'TER',
      'wednesday': 'QUA',
      'thursday': 'QUI',
      'friday': 'SEX',
      'saturday': 'SÁB'
    };
    return dayNames[day];
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' });
  };

  const getStudentCourseInfo = (student: Student) => {
    const course = courses.find(c => c.name === student.course);
    return course;
  };

  // Agrupar alunos por horário para um dia específico
  const getStudentsByTimeSlot = (day: WeekDay) => {
    const timeSlotMap: { [timeSlotId: string]: Student[] } = {};
    
    AVAILABLE_TIMES[day].forEach(timeSlot => {
      timeSlotMap[timeSlot.id] = [];
    });

    students.filter(student => !student.isCompleted).forEach(student => {
      if (student.schedule?.[day]) {
        student.schedule[day].forEach(timeSlotId => {
          if (timeSlotMap[timeSlotId]) {
            timeSlotMap[timeSlotId].push(student);
          }
        });
      }
    });

    return timeSlotMap;
  };

  // Obter resumo de ocupação por dia
  const getDayOccupancy = () => {
    const activeDays = Object.keys(AVAILABLE_TIMES).filter(
      day => AVAILABLE_TIMES[day as WeekDay].length > 0
    ) as WeekDay[];

    return activeDays.map(day => {
      const studentsInDay = students.filter(student => 
        !student.isCompleted && 
        student.schedule?.[day] && 
        student.schedule[day].length > 0
      );

      const timeSlots = AVAILABLE_TIMES[day];
      let totalSlots = 0;
      let occupiedSlots = 0;

      timeSlots.forEach(timeSlot => {
        const studentsInSlot = students.filter(student => 
          !student.isCompleted && 
          student.schedule?.[day]?.includes(timeSlot.id)
        ).length;
        
        totalSlots += TOTAL_COMPUTERS;
        occupiedSlots += studentsInSlot;
      });

      return {
        day,
        studentsCount: studentsInDay.length,
        occupancy: totalSlots > 0 ? (occupiedSlots / totalSlots) * 100 : 0,
        timeSlotsCount: timeSlots.length
      };
    });
  };

  const dayOccupancy = getDayOccupancy();
  const selectedDayData = getStudentsByTimeSlot(selectedDay);

  const getOccupancyColor = (percentage: number) => {
    if (percentage >= 90) return 'text-red-600 bg-red-100 border-red-200';
    if (percentage >= 70) return 'text-yellow-600 bg-yellow-100 border-yellow-200';
    if (percentage >= 40) return 'text-blue-600 bg-blue-100 border-blue-200';
    return 'text-green-600 bg-green-100 border-green-200';
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Button variant="outline" onClick={onBack} className="px-3">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Voltar
          </Button>
          <div>
            <h2 className="text-3xl font-bold text-gray-900">Grade Horária</h2>
            <p className="text-gray-600 mt-1">Visualização dinâmica dos horários e ocupação</p>
          </div>
        </div>

        <div className="flex space-x-3">
          <Select value={viewMode} onValueChange={(value: 'day' | 'week') => setViewMode(value)}>
            <SelectTrigger className="w-40">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="week">Visão Semanal</SelectItem>
              <SelectItem value="day">Visão Diária</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <Card className="bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-200">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Monitor className="h-5 w-5" />
            <span>Resumo Geral</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
            <div className="bg-white rounded-lg p-4 shadow-sm">
              <div className="text-3xl font-bold text-blue-600">{TOTAL_COMPUTERS}</div>
              <div className="text-sm text-gray-600">Computadores por Turma</div>
            </div>
            <div className="bg-white rounded-lg p-4 shadow-sm">
              <div className="text-3xl font-bold text-green-600">
                {students.filter(s => !s.isCompleted).length}
              </div>
              <div className="text-sm text-gray-600">Alunos Ativos</div>
            </div>
            <div className="bg-white rounded-lg p-4 shadow-sm">
              <div className="text-3xl font-bold text-purple-600">
                {dayOccupancy.reduce((sum, day) => sum + day.timeSlotsCount, 0)}
              </div>
              <div className="text-sm text-gray-600">Turmas Disponíveis</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {viewMode === 'week' ? (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Calendar className="h-5 w-5" />
              <span>Ocupação Semanal</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {dayOccupancy.map((dayData) => (
                <Card 
                  key={dayData.day} 
                  className={`cursor-pointer transition-all hover:shadow-lg ${
                    selectedDay === dayData.day ? 'ring-2 ring-blue-500' : ''
                  }`}
                  onClick={() => {
                    setSelectedDay(dayData.day);
                    setViewMode('day');
                  }}
                >
                  <CardContent className="pt-6">
                    <div className="text-center space-y-3">
                      <div className="text-lg font-semibold text-gray-900">
                        {getDayName(dayData.day)}
                      </div>
                      
                      <div className={`inline-flex items-center px-3 py-1 rounded-full border ${getOccupancyColor(dayData.occupancy)}`}>
                        <div className="text-2xl font-bold">
                          {Math.round(dayData.occupancy)}%
                        </div>
                      </div>
                      
                      <div className="space-y-2 text-sm text-gray-600">
                        <div className="flex items-center justify-center space-x-1">
                          <Users className="h-4 w-4" />
                          <span>{dayData.studentsCount} alunos</span>
                        </div>
                        <div className="flex items-center justify-center space-x-1">
                          <Clock className="h-4 w-4" />
                          <span>{dayData.timeSlotsCount} turmas</span>
                        </div>
                      </div>

                      <Button 
                        size="sm" 
                        variant="outline" 
                        className="w-full"
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedDay(dayData.day);
                          setViewMode('day');
                        }}
                      >
                        <Eye className="h-4 w-4 mr-2" />
                        Ver Detalhes
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </CardContent>
        </Card>
      ) : (
        <>
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Calendar className="h-5 w-5" />
                  <span>Detalhes de {getDayName(selectedDay)}</span>
                </div>
                <Select value={selectedDay} onValueChange={(value: WeekDay) => setSelectedDay(value)}>
                  <SelectTrigger className="w-48">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {dayOccupancy.map((dayData) => (
                      <SelectItem key={dayData.day} value={dayData.day}>
                        {getDayName(dayData.day)} ({dayData.studentsCount} alunos)
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4">
                {AVAILABLE_TIMES[selectedDay].map((timeSlot) => {
                  const studentsInSlot = selectedDayData[timeSlot.id] || [];
                  const occupancyPercentage = (studentsInSlot.length / TOTAL_COMPUTERS) * 100;
                  const availableSlots = TOTAL_COMPUTERS - studentsInSlot.length;

                  return (
                    <Card key={timeSlot.id} className="border-l-4 border-l-blue-500">
                      <CardContent className="pt-4">
                        <div className="flex items-center justify-between mb-4">
                          <div className="flex items-center space-x-4">
                            <div className="text-center">
                              <div className="text-lg font-semibold text-gray-900">{timeSlot.time}</div>
                              <div className="text-sm text-gray-500">({timeSlot.hours}h de aula)</div>
                            </div>
                            
                            <div className="flex items-center space-x-4">
                              <Badge 
                                variant="outline" 
                                className={`px-3 py-1 ${getOccupancyColor(occupancyPercentage)}`}
                              >
                                <Users className="h-4 w-4 mr-1" />
                                {studentsInSlot.length}/{TOTAL_COMPUTERS}
                              </Badge>
                              
                              <div className="text-sm">
                                <span className={`font-medium ${
                                  availableSlots > 0 ? 'text-green-600' : 'text-red-600'
                                }`}>
                                  {availableSlots} vagas disponíveis
                                </span>
                              </div>
                            </div>
                          </div>

                          <div className="text-right">
                            <div className="text-2xl font-bold text-blue-600">
                              {Math.round(occupancyPercentage)}%
                            </div>
                            <div className="text-xs text-gray-500">ocupação</div>
                          </div>
                        </div>

                        {studentsInSlot.length > 0 ? (
                          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                            {studentsInSlot.map((student) => {
                              const courseInfo = getStudentCourseInfo(student);
                              return (
                                <div 
                                  key={student.id}
                                  className="bg-white border rounded-lg p-3 hover:shadow-md transition-shadow"
                                >
                                  <div className="flex items-center space-x-3">
                                    <div className="h-8 w-8 rounded-full bg-blue-100 flex items-center justify-center">
                                      <User className="h-4 w-4 text-blue-600" />
                                    </div>
                                    <div className="flex-1 min-w-0">
                                      <div className="font-medium text-gray-900 truncate">
                                        {student.fullName}
                                      </div>
                                      <div className="text-sm text-gray-500 truncate">
                                        {student.course}
                                      </div>
                                      <div className="text-xs text-gray-400 space-y-1">
                                        <div className="flex items-center space-x-1">
                                          <Calendar className="h-3 w-3 text-green-600" />
                                          <span>Início: {formatDate(student.courseStartDate)}</span>
                                        </div>
                                        {courseInfo && (
                                          <div className="flex items-center space-x-1">
                                            <Calendar className="h-3 w-3 text-red-600" />
                                            <span>Término: {formatDate(courseInfo.endDate)}</span>
                                          </div>
                                        )}
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              );
                            })}
                          </div>
                        ) : (
                          <div className="text-center py-6 text-gray-400">
                            <Users className="h-8 w-8 mx-auto mb-2 opacity-50" />
                            <p className="text-sm">Nenhum aluno inscrito neste horário</p>
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </>
      )}
    </div>
  );
};

export default ScheduleView;
