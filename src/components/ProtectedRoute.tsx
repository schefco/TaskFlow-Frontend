import type { ReactNode } from "react";
import { Navigate } from "react-router-dom";
import { useAuthStore } from "../store/authStore";

// Wrapper component to protext pages that require login
export default function ProtectedRoute({ children }: { children: ReactNode }) {
    // Read auth state from Zustand
    const isAuthenticated = useAuthStore((state) => state.isAuthenticated);

    // if not logged in redirect to login page
    if (!isAuthenticated) {
        return <Navigate to="/login" replace />;
    }

    // Otherwise render the protected content
    return <>{children}</>
}