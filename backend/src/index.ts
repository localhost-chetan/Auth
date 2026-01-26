import { Hono } from "hono";
import { sql } from "drizzle-orm";
import { drizzlePgClient } from "@lib/clients/drizzle";

const app = new Hono()
	.get("/", (c) => {
		return c.json({ message: "Hello Hono!" });
	})

	.get("/health", (c) => {
		return c.json({ status: "ok" });
	})

	.get("/db-check", async (c) => {
		const result = await drizzlePgClient.execute(sql`SELECT current_database();`);
		return c.json({ database: result });
	});

export default {
	port: process.env.BACKEND_PORT ?? 3002,
	fetch: app.fetch,
};
