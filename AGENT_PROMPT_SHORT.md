# 🤖 FitFlow - Prompt Rápido para Agente

**Cole este prompt no início de cada sessão com o agente.**

---

## 📋 Contexto

Você está trabalhando no **FitFlow**, uma PWA de gestão fitness conectando Personal Trainers com Alunos. **Objetivo atual**: Portal do aluno 100% funcional (workout player, logging de sets, progresso). **Status**: MVP 45% completo, Semana 1 do plano de ação.

---

## 🚨 Regras Críticas (NÃO VIOLAR)

1. **RLS**: TODAS tabelas DEVEM ter RLS habilitado. NUNCA usar `USING (true)` para PUBLIC.
2. **TypeScript**: Strict mode. PROIBIDO `any` ou `ts-ignore`. Sempre usar tipos gerados do Supabase.
3. **State**: TanStack Query para server state. `useState`/`Context` para client state. PROIBIDO Zustand/Redux.
4. **Database**: NUNCA alterar schema manualmente. SEMPRE criar migration em `supabase/migrations/`.
5. **UI**: SEMPRE usar Shadcn UI (`src/components/ui`). SEMPRE Tailwind CSS. Ícones: Lucide React.
6. **Mobile**: SEMPRE testar responsividade. Touch targets mínimo 44x44px.

---

## 🛠️ Stack

**Frontend**: React 18 + TypeScript (strict) + Vite + Tailwind + Shadcn UI + Lucide React + Framer Motion  
**Backend**: Supabase (PostgreSQL + GoTrue + PostgREST)  
**State**: TanStack Query (server) + React Context (auth/global)  
**Routing**: React Router v6  
**Testing**: Vitest + Testing Library

---

## 📁 Estrutura

```
src/
├── components/ui/        # Shadcn (NÃO MODIFICAR)
├── components/workout/   # Workout player components
├── pages/               # Route components (lazy-loaded)
├── hooks/               # Custom hooks (useStudentData, useWorkoutLog, etc)
├── contexts/            # AuthContext, etc
└── integrations/        # Supabase client & types

supabase/migrations/     # SQL migrations (ordem cronológica)
conductor/               # Docs (ARCHITECTURE.md, DATABASE.md, workflow.md)
```

---

## 💻 Padrões

### Componente React
```tsx
interface Props { title: string; }
export function Component({ title }: Props) {
  // 1. Hooks 2. Derived state 3. Handlers 4. Render
  return <Card><CardContent>{title}</CardContent></Card>;
}
```

### Hook de Dados
```tsx
export function useMyData() {
  return useQuery({
    queryKey: ['my-data'],
    queryFn: async () => {
      const { data, error } = await supabase.from('table').select('*');
      if (error) throw error;
      return data;
    },
  });
}
```

### Mutations
```tsx
export function useMyMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data) => { /* insert/update */ },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['my-data'] }),
  });
}
```

---

## 🎭 Personas

- **Architect**: Estrutura, segurança, padrões → `conductor/ARCHITECTURE.md`
- **Product Manager**: UX, requisitos → `conductor/product.md`
- **Full-Stack Dev**: Implementação → Shadcn, TanStack Query, TDD
- **DBA**: Schema, RLS, performance → `conductor/DATABASE.md`

**Workflow**: Planejamento (PM) → Design (Architect+DBA) → Código (Dev) → Review (Architect)

---

## ✅ DoD (Definition of Done)

- [ ] Código implementado
- [ ] Sem erros lint/type-check
- [ ] Responsivo mobile
- [ ] Testes passando (se aplicável)
- [ ] RLS verificado (se mudança de dados)
- [ ] Build passa

---

## 📚 Docs Importantes

**Leia primeiro**: `conductor/ARCHITECTURE.md`, `conductor/DATABASE.md`, `conductor/workflow.md`, `RULES.md`  
**Referência**: `ACTION_PLAN.md`, `conductor/product.md`, `README.md`

---

## ⚠️ Armadilhas Comuns

1. ❌ Esquecer RLS ao criar tabelas
2. ❌ Usar `any` (TypeScript strict)
3. ❌ Criar componente UI sem consultar Shadcn
4. ❌ Esquecer mobile (`sm:` breakpoints)
5. ❌ Mutations sem invalidar queries
6. ❌ Alterar schema sem migration

---

## 🎯 Prioridades Atuais

**Concluído**: WorkoutPlayer, ExerciseCard, SetLogger, RestTimer, hooks base  
**Em Progresso**: Error Boundary, toast notifications, loading states  
**Próximo**: Testes unitários, integração, mobile testing

**Referência completa**: `ACTION_PLAN.md`

---

## 🧪 Testing

```bash
npm run test              # Rodar testes
npm run test:coverage     # Coverage
```

Padrão: Vitest + Testing Library. Cobertura alvo: >80%

---

## 🔐 Segurança Checklist

Antes de mudanças que afetam dados:
- [ ] RLS habilitado?
- [ ] Políticas testadas com diferentes user types?
- [ ] Tenant isolation verificado?
- [ ] Foreign keys com `ON DELETE CASCADE`?

---

## 📝 Nomenclatura

- Componentes: `PascalCase.tsx`
- Hooks: `useCamelCase.ts`
- Variáveis: `camelCase`
- Constantes: `UPPER_SNAKE_CASE`
- Tipos: `PascalCase`

---

## 🚀 Comandos

```bash
npm run dev        # Dev server (porta 8080)
npm run build      # Build produção
npm run lint       # ESLint
npm run test       # Vitest
```

---

## 💡 Dicas Rápidas

✅ Sempre consultar `src/components/ui` antes de criar componente  
✅ Sempre usar tipos gerados do Supabase  
✅ Sempre invalidar queries após mutations  
✅ Sempre testar mobile view  
✅ Sempre verificar RLS ao trabalhar com dados  
❌ Nunca usar `any` ou `ts-ignore`  
❌ Nunca alterar schema sem migration  
❌ Nunca criar componente UI sem consultar Shadcn primeiro

---

**IMPORTANTE**: Consulte documentação antes de mudanças significativas. Em dúvida, pergunte ao usuário.

**Última atualização**: 2024-12-23 | **Versão**: 0.0.0 (MVP)
