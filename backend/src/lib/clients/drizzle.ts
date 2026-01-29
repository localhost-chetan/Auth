import { SQL } from "bun";
import { drizzle } from "drizzle-orm/bun-sql";
import { getPostgresUrl } from "@utils/service-urls";

const sql = new SQL({
	url: getPostgresUrl(),
	max: 10,
	maxLifetime: 60,
});

export const drizzlePgClient = drizzle(sql, { casing: "snake_case", logger: true });
