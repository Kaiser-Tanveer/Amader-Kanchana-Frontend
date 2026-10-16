import { useState } from "react";
import { Plus, X } from "lucide-react";
import { Card, Badge } from "@/components/common/Card";
import { FieldWrapper, Input, Textarea, Select } from "@/components/common/FormFields";
import Button from "@/components/common/Button";
import { LoadingSpinner, ErrorState, EmptyState } from "@/components/common/States";
import { useFetch } from "@/hooks/useFetch";
import { fetchProjects, createProject } from "@/services/resourceServices";
import type { ProjectStatus } from "@/types";

const statusColor: Record<ProjectStatus, "slate" | "amber" | "forest" | "red"> = {
  PLANNED: "slate",
  ONGOING: "amber",
  COMPLETED: "forest",
  CANCELLED: "red",
};

const emptyForm = {
  title: "",
  description: "",
  category: "",
  status: "PLANNED" as ProjectStatus,
  ward: "",
  startDate: "",
  endDate: "",
  target: "",
  beneficiaries: "",
  volunteers: "",
  outcomes: "",
};

const AdminProjectsManagement = () => {
  const { data, loading, error, refetch } = useFetch(() => fetchProjects(), []);
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
    if (!form.title.trim() || !form.description.trim() || !form.category.trim()) {
      setSubmitError("Title, description and category are required.");
      return;
    }
    setSaving(true);
    setSubmitError(null);
    try {
      await createProject({
        title: form.title,
        description: form.description,
        category: form.category,
        status: form.status,
        ward: form.ward || undefined,
        startDate: form.startDate || undefined,
        endDate: form.endDate || undefined,
        target: form.target || undefined,
        beneficiaries: form.beneficiaries ? Number(form.beneficiaries) : undefined,
        volunteers: form.volunteers ? Number(form.volunteers) : undefined,
        outcomes: form.outcomes || undefined,
      });
      resetAndClose();
      refetch();
    } catch {
      setSubmitError("Could not save this program. Please check the fields and try again.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-forest-900">Projects &amp; Programs</h1>
        <Button size="sm" onClick={() => setShowForm(true)}>
          <Plus size={16} />
          Add Program
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
                <th className="px-4 py-3">Category</th>
                <th className="px-4 py-3">Ward</th>
                <th className="px-4 py-3">Status</th>
              </tr>
            </thead>
            <tbody>
              {data.data.map((project) => (
                <tr key={project._id} className="border-b border-slate-50 last:border-0">
                  <td className="px-4 py-3 font-medium text-slate-800">{project.title}</td>
                  <td className="px-4 py-3 text-slate-500">{project.category}</td>
                  <td className="px-4 py-3 text-slate-500">{project.ward ?? "—"}</td>
                  <td className="px-4 py-3">
                    <Badge color={statusColor[project.status]}>{project.status}</Badge>
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
              <h3 className="text-lg font-bold text-forest-900">Add a Program</h3>
              <button onClick={resetAndClose} aria-label="Close">
                <X size={20} className="text-slate-400" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
              <FieldWrapper label="Program title" required>
                <Input value={form.title} onChange={(e) => update("title", e.target.value)} placeholder="e.g. মেডিক্যাল ক্যাম্প" />
              </FieldWrapper>

              <FieldWrapper label="Description" required>
                <Textarea value={form.description} onChange={(e) => update("description", e.target.value)} />
              </FieldWrapper>

              <div className="grid gap-4 sm:grid-cols-2">
                <FieldWrapper label="Category" required>
                  <Input
                    value={form.category}
                    onChange={(e) => update("category", e.target.value)}
                    placeholder="health, education, youth, anti-drug, environment…"
                  />
                </FieldWrapper>
                <FieldWrapper label="Status">
                  <Select value={form.status} onChange={(e) => update("status", e.target.value)}>
                    <option value="PLANNED">Planned</option>
                    <option value="ONGOING">Ongoing</option>
                    <option value="COMPLETED">Completed</option>
                    <option value="CANCELLED">Cancelled</option>
                  </Select>
                </FieldWrapper>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <FieldWrapper label="Ward (optional)">
                  <Input value={form.ward} onChange={(e) => update("ward", e.target.value)} placeholder="e.g. Ward 3" />
                </FieldWrapper>
                <FieldWrapper label="Target (optional)">
                  <Input value={form.target} onChange={(e) => update("target", e.target.value)} />
                </FieldWrapper>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <FieldWrapper label="Start date">
                  <Input type="date" value={form.startDate} onChange={(e) => update("startDate", e.target.value)} />
                </FieldWrapper>
                <FieldWrapper label="End date">
                  <Input type="date" value={form.endDate} onChange={(e) => update("endDate", e.target.value)} />
                </FieldWrapper>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <FieldWrapper label="Beneficiaries (optional)">
                  <Input type="number" value={form.beneficiaries} onChange={(e) => update("beneficiaries", e.target.value)} />
                </FieldWrapper>
                <FieldWrapper label="Volunteers involved (optional)">
                  <Input type="number" value={form.volunteers} onChange={(e) => update("volunteers", e.target.value)} />
                </FieldWrapper>
              </div>

              <FieldWrapper label="Outcomes (optional)">
                <Textarea value={form.outcomes} onChange={(e) => update("outcomes", e.target.value)} />
              </FieldWrapper>

              {submitError && <p className="text-sm text-red-600">{submitError}</p>}

              <div className="mt-2 flex justify-end gap-2">
                <Button type="button" variant="ghost" onClick={resetAndClose}>
                  Cancel
                </Button>
                <Button type="submit" disabled={saving}>
                  {saving ? "Saving…" : "Save Program"}
                </Button>
              </div>
            </form>
          </Card>
        </div>
      )}
    </div>
  );
};

export default AdminProjectsManagement;
