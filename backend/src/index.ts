import { Hono } from "hono";
import { sql } from "drizzle-orm";
import { drizzlePgClient } from "@lib/clients/drizzle";
import { authRoute } from "@api/routes/auth";
import { cors } from "hono/cors";

const app = new Hono()
	.use(cors({
		origin: "http://localhost:3000", // Update this to match your frontend URL and port
		allowMethods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
	}))

	.get("/", (c) => {
		return c.json({ message: "Auth API Server" });
	})

	.get("/health", (c) => {
		return c.json({ status: "ok" });
	})

	.get("/db-check", async (c) => {
		const result = await drizzlePgClient.execute(sql`SELECT current_database();`);
		return c.json({ database: result });
	})

	.route("/", authRoute);

export default {
	port: process.env.BACKEND_PORT ?? 3002,
	fetch: app.fetch,
};
