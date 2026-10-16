import { useState } from "react";
import { Plus, X } from "lucide-react";
import { Card, Badge } from "@/components/common/Card";
import { FieldWrapper, Input, Textarea } from "@/components/common/FormFields";
import Button from "@/components/common/Button";
import { LoadingSpinner, ErrorState, EmptyState } from "@/components/common/States";
import { useFetch } from "@/hooks/useFetch";
import { fetchActivities, createActivity } from "@/services/resourceServices";

const emptyForm = {
  title: "",
  date: "",
  location: "",
  description: "",
  category: "",
  isPublished: true,
};

const AdminActivitiesManagement = () => {
  const { data, loading, error, refetch } = useFetch(() => fetchActivities(), []);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState(emptyForm);
  const [saving, setSaving] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const update = <K extends keyof typeof form>(key: K, value: (typeof form)[K]) =>
    setForm((f) => ({ ...f, [key]: value }));

  const resetAndClose = () => {
    setForm(emptyForm);
    setSubmitError(null);
    setShowForm(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.title.trim() || !form.date || !form.description.trim() || !form.category.trim()) {
      setSubmitError("Title, date, category and description are required.");
      return;
    }
    setSaving(true);
    setSubmitError(null);
    try {
      await createActivity({
        title: form.title,
        date: form.date,
        location: form.location || undefined,
        description: form.description,
        category: form.category,
        isPublished: form.isPublished,
      });
      resetAndClose();
      refetch();
    } catch {
      setSubmitError("Could not save this activity. Please check the fields and try again.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-forest-900">Activities</h1>
        <Button size="sm" onClick={() => setShowForm(true)}>
          <Plus size={16} />
          Add Activity
        </Button>
      </div>

      {error && <ErrorState />}
      {loading && <LoadingSpinner />}
      {!loading && !error && data?.data.length === 0 && <EmptyState />}

      {!loading && data && data.data.length > 0 && (
        <Card className="overflow-x-auto p-0">
          <table className="w-full text-left text-sm">
            <thead className="border-b border-slate-100 text-xs uppercase text-slate-400">
              <tr>
                <th className="px-4 py-3">Title</th>
                <th className="px-4 py-3">Date</th>
                <th className="px-4 py-3">Category</th>
                <th className="px-4 py-3">Published</th>
              </tr>
            </thead>
            <tbody>
              {data.data.map((activity) => (
                <tr key={activity._id} className="border-b border-slate-50 last:border-0">
                  <td className="px-4 py-3 font-medium text-slate-800">{activity.title}</td>
                  <td className="px-4 py-3 text-slate-500">{new Date(activity.date).toLocaleDateString()}</td>
                  <td className="px-4 py-3 text-slate-500">{activity.category}</td>
                  <td className="px-4 py-3">
                    <Badge color={activity.isPublished ? "forest" : "slate"}>
                      {activity.isPublished ? "Published" : "Draft"}
                    </Badge>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </Card>
      )}

      {showForm && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4"
          onClick={resetAndClose}
        >
          <Card className="max-h-[90vh] w-full max-w-lg overflow-y-auto" onClick={(e) => e.stopPropagation()}>
            <div className="mb-4 flex items-center justify-between">
              <h3 className="text-lg font-bold text-forest-900">Add an Activity</h3>
              <button onClick={resetAndClose} aria-label="Close">
                <X size={20} className="text-slate-400" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
              <FieldWrapper label="Title" required>
                <Input value={form.title} onChange={(e) => update("title", e.target.value)} placeholder="e.g. মেডিক্যাল ক্যাম্প অনুষ্ঠিত" />
              </FieldWrapper>

              <div className="grid gap-4 sm:grid-cols-2">
                <FieldWrapper label="Date" required>
                  <Input type="date" value={form.date} onChange={(e) => update("date", e.target.value)} />
                </FieldWrapper>
                <FieldWrapper label="Location (optional)">
                  <Input value={form.location} onChange={(e) => update("location", e.target.value)} placeholder="e.g. Ward 4, Kanchana" />
                </FieldWrapper>
              </div>

              <FieldWrapper label="Category" required>
                <Input
                  value={form.category}
                  onChange={(e) => update("category", e.target.value)}
                  placeholder="health, education, youth, anti-drug, environment…"
                />
              </FieldWrapper>

              <FieldWrapper label="Description" required>
                <Textarea value={form.description} onChange={(e) => update("description", e.target.value)} />
              </FieldWrapper>

              <label className="flex items-center gap-2 text-sm text-slate-700">
                <input
                  type="checkbox"
                  checked={form.isPublished}
                  onChange={(e) => update("isPublished", e.target.checked)}
                  className="h-4 w-4 rounded border-slate-300"
                />
                Publish immediately (visible on the public site)
              </label>

              {submitError && <p className="text-sm text-red-600">{submitError}</p>}

              <div className="mt-2 flex justify-end gap-2">
                <Button type="button" variant="ghost" onClick={resetAndClose}>
                  Cancel
                </Button>
                <Button type="submit" disabled={saving}>
                  {saving ? "Saving…" : "Save Activity"}
                </Button>
              </div>
            </form>
          </Card>
        </div>
      )}
    </div>
  );
};

export default AdminActivitiesManagement;
