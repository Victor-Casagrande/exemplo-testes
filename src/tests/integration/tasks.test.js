const request = require("supertest");
const app = require("../../app");
const repository = require("../../repositories/taskRepository");

// ─── Helpers ────────────────────────────────────────────────────────────────

/**
 * Reseta o estado interno do repositório entre testes.
 * Acessa diretamente o array interno via referência mutável.
 */
function resetRepository() {
  const tasks = repository.findAll();
  tasks.splice(0, tasks.length);
}

// ─── Describe separado com beforeEach que reseta o estado (tarefa 9) ────────

describe("Integração — Rotas /tasks", () => {
  beforeEach(() => {
    resetRepository();
  });

  // 1. GET /tasks retorna status 200 e array JSON
  test("1. GET /tasks retorna status 200 e um array JSON", async () => {
    const res = await request(app).get("/tasks");

    expect(res.status).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
  });

  // 2. POST /tasks com title válido retorna 201 e objeto com id e title
  test("2. POST /tasks com title válido retorna 201 e objeto com id e title", async () => {
    const res = await request(app)
      .post("/tasks")
      .send({ title: "Estudar Jest" })
      .set("Content-Type", "application/json");

    expect(res.status).toBe(201);
    expect(res.body).toHaveProperty("id");
    expect(res.body).toHaveProperty("title", "Estudar Jest");
  });

  // 3. POST /tasks sem title retorna 400 e { error: "Titulo obrigatorio" }
  test("3. POST /tasks sem title retorna 400 e mensagem correta", async () => {
    const res = await request(app)
      .post("/tasks")
      .send({})
      .set("Content-Type", "application/json");

    expect(res.status).toBe(400);
    expect(res.body).toEqual({ error: "Titulo obrigatorio" });
  });

  // 4. POST /tasks com title sendo número retorna 400
  test("4. POST /tasks com title sendo número retorna 400", async () => {
    const res = await request(app)
      .post("/tasks")
      .send({ title: 42 })
      .set("Content-Type", "application/json");

    expect(res.status).toBe(400);
  });

  // 5. Após POST bem-sucedido, GET /tasks inclui a tarefa criada
  test("5. Após POST bem-sucedido, GET /tasks inclui a tarefa criada", async () => {
    await request(app)
      .post("/tasks")
      .send({ title: "Tarefa Nova" })
      .set("Content-Type", "application/json");

    const res = await request(app).get("/tasks");

    expect(res.status).toBe(200);
    expect(res.body.some((t) => t.title === "Tarefa Nova")).toBe(true);
  });

  // 6. DELETE /tasks/:id — 204 para id válido, 404 para id inexistente
  describe("6. DELETE /tasks/:id", () => {
    test("retorna 204 para id válido", async () => {
      const postRes = await request(app)
        .post("/tasks")
        .send({ title: "Para Deletar" })
        .set("Content-Type", "application/json");

      const { id } = postRes.body;

      const deleteRes = await request(app).delete(`/tasks/${id}`);
      expect(deleteRes.status).toBe(204);
    });

    test("retorna 404 para id inexistente", async () => {
      const deleteRes = await request(app).delete("/tasks/99999");
      expect(deleteRes.status).toBe(404);
    });
  });

  // 7. POST /tasks com título menor que 3 caracteres retorna 400 e mensagem correta
  test("7. POST /tasks com título menor que 3 caracteres retorna 400", async () => {
    const res = await request(app)
      .post("/tasks")
      .send({ title: "ab" })
      .set("Content-Type", "application/json");

    expect(res.status).toBe(400);
    expect(res.body).toEqual({ error: "Titulo muito curto" });
  });

  // 8. GET /tasks/:id retorna tarefa específica ou 404
  describe("8. GET /tasks/:id", () => {
    test("retorna a tarefa com o id correto", async () => {
      const postRes = await request(app)
        .post("/tasks")
        .send({ title: "Tarefa Específica" })
        .set("Content-Type", "application/json");

      const { id } = postRes.body;

      const getRes = await request(app).get(`/tasks/${id}`);
      expect(getRes.status).toBe(200);
      expect(getRes.body).toHaveProperty("id", id);
      expect(getRes.body).toHaveProperty("title", "Tarefa Específica");
    });

    test("retorna 404 se o id não existir", async () => {
      const getRes = await request(app).get("/tasks/99999");
      expect(getRes.status).toBe(404);
    });
  });

  // 10. test.each para múltiplos payloads inválidos no POST /tasks
  test.each([
    [{ title: "" }, "Titulo obrigatorio"],
    [{ title: "ab" }, "Titulo muito curto"],
    [{ title: 42 }, "Título deve ser uma string"],
    [{ title: null }, "Titulo obrigatorio"],
    [{ title: [] }, "Título deve ser uma string"],
    [{ title: {} }, "Título deve ser uma string"],
    [{}, "Titulo obrigatorio"],
  ])(
    "10. POST /tasks com payload inválido %p retorna 400",
    async (payload, expectedError) => {
      const res = await request(app)
        .post("/tasks")
        .send(payload)
        .set("Content-Type", "application/json");

      expect(res.status).toBe(400);
      expect(res.body.error).toBe(expectedError);
    }
  );
});
