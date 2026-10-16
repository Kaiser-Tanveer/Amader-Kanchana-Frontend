import { useState } from "react";
import { Card, Badge } from "@/components/common/Card";
import Button from "@/components/common/Button";
import { LoadingSpinner, ErrorState, EmptyState } from "@/components/common/States";
import { useFetch } from "@/hooks/useFetch";
import {
  fetchDonationsForAdmin,
  verifyManualDonation,
  type AdminDonation,
  type DonationStatus,
} from "@/services/donationService";

const statusColor: Record<DonationStatus, "forest" | "amber" | "red" | "slate"> = {
  SUCCESS: "forest",
  PENDING: "amber",
  FAILED: "red",
  CANCELLED: "slate",
};

const METHOD_LABELS: Record<string, string> = {
  BKASH: "bKash",
  NAGAD: "Nagad",
  ROCKET: "Rocket",
  BANK: "Bank",
};

const AdminDonationsManagement = () => {
  const { data, loading, error, refetch } = useFetch(() => fetchDonationsForAdmin(), []);
  const [tab, setTab] = useState<"REVIEW" | "ALL">("REVIEW");
  const [busyId, setBusyId] = useState<string | null>(null);

  const all = data?.data ?? [];
  const isAwaitingReview = (d: AdminDonation) => d.paymentChannel === "MANUAL" && d.status === "PENDING";
  const rows = tab === "ALL" ? all : all.filter(isAwaitingReview);
  const awaitingCount = all.filter(isAwaitingReview).length;
  const confirmedTotal = all.filter((d) => d.status === "SUCCESS").reduce((sum, d) => sum + d.amount, 0);

  const review = async (donation: AdminDonation, status: "SUCCESS" | "FAILED") => {
    const verb = status === "SUCCESS" ? "CONFIRM" : "REJECT";
    const ok = window.confirm(
      `${verb} ৳${donation.amount} from ${donation.donorName}?\nTrxID: ${donation.manualTrxId}\n\nOnly confirm after you have seen this exact TrxID and amount in your bKash/Nagad/Rocket/bank statement.`,
    );
    if (!ok) return;

    setBusyId(donation._id);
    try {
      await verifyManualDonation(donation._id, status);
      refetch();
    } catch {
      window.alert("Could not update this donation. Please try again.");
    } finally {
      setBusyId(null);
    }
  };

  return (
    <div className="flex flex-col gap-6">
      <h1 className="text-2xl font-bold text-forest-900">Donations</h1>

      <div className="grid gap-4 sm:grid-cols-2">
        <Card>
          <p className="text-sm text-slate-500">Confirmed total</p>
          <p className="mt-1 text-3xl font-extrabold text-forest-800">৳{confirmedTotal}</p>
        </Card>
        <Card>
          <p className="text-sm text-slate-500">Awaiting your verification</p>
          <p className="mt-1 text-3xl font-extrabold text-amber-600">{awaitingCount}</p>
        </Card>
      </div>

      <div className="flex gap-2">
        <Button size="sm" variant={tab === "REVIEW" ? "primary" : "outline"} onClick={() => setTab("REVIEW")}>
          Needs review
        </Button>
        <Button size="sm" variant={tab === "ALL" ? "primary" : "outline"} onClick={() => setTab("ALL")}>
          All donations
        </Button>
      </div>

      {error && <ErrorState />}
      {loading && <LoadingSpinner />}
      {!loading && !error && rows.length === 0 && <EmptyState />}

      {!loading && rows.length > 0 && (
        <Card className="overflow-x-auto p-0">
          <table className="w-full text-left text-sm">
            <thead className="border-b border-slate-100 text-xs uppercase text-slate-400">
              <tr>
                <th className="px-4 py-3">Date</th>
                <th className="px-4 py-3">Donor</th>
                <th className="px-4 py-3">Amount</th>
                <th className="px-4 py-3">Method / TrxID</th>
                <th className="px-4 py-3">For</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3"></th>
              </tr>
            </thead>
            <tbody>
              {rows.map((d) => (
                <tr key={d._id} className="border-b border-slate-50 align-top last:border-0">
                  <td className="whitespace-nowrap px-4 py-3 text-slate-500">
                    {new Date(d.createdAt).toLocaleDateString()}
                  </td>
                  <td className="px-4 py-3">
                    <p className="font-medium text-slate-800">{d.donorName}</p>
                    <p className="text-xs text-slate-400">{d.donorPhone}</p>
                  </td>
                  <td className="px-4 py-3 font-semibold text-forest-800">৳{d.amount}</td>
                  <td className="px-4 py-3">
                    {d.paymentChannel === "MANUAL" ? (
                      <>
                        <p className="text-slate-700">{d.manualMethod ? METHOD_LABELS[d.manualMethod] : "—"}</p>
                        <p className="font-mono text-xs text-slate-500">{d.manualTrxId}</p>
                        {d.senderNumber && <p className="text-xs text-slate-400">from {d.senderNumber}</p>}
                      </>
                    ) : (
                      <p className="text-slate-700">Gateway{d.paymentMethod ? ` · ${d.paymentMethod}` : ""}</p>
                    )}
                  </td>
                  <td className="px-4 py-3 text-slate-500">
                    {d.purpose === "CAMPAIGN"
                      ? (d.campaign?.title ?? "Campaign")
                      : d.purpose === "MEMBERSHIP_DUE"
                        ? "Member due"
                        : "General"}
                  </td>
                  <td className="px-4 py-3">
                    <Badge color={statusColor[d.status]}>{d.status}</Badge>
                  </td>
                  <td className="px-4 py-3">
                    {isAwaitingReview(d) && (
                      <div className="flex gap-2">
                        <Button size="sm" disabled={busyId === d._id} onClick={() => review(d, "SUCCESS")}>
                          Confirm
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          disabled={busyId === d._id}
                          onClick={() => review(d, "FAILED")}
                        >
                          Reject
                        </Button>
                      </div>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </Card>
      )}
    </div>
  );
};

export default AdminDonationsManagement;
