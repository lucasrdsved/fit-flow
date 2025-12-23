import { motion } from "framer-motion";
import { 
  Dumbbell, 
  Clock, 
  CheckCircle2, 
  Play,
  ChevronRight,
  Flame,
  Calendar
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Link } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { useStudentRecord, useStudentWorkouts, useStudentWorkoutLogs } from "@/hooks/useStudentData";
import { LoadingSpinner } from "@/components/ui/LoadingSpinner";
import { EmptyState } from "@/components/ui/EmptyState";

/**
 * The home page for the student application.
 *
 * This component displays an overview of the student's progress, the next scheduled workout,
 * and a list of recently completed workouts.
 *
 * It uses data hooks (`useStudentRecord`, `useStudentWorkouts`, `useStudentWorkoutLogs`) to fetch
 * user data and displays loading states or empty states as appropriate.
 *
 * @returns {JSX.Element} The student home page.
 */
export default function StudentHome() {
  const { profile, userType } = useAuth();
  const { data: student, isLoading: studentLoading } = useStudentRecord();
  const { data: workouts, isLoading: workoutsLoading } = useStudentWorkouts();
  const { data: logs, isLoading: logsLoading } = useStudentWorkoutLogs();

  const displayName = student?.name || profile?.name || "Aluno";
  const todayWorkout = workouts?.[0];
  const recentLogs = logs?.slice(0, 3) || [];
  
  // Calculate streak and weekly progress (simplified - would need real logic)
  const weekProgress = {
    completed: recentLogs.length,
    total: 5,
    streak: recentLogs.length > 0 ? Math.min(recentLogs.length, 7) : 0,
  };

  const isLoading = studentLoading || workoutsLoading || logsLoading;

  // For mock login, show demo data
  const isMockUser = userType && !student && !studentLoading;

  if (isLoading && !isMockUser) {
    return (
      <div className="min-h-screen dark flex items-center justify-center">
        <LoadingSpinner size="lg" text="Carregando..." />
      </div>
    );
  }

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
                {displayName}
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
          {todayWorkout || isMockUser ? (
            <Link to="/student/workout">
              <Card variant="exercise-active" className="overflow-hidden">
                <CardContent className="p-0">
                  <div className="p-5">
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <Badge variant="active" className="mb-2">Treino de Hoje</Badge>
                        <h2 className="text-lg font-display font-semibold text-foreground">
                          {todayWorkout?.title || "Treino A - Peito e Tríceps"}
                        </h2>
                      </div>
                      <div className="p-3 rounded-xl bg-accent/10">
                        <Dumbbell className="h-6 w-6 text-accent" />
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-4 text-sm text-muted-foreground mb-5">
                      <div className="flex items-center gap-1.5">
                        <Dumbbell className="h-4 w-4" />
                        <span>{todayWorkout?.exercises?.length || 6} exercícios</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <Clock className="h-4 w-4" />
                        <span>~55 min</span>
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
          ) : (
            <Card variant="elevated">
              <CardContent className="p-6">
                <EmptyState
                  icon={Calendar}
                  title="Nenhum treino programado"
                  description="Seu personal ainda não atribuiu um treino para você."
                />
              </CardContent>
            </Card>
          )}
        </motion.div>

        {/* Quick Stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="grid grid-cols-3 gap-3 mb-6"
        >
          {[
            { label: "Treinos", value: recentLogs.length.toString() || "48", sublabel: "Total" },
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
            {(recentLogs.length > 0 ? recentLogs : [
              { id: "1", workouts: { title: "Treino B - Costas e Bíceps" }, completed_at: new Date(Date.now() - 86400000).toISOString(), duration_minutes: 52, difficulty_rating: 4 },
              { id: "2", workouts: { title: "Treino A - Peito e Tríceps" }, completed_at: new Date(Date.now() - 172800000).toISOString(), duration_minutes: 48, difficulty_rating: 5 },
              { id: "3", workouts: { title: "Treino C - Pernas" }, completed_at: new Date(Date.now() - 259200000).toISOString(), duration_minutes: 61, difficulty_rating: 4 },
            ]).map((log: any) => {
              const daysAgo = Math.floor((Date.now() - new Date(log.completed_at).getTime()) / 86400000);
              const dateLabel = daysAgo === 0 ? "Hoje" : daysAgo === 1 ? "Ontem" : `${daysAgo} dias atrás`;
              
              return (
                <Card key={log.id} variant="default" className="overflow-hidden">
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="p-2.5 rounded-xl bg-success/10">
                          <CheckCircle2 className="h-5 w-5 text-success" />
                        </div>
                        <div>
                          <p className="font-medium text-foreground text-sm">
                            {log.workouts?.title || "Treino"}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {dateLabel} • {log.duration_minutes || 45} min
                          </p>
                        </div>
                      </div>
                      <div className="flex gap-0.5">
                        {Array.from({ length: 5 }).map((_, i) => (
                          <div
                            key={i}
                            className={`h-2 w-2 rounded-full ${
                              i < (log.difficulty_rating || 4) ? 'bg-warning' : 'bg-muted'
                            }`}
                          />
                        ))}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </motion.div>
      </div>
    </div>
  );
}
