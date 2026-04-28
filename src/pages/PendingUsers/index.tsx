import { useEffect, useState } from "react";
import type { PendingUser } from "../../api/authApi";
import { getPendingUsers, approvePendingUser } from "../../api/authApi";
import { toast } from "react-toastify";

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
        return <div className="p-4">Loading pending users ...</div>;
    }

    // Load page
    return (
        <div className="p-4">
            <div className="flex justify-between items-center pl-3 mb-6">
                <div className="flex flex-col">
                    <h1 className="text-2xl font-semibold text-gray-100">Pending Users</h1>
                    <div className="border-b-2 border-emerald-500 w-fit pb-1"></div>
                </div>

                <div className="w-40"></div>
            </div>
            
            {/**Empty state */}
            {pendingUsers.length === 0 && (
                <div className="text-gray-300 pl-3">
                    No pending users.
                </div>
            )}

            {/**Pending users list */}
            {pendingUsers.length > 0 && (
                <div className="pl-3 space-y-4">
                    {pendingUsers.map((user) => (
                        <div key={user.id}
                        className="flex justify-between items-center bg-gray-800 px-5 py-4 rounded-md shadow-sm shadow-black/40 hover:bg-gray-750 transition-colors">
                            <div>
                                <div className="text-gray-100 font-medium">{user.email}</div>
                                <div className="text-gray-300 text-sm">{user.name}</div>
                                <div className="text-gray-500 text-sm">{user.company}</div>
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
                            className="bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded-md font-medium shadow-sm shadow-black/30 active:scale-[0.98] transition"
                            >
                                Approve
                            </button>
                        </div>
                    ))}
                </div>
            )}

            {tempPassword && (
                <div className="fixed inset-9 bg-black/60 backdrop-blur-sm flex items-center justify-center">
                    <div className="bg-gray-900 p-6 rounded-md w-80 border border-gray-700 shadow-lg shadow-black/40">
                        <h2 className="text-xl font-semibold text-gray-100 mb-3">Temporary Password</h2>

                        <div className="text-gray-200 text-lg font-mono mb-6 break-all select-all">{tempPassword}</div>

                        <button onClick={() => setTempPassword(null)}
                        className="bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded-md w-full font-medium shadow-sm shadow-black/30 active:scale-[0.98] transition">Close</button>
                    </div>
                </div>
            )}

        </div>
    );
}