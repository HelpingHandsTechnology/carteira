import { pgTable, text, timestamp, index, decimal, integer, jsonb } from "drizzle-orm/pg-core"
import { InferSelectModel, InferInsertModel } from "drizzle-orm"
import { createId } from "@paralleldrive/cuid2"

export const User = pgTable(
  "user",
  {
    id: text("id")
      .primaryKey()
      .$defaultFn(() => createId()),
    name: text("name").notNull(),
    email: text("email").notNull().unique(),
    password: text("password").notNull(),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at").defaultNow().notNull(),
  },
  (table) => ({
    emailIdx: index("users_email_idx").on(table.email),
  })
)

export type UserSelect = InferSelectModel<typeof User>
export type UserInsert = InferInsertModel<typeof User>
export type User = Pick<UserSelect, "id" | "email" | "name">

export const Account = pgTable(
  "account",
  {
    id: text("id")
      .primaryKey()
      .$defaultFn(() => createId()),
    serviceName: text("service_name").notNull(),
    ownerId: text("owner_id")
      .notNull()
      .references(() => User.id),
    startDate: timestamp("start_date").notNull(),
    expirationDate: timestamp("expiration_date").notNull(),
    status: text("status").notNull().default("ACTIVE"),
    maxUsers: integer("max_users").notNull(),
    price: decimal("price", { precision: 10, scale: 2 }).notNull(),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at").defaultNow().notNull(),
  },
  (table) => ({
    ownerIdx: index("accounts_owner_idx").on(table.ownerId),
    statusIdx: index("accounts_status_idx").on(table.status),
    expirationIdx: index("accounts_expiration_idx").on(table.expirationDate),
  })
)

export type AccountSelect = InferSelectModel<typeof Account>
export type AccountInsert = InferInsertModel<typeof Account>
export type Account = Pick<
  AccountSelect,
  "id" | "serviceName" | "ownerId" | "startDate" | "expirationDate" | "status" | "maxUsers" | "price"
>

export const AccessRequest = pgTable(
  "access_request",
  {
    id: text("id")
      .primaryKey()
      .$defaultFn(() => createId()),
    accountId: text("account_id")
      .notNull()
      .references(() => Account.id),
    requesterId: text("requester_id")
      .notNull()
      .references(() => User.id),
    status: text("status").notNull().default("PENDING"),
    requestDate: timestamp("request_date").defaultNow().notNull(),
    approvalDate: timestamp("approval_date"),
    expirationDate: timestamp("expiration_date").notNull(),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at").defaultNow().notNull(),
  },
  (table) => ({
    accountRequesterIdx: index("access_requests_account_requester_idx").on(table.accountId, table.requesterId),
    statusIdx: index("access_requests_status_idx").on(table.status),
    expirationIdx: index("access_requests_expiration_idx").on(table.expirationDate),
  })
)

export type AccessRequestSelect = InferSelectModel<typeof AccessRequest>
export type AccessRequestInsert = InferInsertModel<typeof AccessRequest>
export type AccessRequest = Pick<
  AccessRequestSelect,
  "id" | "accountId" | "requesterId" | "status" | "requestDate" | "approvalDate" | "expirationDate"
>

export const Transaction = pgTable(
  "transaction",
  {
    id: text("id")
      .primaryKey()
      .$defaultFn(() => createId()),
    requestId: text("request_id")
      .notNull()
      .references(() => AccessRequest.id),
    amount: decimal("amount", { precision: 10, scale: 2 }).notNull(),
    status: text("status").notNull().default("PENDING"),
    transactionDate: timestamp("transaction_date").defaultNow().notNull(),
    paymentMethod: text("payment_method").notNull(),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at").defaultNow().notNull(),
  },
  (table) => ({
    requestIdx: index("transactions_request_idx").on(table.requestId),
    statusIdx: index("transactions_status_idx").on(table.status),
    dateIdx: index("transactions_date_idx").on(table.transactionDate),
  })
)

export type TransactionSelect = InferSelectModel<typeof Transaction>
export type TransactionInsert = InferInsertModel<typeof Transaction>
export type Transaction = Pick<
  TransactionSelect,
  "id" | "requestId" | "amount" | "status" | "transactionDate" | "paymentMethod"
>

export const History = pgTable(
  "history",
  {
    id: text("id")
      .primaryKey()
      .$defaultFn(() => createId()),
    entityType: text("entity_type").notNull(),
    entityId: text("entity_id").notNull(),
    action: text("action").notNull(),
    metadata: jsonb("metadata"),
    userId: text("user_id")
      .notNull()
      .references(() => User.id),
    createdAt: timestamp("created_at").defaultNow().notNull(),
  },
  (table) => ({
    entityIdx: index("history_entity_idx").on(table.entityType, table.entityId),
    userIdx: index("history_user_idx").on(table.userId),
    dateIdx: index("history_date_idx").on(table.createdAt),
  })
)

export type HistorySelect = InferSelectModel<typeof History>
export type HistoryInsert = InferInsertModel<typeof History>
export type History = Pick<
  HistorySelect,
  "id" | "entityType" | "entityId" | "action" | "metadata" | "userId" | "createdAt"
>
