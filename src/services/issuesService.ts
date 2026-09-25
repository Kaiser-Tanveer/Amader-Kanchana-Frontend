import apiClient from "./apiClient";
import type { ApiResponse, Issue, IssueStatus } from "@/types";

export interface IssueFilters {
  search?: string;
  ward?: string;
  category?: string;
  status?: IssueStatus;
  page?: number;
  limit?: number;
}

export const fetchIssues = async (filters: IssueFilters = {}) => {
  const { data } = await apiClient.get<ApiResponse<Issue[]>>("/issues", { params: filters });
  return data;
};

export const fetchIssueById = async (id: string) => {
  const { data } = await apiClient.get<ApiResponse<Issue>>(`/issues/${id}`);
  return data;
};

export interface CreateIssuePayload {
  title: string;
  category: string;
  ward: string;
  area: string;
  description: string;
  location?: { latitude: number; longitude: number };
  reporter?: { name?: string; phone?: string; email?: string };
}

export const createIssue = async (payload: CreateIssuePayload) => {
  const { data } = await apiClient.post<ApiResponse<Issue>>("/issues", payload);
  return data;
};

export const updateIssueStatus = async (id: string, status: IssueStatus, note?: string) => {
  const { data } = await apiClient.patch<ApiResponse<Issue>>(`/issues/${id}/status`, {
    status,
    note,
  });
  return data;
};
