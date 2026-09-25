import { useState } from "react";
import { Card, CategoryBadge, StatusBadge } from "@/components/common/Card";
import { Input, Select } from "@/components/common/FormFields";
import { LoadingSpinner, ErrorState, EmptyState } from "@/components/common/States";
import Button from "@/components/common/Button";
import { useFetch } from "@/hooks/useFetch";
import { fetchIssues, updateIssueStatus } from "@/services/issuesService";
import { ISSUE_CATEGORIES, ISSUE_STATUSES } from "@/utils/categories";
import type { Issue, IssueStatus } from "@/types";

const AdminIssuesManagement = () => {
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("");
  const [status, setStatus] = useState<IssueStatus | "">("");
  const [selected, setSelected] = useState<Issue | null>(null);
  const [note, setNote] = useState("");
  const [nextStatus, setNextStatus] = useState<IssueStatus>("UNDER_REVIEW");
  const [saving, setSaving] = useState(false);

  const { data, loading, error, refetch } = useFetch(
    () => fetchIssues({ search: search || undefined, category: category || undefined, status: status || undefined }),
    [search, category, status],
  );

  const openIssue = (issue: Issue) => {
    setSelected(issue);
    setNextStatus(issue.status);
    setNote("");
  };

  const handleUpdate = async () => {
    if (!selected) return;
    setSaving(true);
    try {
      await updateIssueStatus(selected._id, nextStatus, note || undefined);
      setSelected(null);
      refetch();
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="flex flex-col gap-6">
      <h1 className="text-2xl font-bold text-forest-900">Issue Management</h1>

      <div className="flex flex-col gap-3 sm:flex-row">
        <Input placeholder="Search title, area..." value={search} onChange={(e) => setSearch(e.target.value)} />
        <Select value={category} onChange={(e) => setCategory(e.target.value)} className="sm:w-56">
          <option value="">All categories</option>
          {ISSUE_CATEGORIES.map((c) => (
            <option key={c.key} value={c.key}>
              {c.key}
            </option>
          ))}
        </Select>
        <Select value={status} onChange={(e) => setStatus(e.target.value as IssueStatus)} className="sm:w-56">
          <option value="">All statuses</option>
          {ISSUE_STATUSES.map((s) => (
            <option key={s} value={s}>
              {s}
            </option>
          ))}
        </Select>
      </div>

      {error && <ErrorState />}
      {loading && <LoadingSpinner />}
      {!loading && !error && data?.data.length === 0 && <EmptyState />}

      {!loading && data && data.data.length > 0 && (
        <Card className="overflow-x-auto p-0">
          <table className="w-full text-left text-sm">
            <thead className="border-b border-slate-100 text-xs uppercase text-slate-400">
              <tr>
                <th className="px-4 py-3">Reference</th>
                <th className="px-4 py-3">Title</th>
                <th className="px-4 py-3">Category</th>
                <th className="px-4 py-3">Ward</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3"></th>
              </tr>
            </thead>
            <tbody>
              {data.data.map((issue) => (
                <tr key={issue._id} className="border-b border-slate-50 last:border-0">
                  <td className="px-4 py-3 font-mono text-xs text-slate-500">{issue.referenceNumber}</td>
                  <td className="px-4 py-3 font-medium text-slate-800">{issue.title}</td>
                  <td className="px-4 py-3">
                    <CategoryBadge categoryKey={issue.category} />
                  </td>
                  <td className="px-4 py-3">{issue.ward}</td>
                  <td className="px-4 py-3">
                    <StatusBadge status={issue.status} />
                  </td>
                  <td className="px-4 py-3">
                    <Button size="sm" variant="outline" onClick={() => openIssue(issue)}>
                      Manage
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </Card>
      )}

      {selected && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4"
          onClick={() => setSelected(null)}
        >
          <Card className="w-full max-w-md" onClick={(e) => e.stopPropagation()}>
            <h3 className="font-bold text-forest-900">{selected.title}</h3>
            <p className="mt-1 text-sm text-slate-500">{selected.referenceNumber}</p>

            <div className="mt-4 flex flex-col gap-3">
              <label className="text-sm font-medium text-slate-700">Update status</label>
              <Select value={nextStatus} onChange={(e) => setNextStatus(e.target.value as IssueStatus)}>
                {ISSUE_STATUSES.map((s) => (
                  <option key={s} value={s}>
                    {s}
                  </option>
                ))}
              </Select>
              <label className="text-sm font-medium text-slate-700">Internal / public note</label>
              <textarea
                className="w-full rounded-xl border border-slate-200 px-4 py-2.5 text-sm"
                rows={3}
                value={note}
                onChange={(e) => setNote(e.target.value)}
              />
            </div>

            <div className="mt-5 flex justify-end gap-2">
              <Button variant="ghost" onClick={() => setSelected(null)}>
                Cancel
              </Button>
              <Button onClick={handleUpdate} disabled={saving}>
                {saving ? "Saving…" : "Save"}
              </Button>
            </div>
          </Card>
        </div>
      )}
    </div>
  );
};

export default AdminIssuesManagement;
