import { useEffect } from "react";
import { useProjectStore } from "../../store/projectStore";
import "./Projects.css";
import { useNavigate } from "react-router-dom";

export default function ProjectsPage() {
    // Zustand store state
    const projects = useProjectStore((s) => s.projects);
    const isLoading = useProjectStore((s) => s.isLoading);
    const getProjects = useProjectStore((s) => s.getProjects)

    const navigate = useNavigate();

    // Load projects on mount
    useEffect(() => {
        getProjects();
    }, [getProjects]);

    // Loading state
    if (isLoading) {
        return <div className="pageContainer">Loading projects ...</div>;
    }

    //Render project list
    return (
        <div className="pageContainer">
            
            {/**Header row */}
            <div className="flex items-center justify-between mb-6">
                <h2 className="pageTitle">Projects</h2>

                <button onClick={() => navigate("/projects/create")}
                className="bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded transition">
                    + Create Project
                </button>
            </div>

            {projects.length === 0 && <p>No projects found.</p>}

            <ul className="projectList">
                {projects.map((p) => (
                    <li key={p.id} className="projectItem" onClick={() => navigate(`/projects/${p.id}`)}>
                        <strong>{p.name}</strong>
                        <p>{p.description}</p>
                        <small>Created: {new Date(p.createdAt).toLocaleDateString()}</small>
                    </li>
                ))}
            </ul>
        </div>
    );
}