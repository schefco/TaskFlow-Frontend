import { Navigate } from "react-router-dom";
import { useAuthStore } from "../store/authStore";
import type { ReactNode } from "react";

// Wrapper component to protect pages that require login
export default function ProtectedRoute({ children }: { children: ReactNode }) {
    // Check if authenticated
    const isAuthenticated = useAuthStore(state => state.isAuthenticated)

    return isAuthenticated ? children : <Navigate to="/login" replace></Navigate>
}