import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import "./Register.css";

export default function Register() {
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [company, setCompany] = useState("");
    const [reason, setReason] = useState("");

    const navigate = useNavigate();

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        await fetch("https://taskflow-backend-96ki.onrender.com/auth/register", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                name,
                email,
                company,
                reason
            })
        });

        toast.success("Registration submitted");
        navigate("/login");
    };

    return (
        <div className="registerWrapper">
            <div className="registerCard">
                <h2 className="registerTitle">Request Access</h2>

                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div>
                            <label className="registerLabel">Request Access</label>
                            <input placeholder="Name"
                            className="registerInput"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            required/>
                        </div>

                        <div>
                            <label className="registerLabel">Email</label>
                            <input placeholder="Email"
                            className="registerInput"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required/>
                        </div>

                        <div>
                            <label className="registerLabel">Company</label>
                            <input placeholder="Company Name"
                            className="registerInput"
                            value={company}
                            onChange={(e) => setCompany(e.target.value)}/>
                        </div>

                        <div>
                            <label className="registerLabel">Reason for registering</label>
                            <textarea className="regiterTextarea" 
                            placeholder="Tell us what brought you here..."
                            value={reason}
                            onChange={(e) => setReason(e.target.value)}/>
                        </div>

                        <div className="registerButtonWrapper">
                            <button type="submit" className="registerButton">Submit Request</button>
                        </div>
                    </form>

                    <p className="registerFooter">
                        Already have an account?
                        <a onClick={() => navigate("/login")} className="registerLink">Login</a>
                    </p>
            </div>
        </div>
    );
}