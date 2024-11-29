import { prisma } from "@/lib/prisma";

export async function getUserByEmail(email: string) {
	const user = await prisma.user.findUnique({
		where: {
			email,
		},
		select: {
			id: true,
			email: true,
			name: true,
			password: true,
		},
	});

	return user;
}
