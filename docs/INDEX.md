# 📑 Índice Completo da Documentação FitFlow

Este documento serve como índice completo de toda a documentação do projeto.

## 📊 Visão Geral (overview/)

| Documento | Descrição | Última Atualização |
|-----------|-----------|---------------------|
| [README.md](./overview/README.md) | Documentação principal do projeto | 2024-12-23 |
| [EXECUTIVE_SUMMARY.md](./overview/EXECUTIVE_SUMMARY.md) | Resumo executivo da revisão | 2024-12-23 |
| [PROJECT_REVIEW.md](./overview/PROJECT_REVIEW.md) | Revisão completa do projeto | 2024-12-23 |
| [VISUAL_OVERVIEW.md](./overview/VISUAL_OVERVIEW.md) | Visão visual e diagramas | - |
| [INDEX.md](./overview/INDEX.md) | Índice geral | - |

## 🔧 Documentação Técnica (technical/)

| Documento | Descrição | Tipo |
|-----------|-----------|------|
| [RULES.md](./technical/RULES.md) | Regras críticas do projeto (constituição técnica) | ⚠️ Crítico |
| [ARCHITECTURE.md](./technical/ARCHITECTURE.md) | Arquitetura do sistema | 📐 Design |
| [DATABASE.md](./technical/DATABASE.md) | Schema do banco e políticas RLS | 🗄️ Database |
| [tech-stack.md](./technical/tech-stack.md) | Stack tecnológico | 🛠️ Stack |
| [OFFICIAL_REFERENCES.md](./technical/OFFICIAL_REFERENCES.md) | Referências oficiais das tecnologias | 📚 Referências |
| [implementation_notes.md](./technical/implementation_notes.md) | Notas de implementação | 📝 Notas |

## 📋 Gestão de Projeto (project-management/)

| Documento | Descrição | Status |
|-----------|-----------|--------|
| [ACTION_PLAN.md](./project-management/ACTION_PLAN.md) | Plano de ação e sprints | 🔄 Ativo |
| [TODO.md](./project-management/TODO.md) | Lista de tarefas pendentes | 📝 Atualizado |
| [ISSUES.md](./project-management/ISSUES.md) | Issues conhecidas e roadmap | 🐛 Tracking |
| [DEPLOY_CHECKLIST.md](./project-management/DEPLOY_CHECKLIST.md) | Checklist de deploy | ✅ Produção |

## 🚀 Comandos (Root)

| Documento | Descrição | Tipo |
|-----------|-----------|------|
| [COMMANDS.md](./COMMANDS.md) | Referência completa de comandos | 📖 Referência |

## 📖 Guias (guides/)

| Documento | Descrição | Público-Alvo |
|-----------|-----------|--------------|
| [ONBOARDING.md](./guides/ONBOARDING.md) | Guia de onboarding | 👨‍💻 Devs |
| [AGENTS.md](./guides/AGENTS.md) | Definição de agentes e personas | 🤖 AI Agents |
| [AGENT.md](./guides/AGENT.md) | Documentação do agente individual | 🤖 AI Agents |
| [AI_AGENTS_GUIDE.md](./guides/AI_AGENTS_GUIDE.md) | Guia para agentes de IA | 🤖 AI Agents |
| [AI_TASK_CONTEXT.md](./guides/AI_TASK_CONTEXT.md) | Contexto de tarefas para IA | 🤖 AI Agents |

## 🎯 Conductor (conductor/)

### Documentos Principais

| Documento | Descrição |
|-----------|-----------|
| [workflow.md](./conductor/workflow.md) | Workflow de desenvolvimento e TDD |
| [product.md](./conductor/product.md) | Requisitos e visão do produto |
| [product-guidelines.md](./conductor/product-guidelines.md) | Diretrizes de produto |
| [tracks.md](./conductor/tracks.md) | Documentação de tracks |
| [setup_state.json](./conductor/setup_state.json) | Estado de setup |

### Guias de Estilo (code_styleguides/)

| Documento | Descrição |
|-----------|-----------|
| [typescript.md](./conductor/code_styleguides/typescript.md) | Padrões TypeScript |
| [html-css.md](./conductor/code_styleguides/html-css.md) | Padrões HTML/CSS |

### Tracks de Desenvolvimento (tracks/)

| Track | Descrição | Status |
|-------|-----------|--------|
| [auth_flow_20251222/](./conductor/tracks/auth_flow_20251222/) | Fluxo de autenticação | ✅ Completo |

## 🗺️ Navegação por Persona

### 👨‍💻 Desenvolvedor Full-Stack
1. [technical/RULES.md](./technical/RULES.md) - Regras críticas
2. [technical/ARCHITECTURE.md](./technical/ARCHITECTURE.md) - Arquitetura
3. [conductor/workflow.md](./conductor/workflow.md) - Workflow TDD
4. [conductor/code_styleguides/typescript.md](./conductor/code_styleguides/typescript.md) - Padrões

### 🏗️ Arquiteto de Software
1. [technical/ARCHITECTURE.md](./technical/ARCHITECTURE.md) - Arquitetura completa
2. [technical/DATABASE.md](./technical/DATABASE.md) - Schema e RLS
3. [technical/tech-stack.md](./technical/tech-stack.md) - Stack tecnológico

### 📊 Product Manager
1. [overview/EXECUTIVE_SUMMARY.md](./overview/EXECUTIVE_SUMMARY.md) - Resumo executivo
2. [conductor/product.md](./conductor/product.md) - Visão do produto
3. [project-management/ACTION_PLAN.md](./project-management/ACTION_PLAN.md) - Plano de ação

### 🗄️ Database Administrator
1. [technical/DATABASE.md](./technical/DATABASE.md) - Schema completo
2. [technical/RULES.md](./technical/RULES.md) - Seção de Segurança/RLS
3. [technical/implementation_notes.md](./technical/implementation_notes.md) - Notas de implementação

### 🤖 Agente de IA
1. [guides/AGENTS.md](./guides/AGENTS.md) - Personas e agentes
2. [guides/AI_AGENTS_GUIDE.md](./guides/AI_AGENTS_GUIDE.md) - Guia completo
3. [conductor/workflow.md](./conductor/workflow.md) - Workflow TDD

## 📌 Documentos Críticos (Leitura Obrigatória)

⚠️ **Estes documentos devem ser lidos antes de qualquer trabalho no projeto:**

1. **[technical/RULES.md](./technical/RULES.md)** - Constituição técnica do projeto
2. **[conductor/workflow.md](./conductor/workflow.md)** - Workflow de desenvolvimento
3. **[technical/ARCHITECTURE.md](./technical/ARCHITECTURE.md)** - Arquitetura do sistema
4. **[technical/DATABASE.md](./technical/DATABASE.md)** - Schema e segurança RLS

## 🔍 Busca Rápida

### Por Tópico

**Segurança:**
- [technical/RULES.md](./technical/RULES.md) - Seção 1: Segurança
- [technical/DATABASE.md](./technical/DATABASE.md) - Políticas RLS

**Arquitetura:**
- [technical/ARCHITECTURE.md](./technical/ARCHITECTURE.md)
- [technical/tech-stack.md](./technical/tech-stack.md)

**Desenvolvimento:**
- [conductor/workflow.md](./conductor/workflow.md)
- [conductor/code_styleguides/](./conductor/code_styleguides/)

**Produto:**
- [conductor/product.md](./conductor/product.md)
- [overview/PROJECT_REVIEW.md](./overview/PROJECT_REVIEW.md)

**Deploy:**
- [project-management/DEPLOY_CHECKLIST.md](./project-management/DEPLOY_CHECKLIST.md)

## 📊 Estatísticas da Documentação

- **Total de Documentos**: 27+
- **Categorias**: 5 principais
- **Última Atualização**: 2024-12-23
- **Status**: ✅ Organizado e atualizado

---

**Nota**: Esta estrutura foi criada para facilitar a navegação e organização da documentação do projeto FitFlow.
