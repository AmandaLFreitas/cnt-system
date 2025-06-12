
import { useState } from 'react';
import { Student, Course, ClassSchedule, WeekDay } from '../types';
import { mockCourses, mockSchedules } from '../data/mockData';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  ArrowLeft, 
  User, 
  Phone, 
  Calendar, 
  BookOpen, 
  Clock, 
  Users,
  Edit
} from 'lucide-react';

interface StudentDetailsProps {
  student: Student;
  onBack: () => void;
  onEdit: (student: Student) => void;
}

const StudentDetails = ({ student, onBack, onEdit }: StudentDetailsProps) => {
  const [courses] = useState<Course[]>(mockCourses);
  const [schedules] = useState<ClassSchedule[]>(mockSchedules);

  const studentCourse = courses.find(course => course.name === student.course);
  const studentSchedule = schedules.find(schedule => schedule.id === student.scheduleId);

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
      'monday': 'Segunda',
      'tuesday': 'Terça',
      'wednesday': 'Quarta',
      'thursday': 'Quinta',
      'friday': 'Sexta',
      'saturday': 'Sábado'
    };
    return dayNames[day];
  };

  const getTotalWeeklyHours = () => {
    if (student.customSchedule) {
      return Object.values(student.customSchedule.hoursPerDay).reduce((total, hours) => total + (hours || 0), 0);
    }
    if (studentSchedule) {
      return studentSchedule.days.length * studentSchedule.hoursPerClass;
    }
    return 0;
  };

  const isMinor = calculateAge(student.birthDate) < 18;
  const isCustomSchedule = student.scheduleId === '4' && student.customSchedule;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Button variant="outline" onClick={onBack} className="px-3">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Voltar
          </Button>
          <div>
            <h2 className="text-3xl font-bold text-gray-900">Detalhes do Aluno</h2>
            <p className="text-gray-600 mt-1">Informações completas do estudante</p>
          </div>
        </div>
        
        <Button 
          onClick={() => onEdit(student)}
          className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2"
        >
          <Edit className="mr-2 h-4 w-4" />
          Editar
        </Button>
      </div>

      {/* Informações Pessoais */}
      <Card className="border-blue-200 bg-blue-50">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <User className="h-5 w-5" />
            <span>Informações Pessoais</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <label className="text-sm font-medium text-gray-600">Nome Completo</label>
              <p className="text-lg font-semibold text-gray-900">{student.fullName}</p>
            </div>
            
            <div>
              <label className="text-sm font-medium text-gray-600">Idade</label>
              <p className="text-lg font-semibold text-gray-900">{calculateAge(student.birthDate)} anos</p>
            </div>
            
            <div>
              <label className="text-sm font-medium text-gray-600">Data de Nascimento</label>
              <p className="text-lg font-semibold text-gray-900">{formatDate(student.birthDate)}</p>
            </div>
            
            <div>
              <label className="text-sm font-medium text-gray-600">Telefone</label>
              <p className="text-lg font-semibold text-gray-900">{student.phone}</p>
            </div>
            
            {student.email && (
              <div>
                <label className="text-sm font-medium text-gray-600">Email</label>
                <p className="text-lg font-semibold text-gray-900">{student.email}</p>
              </div>
            )}
            
            {isMinor && student.guardian && (
              <div>
                <label className="text-sm font-medium text-gray-600">Responsável</label>
                <div className="flex items-center space-x-2">
                  <Users className="h-4 w-4 text-orange-600" />
                  <p className="text-lg font-semibold text-gray-900">{student.guardian}</p>
                  <Badge className="bg-orange-100 text-orange-800 border-orange-200">
                    Menor de Idade
                  </Badge>
                </div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Informações do Curso */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <BookOpen className="h-5 w-5" />
            <span>Informações do Curso</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <label className="text-sm font-medium text-gray-600">Curso</label>
              <p className="text-lg font-semibold text-gray-900">{student.course}</p>
            </div>
            
            <div>
              <label className="text-sm font-medium text-gray-600">Data de Início</label>
              <p className="text-lg font-semibold text-gray-900">{formatDate(student.courseStartDate)}</p>
            </div>
            
            {studentCourse && (
              <>
                <div>
                  <label className="text-sm font-medium text-gray-600">Carga Horária Total</label>
                  <p className="text-lg font-semibold text-gray-900">{studentCourse.totalHours}h</p>
                </div>
                
                <div>
                  <label className="text-sm font-medium text-gray-600">Previsão de Término</label>
                  <p className="text-lg font-semibold text-gray-900">{formatDate(studentCourse.endDate)}</p>
                </div>
              </>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Horários de Aula */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Clock className="h-5 w-5" />
            <span>Horários de Aula</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          {isCustomSchedule ? (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">Horário Personalizado</h3>
                  <p className="text-sm text-gray-600">
                    {getTotalWeeklyHours()}h por semana
                  </p>
                </div>
                <Badge className="bg-purple-100 text-purple-800 border-purple-200">
                  Personalizado
                </Badge>
              </div>
              
              <div className="grid gap-3">
                <div>
                  <label className="text-sm font-medium text-gray-600">Cronograma Semanal</label>
                  <div className="grid gap-2 mt-2">
                    {student.customSchedule.days.map((day) => {
                      const hours = student.customSchedule?.hoursPerDay[day] || 0;
                      return (
                        <div key={day} className="flex items-center justify-between p-3 bg-purple-50 rounded-lg border border-purple-200">
                          <div className="flex items-center space-x-2">
                            <Badge variant="secondary" className="bg-purple-100 text-purple-800">
                              {getDayName(day)}
                            </Badge>
                          </div>
                          <div className="flex items-center space-x-2">
                            <Clock className="h-4 w-4 text-purple-600" />
                            <span className="text-sm font-semibold text-purple-900">
                              {hours}h
                            </span>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            </div>
          ) : studentSchedule ? (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">{studentSchedule.name}</h3>
                  <p className="text-sm text-gray-600">
                    {studentSchedule.hoursPerClass}h por aula - {getTotalWeeklyHours()}h por semana
                  </p>
                </div>
                <Badge className="bg-green-100 text-green-800 border-green-200">
                  Padrão
                </Badge>
              </div>
              
              <div className="grid gap-3">
                <div>
                  <label className="text-sm font-medium text-gray-600">Dias da Semana</label>
                  <div className="flex flex-wrap gap-2 mt-1">
                    {studentSchedule.days.map((day) => (
                      <Badge key={day} variant="secondary" className="bg-blue-100 text-blue-800">
                        {getDayName(day)}
                      </Badge>
                    ))}
                  </div>
                </div>
                
                <div>
                  <label className="text-sm font-medium text-gray-600">Horários</label>
                  <div className="grid gap-2 mt-1 sm:grid-cols-2 lg:grid-cols-3">
                    {studentSchedule.times.map((time, index) => (
                      <div key={index} className="flex items-center space-x-2 p-2 bg-gray-50 rounded-lg">
                        <Clock className="h-4 w-4 text-gray-600" />
                        <span className="text-sm font-medium">{time}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <p className="text-gray-500">Nenhum horário definido</p>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default StudentDetails;
