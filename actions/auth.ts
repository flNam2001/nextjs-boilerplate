"use server";

import { RegisterSchema } from "@/actions/zod";
import { signIn } from "@/auth";
import { prisma } from "@/lib/prisma";
import { hashSync } from "bcrypt-ts";
import { AuthError } from "next-auth";
import { redirect } from "next/navigation";

// signupCredentials is a function that takes a FormData object and returns a promise that resolves to an object.
export const signupCredentials = async (
	prevState: unknown,
	formData: FormData
) => {
	const validatedFields = RegisterSchema.safeParse(
		Object.fromEntries(formData.entries())
	);

	if (!validatedFields.success) {
		return {
			error: validatedFields.error.flatten().fieldErrors,
		};
	}

	const { name, email, password } = validatedFields.data;
	const hashedPassword = hashSync(password, 10);

	try {
		await prisma.user.create({
			data: {
				name,
				email,
				password: hashedPassword,
			},
		});
	} catch {
		return {
			message: "An error occurred while creating your account",
		};
	}
	redirect("/login");
};

// get user by email action
export const getUserByEmail = async (email: string) => {
	const user = await prisma.user.findUnique({
		where: {
			email,
		},
	});

	return user;
};

// sign in credential action
export const signinCredentials = async (
	prevState: unknown,
	formData: FormData
) => {
	const validatedFields = RegisterSchema.safeParse(
		Object.fromEntries(formData.entries())
	);

	if (!validatedFields.success) {
		return {
			error: validatedFields.error.flatten().fieldErrors,
		};
	}

	const { email, password } = validatedFields.data;

	try {
		await signIn("credentials", {
			email,
			password,
			redirectTo: "/dashboard",
		});
	} catch (error) {
		if (error instanceof AuthError) {
			switch (error.type) {
				case "CredentialsSignin":
					return {
						message: "Invalid credentials",
					};
				default:
					return {
						message: "Something went wrong",
					};
			}
		}
	}
};
