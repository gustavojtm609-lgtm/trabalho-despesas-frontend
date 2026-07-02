# Financier - Controle de Despesas

Este projeto é o front-end de um sistema de controle de despesas chamado **Financier**.
Ele foi desenvolvido em **React** com **Vite** e se comunica com uma API backend para realizar login, cadastro, gerenciamento de categorias, despesas e dashboard.

## Tecnologias utilizadas

* React
* Vite
* JavaScript
* React Router DOM
* Axios
* Context API
* CSS

## Como rodar o projeto

## Configuração do banco de dados

Para o projeto funcionar corretamente, é necessário criar um banco de dados no MySQL pelo XAMPP.

### Nome do banco de dados

O banco de dados deve ser criado com o nome:

```sql
mvc
```

### Como criar no XAMPP

1. Abra o **XAMPP**.
2. Inicie o **Apache** e o **MySQL**.
3. Acesse o navegador e entre em:

```txt
http://localhost/phpmyadmin
```

4. Clique em **Novo**.
5. No nome do banco, digite:

```txt
mvc
```

6. Clique em **Criar**.

Depois disso, o backend poderá se conectar ao banco de dados MySQL usando esse banco chamado `mvc`.


### 1. Baixar o projeto

Clone o repositório ou baixe o projeto na sua máquina.

Depois, entre na pasta do projeto pelo terminal:

```bash
cd trabalho-despesas-frontend
```

Caso o projeto esteja dentro de outra pasta, entre na pasta onde está o arquivo `package.json`.

---

### 2. Instalar as dependências

Antes de rodar o projeto, instale as dependências com o comando:

```bash
npm install
```

Esse comando instala todas as bibliotecas necessárias para o projeto funcionar.

---

### 3. Configurar a URL da API

O front-end precisa se comunicar com o backend.
Para isso, crie um arquivo chamado `.env` na raiz do projeto.

Dentro dele, coloque:

```env
VITE_API_URL=http://localhost:3000
```

Essa URL indica que o backend está rodando localmente na porta `3000`.

---

### 4. Rodar o backend

Antes de iniciar o front-end, é necessário deixar a API backend rodando em outro terminal.

No projeto do backend, use:

```bash
npm start
```

O backend precisa estar funcionando em:

```txt
http://localhost:3000
```

---

### 5. Rodar o front-end

Depois de instalar as dependências e configurar o `.env`, rode o projeto com:

```bash
npm run dev
```

Ou também:

```bash
npm start
```

O terminal irá mostrar um endereço parecido com este:

```txt
http://localhost:5173
```

Abra esse endereço no navegador para acessar o sistema.

---

## Estrutura principal do projeto

```txt
src/
├── components/
├── contexts/
├── hooks/
├── pages/
├── routes/
├── services/
└── styles/
```

### Principais pastas

* `components`: guarda componentes reutilizáveis, como Navbar, Alert e Loading.
* `contexts`: guarda os contextos globais, como autenticação e tema.
* `pages`: guarda as telas principais do sistema, como Login, Cadastro, Dashboard, Categorias e Despesas.
* `routes`: controla as rotas da aplicação.
* `services`: contém a configuração da API.
* `styles`: contém os arquivos CSS do projeto.

---

## Comunicação com a API

A comunicação com o backend está centralizada no arquivo:

```txt
src/services/api.js
```

Esse arquivo configura o Axios e define a URL base da API.

Também existe um interceptor que envia automaticamente o token do usuário nas requisições protegidas.

---

## Funcionalidades do sistema

* Cadastro de usuário
* Login
* Logout
* Sessão salva com `localStorage`
* Rotas protegidas
* Dashboard com dados da API
* Cadastro de categorias
* Listagem de categorias
* Edição de categorias
* Exclusão de categorias
* Cadastro de despesas
* Listagem de despesas
* Edição de despesas
* Exclusão de despesas
* Filtros de despesas
* Modo escuro
* Mensagens de erro e carregamento

---

## Rotas da API utilizadas

### Autenticação

```txt
POST /users
POST /auth/login
```

### Categorias

```txt
GET /categories
POST /categories
PUT /categories/:id
DELETE /categories/:id
```

### Despesas

```txt
GET /expenses
POST /expenses
PUT /expenses/:id
DELETE /expenses/:id
```

### Dashboard

```txt
GET /dashboard/total-expenses
GET /dashboard/expenses-count
GET /dashboard/expenses-by-category
```

---

## Observações importantes

* O backend precisa estar rodando antes do front-end.
* O arquivo `.env` deve ficar na raiz do projeto.
* A pasta `node_modules` não precisa ser enviada para o GitHub.
* Quem baixar o projeto deve rodar `npm install` para instalar as dependências.
* O projeto utiliza Vite, então a porta padrão do front-end normalmente é `5173`.

---

## Comandos principais

Instalar dependências:

```bash
npm install
```

Rodar o projeto:

```bash
npm run dev
```

Gerar versão final do projeto:

```bash
npm run build
```

Visualizar versão final:

```bash
npm run preview
```
