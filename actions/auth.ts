"use server"

import { RegisterSchema } from "@/actions/zod";
import { prisma } from "@/lib/prisma";
import { hashSync } from "bcrypt-ts";
import { redirect } from "next/navigation";

// signupCredentials is a function that takes a FormData object and returns a promise that resolves to an object.
export const signupCredentials = async (
    prevState: unknown,
    formData: FormData) => {
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
