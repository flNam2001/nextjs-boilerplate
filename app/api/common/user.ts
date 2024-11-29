import { prisma } from "@/lib/prisma";

// For authentication
async function getUserByEmailWithPassword(email: string) {
	try {
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
	} catch (error) {
		console.error("Database error:", error);
		throw new Error("Failed to fetch user");
	}
}

// For general use
async function getUserByEmail(email: string) {
	try {
		return prisma.user.findUnique({
			where: { email },
			select: {
				id: true,
				email: true,
				name: true,
			},
		});
	} catch (error) {
		console.error("Database error:", error);
		throw new Error("Failed to fetch user");
	}
}
export { getUserByEmail, getUserByEmailWithPassword };
