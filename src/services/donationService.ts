import apiClient from "./apiClient";
import type { ApiResponse } from "@/types";

export type DonationPurpose = "GENERAL" | "MEMBERSHIP_DUE" | "CAMPAIGN";
export type DonationStatus = "PENDING" | "SUCCESS" | "FAILED" | "CANCELLED";
export type ManualMethod = "BKASH" | "NAGAD" | "ROCKET" | "BANK";

// ---------- Gateway (SSLCommerz) ----------

export interface InitiateDonationPayload {
  amount: number;
  type: "ONE_TIME" | "MONTHLY";
  donorName: string;
  donorEmail: string;
  donorPhone: string;
  isAnonymous: boolean;
  purpose?: DonationPurpose;
  campaignId?: string;
  memberId?: string;
}

export const initiateDonation = async (payload: InitiateDonationPayload) => {
  const { data } = await apiClient.post<ApiResponse<{ gatewayUrl: string; tranId: string }>>(
    "/donations/initiate",
    payload,
  );
  return data;
};

export const getDonationStatus = async (tranId: string) => {
  const { data } = await apiClient.get<ApiResponse<{ status: DonationStatus; amount: number; type: string }>>(
    `/donations/status/${tranId}`,
  );
  return data;
};

export const getPublicDonationStats = async () => {
  const { data } = await apiClient.get<ApiResponse<{ totalAmount: number; totalDonations: number }>>(
    "/donations/stats",
  );
  return data;
};

// ---------- Manual (free) payments ----------

export interface ManualPaymentInfo {
  accountName: string;
  accounts: { method: ManualMethod; label: string; number: string }[];
  bankDetails: string;
  gatewayEnabled: boolean;
}

export const getManualPaymentInfo = async () => {
  const { data } = await apiClient.get<ApiResponse<ManualPaymentInfo>>("/donations/manual-info");
  return data;
};

export interface SubmitManualDonationPayload {
  amount: number;
  method: ManualMethod;
  trxId: string;
  senderNumber?: string;
  donorName: string;
  donorPhone: string;
  donorEmail?: string;
  isAnonymous: boolean;
  purpose?: DonationPurpose;
  campaignId?: string;
  memberId?: string;
}

export const submitManualDonation = async (payload: SubmitManualDonationPayload) => {
  const { data } = await apiClient.post<ApiResponse<{ reference: string }>>("/donations/manual", payload);
  return data;
};

// ---------- Admin ----------

export interface AdminDonation {
  _id: string;
  tranId: string;
  amount: number;
  type: "ONE_TIME" | "MONTHLY";
  purpose: DonationPurpose;
  status: DonationStatus;
  paymentChannel?: "GATEWAY" | "MANUAL";
  manualMethod?: ManualMethod;
  manualTrxId?: string;
  senderNumber?: string;
  paymentMethod?: string;
  donorName: string;
  donorPhone: string;
  donorEmail?: string;
  campaign?: { title: string } | null;
  createdAt: string;
}

export const fetchDonationsForAdmin = async () => {
  const { data } = await apiClient.get<ApiResponse<AdminDonation[]>>("/donations/admin");
  return data;
};

export const verifyManualDonation = async (id: string, status: "SUCCESS" | "FAILED") => {
  const { data } = await apiClient.patch<ApiResponse<AdminDonation>>(`/donations/${id}/verify`, { status });
  return data;
};
