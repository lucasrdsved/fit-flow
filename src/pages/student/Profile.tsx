import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { 
  User, 
  Mail, 
  Phone, 
  Calendar,
  Target,
  LogOut,
  Settings,
  Bell,
  ChevronRight,
  Edit2
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Link } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { useStudentRecord, useStudentMeasurements } from "@/hooks/useStudentData";
import { LoadingSpinner } from "@/components/ui/LoadingSpinner";
import { useToast } from "@/hooks/use-toast";

const menuItems = [
  { icon: Bell, label: "Notificações", href: "/student/notifications" },
  { icon: Target, label: "Meus Objetivos", href: "/student/goals" },
  { icon: Settings, label: "Configurações", href: "/student/settings" },
];

/**
 * The student profile page.
 *
 * This component displays the student's personal information, such as name, email, height, weight,
 * and contact details. It also shows their assigned personal trainer and provides options to navigate
 * to other settings or logout.
 *
 * @returns {JSX.Element} The student profile page.
 */
export default function StudentProfile() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { user, profile, signOut, userType } = useAuth();
  const { data: student, isLoading: studentLoading } = useStudentRecord();
  const { data: measurements } = useStudentMeasurements();

  const latestMeasurement = measurements?.[0];
  
  const displayName = student?.name || profile?.name || user?.user_metadata?.name || "Usuário";
  const displayEmail = student?.email || user?.email || "";
  const initials = displayName.split(' ').map((n: string) => n[0]).join('').toUpperCase().slice(0, 2);

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

  if (studentLoading && userType !== null) {
    return (
      <div className="min-h-screen bg-background dark flex items-center justify-center">
        <LoadingSpinner size="lg" text="Carregando perfil..." />
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
          className="px-5 pt-8 pb-8 text-center"
        >
          {/* Avatar */}
          <div className="relative inline-block mb-4">
            <div className="h-24 w-24 rounded-full bg-gradient-primary flex items-center justify-center text-primary-foreground text-3xl font-display font-bold shadow-glow">
              {initials}
            </div>
            <button className="absolute bottom-0 right-0 h-8 w-8 rounded-full bg-card border border-border flex items-center justify-center shadow-md">
              <Edit2 className="h-4 w-4 text-foreground" />
            </button>
          </div>
          
          <h1 className="text-2xl font-display font-bold text-foreground mb-1">
            {displayName}
          </h1>
          <p className="text-muted-foreground text-sm mb-3">
            {displayEmail}
          </p>
          {student?.goal && <Badge variant="active">{student.goal}</Badge>}
        </motion.div>
      </div>

      <div className="px-5 -mt-2">
        {/* Quick Info */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="grid grid-cols-2 gap-3 mb-6"
        >
          <Card variant="stat">
            <CardContent className="p-4 text-center">
              <p className="text-2xl font-display font-bold text-foreground">
                {latestMeasurement?.height || student?.height || "--"}cm
              </p>
              <p className="text-xs text-muted-foreground">Altura</p>
            </CardContent>
          </Card>
          <Card variant="stat">
            <CardContent className="p-4 text-center">
              <p className="text-2xl font-display font-bold text-foreground">
                {latestMeasurement?.weight || student?.weight || "--"}kg
              </p>
              <p className="text-xs text-muted-foreground">Peso Atual</p>
            </CardContent>
          </Card>
        </motion.div>

        {/* Trainer Info - Show if student has personal */}
        {student && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="mb-6"
          >
            <Card variant="elevated">
              <CardContent className="p-4">
                <div className="flex items-center gap-4">
                  <div className="h-14 w-14 rounded-full bg-gradient-accent flex items-center justify-center text-accent-foreground font-semibold">
                    PT
                  </div>
                  <div className="flex-1">
                    <p className="text-xs text-muted-foreground mb-0.5">Meu Personal</p>
                    <p className="font-semibold text-foreground">Personal Trainer</p>
                    <p className="text-sm text-muted-foreground">
                      Desde {new Date(student.created_at).toLocaleDateString('pt-BR')}
                    </p>
                  </div>
                  <Button variant="outline" size="sm">
                    Contato
                  </Button>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}

        {/* Contact Info */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="mb-6"
        >
          <Card variant="elevated">
            <CardContent className="p-4 space-y-4">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-primary/10">
                  <Mail className="h-4 w-4 text-primary" />
                </div>
                <div className="flex-1">
                  <p className="text-xs text-muted-foreground">Email</p>
                  <p className="text-sm font-medium text-foreground">{displayEmail}</p>
                </div>
              </div>
              {student?.phone && (
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-accent/10">
                    <Phone className="h-4 w-4 text-accent" />
                  </div>
                  <div className="flex-1">
                    <p className="text-xs text-muted-foreground">Telefone</p>
                    <p className="text-sm font-medium text-foreground">{student.phone}</p>
                  </div>
                </div>
              )}
              {student?.goal && (
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-energy/10">
                    <Target className="h-4 w-4 text-energy" />
                  </div>
                  <div className="flex-1">
                    <p className="text-xs text-muted-foreground">Objetivo</p>
                    <p className="text-sm font-medium text-foreground">{student.goal}</p>
                  </div>
                </div>
              )}
              {student?.birth_date && (
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-warning/10">
                    <Calendar className="h-4 w-4 text-warning" />
                  </div>
                  <div className="flex-1">
                    <p className="text-xs text-muted-foreground">Data de Nascimento</p>
                    <p className="text-sm font-medium text-foreground">
                      {new Date(student.birth_date).toLocaleDateString('pt-BR')}
                    </p>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </motion.div>

        {/* Menu Items */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="mb-6"
        >
          <Card variant="elevated">
            <CardContent className="p-2">
              {menuItems.map((item, index) => (
                <Link
                  key={item.href}
                  to={item.href}
                  className="flex items-center justify-between p-3 rounded-xl hover:bg-secondary transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-muted">
                      <item.icon className="h-4 w-4 text-foreground" />
                    </div>
                    <span className="font-medium text-foreground">{item.label}</span>
                  </div>
                  <ChevronRight className="h-4 w-4 text-muted-foreground" />
                </Link>
              ))}
            </CardContent>
          </Card>
        </motion.div>

        {/* Logout */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          <Button 
            variant="outline" 
            className="w-full" 
            size="lg"
            onClick={handleLogout}
          >
            <LogOut className="h-4 w-4 mr-2" />
            Sair da Conta
          </Button>
        </motion.div>
      </div>
    </div>
  );
}
