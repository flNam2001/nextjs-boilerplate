"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from "@/components/ui/form";
import { useRouter } from "next/navigation";
import { useState } from "react";

const formSchema = z
	.object({
		name: z.string().min(3, {
			message: "Name must be at least 3 characters.",
		}),
		email: z.string().email({
			message: "Please enter a valid email address.",
		}),
		password: z.string().min(8, {
			message: "Password must be at least 8 characters.",
		}),
		confirmPassword: z.string(),
	})
	.refine((data) => data.password === data.confirmPassword, {
		message: "Passwords don't match",
		path: ["confirmPassword"],
	});

export default function RegisterForm() {
	const router = useRouter();
	const [error, setError] = useState<string>("");
	const form = useForm<z.infer<typeof formSchema>>({
		resolver: zodResolver(formSchema),
		defaultValues: {
			name: "",
			password: "",
			confirmPassword: "",
		},
	});

	async function onSubmit(values: z.infer<typeof formSchema>) {
		console.log(values);
		try {
			const response = await fetch("/api/auth/register", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify(values),
			});

			const data = await response.json();

			if (!response.ok) {
				setError(data.error || "Registration failed");
				return;
			}

			// Redirect to login page
			router.push("/login");
		} catch {
			setError("An error occurred during registration");
		}
	}

	return (
		<Card>
			<CardHeader>
				<CardTitle>Register</CardTitle>
				<CardDescription>Create a new account</CardDescription>
			</CardHeader>
			<CardContent>
				<Form {...form}>
					<form
						onSubmit={form.handleSubmit(onSubmit)}
						className="space-y-8"
					>
						<FormField
							control={form.control}
							name="name"
							render={({ field }) => (
								<FormItem>
									<FormLabel>Name</FormLabel>
									<FormControl>
										<Input
											placeholder="John Doe"
											{...field}
										/>
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>
						<FormField
							control={form.control}
							name="email"
							render={({ field }) => (
								<FormItem>
									<FormLabel>Email</FormLabel>
									<FormControl>
										<Input
											type="email"
											placeholder="john@gmail.com"
											{...field}
										/>
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>
						<FormField
							control={form.control}
							name="password"
							render={({ field }) => (
								<FormItem>
									<FormLabel>Password</FormLabel>
									<FormControl>
										<Input
											type="password"
											placeholder="********"
											{...field}
										/>
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>
						<FormField
							control={form.control}
							name="confirmPassword"
							render={({ field }) => (
								<FormItem>
									<FormLabel>Confirm Password</FormLabel>
									<FormControl>
										<Input
											type="password"
											placeholder="********"
											{...field}
										/>
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>
						{error && (
							<div className="text-sm text-red-500 text-center">
								{error}
							</div>
						)}
						<Button type="submit" className="w-full">
							Register
						</Button>
					</form>
				</Form>
			</CardContent>
		</Card>
	);
}
