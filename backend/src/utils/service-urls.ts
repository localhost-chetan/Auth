export const getPostgresUrl = () => {
	const DATABASE_URL = process.env.DATABASE_URL;
	if (!DATABASE_URL) {
		throw new Error("DATABASE_URL is not defined in environment variables");
	}
	return DATABASE_URL;
};
