import api from "./axios";

// Shape of the login request body
interface LoginRequest {
    email: string;
    password: string;
}

// Shape of pending user request
export interface PendingUser {
    id: string;
    name: string;
    email: string;
    company?: string;
    reason?: string;
}

// Shape of user request body
export interface UserDto {
    id: string;
    name: string;
    email: string;
    company?: string;
    mustChangePassword: boolean;
}

// Call the backend /auth/login endpoint
export async function loginUser(data: LoginRequest): Promise<{ token: string; requiresPasswordReset: boolean }> {
    // POST email and password to the backend
    const response = await api.post("/auth/login", {
        email: data.email,
        password: data.password
    });

    // return the token so the login page can pass it to the authStore.login()
    return response.data;
}

// Call the backend /auth/pending
export async function getPendingUsers(): Promise<PendingUser[]> {
    const response = await api.get("/auth/pending");
    return response.data;
}

// Call the backend /auth/approve
export async function approvePendingUser(pendingUserId: string): Promise<{ tempPassword: string }> {
    const response =  await api.post("/auth/approve", {
        pendingUserId
    });

    return response.data;
}

// Call the backend /auth/users
export async function getApprovedUsers(): Promise<UserDto[]> {
    const response = await api.get("/auth/users");
    return response.data;
}