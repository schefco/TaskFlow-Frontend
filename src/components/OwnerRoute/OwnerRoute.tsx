/** For RBAC of navlinks */
import { Navigate } from "react-router-dom";
import { useAuthStore } from "../../store/authStore";
import type { JSX } from "react";

export default function OwnerRoute({ children }: { children: JSX.Element }) {
    const user = useAuthStore(state => state.role );

    // If user is not loaded yet
    if (!user) return null;

    // Only allow Owner
    if (user !== "Owner") {
        return <Navigate to="/welcome" replace />
    }

    return children;
}