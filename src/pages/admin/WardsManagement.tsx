import { Card } from "@/components/common/Card";
import { LoadingSpinner, ErrorState, EmptyState } from "@/components/common/States";
import { useFetch } from "@/hooks/useFetch";
import { fetchWards } from "@/services/resourceServices";

const AdminWardsManagement = () => {
  const { data, loading, error } = useFetch(() => fetchWards(), []);

  return (
    <div className="flex flex-col gap-6">
      <h1 className="text-2xl font-bold text-forest-900">Wards</h1>
      <p className="text-sm text-slate-500">
        Kanchana Union has 9 wards. Add real names and details here as they become available.
      </p>

      {error && <ErrorState />}
      {loading && <LoadingSpinner />}
      {!loading && !error && data?.data.length === 0 && <EmptyState />}

      {!loading && data && data.data.length > 0 && (
        <div className="grid gap-4 sm:grid-cols-3 lg:grid-cols-4">
          {data.data.map((ward) => (
            <Card key={ward._id}>
              <p className="font-semibold text-forest-900">Ward {ward.number}</p>
              <p className="mt-1 text-sm text-slate-500">{ward.name ?? "Name not set"}</p>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default AdminWardsManagement;
