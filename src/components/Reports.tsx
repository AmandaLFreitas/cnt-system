
import { useState, useMemo } from 'react';
import { Student, AttendanceRecord, WeekDay, AVAILABLE_TIMES } from '../types';
import { mockAttendanceRecords } from '../data/mockData';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { ArrowLeft, BarChart3, Clock, CheckCircle, XCircle, Search, Calendar, User } from 'lucide-react';

interface ReportsProps {
  students: Student[];
  onBack: () => void;
}

const Reports = ({ students, onBack }: ReportsProps) => {
  const [attendanceRecords] = useState<AttendanceRecord[]>(mockAttendanceRecords);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedDay, setSelectedDay] = useState<string>('all');
  const [selectedTimeSlot, setSelectedTimeSlot] = useState<string>('all');
  const [selectedMonth, setSelectedMonth] = useState<string>('all');

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

  const availableDays = Object.keys(AVAILABLE_TIMES).filter(
    day => AVAILABLE_TIMES[day as WeekDay].length > 0
  ) as WeekDay[];

  const availableTimeSlots = selectedDay !== 'all' && selectedDay !== '' 
    ? AVAILABLE_TIMES[selectedDay as WeekDay] || []
    : [];

  const getMonthsFromRecords = () => {
    const months = new Set<string>();
    attendanceRecords.forEach(record => {
      const date = new Date(record.date);
      const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
      months.add(monthKey);
    });
    return Array.from(months).sort().reverse();
  };

  const filteredStudents = useMemo(() => {
    return students.filter(student => {
      // Filtro por nome
      if (searchTerm && !student.fullName.toLowerCase().includes(searchTerm.toLowerCase())) {
        return false;
      }

      // Filtro por dia da semana
      if (selectedDay !== 'all') {
        const daySchedule = student.schedule?.[selectedDay as WeekDay];
        if (!daySchedule || daySchedule.length === 0) {
          return false;
        }

        // Filtro por horário específico
        if (selectedTimeSlot !== 'all') {
          if (!daySchedule.includes(selectedTimeSlot)) {
            return false;
          }
        }
      }

      return true;
    });
  }, [students, searchTerm, selectedDay, selectedTimeSlot]);

  const reportData = useMemo(() => {
    return filteredStudents.map(student => {
      let studentRecords = attendanceRecords.filter(record => record.studentId === student.id);
      
      // Filtro por mês
      if (selectedMonth !== 'all') {
        const [year, month] = selectedMonth.split('-');
        studentRecords = studentRecords.filter(record => {
          const recordDate = new Date(record.date);
          return recordDate.getFullYear() === parseInt(year) && 
                 recordDate.getMonth() + 1 === parseInt(month);
        });
      }

      const totalClasses = studentRecords.length;
      const presentClasses = studentRecords.filter(record => record.status === 'present').length;
      const absentClasses = totalClasses - presentClasses;
      const completedHours = studentRecords
        .filter(record => record.status === 'present')
        .reduce((sum, record) => sum + record.classHours, 0);
      
      // Calcular total de horas até agora (todos os registros)
      const allStudentRecords = attendanceRecords.filter(record => record.studentId === student.id);
      const totalHoursToDate = allStudentRecords
        .filter(record => record.status === 'present')
        .reduce((sum, record) => sum + record.classHours, 0);
      
      const attendancePercentage = totalClasses > 0 ? (presentClasses / totalClasses) * 100 : 0;

      return {
        student,
        totalClasses,
        presentClasses,
        absentClasses,
        completedHours,
        totalHoursToDate,
        attendancePercentage
      };
    });
  }, [filteredStudents, attendanceRecords, selectedMonth]);

  const getAttendanceStatus = (percentage: number) => {
    if (percentage >= 90) return { status: 'Excelente', color: 'text-green-600', bgColor: 'bg-green-100' };
    if (percentage >= 80) return { status: 'Bom', color: 'text-blue-600', bgColor: 'bg-blue-100' };
    if (percentage >= 70) return { status: 'Regular', color: 'text-yellow-600', bgColor: 'bg-yellow-100' };
    return { status: 'Baixo', color: 'text-red-600', bgColor: 'bg-red-100' };
  };

  const getMonthName = (monthKey: string) => {
    const [year, month] = monthKey.split('-');
    const date = new Date(parseInt(year), parseInt(month) - 1);
    return date.toLocaleDateString('pt-BR', { month: 'long', year: 'numeric' });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center space-x-4">
        <Button variant="outline" onClick={onBack} className="px-3">
          <ArrowLeft className="h-4 w-4 mr-2" />
          Voltar
        </Button>
        <div>
          <h2 className="text-3xl font-bold text-gray-900">Relatórios</h2>
          <p className="text-gray-600 mt-1">Controle individual de frequência dos alunos</p>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Search className="h-5 w-5" />
            <span>Filtros</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-5">
            <div className="space-y-2">
              <label className="text-sm font-medium">Buscar Aluno</label>
              <Input
                placeholder="Nome do aluno..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Dia da Semana</label>
              <Select value={selectedDay} onValueChange={setSelectedDay}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos os dias</SelectItem>
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
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos os horários</SelectItem>
                  {availableTimeSlots.map(slot => (
                    <SelectItem key={slot.id} value={slot.id}>
                      {slot.time}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Mês</label>
              <Select value={selectedMonth} onValueChange={setSelectedMonth}>
                <SelectTrigger>
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

            <div className="flex items-end">
              <Button 
                variant="outline" 
                onClick={() => {
                  setSearchTerm('');
                  setSelectedDay('all');
                  setSelectedTimeSlot('all');
                  setSelectedMonth('all');
                }}
                className="w-full"
              >
                Limpar Filtros
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <BarChart3 className="h-5 w-5" />
            <span>Frequência Individual dos Alunos</span>
            {selectedMonth !== 'all' && (
              <Badge variant="outline">
                {getMonthName(selectedMonth)}
              </Badge>
            )}
          </CardTitle>
        </CardHeader>
        <CardContent>
          {reportData.length > 0 ? (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Aluno</TableHead>
                  <TableHead>Curso</TableHead>
                  <TableHead>Presenças</TableHead>
                  <TableHead>Faltas</TableHead>
                  <TableHead>
                    {selectedMonth !== 'all' ? 'Horas do Mês' : 'Horas do Período'}
                  </TableHead>
                  <TableHead>Horas Totais</TableHead>
                  <TableHead>Frequência</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {reportData.map(({ 
                  student, 
                  totalClasses, 
                  presentClasses, 
                  absentClasses, 
                  completedHours,
                  totalHoursToDate,
                  attendancePercentage 
                }) => {
                  const attendanceStatus = getAttendanceStatus(attendancePercentage);
                  return (
                    <TableRow key={student.id}>
                      <TableCell className="font-medium">
                        <div className="flex items-center space-x-2">
                          <User className="h-4 w-4 text-blue-600" />
                          <span>{student.fullName}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline">{student.course}</Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center space-x-1">
                          <CheckCircle className="h-4 w-4 text-green-600" />
                          <span>{presentClasses}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center space-x-1">
                          <XCircle className="h-4 w-4 text-red-600" />
                          <span>{absentClasses}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center space-x-1">
                          <Clock className="h-4 w-4 text-blue-600" />
                          <span>{completedHours}h</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center space-x-1">
                          <Calendar className="h-4 w-4 text-purple-600" />
                          <span className="font-semibold">{totalHoursToDate}h</span>
                        </div>
                      </TableCell>
                      <TableCell className="font-semibold">
                        {attendancePercentage.toFixed(1)}%
                      </TableCell>
                      <TableCell>
                        <Badge className={`${attendanceStatus.bgColor} ${attendanceStatus.color} border-0`}>
                          {attendanceStatus.status}
                        </Badge>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          ) : (
            <div className="text-center py-8 text-gray-500">
              <Search className="h-12 w-12 mx-auto mb-4 text-gray-300" />
              <p>Nenhum aluno encontrado com os filtros aplicados</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default Reports;
