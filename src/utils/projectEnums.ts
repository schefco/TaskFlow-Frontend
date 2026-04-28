export function getStatusLabel(status: number): string {
    switch (status) {
        case 0: return "Not Started";
        case 1: return "In Progress";
        case 2: return "Completed";
        case 3: return "On Hold";
        default: return "";
    }
}

export function getProrityLabel(priority: number): string {
    switch (priority) {
        case 0: return "Low";
        case 1: return "Medium";
        case 2: return "High";
        default: return "";
    }
}