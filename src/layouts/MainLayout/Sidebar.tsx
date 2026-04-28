import { NavLink } from "react-router-dom";
import "./MainLayout.css";

export default function Sidebar() {
    return (
        <div className="main-sidebar">
            <NavLink to="/projects" 
            className={({ isActive }) => isActive ? "sidebar-link active" : "sidebar-link"}>
                Projects
            </NavLink>
            
            <NavLink to="/pending-users" 
            className={({ isActive }) => isActive ? "sidebar-link active" : "sidebar-link"}>
                Pending Users
            </NavLink>

            <NavLink to="/users"
            className={({ isActive }) => isActive ? "sidebar-link active" : "sidebar-link"}>
                Users
            </NavLink>
        </div>
    );
}