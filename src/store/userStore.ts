import { create } from "zustand";
import { getUserById, updateUser, deleteUser, resetUserPassword } from "../api/userApi";
import { toast } from "react-hot-toast";
import type { User } from "../types/User";

// UserStore shape
interface UserStore {
    selectedUser: User | null;
    setSelectedUser: (user: User | null) => void;

    loadUser: (id: string) => Promise<void>;
    updateUser: (id: string, payload: { name: string; company?: string}) => Promise<void>;
    deleteUser: (id: string) => Promise<void>;
    resetUserPassword: (id: string) => Promise<string | null>;
}

export const useUserStore = create<UserStore>((set, _get) => ({
    // Set initial state
    selectedUser: null,
    setSelectedUser: (user) => set({ selectedUser: user }),

    // ACTION: Load in the user
    loadUser: async (id: string ) => {
        try {
            // call the API
            const user = await getUserById(id);
            // set the user as the selectedUser
            set({ selectedUser: user });
        } catch {
            toast.error("Failed to load user");
        }
    },

    // ACTION: Update user
    updateUser: async (id: string, payload: { name: string; company?: string; }) => {
        try {
            // call the api to update user
            await updateUser(id, payload);

            // Refresh the user after update, refrech UI
            const refreshed = await getUserById(id);
            // set the updated user as the selected user
            set({ selectedUser: refreshed });

            toast.success("User updated");
        } catch {
            toast.error("Failed to update user");
        }
    },

    // ACTION: Delete user
    deleteUser: async (id: string) => {
        try {
            // Call the api for delete user
            await deleteUser(id);

            // Clear the selected user from state, refrech UI
            set({ selectedUser: null });

            toast.success("User deleted");
        } catch {
            toast.error("Failed to delete user");
        }
    },

    // ACTION: Reset user password
    resetUserPassword: async (id: string) => {
        try {
            // Call the api for reseting user's password
            const result = await resetUserPassword(id); // store tempPassword
            toast.success("Temporary password generated");
            toast.success("Temporary password email sent");
            return result.tempPassword; // Send the tempPassword to frontend
        } catch {
            toast.error("Failed to reset password");
            return null;
        }
    }
}))