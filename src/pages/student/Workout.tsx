import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, Check, Plus, Minus, ChevronDown, ChevronUp, Play } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Link, useNavigate } from 'react-router-dom';
import {
  useStudentWorkouts,
  useStartWorkout,
  useLogSet,
  useFinishWorkout,
} from '@/hooks/useStudentData';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';
import { useToast } from '@/hooks/use-toast';

interface SetLog {
  setNumber: number;
  reps: number;
  weight: number;
  completed: boolean;
}

interface Exercise {
  id: string;
  name: string;
  sets: number;
  reps: string;
  order_index: number;
  rest_time: number | null;
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
  const [currentExerciseIndex, setCurrentExerciseIndex] = useState(0);
  const [exerciseLogs, setExerciseLogs] = useState<Record<string, SetLog[]>>({});
  const [restTimer, setRestTimer] = useState<number | null>(null);
  const [isResting, setIsResting] = useState(false);
  const [startTime, setStartTime] = useState<number | null>(null);

  // Filter and sort exercises
  const sortedExercises =
    activeWorkout?.exercises?.sort((a, b) => a.order_index - b.order_index) || [];
  const currentExercise = sortedExercises[currentExerciseIndex];

  // Initialize logs for current exercise when it changes
  useEffect(() => {
    if (currentExercise && !exerciseLogs[currentExercise.id]) {
      const initialSets: SetLog[] = Array.from({ length: currentExercise.sets }, (_, i) => ({
        setNumber: i + 1,
        reps: Number(currentExercise.reps) || 10, // Handle string range or number
        weight: 0,
        completed: false,
      }));
      setExerciseLogs((prev) => ({
        ...prev,
        [currentExercise.id]: initialSets,
      }));
    }
  }, [currentExercise, exerciseLogs]);

  // Rest timer logic
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isResting && restTimer !== null && restTimer > 0) {
      interval = setInterval(() => {
        setRestTimer((prev) => (prev !== null && prev > 0 ? prev - 1 : 0));
      }, 1000);
    } else if (restTimer === 0) {
      setIsResting(false);
      setRestTimer(null);
    }
    return () => clearInterval(interval);
  }, [isResting, restTimer]);

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

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const currentSets = useMemo(
    () => (currentExercise ? exerciseLogs[currentExercise.id] || [] : []),
    [currentExercise, exerciseLogs],
  );
  const currentSetIndex = currentSets.findIndex((s) => !s.completed);
  const currentSet = currentSets[currentSetIndex] || currentSets[currentSets.length - 1];

  const updateSetValue = useCallback(
    (field: 'reps' | 'weight', delta: number) => {
      if (currentSetIndex === -1 || !currentExercise) return;

      setExerciseLogs((prev) => ({
        ...prev,
        [currentExercise.id]: prev[currentExercise.id].map((set, i) =>
          i === currentSetIndex ? { ...set, [field]: Math.max(0, set[field] + delta) } : set,
        ),
      }));
    },
    [currentExercise, currentSetIndex],
  );

  const completeSet = useCallback(async () => {
    if (currentSetIndex === -1 || !currentExercise || !workoutLogId) return;

    const set = currentSets[currentSetIndex];

    // Optimistic update
    setExerciseLogs((prev) => ({
      ...prev,
      [currentExercise.id]: prev[currentExercise.id].map((s, i) =>
        i === currentSetIndex ? { ...s, completed: true } : s,
      ),
    }));

    // Async log
    try {
      await logSetMutation.mutateAsync({
        workoutLogId,
        exerciseId: currentExercise.id,
        setNumber: set.setNumber,
        reps: set.reps,
        weight: set.weight,
      });
    } catch (error) {
      toast({
        variant: 'destructive',
        title: 'Erro ao salvar série',
        description: 'Sua série não foi salva no banco de dados.',
      });
    }

    // Start rest timer if not last set
    if (currentSetIndex < currentSets.length - 1) {
      setRestTimer(currentExercise.rest_time || 60);
      setIsResting(true);
    }
  }, [currentExercise, currentSetIndex, currentSets, workoutLogId, logSetMutation, toast]);

  const skipRest = () => {
    setIsResting(false);
    setRestTimer(null);
  };

  if (workoutsLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <LoadingSpinner size="lg" text="Carregando treinos..." />
      </div>
    );
  }

  // Selection Screen
  if (!activeWorkout) {
    return (
      <div className="min-h-screen p-6 lg:p-8">
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
              onClick={() => handleStartWorkout(workout)}
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

  const completedSetsCount = currentSets.filter((s) => s.completed).length;
  const exerciseCompleted = completedSetsCount === (currentExercise?.sets || 0);
  const totalExercises = sortedExercises.length;

  // Calculate completed exercises based on logs
  const completedExercisesCount = sortedExercises.filter((ex: any) => {
    const logs = exerciseLogs[ex.id];
    return logs && logs.every((s) => s.completed);
  }).length;

  return (
    <div className="dark min-h-screen bg-background pb-24">
      {/* Header */}
      <div className="glass-strong sticky top-0 z-10">
        <div className="flex items-center justify-between px-4 py-3">
          <Button variant="ghost" size="icon-sm" onClick={() => setActiveWorkout(null)}>
            <ChevronLeft className="h-5 w-5" />
          </Button>
          <div className="text-center">
            <p className="text-xs text-muted-foreground">
              Exercício {currentExerciseIndex + 1} de {totalExercises}
            </p>
            <div className="mt-1 flex justify-center gap-1">
              {sortedExercises.map((ex: any, i: number) => (
                <div
                  key={ex.id}
                  className={`h-1.5 w-6 rounded-full transition-all ${
                    exerciseLogs[ex.id]?.every((s) => s.completed)
                      ? 'bg-success'
                      : i === currentExerciseIndex
                        ? 'bg-primary'
                        : 'bg-muted'
                  }`}
                />
              ))}
            </div>
          </div>
          <Badge variant="completed">
            {completedExercisesCount}/{totalExercises}
          </Badge>
        </div>
      </div>

      {/* Rest Timer Overlay */}
      <AnimatePresence>
        {isResting && restTimer !== null && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-background/95 px-6 backdrop-blur-lg"
          >
            <motion.div initial={{ scale: 0.8 }} animate={{ scale: 1 }} className="text-center">
              <p className="mb-2 text-muted-foreground">Descanse</p>
              <motion.p
                key={restTimer}
                initial={{ scale: 1.1 }}
                animate={{ scale: 1 }}
                className="mb-6 animate-timer-pulse font-display text-7xl font-bold text-foreground"
              >
                {formatTime(restTimer)}
              </motion.p>
              <p className="mb-8 text-sm text-muted-foreground">
                Próxima série: {currentSetIndex + 2} de {currentExercise.sets}
              </p>
              <div className="flex gap-4">
                <Button
                  variant="outline"
                  size="lg"
                  onClick={() => setRestTimer((prev) => (prev || 0) + 15)}
                >
                  +15s
                </Button>
                <Button variant="hero" size="lg" onClick={skipRest}>
                  Pular
                </Button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Exercise Content */}
      <div className="px-4 py-4">
        <motion.div
          key={currentExercise.id}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.3 }}
        >
          {/* Exercise Info */}
          <Card variant="exercise-active" className="mb-6">
            <CardContent className="p-5">
              <div className="mb-3 flex items-start justify-between">
                <div>
                  <h1 className="mb-1 font-display text-xl font-bold text-foreground">
                    {currentExercise.name}
                  </h1>
                  <div className="flex items-center gap-3 text-sm text-muted-foreground">
                    <span>{currentExercise.sets} séries</span>
                    <span>•</span>
                    <span>{currentExercise.reps} reps</span>
                    <span>•</span>
                    <span>{currentExercise.rest_time || 60}s descanso</span>
                  </div>
                </div>
              </div>
              {currentExercise.notes && (
                <p className="rounded-lg bg-accent/10 px-3 py-2 text-sm text-accent">
                  💡 {currentExercise.notes}
                </p>
              )}
              {currentExercise.video_url && (
                <a
                  href={currentExercise.video_url}
                  target="_blank"
                  rel="noreferrer"
                  className="mt-2 block text-xs text-primary hover:underline"
                >
                  Ver vídeo demonstrativo
                </a>
              )}
            </CardContent>
          </Card>

          {/* Current Set Logger */}
          {!exerciseCompleted && currentSet && (
            <Card variant="elevated" className="mb-6">
              <CardContent className="p-5">
                <div className="mb-6 text-center">
                  <Badge variant="sets" className="mb-2 px-4 py-1 text-lg">
                    Série {currentSetIndex + 1} de {currentExercise.sets}
                  </Badge>
                </div>

                {/* Reps Counter */}
                <div className="mb-6">
                  <p className="mb-3 text-center text-sm text-muted-foreground">Repetições</p>
                  <div className="flex items-center justify-center gap-4">
                    <Button
                      variant="outline"
                      size="icon-lg"
                      onClick={() => updateSetValue('reps', -1)}
                    >
                      <Minus className="h-6 w-6" />
                    </Button>
                    <div className="w-24 text-center">
                      <span className="font-display text-5xl font-bold text-foreground">
                        {currentSet.reps}
                      </span>
                    </div>
                    <Button
                      variant="outline"
                      size="icon-lg"
                      onClick={() => updateSetValue('reps', 1)}
                    >
                      <Plus className="h-6 w-6" />
                    </Button>
                  </div>
                </div>

                {/* Weight Input */}
                <div className="mb-6">
                  <p className="mb-3 text-center text-sm text-muted-foreground">Peso (kg)</p>
                  <div className="flex items-center justify-center gap-4">
                    <Button
                      variant="outline"
                      size="icon-lg"
                      onClick={() => updateSetValue('weight', -2.5)}
                    >
                      <Minus className="h-6 w-6" />
                    </Button>
                    <div className="w-24 text-center">
                      <span className="font-display text-5xl font-bold text-foreground">
                        {currentSet.weight}
                      </span>
                    </div>
                    <Button
                      variant="outline"
                      size="icon-lg"
                      onClick={() => updateSetValue('weight', 2.5)}
                    >
                      <Plus className="h-6 w-6" />
                    </Button>
                  </div>
                </div>

                {/* Complete Set Button */}
                <Button
                  variant="action"
                  size="touch-lg"
                  className="w-full"
                  onClick={completeSet}
                  disabled={logSetMutation.isPending}
                >
                  {logSetMutation.isPending ? (
                    'Salvando...'
                  ) : (
                    <>
                      <Check className="mr-2 h-6 w-6" />
                      Completar Série
                    </>
                  )}
                </Button>
              </CardContent>
            </Card>
          )}

          {/* Exercise Completed */}
          {exerciseCompleted && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="mb-6"
            >
              <Card variant="gradient" className="border-success/30">
                <CardContent className="p-6 text-center">
                  <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-success/20">
                    <Check className="h-8 w-8 text-success" />
                  </div>
                  <h3 className="mb-2 font-display text-lg font-semibold text-foreground">
                    Exercício Completo!
                  </h3>
                  <p className="mb-4 text-sm text-muted-foreground">
                    {completedSetsCount} séries registradas
                  </p>

                  {currentExerciseIndex < totalExercises - 1 ? (
                    <Button
                      variant="hero"
                      size="touch"
                      className="w-full"
                      onClick={() => setCurrentExerciseIndex((prev) => prev + 1)}
                    >
                      Próximo Exercício
                      <ChevronDown className="ml-2 h-5 w-5 rotate-[-90deg]" />
                    </Button>
                  ) : (
                    <Button
                      variant="hero-accent"
                      size="touch"
                      className="w-full"
                      onClick={handleFinishWorkout}
                      disabled={finishWorkoutMutation.isPending}
                    >
                      {finishWorkoutMutation.isPending ? (
                        'Finalizando...'
                      ) : (
                        <>
                          Finalizar Treino
                          <Check className="ml-2 h-5 w-5" />
                        </>
                      )}
                    </Button>
                  )}
                </CardContent>
              </Card>
            </motion.div>
          )}

          {/* Sets Summary */}
          <div className="space-y-2">
            <p className="mb-2 text-sm font-medium text-muted-foreground">Séries registradas</p>
            {currentSets.map((set, index) => (
              <div
                key={index}
                className={`flex items-center justify-between rounded-xl p-3 ${
                  set.completed
                    ? 'border border-success/20 bg-success/10'
                    : index === currentSetIndex
                      ? 'border border-primary/30 bg-primary/10'
                      : 'bg-muted/50'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div
                    className={`flex h-8 w-8 items-center justify-center rounded-full ${
                      set.completed
                        ? 'bg-success text-success-foreground'
                        : 'bg-muted text-muted-foreground'
                    }`}
                  >
                    {set.completed ? <Check className="h-4 w-4" /> : set.setNumber}
                  </div>
                  <span className="font-medium text-foreground">Série {set.setNumber}</span>
                </div>
                {set.completed && (
                  <div className="flex items-center gap-4 text-sm">
                    <Badge variant="reps">{set.reps} reps</Badge>
                    <Badge variant="weight">{set.weight} kg</Badge>
                  </div>
                )}
              </div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Navigation Footer */}
      <div className="glass-strong safe-bottom fixed bottom-0 left-0 right-0">
        <div className="flex gap-3 p-4">
          <Button
            variant="outline"
            className="flex-1"
            disabled={currentExerciseIndex === 0}
            onClick={() => setCurrentExerciseIndex((prev) => prev - 1)}
          >
            <ChevronUp className="mr-2 h-4 w-4 rotate-[-90deg]" />
            Anterior
          </Button>
          <Button
            variant="outline"
            className="flex-1"
            disabled={currentExerciseIndex === totalExercises - 1}
            onClick={() => setCurrentExerciseIndex((prev) => prev + 1)}
          >
            Próximo
            <ChevronDown className="ml-2 h-4 w-4 rotate-[-90deg]" />
          </Button>
        </div>
      </div>
    </div>
  );
}
