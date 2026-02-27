import { useState, useMemo } from 'react';
import { Student, AttendanceRecord, Course } from '../types';
import { mockAttendance, mockCourses } from '../data/mockData';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { ArrowLeft, User, Calendar, Clock, TrendingUp, CheckCircle, XCircle, BarChart3 } from 'lucide-react';

interface StudentFrequencyProps {
  student: Student;
  onBack: () => void;
}

const StudentFrequency = ({ student, onBack }: StudentFrequencyProps) => {
  const [attendanceRecords] = useState<AttendanceRecord[]>(mockAttendance);
  const [courses] = useState<Course[]>(mockCourses);
  const [selectedMonth, setSelectedMonth] = useState<string>('all');

  const studentRecords = attendanceRecords.filter(record => record.studentId === student.id);
  const studentCourse = courses.find(course => course.name === student.course);

  const getMonthsFromRecords = () => {
    const months = new Set<string>();
    studentRecords.forEach(record => {
      const date = new Date(record.date);
      const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
      months.add(monthKey);
    });
    return Array.from(months).sort().reverse();
  };

  const getMonthName = (monthKey: string) => {
    const [year, month] = monthKey.split('-');
    const date = new Date(parseInt(year), parseInt(month) - 1);
    return date.toLocaleDateString('pt-BR', { month: 'long', year: 'numeric' });
  };

  const filteredRecords = useMemo(() => {
    if (selectedMonth === 'all') return studentRecords;
    
    const [year, month] = selectedMonth.split('-');
    return studentRecords.filter(record => {
      const recordDate = new Date(record.date);
      return recordDate.getFullYear() === parseInt(year) && 
             recordDate.getMonth() + 1 === parseInt(month);
    });
  }, [studentRecords, selectedMonth]);

  const frequencyData = useMemo(() => {
    const totalClasses = filteredRecords.length;
    const presentClasses = filteredRecords.filter(record => record.status === 'present').length;
    const absentClasses = totalClasses - presentClasses;
    const completedHours = filteredRecords
      .filter(record => record.status === 'present')
      .reduce((sum, record) => sum + record.classHours, 0);
    
    const attendancePercentage = totalClasses > 0 ? (presentClasses / totalClasses) * 100 : 0;
    
    // Cálculo das horas totais (todos os registros, não apenas do período selecionado)
    const totalHoursToDate = studentRecords
      .filter(record => record.status === 'present')
      .reduce((sum, record) => sum + record.classHours, 0);
    
    const courseProgressPercentage = studentCourse 
      ? (totalHoursToDate / studentCourse.totalHours) * 100 
      : 0;

    return {
      totalClasses,
      presentClasses,
      absentClasses,
      completedHours,
      totalHoursToDate,
      attendancePercentage,
      courseProgressPercentage,
      totalCourseHours: studentCourse?.totalHours || 0
    };
  }, [filteredRecords, studentRecords, studentCourse]);

  const monthlyData = useMemo(() => {
    const monthlyStats: { [key: string]: any } = {};
    
    getMonthsFromRecords().forEach(monthKey => {
      const [year, month] = monthKey.split('-');
      const monthRecords = studentRecords.filter(record => {
        const recordDate = new Date(record.date);
        return recordDate.getFullYear() === parseInt(year) && 
               recordDate.getMonth() + 1 === parseInt(month);
      });
      
      const totalClasses = monthRecords.length;
      const presentClasses = monthRecords.filter(record => record.status === 'present').length;
      const absentClasses = totalClasses - presentClasses;
      const completedHours = monthRecords
        .filter(record => record.status === 'present')
        .reduce((sum, record) => sum + record.classHours, 0);
      const attendancePercentage = totalClasses > 0 ? (presentClasses / totalClasses) * 100 : 0;
      
      monthlyStats[monthKey] = {
        totalClasses,
        presentClasses,
        absentClasses,
        completedHours,
        attendancePercentage
      };
    });
    
    return monthlyStats;
  }, [studentRecords]);

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

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Calendar className="h-5 w-5" />
            <span>Filtro de Período</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <label className="text-sm font-medium">Selecionar Período</label>
            <Select value={selectedMonth} onValueChange={setSelectedMonth}>
              <SelectTrigger className="w-full md:w-64">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos os meses</SelectItem>
                {getMonthsFromRecords().map(month => (
                  <SelectItem key={month} value={month}>
                    {getMonthName(month)}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center space-x-2">
              <CheckCircle className="h-5 w-5 text-green-600" />
              <div>
                <p className="text-2xl font-bold text-green-600">{frequencyData.presentClasses}</p>
                <p className="text-sm text-gray-600">Presenças{selectedMonth !== 'all' ? ` (${getMonthName(selectedMonth)})` : ''}</p>
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
                <p className="text-sm text-gray-600">Faltas{selectedMonth !== 'all' ? ` (${getMonthName(selectedMonth)})` : ''}</p>
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
                <p className="text-sm text-gray-600">Horas{selectedMonth !== 'all' ? ` (${getMonthName(selectedMonth)})` : ''}</p>
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
                <p className="text-sm text-gray-600">Frequência{selectedMonth !== 'all' ? ` (${getMonthName(selectedMonth)})` : ''}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <TrendingUp className="h-5 w-5" />
              <span>Frequência de Presença</span>
              {selectedMonth !== 'all' && (
                <Badge variant="outline">
                  {getMonthName(selectedMonth)}
                </Badge>
              )}
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
              <span>Progresso do Curso (Total)</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between text-sm text-gray-600">
              <span>{frequencyData.totalHoursToDate}h de {frequencyData.totalCourseHours}h</span>
              <span>{frequencyData.totalCourseHours - frequencyData.totalHoursToDate}h restantes</span>
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

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <BarChart3 className="h-5 w-5" />
            <span>Frequência por Mês</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Mês/Ano</TableHead>
                <TableHead>Presenças</TableHead>
                <TableHead>Faltas</TableHead>
                <TableHead>Horas</TableHead>
                <TableHead>Frequência</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {Object.entries(monthlyData).map(([monthKey, data]) => {
                const monthStatus = getAttendanceStatus(data.attendancePercentage);
                return (
                  <TableRow key={monthKey}>
                    <TableCell className="font-medium">{getMonthName(monthKey)}</TableCell>
                    <TableCell>
                      <div className="flex items-center space-x-1">
                        <CheckCircle className="h-4 w-4 text-green-600" />
                        <span>{data.presentClasses}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center space-x-1">
                        <XCircle className="h-4 w-4 text-red-600" />
                        <span>{data.absentClasses}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center space-x-1">
                        <Clock className="h-4 w-4 text-blue-600" />
                        <span>{data.completedHours}h</span>
                      </div>
                    </TableCell>
                    <TableCell className="font-semibold">
                      {data.attendancePercentage.toFixed(1)}%
                    </TableCell>
                    <TableCell>
                      <Badge className={`${monthStatus.bgColor} ${monthStatus.color} border-0`}>
                        {monthStatus.status}
                      </Badge>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Calendar className="h-5 w-5" />
            <span>Histórico de Presença</span>
            {selectedMonth !== 'all' && (
              <Badge variant="outline">
                {getMonthName(selectedMonth)}
              </Badge>
            )}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3 max-h-96 overflow-y-auto">
            {filteredRecords
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
