import { motion } from "framer-motion";
import { 
  Users, 
  Calendar, 
  TrendingUp, 
  CheckCircle, 
  Clock, 
  ArrowUpRight,
  Plus
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Link } from "react-router-dom";

// Mock data
const stats = [
  { label: "Alunos Ativos", value: "24", icon: Users, change: "+3", changeType: "positive" },
  { label: "Sessões Hoje", value: "8", icon: Calendar, change: "2 pendentes", changeType: "neutral" },
  { label: "Taxa de Conclusão", value: "87%", icon: CheckCircle, change: "+5%", changeType: "positive" },
  { label: "Horas Esta Semana", value: "32h", icon: Clock, change: "-2h", changeType: "negative" },
];

const recentStudents = [
  { id: "1", name: "Maria Silva", lastWorkout: "Hoje, 10:30", status: "active", progress: 85 },
  { id: "2", name: "João Santos", lastWorkout: "Ontem, 18:00", status: "active", progress: 72 },
  { id: "3", name: "Ana Costa", lastWorkout: "2 dias atrás", status: "pending", progress: 65 },
  { id: "4", name: "Pedro Lima", lastWorkout: "Hoje, 08:00", status: "active", progress: 90 },
];

const upcomingSessions = [
  { id: "1", student: "Maria Silva", time: "14:00", plan: "Treino A - Peito e Tríceps" },
  { id: "2", student: "Carlos Souza", time: "15:30", plan: "Treino B - Costas e Bíceps" },
  { id: "3", student: "Fernanda Dias", time: "17:00", plan: "Treino C - Pernas" },
];

export default function TrainerDashboard() {
  return (
    <div className="min-h-screen p-6 lg:p-8">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl lg:text-3xl font-display font-bold text-foreground">
              Dashboard
            </h1>
            <p className="text-muted-foreground mt-1">
              Bem-vindo de volta! Aqui está o resumo do seu dia.
            </p>
          </div>
          <div className="flex gap-3">
            <Link to="/trainer/students/new">
              <Button variant="outline">
                <Plus className="h-4 w-4 mr-2" />
                Novo Aluno
              </Button>
            </Link>
            <Link to="/trainer/plans/new">
              <Button variant="default">
                <Plus className="h-4 w-4 mr-2" />
                Novo Plano
              </Button>
            </Link>
          </div>
        </div>
      </motion.div>

      {/* Stats Grid */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8"
      >
        {stats.map((stat, index) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 + index * 0.05 }}
          >
            <Card variant="stat" className="h-full">
              <CardContent className="p-5">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">{stat.label}</p>
                    <p className="text-3xl font-display font-bold text-foreground">
                      {stat.value}
                    </p>
                    <p className={`text-xs mt-1 ${
                      stat.changeType === 'positive' ? 'text-success' : 
                      stat.changeType === 'negative' ? 'text-destructive' : 
                      'text-muted-foreground'
                    }`}>
                      {stat.change}
                    </p>
                  </div>
                  <div className="p-2.5 rounded-xl bg-primary/10">
                    <stat.icon className="h-5 w-5 text-primary" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Students */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="lg:col-span-2"
        >
          <Card variant="elevated">
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="flex items-center gap-2">
                <Users className="h-5 w-5 text-primary" />
                Alunos Recentes
              </CardTitle>
              <Link to="/trainer/students">
                <Button variant="ghost" size="sm">
                  Ver todos
                  <ArrowUpRight className="h-4 w-4 ml-1" />
                </Button>
              </Link>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {recentStudents.map((student) => (
                  <div
                    key={student.id}
                    className="flex items-center justify-between p-3 rounded-xl bg-secondary/50 hover:bg-secondary transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 rounded-full bg-gradient-primary flex items-center justify-center text-primary-foreground font-semibold text-sm">
                        {student.name.split(' ').map(n => n[0]).join('')}
                      </div>
                      <div>
                        <p className="font-medium text-foreground">{student.name}</p>
                        <p className="text-xs text-muted-foreground">{student.lastWorkout}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="hidden sm:flex flex-col items-end">
                        <span className="text-sm font-medium text-foreground">{student.progress}%</span>
                        <div className="w-16 h-1.5 bg-muted rounded-full overflow-hidden">
                          <div 
                            className="h-full bg-gradient-accent rounded-full transition-all"
                            style={{ width: `${student.progress}%` }}
                          />
                        </div>
                      </div>
                      <Badge variant={student.status === 'active' ? 'active' : 'pending'}>
                        {student.status === 'active' ? 'Ativo' : 'Pendente'}
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Upcoming Sessions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <Card variant="elevated">
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="flex items-center gap-2">
                <Calendar className="h-5 w-5 text-accent" />
                Próximas Sessões
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {upcomingSessions.map((session) => (
                  <div
                    key={session.id}
                    className="p-3 rounded-xl border border-border bg-card hover:shadow-md transition-all"
                  >
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-medium text-foreground">{session.student}</span>
                      <Badge variant="sets" className="font-mono">
                        {session.time}
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground truncate">
                      {session.plan}
                    </p>
                  </div>
                ))}
              </div>
              <Link to="/trainer/calendar">
                <Button variant="outline" className="w-full mt-4">
                  Ver Agenda Completa
                </Button>
              </Link>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Quick Stats Chart Placeholder */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="mt-6"
      >
        <Card variant="elevated">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-success" />
              Evolução Semanal
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-48 flex items-center justify-center text-muted-foreground">
              <div className="text-center">
                <TrendingUp className="h-12 w-12 mx-auto mb-2 opacity-30" />
                <p className="text-sm">Gráfico de evolução será exibido aqui</p>
                <p className="text-xs mt-1">Conecte o Lovable Cloud para persistir dados</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}
