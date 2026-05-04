import { useEffect, useState } from "react";
import type { PendingUser } from "../../api/authApi";
import { getPendingUsers, approvePendingUser } from "../../api/authApi";
import { toast } from "react-toastify";
import "./PendingUsers.css";

export default function PendingUsersPage() {
    // List of users waiting for approval
    const [pendingUsers, setPendingUsers] = useState<PendingUser[]>([]);

    // Loading state for initial fetch
    const [loading, setLoading] = useState(true);

    // Modal state for showing temp password
    const [tempPassword, setTempPassword] = useState<string | null>(null);

    // Load pending users on mount
    useEffect(() => {
        async function load() {
            try {
                const users = await getPendingUsers();
                setPendingUsers(users);
            } catch {
                toast.error("Failed to load pending users");
            } finally {
                setLoading(false);
            }
        }
        load();
    }, []);

    // Avoid rendering table before data arrives
    if (loading) {
        return <div className="pendingPage">Loading pending users ...</div>;
    }

    // Load page
    return (
        <div className="pendingPage">
            <div className="pendingHeader">
                <div className="flex flex-col">
                    <h1 className="pengingTitle">Pending Users</h1>
                    <div className="pendingUnderline"></div>
                </div>

                <div className="w-40"></div>
            </div>
            
            {/**Empty state */}
            {pendingUsers.length === 0 && (
                <div className="pendingEmpty">
                    No pending users.
                </div>
            )}

            {/**Pending users list */}
            {pendingUsers.length > 0 && (
                <div className="pendingList">
                    {pendingUsers.map((user) => (
                        <div key={user.id}
                        className="pendingCard">
                            <div>
                                <div className="pendingEmail">{user.email}</div>
                                <div className="pendingName">{user.name}</div>
                                <div className="pendingCompany">{user.company}</div>
                            </div>

                            <button onClick={async () => {
                                try {
                                    const result = await approvePendingUser(user.id);

                                    // Store temp password for modal
                                    setTempPassword(result.tempPassword);

                                    // Remove user from list
                                    setPendingUsers(prev => prev.filter(u => u.id !== user.id));

                                    toast.success("User approved");
                                } catch {
                                    toast.error("Failed to approve user");
                                }
                            }}
                            className="pendingApproveBtn"
                            >
                                Approve
                            </button>
                        </div>
                    ))}
                </div>
            )}

            {tempPassword && (
                <div className="pendingModalBackdrop">
                    <div className="pendingModalCard">
                        <h2 className="pendingModalTitle">Temporary Password</h2>

                        <div className="pendingModalPassword">{tempPassword}</div>

                        <button onClick={() => setTempPassword(null)}
                        className="pendingModalClose">Close</button>
                    </div>
                </div>
            )}

        </div>
    );
}