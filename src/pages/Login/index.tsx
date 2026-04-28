import { useAuthStore } from "../../store/authStore";
import { loginUser } from "../../api/authApi";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";

// Login Page
export default function LoginPage() {
    // Local from state (email and password)
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);

    // Zustand login function
    const login = useAuthStore((state) => state.login);
    const setTempToken = useAuthStore((state) => state.setTempToken);

    // Router navigation
    const navigate = useNavigate();

    // Handle form submission
    async function handleSubmit(e: React.SubmitEvent) {
        e.preventDefault();
        setLoading(true);

        try {
            // Send creds to backend and see if we need to reset password
            const { token, requiresPasswordReset } = await loginUser({ email, password });

            // Check for first time login
            // Redirect to password reset
            if (requiresPasswordReset) {
                setTempToken(token);
                toast("Please set your new password");
                navigate("/Login/first-time-password");
                return;
            }

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
        <div style={{ maxWidth: 400, margin: "0 auto", paddingTop: "4rem"}}>
            <h2>Login</h2>

            <form onSubmit={handleSubmit}>
                {/* Email input */}
                <div style={{ marginBottom: "1rem" }}>
                    <label>Email</label>
                    <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required style={{ width: "100%"}}/>
                </div>

                {/* Password inpur */}
                <div style={{ marginBottom: "1rem" }}>
                    <label>Password</label>
                    <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required style={{ width: "100%"}}/>
                </div>

                {/* Submit button */}
                <button type="submit" style={{ width: "100%" }} disabled={loading}>{loading ? "Logging in ..." : "Login"}</button>
            </form>

            <p>This site is still under construction</p>
        </div>
    );
}
