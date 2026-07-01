const { test, expect } = require("@playwright/test");

// ─── Helpers ────────────────────────────────────────────────────────────────

/**
 * Reseta o estado do servidor entre testes E2E via DELETE de todas as tarefas.
 * Busca todas as tarefas e as remove uma a uma.
 */
async function resetServerState(request) {
  const res = await request.get("http://localhost:3030/tasks");
  const tasks = await res.json();
  for (const task of tasks) {
    await request.delete(`http://localhost:3030/tasks/${task.id}`);
  }
}

// ─── Testes E2E ──────────────────────────────────────────────────────────────

test.describe("E2E — Lista de Tarefas", () => {
  test.beforeEach(async ({ page, request }) => {
    await resetServerState(request);
    await page.goto("/");
  });

  // 1. A página contém o texto "Lista de Tarefas" em um h1
  test("1. Página contém 'Lista de Tarefas' em um h1", async ({ page }) => {
    const h1 = page.locator("h1");
    await expect(h1).toHaveText("Lista de Tarefas");
  });

  // 2. O campo #title está vazio e o botão "Adicionar" está visível ao carregar
  test("2. Campo #title está vazio e botão 'Adicionar' está visível ao carregar", async ({
    page,
  }) => {
    const titleInput = page.locator("#title");
    const addButton = page.locator("button", { hasText: "Adicionar" });

    await expect(titleInput).toHaveValue("");
    await expect(addButton).toBeVisible();
  });

  // 3. Adiciona uma tarefa e verifica que ela aparece na lista
  test("3. Adicionar uma tarefa faz ela aparecer na lista", async ({ page }) => {
    await page.locator("#title").fill("Tarefa de Teste");
    await page.locator("button", { hasText: "Adicionar" }).click();

    await expect(page.locator("#lista li")).toContainText(["Tarefa de Teste"]);
  });

  // 4. O campo #title fica vazio após adicionar uma tarefa
  test("4. Campo #title fica vazio após adicionar uma tarefa", async ({
    page,
  }) => {
    await page.locator("#title").fill("Tarefa Qualquer");
    await page.locator("button", { hasText: "Adicionar" }).click();

    // Aguarda a lista atualizar antes de verificar o campo
    await expect(page.locator("#lista li")).toHaveCount(1);
    await expect(page.locator("#title")).toHaveValue("");
  });

  // 5. Adiciona 3 tarefas em sequência e verifica que a lista contém exatamente 3 itens li
  test("5. Adicionar 3 tarefas resulta em exatamente 3 itens na lista", async ({
    page,
  }) => {
    const input = page.locator("#title");
    const btn = page.locator("button", { hasText: "Adicionar" });

    await input.fill("Tarefa Alpha");
    await btn.click();
    await expect(page.locator("#lista li")).toHaveCount(1);

    await input.fill("Tarefa Beta");
    await btn.click();
    await expect(page.locator("#lista li")).toHaveCount(2);

    await input.fill("Tarefa Gamma");
    await btn.click();
    await expect(page.locator("#lista li")).toHaveCount(3);
  });

  // 6. Verifica a ordem de inserção: "Tarefa A" antes de "Tarefa B"
  test("6. Ordem de inserção é preservada na lista", async ({ page }) => {
    const input = page.locator("#title");
    const btn = page.locator("button", { hasText: "Adicionar" });

    await input.fill("Tarefa A");
    await btn.click();
    await expect(page.locator("#lista li")).toHaveCount(1);

    await input.fill("Tarefa B");
    await btn.click();
    await expect(page.locator("#lista li")).toHaveCount(2);

    const items = page.locator("#lista li");
    await expect(items.nth(0)).toHaveText("Tarefa A");
    await expect(items.nth(1)).toHaveText("Tarefa B");
  });

  // 7. Adiciona uma tarefa, recarrega a página e verifica que ela ainda aparece
  test("7. Tarefa persiste após recarregar a página", async ({ page }) => {
    await page.locator("#title").fill("Tarefa Persistente");
    await page.locator("button", { hasText: "Adicionar" }).click();
    await expect(page.locator("#lista li")).toHaveCount(1);

    await page.reload();

    await expect(page.locator("#lista li")).toContainText([
      "Tarefa Persistente",
    ]);
  });

  // 8. Adiciona tarefa com caracteres especiais e verifica exibição correta
  test("8. Tarefa com caracteres especiais é exibida corretamente", async ({
    page,
  }) => {
    const titulo = "Reunião às 18h & revisão";

    await page.locator("#title").fill(titulo);
    await page.locator("button", { hasText: "Adicionar" }).click();

    await expect(page.locator("#lista li")).toContainText([titulo]);
  });

  // 9. Pressionar Enter no campo submete o formulário
  test("9. Pressionar Enter no campo #title adiciona a tarefa", async ({
    page,
  }) => {
    await page.locator("#title").fill("Tarefa via Enter");
    await page.keyboard.press("Enter");

    await expect(page.locator("#lista li")).toContainText(["Tarefa via Enter"]);
  });
});
