"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
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
import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from "@/components/ui/form";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { sendData } from "@/lib/actions";
import { Loader2, LogInIcon } from "lucide-react";

const formSchema = z.object({
	email: z.string().email({
		message: "Please enter a valid email address.",
	}),
	password: z.string().min(8, {
		message: "Password must be at least 8 characters.",
	}),
});

export function LoginForm() {
	const router = useRouter();
	const [error, setError] = useState<string>("");
	const [isLoading, setIsLoading] = useState<boolean>(false);
	const form = useForm<z.infer<typeof formSchema>>({
		resolver: zodResolver(formSchema),
		defaultValues: {
			email: "",
			password: "",
		},
	});

	async function onSubmit(values: z.infer<typeof formSchema>) {
		if (isLoading) return;

		try {
			setIsLoading(true);
			const data = await sendData("/auth/login", "POST", values);
			const response = await data.json();

			if (!data.ok) {
				if (response.error === 'invalid_credentials') {
					setError("Invalid email or password");
				} else {
					setError(response.error);
				}
				return;
			}

			// Redirect on success
			router.push("/dashboard"); // or wherever you want to redirect after login
		} catch (error) {
			setError(
				error instanceof Error
					? error.message
					: "Network error. Please try again later."
			);
		} finally {
			setIsLoading(false);
		}
	}

	return (
		<Card>
			<CardHeader>
				<CardTitle>Login</CardTitle>
				<CardDescription>
					Enter your credentials to access your account
				</CardDescription>
			</CardHeader>
			<CardContent>
				<Form {...form}>
					<form
						onSubmit={form.handleSubmit(onSubmit)}
						className="space-y-8"
					>
						<FormField
							control={form.control}
							name="email"
							render={({ field }) => (
								<FormItem>
									<FormLabel>Email</FormLabel>
									<FormControl>
										<Input
											type="email"
											placeholder="your@email.com"
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
						{error && (
							<div className="text-sm text-red-500 text-center">
								{error}
							</div>
						)}
						<Button type="submit" className="w-full">
							{isLoading ? (
								<div className="flex items-center justify-center">
									<Loader2 className="mr-2 animate-spin" />{" "}
									<span>Loading...</span>
								</div>
							) : (
								<div className="flex items-center justify-center">
									<LogInIcon className="mr-2" />
									<span>Login</span>
								</div>
							)}
						</Button>
					</form>
				</Form>
			</CardContent>
			<CardFooter className="flex justify-center">
				<p className="text-sm text-gray-600">
					Don&apos;t have an account?{" "}
					<Link
						href="/register"
						className="text-blue-600 hover:underline"
					>
						Register here
					</Link>
				</p>
			</CardFooter>
		</Card>
	);
}
