import { Card } from "@/components/common/Card";
import { LoadingSpinner, ErrorState, EmptyState } from "@/components/common/States";
import { useFetch } from "@/hooks/useFetch";
import { fetchInstitutions } from "@/services/resourceServices";

const AdminInstitutionsManagement = () => {
  const { data, loading, error } = useFetch(() => fetchInstitutions(), []);

  return (
    <div className="flex flex-col gap-6">
      <h1 className="text-2xl font-bold text-forest-900">Institutions</h1>

      {error && <ErrorState />}
      {loading && <LoadingSpinner />}
      {!loading && !error && data?.data.length === 0 && <EmptyState />}

      {!loading && data && data.data.length > 0 && (
        <Card className="overflow-x-auto p-0">
          <table className="w-full text-left text-sm">
            <thead className="border-b border-slate-100 text-xs uppercase text-slate-400">
              <tr>
                <th className="px-4 py-3">Name</th>
                <th className="px-4 py-3">Category</th>
                <th className="px-4 py-3">Ward</th>
              </tr>
            </thead>
            <tbody>
              {data.data.map((inst) => (
                <tr key={inst._id} className="border-b border-slate-50 last:border-0">
                  <td className="px-4 py-3 font-medium text-slate-800">{inst.name}</td>
                  <td className="px-4 py-3 text-slate-500">{inst.category}</td>
                  <td className="px-4 py-3 text-slate-500">{inst.ward}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </Card>
      )}
    </div>
  );
};

export default AdminInstitutionsManagement;
