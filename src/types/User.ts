export interface User {
    id: string;
    name: string;
    email: string;
    company?: string | null;
    role: string;
    mustChangePassword: boolean;
}