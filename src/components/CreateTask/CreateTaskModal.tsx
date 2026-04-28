import "./CreateTaskModal.css";
import { useState, useEffect } from "react";
import { getTaskStatusLabel, getTaskProrityLabel } from "../../utils/taskEnums";
import type { Task } from "../../types/Task";
import { useTaskStore } from "../../store/taskStore";

interface CreateTaskModalProps {
    isOpen: boolean; // controls if the Modal is displayed or not
    onClose: () => void; // Action for closing the Modal
    projectId: string; // For linking task to a project
    taskToEdit?: Task | null; // toggles Create for dual purpose as Update task page.
    parentTaskIdProp?: string | null; // for creating and updating subtasks
}

export default function CreateTaskModal({ isOpen, onClose, projectId, taskToEdit, parentTaskIdProp }: CreateTaskModalProps) {
    // Stores state
    const createTask = useTaskStore(s => s.createTask);
    const updateTask = useTaskStore(s => s.updateTask);
    const isUpdate = !!taskToEdit;

    // Form field data to be collected and default states
    // If we are in update mode then pull in Task data and pre fill the form fields
    const [title, setTitle] = useState(taskToEdit?.title ?? "");
    const [description, setDescription] = useState(taskToEdit?.description ?? "");
    const [status, setStatus] = useState(taskToEdit?.status ?? 0); // Default: To Do
    const [priority, setPriority] = useState(taskToEdit?.priority ?? 0); // Default: None
    const [dueDate, setDueDate] = useState(taskToEdit?.dueDate ? taskToEdit.dueDate.split("T")[0] : "");
    const [parentTaskId, setParentTaskId] = useState<string | undefined>(taskToEdit?.parentTaskId ?? parentTaskIdProp ?? undefined);

    // Load in task data on mount if we are in the update state
    useEffect(() => {
        if (taskToEdit) {
            // eslint-disable-next-line react-hooks/set-state-in-effect
            setTitle(taskToEdit.title);
            setDescription(taskToEdit.description ?? "");
            setStatus(taskToEdit.status);
            setPriority(taskToEdit.priority);
            setDueDate(taskToEdit.dueDate ? taskToEdit.dueDate.split("T")[0] : "");
            setParentTaskId(taskToEdit.parentTaskId ?? undefined);
        } else {
            setTitle("");
            setDescription("");
            setStatus(0);
            setPriority(0);
            setDueDate("");
            setParentTaskId(parentTaskIdProp ?? undefined);
        }
    }, [taskToEdit, parentTaskIdProp, isOpen]);

    if (!isOpen) return null; // if we aren't set to true don't display

    // Submit handler
    const handleSubmit = async () => {
        if (isUpdate && taskToEdit) {
            await updateTask(taskToEdit.id, {
                taskId: taskToEdit.id,
                title,
                description,
                status,
                dueDate: dueDate ? new Date(dueDate).toISOString() : null,
                priority,
                parentTaskId: parentTaskId ?? null
            });
        } else {
            await createTask({
                title,
                description,
                status,
                priority,
                dueDate: dueDate ? new Date(dueDate).toISOString() : null,
                parentTaskId: parentTaskId || null,
                projectId
            });
        }

        onClose();
    };

    return (
        <div className="modalBackdrop" onClick={onClose}>
            <div className="modalCard" onClick={e => e.stopPropagation()}>
                <div className="modalHeader">
                    <div>
                        <h2>{isUpdate ? "Update Task" : "Create Task"}</h2>           
                    </div>

                    <div>
                        <button className="modalClose" onClick={onClose}>X</button>    
                    </div>
                </div>

                <div className="modalBody">
                    {/**Task Title */}
                    <div className="formGroup">
                        <label>Title</label>
                        <input type="text"
                        value={title}
                        onChange={e => setTitle(e.target.value)}
                        className="inputField"
                        placeholder="Task Title"/>
                    </div>

                    {/**Task Description */}
                    <div className="formGroup">
                        <label>Description</label>
                        <textarea value={description}
                        onChange={e => setDescription(e.target.value)}
                        className="textareaField"
                        placeholder="Task description"/>
                    </div>

                    {/**Row for Status and Priority dropdowns */}
                    <div className="formRow">
                        <div className="formGroup">
                            <label>Status</label>
                            <select value={status}
                            onChange={e => setStatus(Number(e.target.value))}
                            className="selectField">
                                <option value={0}>{getTaskStatusLabel(0)}</option>
                                <option value={1}>{getTaskStatusLabel(1)}</option>
                                <option value={2}>{getTaskStatusLabel(2)}</option>
                                <option value={3}>{getTaskStatusLabel(3)}</option>
                            </select>
                        </div>

                        <div className="formGroup">
                            <label>Priority</label>
                            <select value={priority}
                            onChange={e => setPriority(Number(e.target.value))}
                            className="selectField">
                                <option value={0}>{getTaskProrityLabel(0)}</option>
                                <option value={1}>{getTaskProrityLabel(1)}</option>
                                <option value={2}>{getTaskProrityLabel(2)}</option>
                                <option value={3}>{getTaskProrityLabel(3)}</option>
                            </select>
                        </div>
                    </div>

                    {/**Task Due Date */}
                    <div className="formGroup">
                        <label>Due Date</label>
                        <input type="date"
                        value={dueDate}
                        onChange={e => setDueDate(e.target.value)}
                        className="inputField"/>
                    </div>

                    {/**Parent Task ID */}
                    {!parentTaskIdProp && (
                        <div className="formGroup">
                            <label>Parent Task</label>
                            <select value={parentTaskId ?? ""}
                            onChange={e => setParentTaskId(e.target.value || undefined)}
                            className="selectField">
                                <option value="">None (top-level task)</option>
                            </select>
                        </div>
                    )}

                    {/**Create task button */}
                    <button className="btnPrimary"
                    onClick={handleSubmit}>
                        {isUpdate ? "Save Changes" : "Create Task"}
                    </button>
                </div>
            </div>
        </div>
    );
}