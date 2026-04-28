import type { CreateProjectDto } from "../store/projectStore";
import api from "./axios";
import type { Project } from "../types/Project";

export async function getProjects(): Promise<Project[]> {
    const response = await api.get<Project[]>("/projects");
    return response.data;
}

export async function createProjectApi(data: CreateProjectDto) {
    // send POST request to backend
    const response = await api.post("/projects", data);

    // return the created project
    return response.data;
}

export async function getProjectById(id: string) {
    // send GET request to find project by id
    const response = await api.get(`/projects/${id}`);

    // return the project data
    return response.data;
}