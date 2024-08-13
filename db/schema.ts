import { createInsertSchema } from "drizzle-zod";

import {  pgTable, text, uniqueIndex, varchar } from 'drizzle-orm/pg-core';

export const accounts = pgTable("accounts", {
    id: text("id").primaryKey(),
    playId: text("plaid_id").notNull(),
    name: text("name").notNull(),
    userId: text("user_id").notNull()
})

export const inserAccountSchema = createInsertSchema(accounts);