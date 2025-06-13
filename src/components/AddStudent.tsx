
import { useState } from 'react';
import { Student, StudentSchedule } from '../types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { ArrowLeft, Save, UserPlus } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import ScheduleSelector from './ScheduleSelector';
import CourseSelector from './CourseSelector';

interface AddStudentProps {
  onBack: () => void;
  onSave: (student: Student) => void;
}

const AddStudent = ({ onBack, onSave }: AddStudentProps) => {
  const { toast } = useToast();
  
  const [formData, setFormData] = useState({
    fullName: '',
    cpf: '',
    guardian: '',
    fatherName: '',
    motherName: '',
    phone: '',
    birthDate: '',
    course: '',
    courseStartDate: '',
    courseEndDate: '',
    email: '',
    address: '',
    schedule: {} as StudentSchedule
  });

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleScheduleChange = (schedule: StudentSchedule) => {
    setFormData(prev => ({
      ...prev,
      schedule
    }));
  };

  const generateId = () => {
    return Date.now().toString();
  };

  const calculateAge = (birthDate: string) => {
    if (!birthDate) return 18;
    const today = new Date();
    const birth = new Date(birthDate);
    let age = today.getFullYear() - birth.getFullYear();
    const monthDiff = today.getMonth() - birth.getMonth();
    
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
      age--;
    }
    
    return age;
  };

  const handleSave = () => {
    // Validação básica
    if (!formData.fullName || !formData.phone || !formData.birthDate || !formData.course || !formData.courseStartDate) {
      toast({
        title: "Campos obrigatórios",
        description: "Por favor, preencha todos os campos obrigatórios: nome, telefone, data de nascimento, curso e data de início.",
        variant: "destructive"
      });
      return;
    }

    if (Object.keys(formData.schedule).length === 0) {
      toast({
        title: "Horário obrigatório",
        description: "Por favor, selecione pelo menos um horário de aula.",
        variant: "destructive"
      });
      return;
    }

    const newStudent: Student = {
      id: generateId(),
      fullName: formData.fullName,
      phone: formData.phone,
      birthDate: formData.birthDate,
      course: formData.course,
      courseStartDate: formData.courseStartDate,
      schedule: formData.schedule,
      ...(formData.cpf && { cpf: formData.cpf }),
      ...(formData.email && { email: formData.email }),
      ...(formData.address && { address: formData.address }),
      ...(formData.guardian && { guardian: formData.guardian }),
      ...(formData.fatherName && { fatherName: formData.fatherName }),
      ...(formData.motherName && { motherName: formData.motherName })
    };

    onSave(newStudent);
    toast({
      title: "Aluno Cadastrado!",
      description: "O novo aluno foi adicionado com sucesso.",
    });
  };

  const isMinor = calculateAge(formData.birthDate) < 18;

  return (
    <div className="space-y-4 md:space-y-6 p-4 max-w-6xl mx-auto">
      <div className="flex flex-col space-y-4 md:flex-row md:items-center md:space-y-0 md:space-x-4">
        <Button variant="outline" onClick={onBack} className="px-3 w-fit">
          <ArrowLeft className="h-4 w-4 mr-2" />
          Voltar
        </Button>
        <div>
          <h2 className="text-2xl md:text-3xl font-bold text-gray-900">Adicionar Novo Aluno</h2>
          <p className="text-gray-600 mt-1">Cadastre um novo estudante no sistema</p>
        </div>
      </div>

      <Card className="border-blue-200 bg-blue-50">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2 text-gray-900">
            <UserPlus className="h-5 w-5" />
            <span>Informações Pessoais</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 grid-cols-1 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="fullName" className="text-gray-700">Nome Completo *</Label>
              <Input
                id="fullName"
                value={formData.fullName}
                onChange={(e) => handleInputChange('fullName', e.target.value)}
                placeholder="Nome completo do aluno"
                className="bg-white border-gray-300 text-gray-900 placeholder-gray-500"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="cpf" className="text-gray-700">CPF</Label>
              <Input
                id="cpf"
                value={formData.cpf}
                onChange={(e) => handleInputChange('cpf', e.target.value)}
                placeholder="000.000.000-00"
                className="bg-white border-gray-300 text-gray-900 placeholder-gray-500"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="birthDate" className="text-gray-700">Data de Nascimento *</Label>
              <Input
                id="birthDate"
                type="date"
                value={formData.birthDate}
                onChange={(e) => handleInputChange('birthDate', e.target.value)}
                className="bg-white border-gray-300 text-gray-900"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="phone" className="text-gray-700">Telefone *</Label>
              <Input
                id="phone"
                value={formData.phone}
                onChange={(e) => handleInputChange('phone', e.target.value)}
                placeholder="(11) 99999-9999"
                className="bg-white border-gray-300 text-gray-900 placeholder-gray-500"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="email" className="text-gray-700">Email</Label>
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) => handleInputChange('email', e.target.value)}
                placeholder="email@exemplo.com"
                className="bg-white border-gray-300 text-gray-900 placeholder-gray-500"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="address" className="text-gray-700">Endereço</Label>
              <Input
                id="address"
                value={formData.address}
                onChange={(e) => handleInputChange('address', e.target.value)}
                placeholder="Endereço completo"
                className="bg-white border-gray-300 text-gray-900 placeholder-gray-500"
              />
            </div>
            
            {isMinor && (
              <>
                <div className="space-y-2">
                  <Label htmlFor="guardian" className="text-gray-700">Responsável</Label>
                  <Input
                    id="guardian"
                    value={formData.guardian}
                    onChange={(e) => handleInputChange('guardian', e.target.value)}
                    placeholder="Nome do responsável legal"
                    className="bg-white border-gray-300 text-gray-900 placeholder-gray-500"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="fatherName" className="text-gray-700">Nome do Pai</Label>
                  <Input
                    id="fatherName"
                    value={formData.fatherName}
                    onChange={(e) => handleInputChange('fatherName', e.target.value)}
                    placeholder="Nome completo do pai"
                    className="bg-white border-gray-300 text-gray-900 placeholder-gray-500"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="motherName" className="text-gray-700">Nome da Mãe</Label>
                  <Input
                    id="motherName"
                    value={formData.motherName}
                    onChange={(e) => handleInputChange('motherName', e.target.value)}
                    placeholder="Nome completo da mãe"
                    className="bg-white border-gray-300 text-gray-900 placeholder-gray-500"
                  />
                </div>
              </>
            )}
          </div>
        </CardContent>
      </Card>

      <CourseSelector
        selectedCourse={formData.course}
        courseStartDate={formData.courseStartDate}
        onCourseChange={(course) => handleInputChange('course', course)}
        onStartDateChange={(date) => handleInputChange('courseStartDate', date)}
        onEndDateChange={(date) => handleInputChange('courseEndDate', date)}
        schedule={formData.schedule}
      />

      <ScheduleSelector
        schedule={formData.schedule}
        onChange={handleScheduleChange}
      />

      <div className="flex justify-end">
        <Button 
          onClick={handleSave}
          className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 w-full md:w-auto"
        >
          <Save className="mr-2 h-4 w-4" />
          Cadastrar Aluno
        </Button>
      </div>
    </div>
  );
};

export default AddStudent;
