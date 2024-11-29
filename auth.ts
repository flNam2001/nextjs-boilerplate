import NextAuth from "next-auth";
import { PrismaAdapter } from "@auth/prisma-adapter"
import { prisma } from "@/lib/prisma";
import Credentials from "next-auth/providers/credentials";
import { LoginSchema } from "@/actions/zod";
import { getUserByEmail } from "@/actions/auth";
import { compareSync } from "bcrypt-ts";

export const { handlers, signIn, signOut, auth } = NextAuth({
    adapter: PrismaAdapter(prisma),
    session: {strategy: "jwt"},
    providers: [
        Credentials({
            credentials: {
                email: {},
                password: {}
            },
            authorize: async (credentials) => {
                const validatedFields = LoginSchema.safeParse(credentials);
                if (!validatedFields.success) {
                    return null;
                }
                const { email, password } = validatedFields.data;

                const user = await getUserByEmail(email)

                if(!user || user.password !== password) {
                    throw new Error("Invalid credentials")
                }

                const passwordMatch = compareSync(password, user.password)

                if (!passwordMatch) {
                    throw new Error("Invalid credentials")
                }

                return user
            },
        })
    ],
});
