"use severe";

export const signupCredentials = async(formdata: FormData) => {
    const response = await fetch('/api/auth/signup', {
        method: 'POST',
        body: formdata
    });

    if (!response.ok) {
        throw new Error('Signup failed');
    }

    return response.json();
}