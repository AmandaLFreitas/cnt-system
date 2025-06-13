
import { useState, useEffect } from 'react';
import { Course, StudentSchedule, WeekDay, AVAILABLE_TIMES } from '../types';
import { mockCourses } from '../data/mockData';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { BookOpen, Calendar, Clock, Plus } from 'lucide-react';

interface CourseSelectorProps {
  selectedCourse: string;
  courseStartDate: string;
  onCourseChange: (course: string) => void;
  onStartDateChange: (date: string) => void;
  onEndDateChange: (date: string) => void;
  schedule: StudentSchedule;
}

const CourseSelector = ({ 
  selectedCourse, 
  courseStartDate, 
  onCourseChange, 
  onStartDateChange, 
  onEndDateChange,
  schedule 
}: CourseSelectorProps) => {
  const [courses] = useState<Course[]>(mockCourses);
  const [calculatedEndDate, setCalculatedEndDate] = useState('');
  const [weeklyHours, setWeeklyHours] = useState(0);
  const [isManualCourse, setIsManualCourse] = useState(false);
  const [manualCourseData, setManualCourseData] = useState({
    name: '',
    totalHours: ''
  });

  // Calcular horas semanais baseado no cronograma
  useEffect(() => {
    let totalHours = 0;
    Object.entries(schedule).forEach(([day, timeIds]) => {
      if (timeIds && timeIds.length > 0) {
        timeIds.forEach(timeId => {
          const timeSlot = AVAILABLE_TIMES[day as WeekDay]?.find(slot => slot.id === timeId);
          if (timeSlot) {
            totalHours += timeSlot.hours;
          }
        });
      }
    });
    setWeeklyHours(totalHours);
  }, [schedule]);

  // Calcular data de conclusão
  useEffect(() => {
    if (courseStartDate && weeklyHours > 0) {
      let courseHours = 0;
      
      if (isManualCourse) {
        courseHours = parseInt(manualCourseData.totalHours) || 0;
      } else if (selectedCourse) {
        const course = courses.find(c => c.name === selectedCourse);
        courseHours = course?.totalHours || 0;
      }
      
      if (courseHours > 0) {
        const endDate = calculateCourseEndDate(courseStartDate, courseHours, weeklyHours);
        setCalculatedEndDate(endDate);
        onEndDateChange(endDate);
      }
    }
  }, [selectedCourse, courseStartDate, weeklyHours, courses, onEndDateChange, isManualCourse, manualCourseData.totalHours]);

  const calculateCourseEndDate = (startDate: string, totalHours: number, hoursPerWeek: number): string => {
    if (!startDate || totalHours <= 0 || hoursPerWeek <= 0) return '';

    const start = new Date(startDate);
    const weeksNeeded = Math.ceil(totalHours / hoursPerWeek);
    
    // Adicionar semanas considerando que sábado à tarde, domingo e feriados não têm aula
    let currentDate = new Date(start);
    let weeksAdded = 0;
    
    while (weeksAdded < weeksNeeded) {
      currentDate.setDate(currentDate.getDate() + 7);
      weeksAdded++;
      
      // Pular semanas com feriados (simplificado - pular dezembro por exemplo)
      if (currentDate.getMonth() === 11) { // Dezembro
        currentDate.setDate(currentDate.getDate() + 7);
      }
    }
    
    return currentDate.toISOString().split('T')[0];
  };

  const handleManualCourseChange = (field: string, value: string) => {
    setManualCourseData(prev => ({
      ...prev,
      [field]: value
    }));
    
    if (field === 'name') {
      onCourseChange(value);
    }
  };

  const handleCourseTypeChange = (manual: boolean) => {
    setIsManualCourse(manual);
    if (manual) {
      onCourseChange(manualCourseData.name);
    } else {
      onCourseChange('');
      setManualCourseData({ name: '', totalHours: '' });
    }
  };

  const selectedCourseData = isManualCourse 
    ? { name: manualCourseData.name, totalHours: parseInt(manualCourseData.totalHours) || 0 }
    : courses.find(c => c.name === selectedCourse);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <BookOpen className="h-5 w-5" />
          <span>Informações do Curso</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Toggle para tipo de curso */}
        <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
          <Label htmlFor="course-type" className="text-sm font-medium">
            Curso pré-cadastrado
          </Label>
          <Switch
            id="course-type"
            checked={isManualCourse}
            onCheckedChange={handleCourseTypeChange}
          />
          <Label htmlFor="course-type" className="text-sm font-medium">
            Curso personalizado
          </Label>
          <Plus className="h-4 w-4 text-gray-500" />
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          {/* Seleção ou entrada do curso */}
          {isManualCourse ? (
            <>
              <div className="space-y-2">
                <Label htmlFor="manual-course-name">Nome do Curso *</Label>
                <Input
                  id="manual-course-name"
                  value={manualCourseData.name}
                  onChange={(e) => handleManualCourseChange('name', e.target.value)}
                  placeholder="Digite o nome do curso"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="manual-course-hours">Carga Horária Total *</Label>
                <Input
                  id="manual-course-hours"
                  type="number"
                  value={manualCourseData.totalHours}
                  onChange={(e) => handleManualCourseChange('totalHours', e.target.value)}
                  placeholder="Ex: 80"
                  min="1"
                />
              </div>
            </>
          ) : (
            <div className="space-y-2">
              <Label htmlFor="course">Curso *</Label>
              <Select value={selectedCourse} onValueChange={onCourseChange}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecione um curso" />
                </SelectTrigger>
                <SelectContent>
                  {courses.map((course) => (
                    <SelectItem key={course.id} value={course.name}>
                      {course.name} ({course.totalHours}h)
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}

          <div className="space-y-2">
            <Label htmlFor="courseStartDate">Data de Início do Curso *</Label>
            <Input
              id="courseStartDate"
              type="date"
              value={courseStartDate}
              onChange={(e) => onStartDateChange(e.target.value)}
            />
          </div>

          {selectedCourseData && selectedCourseData.totalHours > 0 && (
            <>
              <div className="space-y-2">
                <Label>Carga Horária Total</Label>
                <div className="flex items-center space-x-2 p-2 bg-gray-50 rounded-md">
                  <Clock className="h-4 w-4 text-blue-600" />
                  <span className="font-semibold">{selectedCourseData.totalHours}h</span>
                </div>
              </div>

              <div className="space-y-2">
                <Label>Horas Semanais do Aluno</Label>
                <div className="flex items-center space-x-2 p-2 bg-blue-50 rounded-md border border-blue-200">
                  <Clock className="h-4 w-4 text-blue-600" />
                  <span className="font-semibold text-blue-900">{weeklyHours}h/semana</span>
                </div>
              </div>

              {calculatedEndDate && weeklyHours > 0 && (
                <div className="space-y-2 md:col-span-2">
                  <Label>Data Prevista de Conclusão</Label>
                  <div className="flex items-center space-x-2 p-3 bg-green-50 rounded-md border border-green-200">
                    <Calendar className="h-5 w-5 text-green-600" />
                    <div>
                      <span className="font-semibold text-green-900">
                        {new Date(calculatedEndDate).toLocaleDateString('pt-BR')}
                      </span>
                      <p className="text-sm text-green-700 mt-1">
                        Baseado em {Math.ceil(selectedCourseData.totalHours / weeklyHours)} semanas de curso
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </>
          )}
        </div>

        {weeklyHours === 0 && (
          <div className="p-3 bg-amber-50 rounded-md border border-amber-200">
            <p className="text-sm text-amber-800">
              ⚠️ Defina os horários de aula do aluno para calcular a data de conclusão do curso.
            </p>
          </div>
        )}

        {(isManualCourse && (!manualCourseData.name || !manualCourseData.totalHours)) && (
          <div className="p-3 bg-amber-50 rounded-md border border-amber-200">
            <p className="text-sm text-amber-800">
              ⚠️ Preencha o nome e a carga horária do curso para calcular a data de conclusão.
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default CourseSelector;
