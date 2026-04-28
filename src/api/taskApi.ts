import type { Task, CreateTaskPayload, UpdateTaskPayload } from './../types/Task';
import type { TaskComment } from '../types/TaskComment';
import api from "./axios";

/**Creat a new task (POST /tasks) */
export async function createTaskApi(payload: CreateTaskPayload): Promise<Task> {
    const res = await api.post<Task>("/tasks", payload);
    return res.data;
}

/**Get all tasks for a project (GET /projects/{projectId}/tasks) */
export async function getTasksForProjectApi(projectId: string): Promise<Task[]> {
    const res = await api.get<Task[]>(`/tasks/project/${projectId}/`);
    return res.data;
}

/**Update a task (PUT /tasks/{taskId}) */
export async function updateTaskApi(taskId: string, payload: UpdateTaskPayload): Promise<Task> {
    const res = await api.put<Task>(`/tasks/${taskId}`, payload);
    return res.data;
}

/**Delete a task (DELETE /tasks/{taskId}) */
export async function deleteTaskApi(taskId: string): Promise<void> {
    await api.delete(`/tasks/${taskId}`, {
        withCredentials: true
    });
}

/**Get comments for a task (POST /tasks/{taskId}/comments) */
export async function getCommentsForTaskApi(taskId: string): Promise<TaskComment[]> {
    const res = await api.get<TaskComment[]>(`/tasks/${taskId}/comments`);
    return res.data;
}

/**Create comment for task */
export async function addCommentApi(taskId: string, content: string): Promise<TaskComment> {
    const res = await api.post<TaskComment>(`/tasks/${taskId}/comments`, {
        taskId,
        content
    });
    return res.data;
}

/**Update comment for task */
export async function editCommentApi(commentId: string, content: string): Promise<TaskComment> {
    const res = await api.patch<TaskComment>(`/tasks/comments/${commentId}`, {
        commentId,
        content
    });
    return res.data;
}

/**Delete comment from a task */
export async function deleteCommentApi(commentId: string): Promise<void> {
    await api.delete(`/tasks/comments/${commentId}`, {
        data: { commentId }
    });
}