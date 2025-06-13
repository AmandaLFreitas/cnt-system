
import { useState } from 'react';
import { Student } from '../types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { ArrowLeft, Save, User } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import CustomScheduleEditor from './CustomScheduleEditor';

interface EditStudentProps {
  student: Student;
  onBack: () => void;
  onSave: (student: Student) => void;
}

const EditStudent = ({ student, onBack, onSave }: EditStudentProps) => {
  const [formData, setFormData] = useState<Student>(student);
  const { toast } = useToast();

  const handleInputChange = (field: keyof Student, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleScheduleChange = (schedule: any) => {
    setFormData(prev => ({
      ...prev,
      schedule
    }));
  };

  const handleSave = () => {
    onSave(formData);
    toast({
      title: "Dados Atualizados!",
      description: "As informações do aluno foram salvas com sucesso.",
    });
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

  const isMinor = calculateAge(formData.birthDate) < 18;

  return (
    <div className="space-y-6">
      <div className="flex items-center space-x-4">
        <Button variant="outline" onClick={onBack} className="px-3">
          <ArrowLeft className="h-4 w-4 mr-2" />
          Voltar
        </Button>
        <div>
          <h2 className="text-3xl font-bold text-gray-900">Editar Aluno</h2>
          <p className="text-gray-600 mt-1">Altere as informações do estudante</p>
        </div>
      </div>

      <Card className="border-blue-200 bg-blue-50">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <User className="h-5 w-5" />
            <span>Informações Pessoais</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="fullName">Nome Completo</Label>
              <Input
                id="fullName"
                value={formData.fullName}
                onChange={(e) => handleInputChange('fullName', e.target.value)}
                placeholder="Nome completo do aluno"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="phone">Telefone</Label>
              <Input
                id="phone"
                value={formData.phone}
                onChange={(e) => handleInputChange('phone', e.target.value)}
                placeholder="(11) 99999-9999"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="birthDate">Data de Nascimento</Label>
              <Input
                id="birthDate"
                type="date"
                value={formData.birthDate}
                onChange={(e) => handleInputChange('birthDate', e.target.value)}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="email">Email (Opcional)</Label>
              <Input
                id="email"
                type="email"
                value={formData.email || ''}
                onChange={(e) => handleInputChange('email', e.target.value)}
                placeholder="email@exemplo.com"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="cpf">CPF</Label>
              <Input
                id="cpf"
                value={formData.cpf || ''}
                onChange={(e) => handleInputChange('cpf', e.target.value)}
                placeholder="000.000.000-00"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="address">Endereço</Label>
              <Input
                id="address"
                value={formData.address || ''}
                onChange={(e) => handleInputChange('address', e.target.value)}
                placeholder="Endereço completo"
              />
            </div>
            
            {isMinor && (
              <>
                <div className="space-y-2">
                  <Label htmlFor="guardian">Responsável</Label>
                  <Input
                    id="guardian"
                    value={formData.guardian || ''}
                    onChange={(e) => handleInputChange('guardian', e.target.value)}
                    placeholder="Nome do responsável legal"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="fatherName">Nome do Pai</Label>
                  <Input
                    id="fatherName"
                    value={formData.fatherName || ''}
                    onChange={(e) => handleInputChange('fatherName', e.target.value)}
                    placeholder="Nome do pai"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="motherName">Nome da Mãe</Label>
                  <Input
                    id="motherName"
                    value={formData.motherName || ''}
                    onChange={(e) => handleInputChange('motherName', e.target.value)}
                    placeholder="Nome da mãe"
                  />
                </div>
              </>
            )}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Informações do Curso</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="course">Curso</Label>
              <Input
                id="course"
                value={formData.course}
                onChange={(e) => handleInputChange('course', e.target.value)}
                placeholder="Nome do curso"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="courseStartDate">Data de Início do Curso</Label>
              <Input
                id="courseStartDate"
                type="date"
                value={formData.courseStartDate}
                onChange={(e) => handleInputChange('courseStartDate', e.target.value)}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      <CustomScheduleEditor
        schedule={formData.schedule}
        onChange={handleScheduleChange}
      />

      <div className="flex justify-end">
        <Button 
          onClick={handleSave}
          className="bg-green-600 hover:bg-green-700 text-white px-6 py-2"
        >
          <Save className="mr-2 h-4 w-4" />
          Salvar Alterações
        </Button>
      </div>
    </div>
  );
};

export default EditStudent;
