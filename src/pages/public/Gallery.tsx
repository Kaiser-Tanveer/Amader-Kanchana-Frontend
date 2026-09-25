import { useState } from "react";
import { useTranslation } from "react-i18next";
import { X, Images } from "lucide-react";
import { Section, SectionHeading } from "@/components/common/Layout";
import { Card } from "@/components/common/Card";
import { LoadingSpinner, ErrorState, EmptyState, DemoDataTag } from "@/components/common/States";
import { useFetch } from "@/hooks/useFetch";
import { fetchGalleryAlbums } from "@/services/resourceServices";
import type { GalleryImage } from "@/types";

const Gallery = () => {
  const { t } = useTranslation("misc");
  const { data, loading, error } = useFetch(() => fetchGalleryAlbums(), []);
  const [lightboxImage, setLightboxImage] = useState<GalleryImage | null>(null);

  return (
    <Section>
      <SectionHeading title={t("gallery.heading")} />

      {error && <ErrorState />}
      {loading && <LoadingSpinner />}
      {!loading && !error && data?.data.length === 0 && <EmptyState />}

      {!loading && data && data.data.length > 0 && (
        <div className="flex flex-col gap-10">
          {data.data.map((album) => (
            <div key={album._id}>
              <div className="mb-4 flex items-center gap-2">
                <Images size={18} className="text-forest-600" />
                <h3 className="font-semibold text-forest-900">{album.title}</h3>
                {album.isDemoData && <DemoDataTag />}
              </div>
              {album.images.length === 0 ? (
                <EmptyState />
              ) : (
                <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
                  {album.images.map((img) => (
                    <button
                      key={img._id}
                      onClick={() => setLightboxImage(img)}
                      className="aspect-square overflow-hidden rounded-xl border border-slate-100 bg-slate-50"
                    >
                      <img src={img.url} alt={img.caption ?? album.title} className="h-full w-full object-cover" />
                    </button>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {lightboxImage && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4"
          onClick={() => setLightboxImage(null)}
        >
          <button
            className="absolute right-5 top-5 text-white"
            onClick={() => setLightboxImage(null)}
            aria-label="Close"
          >
            <X size={28} />
          </button>
          <Card className="max-h-[85vh] max-w-3xl overflow-auto bg-transparent p-0 shadow-none">
            <img src={lightboxImage.url} alt={lightboxImage.caption ?? ""} className="w-full rounded-xl" />
            {lightboxImage.caption && <p className="mt-2 text-center text-white">{lightboxImage.caption}</p>}
          </Card>
        </div>
      )}
    </Section>
  );
};

export default Gallery;
