
import { useState } from 'react';
import { Student } from '../types';
import { mockStudents } from '../data/mockData';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { User, Calendar, BookOpen, Eye } from 'lucide-react';

interface StudentListProps {
  onSelectStudent: (student: Student) => void;
  onShowAttendance: () => void;
}

const StudentList = ({ onSelectStudent, onShowAttendance }: StudentListProps) => {
  const [students] = useState<Student[]>(mockStudents);

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

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-bold text-gray-900">Lista de Alunos</h2>
          <p className="text-gray-600 mt-1">Gerencie os alunos e visualize informações</p>
        </div>
        <Button 
          onClick={onShowAttendance}
          className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2"
        >
          <Calendar className="mr-2 h-4 w-4" />
          Fazer Chamada
        </Button>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {students.map((student) => (
          <Card key={student.id} className="hover:shadow-lg transition-shadow duration-200 border border-gray-200">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center">
                    <User className="h-5 w-5 text-blue-600" />
                  </div>
                  <div>
                    <CardTitle className="text-lg text-gray-900">{student.fullName}</CardTitle>
                    <p className="text-sm text-gray-500">{calculateAge(student.birthDate)} anos</p>
                  </div>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center space-x-2 text-sm text-gray-600">
                <Calendar className="h-4 w-4" />
                <span>Nascimento: {formatDate(student.birthDate)}</span>
              </div>
              
              <div className="flex items-center space-x-2">
                <BookOpen className="h-4 w-4 text-gray-600" />
                <Badge variant="secondary" className="text-xs bg-blue-50 text-blue-700 border-blue-200">
                  {student.course}
                </Badge>
              </div>

              <div className="pt-2">
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => onSelectStudent(student)}
                  className="w-full border-blue-200 text-blue-700 hover:bg-blue-50"
                >
                  <Eye className="mr-2 h-4 w-4" />
                  Ver Frequência
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default StudentList;
