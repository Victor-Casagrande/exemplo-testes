const { test, expect } = require("@playwright/test");

test("adicionar tarefa", async ({ page }) => {

    await page.goto("http://localhost:3030");

    await page.fill("#title", "Ler livro");

    await page.click("button");

    await expect(page.locator("li"))
        .toContainText("Ler livro");

});