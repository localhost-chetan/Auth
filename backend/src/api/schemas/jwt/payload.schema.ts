import { type PublicUser } from "@/db/schema";

export type UserId = Pick<PublicUser, "id">["id"];

export type JWTPayload = {
	sub: UserId;
	exp: number;
};
