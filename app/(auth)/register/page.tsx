"use client";

import { Button } from "@/components/ui/button";
import {
	Card,
	CardContent,
	CardDescription,
	CardFooter,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import Link from "next/link";
import { signupCredentials } from "@/actions/auth";
import { Label } from "@/components/ui/label";
import { useFormState } from "react-dom";

export default function RegisterPage() {
	const [state, formAction] = useFormState(
		signupCredentials,
		undefined
	);


	console.log(state)
	return (
		<Card>
			<CardHeader>
				<CardTitle>Register</CardTitle>
				<CardDescription>Create a new account</CardDescription>
			</CardHeader>
			<CardContent>
				<form action={formAction} className="space-y-6">
					<div className="grid gap-2">
						<Label htmlFor="name">Name</Label>
						<Input
							id="name"
							name="name"
							type="text"
							placeholder="John Doe"
							required
						/>
					</div>
					<div className="grid gap-2">
						<Label htmlFor="email">Email</Label>
						<Input
							id="email"
							type="email"
							name="email"
							placeholder="m@example.com"
							required
						/>
					</div>
					<div className="grid gap-2">
						<Label htmlFor="password">Password</Label>
						<Input
							id="password"
							type="password"
							name="password"
							required
						/>
					</div>
					<div className="grid gap-2">
						<Label htmlFor="confirmPassword">
							Confirm Password
						</Label>
						<Input
							id="confirmPassword"
							type="password"
							name="confirmPassword"
							required
						/>
					</div>
					<Button type="submit" className="w-full">
						Create Account
					</Button>
					<Button variant="outline" className="w-full">
						Register with Google
					</Button>
				</form>
			</CardContent>
			<CardFooter className="flex justify-center">
				<p className="text-sm text-gray-600">
					Already have an account?{" "}
					<Link
						href="/auth/login"
						className="text-blue-600 hover:underline"
					>
						Login here
					</Link>
				</p>
			</CardFooter>
		</Card>
	);
}
