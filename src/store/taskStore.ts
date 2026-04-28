import { create } from "zustand";
import type { CreateTaskPayload, Task, UpdateTaskPayload } from "../types/Task";
import type { TaskComment } from "../types/TaskComment";
import toast from "react-hot-toast";
import { getTasksForProjectApi, createTaskApi, updateTaskApi, deleteTaskApi, getCommentsForTaskApi, addCommentApi, editCommentApi, deleteCommentApi } from "../api/taskApi";

interface TaskState {
    tasks: Task[]; /**Flat or nested list of tasks for the current project */
    isLoading: boolean; /**Loading flag for UI stats */
    commentsByTask: Record<string, TaskComment[]>; /**Dictionary for storing comments with tasks */

    /** Task actions */
    loadTasks: (projectId: string) => Promise<void>; /**Load all tasks for a project */
    createTask: (payload: CreateTaskPayload) => Promise<Task | null>; /**Create a new task via API and insert into the local tree */
    updateTask: (taskId: string, payload: UpdateTaskPayload) => Promise<Task | null>; /**Update a task/subtask via the API */
    deleteTask: (taskId: string) => void; /**Delete a task via the API */

    /** Comment action */
    loadComments: (taskId: string) => Promise<void>; /**Load all comments for a task */
    addComment: (taskId: string, content: string) => Promise<TaskComment | null>; /**Create a new comment for a task via API and insert into the local tree */
    editComment: (commentId: string, taskId: string, content: string) => Promise<TaskComment | null>; /**Update a comment for a task/subtask */
    deleteComment: (commentId: string, taskId: string) => void; /**Delete a comment from a task/subtask */
}

export const useTaskStore =  create<TaskState>((set) => ({
    tasks: [],
    isLoading: false,

    loadTasks: async (projectId: string) => { /**Load tasks from backend */
        set({ isLoading: true });

        try {
            const flat = await getTasksForProjectApi(projectId); // get flat list from the backend

            const tree = buildTaskTree(flat); // use converter to build the tasks into tree

            set({ tasks: tree, isLoading: false });
            toast.success("Tasks loaded");
        } catch (err) {
            console.error(err);
            set({ isLoading: false });
        }
    },

    createTask: async (payload) => { /** Create a new task. Insert it into the local tree upon success */
        try {
            const created = await createTaskApi(payload);

            // Insert into the correct place in the tree
            set((state) => ({
                tasks: insertTaskIntoTree(state.tasks, created)
            }));

            toast.success("Task created");

            return created;
        } catch (err) {
            console.error(err);
            toast.error("Something went wrong");
            return null;
        }
    },

    updateTask: async (taskID: string, payload: UpdateTaskPayload) => { /**Update a task */
        try {
            const updated = await updateTaskApi(taskID, payload);

            if (!updated) {
                toast.error("Failed to update task");
                return null;
            }

            set((state) => ({
                tasks: updateTaskTree(state.tasks, updated),
            }));

            toast.success("Task updated");
            return updated;
        } catch (err) {
            console.error(err);
            toast.error("Failed to udpate task");
            return null;
        }
    },

    deleteTask: async (taskId: string) => { /**Delete a task */
        try {
            await deleteTaskApi(taskId);

            set((state) => ({
                tasks: deleteTaskFromTree(state.tasks, taskId),
            }));

            toast.success("Task updated");
            return true;
        } catch (err) {
            console.error(err);
            toast.error("Failed to delete task");
            return false;
        }
    },

    commentsByTask: {},
    loadComments: async (taskId) => {
        const comments = await getCommentsForTaskApi(taskId);
        set((state) => ({
            commentsByTask: {
                ...state.commentsByTask,
                [taskId]: comments
            }
        }));
    },

    addComment: async (taskId, content) => {
        const newComment = await addCommentApi(taskId, content);
        set((state) => ({
            commentsByTask: {
                ...state.commentsByTask,
                [taskId]: [newComment, ...(state.commentsByTask[taskId] ?? [])]
            }
        }));

        return newComment;
    },

    editComment: async (commentId, taskId, content) => {
        const updated = await editCommentApi(commentId, content);
        set(state => ({
            commentsByTask: {
                ...state.commentsByTask,
                [taskId]: state.commentsByTask[taskId].map(c => c.id === commentId ? updated : c)
            }
        }));
        return updated;
    },

    deleteComment: async (commentId, taskId) => {
        await deleteCommentApi(commentId);
        set(state => ({
            commentsByTask: {
                ...state.commentsByTask,
                [taskId]: state.commentsByTask[taskId].filter(c => c.id !== commentId)
            }
        }));
    }
}));

/**
* Insert a task into the nested task tree.
* - If no parentTaskId → top-level task
* - Otherwise recursively search for the parent and append as a subtask
*/
export function insertTaskIntoTree(tree: Task[], newTask: Task): Task[] {
    // Case 1: Top-level task
    if (!newTask.parentTaskId) {
        return [...tree, { ...newTask, subTasks: []}];
    }

    // Case 2: Subtask - recursively find parent
    return tree.map(node => {
        if (node.id === newTask.parentTaskId) {
            return {
                ...node,
                subTasks: [...node.subTasks, { ...newTask, subTasks: [] }]
            };
        }

        return {
            ...node,
            subTasks: insertTaskIntoTree(node.subTasks, newTask)
        };
    });
}

/**Same as insert but to refresh the tree after update */
export function updateTaskTree(tree: Task[], updated: Task): Task[] {
    return tree.map(node => {
        if (node.id === updated.id) {
            return {...node, ...updated, subTasks: [...node.subTasks]};
        } 

        return {...node, subTasks: updateTaskTree(node.subTasks, updated)};
    });
}

/**Delete task from tree and refresh UI */
export function deleteTaskFromTree(tree: Task[], taskId: string): Task[] {
    return tree.filter(node => node.id !== taskId).map(node => ({...node, subTasks: deleteTaskFromTree(node.subTasks, taskId)}));
}

/**
 * Convert a flat list of tasks into a nested tree structure
 * - Parent tasks have parentTaskId = null
 * - Subtasks are goruped under their parent
 */
export function buildTaskTree(flat: Task[]): Task[] {
    const map = new Map<string, Task>();
    const roots: Task[] = [];

    // Initialize map and ensure subtasks array exists
    flat.forEach(task => {
        map.set(task.id, { ...task, subTasks: [] });
    });

    // Build the tree
    map.forEach(task => {
        if (task.parentTaskId) {
            const parent = map.get(task.parentTaskId);
            if (parent) {
                parent.subTasks.push(task);
            }
         } else {
            roots.push(task);
        }
    });

    return roots;
}