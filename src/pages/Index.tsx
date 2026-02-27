import { useEffect, useState } from 'react';
import { Student } from '../types';
import { mockStudents } from '../data/mockData';
import StudentList from '../components/StudentList';
import AttendanceSheet from '../components/AttendanceSheet';
import StudentFrequency from '../components/StudentFrequency';
import StudentDetails from '../components/StudentDetails';
import EditStudent from '../components/EditStudent';
import TimeSlotView from '../components/TimeSlotView';
import ScheduleView from '../components/ScheduleView';
import Reports from '../components/Reports';
import AddStudent from '../components/AddStudent';
import CompletedStudents from '../components/CompletedStudents';
import ManageVacancies from '../components/ManageVacancies';
import { GraduationCap, Users, Calendar, BarChart3, UserPlus, Award } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useStudents } from '@/api/hooks/students';
import { useCourses } from '@/api/hooks/courses';
import { useCreateStudent, useUpdateStudent } from '@/api/hooks/students.mutations';

type View = 'list' | 'attendance' | 'frequency' | 'details' | 'edit' | 'timeSlots' | 'scheduleView' | 'reports' | 'add' | 'completed' | 'vacancies';

const Index = () => {
  const [currentView, setCurrentView] = useState<View>('list');
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);
  const { data: studentsApi, isLoading, error } = useStudents();
  const { data: coursesApi } = useCourses();
  const createStudentMutation = useCreateStudent();
  const updateStudentMutation = useUpdateStudent();
  const [students, setStudents] = useState<Student[]>([]);
  useEffect(() => {
    if (!studentsApi || studentsApi.length === 0) {
      setStudents([]);
      return;
    }
    const normalized: Student[] = studentsApi.map((apiStudent: any) => {
      const parsedSchedule = apiStudent.schedule ? (typeof apiStudent.schedule === 'string' ? JSON.parse(apiStudent.schedule) : apiStudent.schedule) : {};
      const birth = typeof apiStudent.birthDate === 'string' ? apiStudent.birthDate.slice(0, 10) : new Date(apiStudent.birthDate).toISOString().slice(0, 10);
      return {
        id: apiStudent.id,
        fullName: apiStudent.fullName,
        cpf: apiStudent.cpf,
        guardian: apiStudent.guardian,
        fatherName: apiStudent.fatherName,
        motherName: apiStudent.motherName,
        phone: apiStudent.phone ?? '',
        birthDate: birth,
        course: apiStudent.course?.name ?? 'Sem curso',
        courseId: apiStudent.courseId ?? apiStudent.course?.id ?? null,
        courseStartDate: apiStudent.courseStartDate ? String(apiStudent.courseStartDate).slice(0, 10) : undefined,
        courseEndDate: apiStudent.courseEndDate ? String(apiStudent.courseEndDate).slice(0, 10) : undefined,
        email: apiStudent.email,
        cep: apiStudent.cep,
        street: apiStudent.street,
        number: apiStudent.number,
        neighborhood: apiStudent.neighborhood,
        city: apiStudent.city,
        state: apiStudent.state,
        schedule: parsedSchedule,
        isCompleted: apiStudent.isCompleted ?? false,
        completionDate: apiStudent.completionDate,
      } as Student;
    });
    setStudents(normalized);
  }, [studentsApi]);
  const { toast } = useToast();

  // Filtrar apenas alunos ativos (não finalizados) para as operações normais
  const activeStudents = students.filter(student => !student.isCompleted);

  const handleSelectStudent = (student: Student) => {
    setSelectedStudent(student);
    setCurrentView('frequency');
  };

  const handleShowDetails = (student: Student) => {
    setSelectedStudent(student);
    setCurrentView('details');
  };

  const handleEditStudent = (student: Student) => {
    setSelectedStudent(student);
    setCurrentView('edit');
  };

  const handleSaveStudent = (updatedStudent: Student) => {
    const courseId = coursesApi?.find((c: any) => c.name === updatedStudent.course)?.id;
    updateStudentMutation.mutate({
      id: updatedStudent.id,
      payload: {
        student: {
          fullName: updatedStudent.fullName,
          phone: updatedStudent.phone,
          birthDate: updatedStudent.birthDate,
          courseStartDate: updatedStudent.courseStartDate,
          courseEndDate: updatedStudent.courseEndDate,
          schedule: updatedStudent.schedule ? JSON.stringify(updatedStudent.schedule) : undefined,
          email: updatedStudent.email,
          cpf: updatedStudent.cpf,
          guardian: updatedStudent.guardian,
          fatherName: updatedStudent.fatherName,
          motherName: updatedStudent.motherName,
          cep: updatedStudent.cep,
          street: updatedStudent.street,
          number: updatedStudent.number,
          neighborhood: updatedStudent.neighborhood,
          city: updatedStudent.city,
          state: updatedStudent.state,
        },
        courseId,
      },
    }, {
      onSuccess: () => {
        setCurrentView('details');
      },
      onError: () => {
        setStudents(prev => prev.map(s => s.id === updatedStudent.id ? updatedStudent : s));
        setCurrentView('details');
      }
    });
  };

  const handleCompleteStudent = (student: Student) => {
    const completedStudent: Student = {
      ...student,
      isCompleted: true,
      completionDate: new Date().toISOString()
    };
    
    setStudents(prev => prev.map(s => s.id === student.id ? completedStudent : s));
    setCurrentView('list');
    
    toast({
      title: "Curso Finalizado!",
      description: `${student.fullName} foi movido para a lista de alunos finalizados.`,
    });
  };

  const handleAddStudent = (newStudent: Student) => {
    const courseId = coursesApi?.find((c: any) => c.name === newStudent.course)?.id;
    if (!courseId) {
      toast({ title: 'Curso não encontrado', description: 'Cadastre os cursos no sistema antes de adicionar alunos.', variant: 'destructive' });
      return;
    }
    createStudentMutation.mutate({
      student: {
        fullName: newStudent.fullName,
        phone: newStudent.phone,
        birthDate: newStudent.birthDate,
        courseStartDate: newStudent.courseStartDate,
        courseEndDate: newStudent.courseEndDate,
        schedule: newStudent.schedule ? JSON.stringify(newStudent.schedule) : undefined,
        email: newStudent.email,
        cpf: newStudent.cpf,
        guardian: newStudent.guardian,
        fatherName: newStudent.fatherName,
        motherName: newStudent.motherName,
        cep: newStudent.cep,
        street: newStudent.street,
        number: newStudent.number,
        neighborhood: newStudent.neighborhood,
        city: newStudent.city,
        state: newStudent.state,
      },
      courseId,
    }, {
      onSuccess: () => {
        setCurrentView('list');
      },
      onError: () => {
        setStudents(prev => [...prev, newStudent]);
        setCurrentView('list');
      }
    });
  };

  const handleShowAttendance = () => {
    setCurrentView('attendance');
  };

  const handleShowTimeSlots = () => {
    setCurrentView('timeSlots');
  };

  const handleShowScheduleView = () => {
    setCurrentView('scheduleView');
  };

  const handleShowReports = () => {
    setCurrentView('reports');
  };

  const handleShowAddStudent = () => {
    setCurrentView('add');
  };

  const handleShowCompleted = () => {
    setCurrentView('completed');
  };

  const handleShowVacancies = () => {
    setCurrentView('vacancies');
  };

  const handleBack = () => {
    setCurrentView('list');
    setSelectedStudent(null);
  };

  const handleBackToDetails = () => {
    setCurrentView('details');
  };

  const isNavActive = (view: View) => {
    if (view === 'list') return currentView === 'list' || currentView === 'details' || currentView === 'edit' || currentView === 'frequency' || currentView === 'add';
    if (view === 'attendance') return currentView === 'attendance' || currentView === 'timeSlots' || currentView === 'scheduleView';
    if (view === 'reports') return currentView === 'reports';
    if (view === 'completed') return currentView === 'completed';
    if (view === 'vacancies') return currentView === 'vacancies';
    return false;
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-3">
              <div className="h-10 w-10 rounded-lg bg-blue-600 flex items-center justify-center">
                <GraduationCap className="h-6 w-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900">EduControl</h1>
                <p className="text-sm text-gray-600">Sistema de Chamada Escolar</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-2">
              <nav className="hidden md:flex items-center space-x-6">
                <button
                  onClick={() => setCurrentView('list')}
                  className={`flex items-center space-x-2 text-sm px-3 py-2 rounded-md transition-colors ${
                    isNavActive('list') 
                      ? 'bg-blue-100 text-blue-700 font-medium' 
                      : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                  }`}
                >
                  <Users className="h-4 w-4" />
                  <span>Gestão de Alunos</span>
                </button>
                <button
                  onClick={handleShowTimeSlots}
                  className={`flex items-center space-x-2 text-sm px-3 py-2 rounded-md transition-colors ${
                    isNavActive('attendance') 
                      ? 'bg-blue-100 text-blue-700 font-medium' 
                      : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                  }`}
                >
                  <Calendar className="h-4 w-4" />
                  <span>Controle de Presença</span>
                </button>
                <button
                  onClick={handleShowReports}
                  className={`flex items-center space-x-2 text-sm px-3 py-2 rounded-md transition-colors ${
                    isNavActive('reports') 
                      ? 'bg-blue-100 text-blue-700 font-medium' 
                      : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                  }`}
                >
                  <BarChart3 className="h-4 w-4" />
                  <span>Relatórios</span>
                </button>
                <button
                  onClick={handleShowCompleted}
                  className={`flex items-center space-x-2 text-sm px-3 py-2 rounded-md transition-colors ${
                    isNavActive('completed') 
                      ? 'bg-green-100 text-green-700 font-medium' 
                      : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                  }`}
                >
                  <Award className="h-4 w-4" />
                  <span>Alunos Finalizados</span>
                </button>
                <button
                  onClick={handleShowVacancies}
                  className={`flex items-center space-x-2 text-sm px-3 py-2 rounded-md transition-colors ${
                    isNavActive('vacancies') 
                      ? 'bg-purple-100 text-purple-700 font-medium' 
                      : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                  }`}
                >
                  <Users className="h-4 w-4" />
                  <span>Gerenciar Vagas</span>
                </button>
                <button
                  onClick={handleShowAddStudent}
                  className="flex items-center space-x-2 text-sm px-3 py-2 rounded-md bg-green-600 text-white hover:bg-green-700 transition-colors"
                >
                  <UserPlus className="h-4 w-4" />
                  <span>Adicionar Aluno</span>
                </button>
              </nav>
            </div>
          </div>
          
          <div className="md:hidden border-t border-gray-200 pt-2 pb-3">
            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={() => setCurrentView('list')}
                className={`flex items-center justify-center space-x-1 text-xs px-2 py-2 rounded-md transition-colors ${
                  isNavActive('list') 
                    ? 'bg-blue-100 text-blue-700 font-medium' 
                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                }`}
              >
                <Users className="h-4 w-4" />
                <span>Gestão</span>
              </button>
              <button
                onClick={handleShowTimeSlots}
                className={`flex items-center justify-center space-x-1 text-xs px-2 py-2 rounded-md transition-colors ${
                  isNavActive('attendance') 
                    ? 'bg-blue-100 text-blue-700 font-medium' 
                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                }`}
              >
                <Calendar className="h-4 w-4" />
                <span>Presença</span>
              </button>
              <button
                onClick={handleShowReports}
                className={`flex items-center justify-center space-x-1 text-xs px-2 py-2 rounded-md transition-colors ${
                  isNavActive('reports') 
                    ? 'bg-blue-100 text-blue-700 font-medium' 
                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                }`}
              >
                <BarChart3 className="h-4 w-4" />
                <span>Relatórios</span>
              </button>
              <button
                onClick={handleShowVacancies}
                className={`flex items-center justify-center space-x-1 text-xs px-2 py-2 rounded-md transition-colors ${
                  isNavActive('vacancies') 
                    ? 'bg-purple-100 text-purple-700 font-medium' 
                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                }`}
              >
                <Users className="h-4 w-4" />
                <span>Vagas</span>
              </button>
              <button
                onClick={handleShowAddStudent}
                className="flex items-center justify-center space-x-1 text-xs px-2 py-2 rounded-md bg-green-600 text-white hover:bg-green-700 transition-colors"
              >
                <UserPlus className="h-4 w-4" />
                <span>Adicionar</span>
              </button>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 md:py-8">
        {currentView === 'list' && (
          <StudentList 
            students={activeStudents}
            onSelectStudent={handleSelectStudent}
            onShowAttendance={handleShowAttendance}
            onShowDetails={handleShowDetails}
            onShowTimeSlots={handleShowTimeSlots}
          />
        )}
        
        {currentView === 'add' && (
          <AddStudent 
            onBack={handleBack}
            onSave={handleAddStudent}
          />
        )}
        
        {currentView === 'attendance' && (
          <AttendanceSheet 
            onBack={handleBack}
            onShowScheduleView={handleShowScheduleView}
          />
        )}
        
        {currentView === 'timeSlots' && (
          <TimeSlotView 
            students={activeStudents}
            onBack={handleBack}
            onShowScheduleView={handleShowScheduleView}
          />
        )}

        {currentView === 'scheduleView' && (
          <ScheduleView 
            students={students}
            onBack={handleBack}
          />
        )}
        
        {currentView === 'reports' && (
          <Reports 
            students={activeStudents}
            onBack={handleBack} 
          />
        )}

        {currentView === 'completed' && (
          <CompletedStudents
            students={students}
            onBack={handleBack}
            onShowDetails={handleShowDetails}
          />
        )}

        {currentView === 'vacancies' && (
          <ManageVacancies
            onBack={handleBack}
          />
        )}
        
        {currentView === 'frequency' && selectedStudent && (
          <StudentFrequency 
            student={selectedStudent} 
            onBack={handleBack} 
          />
        )}
        
        {currentView === 'details' && selectedStudent && (
          <StudentDetails
            student={selectedStudent}
            onBack={handleBack}
            onEdit={handleEditStudent}
            onCompleteStudent={handleCompleteStudent}
          />
        )}
        
        {currentView === 'edit' && selectedStudent && (
          <EditStudent
            student={selectedStudent}
            onBack={handleBackToDetails}
            onSave={handleSaveStudent}
          />
        )}
      </main>

      <footer className="bg-white border-t border-gray-200 mt-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="text-center text-sm text-gray-600">
            <p>© 2024 EduControl - Sistema de Gestão Escolar</p>
            <p className="mt-1">Controle de frequência e presença para instituições de ensino</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
