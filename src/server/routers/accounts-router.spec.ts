import { describe, expect, it, beforeAll, afterAll, beforeEach } from "bun:test"
import { app } from "../app"
import { _db } from "../db"
import { Account, User } from "../db/schema"
import { COOKIE_KEYS } from "../constants"
import { recreateDatabase } from "../test/utils/database.utils"
import { hc } from "hono/client"
import { createAdaptorServer } from "@hono/node-server"

describe("Accounts Router", () => {
  const rpc = hc<typeof app>("http://localhost:3001")
  const server = createAdaptorServer({
    fetch: app.fetch,
    port: 3001,
  })

  const testUser = {
    email: "test@example.com",
    password: "password123",
    name: "Test User",
  }

  let userId: string
  let token: string

  beforeAll(async () => {
    await recreateDatabase()
    server.listen(3001)
  })

  afterAll(async () => {
    await _db.delete(Account).execute()
    await _db.delete(User).execute()
    server.close()
  })

  beforeEach(async () => {
    await _db.delete(Account).execute()
    await _db.delete(User).execute()

    // Create and sign in a user before each test
    const signupRes = await rpc.api.auth.signup.$post({
      json: testUser,
    })
    const signupData = await signupRes.json()
    userId = signupData.user.id
    token = signupData.token
  })

  describe("POST /accounts", () => {
    const testAccount = {
      serviceName: "Netflix",
      startDate: "2025-03-01T00:00:00Z",
      expirationDate: "2025-04-01T00:00:00Z",
      maxUsers: 4,
      price: "39.90",
    }

    it("should create a new account successfully", async () => {
      const res = await rpc.api.accounts.$post(
        { json: testAccount },
        {
          headers: {
            Cookie: `${COOKIE_KEYS.userId}=${userId}; ${COOKIE_KEYS.token}=${token}`,
          },
        }
      )

      expect(res.status).toBe(200)
      const data = await res.json()
      expect(data.serviceName).toBe(testAccount.serviceName)
      expect(data.ownerId).toBe(userId)
      expect(data.maxUsers).toBe(testAccount.maxUsers)
      expect(data.price).toBe(testAccount.price)
    })

    it("should return error for unauthenticated request", async () => {
      const res = await rpc.api.accounts.$post({
        json: testAccount,
      })

      expect(res.status).toBe(401)
    })

    it("should validate required fields", async () => {
      const invalidAccount = {
        serviceName: "",
        maxUsers: 0,
      }

      const res = await rpc.api.accounts.$post(
        { json: invalidAccount },
        {
          headers: {
            Cookie: `${COOKIE_KEYS.userId}=${userId}; ${COOKIE_KEYS.token}=${token}`,
          },
        }
      )

      expect(res.status).toBe(400)
    })
  })

  describe("GET /accounts", () => {
    const testAccount = {
      serviceName: "Netflix",
      startDate: "2025-03-01T00:00:00Z",
      expirationDate: "2025-04-01T00:00:00Z",
      maxUsers: 4,
      price: "39.90",
    }

    beforeEach(async () => {
      // Create a test account before each test
      await rpc.api.accounts.$post(
        { json: testAccount },
        {
          headers: {
            Cookie: `${COOKIE_KEYS.userId}=${userId}; ${COOKIE_KEYS.token}=${token}`,
          },
        }
      )
    })

    it("should list user's accounts", async () => {
      const res = await rpc.api.accounts.$get(
        { query: {} },
        {
          headers: {
            Cookie: `${COOKIE_KEYS.userId}=${userId}; ${COOKIE_KEYS.token}=${token}`,
          },
        }
      )

      expect(res.status).toBe(200)
      const data = await res.json()
      expect(Array.isArray(data)).toBe(true)
      expect(data.length).toBeGreaterThan(0)
      expect(data[0].serviceName).toBe(testAccount.serviceName)
    })

    it("should filter accounts by status", async () => {
      const res = await rpc.api.accounts.$get(
        { query: { status: "ACTIVE" } },
        {
          headers: {
            Cookie: `${COOKIE_KEYS.userId}=${userId}; ${COOKIE_KEYS.token}=${token}`,
          },
        }
      )

      expect(res.status).toBe(200)
      const data = await res.json()
      expect(Array.isArray(data)).toBe(true)
      data.forEach((account: any) => {
        expect(account.status).toBe("ACTIVE")
      })
    })
  })

  describe("GET /accounts/:accountId", () => {
    let accountId: string

    beforeEach(async () => {
      const testAccount = {
        serviceName: "Netflix",
        startDate: "2025-03-01T00:00:00Z",
        expirationDate: "2025-04-01T00:00:00Z",
        maxUsers: 4,
        price: "39.90",
      }

      const res = await rpc.api.accounts.$post(
        { json: testAccount },
        {
          headers: {
            Cookie: `${COOKIE_KEYS.userId}=${userId}; ${COOKIE_KEYS.token}=${token}`,
          },
        }
      )
      const data = await res.json()
      accountId = data.id
    })

    it("should get account details", async () => {
      const res = await rpc.api.accounts[":accountId"].$get(
        { param: { accountId } },
        {
          headers: {
            Cookie: `${COOKIE_KEYS.userId}=${userId}; ${COOKIE_KEYS.token}=${token}`,
          },
        }
      )

      expect(res.status).toBe(200)
      const data = await res.json()
      expect(data.id).toBe(accountId)
    })

    it("should return error for non-existent account", async () => {
      const res = await rpc.api.accounts[":accountId"].$get(
        { param: { accountId: "52deec36-3905-4d59-8f74-44114582bd58" } },
        {
          headers: {
            Cookie: `${COOKIE_KEYS.userId}=${userId}; ${COOKIE_KEYS.token}=${token}`,
          },
        }
      )

      expect(res.status).toBe(404)
    })
  })

  describe("PATCH /accounts/:accountId", () => {
    let accountId: string

    beforeEach(async () => {
      const testAccount = {
        serviceName: "Netflix",
        startDate: "2025-03-01T00:00:00Z",
        expirationDate: "2025-04-01T00:00:00Z",
        maxUsers: 4,
        price: "39.90",
      }

      const res = await rpc.api.accounts.$post(
        { json: testAccount },
        {
          headers: {
            Cookie: `${COOKIE_KEYS.userId}=${userId}; ${COOKIE_KEYS.token}=${token}`,
          },
        }
      )
      const data = await res.json()
      accountId = data.id
    })

    it("should update account details", async () => {
      const updateData = {
        maxUsers: 5,
        price: "49.90",
      }

      const res = await rpc.api.accounts[":accountId"].$patch(
        {
          json: updateData,
          param: {
            accountId,
          },
        },
        {
          headers: {
            Cookie: `${COOKIE_KEYS.userId}=${userId}; ${COOKIE_KEYS.token}=${token}`,
          },
        }
      )

      expect(res.status).toBe(200)
      const data = await res.json()
      expect(data.maxUsers).toBe(updateData.maxUsers)
      expect(data.price).toBe(updateData.price)
    })

    it("should prevent owner modification", async () => {
      const updateData = {
        ownerId: "different-user-id",
      }

      const res = await rpc.api.accounts[":accountId"].$patch(
        {
          // @ts-ignore
          json: updateData,
          param: { accountId },
        },
        {
          headers: {
            Cookie: `${COOKIE_KEYS.userId}=${userId}; ${COOKIE_KEYS.token}=${token}`,
          },
        }
      )

      expect(res.status).toBe(400)
    })
  })

  describe("DELETE /accounts/:accountId", () => {
    let accountId: string

    beforeEach(async () => {
      const testAccount = {
        serviceName: "Netflix",
        startDate: "2025-03-01T00:00:00Z",
        expirationDate: "2025-04-01T00:00:00Z",
        maxUsers: 4,
        price: "39.90",
      }

      const res = await rpc.api.accounts.$post(
        { json: testAccount },
        {
          headers: {
            Cookie: `${COOKIE_KEYS.userId}=${userId}; ${COOKIE_KEYS.token}=${token}`,
          },
        }
      )
      const data = await res.json()
      accountId = data.id
    })

    it("should delete account", async () => {
      const res = await rpc.api.accounts[":accountId"].$delete(
        { param: { accountId } },
        {
          headers: {
            Cookie: `${COOKIE_KEYS.userId}=${userId}; ${COOKIE_KEYS.token}=${token}`,
          },
        }
      )

      expect(res.status).toBe(200)

      // Verify account is deleted
      const getRes = await rpc.api.accounts[":accountId"].$get(
        { param: { accountId } },
        {
          headers: {
            Cookie: `${COOKIE_KEYS.userId}=${userId}; ${COOKIE_KEYS.token}=${token}`,
          },
        }
      )
      expect(getRes.status).toBe(404)
    })

    it("should prevent non-owner from deleting account", async () => {
      // Create another user
      const anotherUser = {
        email: "another@example.com",
        password: "password123",
        name: "Another User",
      }
      const signupRes = await rpc.api.auth.signup.$post({
        json: anotherUser,
      })
      const signupData = await signupRes.json()

      const res = await rpc.api.accounts[":accountId"].$delete(
        { param: { accountId } },
        {
          headers: {
            Cookie: `${COOKIE_KEYS.userId}=${signupData.user.id}; ${COOKIE_KEYS.token}=${signupData.token}`,
          },
        }
      )

      expect(res.status).toBe(403)
    })
  })
})
