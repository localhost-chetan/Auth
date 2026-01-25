import { Hono } from "hono";

const app = new Hono()
	.get("/", (c) => {
		return c.json({ message: "Hello Hono!" });
	})

	.get("/health", (c) => {
		return c.json({ status: "ok" });
	});

export default {
	port: process.env.BACKEND_PORT ?? 3002,
	fetch: app.fetch,
};
