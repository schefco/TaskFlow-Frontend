import { NavLink } from "react-router-dom";
import { useAuthStore } from "../../store/authStore";
import "./MainLayout.css";

export default function Sidebar() {
    const user = useAuthStore(state => state.role);

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
            
            {user === "Owner" && (
                <NavLink to="/pending-users" 
                className={({ isActive }) => isActive ? "sidebar-link active" : "sidebar-link"}>
                    Pending Users
                </NavLink>)}
            
            {user === "Owner" && (
                <NavLink to="/users"
                className={({ isActive }) => isActive ? "sidebar-link active" : "sidebar-link"}>
                    Users
                </NavLink>)}
        </div>
    );
}