import { Elysia, t } from "elysia"
import { AuthService } from "../services/auth"
import { DbService } from "../services/db"

export class AuthModel {
  static signUp = t.Object({
    email: t.String({ format: "email", error: "Invalid email format" }),
    password: t.String({ minLength: 6, error: "Password must be at least 6 characters long" }),
    name: t.String({ minLength: 2, error: "Name must be at least 2 characters long" }),
  })

  static signIn = t.Object({
    email: t.String({ format: "email", error: "Invalid email format" }),
    password: t.String({ minLength: 1, error: "Password is required" }),
  })
}

export const authRouter = new Elysia({ prefix: "/auth" })
  .decorate("authService", new AuthService(DbService.db))
  .post(
    "/signup",
    async ({ body, authService }) => {
      try {
        const user = await authService.signUp(body)
        if (!user) {
          throw new Error("Failed to create user")
        }

        return {
          success: true,
          data: {
            id: user.id,
            email: user.email,
            name: user.name,
          },
        }
      } catch (error) {
        throw new Error("Failed to create user")
      }
    },
    {
      body: AuthModel.signUp,
    }
  )
  .post(
    "/signin",
    async ({ body, authService }) => {
      try {
        const user = await authService.signIn(body)
        if (!user) {
          throw new Error("Invalid credentials")
        }

        return {
          success: true,
          data: {
            id: user.id,
            email: user.email,
            name: user.name,
          },
        }
      } catch (error) {
        throw new Error("Invalid credentials")
      }
    },
    {
      body: AuthModel.signIn,
    }
  )
