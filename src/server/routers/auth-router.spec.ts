import { describe, expect, it, beforeAll, afterAll, beforeEach } from "bun:test"
import { Hono } from "hono"
import { authRouter } from "./auth-router"
import { _db } from "../db"
import { User } from "../db/schema"
import { eq } from "drizzle-orm"
import { COOKIE_KEYS } from "../constants"
import { recreateDatabase } from "../test/utils/database.utils"
import { hc } from "hono/client"
import { loggerMiddleware } from "../middlewares/logger"
import { createAdaptorServer } from "@hono/node-server"
import { app } from "../app"

describe("Auth Router", () => {
  const rpc = hc<typeof app>("http://localhost:3002")
  const server = createAdaptorServer({
    fetch: app.fetch,
    port: 3002,
  })

  const testUser = {
    email: "test@example.com",
    password: "password123",
    name: "Test User",
  }

  beforeAll(async () => {
    await recreateDatabase()
    server.listen(3002)
  })

  afterAll(async () => {
    // Clean up database after all tests
    await _db.delete(User).execute()
    server.close()
  })

  beforeEach(async () => {
    // Clean up database before each test
    await _db.delete(User).execute()
  })

  describe("POST /auth/signup", () => {
    it("should create a new user successfully", async () => {
      const res = await rpc.api.auth.signup.$post({
        json: testUser,
      })

      expect(res.status).toBe(200)
      const data = await res.json()
      expect(data.user.email).toBe(testUser.email)
      expect(data.user.name).toBe(testUser.name)
      expect(data.token).toBeDefined()

      // Check if cookies are set
      const cookies = res.headers.get("set-cookie")
      expect(cookies).toContain(COOKIE_KEYS.userId)
      expect(cookies).toContain(COOKIE_KEYS.token)
    })

    it("should return error for invalid email", async () => {
      const res = await rpc.api.auth.signup.$post({
        json: { ...testUser, email: "invalid-email" },
      })

      expect(res.status).toBe(400)
    })

    it("should return error for short password", async () => {
      const res = await rpc.api.auth.signup.$post({
        json: { ...testUser, password: "123" },
      })

      expect(res.status).toBe(400)
    })
  })

  describe("POST /auth/signin", () => {
    beforeEach(async () => {
      // Create a test user before each signin test
      await rpc.api.auth.signup.$post({
        json: testUser,
      })
    })

    it("should sign in successfully with correct credentials", async () => {
      const res = await rpc.api.auth.signin.$post({
        json: {
          email: testUser.email,
          password: testUser.password,
        },
      })

      expect(res.status).toBe(200)
      const data = await res.json()
      expect(data.user.email).toBe(testUser.email)
      expect(data.token).toBeDefined()

      // Check if cookies are set
      const cookies = res.headers.get("set-cookie")
      expect(cookies).toContain(COOKIE_KEYS.userId)
      expect(cookies).toContain(COOKIE_KEYS.token)
    })

    it("should return error for incorrect password", async () => {
      const res = await rpc.api.auth.signin.$post({
        json: {
          email: testUser.email,
          password: "wrongpassword",
        },
      })

      expect(res.status).toBe(401)
    })

    it("should return error for non-existent user", async () => {
      const res = await rpc.api.auth.signin.$post({
        json: {
          email: "nonexistent@example.com",
          password: "password123",
        },
      })

      expect(res.status).toBe(401)
    })
  })

  describe("GET /auth/me", () => {
    let userId: string
    let token: string

    beforeEach(async () => {
      // Create and sign in a user before each test
      const signupRes = await rpc.api.auth.signup.$post({
        json: testUser,
      })
      const signupData = await signupRes.json()
      userId = signupData.user.id
      token = signupData.token
    })

    it("should return user data for authenticated user", async () => {
      const res = await rpc.api.auth.me.$get(
        {},
        {
          headers: {
            Cookie: `${COOKIE_KEYS.userId}=${userId}; ${COOKIE_KEYS.token}=${token}`,
          },
        }
      )

      expect(res.status).toBe(200)
      const data = await res.json()
      expect(data.email).toBe(testUser.email)
      expect(data.name).toBe(testUser.name)
    })

    it("should return error for unauthenticated request", async () => {
      const res = await rpc.api.auth.me.$get()

      expect(res.status).toBe(401)
    })
  })

  describe("POST /auth/signout", () => {
    it("should clear auth cookies", async () => {
      const res = await rpc.api.auth.signout.$post()

      expect(res.status).toBe(200)
      const cookies = res.headers.get("set-cookie")
      expect(cookies).toContain(`${COOKIE_KEYS.userId}=;`)
      expect(cookies).toContain(`${COOKIE_KEYS.token}=;`)
    })
  })

  describe("GET /auth/verify", () => {
    let userId: string
    let token: string

    beforeEach(async () => {
      const signupRes = await rpc.api.auth.signup.$post({
        json: testUser,
      })
      const signupData = await signupRes.json()
      userId = signupData.user.id
      token = signupData.token
    })

    it("should verify token and return user data", async () => {
      const res = await rpc.api.auth.verify.$get(
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      )

      const data = await res.json()
      expect(data.email).toBe(testUser.email)
      expect(data.id).toBe(userId)
    })

    it("should return error for invalid token", async () => {
      const res = await rpc.api.auth.verify.$get(
        {},
        {
          headers: {
            Cookie: `${COOKIE_KEYS.userId}=${userId}; ${COOKIE_KEYS.token}=invalid-token`,
          },
        }
      )

      expect(res.status).toBe(401)
    })
  })
})
