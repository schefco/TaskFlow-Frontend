import { create } from "zustand";
import { getProjects, createProjectApi, updateProjectApi, getProjectById, deleteProjectApi } from "../api/projectApi";
import type { Project } from "../types/Project";
import { toast } from "react-hot-toast";

export interface CreateProjectDto {
    name: string;
    description: string;
    priority: number;
    status: number;
    dueDate: string;
}

// ProjectStore state shape
interface ProjectStore {
    projects: Project[];
    isLoading: boolean;
    error: unknown;
    selectedProject: Project | null;

    // methods
    getProjects: () => Promise<void>;
    createProject: (data: CreateProjectDto, navigate: (path: string) => void) => Promise<void>;
    updateProject: (data: { id: string; name: string; description: string; priority: number; status: number; dueDate: string}) => Promise<void>;
    deleteProject: (id: string) => Promise<void>;
    getProjectById: (id: string) => Promise<void>;
}

export const useProjectStore = create<ProjectStore>((set, get) => ({
    // State
    projects: [],
    isLoading: false,
    error: null,
    selectedProject: null,

    // Action: Fetch all projects
    getProjects: async () => {
        // set loading state
        set({ isLoading: true });

        try {
            // call the API
            const projects = await getProjects();

            // update store
            set({ projects, isLoading: false });
        } catch (err) {
            set({error: err, isLoading: false })
        }
    },

    // Action: Create a new project
    createProject: async (data: CreateProjectDto, navigate: (path: string) => void ) => {
        // set loading
        set({ isLoading: true });

        try {
            // Call the API
            const newProject = await createProjectApi(data);

            // update store by appending new project
            set({
                projects: [ ... get().projects, newProject],
                isLoading: false
            });

            toast.success("Project created successfully");

            // redirect user to project list
            navigate("/projects");
        } catch (err) {
            set({ error: err, isLoading: false });
        }
    },

    // ACTION: Update Project
    updateProject: async (data) => {
        set({ isLoading: true });

        try {
            const updated = await updateProjectApi(data.id, data);

            // Update selected project
            set({ selectedProject: updated });

            // Update project list if loaded
            const projects = get().projects.map(p => p.id === updated.id ? updated : p);

            set({ projects, isLoading: false});

            toast.success("Project updated successfully");
        } catch (err) {
            set({ error: err, isLoading: false });
        }
    },

    // ACTION: Delete project
    deleteProject: async (id: string) => {
        set({ isLoading: true });

        try {
            await deleteProjectApi(id);

            // Remove from list
            set({
                projects: get().projects.filter(p => p.id !== id),
                selectedProject: null,
                isLoading: false
            });

            toast.success("Project deleted");
        } catch (err) {
            set({ error: err, isLoading: false });
        }
    },

    // ACTION: Get project by ID
    getProjectById: async (id) => {
        set({ isLoading: true });
        try{
            const project = await getProjectById(id);
            set({ selectedProject: project, isLoading: false });
        } catch (err) {
            set({ error: err, isLoading: false });
        }
    }
}));