
import { useState } from 'react';
import { Student, ClassSchedule, WeekDay } from '../types';
import { mockStudents, mockSchedules } from '../data/mockData';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { User, Calendar, BookOpen, Eye, Phone, Clock, Users } from 'lucide-react';

interface StudentListProps {
  onSelectStudent: (student: Student) => void;
  onShowAttendance: () => void;
  onShowDetails: (student: Student) => void;
}

const StudentList = ({ onSelectStudent, onShowAttendance, onShowDetails }: StudentListProps) => {
  const [students] = useState<Student[]>(mockStudents);
  const [schedules] = useState<ClassSchedule[]>(mockSchedules);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('pt-BR');
  };

  const calculateAge = (birthDate: string) => {
    const today = new Date();
    const birth = new Date(birthDate);
    let age = today.getFullYear() - birth.getFullYear();
    const monthDiff = today.getMonth() - birth.getMonth();
    
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
      age--;
    }
    
    return age;
  };

  const getDayName = (day: WeekDay) => {
    const dayNames = {
      'monday': 'Seg',
      'tuesday': 'Ter',
      'wednesday': 'Qua',
      'thursday': 'Qui',
      'friday': 'Sex',
      'saturday': 'Sáb'
    };
    return dayNames[day];
  };

  const getScheduleInfo = (student: Student) => {
    if (student.scheduleId === '4' && student.customSchedule) {
      const totalHours = Object.values(student.customSchedule.hoursPerDay).reduce((total, hours) => total + (hours || 0), 0);
      const daysStr = student.customSchedule.days.map(day => getDayName(day)).join(', ');
      return {
        name: `Personalizado (${daysStr})`,
        weeklyHours: totalHours,
        isCustom: true
      };
    }
    
    const schedule = schedules.find(s => s.id === student.scheduleId);
    if (schedule) {
      const weeklyHours = schedule.days.length * schedule.hoursPerClass;
      return {
        name: schedule.name,
        weeklyHours,
        isCustom: false
      };
    }
    
    return {
      name: 'Não definido',
      weeklyHours: 0,
      isCustom: false
    };
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-bold text-gray-900">Lista de Alunos</h2>
          <p className="text-gray-600 mt-1">Gerencie os alunos e visualize informações completas</p>
        </div>
        <div className="flex space-x-3">
          <Button 
            onClick={onShowAttendance}
            variant="outline"
            className="border-green-200 text-green-700 hover:bg-green-50 px-6 py-2"
          >
            <Clock className="mr-2 h-4 w-4" />
            Ver por Horário
          </Button>
          <Button 
            onClick={onShowAttendance}
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2"
          >
            <Calendar className="mr-2 h-4 w-4" />
            Fazer Chamada
          </Button>
        </div>
      </div>

      <div className="grid gap-6">
        {students.map((student) => {
          const isMinor = calculateAge(student.birthDate) < 18;
          const scheduleInfo = getScheduleInfo(student);
          
          return (
            <Card key={student.id} className="hover:shadow-lg transition-shadow duration-200 border border-gray-200">
              <CardHeader className="pb-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="h-12 w-12 rounded-full bg-blue-100 flex items-center justify-center">
                      <User className="h-6 w-6 text-blue-600" />
                    </div>
                    <div>
                      <CardTitle className="text-xl text-gray-900">{student.fullName}</CardTitle>
                      <div className="flex items-center space-x-2 mt-1">
                        <p className="text-sm text-gray-500">{calculateAge(student.birthDate)} anos</p>
                        {isMinor && (
                          <Badge className="bg-orange-100 text-orange-800 border-orange-200 text-xs">
                            Menor
                          </Badge>
                        )}
                        {scheduleInfo.isCustom && (
                          <Badge className="bg-purple-100 text-purple-800 border-purple-200 text-xs">
                            Personalizado
                          </Badge>
                        )}
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex space-x-2">
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => onShowDetails(student)}
                      className="border-blue-200 text-blue-700 hover:bg-blue-50"
                    >
                      <Eye className="mr-2 h-4 w-4" />
                      Detalhes
                    </Button>
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => onSelectStudent(student)}
                      className="border-green-200 text-green-700 hover:bg-green-50"
                    >
                      Ver Frequência
                    </Button>
                  </div>
                </div>
              </CardHeader>
              
              <CardContent className="space-y-4">
                <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-3">
                  <div className="flex items-center space-x-2 text-sm">
                    <Phone className="h-4 w-4 text-gray-600" />
                    <span className="text-gray-600">Telefone:</span>
                    <span className="font-medium">{student.phone}</span>
                  </div>
                  
                  <div className="flex items-center space-x-2 text-sm">
                    <Calendar className="h-4 w-4 text-gray-600" />
                    <span className="text-gray-600">Nascimento:</span>
                    <span className="font-medium">{formatDate(student.birthDate)}</span>
                  </div>
                  
                  <div className="flex items-center space-x-2 text-sm">
                    <Calendar className="h-4 w-4 text-gray-600" />
                    <span className="text-gray-600">Início do Curso:</span>
                    <span className="font-medium">{formatDate(student.courseStartDate)}</span>
                  </div>
                  
                  {isMinor && student.guardian && (
                    <div className="flex items-center space-x-2 text-sm">
                      <Users className="h-4 w-4 text-orange-600" />
                      <span className="text-gray-600">Responsável:</span>
                      <span className="font-medium">{student.guardian}</span>
                    </div>
                  )}
                  
                  <div className="flex items-center space-x-2 text-sm">
                    <Clock className="h-4 w-4 text-gray-600" />
                    <span className="text-gray-600">Horário:</span>
                    <span className="font-medium">{scheduleInfo.name}</span>
                  </div>
                  
                  <div className="flex items-center space-x-2 text-sm">
                    <Clock className="h-4 w-4 text-gray-600" />
                    <span className="text-gray-600">Horas/semana:</span>
                    <span className="font-medium">{scheduleInfo.weeklyHours}h</span>
                  </div>
                </div>
                
                <div className="flex items-center space-x-2">
                  <BookOpen className="h-4 w-4 text-gray-600" />
                  <Badge variant="secondary" className="bg-blue-50 text-blue-700 border-blue-200">
                    {student.course}
                  </Badge>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
};

export default StudentList;
