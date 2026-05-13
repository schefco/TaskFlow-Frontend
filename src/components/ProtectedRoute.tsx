import { useEffect, useState, type ReactNode } from "react";
import { Navigate } from "react-router-dom";

// Wrapper component to protext pages that require login
export default function ProtectedRoute({ children }: { children: ReactNode }) {
    // Read auth state from Zustand
    const [loading, setLoading] = useState(true);
    const [authorized, setAuthorized] = useState(false);

    useEffect(() => {
        async function verify() {
            try {
                const res = await fetch("/api/auth/me", {
                    credentials: "include"
                });

                if (res.ok) {
                    setAuthorized(true);
                } else {
                    setAuthorized(false);
                }
            } catch {
                setAuthorized(false);
            } finally {
                setLoading(false);
            }
        }
        verify();
    }, [])

    if (loading) return null; 

    // Otherwise render the protected content
    return authorized ? children : <Navigate to="/login" replace></Navigate>
}