import React, { useState } from "react";

export default function Register() {
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [company, setCompany] = useState("");
    const [reason, setReason] = useState("");

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        await fetch("https://localhost:7154/auth/register", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                name,
                email,
                company,
                reason
            })
        });

        alert("Registration submitted");
    };

    return (
        <form onSubmit={handleSubmit}>
            <input placeholder="Name"
            value={name}
            onChange={(e) => setName(e.target.value)}/>

            <input placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}/>

            <input placeholder="Company"
            value={company}
            onChange={(e) => setCompany(e.target.value)}/>

            <textarea placeholder="Reason"
            value={reason}
            onChange={(e) => setReason(e.target.value)}/>

            <button type="submit">Register</button>
        </form>
    );
}