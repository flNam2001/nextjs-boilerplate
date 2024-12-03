export async function sendData<T>(
	url: string,
	method: "POST" | "PUT" | "DELETE",
	body: T
): Promise<Response> {
	if (!process.env.NEXT_PUBLIC_API_URL) {
		throw new Error('API URL environment variable is not defined');
	}

	const options: RequestInit = {
		method,
		headers: {
			"Content-Type": "application/json",
		},
		body: JSON.stringify(body),
		// Add timeout
		signal: AbortSignal.timeout(5000),
	};

	const MAX_RETRIES = 3;
	let attempt = 0;
	
	while (attempt < MAX_RETRIES) {
		try {
            const apiUrl = new URL(url, process.env.NEXT_PUBLIC_API_URL);
            const response = await fetch(apiUrl, options);
			return response;
		} catch (error) {
			attempt++;
			if (attempt === MAX_RETRIES) throw error;
			// Exponential backoff
			await new Promise(resolve => setTimeout(resolve, Math.pow(2, attempt) * 100));
		}
	}
	
	throw new Error('Max retries exceeded');
}
