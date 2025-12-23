import { useState, useEffect, useCallback, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, Check, ChevronDown, ChevronUp } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ExerciseCard } from './ExerciseCard';
import { SetLogger } from './SetLogger';
import { RestTimer } from './RestTimer';

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
  notes?: string;
  video_url?: string;
}

interface WorkoutPlayerProps {
  workout: {
    id: string;
    title: string;
    description: string | null;
    workout_type: string | null;
    exercises: Exercise[];
  };
  workoutLogId: string;
  onLogSet: (params: {
    workoutLogId: string;
    exerciseId: string;
    setNumber: number;
    reps: number;
    weight: number;
  }) => Promise<void>;
  onFinish: () => void;
  onCancel: () => void;
  isLogging?: boolean;
}

export default function WorkoutPlayer({
  workout,
  workoutLogId,
  onLogSet,
  onFinish,
  onCancel,
  isLogging = false,
}: WorkoutPlayerProps) {
  const [currentExerciseIndex, setCurrentExerciseIndex] = useState(0);
  const [exerciseLogs, setExerciseLogs] = useState<Record<string, SetLog[]>>({});
  const [restTimer, setRestTimer] = useState<number | null>(null);
  const [isResting, setIsResting] = useState(false);
  const [showAllExercises, setShowAllExercises] = useState(false);

  // Sort exercises
  const sortedExercises = useMemo(
    () => [...(workout.exercises || [])].sort((a, b) => a.order_index - b.order_index),
    [workout.exercises]
  );
  const currentExercise = sortedExercises[currentExerciseIndex];
  const totalExercises = sortedExercises.length;

  // Initialize logs for current exercise when it changes
  useEffect(() => {
    if (currentExercise && !exerciseLogs[currentExercise.id]) {
      const initialSets: SetLog[] = Array.from({ length: currentExercise.sets }, (_, i) => ({
        setNumber: i + 1,
        reps: Number(currentExercise.reps) || 10,
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

  const currentSets = useMemo(
    () => (currentExercise ? exerciseLogs[currentExercise.id] || [] : []),
    [currentExercise, exerciseLogs]
  );
  const currentSetIndex = currentSets.findIndex((s) => !s.completed);

  const handleSetComplete = useCallback(
    async (setNumber: number, reps: number, weight: number) => {
      if (!currentExercise) return;

      // Optimistic update
      setExerciseLogs((prev) => ({
        ...prev,
        [currentExercise.id]: prev[currentExercise.id].map((s) =>
          s.setNumber === setNumber ? { ...s, completed: true } : s
        ),
      }));

      // Async log
      await onLogSet({
        workoutLogId,
        exerciseId: currentExercise.id,
        setNumber,
        reps,
        weight,
      });

      // Start rest timer if not last set
      const setIdx = currentSets.findIndex((s) => s.setNumber === setNumber);
      if (setIdx < currentSets.length - 1) {
        setRestTimer(currentExercise.rest_time || 60);
        setIsResting(true);
      }
    },
    [currentExercise, currentSets, onLogSet, workoutLogId]
  );

  const handleUpdateSet = useCallback(
    (setIndex: number, field: 'reps' | 'weight', delta: number) => {
      if (!currentExercise) return;

      setExerciseLogs((prev) => ({
        ...prev,
        [currentExercise.id]: prev[currentExercise.id].map((set, i) =>
          i === setIndex ? { ...set, [field]: Math.max(0, set[field] + delta) } : set
        ),
      }));
    },
    [currentExercise]
  );

  const skipRest = () => {
    setIsResting(false);
    setRestTimer(null);
  };

  const addRestTime = (seconds: number) => {
    setRestTimer((prev) => (prev || 0) + seconds);
  };

  const goToNextExercise = () => {
    if (currentExerciseIndex < totalExercises - 1) {
      setCurrentExerciseIndex((prev) => prev + 1);
    }
  };

  const goToPrevExercise = () => {
    if (currentExerciseIndex > 0) {
      setCurrentExerciseIndex((prev) => prev - 1);
    }
  };

  const completedSetsCount = currentSets.filter((s) => s.completed).length;
  const exerciseCompleted = completedSetsCount === (currentExercise?.sets || 0);

  const completedExercisesCount = sortedExercises.filter((ex) => {
    const logs = exerciseLogs[ex.id];
    return logs && logs.every((s) => s.completed);
  }).length;

  const allExercisesCompleted = completedExercisesCount === totalExercises;

  if (!currentExercise) return null;

  return (
    <div className="min-h-screen bg-background pb-24">
      {/* Header */}
      <div className="glass-strong sticky top-0 z-10">
        <div className="flex items-center justify-between px-4 py-3">
          <Button variant="ghost" size="icon-sm" onClick={onCancel}>
            <ChevronLeft className="h-5 w-5" />
          </Button>
          <div className="text-center">
            <p className="text-xs text-muted-foreground">
              Exercício {currentExerciseIndex + 1} de {totalExercises}
            </p>
            <div className="mt-1 flex justify-center gap-1">
              {sortedExercises.map((ex, i) => (
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
      <RestTimer
        timeLeft={restTimer}
        isActive={isResting}
        nextSetInfo={`Próxima série: ${currentSetIndex + 2} de ${currentExercise.sets}`}
        onSkip={skipRest}
        onAddTime={addRestTime}
      />

      {/* Exercise Content */}
      <div className="px-4 py-4">
        <motion.div
          key={currentExercise.id}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.3 }}
        >
          {/* Current Exercise Info */}
          <ExerciseCard exercise={currentExercise} isActive />

          {/* Set Logger */}
          {!exerciseCompleted && currentSetIndex >= 0 && (
            <SetLogger
              exerciseId={currentExercise.id}
              sets={currentSets}
              currentSetIndex={currentSetIndex}
              onSetComplete={handleSetComplete}
              onUpdateSet={handleUpdateSet}
              isLogging={isLogging}
            />
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
                    {completedSetsCount} séries finalizadas
                  </p>
                  {currentExerciseIndex < totalExercises - 1 ? (
                    <Button variant="action" size="touch-lg" className="w-full" onClick={goToNextExercise}>
                      Próximo Exercício
                    </Button>
                  ) : allExercisesCompleted ? (
                    <Button variant="action" size="touch-lg" className="w-full" onClick={onFinish}>
                      Finalizar Treino
                    </Button>
                  ) : null}
                </CardContent>
              </Card>
            </motion.div>
          )}

          {/* Navigation */}
          <div className="flex gap-3 mb-6">
            <Button
              variant="outline"
              className="flex-1"
              onClick={goToPrevExercise}
              disabled={currentExerciseIndex === 0}
            >
              <ChevronLeft className="mr-1 h-4 w-4" />
              Anterior
            </Button>
            <Button
              variant="outline"
              className="flex-1"
              onClick={goToNextExercise}
              disabled={currentExerciseIndex >= totalExercises - 1}
            >
              Próximo
              <ChevronLeft className="ml-1 h-4 w-4 rotate-180" />
            </Button>
          </div>

          {/* Toggle All Exercises List */}
          <Button
            variant="ghost"
            className="w-full mb-4"
            onClick={() => setShowAllExercises(!showAllExercises)}
          >
            {showAllExercises ? (
              <>
                <ChevronUp className="mr-2 h-4 w-4" />
                Ocultar lista de exercícios
              </>
            ) : (
              <>
                <ChevronDown className="mr-2 h-4 w-4" />
                Ver todos os exercícios
              </>
            )}
          </Button>

          {/* All Exercises List */}
          <AnimatePresence>
            {showAllExercises && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                className="overflow-hidden"
              >
                {sortedExercises.map((ex, i) => {
                  const logs = exerciseLogs[ex.id];
                  const isCompleted = logs && logs.every((s) => s.completed);
                  const isActive = i === currentExerciseIndex;

                  return (
                    <div
                      key={ex.id}
                      className="cursor-pointer"
                      onClick={() => setCurrentExerciseIndex(i)}
                    >
                      <ExerciseCard
                        exercise={ex}
                        isActive={isActive}
                        isCompleted={isCompleted}
                      />
                    </div>
                  );
                })}
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </div>
    </div>
  );
}
