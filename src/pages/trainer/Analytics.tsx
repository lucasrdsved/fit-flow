import { motion } from 'framer-motion';
import { TrendingUp, Users, Target, Award, BarChart3, PieChart } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useTrainerStudents, useTrainerWorkouts } from '@/hooks/useTrainerData';
import { useStudentWorkoutLogs } from '@/hooks/useStudentData';
import { useTrainerAnalytics } from '@/hooks/useAnalytics';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';
import { 
  ProgressLineChart, 
  VolumeBarChart, 
  WeeklyActivityChart,
  PersonalRecordPieChart 
} from '@/components/analytics/Charts';

export default function TrainerAnalytics() {
  const { data: students, isLoading: studentsLoading } = useTrainerStudents();
  const { data: workouts, isLoading: workoutsLoading } = useTrainerWorkouts();
  const { data: allLogs, isLoading: logsLoading } = useStudentWorkoutLogs();
  const analytics = useTrainerAnalytics(students || [], allLogs || []);

  if (studentsLoading || workoutsLoading || logsLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <LoadingSpinner size="lg" text="Carregando analytics..." />
      </div>
    );
  }

  const totalStudents = students?.length || 0;
  const activeStudents = students?.filter(s => s.status === 'active').length || 0;
  const totalWorkouts = allLogs?.length || 0;
  const thisMonthLogs = allLogs?.filter(log => {
    const date = new Date(log.completed_at);
    const now = new Date();
    return date.getMonth() === now.getMonth() && date.getFullYear() === now.getFullYear();
  }).length || 0;

  return (
    <div className="dark min-h-screen bg-background pb-24">
      {/* Header */}
      <div className="bg-gradient-hero pt-safe-top">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="px-5 pb-6 pt-8"
        >
          <h1 className="mb-2 font-display text-2xl font-bold text-foreground">Analytics</h1>
          <p className="text-muted-foreground">Visão geral do desempenho dos seus alunos</p>
        </motion.div>
      </div>

      <div className="-mt-2 px-5">
        {/* Key Metrics */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mb-6 grid grid-cols-2 gap-3"
        >
          {[
            { 
              icon: Users, 
              label: 'Alunos Ativos', 
              value: `${activeStudents}/${totalStudents}`, 
              sublabel: 'de alunos',
              color: 'text-primary'
            },
            { 
              icon: TrendingUp, 
              label: 'Treinos Mês', 
              value: thisMonthLogs.toString(), 
              sublabel: 'treinos realizados',
              color: 'text-accent'
            },
            { 
              icon: Target, 
              label: 'Aderência', 
              value: `${Math.round((thisMonthLogs / Math.max(totalStudents * 4, 1)) * 100)}%`, 
              sublabel: 'meta semanal',
              color: 'text-success'
            },
            { 
              icon: Award, 
              label: 'Records PRs', 
              value: analytics.personalRecords.length.toString(), 
              sublabel: 'pessoais',
              color: 'text-warning'
            },
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
                    <div className={`rounded-lg bg-primary/10 p-2 ${stat.color}`}>
                      <stat.icon className="h-4 w-4" />
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
                <BarChart3 className="h-5 w-5 text-accent" />
                Atividade Semanal - Todos os Alunos
              </CardTitle>
            </CardHeader>
            <CardContent>
              <WeeklyActivityChart 
                data={analytics.weeklyProgress}
                height={250}
                title="Treinos por Dia (Todos os Alunos)"
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
                <TrendingUp className="h-5 w-5 text-primary" />
                Volume Total de Treinos
              </CardTitle>
            </CardHeader>
            <CardContent>
              <VolumeBarChart 
                data={analytics.monthlyVolume}
                height={280}
                title="Volume Semanal (Toneladas)"
                subtitle="Todas as turmas combinadas"
              />
            </CardContent>
          </Card>
        </motion.div>

        {/* Exercise Distribution and Personal Records */}
        <div className="grid gap-6 md:grid-cols-2">
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
                  <PieChart className="h-5 w-5 text-secondary" />
                  Exercícios Mais Populares
                </CardTitle>
              </CardHeader>
              <CardContent>
                <PersonalRecordPieChart 
                  data={analytics.exerciseDistribution}
                  height={250}
                  title="Distribuição de Exercícios"
                  subtitle="Entre todos os alunos"
                />
              </CardContent>
            </Card>
          </motion.div>

          {/* Personal Records */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.35 }}
            className="mb-6"
          >
            <Card variant="elevated">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-base">
                  <Award className="h-5 w-5 text-warning" />
                  Records Pessoais da Turma
                </CardTitle>
              </CardHeader>
              <CardContent>
                {analytics.personalRecords.length > 0 ? (
                  <div className="space-y-3">
                    {analytics.personalRecords.map((pr, index) => (
                      <motion.div
                        key={pr.exercise}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.4 + index * 0.1 }}
                        className="flex items-center justify-between rounded-xl bg-secondary/50 p-3"
                      >
                        <div className="flex items-center gap-3">
                          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-warning/10">
                            <Award className="h-5 w-5 text-warning" />
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

        {/* Student Performance Table */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="mb-6"
        >
          <Card variant="elevated">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-base">
                <Users className="h-5 w-5 text-primary" />
                Desempenho Individual dos Alunos
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {students?.slice(0, 5).map((student, index) => {
                  const studentLogs = allLogs?.filter(log => log.student_id === student.id) || [];
                  const thisMonthStudentLogs = studentLogs.filter(log => {
                    const date = new Date(log.completed_at);
                    const now = new Date();
                    return date.getMonth() === now.getMonth() && date.getFullYear() === now.getFullYear();
                  }).length;
                  
                  const adherenceRate = Math.round((thisMonthStudentLogs / 16) * 100); // 16 = 4 workouts/week * 4 weeks
                  
                  return (
                    <motion.div
                      key={student.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.5 + index * 0.05 }}
                      className="flex items-center justify-between rounded-xl bg-secondary/50 p-4"
                    >
                      <div className="flex items-center gap-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
                          <Users className="h-5 w-5 text-primary" />
                        </div>
                        <div>
                          <p className="text-sm font-medium text-foreground">{student.name}</p>
                          <p className="text-xs text-muted-foreground">{student.email}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-4">
                        <div className="text-right">
                          <p className="text-sm font-semibold text-foreground">{thisMonthStudentLogs}</p>
                          <p className="text-xs text-muted-foreground">treinos/mês</p>
                        </div>
                        <Badge 
                          variant={adherenceRate >= 75 ? "success" : adherenceRate >= 50 ? "warning" : "destructive"}
                          className="text-xs"
                        >
                          {adherenceRate}%
                        </Badge>
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}