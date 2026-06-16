# Tutorial: como criar este projeto do zero

Este guia mostra o passo a passo para montar um projeto Node.js com:

- API com Express
- Frontend simples (HTML/CSS)
- Testes unitarios (Jest)
- Testes de integracao (Jest + Supertest)
- Testes E2E (Playwright)
- Coverage
- Docker e Docker Compose

## 1) Criar projeto e instalar dependencias

```bash
mkdir exemplo-testes
cd exemplo-testes
npm init -y
npm install express
npm install -D jest supertest @playwright/test nodemon
npx playwright install
```

## 2) Criar estrutura de pastas

```bash
mkdir -p src/public src/repositories src/routes src/services src/tests/unit src/tests/integration src/tests/e2e
mkdir -p reports/playwright test-results/playwright
```

Estrutura esperada:

```text
exemplo-testes/
  server.js
  package.json
  jest.config.js
  playwright.config.js
  Dockerfile
  docker-compose.yml
  src/
    app.js
    public/
      index.html
      style.css
    repositories/
      taskRepository.js
    routes/
      tasks.js
    services/
      taskService.js
    tests/
      unit/
        taskService.test.js
      integration/
        tasks.test.js
      e2e/
        tasks.spec.js
```

## 3) Ajustar o package.json

Edite o campo `scripts` para ficar assim:

```json
{
  "name": "todo-ci-cd",
  "scripts": {
    "build": "npm ci --omit=dev",
    "start": "node server.js",
    "dev": "nodemon server.js",
    "test": "jest",
    "test:unit": "jest tests/unit",
    "test:integration": "jest tests/integration",
    "test:coverage": "jest --coverage",
    "test:coverage:unit": "jest tests/unit --coverage",
    "test:coverage:integration": "jest tests/integration --coverage",
    "test:e2e": "playwright test",
    "test:e2e:ui": "playwright test --ui",
    "ci": "npm run test:coverage && npm run test:e2e"
  }
}
```

Observacao:

- O script `build` prepara o ambiente de producao instalando somente dependencias de runtime.

## 4) Criar servidor de entrada

Arquivo: `server.js`

```js
const app = require("./src/app");

app.listen(3030, () => {
  console.log("Servidor iniciado");
});
```

## 5) Criar app Express

Arquivo: `src/app.js`

```js
const express = require("express");
const path = require("path");

const tasksRouter = require("./routes/tasks");

const app = express();

app.use(express.static(path.join(__dirname, "public")));
app.use("/tasks", tasksRouter);

module.exports = app;
```

## 6) Criar camada de repositorio

Arquivo: `src/repositories/taskRepository.js`

```js
const tasks = [];

function save(task) {
  tasks.push(task);
}

function findAll() {
  return tasks;
}

module.exports = {
  save,
  findAll,
};
```

## 7) Criar camada de servico

Arquivo: `src/services/taskService.js`

```js
const repository = require("../repositories/taskRepository");

function addTask(title) {
  if (!title) {
    throw new Error("Titulo obrigatorio");
  }

  if (typeof title !== "string") {
    throw new Error("Titulo deve ser uma string");
  }

  const task = {
    id: Date.now(),
    title,
  };

  repository.save(task);

  return task;
}

function getTasks() {
  return repository.findAll();
}

module.exports = {
  addTask,
  getTasks,
};
```

## 8) Criar rotas

Arquivo: `src/routes/tasks.js`

```js
const express = require("express");
const router = express.Router();

const taskService = require("../services/taskService");

router.get("/", (req, res) => {
  res.json(taskService.getTasks());
});

router.post("/", express.json(), (req, res) => {
  try {
    const task = taskService.addTask(req.body.title);

    res.status(201).json(task);
  } catch (err) {
    res.status(400).json({
      error: err.message,
    });
  }
});

module.exports = router;
```

## 9) Criar frontend simples

Arquivo: `src/public/index.html`

```html
<!DOCTYPE html>
<html>
  <head>
    <title>Lista de Tarefas</title>
    <link rel="stylesheet" href="style.css" />
  </head>

  <body>
    <h1>Lista de Tarefas</h1>

    <input id="title" placeholder="Nova tarefa" />

    <button onclick="adicionar()">Adicionar</button>

    <ul id="lista"></ul>

    <script>
      async function carregar() {
        const res = await fetch("/tasks");
        const tarefas = await res.json();

        lista.innerHTML = "";

        tarefas.forEach((t) => {
          lista.innerHTML += `<li>${t.title}</li>`;
        });
      }

      async function adicionar() {
        await fetch("/tasks", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            title: title.value,
          }),
        });

        title.value = "";

        carregar();
      }

      carregar();
    </script>
  </body>
</html>
```

Arquivo: `src/public/style.css`

```css
body {
  font-family: Arial;
  max-width: 600px;
  margin: auto;
  padding: 40px;
}

input,
button {
  padding: 10px;
  font-size: 16px;
}

li {
  margin: 8px 0;
}
```

## 10) Configurar Jest

Arquivo: `jest.config.js`

```js
module.exports = {
  testPathIgnorePatterns: ["/node_modules/", "/src/tests/e2e/"],
};
```

## 11) Criar testes unitarios

Arquivo: `src/tests/unit/taskService.test.js`

```js
jest.mock("../../repositories/taskRepository", () => ({
  save: jest.fn(),
  findAll: jest.fn(),
}));

const repository = require("../../repositories/taskRepository");
const taskService = require("../../services/taskService");

describe("Task Service", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("deve criar tarefa", () => {
    const tarefa = taskService.addTask("Estudar");

    expect(tarefa.title).toBe("Estudar");

    expect(repository.save).toHaveBeenCalledTimes(1);

    expect(repository.save).toHaveBeenCalledWith(tarefa);
  });

  test("deve lancar erro sem titulo", () => {
    expect(() => {
      taskService.addTask("");
    }).toThrow("Titulo obrigatorio");

    expect(repository.save).not.toHaveBeenCalled();
  });

  test("deve listar tarefas", () => {
    repository.findAll.mockReturnValue([
      { id: 1, title: "Tarefa 1" },
      { id: 2, title: "Tarefa 2" },
    ]);

    const tarefas = taskService.getTasks();

    expect(tarefas).toHaveLength(2);

    expect(repository.findAll).toHaveBeenCalledTimes(1);
  });
});
```

## 12) Criar testes de integracao

Arquivo: `src/tests/integration/tasks.test.js`

```js
const request = require("supertest");

const app = require("../../app");

describe("API de tarefas", () => {
  test("POST /tasks", async () => {
    const response = await request(app).post("/tasks").send({
      title: "Comprar pao",
    });

    expect(response.statusCode).toBe(201);

    expect(response.body.title).toBe("Comprar pao");
  });
});

describe("API de tarefas - validacao", () => {
  test("POST /tasks - titulo obrigatorio", async () => {
    const response = await request(app).post("/tasks").send({});
    expect(response.statusCode).toBe(400);
    expect(response.body.error).toBe("Titulo obrigatorio");
  });

  test("POST /tasks - titulo deve ser string", async () => {
    const response = await request(app).post("/tasks").send({
      title: 123,
    });
    expect(response.statusCode).toBe(400);
    expect(response.body.error).toBe("Titulo deve ser uma string");
  });
});
```

## 13) Configurar Playwright

Arquivo: `playwright.config.js`

```js
module.exports = {
  testDir: "./src/tests/e2e",

  testMatch: "*.spec.js",

  use: {
    baseURL: "http://localhost:3030",

    screenshot: "only-on-failure",
    video: "retain-on-failure",
    trace: "retain-on-failure",
  },

  reporter: [
    [
      "html",
      {
        outputFolder: "./reports/playwright",
        open: "never",
      },
    ],
  ],

  outputDir: "./test-results/playwright",

  webServer: {
    command: "npm start",
    url: "http://localhost:3030",
    reuseExistingServer: true,
  },
};
```

Arquivo: `src/tests/e2e/tasks.spec.js`

```js
const { test, expect } = require("@playwright/test");

test("adicionar tarefa", async ({ page }) => {
  await page.goto("http://localhost:3030");

  await page.fill("#title", "Ler livro");

  await page.click("button");

  await expect(page.locator("li")).toContainText("Ler livro");
});
```

## 14) Configurar Docker

Arquivo: `Dockerfile`

```dockerfile
FROM node:24-alpine

WORKDIR /app

COPY package*.json ./

RUN npm ci --omit=dev

COPY . .

EXPOSE 3030

CMD ["npm", "start"]
```

Arquivo: `docker-compose.yml`

```yaml
services:
  app:
    build: .
    ports:
      - "3030:3030"
```

## 15) Rodar localmente

Desenvolvimento:

```bash
npm run dev
```

Execucao padrao:

```bash
npm start
```

Abrir no navegador:

```text
http://localhost:3030
```

## 16) Rodar testes

Unitarios:

```bash
npm run test:unit
```

Integracao:

```bash
npm run test:integration
```

Todos os testes Jest:

```bash
npm test
```

Coverage:

```bash
npm run test:coverage
```

E2E:

```bash
npm run test:e2e
```

Pipeline local (simula CI):

```bash
npm run ci
```

## 17) Rodar com Docker

```bash
docker compose up --build
```

Parar containers:

```bash
docker compose down
```
