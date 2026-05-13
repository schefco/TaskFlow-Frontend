import { NavLink } from "react-router-dom";
import "./MainLayout.css";
import { useAuthStore } from "../../store/authStore";

export default function Sidebar() {
    const role = useAuthStore(state => state.role);

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