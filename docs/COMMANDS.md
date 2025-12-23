# 🚀 Comandos do Projeto FitFlow

Este documento lista todos os comandos disponíveis no projeto, organizados por categoria.

---

## 📦 Comandos NPM (Project Commands)

### 🛠️ Desenvolvimento

```bash
# Inicia o servidor de desenvolvimento (porta 8080)
npm run dev

# Build de produção
npm run build

# Build de desenvolvimento (com source maps)
npm run build:dev

# Preview do build de produção localmente
npm run preview
```

### 🧪 Testes

```bash
# Executa todos os testes
npm run test

# Executa testes em modo watch (re-executa ao salvar arquivos)
npm run test -- --watch

# Executa testes uma vez (útil para CI/CD)
CI=true npm run test

# Executa testes com coverage
npm run test -- --coverage

# Executa testes de um arquivo específico
npm run test -- src/hooks/useAuthActions.test.ts

# Executa testes em modo UI (interface visual)
npm run test -- --ui
```

### 🔍 Qualidade de Código

```bash
# Verifica erros de linting
npm run lint

# Corrige automaticamente erros de linting (quando possível)
npm run lint -- --fix

# Formata código com Prettier
npm run format

# Verifica formatação sem modificar arquivos
npx prettier --check .

# Verifica tipos TypeScript
npx tsc --noEmit
```

### 📊 Análise e Debugging

```bash
# Analisa o bundle size (requer plugin)
npm run build -- --analyze

# Verifica dependências desatualizadas
npm outdated

# Audita vulnerabilidades de segurança
npm audit

# Corrige vulnerabilidades automaticamente
npm audit fix
```

---

## 🗄️ Comandos Supabase

### Setup Inicial

```bash
# Instala Supabase CLI globalmente (se ainda não tiver)
npm install -g supabase

# Faz login no Supabase
supabase login

# Inicializa projeto Supabase local (se usar local dev)
supabase init

# Inicia Supabase local (Docker necessário)
supabase start
```

### Migrations

```bash
# Aplica migrations locais ao projeto remoto
supabase db push

# Cria nova migration
supabase migration new nome_da_migration

# Reseta banco local (cuidado: apaga dados)
supabase db reset

# Gera tipos TypeScript do schema
supabase gen types typescript --local > src/integrations/supabase/types.ts
# ou para projeto remoto:
supabase gen types typescript --project-id seu-project-id > src/integrations/supabase/types.ts
```

### Database

```bash
# Abre SQL Editor no navegador
supabase db open

# Executa SQL localmente
supabase db execute "SELECT * FROM profiles"

# Faz backup do banco
supabase db dump > backup.sql

# Restaura backup
supabase db restore backup.sql
```

### Auth & Users

```bash
# Lista usuários
supabase auth list-users

# Cria usuário de teste
supabase auth create-user --email teste@example.com --password senha123

# Deleta usuário
supabase auth delete-user <user-id>
```

---

## 🔧 Comandos Git

### Setup e Configuração

```bash
# Clona o repositório
git clone https://github.com/your-username/fit-flow.git
cd fit-flow

# Configura usuário Git (se necessário)
git config user.name "Seu Nome"
git config user.email "seu.email@example.com"
```

### Trabalhando com Branches

```bash
# Lista todas as branches
git branch -a

# Cria nova branch
git checkout -b feature/nome-da-feature

# Alterna entre branches
git checkout nome-da-branch

# Deleta branch local
git branch -d nome-da-branch

# Deleta branch remota
git push origin --delete nome-da-branch
```

### Commits

```bash
# Adiciona todos os arquivos modificados
git add .

# Adiciona arquivo específico
git add src/components/MeuComponente.tsx

# Commit com mensagem
git commit -m "feat: adiciona novo componente"

# Commit seguindo Conventional Commits
git commit -m "feat(auth): adiciona login social"
git commit -m "fix(ui): corrige layout mobile"
git commit -m "docs: atualiza README"
git commit -m "chore: atualiza dependências"
```

### Sincronização

```bash
# Busca atualizações do remoto
git fetch origin

# Atualiza branch atual com remoto
git pull origin main

# Envia commits para remoto
git push origin nome-da-branch

# Envia e configura upstream
git push -u origin nome-da-branch
```

### Histórico e Diferenças

```bash
# Ver histórico de commits
git log

# Ver histórico resumido
git log --oneline --graph --all

# Ver diferenças não commitadas
git diff

# Ver diferenças de arquivo específico
git diff src/components/MeuComponente.tsx

# Ver mudanças em staging
git diff --staged
```

### Git Notes (Workflow do Projeto)

```bash
# Adiciona nota a um commit
git notes add -m "Resumo da tarefa: implementa feature X" <commit-hash>

# Lista notas
git notes list

# Mostra nota de um commit
git notes show <commit-hash>

# Edita nota
git notes edit <commit-hash>
```

---

## 🧹 Comandos de Limpeza

### Node Modules e Cache

```bash
# Remove node_modules e reinstala
rm -rf node_modules package-lock.json
npm install

# Limpa cache do npm
npm cache clean --force

# Limpa cache do Vite
rm -rf node_modules/.vite

# Limpa build
rm -rf dist
```

### Git Clean

```bash
# Mostra arquivos que seriam removidos (dry-run)
git clean -n

# Remove arquivos não rastreados
git clean -f

# Remove arquivos e diretórios não rastreados
git clean -fd

# Remove arquivos ignorados também
git clean -fX
```

---

## 🔍 Comandos de Debugging

### Vite Dev Server

```bash
# Inicia dev server em porta específica
npm run dev -- --port 3000

# Inicia dev server com host público
npm run dev -- --host

# Inicia dev server com modo debug
npm run dev -- --debug
```

### TypeScript

```bash
# Verifica tipos sem compilar
npx tsc --noEmit

# Compila TypeScript
npx tsc

# Verifica tipos em modo watch
npx tsc --noEmit --watch
```

### React DevTools

```bash
# Instala React DevTools (extensão do navegador)
# Chrome: https://chrome.google.com/webstore/detail/react-developer-tools
# Firefox: https://addons.mozilla.org/en-US/firefox/addon/react-devtools/
```

---

## 📦 Gerenciamento de Dependências

### Instalação

```bash
# Instala todas as dependências
npm install

# Instala dependência de produção
npm install nome-do-pacote

# Instala dependência de desenvolvimento
npm install -D nome-do-pacote

# Instala versão específica
npm install nome-do-pacote@1.2.3

# Instala última versão
npm install nome-do-pacote@latest
```

### Atualização

```bash
# Verifica pacotes desatualizados
npm outdated

# Atualiza package.json e instala (usar com cuidado)
npm update

# Atualiza pacote específico
npm install nome-do-pacote@latest

# Atualiza todas as dependências (requer npm-check-updates)
npx npm-check-updates -u
npm install
```

### Remoção

```bash
# Remove pacote
npm uninstall nome-do-pacote

# Remove pacote de devDependencies
npm uninstall -D nome-do-pacote
```

---

## 🚀 Comandos de Deploy

### Build de Produção

```bash
# Build otimizado para produção
npm run build

# Build de desenvolvimento (com source maps)
npm run build:dev

# Preview do build localmente
npm run preview
```

### Verificação Pré-Deploy

```bash
# Executa todos os checks antes de fazer deploy
npm run lint && npm run test && npm run build

# Script completo de verificação
npm run lint && \
npm run test -- --coverage && \
npm run build && \
echo "✅ Pronto para deploy!"
```

---

## 🎯 Comandos Úteis do Terminal

### Navegação

```bash
# Lista arquivos e pastas
ls -la

# Navega para pasta
cd nome-da-pasta

# Volta para pasta anterior
cd ..

# Volta para home
cd ~

# Mostra caminho atual
pwd
```

### Busca

```bash
# Busca texto em arquivos (grep)
grep -r "texto" src/

# Busca com contexto (mostra linhas ao redor)
grep -r -C 3 "texto" src/

# Busca case-insensitive
grep -ri "texto" src/

# Busca apenas em arquivos TypeScript
grep -r "texto" src/ --include="*.ts" --include="*.tsx"
```

### Arquivos

```bash
# Cria arquivo vazio
touch nome-do-arquivo.ts

# Cria diretório
mkdir nome-do-diretorio

# Remove arquivo
rm nome-do-arquivo.ts

# Remove diretório recursivamente
rm -rf nome-do-diretorio

# Copia arquivo
cp arquivo-origem.ts arquivo-destino.ts

# Move/renomeia arquivo
mv arquivo-antigo.ts arquivo-novo.ts
```

---

## 🔐 Comandos de Ambiente

### Variáveis de Ambiente

```bash
# Cria arquivo .env a partir do exemplo
cp env.example .env

# Edita arquivo .env (Linux/Mac)
nano .env
# ou
vim .env

# Edita arquivo .env (Windows)
notepad .env

# Carrega variáveis de ambiente manualmente
export VITE_SUPABASE_URL="sua-url"
export VITE_SUPABASE_ANON_KEY="sua-key"
```

### Verificação de Ambiente

```bash
# Verifica versão do Node.js
node --version

# Verifica versão do npm
npm --version

# Verifica versão do Git
git --version

# Lista variáveis de ambiente
env

# Mostra variável específica
echo $VITE_SUPABASE_URL
```

---

## 📊 Comandos de Análise

### Bundle Analysis

```bash
# Analisa tamanho do bundle (requer vite-bundle-visualizer)
npm run build
npx vite-bundle-visualizer

# Verifica tamanho de arquivos
du -sh dist/*

# Lista arquivos maiores
du -h dist/* | sort -rh | head -10
```

### Performance

```bash
# Lighthouse CLI (requer instalação global)
npm install -g @lhci/cli
lhci autorun

# Web Vitals (via browser DevTools)
# Abra DevTools > Lighthouse > Run analysis
```

---

## 🛠️ Comandos de Manutenção

### Atualização de Tipos Supabase

```bash
# Gera tipos TypeScript do schema Supabase
supabase gen types typescript --project-id seu-project-id > src/integrations/supabase/types.ts

# Ou usando Supabase local
supabase gen types typescript --local > src/integrations/supabase/types.ts
```

### Limpeza de Build

```bash
# Remove pasta dist
rm -rf dist

# Remove cache do Vite
rm -rf node_modules/.vite

# Remove todos os builds e caches
rm -rf dist node_modules/.vite .vite
```

### Verificação Completa

```bash
# Script completo de verificação
npm run lint && \
npm run test && \
npm run build && \
echo "✅ Tudo OK!"
```

---

## 📝 Comandos de Documentação

### Geração de Documentação

```bash
# TypeDoc (se configurado)
npx typedoc src/

# JSDoc (se configurado)
npx jsdoc src/
```

---

## 🎨 Comandos de UI/Componentes

### shadcn/ui

```bash
# Adiciona componente do shadcn/ui
npx shadcn-ui@latest add button

# Adiciona múltiplos componentes
npx shadcn-ui@latest add button card dialog

# Lista componentes disponíveis
npx shadcn-ui@latest add

# Inicializa shadcn/ui no projeto
npx shadcn-ui@latest init
```

---

## 🔄 Comandos de Workflow

### Antes de Commitar

```bash
# Checklist completo antes de commitar
npm run lint && \
npm run test && \
npx tsc --noEmit && \
echo "✅ Pronto para commit!"
```

### Após Commitar

```bash
# Adiciona nota ao commit (workflow do projeto)
git notes add -m "Resumo: implementa feature X" $(git log -1 --format="%H")

# Push com notas
git push origin nome-da-branch
git push origin refs/notes/*
```

---

## 🆘 Comandos de Troubleshooting

### Problemas Comuns

```bash
# Porta 8080 já em uso
# Linux/Mac: encontra processo usando porta
lsof -i :8080
kill -9 <PID>

# Windows: encontra processo usando porta
netstat -ano | findstr :8080
taskkill /PID <PID> /F

# Limpa tudo e reinstala
rm -rf node_modules package-lock.json
npm cache clean --force
npm install

# Reseta Supabase local
supabase stop
supabase start
```

---

## 📚 Referências Rápidas

### Comandos Mais Usados

```bash
# Desenvolvimento diário
npm run dev              # Inicia servidor
npm run lint             # Verifica código
npm run format           # Formata código
npm run test             # Roda testes

# Git workflow
git checkout -b feature/nome
git add .
git commit -m "feat: descrição"
git push -u origin feature/nome

# Supabase
supabase db push         # Aplica migrations
supabase gen types typescript --project-id <id> > src/integrations/supabase/types.ts
```

---

## 📝 Notas

- **Conventional Commits**: Use prefixos `feat:`, `fix:`, `docs:`, `chore:`, etc.
- **CI/CD**: Use `CI=true` antes de comandos de teste para execução única
- **Porta Padrão**: Dev server roda na porta 8080
- **TypeScript**: Sempre verifique tipos antes de commitar (`npx tsc --noEmit`)

---

**Última Atualização**: 2024-12-23  
**Versão**: 1.0
