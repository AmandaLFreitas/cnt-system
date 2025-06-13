
import { useState, useMemo } from 'react';
import { Student, WeekDay, AVAILABLE_TIMES } from '../types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { ArrowLeft, Calendar, Users, Monitor, User } from 'lucide-react';

interface ScheduleViewProps {
  students: Student[];
  onBack: () => void;
}

const ScheduleView = ({ students, onBack }: ScheduleViewProps) => {
  const TOTAL_COMPUTERS = 14;

  const getDayName = (day: WeekDay) => {
    const dayNames = {
      'monday': 'Segunda',
      'tuesday': 'Terça',
      'wednesday': 'Quarta',
      'thursday': 'Quinta',
      'friday': 'Sexta',
      'saturday': 'Sábado'
    };
    return dayNames[day];
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('pt-BR');
  };

  // Criar estrutura da grade horária
  const scheduleGrid = useMemo(() => {
    const grid: { [key: string]: { [timeSlot: string]: Student[] } } = {};
    
    // Inicializar grid
    Object.keys(AVAILABLE_TIMES).forEach(day => {
      grid[day] = {};
      AVAILABLE_TIMES[day as WeekDay].forEach(timeSlot => {
        grid[day][timeSlot.id] = [];
      });
    });

    // Preencher com alunos
    students.filter(student => !student.isCompleted).forEach(student => {
      if (student.schedule) {
        Object.entries(student.schedule).forEach(([day, timeSlots]) => {
          if (timeSlots && timeSlots.length > 0) {
            timeSlots.forEach(timeSlotId => {
              if (grid[day] && grid[day][timeSlotId]) {
                grid[day][timeSlotId].push(student);
              }
            });
          }
        });
      }
    });

    return grid;
  }, [students]);

  // Obter todos os horários únicos
  const allTimeSlots = useMemo(() => {
    const slots: { id: string; time: string; hours: number }[] = [];
    Object.values(AVAILABLE_TIMES).forEach(daySlots => {
      daySlots.forEach(slot => {
        if (!slots.find(s => s.id === slot.id)) {
          slots.push(slot);
        }
      });
    });
    return slots.sort((a, b) => a.time.localeCompare(b.time));
  }, []);

  const activeDays = Object.keys(AVAILABLE_TIMES).filter(
    day => AVAILABLE_TIMES[day as WeekDay].length > 0
  ) as WeekDay[];

  return (
    <div className="space-y-6">
      <div className="flex items-center space-x-4">
        <Button variant="outline" onClick={onBack} className="px-3">
          <ArrowLeft className="h-4 w-4 mr-2" />
          Voltar
        </Button>
        <div>
          <h2 className="text-3xl font-bold text-gray-900">Grade Horária Completa</h2>
          <p className="text-gray-600 mt-1">Visualização completa dos horários e alunos</p>
        </div>
      </div>

      {/* Resumo Geral */}
      <Card className="bg-blue-50 border-blue-200">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Monitor className="h-5 w-5" />
            <span>Resumo Geral</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
            <div>
              <div className="text-2xl font-bold text-blue-600">{TOTAL_COMPUTERS}</div>
              <div className="text-sm text-gray-600">Total de Computadores</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-green-600">
                {students.filter(s => !s.isCompleted).length}
              </div>
              <div className="text-sm text-gray-600">Alunos Ativos</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-purple-600">
                {students.filter(s => s.isCompleted).length}
              </div>
              <div className="text-sm text-gray-600">Alunos Finalizados</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Grade Horária */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Calendar className="h-5 w-5" />
            <span>Grade de Horários</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-32">Horário</TableHead>
                  {activeDays.map(day => (
                    <TableHead key={day} className="text-center min-w-48">
                      {getDayName(day)}
                    </TableHead>
                  ))}
                </TableRow>
              </TableHeader>
              <TableBody>
                {allTimeSlots.map(timeSlot => (
                  <TableRow key={timeSlot.id}>
                    <TableCell className="font-medium">
                      <div>
                        <div className="text-sm font-semibold">{timeSlot.time}</div>
                        <div className="text-xs text-gray-500">({timeSlot.hours}h)</div>
                      </div>
                    </TableCell>
                    {activeDays.map(day => {
                      const studentsInSlot = scheduleGrid[day]?.[timeSlot.id] || [];
                      const availableSlots = TOTAL_COMPUTERS - studentsInSlot.length;
                      const hasTimeSlot = AVAILABLE_TIMES[day].some(slot => slot.id === timeSlot.id);
                      
                      if (!hasTimeSlot) {
                        return (
                          <TableCell key={`${day}-${timeSlot.id}`} className="text-center text-gray-400">
                            -
                          </TableCell>
                        );
                      }
                      
                      return (
                        <TableCell key={`${day}-${timeSlot.id}`} className="p-2">
                          <div className="space-y-2">
                            {/* Contadores */}
                            <div className="flex items-center justify-between text-xs">
                              <Badge 
                                variant="outline" 
                                className={`${studentsInSlot.length > 0 ? 'bg-blue-50 text-blue-700' : 'bg-gray-50 text-gray-500'}`}
                              >
                                <Users className="h-3 w-3 mr-1" />
                                {studentsInSlot.length}/{TOTAL_COMPUTERS}
                              </Badge>
                              <span className={`text-xs ${availableSlots > 0 ? 'text-green-600' : 'text-red-600'}`}>
                                {availableSlots} vagas
                              </span>
                            </div>
                            
                            {/* Lista de Alunos */}
                            {studentsInSlot.length > 0 ? (
                              <div className="space-y-1 max-h-32 overflow-y-auto">
                                {studentsInSlot.map(student => (
                                  <div 
                                    key={student.id} 
                                    className="text-xs bg-white border rounded p-1 hover:bg-gray-50"
                                    title={`${student.fullName} - ${student.course} - Início: ${formatDate(student.courseStartDate)}`}
                                  >
                                    <div className="flex items-center space-x-1">
                                      <User className="h-3 w-3 text-blue-600" />
                                      <span className="truncate font-medium">{student.fullName}</span>
                                    </div>
                                    <div className="text-gray-500 truncate">{student.course}</div>
                                  </div>
                                ))}
                              </div>
                            ) : (
                              <div className="text-xs text-gray-400 text-center py-2">
                                Sem alunos
                              </div>
                            )}
                          </div>
                        </TableCell>
                      );
                    })}
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* Legenda */}
      <Card>
        <CardContent className="pt-6">
          <div className="text-sm text-gray-600">
            <h4 className="font-medium mb-2">Legenda:</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-blue-100 border border-blue-200 rounded"></div>
                <span>Horários com alunos inscritos</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-gray-100 border border-gray-200 rounded"></div>
                <span>Horários sem alunos</span>
              </div>
              <div className="flex items-center space-x-2">
                <span className="text-green-600 font-medium">Verde:</span>
                <span>Vagas disponíveis</span>
              </div>
              <div className="flex items-center space-x-2">
                <span className="text-red-600 font-medium">Vermelho:</span>
                <span>Turma lotada</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ScheduleView;
