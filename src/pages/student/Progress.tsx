import { motion } from "framer-motion";
import { 
  TrendingUp, 
  Trophy, 
  Flame, 
  Calendar,
  Weight,
  Dumbbell,
  ChevronRight
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

// Mock progress data
const stats = {
  totalWorkouts: 48,
  thisMonth: 12,
  streak: 12,
  longestStreak: 21,
  totalVolume: "45.2t",
  monthVolume: "12.5t",
};

const personalRecords = [
  { exercise: "Supino Reto", weight: 100, reps: 8, date: "2024-01-10" },
  { exercise: "Agachamento", weight: 140, reps: 6, date: "2024-01-08" },
  { exercise: "Levantamento Terra", weight: 160, reps: 5, date: "2024-01-05" },
  { exercise: "Desenvolvimento", weight: 60, reps: 10, date: "2024-01-03" },
];

const weeklyData = [
  { day: "Seg", value: 80 },
  { day: "Ter", value: 0 },
  { day: "Qua", value: 90 },
  { day: "Qui", value: 0 },
  { day: "Sex", value: 100 },
  { day: "Sáb", value: 75 },
  { day: "Dom", value: 0 },
];

const muscleGroups = [
  { name: "Peito", percentage: 28, color: "bg-primary" },
  { name: "Costas", percentage: 24, color: "bg-accent" },
  { name: "Pernas", percentage: 22, color: "bg-energy" },
  { name: "Ombros", percentage: 14, color: "bg-warning" },
  { name: "Braços", percentage: 12, color: "bg-success" },
];

/**
 * The student progress page.
 *
 * This component visualizes the student's workout statistics, including total workouts,
 * weekly activity, personal records, and muscle group distribution.
 *
 * Note: Currently uses mock data for visualization.
 *
 * @returns {JSX.Element} The student progress page.
 */
export default function StudentProgress() {
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
            { icon: Flame, label: "Streak", value: stats.streak, sublabel: "dias" },
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
                {weeklyData.map((day, index) => (
                  <div key={day.day} className="flex-1 flex flex-col items-center gap-2">
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
                Recordes Pessoais
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {personalRecords.map((pr, index) => (
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
            </CardContent>
          </Card>
        </motion.div>

        {/* Muscle Group Distribution */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <Card variant="elevated">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-base">
                <Dumbbell className="h-5 w-5 text-primary" />
                Distribuição por Grupo Muscular
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {muscleGroups.map((group, index) => (
                  <motion.div
                    key={group.name}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.5 + index * 0.1 }}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-sm font-medium text-foreground">{group.name}</span>
                      <span className="text-sm text-muted-foreground">{group.percentage}%</span>
                    </div>
                    <div className="h-2 bg-muted rounded-full overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${group.percentage}%` }}
                        transition={{ delay: 0.6 + index * 0.1, duration: 0.5 }}
                        className={`h-full rounded-full ${group.color}`}
                      />
                    </div>
                  </motion.div>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}
