/** For RBAC of navlinks */
import { Navigate } from "react-router-dom";
import type { JSX } from "react";
import { useAuthStore } from "../../store/authStore";

export default function OwnerRoute({ children }: { children: JSX.Element }) {
    // Check users role
    const role = useAuthStore(state => state.role);

    return role === "Owner" ? children : <Navigate to="/welcome" replace></Navigate>;
}