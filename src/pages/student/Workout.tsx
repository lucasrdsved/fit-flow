import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  ChevronLeft, 
  Play, 
  Pause, 
  RotateCcw,
  Check,
  Plus,
  Minus,
  ChevronDown,
  ChevronUp,
  Clock,
  Weight,
  Dumbbell
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Link } from "react-router-dom";

// Mock workout data
const workoutPlan = {
  id: "1",
  name: "Treino A - Peito e Tríceps",
  exercises: [
    {
      id: "e1",
      name: "Supino Reto com Barra",
      sets: 4,
      repsMin: 8,
      repsMax: 12,
      restSeconds: 90,
      muscle: "chest",
      notes: "Foco na contração",
    },
    {
      id: "e2",
      name: "Supino Inclinado com Halteres",
      sets: 3,
      repsMin: 10,
      repsMax: 12,
      restSeconds: 75,
      muscle: "chest",
      notes: null,
    },
    {
      id: "e3",
      name: "Crossover",
      sets: 3,
      repsMin: 12,
      repsMax: 15,
      restSeconds: 60,
      muscle: "chest",
      notes: "Apertar bem no final",
    },
    {
      id: "e4",
      name: "Tríceps Pulley",
      sets: 4,
      repsMin: 10,
      repsMax: 12,
      restSeconds: 60,
      muscle: "triceps",
      notes: null,
    },
    {
      id: "e5",
      name: "Tríceps Francês",
      sets: 3,
      repsMin: 10,
      repsMax: 12,
      restSeconds: 60,
      muscle: "triceps",
      notes: null,
    },
    {
      id: "e6",
      name: "Mergulho entre Bancos",
      sets: 3,
      repsMin: 12,
      repsMax: 15,
      restSeconds: 45,
      muscle: "triceps",
      notes: "Até a falha",
    },
  ],
};

interface SetLog {
  setNumber: number;
  reps: number;
  weight: number;
  completed: boolean;
}

export default function StudentWorkout() {
  const [currentExerciseIndex, setCurrentExerciseIndex] = useState(0);
  const [exerciseLogs, setExerciseLogs] = useState<Record<string, SetLog[]>>({});
  const [restTimer, setRestTimer] = useState<number | null>(null);
  const [isResting, setIsResting] = useState(false);
  const [expandedExercise, setExpandedExercise] = useState<string | null>(null);

  const currentExercise = workoutPlan.exercises[currentExerciseIndex];

  // Initialize logs for current exercise
  useEffect(() => {
    if (!exerciseLogs[currentExercise.id]) {
      const initialSets: SetLog[] = Array.from({ length: currentExercise.sets }, (_, i) => ({
        setNumber: i + 1,
        reps: currentExercise.repsMin,
        weight: 0,
        completed: false,
      }));
      setExerciseLogs(prev => ({
        ...prev,
        [currentExercise.id]: initialSets,
      }));
    }
  }, [currentExercise.id, currentExercise.sets, currentExercise.repsMin, exerciseLogs]);

  const currentSets = exerciseLogs[currentExercise.id] || [];
  const currentSetIndex = currentSets.findIndex(s => !s.completed);
  const currentSet = currentSets[currentSetIndex] || currentSets[currentSets.length - 1];

  // Rest timer
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isResting && restTimer !== null && restTimer > 0) {
      interval = setInterval(() => {
        setRestTimer(prev => (prev !== null && prev > 0 ? prev - 1 : 0));
      }, 1000);
    } else if (restTimer === 0) {
      setIsResting(false);
      setRestTimer(null);
    }
    return () => clearInterval(interval);
  }, [isResting, restTimer]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const updateSetValue = useCallback((field: 'reps' | 'weight', delta: number) => {
    if (currentSetIndex === -1) return;
    
    setExerciseLogs(prev => ({
      ...prev,
      [currentExercise.id]: prev[currentExercise.id].map((set, i) =>
        i === currentSetIndex
          ? { ...set, [field]: Math.max(0, set[field] + delta) }
          : set
      ),
    }));
  }, [currentExercise.id, currentSetIndex]);

  const completeSet = useCallback(() => {
    if (currentSetIndex === -1) return;
    
    setExerciseLogs(prev => ({
      ...prev,
      [currentExercise.id]: prev[currentExercise.id].map((set, i) =>
        i === currentSetIndex
          ? { ...set, completed: true }
          : set
      ),
    }));

    // Start rest timer if not last set
    if (currentSetIndex < currentSets.length - 1) {
      setRestTimer(currentExercise.restSeconds);
      setIsResting(true);
    }
  }, [currentExercise.id, currentExercise.restSeconds, currentSetIndex, currentSets.length]);

  const skipRest = () => {
    setIsResting(false);
    setRestTimer(null);
  };

  const completedSetsCount = currentSets.filter(s => s.completed).length;
  const exerciseCompleted = completedSetsCount === currentExercise.sets;

  const totalExercises = workoutPlan.exercises.length;
  const completedExercises = workoutPlan.exercises.filter(ex => {
    const logs = exerciseLogs[ex.id];
    return logs && logs.every(s => s.completed);
  }).length;

  return (
    <div className="min-h-screen bg-background dark pb-6">
      {/* Header */}
      <div className="sticky top-0 z-10 glass-strong">
        <div className="flex items-center justify-between px-4 py-3">
          <Link to="/student">
            <Button variant="ghost" size="icon-sm">
              <ChevronLeft className="h-5 w-5" />
            </Button>
          </Link>
          <div className="text-center">
            <p className="text-xs text-muted-foreground">
              Exercício {currentExerciseIndex + 1} de {totalExercises}
            </p>
            <div className="flex gap-1 mt-1 justify-center">
              {workoutPlan.exercises.map((ex, i) => (
                <div
                  key={ex.id}
                  className={`h-1.5 w-6 rounded-full transition-all ${
                    exerciseLogs[ex.id]?.every(s => s.completed)
                      ? 'bg-success'
                      : i === currentExerciseIndex
                      ? 'bg-primary'
                      : 'bg-muted'
                  }`}
                />
              ))}
            </div>
          </div>
          <Badge variant="completed">{completedExercises}/{totalExercises}</Badge>
        </div>
      </div>

      {/* Rest Timer Overlay */}
      <AnimatePresence>
        {isResting && restTimer !== null && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-background/95 backdrop-blur-lg flex flex-col items-center justify-center px-6"
          >
            <motion.div
              initial={{ scale: 0.8 }}
              animate={{ scale: 1 }}
              className="text-center"
            >
              <p className="text-muted-foreground mb-2">Descanse</p>
              <motion.p
                key={restTimer}
                initial={{ scale: 1.1 }}
                animate={{ scale: 1 }}
                className="text-7xl font-display font-bold text-foreground mb-6 animate-timer-pulse"
              >
                {formatTime(restTimer)}
              </motion.p>
              <p className="text-sm text-muted-foreground mb-8">
                Próxima série: {currentSetIndex + 2} de {currentExercise.sets}
              </p>
              <div className="flex gap-4">
                <Button variant="outline" size="lg" onClick={() => setRestTimer(prev => (prev || 0) + 15)}>
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
              <div className="flex items-start justify-between mb-3">
                <div>
                  <h1 className="text-xl font-display font-bold text-foreground mb-1">
                    {currentExercise.name}
                  </h1>
                  <div className="flex items-center gap-3 text-sm text-muted-foreground">
                    <span>{currentExercise.sets} séries</span>
                    <span>•</span>
                    <span>{currentExercise.repsMin}-{currentExercise.repsMax} reps</span>
                    <span>•</span>
                    <span>{currentExercise.restSeconds}s descanso</span>
                  </div>
                </div>
              </div>
              {currentExercise.notes && (
                <p className="text-sm text-accent bg-accent/10 px-3 py-2 rounded-lg">
                  💡 {currentExercise.notes}
                </p>
              )}
            </CardContent>
          </Card>

          {/* Current Set Logger */}
          {!exerciseCompleted && currentSet && (
            <Card variant="elevated" className="mb-6">
              <CardContent className="p-5">
                <div className="text-center mb-6">
                  <Badge variant="sets" className="mb-2 text-lg px-4 py-1">
                    Série {currentSetIndex + 1} de {currentExercise.sets}
                  </Badge>
                </div>

                {/* Reps Counter */}
                <div className="mb-6">
                  <p className="text-sm text-muted-foreground text-center mb-3">Repetições</p>
                  <div className="flex items-center justify-center gap-4">
                    <Button
                      variant="outline"
                      size="icon-lg"
                      onClick={() => updateSetValue('reps', -1)}
                    >
                      <Minus className="h-6 w-6" />
                    </Button>
                    <div className="w-24 text-center">
                      <span className="text-5xl font-display font-bold text-foreground">
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
                  <p className="text-sm text-muted-foreground text-center mb-3">Peso (kg)</p>
                  <div className="flex items-center justify-center gap-4">
                    <Button
                      variant="outline"
                      size="icon-lg"
                      onClick={() => updateSetValue('weight', -2.5)}
                    >
                      <Minus className="h-6 w-6" />
                    </Button>
                    <div className="w-24 text-center">
                      <span className="text-5xl font-display font-bold text-foreground">
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
                >
                  <Check className="h-6 w-6 mr-2" />
                  Completar Série
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
                  <div className="h-16 w-16 rounded-full bg-success/20 flex items-center justify-center mx-auto mb-4">
                    <Check className="h-8 w-8 text-success" />
                  </div>
                  <h3 className="text-lg font-display font-semibold text-foreground mb-2">
                    Exercício Completo!
                  </h3>
                  <p className="text-sm text-muted-foreground mb-4">
                    {completedSetsCount} séries registradas
                  </p>
                  
                  {currentExerciseIndex < totalExercises - 1 ? (
                    <Button
                      variant="hero"
                      size="touch"
                      className="w-full"
                      onClick={() => setCurrentExerciseIndex(prev => prev + 1)}
                    >
                      Próximo Exercício
                      <ChevronDown className="h-5 w-5 ml-2 rotate-[-90deg]" />
                    </Button>
                  ) : (
                    <Link to="/student">
                      <Button variant="hero-accent" size="touch" className="w-full">
                        Finalizar Treino
                        <Check className="h-5 w-5 ml-2" />
                      </Button>
                    </Link>
                  )}
                </CardContent>
              </Card>
            </motion.div>
          )}

          {/* Sets Summary */}
          <div className="space-y-2">
            <p className="text-sm font-medium text-muted-foreground mb-2">Séries registradas</p>
            {currentSets.map((set, index) => (
              <div
                key={index}
                className={`flex items-center justify-between p-3 rounded-xl ${
                  set.completed
                    ? 'bg-success/10 border border-success/20'
                    : index === currentSetIndex
                    ? 'bg-primary/10 border border-primary/30'
                    : 'bg-muted/50'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className={`h-8 w-8 rounded-full flex items-center justify-center ${
                    set.completed ? 'bg-success text-success-foreground' : 'bg-muted text-muted-foreground'
                  }`}>
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
      <div className="fixed bottom-0 left-0 right-0 glass-strong safe-bottom">
        <div className="flex gap-3 p-4">
          <Button
            variant="outline"
            className="flex-1"
            disabled={currentExerciseIndex === 0}
            onClick={() => setCurrentExerciseIndex(prev => prev - 1)}
          >
            <ChevronUp className="h-4 w-4 mr-2 rotate-[-90deg]" />
            Anterior
          </Button>
          <Button
            variant="outline"
            className="flex-1"
            disabled={currentExerciseIndex === totalExercises - 1}
            onClick={() => setCurrentExerciseIndex(prev => prev + 1)}
          >
            Próximo
            <ChevronDown className="h-4 w-4 ml-2 rotate-[-90deg]" />
          </Button>
        </div>
      </div>
    </div>
  );
}
