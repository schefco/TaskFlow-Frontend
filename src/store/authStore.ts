import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

// Holds token + decoded user info in memory only

// Shape of the auth store
interface AuthState {
    isAuthenticated: boolean;

    login: () => void;

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


        // Login: mark user as authenticated (cookie handles idenity)
        login: () => {
            set(() => ({ 
                isAuthenticated: true            
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