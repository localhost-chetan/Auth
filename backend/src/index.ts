import { Hono } from "hono";

const app = new Hono();

app.get("/", (c) => {
	return c.text("Hello Hono!");
});

export default {
	port: process.env.BACKEND_PORT ?? 3002,
	fetch: app.fetch,
};