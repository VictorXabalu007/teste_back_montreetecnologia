# API Lista de Compras Aleatórias

**Desenvolvedor:** João Victor Nogueira Barbosa

API REST desenvolvida com AdonisJS para gerenciar um catálogo de itens e registrar compras com compradores aleatórios obtidos da API do GitHub.

## 📋 Sobre o Projeto

Esta API foi desenvolvida como parte de um desafio técnico para demonstrar habilidades em:
- Criação de APIs REST
- Modelagem de dados e relacionamentos
- Integração com APIs externas
- Boas práticas de arquitetura (MVC)
- Testes automatizados

## 🚀 Tecnologias Utilizadas

- **AdonisJS 6** - Framework Node.js
- **Lucid ORM** - ORM para gerenciamento de banco de dados
- **SQLite** - Banco de dados
- **VineJS** - Validação de dados
- **Japa** - Framework de testes

## 📋 Pré-requisitos

Antes de começar, certifique-se de ter instalado em sua máquina:
- **Node.js v20.6.0** ou superior
- **npm** (geralmente vem com o Node.js)

## 📦 Instalação

```bash
# Clone o repositório
git clone <seu-repositorio>
cd backend

# Instale as dependências
npm install

# Configure o arquivo .env
cp .env.example .env

# Gere a APP_KEY
node ace generate:key

# Execute as migrations
node ace migration:run

# Inicie o servidor de desenvolvimento
npm run dev
```

O servidor estará rodando em `http://localhost:3333`

## 📖 Documentação da API (Swagger)

A API possui documentação interativa via Swagger. Para acessar:

1. Inicie o servidor: `npm run dev`
2. Acesse: `http://localhost:3333/docs`

Lá você encontrará todos os detalhes dos endpoints, esquemas de dados e poderá testar as requisições diretamente pelo navegador.

### 💜 Insomnia

Na raiz do projeto, você encontrará o arquivo `insomnia_collection.json`. Ele contém todas as rotas da API configuradas e prontas para uso.

Para utilizar:
1. Abra o [Insomnia](https://insomnia.rest/).
2. Clique em **Import** -> **File**.
3. Selecione o arquivo `insomnia_collection.json`.

## 🔌 Endpoints da API

### Itens

#### `POST /itens`
Cria um novo item no catálogo.

**Body:**
```json
{
  "nome": "Notebook Dell",
  "preco": 3500.00,
  "qtd_atual": 10
}
```

**Resposta (201):**
```json
{
  "id": 1,
  "nome": "Notebook Dell",
  "preco": 3500.00,
  "qtd_atual": 10,
  "created_at": "2024-01-01T00:00:00.000Z",
  "updated_at": "2024-01-01T00:00:00.000Z"
}
```

#### `GET /itens`
Lista todos os itens cadastrados.

**Resposta (200):**
```json
[
  {
    "id": 1,
    "nome": "Notebook Dell",
    "preco": 3500.00,
    "qtd_atual": 10,
    "created_at": "2024-01-01T00:00:00.000Z",
    "updated_at": "2024-01-01T00:00:00.000Z"
  }
]
```

### Compras

#### `POST /compras`
Registra uma nova compra com um comprador aleatório do GitHub.

**Body:**
```json
{
  "item_id": 1
}
```

**Resposta (201):**
```json
{
  "id": 1,
  "item_id": 1,
  "comprador_github_login": "octocat",
  "created_at": "2024-01-01T00:00:00.000Z",
  "updated_at": "2024-01-01T00:00:00.000Z",
  "item": {
    "id": 1,
    "nome": "Notebook Dell",
    "preco": 3500.00,
    "qtd_atual": 9
  }
}
```

**Possíveis Erros:**
- `404` - Item não encontrado
- `400` - Estoque insuficiente
- `503` - API do GitHub indisponível

#### `GET /compras`
Lista todas as compras com detalhes do item.

**Resposta (200):**
```json
[
  {
    "id": 1,
    "item_id": 1,
    "comprador_github_login": "octocat",
    "created_at": "2024-01-01T00:00:00.000Z",
    "updated_at": "2024-01-01T00:00:00.000Z",
    "item": {
      "id": 1,
      "nome": "Notebook Dell",
      "preco": 3500.00,
      "qtd_atual": 9
    }
  }
]
```

## 🧪 Testes

Execute os testes automatizados:

```bash
npm test
```

Os testes cobrem:
- ✅ Criação e listagem de itens
- ✅ Validação de dados
- ✅ Criação de compras com sucesso
- ✅ Tratamento de erros (item inexistente, sem estoque, GitHub offline)

## 📁 Estrutura do Projeto

```
backend/
├── app/
│   ├── controllers/     # Controladores (ItemsController, ComprasController)
│   ├── models/          # Modelos (Item, Compra, User)
│   ├── services/        # Serviços (GithubService)
│   └── validators/      # Validadores (item.ts, compra.ts)
├── database/
│   └── migrations/      # Migrations do banco de dados
├── start/
│   └── routes.ts        # Definição de rotas
└── tests/
    └── functional/      # Testes funcionais
```

## 🛠️ O Comando Ace

O AdonisJS utiliza um utilitário de linha de comando chamado **Ace**. Você verá muitos comandos começando com `node ace`. Ele é o "canivete suíço" do framework, servindo para gerar modelos, controladores, gerenciar o banco de dados e muito mais.

Para ver todos os comandos disponíveis, você pode rodar:
```bash
node ace --help
```

## 🔧 Variáveis de Ambiente

```env
PORT=3333
HOST=localhost
NODE_ENV=development
APP_KEY=<sua-chave-gerada>
DB_CONNECTION=sqlite
```

## 📝 Notas Técnicas

- **Transações:** Operações de compra utilizam transações para garantir consistência (decremento de estoque + criação da compra)
- **Validação:** Todas as entradas são validadas usando VineJS
- **Tratamento de Erros:** Respostas HTTP apropriadas para diferentes cenários de erro
- **Relacionamentos:** Lucid ORM gerencia relacionamentos entre Compra e Item

## 📄 Licença

Este projeto foi desenvolvido para fins educacionais.
