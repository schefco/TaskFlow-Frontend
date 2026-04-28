import "./MainLayout.css";
import { Outlet, useNavigate } from "react-router-dom";
import { useAuthStore } from "../../store/authStore";
import Sidebar from "./Sidebar";

export default function MainLayout() {
    const logout = useAuthStore((state) => state.logout); // Access logout from the auth store

    const navigate = useNavigate(); // Initialize navigation so we can redirect

    const handleLogout = () => {
        // Clear the auth state (token, user, etc.)
        logout();

        // Redirect user back to the login page
        navigate("/login");
    }

    // Outer wrapper for the entire layout
    return (
        <div>
            <div className="main-navbar">
                <div>TaskFlow</div>
                {/**Logout button in the top navbar */}
                <div>
                    <button className="logout-button"
                    onClick={handleLogout}>Logout</button>
                </div>
            </div>

           <div className="main-body">
                {/**Sidebar Container */}
                <Sidebar />

                {/**Main content container */}
                <div className="main-content">
                    <Outlet />
                </div> 
            </div> 
        </div>
    );
}