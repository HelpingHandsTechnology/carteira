import { test as base, expect, Page } from "@playwright/test"

// Test fixtures with custom types
type TestFixtures = {
  loggedInPage: Page
}

// Types for entities
type User = {
  id?: string
  name: string
  email: string
  password: string
}

type Subscription = {
  id?: string
  name: string
  startDate: string
  endDate: string
  numberOfUsers: string
  price: string
}

const test = base.extend<TestFixtures>({
  loggedInPage: async ({ page }, use) => {
    // Configure API logs
    page.on("request", (request) => {
      if (request.url().includes("/api")) {
        console.log(`>> ${request.method()} ${request.url()}`)
        console.log("Request Body:", request.postData())
      }
    })
    page.on("response", async (response) => {
      if (response.url().includes("/api")) {
        console.log(`<< ${response.status()} ${response.url()}`)
        try {
          const body = await response.json()
          console.log("Response Body:", body)
        } catch (e) {
          console.log("Could not parse response body")
        }
      }
    })

    await use(page)
  },
})

test.describe("Account Creation", () => {
  test.beforeEach(async () => {
    console.log("Recreating database...")
  })

  test("should create an account and login successfully", async ({ page }) => {
    test.setTimeout(60000) // Increase timeout to 60 seconds

    // Create account
    const user = await createAccount(page, {
      email: "user@example.com",
      password: "password123",
      name: "Test User",
    })

    // Create subscription
    const subscription = await createSubscription(page, {
      name: "Netflix",
      startDate: "2024-03-20",
      endDate: "2025-03-20",
      numberOfUsers: "4",
      price: "45.90",
    })

    // Verify subscription in list
    await verifySubscriptionInList(page, {
      name: subscription.name,
      price: subscription.price,
    })

    console.log("Test completed successfully")
    console.log("Created User:", user)
    console.log("Created Subscription:", subscription)
  })
})

// Reusable actions
async function createAccount(page: Page, userData: Omit<User, "id">): Promise<User> {
  console.log("Creating new account...")
  await page.goto("/login")
  await page.waitForLoadState("networkidle")

  await page.getByRole("button", { name: "Criar nova conta" }).click()
  await page.getByLabel("Nome").fill(userData.name)
  await page.getByLabel("E-mail").fill(userData.email)
  await page.locator("#signup-password").fill(userData.password)
  await page.locator("#signup-confirm-password").fill(userData.password)

  console.log("Submitting registration form...")
  await page.getByRole("button", { name: "Criar conta" }).click()

  console.log("Waiting for redirect...")
  try {
    await page.waitForURL("/app", { timeout: 10000 })
  } catch (error) {
    console.log("Error waiting for redirect:", error)
    console.log("Current URL:", page.url())
    throw error
  }

  console.log("Checking success message...")
  await expect(page.getByText("Conta criada com sucesso!")).toBeVisible({ timeout: 10000 })
  await page.waitForLoadState("networkidle")

  // Return created user data
  return {
    ...userData,
    id: "user-id", // In a real scenario, we would extract this from the API response
  }
}

async function createSubscription(page: Page, subscriptionData: Omit<Subscription, "id">): Promise<Subscription> {
  console.log("Creating new subscription...")
  await page.getByRole("button", { name: "Nova Assinatura" }).click()

  console.log("Filling subscription form...")
  await page.getByLabel("Nome do Serviço").fill(subscriptionData.name)
  await page.getByLabel("Data de Início").fill(subscriptionData.startDate)
  await page.getByLabel("Data de Expiração").fill(subscriptionData.endDate)
  await page.getByLabel("Número de Usuários").fill(subscriptionData.numberOfUsers)
  await page.getByLabel("Preço").fill(subscriptionData.price)

  console.log("Submitting subscription form...")
  await page.getByRole("button", { name: "Criar Assinatura" }).click()

  console.log("Waiting for redirect...")
  try {
    await page.waitForURL("/app", { timeout: 10000 })
  } catch (error) {
    console.log("Error waiting for redirect:", error)
    console.log("Current URL:", page.url())
    throw error
  }

  console.log("Checking success message...")
  await expect(page.getByText("Assinatura criada com sucesso!")).toBeVisible({ timeout: 10000 })

  // Return created subscription data
  return {
    ...subscriptionData,
    id: "subscription-id", // In a real scenario, we would extract this from the API response
  }
}

async function verifySubscriptionInList(page: Page, subscription: Pick<Subscription, "name" | "price">) {
  console.log("Verifying subscription in list...")
  await expect(page.getByText(subscription.name)).toBeVisible({ timeout: 10000 })
  await expect(page.getByText(`R$ ${subscription.price}`)).toBeVisible({ timeout: 10000 })
}
