import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  ChevronLeft,
  Mail,
  Phone,
  Calendar,
  Target,
  Dumbbell,
  Plus,
  MoreVertical,
  Trash2,
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import {
  useTrainerStudent,
  useTrainerWorkouts,
  useTrainerTemplates,
  useAssignWorkout,
} from '@/hooks/useTrainerData';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';
import { useState } from 'react';

export default function TrainerStudentDetails() {
  const { id } = useParams<{ id: string }>();
  const { toast } = useToast();
  const { data: student, isLoading: studentLoading } = useTrainerStudent(id!);
  const { data: workouts, isLoading: workoutsLoading } = useTrainerWorkouts(); // Fetches all workouts, we need to filter
  const { data: templates } = useTrainerTemplates();
  const assignWorkout = useAssignWorkout();

  const [selectedTemplate, setSelectedTemplate] = useState<string>('');
  const [isAssignDialogOpen, setIsAssignDialogOpen] = useState(false);

  const studentWorkouts = workouts?.filter((w) => w.student_id === id) || [];

  const handleAssign = async () => {
    if (!selectedTemplate || !id) return;

    try {
      await assignWorkout.mutateAsync({
        studentId: id,
        templateId: selectedTemplate,
      });

      toast({
        title: 'Treino atribuído!',
        description: 'O aluno já pode visualizar o novo treino.',
      });
      setIsAssignDialogOpen(false);
      setSelectedTemplate('');
    } catch (error) {
      toast({
        variant: 'destructive',
        title: 'Erro ao atribuir',
        description: 'Tente novamente mais tarde.',
      });
    }
  };

  if (studentLoading || workoutsLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <LoadingSpinner size="lg" text="Carregando detalhes..." />
      </div>
    );
  }

  if (!student) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center p-6 text-center">
        <h1 className="mb-2 text-2xl font-bold">Aluno não encontrado</h1>
        <Link to="/trainer/students">
          <Button>Voltar para Lista</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-6 lg:p-8">
      {/* Header */}
      <div className="mb-8">
        <Link
          to="/trainer/students"
          className="mb-4 inline-flex items-center text-muted-foreground hover:text-foreground"
        >
          <ChevronLeft className="mr-1 h-4 w-4" />
          Voltar para Alunos
        </Link>
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <h1 className="font-display text-2xl font-bold text-foreground lg:text-3xl">
            {student.name}
          </h1>
          <Dialog open={isAssignDialogOpen} onOpenChange={setIsAssignDialogOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="mr-2 h-4 w-4" />
                Atribuir Treino
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Atribuir Modelo de Treino</DialogTitle>
                <DialogDescription>
                  Selecione um dos seus planos para copiar para este aluno.
                </DialogDescription>
              </DialogHeader>
              <div className="py-4">
                <Select value={selectedTemplate} onValueChange={setSelectedTemplate}>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione um plano..." />
                  </SelectTrigger>
                  <SelectContent>
                    {templates?.map((template) => (
                      <SelectItem key={template.id} value={template.id}>
                        {template.title}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setIsAssignDialogOpen(false)}>
                  Cancelar
                </Button>
                <Button
                  onClick={handleAssign}
                  disabled={!selectedTemplate || assignWorkout.isPending}
                >
                  {assignWorkout.isPending ? 'Atribuindo...' : 'Confirmar'}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Info Sidebar */}
        <div className="space-y-6">
          <Card variant="elevated">
            <CardHeader>
              <CardTitle>Informações</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center gap-3">
                <div className="rounded-lg bg-primary/10 p-2">
                  <Mail className="h-4 w-4 text-primary" />
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Email</p>
                  <p className="text-sm font-medium">{student.email}</p>
                </div>
              </div>
              {student.phone && (
                <div className="flex items-center gap-3">
                  <div className="rounded-lg bg-accent/10 p-2">
                    <Phone className="h-4 w-4 text-accent" />
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Telefone</p>
                    <p className="text-sm font-medium">{student.phone}</p>
                  </div>
                </div>
              )}
              <div className="flex items-center gap-3">
                <div className="rounded-lg bg-muted p-2">
                  <Calendar className="h-4 w-4 text-foreground" />
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Desde</p>
                  <p className="text-sm font-medium">
                    {new Date(student.created_at).toLocaleDateString('pt-BR')}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card variant="elevated">
            <CardHeader>
              <CardTitle>Físico & Objetivos</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {student.goal && (
                <div className="flex items-center gap-3">
                  <div className="rounded-lg bg-energy/10 p-2">
                    <Target className="h-4 w-4 text-energy" />
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Objetivo</p>
                    <p className="text-sm font-medium">{student.goal}</p>
                  </div>
                </div>
              )}
              <div className="grid grid-cols-2 gap-4 pt-2">
                <div className="rounded-lg bg-secondary/50 p-3 text-center">
                  <p className="text-2xl font-bold">{student.height || '--'}</p>
                  <p className="text-xs text-muted-foreground">cm</p>
                </div>
                <div className="rounded-lg bg-secondary/50 p-3 text-center">
                  <p className="text-2xl font-bold">{student.weight || '--'}</p>
                  <p className="text-xs text-muted-foreground">kg</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Workouts List */}
        <div className="lg:col-span-2">
          <h2 className="mb-4 text-xl font-bold">Treinos Atribuídos</h2>
          {studentWorkouts.length > 0 ? (
            <div className="space-y-4">
              {studentWorkouts.map((workout) => (
                <motion.div
                  key={workout.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                >
                  <Card variant="interactive">
                    <CardContent className="flex items-center justify-between p-4">
                      <div className="flex items-center gap-4">
                        <div className="rounded-xl bg-secondary p-3">
                          <Dumbbell className="h-6 w-6 text-primary" />
                        </div>
                        <div>
                          <h3 className="font-semibold text-foreground">{workout.title}</h3>
                          <p className="text-sm text-muted-foreground">
                            {workout.exercises?.length || 0} exercícios • Criado em{' '}
                            {new Date(workout.created_at).toLocaleDateString('pt-BR')}
                          </p>
                        </div>
                      </div>
                      <Button variant="ghost" size="icon">
                        <MoreVertical className="h-4 w-4" />
                      </Button>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          ) : (
            <Card variant="elevated" className="border-dashed">
              <CardContent className="flex flex-col items-center justify-center p-8 text-center">
                <Dumbbell className="mb-4 h-12 w-12 text-muted-foreground opacity-50" />
                <h3 className="text-lg font-medium">Nenhum treino atribuído</h3>
                <p className="mb-4 text-muted-foreground">
                  Este aluno ainda não possui treinos ativos.
                </p>
                <Button onClick={() => setIsAssignDialogOpen(true)}>
                  Atribuir Primeiro Treino
                </Button>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
