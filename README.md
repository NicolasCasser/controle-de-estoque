# Sistema de Controle de Estoque

Aplicação web para controle de estoque desenvolvida como projeto acadêmico.

## Objetivo

Permitir o gerenciamento de produtos e o controle de entradas e saídas de estoque através de uma interface web simples.

## Tecnologias Utilizadas

### Backend

* Node.js
* Express
* TypeORM
* PostgreSQL

### Frontend

* HTML
* CSS
* JavaScript

### Ferramentas

* Git
* GitHub

## Estrutura do Projeto

```text
controle-de-estoque/
├── backend/
│   ├── src/
│   │   ├── modules/
│   │   ├── database/
│   │   └── app.js
│   │
│   ├── package.json
│   └── package-lock.json
│
├── frontend/
│
├── docs/
│
├── .gitignore
└── README.md
```

## Como Executar o Projeto

### Instalação

Clonar o repositório:

```bash
git clone https://github.com/NicolasCasser/controle-de-estoque.git
```

Entrar na pasta:

```bash
cd controle-de-estoque
```

### Backend

Entrar na pasta do backend:

```bash
cd backend
```

Instalar as dependências:

```bash
npm install
```

Iniciar o servidor:

```bash
npm start
```

Por padrão a aplicação será executada em:

```text
http://localhost:3000
```

## Fluxo de Desenvolvimento

Cada nova funcionalidade deve ser desenvolvida em uma branch própria.

Exemplo:

```bash
git checkout -b feat/setup-express
```

Após finalizar a implementação:

```bash
git add .
git commit -m "feat: descrição da funcionalidade"
git push origin nome-da-branch
```

## Padrão de Commits

### feat

Nova funcionalidade.

Exemplo:

```text
feat: implementar cadastro de produtos
```

### fix

Correção de bug.

Exemplo:

```text
fix: corrigir validação de estoque
```

### refactor

Reestruturação de código sem alteração de comportamento.

Exemplo:

```text
refactor: reorganizar módulo de produtos
```

### docs

Alterações de documentação.

Exemplo:

```text
docs: atualizar README
```

### chore

Configurações e tarefas de manutenção.

Exemplo:

```text
chore: configurar TypeORM
```

## Status do Projeto

🚧 Em desenvolvimento