import { SQL } from "bun";
import { drizzle } from "drizzle-orm/bun-sql";
import { getPostgresUrl } from "@utils/service-urls";

const sql = new SQL(getPostgresUrl());
export const drizzlePgClient = drizzle({ client: sql, casing: "snake_case" });
