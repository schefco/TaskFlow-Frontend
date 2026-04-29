import { useProjectStore } from "../../store/projectStore";
import { useNavigate, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import "./CreateProject.css";

export default function CreateProject() {
    const { id } = useParams();
    const getProjectById = useProjectStore(s => s.getProjectById);
    const selectedProject = useProjectStore(s => s.selectedProject);

    // Project store actions
    const createProject = useProjectStore((s) => s.createProject);
    const updateProject = useProjectStore((s) => s.updateProject);
    const isLoading = useProjectStore((s) => s.isLoading);

    const isUpdate = !!id;

    const navigate = useNavigate();

    // Local form state or prefilled from DB
    const [form, setForm] = useState({
        name: "",
        description: "",
        priority: 2,
        status: 0,
        dueDate: ""
    });

    // Sync when projectToEdit changes
    useEffect(() => {
        if (isUpdate) {
            getProjectById(id!);
        }
    }, [id]);

    // Sync form when selectedProject loads
    useEffect(() => {
        if (isUpdate && selectedProject) {
            // eslint-disable-next-line react-hooks/set-state-in-effect
            setForm({
                name: selectedProject.name,
                description: selectedProject.description ?? "",
                priority: selectedProject.priority,
                status: selectedProject.status,
                dueDate: selectedProject.dueDate
                    ? selectedProject.dueDate.split("T")[0]
                    : ""
            });
        }
    }, [selectedProject, isUpdate]);

    // Submit handler
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (isUpdate) {
            await updateProject({ id: id!, ...form });
            navigate(`/projects/${id}`);
        } else {
            await createProject(form, navigate);
        }
    };

    return (
        <div className="createPage">
            {/**Card container */}
            <div className="createCard">
                <h1 className="createTitle">{isUpdate ? "Edit Project" : "Create New Project"}</h1>

                <form onSubmit={handleSubmit}>
                    {/**Project name */}
                    <div className="formGroup">
                        <label>Project Name</label>
                        <input
                        className="input"
                        value={form.name}
                        onChange={(e) => setForm({ ...form, name: e.target.value })}/>
                    </div>

                    {/**Priority dropdown */}
                    <div className="formGroup">
                        <label>Priority</label>
                        <select value={form.priority} onChange={(e) => setForm({ ...form, priority: Number(e.target.value)})}>
                            <option value={1}>Low</option>
                            <option value={2}>Medium</option>
                            <option value={3}>High</option>
                        </select>
                    </div>

                    {/**Status dropdown */}
                    <div className="formGroup">
                        <label>Status</label>
                        <select value={form.status} onChange={(e) => setForm({ ...form, status: Number(e.target.value)})}>
                            <option value={0}>Not Started</option>
                            <option value={1}>In Progress</option>
                            <option value={2}>Completed</option>
                            <option value={3}>On Hold</option>
                        </select>
                    </div>

                    {/**Due Date date picker */}
                    <div className="formGroup">
                        <label>Due Date</label>
                        <input type="date" value={form.dueDate} onChange={(e) => setForm({ ...form, dueDate: e.target.value})}/>
                    </div>

                    {/**Project description */}
                    <div className="formGroup">
                        <label>Description</label>
                        <textarea
                        className="textarea"
                        value={form.description}
                        onChange={(e) => setForm({ ...form, description: e.target.value})}/>
                    </div>

                    <button
                    type="submit"
                    disabled={isLoading}
                    className="submitBtn">
                        {isLoading 
                        ? isUpdate ? "Updating ..." : "Creating ..." 
                        : isUpdate ? "Save Changes" : "Create Project"}
                    </button>
                </form>
            </div>
        </div>
    );
}