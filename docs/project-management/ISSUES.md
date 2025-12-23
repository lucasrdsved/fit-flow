# 🐛 Issues e Tarefas Identificadas - FitFlow

**Data**: 2024-12-23  
**Última Atualização**: 2024-12-23  
**Total de Issues**: 45

---

## 🔴 Crítico (P0) - Bloqueia MVP

### Issue #1: Portal do Aluno - Workout Player Incompleto
**Status**: 🔴 Blocker  
**Prioridade**: P0 - Crítico  
**Estimativa**: 1-2 semanas  
**Assignee**: TBD

**Descrição**:
O workout player, que é fundamental para que alunos executem treinos, está incompleto. Sem isso, 50% do valor do produto não funciona.

**Tasks**:
- [ ] Implementar `WorkoutPlayer.tsx` component
- [ ] Timer de descanso automático
- [ ] Navegação entre exercícios (anterior/próximo)
- [ ] Interface de registro de sets (peso, reps, completado)
- [ ] Botão de finalizar treino
- [ ] Persistência local (offline-first)
- [ ] Sincronização com Supabase

**Arquivos Afetados**:
- `src/pages/student/Workout.tsx`
- `src/components/workout/WorkoutPlayer.tsx` (criar)
- `src/components/workout/ExerciseLogger.tsx` (criar)
- `src/hooks/useWorkoutExecution.ts` (criar)

---

### Issue #2: Hooks de Mutação de Workout Logs Ausentes
**Status**: 🔴 Blocker  
**Prioridade**: P0 - Crítico  
**Estimativa**: 3-5 dias  
**Assignee**: TBD

**Descrição**:
Não existem hooks para criar e atualizar workout logs e exercise logs, essenciais para o aluno registrar execução.

**Tasks**:
- [ ] Criar `src/hooks/useWorkoutLog.ts`
  - [ ] `createWorkoutLog()` mutation
  - [ ] `updateWorkoutLog()` mutation
  - [ ] `completeWorkout()` mutation
- [ ] Criar `src/hooks/useExerciseLog.ts`
  - [ ] `logExerciseSet()` mutation
  - [ ] `updateExerciseSet()` mutation
- [ ] Implementar invalidação correta de queries
- [ ] Adicionar optimistic updates
- [ ] Tratamento de erros robusto
- [ ] Testes unitários (Vitest)

**Dependências**:
- Issue #1 (Workout Player)

---

### Issue #3: Error Handling Global Ausente
**Status**: 🔴 Blocker  
**Prioridade**: P0 - Crítico  
**Estimativa**: 2-3 dias  
**Assignee**: TBD

**Descrição**:
Não há error boundaries nem estratégia consistente de tratamento de erros, o que pode levar a crashes silenciosos e má UX.

**Tasks**:
- [ ] Implementar `ErrorBoundary.tsx` component
- [ ] Wrapper no App.tsx
- [ ] Criar `src/lib/error-handler.ts`
  - [ ] `parseSupabaseError()`
  - [ ] `handleAuthError()`
  - [ ] `handleNetworkError()`
- [ ] Toast padronizado para erros
- [ ] Logging de erros (console.error estruturado)
- [ ] Fallback UI para componentes quebrados

**Arquivos Afetados**:
- `src/components/ErrorBoundary.tsx` (criar)
- `src/lib/error-handler.ts` (criar)
- `src/App.tsx` (modificar)

---

### Issue #4: CRUD de Alunos Incompleto
**Status**: 🔴 Blocker  
**Prioridade**: P0 - Crítico  
**Estimativa**: 1 semana  
**Assignee**: TBD

**Descrição**:
O gerenciamento de alunos permite criar e listar, mas falta edição, detalhes completos e deleção.

**Tasks**:
- [ ] Completar `StudentDetails.tsx`
  - [ ] Tabs: Info, Treinos, Medidas, Histórico
  - [ ] Visualização de progresso
  - [ ] Histórico de treinos
- [ ] Implementar edição de aluno
  - [ ] Formulário de edição
  - [ ] Modal ou página dedicada
  - [ ] Validação com Zod
- [ ] Adicionar soft delete
  - [ ] Campo `is_active` no DB (já existe)
  - [ ] UI para ativar/desativar
- [ ] Hook `useStudentMutations.ts`
  - [ ] `updateStudent()`
  - [ ] `deleteStudent()` (soft delete)
  - [ ] `reactivateStudent()`

**Arquivos Afetados**:
- `src/pages/trainer/StudentDetails.tsx`
- `src/hooks/useStudentMutations.ts` (criar)
- `src/components/student/EditStudentForm.tsx` (criar)

---

### Issue #5: Atribuição de Treinos Não Implementada
**Status**: 🔴 Blocker  
**Prioridade**: P0 - Crítico  
**Estimativa**: 3-4 dias  
**Assignee**: TBD

**Descrição**:
Personal trainers podem criar planos mas não conseguem atribuí-los aos alunos, quebrando o fluxo principal.

**Tasks**:
- [ ] Modal de atribuição de treino
  - [ ] Seletor de aluno(s)
  - [ ] Preview do plano
  - [ ] Data de início (opcional)
- [ ] Hook `useWorkoutAssignment.ts`
  - [ ] `assignWorkout(workoutId, studentId)`
  - [ ] `unassignWorkout(workoutId, studentId)`
  - [ ] Atualiza `workouts.student_id`
- [ ] Adicionar botão "Atribuir" em Plans
- [ ] Adicionar botão "Criar Treino" em Students
- [ ] Notificação ao aluno (toast por enquanto)

**Arquivos Afetados**:
- `src/components/workout/AssignWorkoutModal.tsx` (criar)
- `src/hooks/useWorkoutAssignment.ts` (criar)
- `src/pages/trainer/Plans.tsx` (modificar)
- `src/pages/trainer/Students.tsx` (modificar)

---

## 🟠 Importante (P1) - Necessário para MVP

### Issue #6: Analytics Básico Ausente
**Status**: 🟠 Em Progresso  
**Prioridade**: P1 - Importante  
**Estimativa**: 1 semana  
**Assignee**: TBD

**Descrição**:
Não há visualização de progresso, gráficos ou estatísticas para alunos e trainers.

**Tasks**:
- [ ] Componente `ProgressChart.tsx` (Recharts)
- [ ] Hook `useStudentStats.ts`
  - [ ] Calcular personal records
  - [ ] Volume total por período
  - [ ] Taxa de aderência
  - [ ] Streak atual
- [ ] Página `Progress.tsx` funcional
  - [ ] Gráficos de evolução
  - [ ] Cards de estatísticas
  - [ ] Filtros por período
- [ ] Dashboard do trainer com dados reais
  - [ ] Estatísticas agregadas
  - [ ] Gráfico de atividade semanal

**Arquivos Afetados**:
- `src/components/analytics/ProgressChart.tsx` (criar)
- `src/hooks/useStudentStats.ts` (criar)
- `src/pages/student/Progress.tsx` (modificar)
- `src/pages/trainer/Dashboard.tsx` (modificar)

---

### Issue #7: Cobertura de Testes Insuficiente
**Status**: 🟠 Em Progresso  
**Prioridade**: P1 - Importante  
**Estimativa**: Contínuo (adicionar em cada PR)  
**Assignee**: Todo o time

**Descrição**:
Cobertura atual de ~15% é muito baixa, aumentando risco de regressões.

**Tasks**:
- [ ] Auth flows (target: 80%)
  - [ ] Login
  - [ ] Signup
  - [ ] Logout
  - [ ] Protected routes
- [ ] CRUD operations (target: 70%)
  - [ ] Create student
  - [ ] Update student
  - [ ] Delete student
  - [ ] Create workout
- [ ] Critical hooks (target: 60%)
  - [ ] useAuth  - [ ] useTrainerStudents
  - [ ] useWorkoutLog
- [ ] UI Components (target: 50%)
  - [ ] Forms (LoginForm, etc)
  - [ ] Cards
  - [ ] Modals
- [ ] Configurar CI/CD para rodar testes
- [ ] Pre-commit hook com testes

**Meta de Cobertura**: 60% até MVP

---

### Issue #8: Performance Optimization Necessária
**Status**: 🟠 Planejado  
**Prioridade**: P1 - Importante  
**Estimativa**: 1 semana  
**Assignee**: TBD

**Descrição**:
Lighthouse score de 85 em performance indica oportunidades de otimização.

**Tasks**:
- [ ] Implementar paginação
  - [ ] Lista de alunos
  - [ ] Lista de planos
  - [ ] Histórico de treinos
- [ ] Lazy loading de imagens
  - [ ] Usar `loading="lazy"`
  - [ ] Placeholder enquanto carrega
- [ ] Code splitting adicional
  - [ ] Lazy load de modais pesados
  - [ ] Lazy load de gráficos (Recharts)
- [ ] Bundle analysis
  - [ ] `vite-plugin-bundle-analyzer`
  - [ ] Identificar dependências pesadas
  - [ ] Tree-shaking check
- [ ] React.memo em componentes pesados
- [ ] useMemo/useCallback onde apropriado
- [ ] Lighthouse CI no pipeline

**Meta**: Lighthouse > 90

---

### Issue #9: Documentação Incompleta
**Status**: 🟠 Planejado  
**Prioridade**: P1 - Importante  
**Estimativa**: 1 semana (distribuída)  
**Assignee**: Todo o time

**Descrição**:
README básico, sem guias de contribuição ou documentação de arquitetura.

**Tasks**:
- [ ] Expandir README.md
  - [ ] Setup detalhado
  - [ ] Scripts disponíveis
  - [ ] Environment variables
  - [ ] Troubleshooting comum
- [ ] CONTRIBUTING.md
  - [ ] Como contribuir
  - [ ] Code style guide
  - [ ] PR template
  - [ ] Commit conventions
- [ ] JSDoc nos hooks principais
- [ ] Architecture Decision Records (ADRs)
- [ ] API documentation (hooks)
- [ ] Component stories (opcional)

---

### Issue #10: Staging Environment Ausente
**Status**: 🟠 Planejado  
**Prioridade**: P1 - Importante  
**Estimativa**: 2-3 dias  
**Assignee**: DevOps/TBD

**Descrição**:
Não há ambiente de staging para testar antes de produção.

**Tasks**:
- [ ] Criar projeto Supabase de staging
- [ ] Configurar Vercel/Netlify preview
- [ ] Environment variables para staging
- [ ] Deploy automático de branches
- [ ] Seed data para testing
- [ ] Documentar processo de QA

---

## 🟡 Desejável (P2) - Pós-MVP

### Issue #11: Sistema de Mensagens
**Status**: 🟡 Planejado  
**Prioridade**: P2 - Desejável  
**Estimativa**: 2 semanas  
**Assignee**: TBD

**Descrição**:
Chat entre trainer e aluno para comunicação direta.

**Tasks**:
- [ ] Schema de mensagens (já existe)
- [ ] Componente `ChatInterface.tsx`
- [ ] Hook `useRealtimeMessages.ts` (Supabase Realtime)
- [ ] Notificações de novas mensagens
- [ ] Badge de não lidas
- [ ] Histórico de conversas
- [ ] Upload de mídia (opcional)

---

### Issue #12: Notificações Push
**Status**: 🟡 Planejado  
**Prioridade**: P2 - Desejável  
**Estimativa**: 1-2 semanas  
**Assignee**: TBD

**Descrição**:
Push notifications para engajamento.

**Tasks**:
- [ ] Service worker com push support
- [ ] Integração com Firebase/OneSignal
- [ ] Permissão do usuário (UI)
- [ ] Tipos de notificações:
  - [ ] Treino atribuído
  - [ ] Lembrete de treino
  - [ ] Nova mensagem
  - [ ] Milestone alcançado
- [ ] Configurações de notificação
- [ ] Tabela `devices` no DB (já existe)

---

### Issue #13: Gamificação Básica
**Status**: 🟡 Planejado  
**Prioridade**: P2 - Desejável  
**Estimativa**: 2 semanas  
**Assignee**: TBD

**Descrição**:
Mecânicas de engajamento para aumentar retenção.

**Tasks**:
- [ ] Sistema de badges
  - [ ] Primeira semana completa
  - [ ] 10 treinos
  - [ ] 50 treinos
  - [ ] Personal record
- [ ] Streak tracking
  - [ ] Calcular dias consecutivos
  - [ ] UI de streak
  - [ ] Notificações de streak
- [ ] XP/Pontos (opcional)
- [ ] Challenges semanais (opcional)
- [ ] Social sharing (opcional)

---

### Issue #14: Medidas Corporais
**Status**: 🟡 Planejado  
**Prioridade**: P2 - Desejável  
**Estimativa**: 1 semana  
**Assignee**: TBD

**Descrição**:
Tracking de medidas corporais ao longo do tempo.

**Tasks**:
- [ ] Formulário de registro de medidas
- [ ] Hook `useMeasurements.ts`
- [ ] Gráficos de evolução
- [ ] Upload de fotos de progresso
- [ ] Comparação lado a lado
- [ ] Export de dados

**Schema**: Já existe tabela `measurements`

---

### Issue #15: Biblioteca de Exercícios
**Status**: 🟡 Planejado  
**Prioridade**: P2 - Desejável  
**Estimativa**: 1-2 semanas  
**Assignee**: TBD

**Descrição**:
Catálogo compartilhado de exercícios com instruções.

**Tasks**:
- [ ] Nova tabela `exercise_library`
- [ ] CRUD de exercícios
- [ ] Busca e filtros
- [ ] Categorias (grupos musculares)
- [ ] Upload de vídeos/imagens
- [ ] Instruções detalhadas
- [ ] Exercícios públicos vs privados
- [ ] Compartilhamento entre trainers

---

## 🟢 Baixa Prioridade (P3) - Futuro

### Issue #16: Admin Panel
**Status**: 🟢 Backlog  
**Prioridade**: P3 - Baixa  
**Estimativa**: 3-4 semanas

**Tasks**:
- [ ] Dashboard administrativo
- [ ] Gestão de usuários
- [ ] Analytics globais
- [ ] Moderação de conteúdo
- [ ] Billing/subscriptions
- [ ] Suporte técnico interface

---

### Issue #17: White-label Support
**Status**: 🟢 Backlog  
**Prioridade**: P3 - Baixa  
**Estimativa**: 4-6 semanas

**Tasks**:
- [ ] Customização de cores
- [ ] Logo personalizado
- [ ] Domínio customizado
- [ ] Branding removível
- [ ] Multi-tenancy

---

### Issue #18: API Pública
**Status**: 🟢 Backlog  
**Prioridade**: P3 - Baixa  
**Estimativa**: 3-4 semanas

**Tasks**:
- [ ] REST API documentada
- [ ] Rate limiting
- [ ] API keys
- [ ] Webhooks
- [ ] SDKs (JS, Python)

---

## 🐛 Bugs Conhecidos

### Bug #1: Query Invalidation Inconsistente
**Severidade**: 🟠 Média  
**Descrição**: Algumas mutações não invalidam queries corretamente, levando a dados stale.

**Localização**:
- `useTrainerData.ts` - após criar aluno
- `useWorkoutMutations.ts` - após criar plano

**Fix**:
```typescript
// Adicionar invalidações corretas
queryClient.invalidateQueries({ queryKey: ['trainer', 'students'] });
queryClient.invalidateQueries({ queryKey: ['trainer', 'workouts'] });
```

---

### Bug #2: Loading States Inconsistentes
**Severidade**: 🟡 Baixa  
**Descrição**: Alguns componentes não mostram loading adequadamente.

**Componentes Afetados**:
- `StudentDetails.tsx`
- `PlanEditor.tsx`
- Alguns cards no Dashboard

**Fix**: Padronizar uso de `LoadingSpinner` component

---

### Bug #3: Mobile Bottom Nav Overlapping Content
**Severidade**: 🟡 Baixa  
**Descrição**: Em alguns casos, o bottom nav cobre conteúdo em mobile.

**Localização**: `StudentLayout.tsx`

**Fix**: Adicionar padding-bottom no content wrapper

---

## 📝 Tarefas de Manutenção

### Manutenção #1: Atualizar Dependências
**Frequência**: Mensal  
**Última atualização**: TBD

**Tasks**:
- [ ] `npm audit` e fix vulnerabilidades
- [ ] Atualizar pacotes minor/patch
- [ ] Testar após updates
- [ ] Atualizar Supabase SDK se necessário

---

### Manutenção #2: Code Quality Review
**Frequência**: A cada 2 sprints

**Tasks**:
- [ ] ESLint warnings review
- [ ] TypeScript `any` usage review
- [ ] Duplicação de código (DRY)
- [ ] Performance profiling
- [ ] Bundle size check

---

### Manutenção #3: Database Optimization
**Frequência**: Trimestral

**Tasks**:
- [ ] Review de índices
- [ ] Query performance analysis
- [ ] RLS policies optimization
- [ ] Vacuum e analyze (PostgreSQL)

---

## 📊 Métricas de Progresso

### Issues por Prioridade
```
🔴 P0 (Crítico):     5 issues  (0% done)
🟠 P1 (Importante):  5 issues  (0% done)
🟡 P2 (Desejável):   5 issues  (0% done)
🟢 P3 (Baixa):       3 issues  (0% done)
🐛 Bugs:             3 bugs
📝 Manutenção:       3 tasks
```

### Sprint Planning Sugerido

**Sprint 1 (2 semanas)**: Issues #1, #2, #3
**Sprint 2 (2 semanas)**: Issues #4, #5
**Sprint 3 (2 semanas)**: Issues #6, #7, #8
**Sprint 4 (2 semanas)**: Issues #9, #10 + Bugs

---

## 🎯 Definition of Done

Para cada issue ser considerada "Done":

- [ ] ✅ Código implementado e funcional
- [ ] ✅ Testes unitários escritos (se aplicável)
- [ ] ✅ Code review aprovado
- [ ] ✅ Documentação atualizada
- [ ] ✅ Sem warnings de lint/type
- [ ] ✅ Testado em mobile e desktop
- [ ] ✅ Merged na main branch

---

**Última Atualização**: 2024-12-23  
**Próxima Revisão**: Semanal durante sprints  
**Responsável**: Product Owner / Tech Lead