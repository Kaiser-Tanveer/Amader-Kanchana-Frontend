import apiClient from "./apiClient";
import type {
  ApiResponse,
  Ward,
  Institution,
  Project,
  Activity,
  Volunteer,
  DashboardStats,
  AdminRole,
  GalleryAlbum,
} from "@/types";

// Gallery
export const fetchGalleryAlbums = async () => {
  const { data } = await apiClient.get<ApiResponse<GalleryAlbum[]>>("/gallery/albums");
  return data;
};

// Wards
export const fetchWards = async () => {
  const { data } = await apiClient.get<ApiResponse<Ward[]>>("/wards");
  return data;
};

export const fetchWardById = async (id: string) => {
  const { data } = await apiClient.get<ApiResponse<Ward>>(`/wards/${id}`);
  return data;
};

// Institutions
export const fetchInstitutions = async (params?: { category?: string; ward?: string }) => {
  const { data } = await apiClient.get<ApiResponse<Institution[]>>("/institutions", { params });
  return data;
};

export const createInstitution = async (payload: Partial<Institution>) => {
  const { data } = await apiClient.post<ApiResponse<Institution>>("/institutions", payload);
  return data;
};

// Projects
export const fetchProjects = async (params?: { category?: string; status?: string; ward?: string }) => {
  const { data } = await apiClient.get<ApiResponse<Project[]>>("/projects", { params });
  return data;
};

export const fetchProjectById = async (id: string) => {
  const { data } = await apiClient.get<ApiResponse<Project>>(`/projects/${id}`);
  return data;
};

export const createProject = async (payload: Partial<Project>) => {
  const { data } = await apiClient.post<ApiResponse<Project>>("/projects", payload);
  return data;
};

// Activities
export const fetchActivities = async (params?: { category?: string }) => {
  const { data } = await apiClient.get<ApiResponse<Activity[]>>("/activities", { params });
  return data;
};

export const fetchActivityById = async (id: string) => {
  const { data } = await apiClient.get<ApiResponse<Activity>>(`/activities/${id}`);
  return data;
};

export const createActivity = async (payload: Partial<Activity>) => {
  const { data } = await apiClient.post<ApiResponse<Activity>>("/activities", payload);
  return data;
};

// Volunteers
export interface VolunteerPayload {
  name: string;
  mobile: string;
  email?: string;
  ward: string;
  profession?: string;
  interests: string[];
  skills?: string;
  availability?: string;
  message?: string;
}

export const createVolunteer = async (payload: VolunteerPayload) => {
  const { data } = await apiClient.post<ApiResponse<Volunteer>>("/volunteers", payload);
  return data;
};

export const fetchVolunteers = async () => {
  const { data } = await apiClient.get<ApiResponse<Volunteer[]>>("/volunteers");
  return data;
};

// Dashboard
export const fetchDashboardStats = async () => {
  const { data } = await apiClient.get<ApiResponse<DashboardStats>>("/dashboard/stats");
  return data;
};

// Auth
export interface LoginPayload {
  email: string;
  password: string;
}

export interface LoginResponseData {
  token: string;
  user: { id: string; name: string; email: string; role: AdminRole };
}

export const login = async (payload: LoginPayload) => {
  const { data } = await apiClient.post<ApiResponse<LoginResponseData>>("/auth/login", payload);
  return data;
};
