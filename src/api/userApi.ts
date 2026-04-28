import api from "./axios";

export async function getUserById(id: string) {
    // Loads details for the User Details page
    const response = await api.get(`/auth/users/${id}`);
    return response.data;
}

export async function updateUser(id: string, payload: { name: string; company?: string }) {
    // PATCH: send update to backend
    await api.patch(`/auth/users/${id}`, payload); // Returns 204
}

export async function deleteUser(id: string) {
    // DELETE: send delete request to backend
    await api.delete(`/auth/users/${id}`); // Returns 204
}

export async function resetUserPassword(id: string) {
    // Admin reset user password endpoint
    const response = await api.post(`/auth/users/${id}/reset-password`);
    return response.data; // Returns tempPassword
}