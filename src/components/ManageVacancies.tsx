import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { ArrowLeft, Save, Users } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { TimeSlotCapacity } from '../types';
import { timeSlotsAPI } from '../api/timeSlots';

interface ManageVacanciesProps {
  onBack: () => void;
}

const ManageVacancies = ({ onBack }: ManageVacanciesProps) => {
  const { toast } = useToast();
  const [timeSlots, setTimeSlots] = useState<TimeSlotCapacity[]>([]);
  const [loading, setLoading] = useState(true);
  const [editedSlots, setEditedSlots] = useState<{ [key: string]: number }>({});
  const [initializing, setInitializing] = useState(false);

  useEffect(() => {
    loadTimeSlots();
  }, []);

  const loadTimeSlots = async () => {
    try {
      setLoading(true);
      const data = await timeSlotsAPI.getAll();
      setTimeSlots(data);
    } catch (error) {
      console.error('Erro ao carregar horários:', error);
      toast({
        title: 'Erro',
        description: 'Não foi possível carregar os horários.',
        variant: 'destructive'
      });
    } finally {
      setLoading(false);
    }
  };

  const handleVacanciesChange = (slotId: string, value: number) => {
    setEditedSlots(prev => ({
      ...prev,
      [slotId]: value
    }));
  };

  const handleSave = async () => {
    try {
      for (const [slotId, vacancies] of Object.entries(editedSlots)) {
        if (vacancies > 0) {
          await timeSlotsAPI.updateVacancies(slotId, vacancies);
        }
      }
      setEditedSlots({});
      await loadTimeSlots();
      toast({
        title: 'Sucesso',
        description: 'Vagas atualizadas com sucesso!'
      });
    } catch (error) {
      console.error('Erro ao salvar:', error);
      toast({
        title: 'Erro',
        description: 'Não foi possível salvar as vagas.',
        variant: 'destructive'
      });
    }
  };

  const handleInitialize = async () => {
    try {
      setInitializing(true);
      await timeSlotsAPI.initializeDefaults();
      await loadTimeSlots();
      toast({
        title: 'Sucesso',
        description: 'Vagas padrão (20) inicializadas para todos os horários!'
      });
    } catch (error) {
      console.error('Erro ao inicializar:', error);
      toast({
        title: 'Erro',
        description: 'Não foi possível inicializar as vagas padrão.',
        variant: 'destructive'
      });
    } finally {
      setInitializing(false);
    }
  };

  const getDayName = (day: string) => {
    const dayNames: { [key: string]: string } = {
      'monday': 'Segunda-feira',
      'tuesday': 'Terça-feira',
      'wednesday': 'Quarta-feira',
      'thursday': 'Quinta-feira',
      'friday': 'Sexta-feira',
      'saturday': 'Sábado'
    };
    return dayNames[day] || day;
  };

  const groupedByDay = timeSlots.reduce((acc, slot) => {
    if (!acc[slot.day]) {
      acc[slot.day] = [];
    }
    acc[slot.day].push(slot);
    return acc;
  }, {} as { [key: string]: TimeSlotCapacity[] });

  const dayOrder = ['monday', 'tuesday', 'wednesday', 'thursday', 'saturday'];
  const orderedDays = dayOrder.filter(d => groupedByDay[d]);

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <p className="text-gray-600">Carregando horários...</p>
      </div>
    );
  }

  return (
    <div className="space-y-4 md:space-y-6 p-4 max-w-4xl mx-auto">
      <div className="flex flex-col space-y-4 md:flex-row md:items-center md:space-y-0 md:space-x-4">
        <Button variant="outline" onClick={onBack} className="px-3 w-fit">
          <ArrowLeft className="h-4 w-4 mr-2" />
          Voltar
        </Button>
        <div>
          <h2 className="text-2xl md:text-3xl font-bold text-gray-900">Gerenciar Vagas</h2>
          <p className="text-gray-600 mt-1">Configure o total de vagas para cada horário de aula</p>
        </div>
      </div>

      {timeSlots.length === 0 ? (
        <Card className="border-yellow-200 bg-yellow-50">
          <CardContent className="pt-6 text-center">
            <p className="text-gray-700 mb-4">Nenhuma vaga inicializada. Clique abaixo para inicializar com 20 vagas padrão por horário.</p>
            <Button 
              onClick={handleInitialize}
              disabled={initializing}
              className="bg-blue-600 hover:bg-blue-700"
            >
              {initializing ? 'Inicializando...' : 'Inicializar Vagas Padrão'}
            </Button>
          </CardContent>
        </Card>
      ) : (
        <>
          {orderedDays.map((day) => {
            const slots = groupedByDay[day];
            return (
            <Card key={day} className="border-gray-200">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2 text-gray-900">
                  <Users className="h-5 w-5" />
                  <span>{getDayName(day)}</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid gap-4 grid-cols-1 md:grid-cols-2">
                  {slots.map(slot => (
                    <div key={slot.slotId} className="space-y-2 p-4 bg-gray-50 rounded-lg border border-gray-200">
                      <Label className="text-sm font-medium text-gray-700">{slot.time}</Label>
                      <div className="flex items-center space-x-2">
                        <Input
                          type="number"
                          min="1"
                          value={editedSlots[slot.slotId] ?? slot.totalVacancies}
                          onChange={(e) => handleVacanciesChange(slot.slotId, parseInt(e.target.value) || 0)}
                          className="bg-white border-gray-300"
                        />
                        <span className="text-sm text-gray-600 whitespace-nowrap">vagas</span>
                      </div>
                      <p className="text-xs text-gray-500">
                        ID: {slot.slotId}
                      </p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
            );
          })}

          <div className="flex justify-end gap-2">
            <Button 
              variant="outline"
              onClick={async () => { await handleInitialize(); setEditedSlots({}); }}
              disabled={initializing}
            >
              Resetar para 20 vagas
            </Button>
            <Button 
              onClick={handleSave}
              className="bg-green-600 hover:bg-green-700 text-white px-6"
            >
              <Save className="mr-2 h-4 w-4" />
              Salvar Vagas
            </Button>
          </div>
        </>
      )}
    </div>
  );
};

export default ManageVacancies;
