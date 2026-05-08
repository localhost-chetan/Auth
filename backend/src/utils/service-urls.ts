const getEnvVar = (key: string) => {
	const value = process.env[key];
	if (!value) {
		throw new Error(`${key} is not defined in environment variables`);
	}
	return value;
}

export const getPostgresUrl = () => getEnvVar("DATABASE_URL");

export const getJWTPrivateKey = () => getEnvVar("JWT_PRIVATE_KEY");

export const getResendAPIKey = () => getEnvVar("RESEND_API_KEY");

export const getClientUrl = () => getEnvVar("CLIENT_URL");