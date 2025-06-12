
import { useState, useMemo } from 'react';
import { Student, AttendanceRecord } from '../types';
import { mockStudents, mockAttendanceRecords } from '../data/mockData';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { ArrowLeft, BarChart3, Users, Clock, TrendingUp, CheckCircle, XCircle } from 'lucide-react';

interface ReportsProps {
  onBack: () => void;
}

const Reports = ({ onBack }: ReportsProps) => {
  const [students] = useState<Student[]>(mockStudents);
  const [attendanceRecords] = useState<AttendanceRecord[]>(mockAttendanceRecords);

  const reportData = useMemo(() => {
    const studentStats = students.map(student => {
      const studentRecords = attendanceRecords.filter(record => record.studentId === student.id);
      const totalClasses = studentRecords.length;
      const presentClasses = studentRecords.filter(record => record.status === 'present').length;
      const absentClasses = totalClasses - presentClasses;
      const completedHours = studentRecords
        .filter(record => record.status === 'present')
        .reduce((sum, record) => sum + record.classHours, 0);
      
      const attendancePercentage = totalClasses > 0 ? (presentClasses / totalClasses) * 100 : 0;

      return {
        student,
        totalClasses,
        presentClasses,
        absentClasses,
        completedHours,
        attendancePercentage
      };
    });

    const overallStats = {
      totalStudents: students.length,
      totalClasses: attendanceRecords.length,
      totalPresentClasses: attendanceRecords.filter(record => record.status === 'present').length,
      totalAbsentClasses: attendanceRecords.filter(record => record.status === 'absent').length,
      totalHours: attendanceRecords
        .filter(record => record.status === 'present')
        .reduce((sum, record) => sum + record.classHours, 0),
      averageAttendance: studentStats.reduce((sum, stat) => sum + stat.attendancePercentage, 0) / studentStats.length
    };

    return { studentStats, overallStats };
  }, [students, attendanceRecords]);

  const getAttendanceStatus = (percentage: number) => {
    if (percentage >= 90) return { status: 'Excelente', color: 'text-green-600', bgColor: 'bg-green-100' };
    if (percentage >= 80) return { status: 'Bom', color: 'text-blue-600', bgColor: 'bg-blue-100' };
    if (percentage >= 70) return { status: 'Regular', color: 'text-yellow-600', bgColor: 'bg-yellow-100' };
    return { status: 'Baixo', color: 'text-red-600', bgColor: 'bg-red-100' };
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
          <p className="text-gray-600 mt-1">Análise completa de frequência e desempenho</p>
        </div>
      </div>

      {/* Estatísticas Gerais */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center space-x-2">
              <Users className="h-5 w-5 text-blue-600" />
              <div>
                <p className="text-2xl font-bold text-blue-600">{reportData.overallStats.totalStudents}</p>
                <p className="text-sm text-gray-600">Total de Alunos</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center space-x-2">
              <CheckCircle className="h-5 w-5 text-green-600" />
              <div>
                <p className="text-2xl font-bold text-green-600">{reportData.overallStats.totalPresentClasses}</p>
                <p className="text-sm text-gray-600">Total de Presenças</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center space-x-2">
              <Clock className="h-5 w-5 text-purple-600" />
              <div>
                <p className="text-2xl font-bold text-purple-600">{reportData.overallStats.totalHours}h</p>
                <p className="text-sm text-gray-600">Horas Totais</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center space-x-2">
              <TrendingUp className="h-5 w-5 text-orange-600" />
              <div>
                <p className="text-2xl font-bold text-orange-600">{reportData.overallStats.averageAttendance.toFixed(1)}%</p>
                <p className="text-sm text-gray-600">Frequência Média</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Relatório Detalhado por Aluno */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <BarChart3 className="h-5 w-5" />
            <span>Relatório Detalhado por Aluno</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Aluno</TableHead>
                <TableHead>Curso</TableHead>
                <TableHead>Presenças</TableHead>
                <TableHead>Faltas</TableHead>
                <TableHead>Horas</TableHead>
                <TableHead>Frequência</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {reportData.studentStats.map(({ student, totalClasses, presentClasses, absentClasses, completedHours, attendancePercentage }) => {
                const attendanceStatus = getAttendanceStatus(attendancePercentage);
                return (
                  <TableRow key={student.id}>
                    <TableCell className="font-medium">{student.fullName}</TableCell>
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
        </CardContent>
      </Card>
    </div>
  );
};

export default Reports;
