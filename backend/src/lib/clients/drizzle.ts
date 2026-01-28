import { SQL } from "bun";
import { drizzle } from "drizzle-orm/bun-sql";
import { getPostgresUrl } from "@utils/service-urls";

const sql = new SQL({
	url: getPostgresUrl(),
	max: 100,
	maxLifetime: 60 * 1,
});
export const drizzlePgClient = drizzle({ client: sql, casing: "snake_case" });
