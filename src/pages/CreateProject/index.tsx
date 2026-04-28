import { useProjectStore } from "../../store/projectStore";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import "./CreateProject.css";
import { useAuthStore } from "../../store/authStore";

export default function CreateProject() {
    // Local form state
    const [name, setName] = useState("");
    const [description, setDescription] = useState("");
    const [priority, setPriority] = useState(2); // Default priority is medium
    const [status, setStatus] = useState(0); // Default status is Not Started
    const [dueDate, setDueDate] = useState(""); // Set by user
    
    const createdByUserId = useAuthStore((s) => s.userId);

    // Project store actions
    const createProject = useProjectStore((s) => s.createProject);
    const isLoading = useProjectStore((s) => s.isLoading);

    const navigate = useNavigate();

    // Submit handler
    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        if (!name.trim()) return;

        createProject({ name, description, priority, status, dueDate, createdByUserId }, navigate);
    };

    return (
        <div className="createPage">
            {/**Card container */}
            <div className="createCard">
                <h1 className="createTitle">Create New Project</h1>

                <form onSubmit={handleSubmit}>
                    {/**Project name */}
                    <div className="formGroup">
                        <label>Project Name</label>
                        <input
                        className="input"
                        value={name}
                        onChange={(e) => setName(e.target.value)}/>
                    </div>

                    {/**Priority dropdown */}
                    <div className="formGroup">
                        <label>Priority</label>
                        <select value={priority} onChange={(e) => setPriority(Number(e.target.value))}>
                            <option value={1}>Low</option>
                            <option value={2}>Medium</option>
                            <option value={3}>High</option>
                        </select>
                    </div>

                    {/**Status dropdown */}
                    <div className="formGroup">
                        <label>Status</label>
                        <select value={status} onChange={(e) => setStatus(Number(e.target.value))}>
                            <option value={0}>Not Started</option>
                            <option value={1}>In Progress</option>
                            <option value={2}>Completed</option>
                            <option value={3}>On Hold</option>
                        </select>
                    </div>

                    {/**Due Date date picker */}
                    <div className="formGroup">
                        <label>Due Date</label>
                        <input type="date" value={dueDate} onChange={(e) => setDueDate(e.target.value)}/>
                    </div>

                    {/**Project description */}
                    <div className="formGroup">
                        <label>Description</label>
                        <textarea
                        className="textarea"
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}/>
                    </div>

                    <button
                    type="submit"
                    disabled={isLoading}
                    className="submitBtn">
                        {isLoading ? "Creating ..." : "Create Project"}
                    </button>
                </form>
            </div>
        </div>
    );
}