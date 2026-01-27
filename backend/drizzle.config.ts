import { defineConfig } from "drizzle-kit";
import { getPostgresUrl } from "@utils/service-urls";

export default defineConfig({
	dialect: "postgresql",
	schema: "./src/db/schema",
	casing: "snake_case",
	strict: true,
	verbose: true,
	dbCredentials: {
		url: getPostgresUrl(),
	},
});
