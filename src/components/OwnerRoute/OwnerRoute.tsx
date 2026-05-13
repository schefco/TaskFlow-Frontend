/** For RBAC of navlinks */
import { useState, useEffect } from "react";
import { Navigate } from "react-router-dom";
import type { JSX } from "react";

export default function OwnerRoute({ children }: { children: JSX.Element }) {
    const [authorized, setAuthorized] = useState(false);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Verify the user is the "Owner"
        async function verify() {
            try {
                const res = await fetch("/auth/me", {
                    credentials: "include"
                });

                if (!res.ok) {
                    setAuthorized(false);
                    return;
                }

                const user = await res.json();

                if (user.role === "Owner") { // If owner, Authorize
                    setAuthorized(true);
                } else {
                    setAuthorized(false); // If not, don't authorize
                }
            } catch {
                setAuthorized(false);
            } finally {
                setLoading(false)
            }
        }

        verify();
    }, [])

    if (loading) return null;

    return authorized ? children : <Navigate to="/welcome" replace></Navigate>;
}