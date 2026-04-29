import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

// Holds token + decoded user info in memory only

// Shape of the auth store
interface AuthState {
    isAuthenticated: boolean;

    userId: string | null;
    email: string | null;
    role: string | null;
    token: string | null;

    login: (data?: {
        userId?: string;
        email?: string;
        role?: string;
        token?: string;
    }) => void;

    logout: () => void;

    // Temp token state for first-time login and password reset
    tempToken: string | null;
    setTempToken: (token: string) => void;
    clearTempToken: () => void;
}

// Zustand store for authentication
export const useAuthStore = create<AuthState>()(
    persist(
        (set) => ({
        // Intitial state
        isAuthenticated: false,
        userId: null,
        email: null,
        role: null,
        token: null,


        // Login: mark user as authenticated (cookie handles idenity)
        login: (data) => {
            set((state) => ({ 
                isAuthenticated: true,
                userId: data?.userId ?? state.userId,
                email: data?.email ?? state.email,
                role: data?.role ?? state.role,
                token: data?.token ?? state.token,            
            }));
        },
        
        // Temp token state
        tempToken: null, 
        setTempToken: (token) => set({ tempToken: token }), // sets the temp token so we don't lose it during refresh
        clearTempToken: () => set({ tempToken: null }), // clears the temp token after first password reset

        // Logout: clear everything
        logout: () => 
            set({

                isAuthenticated: false,
                tempToken: null
            }),
        }),
        {
            name: "auth",
            storage: createJSONStorage(() => sessionStorage), // so we don't lose anything on refresh
        }
    )
);