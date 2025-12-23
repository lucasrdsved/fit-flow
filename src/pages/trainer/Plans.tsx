import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Plus, Search, Calendar, Dumbbell, MoreVertical, Trash2, Edit } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { useTrainerTemplates } from '@/hooks/useTrainerData';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';
import { EmptyState } from '@/components/ui/EmptyState';
import { useState } from 'react';

export default function TrainerPlans() {
  const navigate = useNavigate();
  const { data: plans, isLoading } = useTrainerTemplates();
  const [searchQuery, setSearchQuery] = useState('');

  const filteredPlans =
    plans?.filter((plan) => plan.title.toLowerCase().includes(searchQuery.toLowerCase())) || [];

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <LoadingSpinner size="lg" text="Carregando planos..." />
      </div>
    );
  }

  return (
    <div className="min-h-screen p-6 lg:p-8">
      {/* Header */}
      <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="font-display text-2xl font-bold text-foreground lg:text-3xl">
              Planos de Treino
            </h1>
            <p className="mt-1 text-muted-foreground">
              Gerencie seus modelos de treino para atribuir aos alunos
            </p>
          </div>
          <Button variant="default" size="lg" onClick={() => navigate('/trainer/plans/new')}>
            <Plus className="mr-2 h-4 w-4" />
            Novo Plano
          </Button>
        </div>
      </motion.div>

      {/* Search */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="mb-6"
      >
        <div className="relative">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Buscar planos..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
      </motion.div>

      {/* Plans Grid */}
      {filteredPlans.length > 0 ? (
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
          {filteredPlans.map((plan, index) => (
            <motion.div
              key={plan.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 + index * 0.05 }}
            >
              <Card variant="interactive" className="h-full">
                <CardHeader className="flex flex-row items-start justify-between pb-2">
                  <div className="space-y-1">
                    <CardTitle className="text-base font-semibold">{plan.title}</CardTitle>
                    <p className="text-xs text-muted-foreground">
                      {new Date(plan.created_at).toLocaleDateString('pt-BR')}
                    </p>
                  </div>
                  <Button variant="ghost" size="icon-sm">
                    <MoreVertical className="h-4 w-4" />
                  </Button>
                </CardHeader>
                <CardContent>
                  <div className="mb-4 flex items-center gap-4 text-sm text-muted-foreground">
                    <div className="flex items-center gap-1.5">
                      <Dumbbell className="h-4 w-4" />
                      <span>{plan.exercises?.length || 0} exercícios</span>
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      className="flex-1"
                      onClick={() => navigate(`/trainer/plans/${plan.id}`)}
                    >
                      <Edit className="mr-2 h-3 w-3" />
                      Editar
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-destructive hover:bg-destructive/10 hover:text-destructive"
                    >
                      <Trash2 className="h-3 w-3" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      ) : (
        <EmptyState
          icon={Calendar}
          title="Nenhum plano encontrado"
          description={
            searchQuery
              ? 'Tente buscar por outro termo'
              : 'Crie seu primeiro modelo de treino para agilizar o processo.'
          }
          action={
            !searchQuery
              ? {
                  label: 'Criar Plano',
                  onClick: () => navigate('/trainer/plans/new'),
                }
              : undefined
          }
        />
      )}
    </div>
  );
}
