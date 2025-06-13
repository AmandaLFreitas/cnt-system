
import { useState } from 'react';
import { Student } from '../types';
import { mockCourses } from '../data/mockData';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Users, Search, User, Calendar, BookOpen, Eye, Clock, UserPlus } from 'lucide-react';

interface StudentListProps {
  students: Student[];
  onSelectStudent: (student: Student) => void;
  onShowAttendance: () => void;
  onShowDetails: (student: Student) => void;
  onShowTimeSlots: () => void;
}

const StudentList = ({ students, onSelectStudent, onShowAttendance, onShowDetails, onShowTimeSlots }: StudentListProps) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [courses] = useState(mockCourses);

  const filteredStudents = students.filter(student =>
    student.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    student.course.toLowerCase().includes(searchTerm.toLowerCase())
  );

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

  const getStudentCourseInfo = (student: Student) => {
    const course = courses.find(c => c.name === student.course);
    return course;
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold text-gray-900">Gestão de Alunos</h2>
          <p className="text-gray-600 mt-1">Gerencie os estudantes ativos da instituição</p>
        </div>
        
        <div className="flex space-x-3">
          <Button 
            onClick={onShowTimeSlots}
            variant="outline"
            className="border-blue-200 text-blue-700 hover:bg-blue-50"
          >
            <Clock className="mr-2 h-4 w-4" />
            Ver Horários
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
          <CardTitle className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Users className="h-5 w-5" />
              <span>Lista de Estudantes</span>
              <Badge className="bg-blue-100 text-blue-800">
                {students.length} {students.length === 1 ? 'Aluno' : 'Alunos'}
              </Badge>
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center space-x-4">
              <div className="relative flex-1 max-w-md">
                <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Buscar por nome ou curso..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>

            {filteredStudents.length > 0 ? (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Aluno</TableHead>
                    <TableHead>Curso</TableHead>
                    <TableHead>Idade</TableHead>
                    <TableHead>Data de Início</TableHead>
                    <TableHead>Data de Término</TableHead>
                    <TableHead>Ações</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredStudents.map((student) => {
                    const courseInfo = getStudentCourseInfo(student);
                    return (
                      <TableRow key={student.id}>
                        <TableCell className="font-medium">
                          <div className="flex items-center space-x-2">
                            <User className="h-4 w-4 text-blue-600" />
                            <span>{student.fullName}</span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
                            {student.course}
                          </Badge>
                        </TableCell>
                        <TableCell>{calculateAge(student.birthDate)} anos</TableCell>
                        <TableCell>
                          <div className="flex items-center space-x-1">
                            <Calendar className="h-4 w-4 text-green-600" />
                            <span>{formatDate(student.courseStartDate)}</span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center space-x-1">
                            <Calendar className="h-4 w-4 text-red-600" />
                            <span>
                              {courseInfo 
                                ? formatDate(courseInfo.endDate)
                                : 'Data não disponível'
                              }
                            </span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex space-x-2">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => onShowDetails(student)}
                              className="text-blue-600 hover:text-blue-700"
                            >
                              <Eye className="h-4 w-4 mr-1" />
                              Ver Detalhes
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            ) : (
              <div className="text-center py-12">
                {searchTerm ? (
                  <div>
                    <Search className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                    <p className="text-gray-500">Nenhum aluno encontrado com "{searchTerm}"</p>
                  </div>
                ) : (
                  <div>
                    <UserPlus className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                    <p className="text-gray-500">Nenhum aluno cadastrado ainda</p>
                    <p className="text-sm text-gray-400 mt-1">
                      Adicione novos alunos para começar a gerenciar
                    </p>
                  </div>
                )}
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default StudentList;
