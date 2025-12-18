import { motion } from "framer-motion";
import { 
  Dumbbell, 
  Clock, 
  CheckCircle2, 
  Play,
  ChevronRight,
  Flame
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Link } from "react-router-dom";

// Mock data for student home
const todayWorkout = {
  id: "1",
  name: "Treino A - Peito e Tríceps",
  exercises: 6,
  estimatedTime: 55,
  completedToday: false,
};

const weekProgress = {
  completed: 3,
  total: 5,
  streak: 12,
};

const recentWorkouts = [
  { id: "1", name: "Treino B - Costas e Bíceps", date: "Ontem", duration: 52, rating: 4 },
  { id: "2", name: "Treino A - Peito e Tríceps", date: "2 dias atrás", duration: 48, rating: 5 },
  { id: "3", name: "Treino C - Pernas", date: "3 dias atrás", duration: 61, rating: 4 },
];

export default function StudentHome() {
  return (
    <div className="min-h-screen dark">
      {/* Header with gradient */}
      <div className="bg-gradient-hero pt-safe-top">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="px-5 pt-8 pb-6"
        >
          <div className="flex items-center justify-between mb-6">
            <div>
              <p className="text-muted-foreground text-sm">Olá,</p>
              <h1 className="text-2xl font-display font-bold text-foreground">
                Maria Silva
              </h1>
            </div>
            <div className="flex items-center gap-2">
              <Badge variant="energy" className="flex items-center gap-1">
                <Flame className="h-3 w-3" />
                {weekProgress.streak} dias
              </Badge>
            </div>
          </div>

          {/* Week Progress */}
          <div className="bg-card/50 backdrop-blur-sm rounded-2xl p-4 border border-border/50">
            <div className="flex items-center justify-between mb-3">
              <span className="text-sm text-muted-foreground">Progresso Semanal</span>
              <span className="text-sm font-semibold text-foreground">
                {weekProgress.completed}/{weekProgress.total} treinos
              </span>
            </div>
            <div className="flex gap-1.5">
              {Array.from({ length: weekProgress.total }).map((_, i) => (
                <div
                  key={i}
                  className={`h-2 flex-1 rounded-full transition-all ${
                    i < weekProgress.completed
                      ? 'bg-gradient-accent'
                      : 'bg-muted'
                  }`}
                />
              ))}
            </div>
          </div>
        </motion.div>
      </div>

      {/* Content */}
      <div className="px-5 -mt-2">
        {/* Today's Workout CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mb-6"
        >
          <Link to="/student/workout">
            <Card variant="exercise-active" className="overflow-hidden">
              <CardContent className="p-0">
                <div className="p-5">
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <Badge variant="active" className="mb-2">Treino de Hoje</Badge>
                      <h2 className="text-lg font-display font-semibold text-foreground">
                        {todayWorkout.name}
                      </h2>
                    </div>
                    <div className="p-3 rounded-xl bg-accent/10">
                      <Dumbbell className="h-6 w-6 text-accent" />
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-4 text-sm text-muted-foreground mb-5">
                    <div className="flex items-center gap-1.5">
                      <Dumbbell className="h-4 w-4" />
                      <span>{todayWorkout.exercises} exercícios</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <Clock className="h-4 w-4" />
                      <span>~{todayWorkout.estimatedTime} min</span>
                    </div>
                  </div>

                  <Button variant="action" size="touch" className="w-full">
                    <Play className="h-5 w-5 mr-2" />
                    Iniciar Treino
                  </Button>
                </div>
              </CardContent>
            </Card>
          </Link>
        </motion.div>

        {/* Quick Stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="grid grid-cols-3 gap-3 mb-6"
        >
          {[
            { label: "Treinos", value: "48", sublabel: "Total" },
            { label: "Volume", value: "12.5t", sublabel: "Este mês" },
            { label: "PRs", value: "6", sublabel: "Este mês" },
          ].map((stat, index) => (
            <Card key={stat.label} variant="stat">
              <CardContent className="p-3 text-center">
                <p className="text-xl font-display font-bold text-foreground">{stat.value}</p>
                <p className="text-[10px] text-muted-foreground uppercase tracking-wide">{stat.label}</p>
              </CardContent>
            </Card>
          ))}
        </motion.div>

        {/* Recent Workouts */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-display font-semibold text-foreground">Treinos Recentes</h3>
            <Link to="/student/progress">
              <Button variant="ghost" size="sm">
                Ver todos
                <ChevronRight className="h-4 w-4 ml-1" />
              </Button>
            </Link>
          </div>

          <div className="space-y-3">
            {recentWorkouts.map((workout) => (
              <Card key={workout.id} variant="default" className="overflow-hidden">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="p-2.5 rounded-xl bg-success/10">
                        <CheckCircle2 className="h-5 w-5 text-success" />
                      </div>
                      <div>
                        <p className="font-medium text-foreground text-sm">{workout.name}</p>
                        <p className="text-xs text-muted-foreground">
                          {workout.date} • {workout.duration} min
                        </p>
                      </div>
                    </div>
                    <div className="flex gap-0.5">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <div
                          key={i}
                          className={`h-2 w-2 rounded-full ${
                            i < workout.rating ? 'bg-warning' : 'bg-muted'
                          }`}
                        />
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
}
