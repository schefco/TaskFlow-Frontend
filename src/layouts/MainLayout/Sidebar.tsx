import { NavLink } from "react-router-dom";
import "./MainLayout.css";
import { useEffect, useState } from "react";

export default function Sidebar() {
    const [role, setRole] = useState<string | null>(null);

    useEffect(() => {
        async function loadUser() {
            try {
                const res = await fetch("/api/auth/me", {
                    credentials: "include"
                });

                if (!res.ok) {
                    setRole(null);
                    return;
                }

                const user = await res.json();
                setRole(user.role);
            } catch {
                setRole(null);
            }
        }

        loadUser();
    }, [])

    return (
        <div className="main-sidebar">
            <NavLink to="/welcome"
            className={({ isActive }) => isActive ? "sidebar-link active" : "sidebar-link"}>
                Home
            </NavLink>

            <NavLink to="/projects" 
            className={({ isActive }) => isActive ? "sidebar-link active" : "sidebar-link"}>
                Projects
            </NavLink>
            
            {role === "Owner" && (
                <NavLink to="/pending-users" 
                className={({ isActive }) => isActive ? "sidebar-link active" : "sidebar-link"}>
                    Pending Users
                </NavLink>)}
            
            {role === "Owner" && (
                <NavLink to="/users"
                className={({ isActive }) => isActive ? "sidebar-link active" : "sidebar-link"}>
                    Users
                </NavLink>)}
        </div>
    );
}