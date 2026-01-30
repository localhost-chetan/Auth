export const generateOTP = () => {
	const OTP = crypto.getRandomValues(new Uint32Array(1))[0] % 1000000;
	return OTP.toString().padStart(6, String(Math.round(Math.random() * 10)));
};
