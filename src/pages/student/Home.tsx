import { motion } from 'framer-motion';
import { Dumbbell, Clock, CheckCircle2, Play, ChevronRight, Flame, Calendar } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Link } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import {
  useStudentRecord,
  useStudentWorkouts,
  useStudentWorkoutLogs,
} from '@/hooks/useStudentData';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';
import { EmptyState } from '@/components/ui/EmptyState';

export default function StudentHome() {
  const { profile, userType } = useAuth();
  const { data: student, isLoading: studentLoading } = useStudentRecord();
  const { data: workouts, isLoading: workoutsLoading } = useStudentWorkouts();
  const { data: logs, isLoading: logsLoading } = useStudentWorkoutLogs();

  const displayName = student?.name || profile?.name || 'Aluno';
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
      <div className="dark flex min-h-screen items-center justify-center">
        <LoadingSpinner size="lg" text="Carregando..." />
      </div>
    );
  }

  return (
    <div className="dark min-h-screen">
      {/* Header with gradient */}
      <div className="bg-gradient-hero pt-safe-top">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="px-5 pb-6 pt-8"
        >
          <div className="mb-6 flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Olá,</p>
              <h1 className="font-display text-2xl font-bold text-foreground">{displayName}</h1>
            </div>
            <div className="flex items-center gap-2">
              <Badge variant="energy" className="flex items-center gap-1">
                <Flame className="h-3 w-3" />
                {weekProgress.streak} dias
              </Badge>
            </div>
          </div>

          {/* Week Progress */}
          <div className="rounded-2xl border border-border/50 bg-card/50 p-4 backdrop-blur-sm">
            <div className="mb-3 flex items-center justify-between">
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
                    i < weekProgress.completed ? 'bg-gradient-accent' : 'bg-muted'
                  }`}
                />
              ))}
            </div>
          </div>
        </motion.div>
      </div>

      {/* Content */}
      <div className="-mt-2 px-5">
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
                    <div className="mb-4 flex items-start justify-between">
                      <div>
                        <Badge variant="active" className="mb-2">
                          Treino de Hoje
                        </Badge>
                        <h2 className="font-display text-lg font-semibold text-foreground">
                          {todayWorkout?.title || 'Treino A - Peito e Tríceps'}
                        </h2>
                      </div>
                      <div className="rounded-xl bg-accent/10 p-3">
                        <Dumbbell className="h-6 w-6 text-accent" />
                      </div>
                    </div>

                    <div className="mb-5 flex items-center gap-4 text-sm text-muted-foreground">
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
                      <Play className="mr-2 h-5 w-5" />
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
          className="mb-6 grid grid-cols-3 gap-3"
        >
          {[
            { label: 'Treinos', value: recentLogs.length.toString() || '48', sublabel: 'Total' },
            { label: 'Volume', value: '12.5t', sublabel: 'Este mês' },
            { label: 'PRs', value: '6', sublabel: 'Este mês' },
          ].map((stat, index) => (
            <Card key={stat.label} variant="stat">
              <CardContent className="p-3 text-center">
                <p className="font-display text-xl font-bold text-foreground">{stat.value}</p>
                <p className="text-[10px] uppercase tracking-wide text-muted-foreground">
                  {stat.label}
                </p>
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
          <div className="mb-4 flex items-center justify-between">
            <h3 className="font-display font-semibold text-foreground">Treinos Recentes</h3>
            <Link to="/student/progress">
              <Button variant="ghost" size="sm">
                Ver todos
                <ChevronRight className="ml-1 h-4 w-4" />
              </Button>
            </Link>
          </div>

          <div className="space-y-3">
            {(recentLogs.length > 0
              ? recentLogs
              : [
                  {
                    id: '1',
                    workouts: { title: 'Treino B - Costas e Bíceps' },
                    completed_at: new Date(Date.now() - 86400000).toISOString(),
                    duration_minutes: 52,
                    difficulty_rating: 4,
                  },
                  {
                    id: '2',
                    workouts: { title: 'Treino A - Peito e Tríceps' },
                    completed_at: new Date(Date.now() - 172800000).toISOString(),
                    duration_minutes: 48,
                    difficulty_rating: 5,
                  },
                  {
                    id: '3',
                    workouts: { title: 'Treino C - Pernas' },
                    completed_at: new Date(Date.now() - 259200000).toISOString(),
                    duration_minutes: 61,
                    difficulty_rating: 4,
                  },
                ]
            ).map((log: { id: string; workouts: { title: string }; completed_at: string; duration_minutes: number; difficulty_rating: number }) => {
              const daysAgo = Math.floor(
                (Date.now() - new Date(log.completed_at).getTime()) / 86400000,
              );
              const dateLabel =
                daysAgo === 0 ? 'Hoje' : daysAgo === 1 ? 'Ontem' : `${daysAgo} dias atrás`;

              return (
                <Card key={log.id} variant="default" className="overflow-hidden">
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="rounded-xl bg-success/10 p-2.5">
                          <CheckCircle2 className="h-5 w-5 text-success" />
                        </div>
                        <div>
                          <p className="text-sm font-medium text-foreground">
                            {log.workouts?.title || 'Treino'}
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
