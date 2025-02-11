import { test, expect } from "@playwright/test"

test.describe("Criar Conta", () => {
  test("deve criar uma nova conta com sucesso", async ({ page }) => {
    // Fazer login
    await page.goto("/login")
    await page.getByRole("button", { name: "Já possuo conta" }).click()
    await page.getByLabel("E-mail").fill("user@example.com")
    await page.getByLabel("Senha").fill("password123")
    await page.getByRole("button", { name: "Entrar" }).click()

    // Navegar para a página de criar conta
    await page.getByRole("button", { name: "Nova Assinatura" }).click()

    // Preencher o formulário
    await page.getByLabel("Nome do Serviço").fill("Netflix")
    await page.getByLabel("Data de Início").fill("2024-03-20")
    await page.getByLabel("Data de Expiração").fill("2025-03-20")
    await page.getByLabel("Número de Usuários").fill("4")
    await page.getByLabel("Preço").fill("45.90")

    // Enviar o formulário
    await page.getByRole("button", { name: "Criar Assinatura" }).click()

    // Verificar se foi redirecionado para a página principal
    await expect(page).toHaveURL("/app")

    // Verificar se a mensagem de sucesso apareceu
    await expect(page.getByText("Assinatura criada com sucesso!")).toBeVisible()

    // Verificar se a nova assinatura aparece na lista
    await expect(page.getByText("Netflix")).toBeVisible()
    await expect(page.getByText("R$ 45.90")).toBeVisible()
  })

  test("deve validar campos obrigatórios", async ({ page }) => {
    // Fazer login
    await page.goto("/login")
    await page.getByRole("button", { name: "Já possuo conta" }).click()
    await page.getByLabel("E-mail").fill("user@example.com")
    await page.getByLabel("Senha").fill("password123")
    await page.getByRole("button", { name: "Entrar" }).click()

    // Navegar para a página de criar conta
    await page.getByRole("button", { name: "Nova Assinatura" }).click()

    // Tentar enviar o formulário vazio
    await page.getByRole("button", { name: "Criar Assinatura" }).click()

    // Verificar mensagens de erro
    await expect(page.getByText("O nome do serviço é obrigatório")).toBeVisible()
    await expect(page.getByText("A data de início é obrigatória")).toBeVisible()
    await expect(page.getByText("A data de expiração é obrigatória")).toBeVisible()
    await expect(page.getByText("O número de usuários é obrigatório")).toBeVisible()
    await expect(page.getByText("O preço é obrigatório")).toBeVisible()
  })

  test("deve permitir voltar para a página principal", async ({ page }) => {
    // Fazer login
    await page.goto("/login")
    await page.getByRole("button", { name: "Já possuo conta" }).click()
    await page.getByLabel("E-mail").fill("user@example.com")
    await page.getByLabel("Senha").fill("password123")
    await page.getByRole("button", { name: "Entrar" }).click()

    // Navegar para a página de criar conta
    await page.getByRole("button", { name: "Nova Assinatura" }).click()

    // Clicar no botão voltar
    await page.getByRole("button", { name: "Voltar" }).click()

    // Verificar se voltou para a página principal
    await expect(page).toHaveURL("/app")
  })
})
