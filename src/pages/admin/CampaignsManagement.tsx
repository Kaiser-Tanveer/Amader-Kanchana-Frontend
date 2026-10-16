import { useState } from "react";
import { Plus, X, AlertTriangle } from "lucide-react";
import { Card, Badge } from "@/components/common/Card";
import { FieldWrapper, Input, Textarea } from "@/components/common/FormFields";
import Button from "@/components/common/Button";
import { LoadingSpinner, ErrorState, EmptyState } from "@/components/common/States";
import { useFetch } from "@/hooks/useFetch";
import { fetchActiveCampaigns, createCampaign } from "@/services/campaignAndMemberService";

const emptyForm = { title: "", description: "", goalAmount: "", isEmergency: false };

const AdminCampaignsManagement = () => {
  const { data, loading, error, refetch } = useFetch(() => fetchActiveCampaigns(), []);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState(emptyForm);
  const [saving, setSaving] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const resetAndClose = () => {
    setForm(emptyForm);
    setSubmitError(null);
    setShowForm(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.title.trim() || !form.description.trim()) {
      setSubmitError("Title and description are required.");
      return;
    }
    setSaving(true);
    setSubmitError(null);
    try {
      await createCampaign({
        title: form.title,
        description: form.description,
        goalAmount: form.goalAmount ? Number(form.goalAmount) : undefined,
        isEmergency: form.isEmergency,
        isActive: true,
      });
      resetAndClose();
      refetch();
    } catch {
      setSubmitError("Could not save this campaign.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-forest-900">Campaigns &amp; Appeals</h1>
        <Button size="sm" onClick={() => setShowForm(true)}>
          <Plus size={16} />
          New Campaign
        </Button>
      </div>

      <p className="rounded-xl bg-amber-50 p-3 text-sm text-amber-700">
        Marking a campaign as "Emergency" shows a red banner across the top of the homepage with a direct donate
        link. Keep only one emergency campaign active at a time.
      </p>

      {error && <ErrorState />}
      {loading && <LoadingSpinner />}
      {!loading && !error && data?.data.length === 0 && <EmptyState />}

      {!loading && data && data.data.length > 0 && (
        <div className="grid gap-4 sm:grid-cols-2">
          {data.data.map((c) => (
            <Card key={c._id}>
              <div className="mb-2 flex items-center gap-2">
                {c.isEmergency && (
                  <Badge color="red">
                    <AlertTriangle size={12} className="mr-1 inline" />
                    Emergency
                  </Badge>
                )}
                <Badge color={c.isActive ? "forest" : "slate"}>{c.isActive ? "Active" : "Inactive"}</Badge>
              </div>
              <p className="font-semibold text-forest-900">{c.title}</p>
              <p className="mt-1 text-sm text-slate-500">{c.description}</p>
              <p className="mt-3 text-sm font-medium text-forest-700">
                ৳{c.raisedAmount} raised{c.goalAmount ? ` of ৳${c.goalAmount} goal` : ""}
              </p>
            </Card>
          ))}
        </div>
      )}

      {showForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4" onClick={resetAndClose}>
          <Card className="w-full max-w-lg" onClick={(e) => e.stopPropagation()}>
            <div className="mb-4 flex items-center justify-between">
              <h3 className="text-lg font-bold text-forest-900">New Campaign</h3>
              <button onClick={resetAndClose} aria-label="Close">
                <X size={20} className="text-slate-400" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
              <FieldWrapper label="Title" required>
                <Input
                  value={form.title}
                  onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))}
                  placeholder="e.g. বন্যা দুর্গতদের জন্য জরুরি ত্রাণ"
                />
              </FieldWrapper>
              <FieldWrapper label="Description" required>
                <Textarea
                  value={form.description}
                  onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
                />
              </FieldWrapper>
              <FieldWrapper label="Goal amount, ৳ (optional)">
                <Input
                  type="number"
                  value={form.goalAmount}
                  onChange={(e) => setForm((f) => ({ ...f, goalAmount: e.target.value }))}
                />
              </FieldWrapper>
              <label className="flex items-center gap-2 text-sm text-slate-700">
                <input
                  type="checkbox"
                  checked={form.isEmergency}
                  onChange={(e) => setForm((f) => ({ ...f, isEmergency: e.target.checked }))}
                  className="h-4 w-4 rounded border-slate-300"
                />
                Show as an urgent homepage banner (flood/disaster relief)
              </label>

              {submitError && <p className="text-sm text-red-600">{submitError}</p>}

              <div className="mt-2 flex justify-end gap-2">
                <Button type="button" variant="ghost" onClick={resetAndClose}>
                  Cancel
                </Button>
                <Button type="submit" disabled={saving}>
                  {saving ? "Saving…" : "Create Campaign"}
                </Button>
              </div>
            </form>
          </Card>
        </div>
      )}
    </div>
  );
};

export default AdminCampaignsManagement;
