import { useState } from 'react';
import { ChevronLeft, Play } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Link, useNavigate } from 'react-router-dom';
import {
  useStudentWorkouts,
  useStartWorkout,
  useLogSet,
  useFinishWorkout,
} from '@/hooks/useStudentData';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';
import { useToast } from '@/hooks/use-toast';
import WorkoutPlayer from '@/components/workout/WorkoutPlayer';

interface Exercise {
  id: string;
  name: string;
  sets: number;
  reps: string;
  order_index: number;
  rest_time: number | null;
  notes?: string;
  video_url?: string;
}

interface WorkoutWithExercises {
  id: string;
  title: string;
  description: string | null;
  workout_type: string | null;
  exercises: Exercise[];
}

export default function StudentWorkout() {
  const navigate = useNavigate();
  const { toast } = useToast();

  const { data: workouts, isLoading: workoutsLoading } = useStudentWorkouts();
  const startWorkoutMutation = useStartWorkout();
  const logSetMutation = useLogSet();
  const finishWorkoutMutation = useFinishWorkout();

  const [activeWorkout, setActiveWorkout] = useState<WorkoutWithExercises | null>(null);
  const [workoutLogId, setWorkoutLogId] = useState<string | null>(null);
  const [startTime, setStartTime] = useState<number | null>(null);

  const handleStartWorkout = async (workout: WorkoutWithExercises) => {
    try {
      const log = await startWorkoutMutation.mutateAsync({ workoutId: workout.id });
      setWorkoutLogId(log.id);
      setActiveWorkout(workout);
      setStartTime(Date.now());
      toast({
        title: 'Treino iniciado!',
        description: 'Bom treino!',
      });
    } catch (error) {
      toast({
        variant: 'destructive',
        title: 'Erro ao iniciar',
        description: 'Tente novamente.',
      });
    }
  };

  const handleLogSet = async (params: {
    workoutLogId: string;
    exerciseId: string;
    setNumber: number;
    reps: number;
    weight: number;
  }) => {
    await logSetMutation.mutateAsync(params);
  };

  const handleFinishWorkout = async () => {
    if (!workoutLogId || !startTime) return;

    const durationMinutes = Math.round((Date.now() - startTime) / 60000);

    try {
      await finishWorkoutMutation.mutateAsync({
        logId: workoutLogId,
        durationMinutes,
        notes: 'Treino concluído via app',
      });

      toast({
        title: 'Treino finalizado!',
        description: 'Parabéns por completar mais um treino.',
      });
      navigate('/student');
    } catch (error) {
      toast({
        variant: 'destructive',
        title: 'Erro ao finalizar',
        description: 'Tente novamente.',
      });
    }
  };

  const handleCancelWorkout = () => {
    setActiveWorkout(null);
    setWorkoutLogId(null);
    setStartTime(null);
  };

  if (workoutsLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <LoadingSpinner size="lg" text="Carregando treinos..." />
      </div>
    );
  }

  // Active Workout - Show Player
  if (activeWorkout && workoutLogId) {
    return (
      <WorkoutPlayer
        workout={activeWorkout}
        workoutLogId={workoutLogId}
        onLogSet={handleLogSet}
        onFinish={handleFinishWorkout}
        onCancel={handleCancelWorkout}
        isLogging={logSetMutation.isPending}
      />
    );
  }

  // Selection Screen
  return (
    <div className="min-h-screen p-6 pb-24 lg:p-8">
      <div className="mb-8">
        <Link
          to="/student"
          className="mb-4 inline-flex items-center text-muted-foreground hover:text-foreground"
        >
          <ChevronLeft className="mr-1 h-4 w-4" />
          Voltar
        </Link>
        <h1 className="font-display text-2xl font-bold text-foreground lg:text-3xl">
          Seus Treinos
        </h1>
        <p className="mt-1 text-muted-foreground">Selecione um treino para iniciar</p>
      </div>

      <div className="space-y-4">
        {workouts?.map((workout) => (
          <Card
            key={workout.id}
            variant="interactive"
            onClick={() => handleStartWorkout(workout as WorkoutWithExercises)}
            className="cursor-pointer"
          >
            <CardHeader>
              <CardTitle>{workout.title}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="mb-4 text-sm text-muted-foreground">
                {workout.description || 'Sem descrição'}
              </p>
              <div className="flex items-center gap-4 text-sm text-muted-foreground">
                <span>{workout.exercises?.length || 0} exercícios</span>
                <span>•</span>
                <span>{workout.workout_type || 'Geral'}</span>
              </div>
              <Button className="mt-4 w-full">
                <Play className="mr-2 h-4 w-4" />
                Iniciar Treino
              </Button>
            </CardContent>
          </Card>
        ))}

        {(!workouts || workouts.length === 0) && (
          <div className="py-12 text-center text-muted-foreground">
            Nenhum treino atribuído pelo seu personal ainda.
          </div>
        )}
      </div>
    </div>
  );
}
