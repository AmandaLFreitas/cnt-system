
import { useState } from 'react';
import { Student, AttendanceRecord } from '../types';
import { mockStudents, mockAttendanceRecords } from '../data/mockData';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, Check, X, User, Save } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface AttendanceSheetProps {
  onBack: () => void;
}

const AttendanceSheet = ({ onBack }: AttendanceSheetProps) => {
  const [students] = useState<Student[]>(mockStudents);
  const [attendanceRecords, setAttendanceRecords] = useState<AttendanceRecord[]>(mockAttendanceRecords);
  const [todayAttendance, setTodayAttendance] = useState<Record<string, 'present' | 'absent'>>({});
  const [classHours] = useState(4); // Horas da aula de hoje
  const { toast } = useToast();

  const today = new Date().toISOString().split('T')[0];

  const handleAttendanceChange = (studentId: string, status: 'present' | 'absent') => {
    setTodayAttendance(prev => ({
      ...prev,
      [studentId]: status
    }));
  };

  const saveAttendance = () => {
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
      description: `Presença registrada para ${newRecords.length} alunos.`,
    });

    setTodayAttendance({});
  };

  const getTodayAttendanceCount = () => {
    const present = Object.values(todayAttendance).filter(status => status === 'present').length;
    const absent = Object.values(todayAttendance).filter(status => status === 'absent').length;
    return { present, absent, total: present + absent };
  };

  const { present, absent, total } = getTodayAttendanceCount();

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Button variant="outline" onClick={onBack} className="px-3">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Voltar
          </Button>
          <div>
            <h2 className="text-3xl font-bold text-gray-900">Chamada - {new Date().toLocaleDateString('pt-BR')}</h2>
            <p className="text-gray-600 mt-1">Registre a presença dos alunos</p>
          </div>
        </div>
        
        {total > 0 && (
          <Button 
            onClick={saveAttendance}
            className="bg-green-600 hover:bg-green-700 text-white px-6 py-2"
          >
            <Save className="mr-2 h-4 w-4" />
            Salvar Chamada
          </Button>
        )}
      </div>

      {total > 0 && (
        <Card className="bg-blue-50 border-blue-200">
          <CardContent className="pt-6">
            <div className="flex items-center justify-center space-x-8 text-center">
              <div>
                <div className="text-2xl font-bold text-green-600">{present}</div>
                <div className="text-sm text-gray-600">Presentes</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-red-600">{absent}</div>
                <div className="text-sm text-gray-600">Ausentes</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-blue-600">{total}</div>
                <div className="text-sm text-gray-600">Total Registrado</div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      <div className="grid gap-4">
        {students.map((student) => {
          const attendanceStatus = todayAttendance[student.id];
          
          return (
            <Card key={student.id} className="hover:shadow-md transition-shadow duration-200">
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div className="h-12 w-12 rounded-full bg-blue-100 flex items-center justify-center">
                      <User className="h-6 w-6 text-blue-600" />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900">{student.fullName}</h3>
                      <Badge variant="secondary" className="mt-1 bg-gray-100 text-gray-700">
                        {student.course}
                      </Badge>
                    </div>
                  </div>

                  <div className="flex items-center space-x-3">
                    {attendanceStatus && (
                      <Badge 
                        variant={attendanceStatus === 'present' ? 'default' : 'destructive'}
                        className={attendanceStatus === 'present' 
                          ? 'bg-green-100 text-green-800 border-green-200' 
                          : 'bg-red-100 text-red-800 border-red-200'
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
                          ? 'bg-green-600 hover:bg-green-700 text-white' 
                          : 'border-green-300 text-green-700 hover:bg-green-50'
                        }
                      >
                        <Check className="h-4 w-4 mr-1" />
                        Presente
                      </Button>
                      
                      <Button
                        variant={attendanceStatus === 'absent' ? 'destructive' : 'outline'}
                        size="sm"
                        onClick={() => handleAttendanceChange(student.id, 'absent')}
                        className={attendanceStatus === 'absent' 
                          ? 'bg-red-600 hover:bg-red-700 text-white' 
                          : 'border-red-300 text-red-700 hover:bg-red-50'
                        }
                      >
                        <X className="h-4 w-4 mr-1" />
                        Ausente
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
};

export default AttendanceSheet;
