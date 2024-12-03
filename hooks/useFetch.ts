import { useState, useEffect } from "react";

export function useFetch<T>(
	url: string,
	method: "GET" | "POST" | "PUT" | "DELETE" = "GET",
	body?: Record<string, unknown>
) {
	const [data, setData] = useState<T | null>(null);
	const [isLoading, setIsLoading] = useState(true);
	const [hasError, setHasError] = useState<string | null>(null);

	useEffect(() => {
		const fetchData = async () => {
			setIsLoading(true);
			try {
				const options: RequestInit = {
					method,
					headers: {
						"Content-Type": "application/json",
					},
					body: body ? JSON.stringify(body) : undefined,
				};

				const response = await fetch(process.env.NEXT_PUBLIC_API_URL + url, options);
				if (!response.ok)
					throw new Error("Network response was not ok");
				const result = await response.json();
				setData(result);
			} catch (error) {
				const errorMessage = (error as Error).message; // Type assertion
				setHasError(errorMessage);
			} finally {
				setIsLoading(false);
			}
		};

		fetchData();
	}, [url, method, body]);

	return { data, isLoading, hasError };
}
