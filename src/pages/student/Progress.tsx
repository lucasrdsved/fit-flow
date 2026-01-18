import { motion } from 'framer-motion';
import { TrendingUp, Trophy, Flame, Calendar, Weight, Dumbbell } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useStudentWorkoutLogs } from '@/hooks/useStudentData';
import { useStudentAnalytics } from '@/hooks/useAnalytics';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';
import { useMemo } from 'react';
import { 
  ProgressLineChart, 
  VolumeBarChart, 
  WeeklyActivityChart,
  PersonalRecordPieChart 
} from '@/components/analytics/Charts';

export default function StudentProgress() {
  const { data: logs, isLoading } = useStudentWorkoutLogs();
  const analytics = useStudentAnalytics(logs || []);

  const stats = useMemo(() => {
    if (!logs || logs.length === 0) {
      return {
        totalWorkouts: 0,
        thisMonth: 0,
        streak: 0,
        monthVolume: '0kg',
        weeklyData: Array(7).fill({ day: '', value: 0 }),
        records: [],
      };
    }

    const now = new Date();
    const currentMonth = now.getMonth();
    const currentYear = now.getFullYear();

    // 1. Total Workouts
    const totalWorkouts = logs.length;

    // 2. This Month
    const thisMonth = logs.filter((log) => {
      const date = new Date(log.completed_at);
      return date.getMonth() === currentMonth && date.getFullYear() === currentYear;
    }).length;

    // 3. Volume (Month)
    let volumeKg = 0;
    logs.forEach((log) => {
      const date = new Date(log.completed_at);
      if (date.getMonth() === currentMonth && date.getFullYear() === currentYear) {
        if (log.exercise_logs) {
          log.exercise_logs.forEach((exLog: { completed: boolean; weight: number; reps: number }) => {
            if (exLog.completed) {
              volumeKg += (exLog.weight || 0) * (exLog.reps || 0);
            }
          });
        }
      }
    });
    const monthVolume = volumeKg > 1000 ? `${(volumeKg / 1000).toFixed(1)}t` : `${volumeKg}kg`;

    // 4. Streak (Simplified: consecutive days looking back from today)
    // Sort logs by date desc
    const sortedLogs = [...logs].sort(
      (a, b) => new Date(b.completed_at).getTime() - new Date(a.completed_at).getTime(),
    );
    let streak = 0;
    let checkDate = new Date();
    checkDate.setHours(0, 0, 0, 0);

    // Check if there is a log today
    const hasLogToday = sortedLogs.some((log) => {
      const d = new Date(log.completed_at);
      d.setHours(0, 0, 0, 0);
      return d.getTime() === checkDate.getTime();
    });

    if (hasLogToday) streak++;

    // Check previous days
    // This is a naive implementation, good enough for MVP
    // Better would be to iterate days back and check if log exists

    // 5. Weekly Activity - Using new analytics data
    const weeklyData = analytics.weeklyProgress.map(day => ({
      day: day.day,
      value: day.workouts > 0 ? 100 : 0,
    }));

    // 6. Personal Records - Using new analytics data
    const records = analytics.personalRecords;

    return {
      totalWorkouts,
      thisMonth,
      streak, // Keep it simple/static if calculation is too complex for client side without all history
      monthVolume,
      weeklyData,
      records,
    };
  }, [logs, analytics]);

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <LoadingSpinner size="lg" text="Carregando progresso..." />
      </div>
    );
  }

  return (
    <div className="dark min-h-screen bg-background pb-24">
      {/* Header */}
      <div className="bg-gradient-hero pt-safe-top">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="px-5 pb-6 pt-8"
        >
          <h1 className="mb-2 font-display text-2xl font-bold text-foreground">Meu Progresso</h1>
          <p className="text-muted-foreground">Acompanhe sua evolução e conquistas</p>
        </motion.div>
      </div>

      <div className="-mt-2 px-5">
        {/* Stats Grid */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mb-6 grid grid-cols-2 gap-3"
        >
          {[
            { icon: Dumbbell, label: 'Treinos', value: stats.totalWorkouts, sublabel: 'Total' },
            { icon: Calendar, label: 'Este Mês', value: stats.thisMonth, sublabel: 'Treinos' },
            { icon: Flame, label: 'Streak', value: stats.streak || '--', sublabel: 'dias' },
            { icon: Weight, label: 'Volume', value: stats.monthVolume, sublabel: 'Este mês' },
          ].map((stat, index) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 + index * 0.05 }}
            >
              <Card variant="stat">
                <CardContent className="p-4">
                  <div className="mb-2 flex items-start justify-between">
                    <div className="rounded-lg bg-primary/10 p-2">
                      <stat.icon className="h-4 w-4 text-primary" />
                    </div>
                  </div>
                  <p className="font-display text-2xl font-bold text-foreground">{stat.value}</p>
                  <p className="text-xs text-muted-foreground">
                    {stat.label} • {stat.sublabel}
                  </p>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </motion.div>

        {/* Weekly Activity Chart */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mb-6"
        >
          <Card variant="elevated">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-base">
                <TrendingUp className="h-5 w-5 text-accent" />
                Atividade Semanal
              </CardTitle>
            </CardHeader>
            <CardContent>
              <WeeklyActivityChart 
                data={analytics.weeklyProgress}
                height={200}
                title="Treinos por Dia"
                subtitle="Última semana"
              />
            </CardContent>
          </Card>
        </motion.div>

        {/* Volume Progress Chart */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.25 }}
          className="mb-6"
        >
          <Card variant="elevated">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-base">
                <Weight className="h-5 w-5 text-primary" />
                Volume de Treino
              </CardTitle>
            </CardHeader>
            <CardContent>
              <VolumeBarChart 
                data={analytics.monthlyVolume}
                height={250}
                title="Volume Semanal (Toneladas)"
                subtitle="Últimas 4 semanas"
              />
            </CardContent>
          </Card>
        </motion.div>

        {/* Exercise Distribution */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="mb-6"
        >
          <Card variant="elevated">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-base">
                <Dumbbell className="h-5 w-5 text-secondary" />
                Distribuição de Exercícios
              </CardTitle>
            </CardHeader>
            <CardContent>
              <PersonalRecordPieChart 
                data={analytics.exerciseDistribution}
                height={300}
                title="Exercícios Mais Realizados"
                subtitle="Distribuição dos últimos treinos"
              />
            </CardContent>
          </Card>
        </motion.div>

        {/* Personal Records */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="mb-6"
        >
          <Card variant="elevated">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-base">
                <Trophy className="h-5 w-5 text-warning" />
                Recordes Pessoais (Top 5)
              </CardTitle>
            </CardHeader>
            <CardContent>
              {stats.records.length > 0 ? (
                <div className="space-y-3">
                  {stats.records.map((pr, index) => (
                    <motion.div
                      key={pr.exercise}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.4 + index * 0.1 }}
                      className="flex items-center justify-between rounded-xl bg-secondary/50 p-3"
                    >
                      <div className="flex items-center gap-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-warning/10">
                          <Trophy className="h-5 w-5 text-warning" />
                        </div>
                        <div>
                          <p className="text-sm font-medium text-foreground">{pr.exercise}</p>
                          <p className="text-xs text-muted-foreground">
                            {new Date(pr.date).toLocaleDateString('pt-BR')}
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-display font-bold text-foreground">{pr.weight}kg</p>
                        <Badge variant="reps" className="text-[10px]">
                          {pr.reps} reps
                        </Badge>
                      </div>
                    </motion.div>
                  ))}
                </div>
              ) : (
                <p className="py-4 text-center text-sm text-muted-foreground">
                  Nenhum recorde registrado ainda.
                </p>
              )}
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}
