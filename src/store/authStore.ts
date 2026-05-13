import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

// Holds token + decoded user info in memory only

// Shape of the auth store
interface AuthState {
    isAuthenticated: boolean;

    userId: string | null;
    email: string | null;
    role: string | null;

    login: (userId: string, email: string, role: string) => void;

    logout: () => void;

    // Temp token state for first-time login and password reset
    tempToken: string | null;
    setTempToken: (token: string) => void;
    clearTempToken: () => void;
    checkAuth: () => void;
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


        // Login: mark user as authenticated (cookie handles idenity)
        login: (userId, email, role) => {
            set(() => ({ 
                isAuthenticated: true,
                userId,
                email,
                role            
            }));
        },
        
        // Temp token state
        tempToken: null, 
        setTempToken: (token) => set({ tempToken: token }), // sets the temp token so we don't lose it during refresh
        clearTempToken: () => set({ tempToken: null }), // clears the temp token after first password reset

        checkAuth: async () => {
            try {
                const res = await fetch("/api/auth/me", {
                    credentials: "include"
                });

                if (res.ok) {
                    const me = await res.json();

                    set({ 
                        isAuthenticated: true,
                        userId: me.userId,
                        email: me.email,
                        role: me.role
                    });
                } else {
                    set({ 
                        isAuthenticated: false,
                        userId: null,
                        email: null,
                        role: null
                    });
                }
            } catch {
                set({ 
                    isAuthenticated: false,
                    userId: null,
                    email: null,
                    role: null
                });
            }
        },

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