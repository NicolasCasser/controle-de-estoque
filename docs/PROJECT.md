## 1. Visão Geral

### Objetivo

Desenvolver uma aplicação web de controle de estoque para gerenciamento de produtos e movimentações.

### Escopo

O sistema permitirá:

- Cadastro de produtos.
    
- Consulta de produtos.
    
- Edição de produtos.
    
- Exclusão lógica de produtos.
    
- Registro de entradas de estoque.
    
- Registro de saídas de estoque.
    
- Consulta do histórico de movimentações.
    

### Público-Alvo

Pequenos comerciantes que necessitam controlar a quantidade de produtos disponíveis em estoque.

### Fora do Escopo

- Autenticação e autorização.
    
- Controle de usuários.
    
- Categorias de produtos.
    
- Relatórios.
    
- Dashboard.
    
- Controle de múltiplos estoques.
	
- Paginação

## 2. Tecnologias

### Frontend

#### HTML

Responsável pela estrutura das páginas da aplicação.

#### CSS

Responsável pela estilização da interface.

#### JavaScript

Responsável pela comunicação com a API e pelas interações da interface.

### Backend

#### Express

Framework utilizado para construção da API REST.

Motivos da escolha:

- Baixa complexidade para o escopo do projeto.
    
- Menor quantidade de configuração inicial.
    
- Adequado para aplicações de pequeno porte.
    
- Permite foco nas regras de negócio sem adicionar abstrações desnecessárias.
    

#### TypeORM

ORM utilizado para mapeamento entre as entidades da aplicação e o banco de dados.

Motivos da escolha:

- Facilita o trabalho com entidades e relacionamentos.
    
- Possui suporte nativo a soft delete.
    
- Integração simples com PostgreSQL.
    
- Reduz a quantidade de SQL manual necessária.
    

### Banco de Dados

#### PostgreSQL

Banco de dados relacional utilizado para persistência dos dados.

Motivos da escolha:

- Modelo relacional adequado para o domínio do projeto.
    
- Boa integração com o TypeORM.
    
- Facilidade para trabalhar com relacionamentos e consultas estruturadas.
    

### Controle de Versão

#### Git

Utilizado para versionamento do código-fonte.

#### GitHub

Utilizado para hospedagem do repositório e colaboração entre os integrantes.

## 3. Arquitetura

### Organização Geral

A aplicação será desenvolvida utilizando uma arquitetura modular, separando as funcionalidades por domínio de negócio.

Os módulos principais serão:

- Produtos
    
- Movimentações
    

### Estrutura de Pastas

```text
src/
├── modules/
│   ├── products/
│   │   ├── product.controller.js
│   │   ├── product.service.js
│   │   ├── product.entity.js
│   │   └── product.routes.js
│   │
│   └── movements/
│       ├── movement.controller.js
│       ├── movement.service.js
│       ├── movement.entity.js
│       └── movement.routes.js
│
├── database/
│   └── data-source.js
│
└── app.js
```

### API REST

A comunicação entre frontend e backend será realizada através de uma API REST.

As requisições e respostas utilizarão o formato JSON.

### Banco de Dados

O sistema utilizará PostgreSQL como banco de dados relacional e TypeORM como ferramenta de mapeamento objeto-relacional.

Durante o desenvolvimento será utilizada a opção `synchronize: true` do TypeORM para criação e atualização automática das tabelas.

O uso de migrations não faz parte do escopo atual do projeto.

### Decisões Arquiteturais

#### Organização por Módulos

Cada módulo será responsável por suas próprias rotas, serviços e entidades.

#### Soft Delete

A exclusão de produtos será realizada utilizando exclusão lógica através do campo `deletedAt`.

#### Controle de Estoque

A quantidade disponível será armazenada diretamente na entidade Produto através do campo `quantidadeAtual`.

Alterações na quantidade serão realizadas exclusivamente por movimentações de estoque.

#### Movimentações

As movimentações serão registradas em uma entidade própria, permitindo manter o histórico de entradas e saídas de produtos.

O módulo de movimentações será responsável pelo registro das movimentações, enquanto a atualização da quantidade disponível será realizada através dos serviços do módulo de produtos.

#### Simplificações Adotadas

Para manter o foco no objetivo acadêmico do projeto, não serão implementados:

- Autenticação e autorização.
    
- Paginação.
    
- Controle de concorrência.
    
- Migrations de banco de dados.

## 4. Modelo de Dados

### Entidade Produto

Representa os produtos cadastrados no sistema e a quantidade atualmente disponível em estoque.

|Campo|Tipo|Observação|
|---|---|---|
|id|Integer|Chave primária auto incremental|
|nome|String|Obrigatório|
|descricao|String|Opcional|
|quantidadeAtual|Integer|Quantidade disponível em estoque|
|createdAt|DateTime|Data de criação|
|updatedAt|DateTime|Data da última atualização|
|deletedAt|DateTime|Utilizado para exclusão lógica|

#### Observações

- O nome do produto é obrigatório.
    
- O nome não precisa ser único.
    
- A quantidade atual é armazenada diretamente na entidade Produto.
    
- Produtos excluídos não são removidos fisicamente do banco de dados.
    

### Entidade Movimentação

Representa as entradas e saídas de estoque realizadas para um produto.

|Campo|Tipo|Observação|
|---|---|---|
|id|Integer|Chave primária auto incremental|
|productId|Integer|Referência para Produto|
|tipo|Enum|ENTRADA ou SAIDA|
|quantidade|Integer|Quantidade movimentada|
|observacao|String|Opcional|
|createdAt|DateTime|Data da movimentação|

#### Observações

- Toda movimentação pertence a um único produto.
    
- A observação é opcional.
    
- O tipo da movimentação deve ser ENTRADA ou SAIDA.
    

### Relacionamento

```text
Produto (1) -------- (N) Movimentações
```

Um produto pode possuir várias movimentações registradas ao longo do tempo.

Cada movimentação pertence a apenas um produto.

## 5. Regras de Negócio

### 5.1 Produtos

**RN01** - O nome do produto é obrigatório.

**RN02** - O nome do produto não precisa ser único.

**RN03** - A descrição do produto é opcional.

**RN04** - A quantidade inicial do produto deve ser maior ou igual a zero.

**RN05** - Caso a quantidade inicial informada seja menor que zero, o sistema deverá retornar erro de validação.

**RN06** - Produtos podem ser cadastrados com quantidade inicial igual a zero.

**RN07** - Quando um produto for cadastrado com quantidade inicial maior que zero, o sistema deverá criar automaticamente uma movimentação do tipo ENTRADA com a mesma quantidade informada.

**RN08** - A quantidade disponível de um produto não pode ser alterada diretamente por edição. Alterações de estoque devem ocorrer exclusivamente por movimentações.

**RN09** - O cadastro do produto e a criação da movimentação automática de entrada devem ser concluídos com sucesso em conjunto. Caso ocorra falha em qualquer etapa, nenhuma alteração deverá ser persistida.

### 5.2 Movimentações

**RN10** - Toda movimentação deve estar associada a um produto existente e ativo.

**RN11** - A quantidade movimentada deve ser maior que zero.

**RN12** - O tipo da movimentação deve ser obrigatoriamente ENTRADA ou SAIDA.

**RN13** - A observação da movimentação é opcional.

**RN14** - Movimentações do tipo ENTRADA devem aumentar a quantidade disponível do produto.

**RN15** - Movimentações do tipo SAIDA devem reduzir a quantidade disponível do produto.

**RN16** - Não é permitido realizar movimentações de saída que resultem em estoque negativo.

**RN17** - Quando uma movimentação de saída for rejeitada por falta de estoque, nenhuma movimentação deverá ser registrada.

**RN18** - Ao tentar registrar uma saída com quantidade superior à disponível em estoque, o sistema deverá retornar a mensagem: "Quantidade solicitada maior que a disponível em estoque."

### 5.3 Exclusão Lógica

**RN19** - A exclusão de produtos deverá ser realizada através de exclusão lógica (soft delete).

**RN20** - Produtos excluídos não poderão receber novas movimentações.

**RN21** - O histórico de movimentações deverá permanecer disponível mesmo após a exclusão de um produto.

**RN22** - Não haverá funcionalidade de restauração de produtos excluídos.

**RN23** - A exclusão de produtos será permitida mesmo quando existir quantidade disponível em estoque.

### 5.4 Consultas

**RN24** - A busca de produtos deverá ser realizada pelo nome.

**RN25** - A busca deverá permitir correspondência parcial do nome informado.

**RN26** - Produtos excluídos não deverão ser retornados nas consultas padrão do sistema.

**RN27** - Produtos excluídos não deverão ser considerados nos resultados de busca.

**RN28** - O histórico de movimentações deverá exibir registros de produtos ativos e também de produtos excluídos.

## 6. Casos de Uso

### UC01 - Cadastrar Produto

Permite cadastrar um novo produto no sistema informando nome, descrição e quantidade inicial.

### UC02 - Consultar Produtos

Permite visualizar a listagem de produtos cadastrados, realizar buscas pelo nome e consultar a quantidade disponível em estoque.

### UC03 - Editar Produto

Permite alterar as informações cadastrais de um produto existente.

### UC04 - Excluir Produto

Permite realizar a exclusão lógica de um produto.

### UC05 - Registrar Entrada de Estoque

Permite adicionar unidades ao estoque de um produto através de uma movimentação do tipo ENTRADA.

### UC06 - Registrar Saída de Estoque

Permite remover unidades do estoque de um produto através de uma movimentação do tipo SAIDA.

### UC07 - Consultar Histórico de Movimentações

Permite visualizar o histórico de entradas e saídas registradas no sistema.

## 7. Fluxos Principais

### FP01 - Cadastro de Produto

1. O usuário informa nome, descrição e quantidade inicial.
    
2. O sistema valida os dados informados.
    
3. O produto é criado.
    
4. Caso a quantidade inicial seja maior que zero, uma movimentação do tipo ENTRADA é criada automaticamente.
    
5. O sistema conclui a operação e retorna sucesso ao usuário.
    

### FP02 - Registro de Entrada de Estoque

1. O usuário acessa a funcionalidade de movimentação de um produto.
    
2. O usuário seleciona o tipo ENTRADA.
    
3. O usuário informa a quantidade e, opcionalmente, uma observação.
    
4. O sistema valida os dados informados.
    
5. A movimentação é registrada.
    
6. A quantidade disponível do produto é atualizada.
    
7. O sistema retorna sucesso ao usuário.
    

### FP03 - Registro de Saída de Estoque

1. O usuário acessa a funcionalidade de movimentação de um produto.
    
2. O usuário seleciona o tipo SAIDA.
    
3. O usuário informa a quantidade e, opcionalmente, uma observação.
    
4. O sistema verifica se existe quantidade suficiente em estoque.
    
5. Caso exista estoque suficiente, a movimentação é registrada e a quantidade disponível é atualizada.
    
6. Caso não exista estoque suficiente, a operação é cancelada e nenhuma movimentação é registrada.
    
7. O sistema informa o resultado ao usuário.
    

### FP04 - Exclusão de Produto

1. O usuário solicita a exclusão de um produto.
    
2. O sistema exibe uma confirmação da operação.
    
3. Caso o produto possua estoque disponível, o sistema exibe um aviso adicional antes da confirmação.
    
4. O usuário confirma a exclusão.
    
5. O sistema realiza a exclusão lógica do produto através do preenchimento do campo `deletedAt`.
    
6. O produto deixa de aparecer nas consultas padrão do sistema.
    
7. O histórico de movimentações permanece disponível para consulta.

## 8. API REST

### Produtos

#### GET /products

Retorna a lista de produtos ativos cadastrados no sistema.

##### Query Parameters

|Parâmetro|Tipo|Obrigatório|Descrição|
|---|---|---|---|
|search|String|Não|Realiza busca parcial pelo nome do produto|

##### Observações

- Retorna apenas produtos ativos.
    
- Os resultados devem ser ordenados alfabeticamente pelo nome.
    

---

#### GET /products/:id

Retorna os dados de um produto específico.

##### Path Parameters

|Parâmetro|Tipo|Descrição|
|---|---|---|
|id|Integer|Identificador do produto|

---

#### POST /products

Cria um novo produto.

##### Body

```json
{
  "name": "Mouse USB",
  "description": "Mouse com fio",
  "initialQuantity": 10
}
```

##### Observações

- Caso `initialQuantity` seja maior que zero, uma movimentação de entrada será criada automaticamente.
    
- O cadastro do produto e da movimentação inicial devem ocorrer na mesma operação.
    

---

#### PUT /products/:id

Atualiza os dados de um produto existente.

##### Path Parameters

|Parâmetro|Tipo|Descrição|
|---|---|---|
|id|Integer|Identificador do produto|

##### Body

```json
{
  "name": "Mouse USB",
  "description": "Mouse atualizado"
}
```

##### Observações

- A quantidade disponível não pode ser alterada por este endpoint.
    

---

#### DELETE /products/:id

Realiza a exclusão lógica de um produto.

##### Path Parameters

|Parâmetro|Tipo|Descrição|
|---|---|---|
|id|Integer|Identificador do produto|

##### Observações

- A exclusão será realizada através do preenchimento do campo `deletedAt`.
    

---

### Movimentações

#### GET /movements

Retorna o histórico de movimentações.

##### Query Parameters

|Parâmetro|Tipo|Obrigatório|Descrição|
|---|---|---|---|
|type|String|Não|Filtra movimentações por tipo (ENTRADA ou SAIDA)|

##### Observações

- As movimentações devem ser retornadas da mais recente para a mais antiga.
    
- O retorno deve incluir informações básicas do produto relacionado.
    

---

#### POST /movements

Registra uma nova movimentação de estoque.

##### Body

```json
{
  "productId": 1,
  "type": "ENTRADA",
  "quantity": 10,
  "observation": "Reposição"
}
```

##### Observações

- `type` deve ser ENTRADA ou SAIDA.
    
- `quantity` deve ser maior que zero.
    
- Não é permitido registrar saídas que resultem em estoque negativo.

## 9. Interface do Sistema

### Navegação

A aplicação possuirá uma navegação simples composta por duas áreas principais:

- Produtos
    
- Histórico
    

### Tela de Produtos

Será a tela principal do sistema.

#### Funcionalidades

- Listagem de produtos ativos.
    
- Busca por nome em tempo real.
    
- Exibição em ordem alfabética.
    
- Destaque visual para produtos com estoque zerado.
    

##### Exibição

Os produtos serão apresentados em formato de tabela.

Campos exibidos:

- Nome
    
- Descrição
    
- Quantidade Atual
    

#### Ações Disponíveis

- Editar
    
- Movimentar
    
- Excluir
    

### Tela de Cadastro de Produto

Permite cadastrar novos produtos.

#### Campos

- Nome
    
- Descrição
    
- Quantidade Inicial
    

### Tela de Edição de Produto

Permite alterar informações cadastrais do produto.

#### Campos

- Nome
    
- Descrição
    

#### Observações

- O campo de quantidade não será exibido.
    
- Alterações de estoque deverão ocorrer exclusivamente por movimentações.
    

### Tela de Movimentação

Permite registrar entradas e saídas de estoque.

O acesso será realizado a partir da listagem de produtos através da ação "Movimentar".

#### Campos

- Produto
    
- Tipo de Movimentação
    
- Quantidade
    
- Observação
    

#### Observações

- O produto já será carregado automaticamente ao acessar a tela.
    
- O campo observação é opcional.
    

### Tela de Histórico

Permite consultar todas as movimentações registradas.

#### Informações Exibidas

- Data
    
- Produto
    
- Tipo
    
- Quantidade
    
- Observação
    

#### Filtros

- Todas
    
- Entradas
    
- Saídas
    

#### Ordenação

As movimentações deverão ser exibidas da mais recente para a mais antiga.

### Confirmação de Exclusão

Antes da exclusão de um produto, o sistema deverá solicitar confirmação do usuário.

Caso o produto possua estoque disponível, uma mensagem de aviso adicional deverá ser exibida antes da confirmação da exclusão.

## 10. Limitações do Projeto

- O sistema não possui autenticação ou controle de usuários, permitindo que qualquer pessoa com acesso à aplicação realize operações.

- Não existe rastreamento de responsáveis pelas movimentações realizadas.

- A listagem de produtos e movimentações não possui paginação.

- O sistema não possui categorização de produtos.

- Não existem relatórios gerenciais ou exportação de dados.

- Não existe dashboard para visualização de indicadores de estoque.

- O sistema suporta apenas um estoque único.

- Produtos excluídos não podem ser restaurados.

- Não existe controle de concorrência para impedir alterações simultâneas sobre o mesmo produto.

- O sistema não possui controle de vendas ou financeiro.

## 11. Melhorias Futuras

As funcionalidades abaixo não fazem parte do escopo atual do projeto, mas podem ser consideradas em versões futuras da aplicação.

### Gestão de Usuários

- Implementação de autenticação de usuários.
    
- Controle de permissões e níveis de acesso.
    
- Registro do usuário responsável por cada movimentação realizada.
    

### Gestão de Produtos

- Cadastro de categorias de produtos.
    
- Cadastro de fornecedores.
    
- Cadastro de preço de compra e preço de venda.
    
- Cadastro de imagens dos produtos.
    

### Consultas e Relatórios

- Paginação das listagens de produtos e movimentações.
    
- Exportação de dados em formatos como PDF e Excel.
    
- Geração de relatórios de movimentações.
    
- Relatórios de produtos com baixo estoque.
    

### Dashboard

- Criação de painel com indicadores de estoque.
    
- Exibição de produtos com estoque crítico.
    
- Exibição das movimentações mais recentes.
    
- Gráficos de entradas e saídas de produtos.
    

### Controle de Estoque

- Suporte a múltiplos estoques.
    
- Transferência de produtos entre estoques.
    
- Funcionalidade de restauração de produtos excluídos.
    
- Controle de inventário e ajustes de estoque.
    

### Módulo de Vendas

- Registro de vendas contendo múltiplos produtos.
    
- Cálculo automático do valor total da venda.
    
- Geração automática das movimentações de saída correspondentes.
    
- Histórico de vendas realizadas.
    

### Gestão Financeira

- Controle de faturamento.
    
- Registro de receitas provenientes das vendas.
    
- Relatórios financeiros.
    
- Cálculo de lucro com base nos preços cadastrados.