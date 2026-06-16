# Todo CI/CD - Exemplo de Testes Automatizados com Node.js

## Descrição

Este projeto é um exemplo didático para demonstrar um fluxo moderno de desenvolvimento utilizando:

- Node.js e Express;
- HTML e CSS puros;
- Testes unitários;
- Testes de integração;
- Testes End-to-End (E2E);
- Cobertura de testes (Coverage);
- Docker e Docker Compose;
- GitHub Actions para Integração Contínua (CI/CD).

O objetivo é apresentar, de forma simples, como diferentes tipos de testes são aplicados em uma aplicação web real e como podem ser automatizados.

---

## Tecnologias utilizadas

- Node.js
- Express
- Jest
- Supertest
- Playwright
- Docker
- Docker Compose
- GitHub Actions

---

## Instalação

Clone o repositório:

```bash
git clone https://github.com/seu-usuario/todo-ci-cd.git

cd todo-ci-cd
```

Instale as dependências:

```bash
npm install
```

Para ambiente de produção (somente dependências de runtime):

```bash
npm run build
```

Instale os navegadores utilizados pelo Playwright:

```bash
npx playwright install
```

---

## Executando a aplicação

Inicie o servidor:

```bash
npm start # ou npm run dev para desenvolvimento com hot reload
```

A aplicação ficará disponível em:

```text
http://localhost:3030
```

---

## Executando os testes

### Testes unitários

Executam apenas a lógica de negócio.

```bash
npm run test:unit
```

---

### Testes de integração

Executam a API completa.

```bash
npm run test:integration
```

---

### Todos os testes do Jest

Executam os testes unitários e de integração.

```bash
npm test
```

ou

```bash
npm run test
```

---

### Testes End-to-End (E2E)

Primeiro, inicie a aplicação:

```bash
npm start
```

Em outro terminal, execute:

```bash
npm run test:e2e
```

---

### Interface gráfica do Playwright

Permite visualizar a execução dos testes E2E.

```bash
npm run test:e2e:ui
```

---

## Cobertura de testes (Coverage)

### Coverage completo

Gera cobertura para todos os testes executados pelo Jest.

```bash
npm run test:coverage
```

---

### Coverage dos testes unitários

```bash
npm run test:coverage:unit
```

---

### Coverage dos testes de integração

```bash
npm run test:coverage:integration
```

---

## Relatório de cobertura

Após executar qualquer comando com cobertura, será criado o diretório:

```text
coverage/
├── clover.xml
├── coverage-final.json
├── lcov.info
└── lcov-report/
    └── index.html
```

Abra o arquivo abaixo no navegador:

```text
coverage/lcov-report/index.html
```

O relatório apresenta:

- percentual de cobertura por arquivo;
- linhas testadas;
- linhas não testadas;
- cobertura de funções;
- cobertura de decisões (branches).

---

## Executando tudo como na CI

O comando abaixo executa o mesmo fluxo utilizado na integração contínua:

```bash
npm run ci
```

Fluxo executado:

1. Testes unitários;
2. Testes de integração;
3. Verificação de cobertura;
4. Inicialização da aplicação;
5. Testes E2E.

---

## Executando com Docker

Construa e execute os containers:

```bash
docker compose up --build
```

A aplicação ficará disponível em:

```text
http://localhost:3030
```

Para interromper os containers:

```bash
docker compose down
```

---

## Integração Contínua (GitHub Actions)

A pipeline é executada automaticamente quando ocorre:

- push para o repositório;
- abertura de Pull Requests.

Etapas executadas:

1. Checkout do código;
2. Instalação das dependências;
3. Instalação dos navegadores do Playwright;
4. Testes unitários;
5. Testes de integração;
6. Verificação da cobertura;
7. Inicialização da aplicação;
8. Testes E2E.

Caso algum teste falhe, a pipeline é interrompida automaticamente.

---

## Cobertura mínima

O projeto pode exigir níveis mínimos de cobertura por meio do Jest.

Exemplo:

```json
{
  "coverageThreshold": {
    "global": {
      "branches": 80,
      "functions": 90,
      "lines": 90,
      "statements": 90
    }
  }
}
```
