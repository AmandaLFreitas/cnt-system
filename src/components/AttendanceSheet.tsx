
import { useState } from 'react';
import { Student, AttendanceRecord, WeekDay, AVAILABLE_TIMES } from '../types';
import { mockStudents, mockAttendance, mockCourses } from '../data/mockData';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ArrowLeft, Check, X, User, Save, Clock, Users, Calendar, Monitor } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface AttendanceSheetProps {
  onBack: () => void;
  onShowScheduleView: () => void;
}

const AttendanceSheet = ({ onBack, onShowScheduleView }: AttendanceSheetProps) => {
  const [students] = useState<Student[]>(mockStudents);
  const [courses] = useState(mockCourses);
  const [attendanceRecords, setAttendanceRecords] = useState<AttendanceRecord[]>(mockAttendance);
  
  const [todayAttendance, setTodayAttendance] = useState<Record<string, 'present' | 'absent'>>({});
  const [selectedDay, setSelectedDay] = useState<WeekDay>('monday');
  const [selectedTimeSlot, setSelectedTimeSlot] = useState<string>('');
  const { toast } = useToast();

  const today = new Date().toISOString().split('T')[0];
  const TOTAL_COMPUTERS = 14;

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

  const availableTimeSlots = AVAILABLE_TIMES[selectedDay] || [];

  const filteredStudents = students.filter(student => {
    if (!student.schedule || !student.schedule[selectedDay]) return false;
    if (!selectedTimeSlot) return true;
    return student.schedule[selectedDay].includes(selectedTimeSlot);
  });

  const getClassHours = () => {
    if (!selectedTimeSlot) return 1;
    const timeSlot = availableTimeSlots.find(slot => slot.id === selectedTimeSlot);
    return timeSlot?.hours || 1;
  };

  const handleAttendanceChange = (studentId: string, status: 'present' | 'absent') => {
    setTodayAttendance(prev => ({
      ...prev,
      [studentId]: status
    }));
  };

  const saveAttendance = () => {
    if (!selectedTimeSlot) {
      toast({
        title: "Erro!",
        description: "Selecione um horário antes de salvar a chamada.",
        variant: "destructive",
      });
      return;
    }

    const classHours = getClassHours();
    const newRecords: AttendanceRecord[] = Object.entries(todayAttendance).map(([studentId, status]) => ({
      id: `${Date.now()}-${studentId}`,
      studentId,
      date: today,
      status,
      classHours: status === 'present' ? classHours : 0
    }));

    setAttendanceRecords(prev => [...prev, ...newRecords]);
    
    toast({
      title: "Chamada Salva!",
      description: `Presença registrada para ${newRecords.length} alunos no horário ${availableTimeSlots.find(s => s.id === selectedTimeSlot)?.time}.`,
    });

    setTodayAttendance({});
  };

  const getTodayAttendanceCount = () => {
    const present = Object.values(todayAttendance).filter(status => status === 'present').length;
    const absent = Object.values(todayAttendance).filter(status => status === 'absent').length;
    return { present, absent, total: present + absent };
  };

  const { present, absent, total } = getTodayAttendanceCount();
  const enrolledStudents = filteredStudents.length;
  const availableSlots = TOTAL_COMPUTERS - enrolledStudents;

  return (
    <div className="space-y-4 md:space-y-6 p-2 md:p-4">
      <div className="flex flex-col space-y-4 md:flex-row md:items-center md:justify-between md:space-y-0">
        <div className="flex items-center space-x-4">
          <Button variant="outline" onClick={onBack} className="px-3">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Voltar
          </Button>
          <div>
            <h2 className="text-xl md:text-3xl font-bold text-gray-900 dark:text-gray-100">
              Chamada - {new Date().toLocaleDateString('pt-BR')}
            </h2>
            <p className="text-gray-600 dark:text-gray-400 mt-1 text-sm md:text-base">
              Registre a presença dos alunos
            </p>
          </div>
        </div>
        
        <div className="flex flex-col space-y-2 md:flex-row md:space-y-0 md:space-x-3">
          <Button 
            onClick={onShowScheduleView}
            variant="outline"
            size="sm"
            className="border-blue-200 text-blue-700 hover:bg-blue-50 dark:border-blue-700 dark:text-blue-300 dark:hover:bg-blue-900"
          >
            <Calendar className="mr-2 h-4 w-4" />
            Ver Grade Horária
          </Button>
          
          {total > 0 && selectedTimeSlot && (
            <Button 
              onClick={saveAttendance}
              size="sm"
              className="bg-green-600 hover:bg-green-700 text-white px-4 md:px-6 py-2"
            >
              <Save className="mr-2 h-4 w-4" />
              Salvar Chamada
            </Button>
          )}
        </div>
      </div>

      {/* Seleção de Dia e Horário */}
      <Card className="dark:bg-gray-800 dark:border-gray-700">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2 text-gray-900 dark:text-gray-100">
            <Clock className="h-5 w-5" />
            <span>Selecionar Dia e Horário</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Dia da Semana</label>
              <Select value={selectedDay} onValueChange={(value) => {
                setSelectedDay(value as WeekDay);
                setSelectedTimeSlot('');
                setTodayAttendance({});
              }}>
                <SelectTrigger className="dark:bg-gray-700 dark:border-gray-600 dark:text-gray-100">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="dark:bg-gray-700 dark:border-gray-600">
                  {Object.keys(AVAILABLE_TIMES).filter(day => 
                    AVAILABLE_TIMES[day as WeekDay].length > 0
                  ).map(day => (
                    <SelectItem key={day} value={day} className="dark:text-gray-100 dark:hover:bg-gray-600">
                      {getDayName(day as WeekDay)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Horário</label>
              <Select value={selectedTimeSlot} onValueChange={(value) => {
                setSelectedTimeSlot(value);
                setTodayAttendance({});
              }}>
                <SelectTrigger className="dark:bg-gray-700 dark:border-gray-600 dark:text-gray-100">
                  <SelectValue placeholder="Selecione o horário" />
                </SelectTrigger>
                <SelectContent className="dark:bg-gray-700 dark:border-gray-600">
                  {availableTimeSlots.map(slot => (
                    <SelectItem key={slot.id} value={slot.id} className="dark:text-gray-100 dark:hover:bg-gray-600">
                      {slot.time} ({slot.hours}h)
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Informações de Vagas */}
      {selectedTimeSlot && (
        <Card className="bg-blue-50 border-blue-200 dark:bg-blue-900/20 dark:border-blue-700">
          <CardContent className="pt-6">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6 text-center">
              <div>
                <div className="flex items-center justify-center space-x-2 mb-2">
                  <Monitor className="h-4 w-4 md:h-5 md:w-5 text-blue-600 dark:text-blue-400" />
                  <span className="text-xs md:text-sm font-medium text-gray-600 dark:text-gray-300">Total de Vagas</span>
                </div>
                <div className="text-lg md:text-2xl font-bold text-blue-600 dark:text-blue-400">{TOTAL_COMPUTERS}</div>
              </div>
              <div>
                <div className="flex items-center justify-center space-x-2 mb-2">
                  <Users className="h-4 w-4 md:h-5 md:w-5 text-green-600 dark:text-green-400" />
                  <span className="text-xs md:text-sm font-medium text-gray-600 dark:text-gray-300">Alunos Inscritos</span>
                </div>
                <div className="text-lg md:text-2xl font-bold text-green-600 dark:text-green-400">{enrolledStudents}</div>
              </div>
              <div>
                <div className="flex items-center justify-center space-x-2 mb-2">
                  <Monitor className="h-4 w-4 md:h-5 md:w-5 text-orange-600 dark:text-orange-400" />
                  <span className="text-xs md:text-sm font-medium text-gray-600 dark:text-gray-300">Vagas Disponíveis</span>
                </div>
                <div className="text-lg md:text-2xl font-bold text-orange-600 dark:text-orange-400">{availableSlots}</div>
              </div>
              <div>
                <div className="flex items-center justify-center space-x-2 mb-2">
                  <Clock className="h-4 w-4 md:h-5 md:w-5 text-purple-600 dark:text-purple-400" />
                  <span className="text-xs md:text-sm font-medium text-gray-600 dark:text-gray-300">Ocupação</span>
                </div>
                <div className="text-lg md:text-2xl font-bold text-purple-600 dark:text-purple-400">
                  {TOTAL_COMPUTERS > 0 ? Math.round((enrolledStudents / TOTAL_COMPUTERS) * 100) : 0}%
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {total > 0 && (
        <Card className="bg-green-50 border-green-200 dark:bg-green-900/20 dark:border-green-700">
          <CardContent className="pt-6">
            <div className="flex items-center justify-center space-x-4 md:space-x-8 text-center">
              <div>
                <div className="text-xl md:text-2xl font-bold text-green-600 dark:text-green-400">{present}</div>
                <div className="text-xs md:text-sm text-gray-600 dark:text-gray-300">Presentes</div>
              </div>
              <div>
                <div className="text-xl md:text-2xl font-bold text-red-600 dark:text-red-400">{absent}</div>
                <div className="text-xs md:text-sm text-gray-600 dark:text-gray-300">Ausentes</div>
              </div>
              <div>
                <div className="text-xl md:text-2xl font-bold text-blue-600 dark:text-blue-400">{total}</div>
                <div className="text-xs md:text-sm text-gray-600 dark:text-gray-300">Total Registrado</div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {selectedTimeSlot && (
        <div className="grid gap-4">
          {filteredStudents.length > 0 ? (
            filteredStudents.map((student) => {
              const attendanceStatus = todayAttendance[student.id];
              const courseInfo = getStudentCourseInfo(student);
              
              return (
                <Card key={student.id} className="hover:shadow-md transition-shadow duration-200 dark:bg-gray-800 dark:border-gray-700">
                  <CardContent className="pt-4 md:pt-6">
                    <div className="flex flex-col space-y-4 md:flex-row md:items-center md:justify-between md:space-y-0">
                      <div className="flex items-center space-x-3 md:space-x-4">
                        <div className="h-10 w-10 md:h-12 md:w-12 rounded-full bg-blue-100 dark:bg-blue-900/50 flex items-center justify-center flex-shrink-0">
                          <User className="h-5 w-5 md:h-6 md:w-6 text-blue-600 dark:text-blue-400" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <h3 className="text-base md:text-lg font-semibold text-gray-900 dark:text-gray-100 truncate">
                            {student.fullName}
                          </h3>
                          <div className="flex flex-col space-y-2 md:flex-row md:items-center md:space-y-0 md:space-x-4 mt-1">
                            <Badge variant="secondary" className="bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300 text-xs w-fit">
                              {student.course}
                            </Badge>
                            <div className="text-xs md:text-sm text-gray-600 dark:text-gray-400 flex flex-col space-y-1 md:flex-row md:items-center md:space-y-0 md:space-x-4">
                              <div className="flex items-center space-x-1">
                                <Calendar className="h-3 w-3 text-green-600 dark:text-green-400 flex-shrink-0" />
                                <span className="font-medium">Início:</span> 
                                <span>{formatDate(student.courseStartDate)}</span>
                              </div>
                              {courseInfo && (
                                <div className="flex items-center space-x-1">
                                  <Calendar className="h-3 w-3 text-red-600 dark:text-red-400 flex-shrink-0" />
                                  <span className="font-medium">Término:</span> 
                                  <span>{formatDate(courseInfo.endDate)}</span>
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="flex flex-col space-y-3 md:flex-row md:items-center md:space-y-0 md:space-x-3">
                        {attendanceStatus && (
                          <Badge 
                            variant={attendanceStatus === 'present' ? 'default' : 'destructive'}
                            className={attendanceStatus === 'present' 
                              ? 'bg-green-100 text-green-800 border-green-200 dark:bg-green-900/50 dark:text-green-300 dark:border-green-700' 
                              : 'bg-red-100 text-red-800 border-red-200 dark:bg-red-900/50 dark:text-red-300 dark:border-red-700'
                            }
                          >
                            {attendanceStatus === 'present' ? 'Presente' : 'Faltou'}
                          </Badge>
                        )}
                        
                        <div className="flex space-x-2">
                          <Button
                            variant={attendanceStatus === 'present' ? 'default' : 'outline'}
                            size="sm"
                            onClick={() => handleAttendanceChange(student.id, 'present')}
                            className={attendanceStatus === 'present' 
                              ? 'bg-green-600 hover:bg-green-700 text-white text-xs px-2 md:px-3' 
                              : 'border-green-300 text-green-700 hover:bg-green-50 dark:border-green-600 dark:text-green-400 dark:hover:bg-green-900/20 text-xs px-2 md:px-3'
                            }
                          >
                            <Check className="h-3 w-3 md:h-4 md:w-4 mr-1" />
                            <span className="hidden sm:inline">Presente</span>
                            <span className="sm:hidden">P</span>
                          </Button>
                          
                          <Button
                            variant={attendanceStatus === 'absent' ? 'destructive' : 'outline'}
                            size="sm"
                            onClick={() => handleAttendanceChange(student.id, 'absent')}
                            className={attendanceStatus === 'absent' 
                              ? 'bg-red-600 hover:bg-red-700 text-white text-xs px-2 md:px-3' 
                              : 'border-red-300 text-red-700 hover:bg-red-50 dark:border-red-600 dark:text-red-400 dark:hover:bg-red-900/20 text-xs px-2 md:px-3'
                            }
                          >
                            <X className="h-3 w-3 md:h-4 md:w-4 mr-1" />
                            <span className="hidden sm:inline">Ausente</span>
                            <span className="sm:hidden">A</span>
                          </Button>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })
          ) : (
            <Card className="dark:bg-gray-800 dark:border-gray-700">
              <CardContent className="py-8 text-center text-gray-500 dark:text-gray-400">
                <Clock className="h-12 w-12 mx-auto mb-4 text-gray-300 dark:text-gray-600" />
                <p>Nenhum aluno encontrado para este horário</p>
              </CardContent>
            </Card>
          )}
        </div>
      )}

      {!selectedTimeSlot && (
        <Card className="dark:bg-gray-800 dark:border-gray-700">
          <CardContent className="py-8 text-center text-gray-500 dark:text-gray-400">
            <Clock className="h-12 w-12 mx-auto mb-4 text-gray-300 dark:text-gray-600" />
            <p>Selecione um dia e horário para fazer a chamada</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default AttendanceSheet;
