import { useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useUserStore } from "../../store/userStore";
import "./UsersPage.css";

export default function UserDetailPage() {
    // Load in the user
    const { id } = useParams();
    const navigate = useNavigate();

    // load in store methods
    const { selectedUser, setSelectedUser, loadUser, updateUser, deleteUser, resetUserPassword } = useUserStore();

    // set the user and load in the details
    useEffect(() => {
        if (id) loadUser(id);
    }, [id, loadUser]);

    // if no user is selected
    if (!selectedUser) {
        return <div className="p-6 text-gray-300">Loading user ...</div>;
    }

    return (
        <div className="user-details-page">
            <h1 className="user-details-header">
                User Details
                <div className="user-details-underline"></div>
            </h1>

            <div className="user-details-form">

                {/**Name */}
                <div className="user-details-group">
                    <label className="user-details-label">Name</label>
                    <input type="text"
                    value={selectedUser.name}
                    onChange={(e) => setSelectedUser({ ...selectedUser, name: e.target.value })}
                    className="user-details-input"/>
                </div>

                {/**Email */}
                <div className="user-details-group">
                    <label className="user-details-label">Email</label>
                    <input type="text"
                    value={selectedUser.email}
                    readOnly
                    className="user-details-input-readonly"/>
                </div>

                {/**Company */}
                <div className="user-details-group">
                    <label className="user-details-label">Company</label>
                    <input type="text"
                    value={selectedUser.company ?? ""}
                    onChange={(e) => setSelectedUser({ ...selectedUser, company: e.target.value })}
                    className="user-details-input"/>
                </div>

                {/**Role */}
                <div className="user-details-page">
                    <label className="user-details-label">Role</label>
                    <input type="text"
                    value={selectedUser.role}
                    readOnly
                    className="user-details-input-readonly"/>
                </div>

                {/**Must Change Password */}
                <div className="user-details-page">
                    <label className="user-details-label">Must Change Password</label>
                    <input type="text"
                    value={selectedUser.mustChangePassword ? "Yes" : "No"}
                    readOnly
                    className="user-details-input-readonly"/>
                </div>

                {/**Buttons */}
                <div className="user-details-buttons">
                    {/**Save button */}
                    <button onClick={() => updateUser(selectedUser.id, {name: selectedUser.name, company: selectedUser.company ?? ""})}
                    className="btn-save">Save Changes</button>

                    {/**Reset Password button */}
                    <button onClick={async () => {
                        const temp = await resetUserPassword(selectedUser.id);
                        if (temp) alert(`Temporary password: ${temp}`);
                    }}
                    className="btn-reset">Reset Password</button>

                    {/**Delete user button */}
                    <button onClick={async () => {
                        await deleteUser(selectedUser.id);
                        navigate("/users");
                    }}
                    className="btn-delete">Delete User</button>
                </div>
            </div>
        </div>
    )
}