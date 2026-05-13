import { useAuthStore } from "../../store/authStore";
import { loginUser } from "../../api/authApi";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";
import "./Login.css";

// Login Page
export default function LoginPage() {
    // Local from state (email and password)
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);

    // Zustand login function
    const login = useAuthStore((state) => state.login);

    // Router navigation
    const navigate = useNavigate();

    // Handle form submission
    async function handleSubmit(e: React.SubmitEvent) {
        e.preventDefault();
        setLoading(true);

        try {
            // Send creds to backend and see if we need to reset password
            const { requiresPasswordReset } = await loginUser({ email, password });

            // Check for first time login
            // Redirect to password reset
            if (requiresPasswordReset) {
                toast("Please set your new password");
                navigate("/Login/first-time-password");
                return;
            }

            // Cookie is set - fetch user info
            await fetch("/api/auth/me", {
                credentials: "include"
            });

            // Store token and decoded user info in Zustand
            login();

            // Redirect to projects page
            navigate("/");
        } catch (err) {
            console.error("login failed:", err);
            alert("Invalid email or password");
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className="loginWrapper">
            <div className="loginCard">
                <h2 className="loginTitle">Welcome to TaskFlow</h2>

                <form onSubmit={handleSubmit} className="space-y-4">
                    {/* Email input */}
                    <div>
                        <label className="loginLabel">Email</label>
                        <input type="email" 
                        value={email} 
                        onChange={(e) => setEmail(e.target.value)} 
                        required 
                        className="loginInput"/>
                    </div>

                    {/* Password input */}
                    <div style={{ marginBottom: "1rem" }}>
                        <label className="loginLabel">Password</label>
                        <input type="password" 
                        value={password} 
                        onChange={(e) => setPassword(e.target.value)} 
                        required 
                        className="loginInput"/>
                    </div>

                    {/* Submit button */}
                    <div className="loginButtonWrapper">
                        <button type="submit" className="loginLink" disabled={loading}>
                            {loading ? "Logging in ..." : "Login"}
                        </button>
                    </div>
                </form>

                <p className="loginFooter">
                    Don't have an account?
                    <a onClick={() => navigate("/register")} className="loginLink">Sign up</a>    
                </p>
                <p className="loginFooter">Created by Schefco 2026</p>
            </div>

            <p className="loginInfo">
                This is a live portfolio demo of TaskFlow — a project and task management system 
                built to showcase real-world authentication, user approval workflows, and 
                role-based access. New accounts must be approved by an admin before logging in.
            </p>
        </div>
    );
}
