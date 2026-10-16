import { useState } from "react";
import axios from "axios";
import { Plus, X } from "lucide-react";
import { Card, Badge } from "@/components/common/Card";
import { FieldWrapper, Input } from "@/components/common/FormFields";
import Button from "@/components/common/Button";
import { LoadingSpinner, ErrorState, EmptyState } from "@/components/common/States";
import { useFetch } from "@/hooks/useFetch";
import { fetchMembers, createMember } from "@/services/campaignAndMemberService";

const emptyForm = { name: "", phone: "", email: "", ward: "", monthlyDueAmount: "100" };

const AdminMembersManagement = () => {
  const { data, loading, error, refetch } = useFetch(() => fetchMembers(), []);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState(emptyForm);
  const [saving, setSaving] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const update = (key: keyof typeof form, value: string) => setForm((f) => ({ ...f, [key]: value }));

  const resetAndClose = () => {
    setForm(emptyForm);
    setSubmitError(null);
    setShowForm(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name.trim() || !form.phone.trim() || !Number(form.monthlyDueAmount)) {
      setSubmitError("Name, phone and a monthly due amount are required.");
      return;
    }
    setSaving(true);
    setSubmitError(null);
    try {
      await createMember({
        name: form.name,
        phone: form.phone.trim(),
        email: form.email || undefined,
        ward: form.ward || undefined,
        monthlyDueAmount: Number(form.monthlyDueAmount),
      });
      resetAndClose();
      refetch();
    } catch (err) {
      const duplicate = axios.isAxiosError(err) && err.response?.status === 409;
      setSubmitError(duplicate ? "A member with this phone number already exists." : "Could not save this member.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-forest-900">Members &amp; Monthly Dues</h1>
        <Button size="sm" onClick={() => setShowForm(true)}>
          <Plus size={16} />
          Add Member
        </Button>
      </div>

      <p className="text-sm text-slate-500">
        Members pay from <code>/donate?member=1</code> by entering their registered phone number. The "This month"
        column turns to Paid once their payment is confirmed (automatically for gateway payments, or when you
        confirm it under Donations for manual payments). This data is private and never shown publicly.
      </p>

      {error && <ErrorState />}
      {loading && <LoadingSpinner />}
      {!loading && !error && data?.data.length === 0 && <EmptyState />}

      {!loading && data && data.data.length > 0 && (
        <Card className="overflow-x-auto p-0">
          <table className="w-full text-left text-sm">
            <thead className="border-b border-slate-100 text-xs uppercase text-slate-400">
              <tr>
                <th className="px-4 py-3">Name</th>
                <th className="px-4 py-3">Phone</th>
                <th className="px-4 py-3">Ward</th>
                <th className="px-4 py-3">Monthly due</th>
                <th className="px-4 py-3">This month</th>
              </tr>
            </thead>
            <tbody>
              {data.data.map((m) => (
                <tr key={m._id} className="border-b border-slate-50 last:border-0">
                  <td className="px-4 py-3 font-medium text-slate-800">{m.name}</td>
                  <td className="px-4 py-3 text-slate-500">{m.phone}</td>
                  <td className="px-4 py-3 text-slate-500">{m.ward ?? "—"}</td>
                  <td className="px-4 py-3 text-slate-700">৳{m.monthlyDueAmount}</td>
                  <td className="px-4 py-3">
                    <Badge color={m.currentMonthPaid ? "forest" : "amber"}>
                      {m.currentMonthPaid ? "Paid" : "Unpaid"}
                    </Badge>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </Card>
      )}

      {showForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4" onClick={resetAndClose}>
          <Card className="w-full max-w-md" onClick={(e) => e.stopPropagation()}>
            <div className="mb-4 flex items-center justify-between">
              <h3 className="text-lg font-bold text-forest-900">Add a Member</h3>
              <button onClick={resetAndClose} aria-label="Close">
                <X size={20} className="text-slate-400" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
              <FieldWrapper label="Full name" required>
                <Input value={form.name} onChange={(e) => update("name", e.target.value)} />
              </FieldWrapper>
              <FieldWrapper label="Mobile number" required>
                <Input value={form.phone} onChange={(e) => update("phone", e.target.value)} />
              </FieldWrapper>
              <FieldWrapper label="Email (optional)">
                <Input type="email" value={form.email} onChange={(e) => update("email", e.target.value)} />
              </FieldWrapper>
              <div className="grid gap-4 sm:grid-cols-2">
                <FieldWrapper label="Ward (optional)">
                  <Input value={form.ward} onChange={(e) => update("ward", e.target.value)} placeholder="e.g. Ward 3" />
                </FieldWrapper>
                <FieldWrapper label="Monthly due (৳)" required>
                  <Input
                    type="number"
                    min={10}
                    value={form.monthlyDueAmount}
                    onChange={(e) => update("monthlyDueAmount", e.target.value)}
                  />
                </FieldWrapper>
              </div>

              {submitError && <p className="text-sm text-red-600">{submitError}</p>}

              <div className="mt-2 flex justify-end gap-2">
                <Button type="button" variant="ghost" onClick={resetAndClose}>
                  Cancel
                </Button>
                <Button type="submit" disabled={saving}>
                  {saving ? "Saving…" : "Add Member"}
                </Button>
              </div>
            </form>
          </Card>
        </div>
      )}
    </div>
  );
};

export default AdminMembersManagement;
