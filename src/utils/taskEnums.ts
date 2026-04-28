export function getTaskStatusLabel(status: number): string {
    switch (status) {
        case 0: return "To Do";
        case 1: return "In Progress";
        case 2: return "Review";
        case 3: return "Done";
        default: return "";
    }
}

export function getTaskProrityLabel(priority: number): string {
    switch (priority) {
        case 0: return "None";
        case 1: return "Low";
        case 2: return "Medium";
        case 3: return "High";
        default: return "";
    }
}