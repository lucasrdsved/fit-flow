import { useState } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { 
  Plus, 
  Search, 
  Filter, 
  MoreVertical,
  Mail,
  Phone,
  Calendar,
  TrendingUp,
  Users
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Link } from "react-router-dom";
import { useTrainerStudents } from "@/hooks/useTrainerData";
import { LoadingSpinner } from "@/components/ui/LoadingSpinner";
import { EmptyState } from "@/components/ui/EmptyState";
import { ErrorState } from "@/components/ui/ErrorState";
import { useAuth } from "@/contexts/AuthContext";

// Mock students for demo
const mockStudents = [
  {
    id: "1",
    name: "Maria Silva",
    email: "maria@email.com",
    phone: "(11) 99999-1234",
    goal: "Hipertrofia - Avançado",
    created_at: "2024-01-15",
  },
  {
    id: "2",
    name: "João Santos",
    email: "joao@email.com",
    phone: "(11) 99999-5678",
    goal: "Emagrecimento",
    created_at: "2024-02-20",
  },
  {
    id: "3",
    name: "Ana Costa",
    email: "ana@email.com",
    phone: "(11) 99999-9012",
    goal: "Iniciante Full Body",
    created_at: "2024-03-01",
  },
  {
    id: "4",
    name: "Pedro Lima",
    email: "pedro@email.com",
    phone: "(11) 99999-3456",
    goal: "Força - Intermediário",
    created_at: "2023-11-10",
  },
  {
    id: "5",
    name: "Carla Oliveira",
    email: "carla@email.com",
    phone: "(11) 99999-7890",
    goal: "Condicionamento",
    created_at: "2024-01-28",
  },
];

export default function TrainerStudents() {
  const navigate = useNavigate();
  const { userType } = useAuth();
  const { data: students, isLoading, error, refetch } = useTrainerStudents();
  const [searchQuery, setSearchQuery] = useState("");
  const [filter, setFilter] = useState<"all" | "active" | "inactive">("all");

  // Use mock data for demo mode
  const isMockMode = userType && !isLoading && (!students || students.length === 0);
  const displayStudents = isMockMode ? mockStudents : (students || []);

  const filteredStudents = displayStudents.filter((student) => {
    const matchesSearch = student.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      student.email.toLowerCase().includes(searchQuery.toLowerCase());
    
    // Logic for status filtering
    // Since we don't have a status field in the DB yet, we assume all students are active.
    // 'active' -> show all (matchesSearch)
    // 'inactive' -> show none
    // 'all' -> show all
    const matchesFilter = filter === "all" ? true :
                         filter === "active" ? true :
                         false; // filter === "inactive"

    return matchesSearch && matchesFilter;
  });

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner size="lg" text="Carregando alunos..." />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen p-6">
        <ErrorState onRetry={() => refetch()} />
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
              Alunos
            </h1>
            <p className="text-muted-foreground mt-1">
              Gerencie seus {filteredStudents.length} alunos
            </p>
          </div>
          <Button 
            variant="default" 
            size="lg"
            onClick={() => navigate("/trainer/students/new")}
          >
            <Plus className="h-4 w-4 mr-2" />
            Novo Aluno
          </Button>
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
      {filteredStudents.length > 0 ? (
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
                        {student.name.split(' ').map(n => n[0]).join('').slice(0, 2)}
                      </div>
                      <div>
                        <h3 className="font-semibold text-foreground">{student.name}</h3>
                        <p className="text-sm text-muted-foreground">{student.goal || "Sem plano"}</p>
                      </div>
                    </div>
                    <Button variant="ghost" size="icon-sm">
                      <MoreVertical className="h-4 w-4" />
                    </Button>
                  </div>

                  {/* Stats */}
                  <div className="grid grid-cols-3 gap-3 mb-4">
                    <div className="text-center p-2 rounded-lg bg-secondary/50">
                      <p className="text-lg font-bold text-foreground">85%</p>
                      <p className="text-[10px] text-muted-foreground uppercase tracking-wide">Progresso</p>
                    </div>
                    <div className="text-center p-2 rounded-lg bg-secondary/50">
                      <p className="text-lg font-bold text-accent">12</p>
                      <p className="text-[10px] text-muted-foreground uppercase tracking-wide">Streak</p>
                    </div>
                    <div className="text-center p-2 rounded-lg bg-secondary/50">
                      <Badge variant="active" className="text-[10px]">
                        Ativo
                      </Badge>
                    </div>
                  </div>

                  {/* Info */}
                  <div className="space-y-2 text-sm mb-4">
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <Mail className="h-3.5 w-3.5" />
                      <span className="truncate">{student.email}</span>
                    </div>
                    {student.phone && (
                      <div className="flex items-center gap-2 text-muted-foreground">
                        <Phone className="h-3.5 w-3.5" />
                        <span>{student.phone}</span>
                      </div>
                    )}
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <Calendar className="h-3.5 w-3.5" />
                      <span>Desde {new Date(student.created_at).toLocaleDateString('pt-BR')}</span>
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
                      Criar Treino
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </motion.div>
      ) : (
        <EmptyState
          icon={Users}
          title="Nenhum aluno encontrado"
          description={searchQuery ? "Tente ajustar os filtros ou buscar por outro termo" : "Comece adicionando seu primeiro aluno"}
          action={searchQuery ? {
            label: "Limpar Filtros",
            onClick: () => { setSearchQuery(""); setFilter("all"); }
          } : {
            label: "Adicionar Aluno",
            onClick: () => navigate("/trainer/students/new")
          }}
        />
      )}
    </div>
  );
}
