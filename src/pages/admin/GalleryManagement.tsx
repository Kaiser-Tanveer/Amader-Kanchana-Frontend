import { Card } from "@/components/common/Card";
import { LoadingSpinner, ErrorState, EmptyState } from "@/components/common/States";
import { useFetch } from "@/hooks/useFetch";
import { fetchGalleryAlbums } from "@/services/resourceServices";

const AdminGalleryManagement = () => {
  const { data, loading, error } = useFetch(() => fetchGalleryAlbums(), []);

  return (
    <div className="flex flex-col gap-6">
      <h1 className="text-2xl font-bold text-forest-900">Gallery</h1>

      {error && <ErrorState />}
      {loading && <LoadingSpinner />}
      {!loading && !error && data?.data.length === 0 && <EmptyState />}

      {!loading && data && data.data.length > 0 && (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {data.data.map((album) => (
            <Card key={album._id}>
              <p className="font-semibold text-forest-900">{album.title}</p>
              <p className="mt-1 text-sm text-slate-500">{album.images.length} photo(s)</p>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default AdminGalleryManagement;
