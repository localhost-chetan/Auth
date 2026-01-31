import { primaryKey, unique, boolean, timestamp, varchar, pgTable, serial } from "drizzle-orm/pg-core";

export const userTable = pgTable(
	"users",
	{
		id: serial(),
		name: varchar({ length: 255 }).notNull(),
		email: varchar({ length: 255 }).notNull(),
		passwordHash: varchar({ length: 255 }).notNull(),
		lastLogin: timestamp().defaultNow(),
		isVerified: boolean().default(false),
		resetPasswordToken: varchar({ length: 255 }),
		resetPasswordTokenExpiresAt: timestamp(),
		verificationToken: varchar({ length: 255 }),
		verificationTokenExpiresAt: timestamp(),

		// Timestamps
		createdAt: timestamp().defaultNow().notNull(),
		updatedAt: timestamp().defaultNow(),
	},
	(table) => {
		return [primaryKey({ columns: [table.id], name: "pkey_users" }), unique("unique_email").on(table.email)];
	},
);

export type User = typeof userTable.$inferSelect;
