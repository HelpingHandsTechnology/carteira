import { Hono } from "hono"
import { z } from "zod"
import { zValidator } from "@hono/zod-validator"
import { _db } from "../db"
import { Account, History } from "../db/schema"
import { authMiddleware } from "../middlewares/auth"
import { and, eq } from "drizzle-orm"
import { AppError } from "@/lib/errors"
import { createMiddleware } from "hono/factory"

class AccountsModel {
  static createAccountSchema = z.object({
    serviceName: z.string().min(1),
    startDate: z.string().datetime(),
    expirationDate: z.string().datetime(),
    maxUsers: z.number().min(1),
    price: z.string(),
  })

  static updateAccountSchema = z
    .object({
      serviceName: z.string().min(1).optional(),
      startDate: z.string().datetime().optional(),
      expirationDate: z.string().datetime().optional(),
      maxUsers: z.number().min(1).optional(),
      price: z.string().optional(),
    })
    .refine((data) => Object.keys(data).length > 0, {
      message: "Pelo menos um campo deve ser fornecido para atualização",
    })

  static statusSchema = z.enum(["ACTIVE", "INACTIVE", "EXPIRED"]).optional()
}

const accountOwnerHasPermissionMiddleware = createMiddleware<{
  Variables: {
    account: Account
    userId: string
  }
}>(async (c, next) => {
  const userId = c.get("userId")
  const accountId = c.req.param("accountId")
  if (!accountId || !userId) {
    throw new AppError(400, { message: "Desculpe, não foi possível processar a solicitação." })
  }
  const [account] = await _db.select().from(Account).where(eq(Account.id, accountId)).limit(1)
  if (!account) {
    throw new AppError(404, { message: "Conta não encontrada" })
  }
  c.set("account", account)

  if (account.ownerId !== userId) {
    throw new AppError(403, { message: "Desculpe, você não tem permissão para acessar esta conta." })
  }

  await next()
})

export const accountsRouter = new Hono()
  .use("*", authMiddleware)
  .post("/", zValidator("json", AccountsModel.createAccountSchema), async (c) => {
    const data = c.req.valid("json")
    const userId = c.get("userId")

    const account = await _db.transaction(async (tx) => {
      const [account] = await tx
        .insert(Account)
        .values({
          serviceName: data.serviceName,
          startDate: new Date(data.startDate),
          expirationDate: new Date(data.expirationDate),
          maxUsers: data.maxUsers,
          price: data.price,
          ownerId: userId,
        })
        .returning()

      if (!account) {
        throw new AppError(500, { message: "Failed to create account" })
      }

      await tx.insert(History).values({
        accountId: account.id,
        userId,
        action: "ACCOUNT_CREATED",
        details: { account },
      })

      return account
    })

    return c.json(account)
  })
  .get("/", zValidator("query", z.object({ status: AccountsModel.statusSchema })), async (c) => {
    const userId = c.get("userId")
    const status = c.req.valid("query").status

    const accounts = await _db
      .select()
      .from(Account)
      .where(and(eq(Account.ownerId, userId), status ? eq(Account.status, status) : undefined))

    return c.json(accounts)
  })
  .get("/:accountId", async (c) => {
    const userId = c.get("userId")
    const accountId = c.req.param("accountId")

    const [account] = await _db.select().from(Account).where(eq(Account.id, accountId)).limit(1)

    if (!account) {
      throw new AppError(404, { message: "Conta não encontrada" })
    }

    if (account.ownerId !== userId) {
      throw new AppError(403, { message: "Desculpe, você não tem permissão para acessar esta conta." })
    }

    return c.json(account)
  })
  .patch(
    "/:accountId",
    accountOwnerHasPermissionMiddleware,
    zValidator("json", AccountsModel.updateAccountSchema),
    async (c) => {
      const userId = c.get("userId")
      const accountId = c.req.param("accountId")
      const data = c.req.valid("json")

      // Prevent owner modification
      if ("ownerId" in data) {
        throw new AppError(400, { message: "Cannot modify account owner" })
      }

      const account = await _db.transaction(async (tx) => {
        const [account] = await tx.select().from(Account).where(eq(Account.id, accountId)).limit(1)

        if (!account) {
          throw new AppError(404, { message: "Account not found" })
        }

        if (account.ownerId !== userId) {
          throw new AppError(403, { message: "Desculpe, você não tem permissão para acessar esta conta." })
        }

        const [updatedAccount] = await tx
          .update(Account)
          .set({
            ...(data.serviceName && { serviceName: data.serviceName }),
            ...(data.startDate && { startDate: new Date(data.startDate) }),
            ...(data.expirationDate && { expirationDate: new Date(data.expirationDate) }),
            ...(data.maxUsers && { maxUsers: data.maxUsers }),
            ...(data.price && { price: data.price }),
            updatedAt: new Date(),
          })
          .where(eq(Account.id, accountId))
          .returning()

        await tx.insert(History).values({
          accountId,
          userId,
          action: "ACCOUNT_UPDATED",
          details: { before: account, after: updatedAccount },
        })

        return updatedAccount
      })

      if (!account) {
        throw new AppError(404, { message: "Account not found" })
      }

      return c.json(account)
    }
  )
  .delete("/:accountId", accountOwnerHasPermissionMiddleware, async (c) => {
    const userId = c.get("userId")
    const accountId = c.req.param("accountId")
    const account = c.get("account")

    await _db.transaction(async (tx) => {
      const [deletedAccount] = await tx.delete(Account).where(eq(Account.id, accountId)).returning()
      if (!deletedAccount) {
        throw new AppError(404, { message: "Conta não encontrada" })
      }

      await tx.insert(History).values({
        userId,
        action: "ACCOUNT_DELETED",
        details: { account },
      })
    })

    return c.json(true)
  })
