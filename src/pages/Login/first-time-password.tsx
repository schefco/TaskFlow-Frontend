import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../api/axios";
import { useAuthStore } from "../../store/authStore";
import { toast } from "react-hot-toast";
import "./Login.css";

export default function FirstTimePasswordPage() {
    // Page states
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    // pull temp token and login from store
    const tempToken = useAuthStore(state => state.tempToken);
    const login = useAuthStore(state => state.login);

    // For redirect
    const navigate = useNavigate();

    // Redirect if user manually types URL
    if (!tempToken) {
        navigate("/login");
        return null;
    }

    // Submit handler
    const handleSubmit =  async (e: React.FormEvent) => {
        e.preventDefault();
        setError(""); // clears error tracking

        // Validity checks and error messages
        if (newPassword !== confirmPassword) {
            toast.error("Passwords do not match");
            return;
        }

        if (newPassword.length < 8) {
            toast.error("Password must be at least 8 characters");
            return;
        }

        if (!newPassword || !confirmPassword) {
            toast.error("Please fill out both fields");
            return;
        }

        try {
            // Updating password
            setLoading(true);

            await api.post(
                "/auth/first-time-password",
                { newPassword }, 
                { 
                    withCredentials: true,
                    headers: 
                    { 
                        Authorization: `Bearer ${tempToken}`,
                    },
                }
            );

            useAuthStore.getState().clearTempToken();

            login();
            toast.success("Password updated successfully"); // Great sucess!
            navigate("/");
        } catch {
            toast.error("Something went wrong. Try again."); // For any error outside of validity checks
        } finally {
            setLoading(false); // set loading to false to reset page state
        }
    };

    return (
        <div className="ftp-container">
            <h2 className="ftp-title">Set Your New Password</h2>

            <form className="ftp-form" onSubmit={handleSubmit}>
                <input
                type="password"
                placeholder="New password"
                className="ftp-input"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}/>

                <input
                type="password"
                placeholder="Confirm password"
                className="ftp-input"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}/>

                <button className="ftp-button" type="submit" disabled={loading}>
                    {loading ? "Updating ..." : "Update Password"}
                </button>
            </form>

            {error && <p className="ftp-error">{error}</p>}
        </div>
    );
}