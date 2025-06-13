
import { useState, useMemo } from 'react';
import { Student, AttendanceRecord } from '../types';
import { mockAttendanceRecords } from '../data/mockData';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { ArrowLeft, BarChart3, Clock, CheckCircle, XCircle } from 'lucide-react';

interface ReportsProps {
  students: Student[];
  onBack: () => void;
}

const Reports = ({ students, onBack }: ReportsProps) => {
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

    return { studentStats };
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
          <p className="text-gray-600 mt-1">Controle individual de frequência dos alunos</p>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <BarChart3 className="h-5 w-5" />
            <span>Frequência Individual dos Alunos</span>
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
                <TableHead>Horas Cumpridas</TableHead>
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
