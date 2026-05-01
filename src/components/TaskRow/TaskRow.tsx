import { useEffect, useState } from "react";
import type { Task } from "../../types/Task";
import "./TaskRow.css";
import { getTaskProrityLabel, getTaskStatusLabel } from "../../utils/taskEnums";
import { useTaskStore } from "../../store/taskStore";
import { useAuthStore } from "../../store/authStore";

interface TaskRowProps {
    task: Task;
    level?: number; // default = 0
    onEdit: (task: Task) => void;
    createSubtask: (parentTaskId: string) => void;
}

export default function TaskRow({ task: initialTask, level = 0, onEdit, createSubtask }: TaskRowProps) {
    //Subscribe to the store to get the Latest version of this task
    const task = useTaskStore(s => findTaskInTree(s.tasks, initialTask.id));
    const { commentsByTask, loadComments, addComment } = useTaskStore();

    // Stores state for delete task
    const deleteTask = useTaskStore(s => s.deleteTask);

    // UI states
    const [isExpanded, setIsExpanded] = useState(false);
    const [isSubtasksOpen, setIsSubtasksOpen] = useState(false); // flag for Subtask expansion
    const [newComment, setNewComment] = useState("");

    // for displaying user name to comments
    const currentUser = useAuthStore(state => state.userId);

    useEffect(() => {
        if (isExpanded && task) {
            loadComments(task.id);
        }
    }, [isExpanded, task, loadComments]);

    if (!task) return null;

    const comments = commentsByTask[task.id] ?? [];

    const handleAddComment = async (taskId: string) => {
        if (!newComment.trim()) return;

        await addComment(taskId, newComment.trim());
        setNewComment("");
    };

    return (
        <div className="taskRowWrapper" style={{ marginLeft: level * 20 }}>

            {/**Collapsed Row */}
            <div className="taskRow">
                <div className="taskRowTop">
                    {/**Left side - toggle description */}
                    <div className="taskLeft" onClick={() => setIsExpanded(!isExpanded)}>
                        <button className="expandButton" onClick={(e) => {
                            e.stopPropagation(); // prevent description toggle
                            setIsSubtasksOpen(!isSubtasksOpen);
                        }}>
                            <span className={`chevron ${isSubtasksOpen ? "open" : ""}`}>
                                ▸
                            </span>
                        </button>

                        <span className="taskTitle">{task.title}</span>
                    </div>

                    {/**Right Side - action buttons and status priority */}
                    <div className="taskRight">
                        <span className="taskStatus">{getTaskStatusLabel(task.status)}</span>
                        <span className="taskPriority">{getTaskProrityLabel(task.priority)}</span>

                        {/**Create subtask button */}
                        <button className="addTaskButton"
                         onClick={(e) => {
                            e.stopPropagation();
                            createSubtask(task.id);
                        }}>
                            + Subtask
                        </button>

                        {/**Edit button */}
                        <button className="editButton"
                        onClick={(e) => {
                            e.stopPropagation(); // prevent description toggle
                            onEdit(task);
                        }}>
                            ✎
                        </button>

                        {/**Delete button */}
                        <button className="deleteButton"
                        onClick={(e) => {
                            e.stopPropagation();
                            deleteTask(task.id);
                            }}>
                                🗑
                        </button>
                    </div>
                </div>

                {/**Description (animated) */}
                <div className={`taskDescriptionWrapper ${isExpanded ? "open" : ""}`}>
                    {task.description}
                </div>

                {isExpanded && (
                    <div className="commentsSection">
                        {/**Add comment input */}
                        <div className="addCommentRow">
                            <input type="text"
                            value={newComment}
                            onChange={(e) => setNewComment(e.target.value)}
                            placeholder="Add a comment ..."
                            className="commentInput"/>

                            <button onClick={() => handleAddComment(task.id)}
                            className="commentAddButton">+ Comment</button>
                        </div>

                        {/**Comment list */}
                        <div className="commentList">
                            {comments?.map((c) => (
                                <div key={c.id} className="commentItem">
                                    <div className="commentContent">{c.content}</div>
                                    <div className="commentAuthor">
                                        <span>{currentUser == c.userId ? "You" : c.userName}</span>
                                    </div>
                                    <div className="commentMeta">
                                        {new Date(c.createdAt).toLocaleString()}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </div>

            {/**Expanded Section */}
            {isSubtasksOpen && task.subTasks.length > 0 && (
                <div className="taskSubtree">
                    {task.subTasks.map(sub => (
                        <TaskRow key={sub.id} task={sub} level={level + 1} onEdit={onEdit} createSubtask={createSubtask}/>
                    ))}
                </div>
            )}
        </div>
    );
}

// For finding the task that has been created to a subtask
function findTaskInTree(tree: Task[], id: string): Task | undefined {
    for (const node of tree) {
        if (node.id === id) return node;
        const found = findTaskInTree(node.subTasks, id);
        if (found) return found;
    }
}