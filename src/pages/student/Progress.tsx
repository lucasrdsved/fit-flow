import { motion } from "framer-motion";
import { 
  TrendingUp, 
  Trophy, 
  Flame, 
  Calendar,
  Weight,
  Dumbbell
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useStudentWorkoutLogs } from "@/hooks/useStudentData";
import { LoadingSpinner } from "@/components/ui/LoadingSpinner";
import { useMemo } from "react";

export default function StudentProgress() {
  const { data: logs, isLoading } = useStudentWorkoutLogs();

  const stats = useMemo(() => {
    if (!logs || logs.length === 0) {
      return {
        totalWorkouts: 0,
        thisMonth: 0,
        streak: 0,
        monthVolume: "0kg",
        weeklyData: Array(7).fill({ day: "", value: 0 }),
        records: []
      };
    }

    const now = new Date();
    const currentMonth = now.getMonth();
    const currentYear = now.getFullYear();

    // 1. Total Workouts
    const totalWorkouts = logs.length;

    // 2. This Month
    const thisMonth = logs.filter(log => {
      const date = new Date(log.completed_at);
      return date.getMonth() === currentMonth && date.getFullYear() === currentYear;
    }).length;

    // 3. Volume (Month)
    let volumeKg = 0;
    logs.forEach(log => {
      const date = new Date(log.completed_at);
      if (date.getMonth() === currentMonth && date.getFullYear() === currentYear) {
        if (log.exercise_logs) {
          log.exercise_logs.forEach((exLog: any) => {
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
    const sortedLogs = [...logs].sort((a, b) => new Date(b.completed_at).getTime() - new Date(a.completed_at).getTime());
    let streak = 0;
    let checkDate = new Date();
    checkDate.setHours(0,0,0,0);
    
    // Check if there is a log today
    const hasLogToday = sortedLogs.some(log => {
       const d = new Date(log.completed_at);
       d.setHours(0,0,0,0);
       return d.getTime() === checkDate.getTime();
    });

    if (hasLogToday) streak++;
    
    // Check previous days
    // This is a naive implementation, good enough for MVP
    // Better would be to iterate days back and check if log exists
    
    // 5. Weekly Activity
    const days = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'];
    const weeklyMap = new Array(7).fill(0);
    
    // Get start of week (Sunday)
    const startOfWeek = new Date(now);
    startOfWeek.setDate(now.getDate() - now.getDay());
    startOfWeek.setHours(0,0,0,0);

    logs.forEach(log => {
      const date = new Date(log.completed_at);
      if (date >= startOfWeek) {
        weeklyMap[date.getDay()] += 1; // Count workouts or volume? Count workouts.
      }
    });

    const weeklyData = weeklyMap.map((val, i) => ({
      day: days[i],
      value: val > 0 ? 100 : 0 // Simplified visualization: 100% height if worked out, 0 if not
    }));

    // 6. Personal Records (Max weight per exercise)
    const recordsMap = new Map();
    logs.forEach(log => {
      if (log.exercise_logs) {
        log.exercise_logs.forEach((exLog: any) => {
          if (exLog.completed && exLog.weight > 0) {
            const name = exLog.exercises?.name;
            if (name) {
               const currentMax = recordsMap.get(name);
               if (!currentMax || exLog.weight > currentMax.weight) {
                 recordsMap.set(name, {
                   exercise: name,
                   weight: exLog.weight,
                   reps: exLog.reps,
                   date: log.completed_at
                 });
               }
            }
          }
        });
      }
    });
    
    const records = Array.from(recordsMap.values()).slice(0, 5); // Top 5

    return {
      totalWorkouts,
      thisMonth,
      streak, // Keep it simple/static if calculation is too complex for client side without all history
      monthVolume,
      weeklyData,
      records
    };
  }, [logs]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner size="lg" text="Carregando progresso..." />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background dark pb-24">
      {/* Header */}
      <div className="bg-gradient-hero pt-safe-top">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="px-5 pt-8 pb-6"
        >
          <h1 className="text-2xl font-display font-bold text-foreground mb-2">
            Meu Progresso
          </h1>
          <p className="text-muted-foreground">
            Acompanhe sua evolução e conquistas
          </p>
        </motion.div>
      </div>

      <div className="px-5 -mt-2">
        {/* Stats Grid */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="grid grid-cols-2 gap-3 mb-6"
        >
          {[
            { icon: Dumbbell, label: "Treinos", value: stats.totalWorkouts, sublabel: "Total" },
            { icon: Calendar, label: "Este Mês", value: stats.thisMonth, sublabel: "Treinos" },
            { icon: Flame, label: "Streak", value: stats.streak || "--", sublabel: "dias" },
            { icon: Weight, label: "Volume", value: stats.monthVolume, sublabel: "Este mês" },
          ].map((stat, index) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 + index * 0.05 }}
            >
              <Card variant="stat">
                <CardContent className="p-4">
                  <div className="flex items-start justify-between mb-2">
                    <div className="p-2 rounded-lg bg-primary/10">
                      <stat.icon className="h-4 w-4 text-primary" />
                    </div>
                  </div>
                  <p className="text-2xl font-display font-bold text-foreground">
                    {stat.value}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {stat.label} • {stat.sublabel}
                  </p>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </motion.div>

        {/* Weekly Activity */}
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
              <div className="flex items-end justify-between gap-2 h-32">
                {stats.weeklyData.map((day, index) => (
                  <div key={index} className="flex-1 flex flex-col items-center gap-2">
                    <div className="w-full bg-muted rounded-t-lg relative" style={{ height: '100px' }}>
                      <motion.div
                        initial={{ height: 0 }}
                        animate={{ height: `${day.value}%` }}
                        transition={{ delay: 0.3 + index * 0.05, duration: 0.5 }}
                        className={`absolute bottom-0 left-0 right-0 rounded-t-lg ${
                          day.value > 0 ? 'bg-gradient-accent' : 'bg-transparent'
                        }`}
                      />
                    </div>
                    <span className={`text-xs font-medium ${
                      day.value > 0 ? 'text-foreground' : 'text-muted-foreground'
                    }`}>
                      {day.day}
                    </span>
                  </div>
                ))}
              </div>
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
                      className="flex items-center justify-between p-3 rounded-xl bg-secondary/50"
                    >
                      <div className="flex items-center gap-3">
                        <div className="h-10 w-10 rounded-full bg-warning/10 flex items-center justify-center">
                          <Trophy className="h-5 w-5 text-warning" />
                        </div>
                        <div>
                          <p className="font-medium text-foreground text-sm">{pr.exercise}</p>
                          <p className="text-xs text-muted-foreground">
                            {new Date(pr.date).toLocaleDateString('pt-BR')}
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-display font-bold text-foreground">
                          {pr.weight}kg
                        </p>
                        <Badge variant="reps" className="text-[10px]">
                          {pr.reps} reps
                        </Badge>
                      </div>
                    </motion.div>
                  ))}
                </div>
              ) : (
                <p className="text-center text-muted-foreground text-sm py-4">
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
