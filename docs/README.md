# 📚 Documentação do FitFlow

Esta pasta contém toda a documentação do projeto FitFlow, organizada por categoria para facilitar a navegação.

## 📁 Estrutura de Pastas

### 📊 [overview/](./overview/) - Visão Geral do Projeto
Documentos que fornecem uma visão geral do projeto, resumos executivos e análises completas.

- **README.md** - Documentação principal do projeto
- **EXECUTIVE_SUMMARY.md** - Resumo executivo da revisão do projeto
- **PROJECT_REVIEW.md** - Revisão completa e detalhada do projeto
- **VISUAL_OVERVIEW.md** - Visão visual e diagramas do projeto
- **INDEX.md** - Índice geral da documentação

### 🔧 [technical/](./technical/) - Documentação Técnica
Documentação técnica sobre arquitetura, banco de dados, stack tecnológico e regras de código.

- **RULES.md** - Regras críticas do projeto (constituição técnica)
- **ARCHITECTURE.md** - Arquitetura do sistema
- **DATABASE.md** - Schema do banco de dados e políticas RLS
- **tech-stack.md** - Stack tecnológico utilizado
- **OFFICIAL_REFERENCES.md** - 📚 Referências oficiais de todas as tecnologias
- **implementation_notes.md** - Notas de implementação e decisões técnicas

### 📋 [project-management/](./project-management/) - Gestão de Projeto
Documentos relacionados ao planejamento, tarefas, issues e deploy.

- **ACTION_PLAN.md** - Plano de ação e sprints
- **TODO.md** - Lista de tarefas pendentes
- **ISSUES.md** - Issues conhecidas e roadmap
- **DEPLOY_CHECKLIST.md** - Checklist para deploy em produção

### 🚀 [COMMANDS.md](./COMMANDS.md) - Comandos do Projeto
Referência completa de todos os comandos disponíveis.

- **Comandos NPM** - Scripts do projeto
- **Comandos Git** - Workflow e versionamento
- **Comandos Supabase** - Database e migrations
- **Comandos Úteis** - Utilitários e troubleshooting

### 📖 [guides/](./guides/) - Guias e Onboarding
Guias para desenvolvedores, agentes de IA e onboarding.

- **ONBOARDING.md** - Guia de onboarding para novos desenvolvedores
- **AGENTS.md** - Definição de agentes e personas do projeto
- **AGENT.md** - Documentação do agente individual
- **AI_AGENTS_GUIDE.md** - Guia para agentes de IA
- **AI_TASK_CONTEXT.md** - Contexto de tarefas para IA

### 🎯 [conductor/](./conductor/) - Documentação do Conductor
Toda a documentação da pasta `conductor/` original, incluindo workflows, tracks e guias de estilo.

- **workflow.md** - Workflow de desenvolvimento e TDD
- **product.md** - Requisitos e visão do produto
- **product-guidelines.md** - Diretrizes de produto
- **tracks.md** - Documentação de tracks de desenvolvimento
- **code_styleguides/** - Guias de estilo de código
  - **typescript.md** - Padrões TypeScript
  - **html-css.md** - Padrões HTML/CSS
- **tracks/** - Tracks específicos de desenvolvimento
  - **auth_flow_20251222/** - Track de autenticação

## 🚀 Início Rápido

### Para Novos Desenvolvedores
1. Comece por: [overview/README.md](./overview/README.md)
2. Leia: [guides/ONBOARDING.md](./guides/ONBOARDING.md)
3. Consulte: [COMMANDS.md](./COMMANDS.md) - Comandos do projeto
4. Entenda as regras: [technical/RULES.md](./technical/RULES.md)
5. Explore a arquitetura: [technical/ARCHITECTURE.md](./technical/ARCHITECTURE.md)

### Para Product Managers
1. [overview/EXECUTIVE_SUMMARY.md](./overview/EXECUTIVE_SUMMARY.md)
2. [conductor/product.md](./conductor/product.md)
3. [project-management/ACTION_PLAN.md](./project-management/ACTION_PLAN.md)

### Para Arquitetos/DBA
1. [technical/ARCHITECTURE.md](./technical/ARCHITECTURE.md)
2. [technical/DATABASE.md](./technical/DATABASE.md)
3. [technical/RULES.md](./technical/RULES.md) - Seção de Segurança
4. [technical/OFFICIAL_REFERENCES.md](./technical/OFFICIAL_REFERENCES.md) - Referências oficiais

### Para Agentes de IA
1. [guides/AGENTS.md](./guides/AGENTS.md)
2. [guides/AI_AGENTS_GUIDE.md](./guides/AI_AGENTS_GUIDE.md)
3. [conductor/workflow.md](./conductor/workflow.md)

## 📝 Convenções

- Todos os documentos estão em Markdown (`.md`)
- Links relativos são usados para navegação entre documentos
- Documentos técnicos seguem padrões definidos em [conductor/code_styleguides/](./conductor/code_styleguides/)

## 🔄 Atualização

Esta estrutura foi criada em **23 de Dezembro de 2024** e organiza todos os documentos do projeto em categorias lógicas.

**Nota**: Os arquivos originais na raiz do projeto foram mantidos. Esta é uma cópia organizada para facilitar a navegação.

---

**Última Atualização**: 2024-12-23  
**Versão**: 1.0
