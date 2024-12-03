export async function sendData<T>(
	url: string,
	method: "POST" | "PUT" | "DELETE",
	body: T
): Promise<Response> {
	const options: RequestInit = {
		method,
		headers: {
			"Content-Type": "application/json",
		},
		body: JSON.stringify(body),
	};

	const response = await fetch(process.env.NEXT_PUBLIC_API_URL + url, options);
	return response;
}
