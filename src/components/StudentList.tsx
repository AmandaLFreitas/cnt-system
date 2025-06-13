
import { useState, useMemo } from 'react';
import { Student, StudentSchedule, WeekDay, AVAILABLE_TIMES } from '../types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { User, Calendar, BookOpen, Eye, Phone, Clock, Users, Search } from 'lucide-react';

interface StudentListProps {
  students: Student[];
  onSelectStudent: (student: Student) => void;
  onShowAttendance: () => void;
  onShowDetails: (student: Student) => void;
  onShowTimeSlots: () => void;
}

const StudentList = ({ students, onSelectStudent, onShowAttendance, onShowDetails, onShowTimeSlots }: StudentListProps) => {
  const [searchTerm, setSearchTerm] = useState('');

  const filteredStudents = useMemo(() => {
    if (!searchTerm) return students;
    
    return students.filter(student =>
      student.fullName.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [students, searchTerm]);

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
    let totalHours = 0;
    const days: string[] = [];
    
    // Verificar se student.schedule existe e é um objeto válido
    if (!student.schedule || typeof student.schedule !== 'object') {
      return {
        days: 'Não definido',
        weeklyHours: 0
      };
    }
    
    Object.entries(student.schedule).forEach(([day, timeIds]) => {
      if (timeIds && timeIds.length > 0) {
        days.push(getDayName(day as WeekDay));
        timeIds.forEach(timeId => {
          const timeSlot = AVAILABLE_TIMES[day as WeekDay]?.find(slot => slot.id === timeId);
          if (timeSlot) {
            totalHours += timeSlot.hours;
          }
        });
      }
    });
    
    return {
      days: days.join(', ') || 'Não definido',
      weeklyHours: totalHours
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
            onClick={onShowTimeSlots}
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

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Search className="h-5 w-5" />
            <span>Buscar Aluno</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Input
            placeholder="Digite o nome do aluno para buscar..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="max-w-md"
          />
        </CardContent>
      </Card>

      <div className="grid gap-6">
        {filteredStudents.length === 0 ? (
          <Card>
            <CardContent className="text-center py-8">
              <Search className="h-12 w-12 mx-auto mb-4 text-gray-300" />
              <p className="text-gray-500">
                {searchTerm ? 'Nenhum aluno encontrado com esse nome' : 'Nenhum aluno cadastrado'}
              </p>
            </CardContent>
          </Card>
        ) : (
          filteredStudents.map((student) => {
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
                      <span className="text-gray-600">Dias:</span>
                      <span className="font-medium">{scheduleInfo.days}</span>
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
          })
        )}
      </div>
    </div>
  );
};

export default StudentList;
