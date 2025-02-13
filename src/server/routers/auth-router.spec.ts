import { COOKIE_KEYS } from "../constants"
import { cleanupServers, createApp, Rpc } from "../test/utils/app.utils"

describe("Auth Router", () => {
  afterAll(async () => {
    cleanupServers()
  })

  describe("POST /auth/signup", () => {
    it("should create a new user successfully", async () => {
      const rpc = await createApp()
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
      const rpc = await createApp()
      const res = await rpc.api.auth.signup.$post({
        json: { ...testUser, email: "invalid-email" },
      })

      expect(res.status).toBe(400)
    })

    it("should return error for short password", async () => {
      const rpc = await createApp()
      const res = await rpc.api.auth.signup.$post({
        json: { ...testUser, password: "123" },
      })

      expect(res.status).toBe(400)
    })
  })

  describe("POST /auth/signin", () => {
    const createUser = async (rpc: Rpc) => {
      const res = await rpc.api.auth.signup.$post({
        json: testUser,
      })
      expect(res.status).toBe(200)
      expect(res.json()).resolves.toEqual({
        user: expect.objectContaining({
          email: testUser.email,
          name: testUser.name,
        }),
        token: expect.any(String),
      })
      return res
    }

    it("should sign in successfully with correct credentials", async () => {
      const rpc = await createApp()
      await createUser(rpc)
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
      const rpc = await createApp()
      const res = await rpc.api.auth.signin.$post({
        json: {
          email: testUser.email,
          password: "wrongpassword",
        },
      })

      expect(res.status).toBe(401)
    })

    it("should return error for non-existent user", async () => {
      const rpc = await createApp()
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
    it("should return user data for authenticated user", async () => {
      const rpc = await createApp()
      const { userId, token } = await signup(rpc)
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
      const rpc = await createApp()
      const res = await rpc.api.auth.me.$get()

      expect(res.status).toBe(401)
    })
  })

  describe("POST /auth/signout", () => {
    it("should clear auth cookies", async () => {
      const rpc = await createApp()
      const res = await rpc.api.auth.signout.$post()

      expect(res.status).toBe(200)
      const cookies = res.headers.get("set-cookie")
      expect(cookies).toContain(`${COOKIE_KEYS.userId}=;`)
      expect(cookies).toContain(`${COOKIE_KEYS.token}=;`)
    })
  })

  describe("GET /auth/verify", () => {
    it("should verify token and return user data", async () => {
      const rpc = await createApp()
      const { userId, token } = await signup(rpc)
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
      const rpc = await createApp()
      const { userId, token } = await signup(rpc)
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

const testUser = {
  email: "test@example.com",
  password: "password123",
  name: "Test User",
}

const signup = async (rpc: Rpc) => {
  const res = await rpc.api.auth.signup.$post({
    json: testUser,
  })
  const signupData = await res.json()
  return { userId: signupData.user.id, token: signupData.token }
}
