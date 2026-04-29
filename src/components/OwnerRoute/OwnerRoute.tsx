/** For RBAC of navlinks */
import { Navigate } from "react-router-dom";
import { useAuthStore } from "../../store/authStore";
import type { JSX } from "react";

export default function OwnerRoute({ children }: { children: JSX.Element }) {
    const role = useAuthStore(state => state.role );

    // If user is not loaded yet
    if (!role) return null;

    // Only allow Owner
    if (role !== "Owner") {
        return <Navigate to="/welcome" replace />
    }

    return children;
}