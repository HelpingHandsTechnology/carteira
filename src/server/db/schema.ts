import { pgTable, text, timestamp, index, decimal, integer, jsonb, uuid } from "drizzle-orm/pg-core"
import { InferSelectModel, InferInsertModel } from "drizzle-orm"
import { createId } from "@paralleldrive/cuid2"

export const User = pgTable("users", {
  id: uuid("id").primaryKey().defaultRandom(),
  email: text("email").notNull().unique(),
  password: text("password").notNull(),
  name: text("name").notNull(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
})

export type UserSelect = InferSelectModel<typeof User>
export type UserInsert = InferInsertModel<typeof User>
export type User = Pick<UserSelect, "id" | "email" | "name">

export const Account = pgTable("accounts", {
  id: uuid("id").primaryKey().defaultRandom(),
  serviceName: text("service_name").notNull(),
  startDate: timestamp("start_date").notNull(),
  expirationDate: timestamp("expiration_date").notNull(),
  maxUsers: integer("max_users").notNull(),
  price: text("price").notNull(),
  ownerId: uuid("owner_id")
    .notNull()
    .references(() => User.id),
  status: text("status", { enum: ["ACTIVE", "INACTIVE", "EXPIRED"] })
    .notNull()
    .default("ACTIVE"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
})

export type AccountSelect = InferSelectModel<typeof Account>
export type AccountInsert = InferInsertModel<typeof Account>
export type Account = Pick<
  AccountSelect,
  "id" | "serviceName" | "ownerId" | "startDate" | "expirationDate" | "status" | "maxUsers" | "price"
>

export const AccessRequest = pgTable("access_requests", {
  id: uuid("id").primaryKey().defaultRandom(),
  accountId: uuid("account_id")
    .notNull()
    .references(() => Account.id, { onDelete: "cascade" }),
  userId: uuid("user_id")
    .notNull()
    .references(() => User.id, { onDelete: "cascade" }),
  status: text("status", { enum: ["PENDING", "APPROVED", "REJECTED"] })
    .notNull()
    .default("PENDING"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
})

export type AccessRequestSelect = InferSelectModel<typeof AccessRequest>
export type AccessRequestInsert = InferInsertModel<typeof AccessRequest>
export type AccessRequest = Pick<
  AccessRequestSelect,
  "id" | "accountId" | "userId" | "status" | "createdAt" | "updatedAt"
>

export const Transaction = pgTable("transactions", {
  id: uuid("id").primaryKey().defaultRandom(),
  accountId: uuid("account_id")
    .notNull()
    .references(() => Account.id, { onDelete: "cascade" }),
  userId: uuid("user_id")
    .notNull()
    .references(() => User.id, { onDelete: "cascade" }),
  amount: text("amount").notNull(),
  status: text("status", { enum: ["PENDING", "COMPLETED", "FAILED"] })
    .notNull()
    .default("PENDING"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
})

export type TransactionSelect = InferSelectModel<typeof Transaction>
export type TransactionInsert = InferInsertModel<typeof Transaction>
export type Transaction = Pick<
  TransactionSelect,
  "id" | "accountId" | "userId" | "amount" | "status" | "createdAt" | "updatedAt"
>

export const History = pgTable("history", {
  id: uuid("id").primaryKey().defaultRandom(),
  accountId: uuid("account_id").references(() => Account.id, { onDelete: "set null" }),
  userId: uuid("user_id")
    .notNull()
    .references(() => User.id, { onDelete: "cascade" }),
  action: text("action").notNull(),
  details: jsonb("details"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
})

export type HistorySelect = InferSelectModel<typeof History>
export type HistoryInsert = InferInsertModel<typeof History>
export type History = Pick<HistorySelect, "id" | "accountId" | "userId" | "action" | "details" | "createdAt">
