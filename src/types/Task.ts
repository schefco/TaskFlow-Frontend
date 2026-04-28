import type { Comment } from "./TaskComment";

export interface Task {
    id: string;
    title: string;
    description?: string;

    status: number; // Will convert to string in UI
    priority: number; // Will convert to string in UI

    dueDate?: string;
    createdAt: string;
    updatedAt?: string;
    completedAt?: string;

    comments: Comment[];

    parentTaskId?: string; // if nested under another task
    subTasks: Task[]; // recursive structure for tasks that have subtasks that have subtasks and so on.

    projectId: string;
    userId: string;

    readyForClose: boolean;
    sortOrder: number;
}

export interface CreateTaskPayload {
    title: string,
    description?: string | null;
    status: number;
    priority: number;
    dueDate?: string | null;
    parentTaskId?: string | null;
    projectId: string;
}

export interface UpdateTaskPayload {
    taskId: string;
    title: string;
    description: string;
    status: number;
    dueDate: string | null;
    priority: number;
    parentTaskId: string | null;
}