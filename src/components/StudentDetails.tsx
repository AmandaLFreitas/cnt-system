
import { useState } from 'react';
import { Student, WeekDay, AVAILABLE_TIMES, AttendanceRecord } from '../types';
import { mockCourses, mockAttendance } from '../data/mockData';
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
  Edit,
  CheckCircle,
  AlertTriangle
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface StudentDetailsProps {
  student: Student;
  onBack: () => void;
  onEdit: (student: Student) => void;
  onCompleteStudent?: (student: Student) => void;
}

const StudentDetails = ({ student, onBack, onEdit, onCompleteStudent }: StudentDetailsProps) => {
  const [courses] = useState(mockCourses);
  const [attendanceRecords] = useState<AttendanceRecord[]>(mockAttendance);
  const { toast } = useToast();

  const studentCourse = courses.find(course => course.name === student.course);

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
    if (!student.schedule) return 0;
    
    let totalHours = 0;
    Object.entries(student.schedule).forEach(([day, timeIds]) => {
      if (timeIds && timeIds.length > 0) {
        timeIds.forEach(timeId => {
          const timeSlot = AVAILABLE_TIMES[day as WeekDay]?.find(slot => slot.id === timeId);
          if (timeSlot) {
            totalHours += timeSlot.hours;
          }
        });
      }
    });
    return totalHours;
  };

  const getCompletedHours = () => {
    const studentRecords = attendanceRecords.filter(record => record.studentId === student.id);
    return studentRecords
      .filter(record => record.status === 'present')
      .reduce((sum, record) => sum + record.classHours, 0);
  };

  const calculateEstimatedEndDate = () => {
    if (!studentCourse) return null;

    const completedHours = getCompletedHours();
    const weeklyHours = getTotalWeeklyHours();
    const remainingHours = studentCourse.totalHours - completedHours;
    
    if (remainingHours <= 0 || weeklyHours === 0) return null;

    const weeksRemaining = Math.ceil(remainingHours / weeklyHours);
    const today = new Date();
    const estimatedEndDate = new Date(today);
    estimatedEndDate.setDate(today.getDate() + (weeksRemaining * 7));

    return estimatedEndDate;
  };

  const getStudentScheduleDisplay = () => {
    if (!student.schedule) return null;

    const scheduleByDay: { [key: string]: { timeSlot: any, hours: number }[] } = {};
    
    Object.entries(student.schedule).forEach(([day, timeIds]) => {
      if (timeIds && timeIds.length > 0) {
        scheduleByDay[day] = timeIds.map(timeId => {
          const timeSlot = AVAILABLE_TIMES[day as WeekDay]?.find(slot => slot.id === timeId);
          return { timeSlot, hours: timeSlot?.hours || 0 };
        }).filter(item => item.timeSlot);
      }
    });

    return scheduleByDay;
  };

  const handleCompleteStudent = () => {
    if (onCompleteStudent) {
      onCompleteStudent(student);
      toast({
        title: "Curso Finalizado!",
        description: `O curso de ${student.fullName} foi marcado como concluído.`,
      });
    }
  };

  const isMinor = calculateAge(student.birthDate) < 18;
  const scheduleDisplay = getStudentScheduleDisplay();
  const completedHours = getCompletedHours();
  const estimatedEndDate = calculateEstimatedEndDate();
  const courseProgressPercentage = studentCourse ? (completedHours / studentCourse.totalHours) * 100 : 0;

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
        
        <div className="flex space-x-3">
          {!student.isCompleted && (
            <Button 
              onClick={handleCompleteStudent}
              className="bg-green-600 hover:bg-green-700 text-white px-6 py-2"
            >
              <CheckCircle className="mr-2 h-4 w-4" />
              Finalizar Curso
            </Button>
          )}
          
          <Button 
            onClick={() => onEdit(student)}
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2"
          >
            <Edit className="mr-2 h-4 w-4" />
            Editar
          </Button>
        </div>
      </div>

      {/* Status do Curso */}
      {student.isCompleted && (
        <Card className="border-green-200 bg-green-50">
          <CardContent className="pt-4">
            <div className="flex items-center space-x-2">
              <CheckCircle className="h-5 w-5 text-green-600" />
              <span className="font-semibold text-green-800">Curso Finalizado</span>
              {student.completionDate && (
                <span className="text-green-600">em {formatDate(student.completionDate)}</span>
              )}
            </div>
          </CardContent>
        </Card>
      )}

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

            {student.cpf && (
              <div>
                <label className="text-sm font-medium text-gray-600">CPF</label>
                <p className="text-lg font-semibold text-gray-900">{student.cpf}</p>
              </div>
            )}

            {student.address && (
              <div>
                <label className="text-sm font-medium text-gray-600">Endereço</label>
                <p className="text-lg font-semibold text-gray-900">{student.address}</p>
              </div>
            )}
            
            {isMinor && (
              <>
                {student.guardian && (
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
                
                {student.fatherName && (
                  <div>
                    <label className="text-sm font-medium text-gray-600">Nome do Pai</label>
                    <p className="text-lg font-semibold text-gray-900">{student.fatherName}</p>
                  </div>
                )}
                
                {student.motherName && (
                  <div>
                    <label className="text-sm font-medium text-gray-600">Nome da Mãe</label>
                    <p className="text-lg font-semibold text-gray-900">{student.motherName}</p>
                  </div>
                )}
              </>
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
                  <label className="text-sm font-medium text-gray-600">Horas Completadas</label>
                  <div className="flex items-center space-x-2">
                    <p className="text-lg font-semibold text-gray-900">{completedHours}h</p>
                    <Badge className={courseProgressPercentage >= 100 ? "bg-green-100 text-green-800" : "bg-blue-100 text-blue-800"}>
                      {courseProgressPercentage.toFixed(1)}%
                    </Badge>
                  </div>
                </div>

                <div>
                  <label className="text-sm font-medium text-gray-600">Previsão de Término Original</label>
                  <p className="text-lg font-semibold text-gray-900">{formatDate(studentCourse.endDate)}</p>
                </div>

                {!student.isCompleted && estimatedEndDate && (
                  <div>
                    <label className="text-sm font-medium text-gray-600">Previsão Atual de Término</label>
                    <div className="flex items-center space-x-2">
                      <p className="text-lg font-semibold text-gray-900">{formatDate(estimatedEndDate.toISOString())}</p>
                      {estimatedEndDate > new Date(studentCourse.endDate) && (
                        <div className="flex items-center space-x-1">
                          <AlertTriangle className="h-4 w-4 text-amber-600" />
                          <Badge className="bg-amber-100 text-amber-800 border-amber-200">
                            Atrasado
                          </Badge>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </>
            )}
          </div>

          {!student.isCompleted && courseProgressPercentage >= 100 && (
            <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
              <div className="flex items-center space-x-2">
                <CheckCircle className="h-5 w-5 text-green-600" />
                <p className="text-green-800 font-medium">
                  Este aluno completou a carga horária necessária e pode finalizar o curso!
                </p>
              </div>
            </div>
          )}
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
          {scheduleDisplay && Object.keys(scheduleDisplay).length > 0 ? (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">Horário Personalizado</h3>
                  <p className="text-sm text-gray-600">
                    {getTotalWeeklyHours()}h por semana
                  </p>
                </div>
                <Badge className="bg-blue-100 text-blue-800 border-blue-200">
                  Individual
                </Badge>
              </div>
              
              <div className="grid gap-3">
                <div>
                  <label className="text-sm font-medium text-gray-600">Cronograma Semanal</label>
                  <div className="grid gap-2 mt-2">
                    {Object.entries(scheduleDisplay).map(([day, timeSlots]) => (
                      <div key={day} className="p-3 bg-blue-50 rounded-lg border border-blue-200">
                        <div className="flex items-center justify-between mb-2">
                          <Badge variant="secondary" className="bg-blue-100 text-blue-800">
                            {getDayName(day as WeekDay)}
                          </Badge>
                          <div className="flex items-center space-x-2">
                            <Clock className="h-4 w-4 text-blue-600" />
                            <span className="text-sm font-semibold text-blue-900">
                              {timeSlots.reduce((sum, slot) => sum + slot.hours, 0)}h
                            </span>
                          </div>
                        </div>
                        <div className="space-y-1">
                          {timeSlots.map((slot, index) => (
                            <div key={index} className="text-sm text-gray-700">
                              {slot.timeSlot.time} ({slot.timeSlot.hours}h)
                            </div>
                          ))}
                        </div>
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
