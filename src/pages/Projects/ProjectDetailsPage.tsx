import { useNavigate } from "react-router-dom";
import { useParams } from "react-router-dom";
import { useProjectStore } from "../../store/projectStore";
import { useEffect, useState } from "react";
import { getStatusLabel, getProrityLabel } from "../../utils/projectEnums";
import TaskRow from "../../components/TaskRow/TaskRow";
import "./ProjectDetails.css";
import CreateTaskModal from "../../components/CreateTask/CreateTaskModal";
import { useTaskStore } from "../../store/taskStore";
import type { Task } from "../../types/Task";

export default function ProjectDetailsPage() {
    const navigate = useNavigate();
    const deleteProject = useProjectStore(s => s.deleteProject);

    const { id } = useParams();
    const [isCreateTaskOpen, setIsCreateTaskOpen] = useState(false);
    const [taskToEdit, setTaskToEdit] = useState<Task | null>(null);
    const [parentTaskId, setParentTaskId] = useState<string | null>(null);

    // Pull in Zustand state and actions
    const getProjectById = useProjectStore(s => s.getProjectById);
    const project = useProjectStore(s => s.selectedProject);
    const isLoading = useProjectStore(s => s.isLoading);
    
    // Pull is TaskStore to build task tree
    const tasks = useTaskStore(s => s.tasks);
    const loadTasks = useTaskStore(s => s.loadTasks);

    // Load the project on mount
    useEffect(() => {
        // If we have project id. go get it
        if (id) getProjectById(id);
    }, [id, getProjectById]);

    // load the project tasks on mount
    useEffect(() => {
        if (id) {
            loadTasks(id);
        }
    }, [id, loadTasks]);

    // Loading state
    if (isLoading || !project) {
        return <div className="pageContainer">Loading project ...</div>;
    }

    function handleEditTask(task: Task) {
        setTaskToEdit(task);
        setParentTaskId(task.parentTaskId ?? null);
        setIsCreateTaskOpen(true);
    }

    function handleCreateSubtask(parentTaskId: string) {
        setTaskToEdit(null);
        setParentTaskId(parentTaskId);
        setIsCreateTaskOpen(true);
    };

    return (
        <>
        <div className="pageContainer">

            {/**Header Section */}
            <div className="projectHeader">

                <div className="headerTopRow">
                    {/**Back and action buttons*/}
                    <button className="backButton" onClick={() => navigate(-1)}>← Back</button>

                    <div className="projectActions">
                        <button className="btnEdit"
                        onClick={() => navigate(`/projects/${project.id}/edit`)}>
                            Edit
                        </button>

                        <button className="btnDelete"
                        onClick={async () => {
                            if (!confirm("Are you sure you want to delete this project?")) return;

                            await deleteProject(project.id);

                            navigate("/projects");
                        }}>
                            Delete
                        </button>

                        <button className="btnAddTask"
                        onClick={() => {
                            setTaskToEdit(null);
                            setParentTaskId(null);
                            setIsCreateTaskOpen(true);
                        }}>
                            + Add Task
                        </button>
                    </div>
                </div>

                <h1 className="projectTitle">{project.name}</h1>

                <p className="projectDescription">{project.description}</p>

                <div className="projectMeta">
                    <span>Status: {getStatusLabel(project.status)}</span>
                    <span>Priority: {getProrityLabel(project.priority)}</span>
                    <span>Due: {new Date(project.dueDate).toLocaleDateString()}</span>
                </div>
            </div>

            {/**Task Section */}
            <div className="taskSection">
                <div className="taskTreeContainer">
                    {tasks.map(task => (
                        <TaskRow key={task.id} task={task} onEdit={handleEditTask} createSubtask={handleCreateSubtask} />
                    ))}
                </div>
            </div>
        </div>

        {/**CreateTaskModal */}
        <CreateTaskModal 
            isOpen={isCreateTaskOpen}
            onClose={() => setIsCreateTaskOpen(false)}
            projectId={project.id}
            taskToEdit={taskToEdit}
            parentTaskIdProp={parentTaskId}
        />
        </>
    );
}