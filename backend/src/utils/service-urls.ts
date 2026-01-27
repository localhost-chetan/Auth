export const getPostgresUrl = () => {
	const DATABASE_URL = process.env.DATABASE_URL;
	if (!DATABASE_URL) {
		throw new Error("DATABASE_URL is not defined in environment variables");
	}
	return DATABASE_URL;
};

export const getJWTPrivateKey = () => {
	const JWT_PRIVATE_KEY = process.env.JWT_PRIVATE_KEY;
	if (!JWT_PRIVATE_KEY) {
		throw new Error("JWT_PRIVATE_KEY is not defined in environment variables");
	}
	return JWT_PRIVATE_KEY;
};
