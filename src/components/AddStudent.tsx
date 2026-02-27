
import { useState } from 'react';
import { Student, StudentSchedule } from '../types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { ArrowLeft, Save, UserPlus, AlertCircle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useCepLookup } from '@/hooks/useCepLookup';
import { useCpfValidation } from '@/hooks/useCpfValidation';
import ScheduleSelector from './ScheduleSelector';
import CourseSelector from './CourseSelector';

interface AddStudentProps {
  onBack: () => void;
  onSave: (student: Student) => void;
}

const AddStudent = ({ onBack, onSave }: AddStudentProps) => {
  const { toast } = useToast();
  const { loadingCep, cepError, lookupCep } = useCepLookup();
  const { cpfError, handleCpfChange, validateCpf } = useCpfValidation();
  const [localCpfError, setLocalCpfError] = useState<string | null>(null);
  
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
    cep: '',
    street: '',
    number: '',
    neighborhood: '',
    city: '',
    state: '',
    schedule: {} as StudentSchedule
  });

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleCpfInputChange = (value: string) => {
    const masked = handleCpfChange(value);
    setFormData(prev => ({
      ...prev,
      cpf: masked
    }));
  };

  const handleCpfBlur = () => {
    const isValid = validateCpf(formData.cpf);
    setLocalCpfError(isValid ? null : 'CPF inválido');
  };

  const handleCepBlur = async () => {
    if (!formData.cep) return;
    
    const result = await lookupCep(formData.cep);
    if (result) {
      setFormData(prev => ({
        ...prev,
        street: result.street,
        neighborhood: result.neighborhood,
        city: result.city,
        state: result.state,
      }));
      toast({
        title: "CEP encontrado!",
        description: "Os dados do endereço foram preenchidos automaticamente.",
      });
    }
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

    // Validar CPF se fornecido
    if (formData.cpf && !validateCpf(formData.cpf)) {
      setLocalCpfError('CPF inválido');
      toast({
        title: "CPF inválido",
        description: "Por favor, verifique o CPF informado.",
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
      ...(formData.cep && { cep: formData.cep }),
      ...(formData.street && { street: formData.street }),
      ...(formData.number && { number: formData.number }),
      ...(formData.neighborhood && { neighborhood: formData.neighborhood }),
      ...(formData.city && { city: formData.city }),
      ...(formData.state && { state: formData.state }),
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
                onChange={(e) => handleCpfInputChange(e.target.value)}
                onBlur={handleCpfBlur}
                placeholder="000.000.000-00"
                className={`bg-white text-gray-900 placeholder-gray-500 ${
                  localCpfError ? 'border-red-500' : 'border-gray-300'
                }`}
              />
              {localCpfError && (
                <div className="flex items-center space-x-2 text-red-600 text-sm mt-1">
                  <AlertCircle className="h-4 w-4" />
                  <span>{localCpfError}</span>
                </div>
              )}
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
              <Label htmlFor="cep" className="text-gray-700">CEP</Label>
              <Input
                id="cep"
                value={formData.cep}
                onChange={(e) => handleInputChange('cep', e.target.value)}
                onBlur={handleCepBlur}
                placeholder="00000-000"
                className="bg-white border-gray-300 text-gray-900 placeholder-gray-500"
                disabled={loadingCep}
              />
              {cepError && (
                <div className="flex items-center space-x-2 text-red-600 text-sm mt-1">
                  <AlertCircle className="h-4 w-4" />
                  <span>{cepError}</span>
                </div>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="street" className="text-gray-700">Rua</Label>
              <Input
                id="street"
                value={formData.street}
                onChange={(e) => handleInputChange('street', e.target.value)}
                placeholder="Nome da rua"
                className="bg-white border-gray-300 text-gray-900 placeholder-gray-500"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="number" className="text-gray-700">Número</Label>
              <Input
                id="number"
                value={formData.number}
                onChange={(e) => handleInputChange('number', e.target.value)}
                placeholder="Número da casa"
                className="bg-white border-gray-300 text-gray-900 placeholder-gray-500"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="neighborhood" className="text-gray-700">Bairro</Label>
              <Input
                id="neighborhood"
                value={formData.neighborhood}
                onChange={(e) => handleInputChange('neighborhood', e.target.value)}
                placeholder="Bairro"
                className="bg-white border-gray-300 text-gray-900 placeholder-gray-500"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="city" className="text-gray-700">Cidade</Label>
              <Input
                id="city"
                value={formData.city}
                onChange={(e) => handleInputChange('city', e.target.value)}
                placeholder="Cidade"
                className="bg-white border-gray-300 text-gray-900 placeholder-gray-500"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="state" className="text-gray-700">Estado</Label>
              <Input
                id="state"
                value={formData.state}
                onChange={(e) => handleInputChange('state', e.target.value)}
                placeholder="Estado (UF)"
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
