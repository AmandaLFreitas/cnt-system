
import { useState } from 'react';
import { Student } from '../types';
import { mockStudents } from '../data/mockData';
import StudentList from '../components/StudentList';
import AttendanceSheet from '../components/AttendanceSheet';
import StudentFrequency from '../components/StudentFrequency';
import StudentDetails from '../components/StudentDetails';
import EditStudent from '../components/EditStudent';
import { GraduationCap, Users, Calendar, BarChart3 } from 'lucide-react';

type View = 'list' | 'attendance' | 'frequency' | 'details' | 'edit';

const Index = () => {
  const [currentView, setCurrentView] = useState<View>('list');
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);
  const [students, setStudents] = useState<Student[]>(mockStudents);

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
    setStudents(prev => prev.map(s => s.id === updatedStudent.id ? updatedStudent : s));
    setCurrentView('details');
  };

  const handleShowAttendance = () => {
    setCurrentView('attendance');
  };

  const handleBack = () => {
    setCurrentView('list');
    setSelectedStudent(null);
  };

  const handleBackToDetails = () => {
    setCurrentView('details');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
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
            
            <nav className="flex items-center space-x-6">
              <div className="flex items-center space-x-2 text-sm text-gray-600">
                <Users className="h-4 w-4" />
                <span>Gestão de Alunos</span>
              </div>
              <div className="flex items-center space-x-2 text-sm text-gray-600">
                <Calendar className="h-4 w-4" />
                <span>Controle de Presença</span>
              </div>
              <div className="flex items-center space-x-2 text-sm text-gray-600">
                <BarChart3 className="h-4 w-4" />
                <span>Relatórios</span>
              </div>
            </nav>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {currentView === 'list' && (
          <StudentList 
            onSelectStudent={handleSelectStudent}
            onShowAttendance={handleShowAttendance}
            onShowDetails={handleShowDetails}
          />
        )}
        
        {currentView === 'attendance' && (
          <AttendanceSheet onBack={handleBack} />
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

      {/* Footer */}
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
