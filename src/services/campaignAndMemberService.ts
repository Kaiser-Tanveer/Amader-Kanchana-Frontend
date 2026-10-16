import apiClient from "./apiClient";
import type { ApiResponse } from "@/types";

export interface Campaign {
  _id: string;
  title: string;
  description: string;
  goalAmount?: number;
  coverImage?: string;
  isEmergency: boolean;
  isActive: boolean;
  raisedAmount: number;
  createdAt: string;
}

export const fetchActiveCampaigns = async () => {
  const { data } = await apiClient.get<ApiResponse<Campaign[]>>("/campaigns");
  return data;
};

export const fetchEmergencyCampaign = async () => {
  const { data } = await apiClient.get<ApiResponse<Campaign | null>>("/campaigns/emergency");
  return data;
};

export const fetchCampaignById = async (id: string) => {
  const { data } = await apiClient.get<ApiResponse<Campaign>>(`/campaigns/${id}`);
  return data;
};

export const createCampaign = async (payload: Partial<Campaign>) => {
  const { data } = await apiClient.post<ApiResponse<Campaign>>("/campaigns", payload);
  return data;
};

export interface Member {
  _id: string;
  name: string;
  phone: string;
  email?: string;
  ward?: string;
  monthlyDueAmount: number;
  isActive: boolean;
  currentMonthPaid?: boolean;
}

// Public lookup — the server returns only name, phone and monthly due amount.
export const lookupMemberByPhone = async (phone: string) => {
  const { data } = await apiClient.get<ApiResponse<Member>>(`/members/lookup/${encodeURIComponent(phone)}`);
  return data;
};

export const fetchMembers = async () => {
  const { data } = await apiClient.get<ApiResponse<Member[]>>("/members");
  return data;
};

export const createMember = async (payload: Partial<Member>) => {
  const { data } = await apiClient.post<ApiResponse<Member>>("/members", payload);
  return data;
};
