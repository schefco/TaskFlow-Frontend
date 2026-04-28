// Utility to decode JWT tokens and extract userId, email and role

export function decodeJwt(token: string){
    // Split token into three parts: header, payload, signature
    const parts = token.split('.');

    // Extract the payload
    const payloadBase = parts[1];

    // Convert Payload Base64 to JSON string
    const jsonString = atob(payloadBase);

    // Parse JSON into an object
    const payload = JSON.parse(jsonString);

    // Extract fields from payload
    const userId = payload["sub"];
    const email = payload["email"];
    const role = payload["http://schemas.microsoft.com/ws/2008/06/identity/claims/role"];

    // Return clean object
    return {
        userId: userId,
        email: email,
        role: role
    };
}