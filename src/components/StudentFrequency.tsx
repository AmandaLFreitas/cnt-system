
import { useState, useMemo } from 'react';
import { Student, AttendanceRecord, Course } from '../types';
import { mockAttendanceRecords, mockCourses } from '../data/mockData';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { ArrowLeft, User, Calendar, Clock, TrendingUp, CheckCircle, XCircle } from 'lucide-react';

interface StudentFrequencyProps {
  student: Student;
  onBack: () => void;
}

const StudentFrequency = ({ student, onBack }: StudentFrequencyProps) => {
  const [attendanceRecords] = useState<AttendanceRecord[]>(mockAttendanceRecords);
  const [courses] = useState<Course[]>(mockCourses);

  const studentRecords = attendanceRecords.filter(record => record.studentId === student.id);
  const studentCourse = courses.find(course => course.name === student.course);

  const frequencyData = useMemo(() => {
    const totalClasses = studentRecords.length;
    const presentClasses = studentRecords.filter(record => record.status === 'present').length;
    const absentClasses = totalClasses - presentClasses;
    const completedHours = studentRecords
      .filter(record => record.status === 'present')
      .reduce((sum, record) => sum + record.classHours, 0);
    
    const attendancePercentage = totalClasses > 0 ? (presentClasses / totalClasses) * 100 : 0;
    const courseProgressPercentage = studentCourse 
      ? (completedHours / studentCourse.totalHours) * 100 
      : 0;

    return {
      totalClasses,
      presentClasses,
      absentClasses,
      completedHours,
      attendancePercentage,
      courseProgressPercentage,
      totalCourseHours: studentCourse?.totalHours || 0
    };
  }, [studentRecords, studentCourse]);

  const getAttendanceStatus = (percentage: number) => {
    if (percentage >= 90) return { status: 'Excelente', color: 'text-green-600', bgColor: 'bg-green-100' };
    if (percentage >= 80) return { status: 'Bom', color: 'text-blue-600', bgColor: 'bg-blue-100' };
    if (percentage >= 70) return { status: 'Regular', color: 'text-yellow-600', bgColor: 'bg-yellow-100' };
    return { status: 'Baixo', color: 'text-red-600', bgColor: 'bg-red-100' };
  };

  const attendanceStatus = getAttendanceStatus(frequencyData.attendancePercentage);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('pt-BR');
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center space-x-4">
        <Button variant="outline" onClick={onBack} className="px-3">
          <ArrowLeft className="h-4 w-4 mr-2" />
          Voltar
        </Button>
        <div>
          <h2 className="text-3xl font-bold text-gray-900">Frequência do Aluno</h2>
          <p className="text-gray-600 mt-1">Detalhes de presença e carga horária</p>
        </div>
      </div>

      {/* Informações do Aluno */}
      <Card className="border-blue-200 bg-blue-50">
        <CardHeader>
          <div className="flex items-center space-x-4">
            <div className="h-16 w-16 rounded-full bg-blue-100 flex items-center justify-center">
              <User className="h-8 w-8 text-blue-600" />
            </div>
            <div>
              <CardTitle className="text-xl text-gray-900">{student.fullName}</CardTitle>
              <p className="text-gray-600">Nascimento: {formatDate(student.birthDate)}</p>
              <Badge className="mt-2 bg-blue-600 text-white">{student.course}</Badge>
            </div>
          </div>
        </CardHeader>
      </Card>

      {/* Estatísticas Gerais */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center space-x-2">
              <CheckCircle className="h-5 w-5 text-green-600" />
              <div>
                <p className="text-2xl font-bold text-green-600">{frequencyData.presentClasses}</p>
                <p className="text-sm text-gray-600">Presenças</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center space-x-2">
              <XCircle className="h-5 w-5 text-red-600" />
              <div>
                <p className="text-2xl font-bold text-red-600">{frequencyData.absentClasses}</p>
                <p className="text-sm text-gray-600">Faltas</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center space-x-2">
              <Clock className="h-5 w-5 text-blue-600" />
              <div>
                <p className="text-2xl font-bold text-blue-600">{frequencyData.completedHours}h</p>
                <p className="text-sm text-gray-600">Horas Cursadas</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center space-x-2">
              <TrendingUp className="h-5 w-5 text-purple-600" />
              <div>
                <p className="text-2xl font-bold text-purple-600">{frequencyData.attendancePercentage.toFixed(1)}%</p>
                <p className="text-sm text-gray-600">Frequência</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Progresso do Curso */}
      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <TrendingUp className="h-5 w-5" />
              <span>Frequência de Presença</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">
                {frequencyData.presentClasses} de {frequencyData.totalClasses} aulas
              </span>
              <Badge className={`${attendanceStatus.bgColor} ${attendanceStatus.color} border-0`}>
                {attendanceStatus.status}
              </Badge>
            </div>
            <Progress 
              value={frequencyData.attendancePercentage} 
              className="h-3"
            />
            <p className="text-center text-lg font-semibold">
              {frequencyData.attendancePercentage.toFixed(1)}%
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Clock className="h-5 w-5" />
              <span>Progresso do Curso</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between text-sm text-gray-600">
              <span>{frequencyData.completedHours}h de {frequencyData.totalCourseHours}h</span>
              <span>{frequencyData.totalCourseHours - frequencyData.completedHours}h restantes</span>
            </div>
            <Progress 
              value={frequencyData.courseProgressPercentage} 
              className="h-3"
            />
            <p className="text-center text-lg font-semibold">
              {frequencyData.courseProgressPercentage.toFixed(1)}%
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Histórico de Presença */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Calendar className="h-5 w-5" />
            <span>Histórico de Presença</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3 max-h-96 overflow-y-auto">
            {studentRecords
              .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
              .map((record) => (
                <div 
                  key={record.id} 
                  className="flex items-center justify-between p-3 rounded-lg border bg-gray-50"
                >
                  <div className="flex items-center space-x-3">
                    {record.status === 'present' ? (
                      <CheckCircle className="h-5 w-5 text-green-600" />
                    ) : (
                      <XCircle className="h-5 w-5 text-red-600" />
                    )}
                    <div>
                      <p className="font-medium">{formatDate(record.date)}</p>
                      <p className="text-sm text-gray-600">
                        {record.classHours}h de aula
                      </p>
                    </div>
                  </div>
                  <Badge 
                    variant={record.status === 'present' ? 'default' : 'destructive'}
                    className={record.status === 'present' 
                      ? 'bg-green-100 text-green-800 border-green-200' 
                      : 'bg-red-100 text-red-800 border-red-200'
                    }
                  >
                    {record.status === 'present' ? 'Presente' : 'Faltou'}
                  </Badge>
                </div>
              ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default StudentFrequency;
