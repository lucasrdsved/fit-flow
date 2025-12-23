# 🚀 FitFlow - Plano de Ação Imediato (2 Semanas)

**Período**: 23 Dez 2024 - 05 Jan 2025  
**Objetivo**: Completar funcionalidades críticas para MVP viável  
**Status**: 🔴 Bloqueado para produção

---

## 🎯 Meta Principal

**Tornar o portal do aluno 100% funcional** para que alunos possam:
1. Ver treinos atribuídos
2. Executar treinos com player interativo
3. Registrar peso/reps/sets
4. Ver progresso básico

---

## 📅 Semana 1 (23-29 Dez)

### 🎯 Objetivo da Semana
Implementar o workout player e sistema de logging

### Segunda-feira (23 Dez) - Setup e Planejamento
**4-6 horas**

#### Morning (2-3h)
- [ ] **Review do código atual**
  - Entender estrutura de `Workout.tsx`
  - Revisar schema de `workout_logs` e `exercise_logs`
  - Mapear fluxo de dados necessário

#### Afternoon (2-3h)
- [ ] **Criar estrutura de componentes**
  ```bash
  mkdir -p src/components/workout
  touch src/components/workout/WorkoutPlayer.tsx
  touch src/components/workout/ExerciseCard.tsx
  touch src/components/workout/SetLogger.tsx
  touch src/components/workout/RestTimer.tsx
  ```
- [ ] **Criar hooks base**
  ```bash
  touch src/hooks/useWorkoutLog.ts
  touch src/hooks/useExerciseLog.ts
  touch src/hooks/useWorkoutTimer.ts
  ```

---

### Terça-feira (24 Dez) - WorkoutPlayer Core
**6-8 horas**

#### Morning (3-4h)
- [ ] **Implementar `WorkoutPlayer.tsx`**
  ```typescript
  // Funcionalidades mínimas
  - Lista de exercícios do workout
  - Navegação anterior/próximo
  - Progress bar (exercício X de N)
  - Botão "Iniciar Treino"
  - Botão "Finalizar Treino"
  ```

#### Afternoon (3-4h)
- [ ] **Implementar `ExerciseCard.tsx`**
  ```typescript
  - Exibir nome do exercício
  - Sets, reps, rest time
  - Instruções/notas
  - Status (pendente/em progresso/completo)
  ```

**Entregável**: Player básico renderizando exercícios

---

### Quarta-feira (25 Dez) - FERIADO (Natal)
**Opcional - 0-2 horas leves**

- [ ] **Code review** do que foi feito
- [ ] **Ajustes** e refatorações menores
- [ ] **Planejar** dia seguinte

---

### Quinta-feira (26 Dez) - Logging de Sets
**6-8 horas**

#### Morning (3-4h)
- [ ] **Implementar `SetLogger.tsx`**
  ```typescript
  // Features
  - Input de peso (number)
  - Input de reps (number)
  - Checkbox de "completo"
  - Botão "Adicionar Set"
  - Lista de sets completados
  - Edição de set (opcional)
  ```

#### Afternoon (3-4h)
- [ ] **Implementar `useWorkoutLog.ts`**
  ```typescript
  // Mutations
  - createWorkoutLog()
    → Cria registro na tabela workout_logs
  - updateWorkoutLog()
    → Atualiza duration, notes
  - completeWorkout()
    → Marca completed_at
  ```

**Entregável**: Sistema de logging funcional (local state)

---

### Sexta-feira (27 Dez) - Persistência e Timer
**6-8 horas**

#### Morning (3-4h)
- [ ] **Implementar `useExerciseLog.ts`**
  ```typescript
  // Mutations
  - logExerciseSet(workoutLogId, exerciseId, setData)
    → Insere na tabela exercise_logs
  - updateExerciseSet(setId, newData)
  - deleteExerciseSet(setId)
  
  // Queries
  - getWorkoutLogSets(workoutLogId)
  ```

#### Afternoon (3-4h)
- [ ] **Implementar `RestTimer.tsx`**
  ```typescript
  - Countdown timer
  - Start/Pause/Reset
  - Sound/vibration ao terminar (opcional)
  - Configuração de tempo customizado
  ```
- [ ] **Integrar com SetLogger**
  - Auto-start timer após set completo
  - Next exercise após rest

**Entregável**: Fluxo completo de logging com persistência

---

### Sábado (28 Dez) - Error Handling e Polish
**4-6 horas**

#### Morning (2-3h)
- [ ] **Error Boundary**
  ```bash
  touch src/components/ErrorBoundary.tsx
  ```
  ```typescript
  - Catch errors em workout player
  - Fallback UI amigável
  - Log errors para debug
  - Recovery options
  ```

#### Afternoon (2-3h)
- [ ] **Toast notifications**
  - Treino iniciado ✅
  - Set registrado ✅
  - Treino finalizado ✅
  - Erros ❌
- [ ] **Loading states** em todos os botões
- [ ] **Disable** botões durante mutations

**Entregável**: UX polida e confiável

---

### Domingo (29 Dez) - Testes e Bug Fixes
**4-6 horas**

#### Morning (2-3h)
- [ ] **Testes unitários**
  ```bash
  touch src/hooks/useWorkoutLog.test.ts
  touch src/hooks/useExerciseLog.test.ts
  ```
  - Testar mutations
  - Testar query invalidation
  - Mock Supabase client

#### Afternoon (2-3h)
- [ ] **Testes de integração**
  - Fluxo completo: iniciar → logar sets → finalizar
  - Navegação entre exercícios
  - Timer funcionando
- [ ] **Fix bugs** encontrados
- [ ] **Mobile testing** (responsividade)

**Entregável**: Workout player 100% funcional e testado

---

## 📅 Semana 2 (30 Dez - 05 Jan)

### 🎯 Objetivo da Semana
CRUD de alunos, atribuição de treinos e analytics básico

---

### Segunda-feira (30 Dez) - Student Details & Edit
**6-8 horas**

#### Morning (3-4h)
- [ ] **Completar `StudentDetails.tsx`**
  ```typescript
  // Tabs
  - Informações (nome, email, phone, etc)
  - Treinos atribuídos
  - Histórico de treinos (últimos 10)
  - Estatísticas básicas
  ```

#### Afternoon (3-4h)
- [ ] **Criar `EditStudentForm.tsx`**
  - Form com React Hook Form
  - Validação com Zod
  - Modal ou página dedicada
- [ ] **Hook `useStudentMutations.ts`**
  ```typescript
  - updateStudent(id, data)
  - deleteStudent(id) // soft delete
  - reactivateStudent(id)
  ```

**Entregável**: Gestão completa de alunos

---

### Terça-feira (31 Dez) - Workout Assignment
**4-6 horas**

#### Morning (2-3h)
- [ ] **Criar `AssignWorkoutModal.tsx`**
  ```typescript
  - Select de aluno (dropdown)
  - Preview do plano
  - Data de início (opcional)
  - Botão "Atribuir"
  ```

#### Afternoon (2-3h)
- [ ] **Hook `useWorkoutAssignment.ts`**
  ```typescript
  - assignWorkout(workoutId, studentId)
    → Atualiza workouts.student_id
  - unassignWorkout(workoutId)
    → Remove workouts.student_id
  ```
- [ ] **Integrar** nos botões de Plans e Students

**Entregável**: Atribuição funcional

---

### Quarta-feira (1 Jan) - FERIADO (Ano Novo)
**Opcional - 0-2 horas**

- [ ] **Relaxar** 🎉
- [ ] **Planejar** próximos dias

---

### Quinta-feira (2 Jan) - Analytics Básico
**6-8 horas**

#### Morning (3-4h)
- [ ] **Hook `useStudentStats.ts`**
  ```typescript
  - calculatePersonalRecords()
  - getTotalVolume(period)
  - getCompletionRate()
  - getCurrentStreak()
  ```

#### Afternoon (3-4h)
- [ ] **Componentes de visualização**
  ```bash
  touch src/components/analytics/StatCard.tsx
  touch src/components/analytics/ProgressChart.tsx
  ```
  - Cards de estatísticas
  - Gráfico simples (Recharts)
  - Filtro por período

**Entregável**: Analytics funcional

---

### Sexta-feira (3 Jan) - Progress Page & Dashboard
**6-8 horas**

#### Morning (3-4h)
- [ ] **Completar `Progress.tsx` (aluno)**
  - Header com resumo
  - Gráficos de evolução
  - Personal records list
  - Streak indicator

#### Afternoon (3-4h)
- [ ] **Atualizar `Dashboard.tsx` (trainer)**
  - Dados reais (sem mocks)
  - Estatísticas corretas
  - Gráfico de atividade semanal
  - Lista de alunos ativos

**Entregável**: Dashboards completos

---

### Sábado (4 Jan) - Performance & Polish
**4-6 horas**

#### Morning (2-3h)
- [ ] **Paginação** em listas grandes
  - Students list
  - Workout logs list
  - Plans list

#### Afternoon (2-3h)
- [ ] **Loading optimization**
  - React.memo em componentes pesados
  - useMemo/useCallback onde necessário
- [ ] **Bundle analysis**
  - `npm install -D vite-plugin-bundle-analyzer`
  - Identificar oportunidades

**Entregável**: Performance melhorada

---

### Domingo (5 Jan) - Testing & Bug Bash
**4-6 horas**

#### Morning (2-3h)
- [ ] **Testes** das novas features
  - Student CRUD
  - Workout assignment
  - Analytics calculation

#### Afternoon (2-3h)
- [ ] **Bug bash** completo
  - Testar todos os fluxos
  - Mobile + Desktop
  - Edge cases
- [ ] **Fix critical bugs**
- [ ] **Preparar** para demo/review

**Entregável**: MVP estável para beta testing

---

## 📊 Checklist de Conclusão

### ✅ Features Completas
- [ ] Portal do aluno funcional
- [ ] Workout player interativo
- [ ] Sistema de logging de exercícios
- [ ] CRUD completo de alunos
- [ ] Atribuição de treinos
- [ ] Analytics básico
- [ ] Dashboards atualizados

### ✅ Qualidade de Código
- [ ] Error handling robusto
- [ ] Loading states consistentes
- [ ] Testes críticos escritos
- [ ] Mobile responsivo
- [ ] Performance otimizada

### ✅ Pronto para Beta
- [ ] Sem bugs críticos
- [ ] Fluxos principais funcionais
- [ ] UX polida
- [ ] Documentação atualizada

---

## 🎯 Métricas de Sucesso

### End of Week 1
```
✅ Workout player: 100%
✅ Logging system: 100%
✅ Error handling: 100%
✅ Tests: 40%
```

### End of Week 2
```
✅ Student CRUD: 100%
✅ Workout assignment: 100%
✅ Analytics: 100%
✅ Performance: 90%
✅ Tests: 60%
✅ MVP Ready: ✅
```

---

## 🚨 Bloqueadores Potenciais

### Riscos Identificados
1. **Complexidade do timer**: Pode levar mais tempo que estimado
   - **Mitigation**: Usar library pronta (react-countdown-circle-timer)

2. **Query invalidation**: Pode causar bugs sutis
   - **Mitigation**: Testar extensivamente, usar React Query Devtools

3. **Mobile testing**: Pode revelar bugs de última hora
   - **Mitigation**: Testar mobile desde dia 1

4. **Feriados**: Menos tempo disponível
   - **Mitigation**: Ajustar estimativas, focar no essencial

---

## 💬 Daily Standups (Sugestão)

### Formato
**10-15 min** diários às 9h (ou horário do time)

### Perguntas
1. O que fiz ontem?
2. O que farei hoje?
3. Há bloqueadores?

### Check-ins
- Segunda: Planejar semana
- Quarta: Mid-week review
- Sexta: Demo + retro

---

## 📞 Contatos de Suporte

### Quando Precisar de Ajuda
- **Supabase Issues**: [Discord Supabase](https://discord.supabase.com)
- **React Query**: [Discord TanStack](https://discord.gg/tanstack)
- **Tailwind/shadcn**: [GitHub Discussions](https://github.com/shadcn-ui/ui/discussions)

### Recursos Úteis
- [Supabase Docs](https://supabase.com/docs)
- [React Query Docs](https://tanstack.com/query/latest)
- [Testing Library](https://testing-library.com)

---

## 🎉 Celebration Points

### End of Week 1
🎉 **Milestone**: Portal do aluno funcional!
- Comemorar com time
- Demo para stakeholders

### End of Week 2  
🎉 **Milestone**: MVP completo!
- Beta testing pode começar
- Marketing pode planejar launch

---

**Criado em**: 2024-12-23  
**Responsável**: Tech Lead / Product Owner  
**Review**: Semanal

**Let's ship this! 🚀**