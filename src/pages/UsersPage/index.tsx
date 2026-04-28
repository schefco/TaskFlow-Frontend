import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { getApprovedUsers } from "../../api/authApi";
import type { UserDto } from "../../api/authApi";
import "./UsersPage.css";

export default function UsersPage() {
    const [loading, setLoading] = useState(true);
    const [users, setUsers] = useState<UserDto[]>([]);
    const navigate = useNavigate();

    useEffect(() => {
        async function load() {
            try {
                const data = await getApprovedUsers();
                setUsers(data);
            } catch {
                toast.error("Failed to load users");
            } finally {
                setLoading(false);
            }
        }
        load()
    }, []);

    if (loading){
        return <div className="users-loading">Loading users ...</div>;
    }

    return (
        <div className="users-page">
            <div className="users-header">
                <h1 className="users-title">Users</h1>
                <div className="users-title-underline"></div>
            </div>

            {users.length === 0 && (
                <div className="users-empty">No users found. </div>
            )}

            {users.length > 0 && (
                <table className="users-table">
                    <thead>
                        <tr>
                            <th>Email</th>
                            <th>Name</th>
                            <th>Company</th>
                            <th>Must Change Password</th>
                        </tr>
                    </thead>

                    <tbody>
                        {users.map((u) => (
                            <tr key={u.id}
                            onClick={() => navigate(`/users/${u.id}`)}>
                                <td>{u.email}</td>
                                <td>{u.name}</td>
                                <td>{u.company}</td>
                                <td>{u.mustChangePassword ? "Yes" : "No"}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            )}
        </div>
    );
}