import { Card, Badge } from "@/components/common/Card";
import { LoadingSpinner, ErrorState, EmptyState } from "@/components/common/States";
import { useFetch } from "@/hooks/useFetch";
import { fetchProjects } from "@/services/resourceServices";
import type { ProjectStatus } from "@/types";

const statusColor: Record<ProjectStatus, "slate" | "amber" | "forest" | "red"> = {
  PLANNED: "slate",
  ONGOING: "amber",
  COMPLETED: "forest",
  CANCELLED: "red",
};

const AdminProjectsManagement = () => {
  const { data, loading, error } = useFetch(() => fetchProjects(), []);

  return (
    <div className="flex flex-col gap-6">
      <h1 className="text-2xl font-bold text-forest-900">Projects</h1>

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
    </div>
  );
};

export default AdminProjectsManagement;
