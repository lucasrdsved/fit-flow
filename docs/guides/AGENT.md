# 🤖 AGENT.md — Guia Definitivo para Agentes FitFlow

Este documento é o manual prático e objetivo para qualquer agente (humano ou IA) executar, contribuir e evoluir o projeto FitFlow com máxima eficiência, segurança e qualidade.

---

## 📋 1. Missão do Projeto

- Entregar uma plataforma fitness moderna, segura e escalável, conectando trainers e alunos.
- Priorizar experiência mobile, segurança (RLS), performance e UX premium.

---

## 🧑‍💻 2. Perfis de Agentes

- **Product Manager**: Define prioridades, garante visão de produto, valida entregas.
- **Architect**: Garante padrões, arquitetura, segurança e escalabilidade.
- **Full-Stack Developer**: Implementa features, corrige bugs, testa e documenta.
- **DBA**: Cuida do schema, RLS, performance e integridade dos dados.
- **DevOps**: Automatiza deploy, monitora, garante CI/CD e rollback.

---

## 🚦 3. Fluxo de Execução (Prompt para Agentes)

1. **Leia o ONBOARDING.md** para overview, comandos e checklist.
2. **Escolha uma issue em ISSUES.md** (priorize P0/P1).
3. **Leia ACTION_PLAN.md** para contexto de sprint e entregáveis.
4. **Antes de codar:**
   - Consulte [PROJECT_REVIEW.md](../overview/PROJECT_REVIEW.md) e [ARCHITECTURE.md](../technical/ARCHITECTURE.md).
   - Valide dependências, padrões e RLS.
5. **Implemente seguindo:**
   - Componentização (shadcn/ui, Tailwind, hooks)
   - Testes (Vitest, Testing Library)
   - Tipagem estrita (TypeScript)
   - Commits convencionais
6. **Teste localmente:**
   - `npm run dev`, `npm run test`, `npm run lint`
   - Valide flows críticos (auth, CRUD, logging)
7. **Documente:**
   - Atualize README.md, ONBOARDING.md e docs técnicas se necessário.
8. **Abra PR:**
   - Descreva claramente o que foi feito, relacione issues.
   - Aguarde code review.
9. **Deploy:**
   - Siga DEPLOY_CHECKLIST.md
   - Monitore logs e métricas pós-deploy.

---

## 🏆 4. Padrões de Qualidade

- 100% TypeScript strict
- RLS obrigatório em todo dado sensível
- Test coverage mínimo: 60% para MVP
- UI mobile-first, responsiva e acessível
- Documentação sempre atualizada
- Performance: Lighthouse > 90

---

## 🛠️ 5. Comandos Essenciais

```bash
# Instalar dependências
git clone https://github.com/your-username/fit-flow.git
cd fit-flow
npm install
cp env.example .env
# Edite .env com credenciais do Supabase
npx supabase db push
npm run dev
```

```bash
# Testes e qualidade
npm run test
npm run lint
npm run type-check
```

---

## 🧭 6. Navegação Rápida

- [ONBOARDING.md](./ONBOARDING.md) — Checklist e automações
- [ISSUES.md](./ISSUES.md) — Tarefas e bugs
- [ACTION_PLAN.md](./ACTION_PLAN.md) — Sprint atual
- [PROJECT_REVIEW.md](./PROJECT_REVIEW.md) — Análise técnica
- [ARCHITECTURE.md](../technical/ARCHITECTURE.md) — Arquitetura
- [DATABASE.md](../technical/DATABASE.md) — Banco/RLS
- [README.md](./README.md) — Setup e scripts

---

## 🧠 7. Melhores Práticas para Agentes

- Sempre valide RLS e segurança antes de subir código.
- Priorize features core e correção de bugs críticos.
- Automatize tudo que for repetitivo (scripts, CI/CD, testes).
- Documente decisões e aprendizados em cada PR.
- Use prompts claros e objetivos para IA: "Implemente X seguindo padrão Y, com testes e documentação".
- Revise e atualize este AGENT.md sempre que o fluxo evoluir.

---

## 🚀 8. Prompt Exemplo para Agente IA

> "Você é um agente FitFlow. Sua missão: implementar a feature [NOME] seguindo os padrões do projeto (arquitetura, RLS, testes, documentação). Leia [ONBOARDING.md](./ONBOARDING.md), [ACTION_PLAN.md](../project-management/ACTION_PLAN.md) e [ISSUES.md](../project-management/ISSUES.md) antes de começar. Implemente, teste, documente e abra PR. Siga [AGENT.md](./AGENT.md) para garantir qualidade e alinhamento."

---

## 📞 9. Suporte

- Dúvidas técnicas: consulte README.md, ONBOARDING.md ou peça ajuda ao time.
- Problemas de deploy: siga DEPLOY_CHECKLIST.md e monitore logs.
- Sugestões de melhoria: crie issue ou PR.

---

> Mantenha este documento como referência central para qualquer agente executar o FitFlow com excelência.
