import { Card, Badge } from "@/components/common/Card";
import { LoadingSpinner, ErrorState, EmptyState } from "@/components/common/States";
import { useFetch } from "@/hooks/useFetch";
import { fetchActivities } from "@/services/resourceServices";

const AdminActivitiesManagement = () => {
  const { data, loading, error } = useFetch(() => fetchActivities(), []);

  return (
    <div className="flex flex-col gap-6">
      <h1 className="text-2xl font-bold text-forest-900">Activities</h1>

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
    </div>
  );
};

export default AdminActivitiesManagement;
