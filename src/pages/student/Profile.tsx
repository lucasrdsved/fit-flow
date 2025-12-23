import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
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
  Edit2,
} from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Link } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { useStudentRecord, useStudentMeasurements } from '@/hooks/useStudentData';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';
import { useToast } from '@/hooks/use-toast';

const menuItems = [
  { icon: Bell, label: 'Notificações', href: '/student/notifications' },
  { icon: Target, label: 'Meus Objetivos', href: '/student/goals' },
  { icon: Settings, label: 'Configurações', href: '/student/settings' },
];

export default function StudentProfile() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { user, profile, signOut, userType } = useAuth();
  const { data: student, isLoading: studentLoading } = useStudentRecord();
  const { data: measurements } = useStudentMeasurements();

  const latestMeasurement = measurements?.[0];

  const displayName = student?.name || profile?.name || user?.user_metadata?.name || 'Usuário';
  const displayEmail = student?.email || user?.email || '';
  const initials = displayName
    .split(' ')
    .map((n: string) => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);

  const handleLogout = async () => {
    try {
      await signOut();
      toast({
        title: 'Logout realizado',
        description: 'Até logo!',
      });
      navigate('/', { replace: true });
    } catch (error) {
      toast({
        variant: 'destructive',
        title: 'Erro ao sair',
        description: 'Tente novamente.',
      });
    }
  };

  if (studentLoading && userType !== null) {
    return (
      <div className="dark flex min-h-screen items-center justify-center bg-background">
        <LoadingSpinner size="lg" text="Carregando perfil..." />
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
          className="px-5 pb-8 pt-8 text-center"
        >
          {/* Avatar */}
          <div className="relative mb-4 inline-block">
            <div className="bg-gradient-primary flex h-24 w-24 items-center justify-center rounded-full font-display text-3xl font-bold text-primary-foreground shadow-glow">
              {initials}
            </div>
            <button className="absolute bottom-0 right-0 flex h-8 w-8 items-center justify-center rounded-full border border-border bg-card shadow-md">
              <Edit2 className="h-4 w-4 text-foreground" />
            </button>
          </div>

          <h1 className="mb-1 font-display text-2xl font-bold text-foreground">{displayName}</h1>
          <p className="mb-3 text-sm text-muted-foreground">{displayEmail}</p>
          {student?.goal && <Badge variant="active">{student.goal}</Badge>}
        </motion.div>
      </div>

      <div className="-mt-2 px-5">
        {/* Quick Info */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mb-6 grid grid-cols-2 gap-3"
        >
          <Card variant="stat">
            <CardContent className="p-4 text-center">
              <p className="font-display text-2xl font-bold text-foreground">
                {latestMeasurement?.height || student?.height || '--'}cm
              </p>
              <p className="text-xs text-muted-foreground">Altura</p>
            </CardContent>
          </Card>
          <Card variant="stat">
            <CardContent className="p-4 text-center">
              <p className="font-display text-2xl font-bold text-foreground">
                {latestMeasurement?.weight || student?.weight || '--'}kg
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
                  <div className="bg-gradient-accent flex h-14 w-14 items-center justify-center rounded-full font-semibold text-accent-foreground">
                    PT
                  </div>
                  <div className="flex-1">
                    <p className="mb-0.5 text-xs text-muted-foreground">Meu Personal</p>
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
            <CardContent className="space-y-4 p-4">
              <div className="flex items-center gap-3">
                <div className="rounded-lg bg-primary/10 p-2">
                  <Mail className="h-4 w-4 text-primary" />
                </div>
                <div className="flex-1">
                  <p className="text-xs text-muted-foreground">Email</p>
                  <p className="text-sm font-medium text-foreground">{displayEmail}</p>
                </div>
              </div>
              {student?.phone && (
                <div className="flex items-center gap-3">
                  <div className="rounded-lg bg-accent/10 p-2">
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
                  <div className="rounded-lg bg-energy/10 p-2">
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
                  <div className="rounded-lg bg-warning/10 p-2">
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
                  className="flex items-center justify-between rounded-xl p-3 transition-colors hover:bg-secondary"
                >
                  <div className="flex items-center gap-3">
                    <div className="rounded-lg bg-muted p-2">
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
          <Button variant="outline" className="w-full" size="lg" onClick={handleLogout}>
            <LogOut className="mr-2 h-4 w-4" />
            Sair da Conta
          </Button>
        </motion.div>
      </div>
    </div>
  );
}
