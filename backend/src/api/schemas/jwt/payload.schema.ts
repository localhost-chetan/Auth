import { type User } from "@/db/schema";

export type UserId = Pick<User, "id">["id"];

export type JWTPayload = {
	sub: UserId;
	exp: number;
};
