import { object, string } from "zod";

export type State = {
	errors?: {
		name?: string[];
		email?: string[];
		password?: string[];
	};
	message?: string | null;
};

export const RegisterSchema = object({
	name: string()
		.min(3, "user name can be less than 3")
		.max(36, "user name can be more than 36"),
	email: string().email("invalid email"),
	password: string()
		.min(6, "password can be less than 6")
		.max(36, "password can be more than 36"),
});

export const LoginSchema = object({
	email: string().email("invalid email"),
	password: string()
		.min(6, "password can be less than 6")
		.max(36, "password can be more than 36"),
});
