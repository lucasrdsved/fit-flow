import { useState } from "react";
import { motion } from "framer-motion";
import { 
  Plus, 
  Search, 
  Filter, 
  MoreVertical,
  Mail,
  Phone,
  Calendar,
  TrendingUp
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Link } from "react-router-dom";

// Mock students data
const mockStudents = [
  {
    id: "1",
    name: "Maria Silva",
    email: "maria@email.com",
    phone: "(11) 99999-1234",
    avatar: null,
    plan: "Hipertrofia - Avançado",
    lastWorkout: "Hoje, 10:30",
    nextSession: "Amanhã, 14:00",
    progress: 85,
    streak: 12,
    status: "active",
    joinedAt: "2024-01-15",
  },
  {
    id: "2",
    name: "João Santos",
    email: "joao@email.com",
    phone: "(11) 99999-5678",
    avatar: null,
    plan: "Emagrecimento",
    lastWorkout: "Ontem, 18:00",
    nextSession: "Hoje, 16:00",
    progress: 72,
    streak: 5,
    status: "active",
    joinedAt: "2024-02-20",
  },
  {
    id: "3",
    name: "Ana Costa",
    email: "ana@email.com",
    phone: "(11) 99999-9012",
    avatar: null,
    plan: "Iniciante Full Body",
    lastWorkout: "3 dias atrás",
    nextSession: "Amanhã, 09:00",
    progress: 45,
    streak: 0,
    status: "inactive",
    joinedAt: "2024-03-01",
  },
  {
    id: "4",
    name: "Pedro Lima",
    email: "pedro@email.com",
    phone: "(11) 99999-3456",
    avatar: null,
    plan: "Força - Intermediário",
    lastWorkout: "Hoje, 08:00",
    nextSession: "Sexta, 10:00",
    progress: 90,
    streak: 21,
    status: "active",
    joinedAt: "2023-11-10",
  },
  {
    id: "5",
    name: "Carla Oliveira",
    email: "carla@email.com",
    phone: "(11) 99999-7890",
    avatar: null,
    plan: "Condicionamento",
    lastWorkout: "Ontem, 07:00",
    nextSession: "Hoje, 19:00",
    progress: 68,
    streak: 8,
    status: "active",
    joinedAt: "2024-01-28",
  },
];

export default function TrainerStudents() {
  const [searchQuery, setSearchQuery] = useState("");
  const [filter, setFilter] = useState<"all" | "active" | "inactive">("all");

  const filteredStudents = mockStudents.filter((student) => {
    const matchesSearch = student.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      student.email.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesFilter = filter === "all" || student.status === filter;
    return matchesSearch && matchesFilter;
  });

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
              Alunos
            </h1>
            <p className="text-muted-foreground mt-1">
              Gerencie seus {mockStudents.length} alunos
            </p>
          </div>
          <Link to="/trainer/students/new">
            <Button variant="default" size="lg">
              <Plus className="h-4 w-4 mr-2" />
              Novo Aluno
            </Button>
          </Link>
        </div>
      </motion.div>

      {/* Search and Filters */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="flex flex-col sm:flex-row gap-4 mb-6"
      >
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Buscar por nome ou email..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
        <div className="flex gap-2">
          <Button
            variant={filter === "all" ? "default" : "outline"}
            size="sm"
            onClick={() => setFilter("all")}
          >
            Todos
          </Button>
          <Button
            variant={filter === "active" ? "default" : "outline"}
            size="sm"
            onClick={() => setFilter("active")}
          >
            Ativos
          </Button>
          <Button
            variant={filter === "inactive" ? "default" : "outline"}
            size="sm"
            onClick={() => setFilter("inactive")}
          >
            Inativos
          </Button>
          <Button variant="outline" size="icon">
            <Filter className="h-4 w-4" />
          </Button>
        </div>
      </motion.div>

      {/* Students Grid */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
        className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4"
      >
        {filteredStudents.map((student, index) => (
          <motion.div
            key={student.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 + index * 0.05 }}
          >
            <Card variant="interactive" className="h-full">
              <CardContent className="p-5">
                {/* Header */}
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="h-12 w-12 rounded-full bg-gradient-primary flex items-center justify-center text-primary-foreground font-semibold">
                      {student.name.split(' ').map(n => n[0]).join('')}
                    </div>
                    <div>
                      <h3 className="font-semibold text-foreground">{student.name}</h3>
                      <p className="text-sm text-muted-foreground">{student.plan}</p>
                    </div>
                  </div>
                  <Button variant="ghost" size="icon-sm">
                    <MoreVertical className="h-4 w-4" />
                  </Button>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-3 gap-3 mb-4">
                  <div className="text-center p-2 rounded-lg bg-secondary/50">
                    <p className="text-lg font-bold text-foreground">{student.progress}%</p>
                    <p className="text-[10px] text-muted-foreground uppercase tracking-wide">Progresso</p>
                  </div>
                  <div className="text-center p-2 rounded-lg bg-secondary/50">
                    <p className="text-lg font-bold text-accent">{student.streak}</p>
                    <p className="text-[10px] text-muted-foreground uppercase tracking-wide">Streak</p>
                  </div>
                  <div className="text-center p-2 rounded-lg bg-secondary/50">
                    <Badge variant={student.status === 'active' ? 'active' : 'inactive'} className="text-[10px]">
                      {student.status === 'active' ? 'Ativo' : 'Inativo'}
                    </Badge>
                  </div>
                </div>

                {/* Info */}
                <div className="space-y-2 text-sm mb-4">
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Mail className="h-3.5 w-3.5" />
                    <span className="truncate">{student.email}</span>
                  </div>
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Calendar className="h-3.5 w-3.5" />
                    <span>Próxima: {student.nextSession}</span>
                  </div>
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <TrendingUp className="h-3.5 w-3.5" />
                    <span>Último treino: {student.lastWorkout}</span>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex gap-2">
                  <Link to={`/trainer/students/${student.id}`} className="flex-1">
                    <Button variant="outline" size="sm" className="w-full">
                      Ver Detalhes
                    </Button>
                  </Link>
                  <Button variant="default" size="sm" className="flex-1">
                    Agendar Sessão
                  </Button>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </motion.div>

      {/* Empty State */}
      {filteredStudents.length === 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center py-16"
        >
          <div className="h-16 w-16 rounded-full bg-muted flex items-center justify-center mx-auto mb-4">
            <Search className="h-8 w-8 text-muted-foreground" />
          </div>
          <h3 className="text-lg font-semibold text-foreground mb-2">
            Nenhum aluno encontrado
          </h3>
          <p className="text-muted-foreground mb-4">
            Tente ajustar os filtros ou buscar por outro termo
          </p>
          <Button variant="outline" onClick={() => { setSearchQuery(""); setFilter("all"); }}>
            Limpar Filtros
          </Button>
        </motion.div>
      )}
    </div>
  );
}
