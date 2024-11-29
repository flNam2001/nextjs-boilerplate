import { RegisterSchema } from "@/actions/zod";
import { NextResponse } from "next/server";
import { z } from "zod";
import { getUserByEmail } from "@/app/api/common/user";
import { hashSync } from "bcrypt-ts";
import { prisma } from "@/lib/prisma";

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { name, email, password } = RegisterSchema.parse(body);

        // Find user by email and check if user exists
        const user = await getUserByEmail(email);
        if (user?.email) {
            return NextResponse.json(
                { error: "User already exists" },
                { status: 401 }
            );
        }

        // hash password
        const hashedPassword = hashSync(password, 10);

        // create user
        await prisma.user.create({
            data: {
                name,
                email,
                password: hashedPassword,
            },
        });

        return NextResponse.json({
            message: "User created successfully",
        });

    }  catch (error) {
        if (error instanceof z.ZodError) {
            return NextResponse.json({ error: error.issues }, { status: 400 });
        }

        return NextResponse.json(
            { error: "Internal server error" },
            { status: 500 }
        );
    }
}