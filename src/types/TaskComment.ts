export interface TaskComment {
    id: string;
    taskId: string;
    userId: string;
    userName: string;

    content: string;

    createdAt: string;
    updatedAt: string;
}