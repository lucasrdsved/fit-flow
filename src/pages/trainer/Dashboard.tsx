import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { 
  Users, 
  Calendar, 
  TrendingUp, 
  CheckCircle, 
  Clock, 
  ArrowUpRight,
  Plus,
  LogOut
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Link } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { useTrainerStudents, useTrainerStats } from "@/hooks/useTrainerData";
import { LoadingSpinner } from "@/components/ui/LoadingSpinner";
import { useToast } from "@/hooks/use-toast";

export default function TrainerDashboard() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { profile, signOut, userType } = useAuth();
  const { data: students, isLoading: studentsLoading } = useTrainerStudents();
  const { data: stats } = useTrainerStats();

  // Use mock data for demo mode
  const isMockMode = userType && !studentsLoading && (!students || students.length === 0);

  const displayStats = [
    { 
      label: "Alunos Ativos", 
      value: stats?.studentsCount?.toString() || (isMockMode ? "24" : "0"), 
      icon: Users, 
      change: "+3", 
      changeType: "positive" as const 
    },
    { 
      label: "Treinos Criados", 
      value: stats?.workoutsCount?.toString() || (isMockMode ? "48" : "0"), 
      icon: Calendar, 
      change: "2 novos", 
      changeType: "neutral" as const 
    },
    { 
      label: "Sessões Semana", 
      value: stats?.weeklyCompletions?.toString() || (isMockMode ? "32" : "0"), 
      icon: CheckCircle, 
      change: "+5", 
      changeType: "positive" as const 
    },
    { 
      label: "Horas Trabalhadas", 
      value: "32h", 
      icon: Clock, 
      change: "Esta semana", 
      changeType: "neutral" as const 
    },
  ];

  const displayStudents = isMockMode ? [
    { id: "1", name: "Maria Silva", email: "maria@email.com", created_at: "2024-01-15" },
    { id: "2", name: "João Santos", email: "joao@email.com", created_at: "2024-02-20" },
    { id: "3", name: "Ana Costa", email: "ana@email.com", created_at: "2024-03-01" },
    { id: "4", name: "Pedro Lima", email: "pedro@email.com", created_at: "2023-11-10" },
  ] : (students?.slice(0, 4) || []);

  const upcomingSessions = [
    { id: "1", student: "Maria Silva", time: "14:00", plan: "Treino A - Peito e Tríceps" },
    { id: "2", student: "Carlos Souza", time: "15:30", plan: "Treino B - Costas e Bíceps" },
    { id: "3", student: "Fernanda Dias", time: "17:00", plan: "Treino C - Pernas" },
  ];

  const handleLogout = async () => {
    try {
      await signOut();
      toast({
        title: "Logout realizado",
        description: "Até logo!",
      });
      navigate("/", { replace: true });
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Erro ao sair",
        description: "Tente novamente.",
      });
    }
  };

  if (studentsLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner size="lg" text="Carregando dashboard..." />
      </div>
    );
  }

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
              Bem-vindo de volta, {profile?.name || "Personal"}! Aqui está o resumo do seu dia.
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
            <Button variant="ghost" size="icon" onClick={handleLogout} title="Sair">
              <LogOut className="h-4 w-4" />
            </Button>
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
        {displayStats.map((stat, index) => (
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
                      stat.changeType === 'positive' ? 'text-success' : 'text-muted-foreground'
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
                {displayStudents.map((student) => (
                  <div
                    key={student.id}
                    className="flex items-center justify-between p-3 rounded-xl bg-secondary/50 hover:bg-secondary transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 rounded-full bg-gradient-primary flex items-center justify-center text-primary-foreground font-semibold text-sm">
                        {student.name.split(' ').map(n => n[0]).join('').slice(0, 2)}
                      </div>
                      <div>
                        <p className="font-medium text-foreground">{student.name}</p>
                        <p className="text-xs text-muted-foreground">{student.email}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="hidden sm:flex flex-col items-end">
                        <span className="text-sm font-medium text-foreground">85%</span>
                        <div className="w-16 h-1.5 bg-muted rounded-full overflow-hidden">
                          <div 
                            className="h-full bg-gradient-accent rounded-full transition-all"
                            style={{ width: `85%` }}
                          />
                        </div>
                      </div>
                      <Badge variant="active">Ativo</Badge>
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

      {/* Quick Stats Chart */}
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
            <div className="h-48 flex items-center justify-center">
              <div className="flex items-end gap-2 h-32">
                {[40, 65, 50, 80, 75, 90, 60].map((height, i) => (
                  <motion.div
                    key={i}
                    initial={{ height: 0 }}
                    animate={{ height: `${height}%` }}
                    transition={{ delay: 0.6 + i * 0.1, duration: 0.5 }}
                    className="w-8 bg-gradient-accent rounded-t-lg"
                  />
                ))}
              </div>
            </div>
            <div className="flex justify-between text-xs text-muted-foreground mt-2">
              <span>Seg</span>
              <span>Ter</span>
              <span>Qua</span>
              <span>Qui</span>
              <span>Sex</span>
              <span>Sáb</span>
              <span>Dom</span>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}
