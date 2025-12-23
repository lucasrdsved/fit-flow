# 📏 FitFlow Project Rules

Esta é a constituição técnica do projeto FitFlow. Todo código submetido deve aderir a estas regras.

---

## 1. Segurança (Non-Negotiable)

### 1.1 Row Level Security (RLS)
- **Regra**: Todas as tabelas no banco de dados devem ter RLS habilitado.
- **Regra**: Nenhuma política deve usar `USING (true)` para `PUBLIC`.
- **Validação**: Testar acesso com usuário `anon`, `authenticated` (Trainer) e `authenticated` (Student).

### 1.2 Tenant Isolation
- **Regra**: Trainers nunca podem acessar dados de alunos que não estão vinculados a eles (via `personal_id`).
- **Regra**: Alunos nunca podem ver dados de outros alunos.

---

## 2. Qualidade de Código

### 2.1 TypeScript
- **Strict Mode**: `true`.
- **Forbidden**: `any`, `ts-ignore`.
- **Tipos**: Sempre use os tipos gerados do Supabase em `src/integrations/supabase/types.ts`.
- **Props**: Defina interfaces explícitas para todas as props de componentes.

### 2.2 Componentes React
- **Padrão**: Functional Components com Hooks.
- **Estrutura**:
  ```tsx
  // Imports
  // Interfaces
  // Component Definition
    // Hooks
    // Derived State
    // Event Handlers
    // Render
  ```
- **UI Library**: Use estritamente **shadcn/ui**. Se um componente não existir, crie usando primitivos do Radix UI ou Tailwind puro, mantendo o design system.

### 2.3 State Management
- **Server State**: TanStack Query é obrigatório para tudo que vem do Supabase.
- **Client State**: `useState` para UI local, `Context` para estados globais da aplicação (Auth, Theme).
- **Zustand/Redux**: Proibido (não necessário para a complexidade atual).

---

## 3. Banco de Dados & Migrations

### 3.1 Alterações de Schema
- **Regra**: Nunca altere tabelas manualmente no dashboard do Supabase em produção.
- **Processo**: Crie um arquivo SQL em `supabase/migrations/YYYYMMDDHHMMSS_description.sql`.

### 3.2 Performance
- **Índices**: Chaves estrangeiras e colunas usadas em filtros (`WHERE`) devem ter índices.
- **Triggers**: Use `security definer` com cautela em funções PL/pgSQL.

---

## 4. Git & Workflow

### 4.1 Commits
- Siga o padrão **Conventional Commits**:
  - `feat: add workout player`
  - `fix: mobile layout overlap`
  - `chore: update deps`
  - `docs: update readme`

### 4.2 Branches
- `main`: Produção/Estável.
- `feature/*`: Novas funcionalidades.
- `fix/*`: Correção de bugs.

---

## 5. Definição de "Pronto" (DoD)

Uma tarefa só está pronta quando:
1. [ ] Código implementado.
2. [ ] Não há erros de Lint ou Type Check.
3. [ ] Componente é responsivo (testado em mobile view).
4. [ ] Testes unitários (se aplicável) passando.
5. [ ] RLS verificado (se houve mudança de dados).

---

**Violações destas regras resultarão em rejeição do Pull Request.**
