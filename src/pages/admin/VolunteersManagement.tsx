import { Card, Badge } from "@/components/common/Card";
import { LoadingSpinner, ErrorState, EmptyState } from "@/components/common/States";
import { useFetch } from "@/hooks/useFetch";
import { fetchVolunteers } from "@/services/resourceServices";

const AdminVolunteersManagement = () => {
  const { data, loading, error } = useFetch(() => fetchVolunteers(), []);

  return (
    <div className="flex flex-col gap-6">
      <h1 className="text-2xl font-bold text-forest-900">Volunteers</h1>
      <p className="text-sm text-slate-500">
        This information is private and visible only to admins. It is never shown on the public site.
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
                <th className="px-4 py-3">Mobile</th>
                <th className="px-4 py-3">Ward</th>
                <th className="px-4 py-3">Interests</th>
              </tr>
            </thead>
            <tbody>
              {data.data.map((v) => (
                <tr key={v._id} className="border-b border-slate-50 last:border-0">
                  <td className="px-4 py-3 font-medium text-slate-800">{v.name}</td>
                  <td className="px-4 py-3 text-slate-500">{v.mobile}</td>
                  <td className="px-4 py-3 text-slate-500">{v.ward}</td>
                  <td className="px-4 py-3">
                    <div className="flex flex-wrap gap-1">
                      {v.interests.map((i) => (
                        <Badge key={i} color="river">
                          {i}
                        </Badge>
                      ))}
                    </div>
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

export default AdminVolunteersManagement;
