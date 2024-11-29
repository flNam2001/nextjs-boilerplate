import { NextResponse } from "next/server";
import { z } from "zod";
import { compare } from "bcrypt-ts";
import { getUserByEmail } from "@/app/api/common/user";

const loginSchema = z.object({
	email: z.string().email("Invalid email"),
	password: z.string().min(8, "Password must be at least 8 characters"),
});

// POST /api/auth/login
// Login user
export async function POST(request: Request) {
	try {
		const body = await request.json();
		const { email, password } = loginSchema.parse(body);

		// Find user by email and ensure password exists
		const user = await getUserByEmail(email);
		if (!user?.password) {
			return NextResponse.json(
				{ error: "Invalid email or password" },
				{ status: 401 }
			);
		}

		// Verify password
		const passwordMatch = await compare(password, user.password);
		if (!passwordMatch) {
			return NextResponse.json(
				{ error: "Invalid email or password" },
				{ status: 401 }
			);
		}

		// Return success without sensitive data
		return NextResponse.json({
			user: {
				id: user.id,
				email: user.email,
				name: user.name,
			},
		});
	} catch (error) {
		if (error instanceof z.ZodError) {
			return NextResponse.json({ error: error.issues }, { status: 400 });
		}

		return NextResponse.json(
			{ error: "Internal server error" },
			{ status: 500 }
		);
	}
}
