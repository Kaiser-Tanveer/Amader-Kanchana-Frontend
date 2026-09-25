import { useParams } from "react-router-dom";
import { Calendar, MapPin } from "lucide-react";
import { Section } from "@/components/common/Layout";
import { Card } from "@/components/common/Card";
import { LoadingSpinner, ErrorState, DemoDataTag } from "@/components/common/States";
import { useFetch } from "@/hooks/useFetch";
import { fetchActivityById } from "@/services/resourceServices";

const NewsDetail = () => {
  const { id } = useParams<{ id: string }>();
  const { data, loading, error } = useFetch(() => fetchActivityById(id as string), [id]);

  if (loading) return <LoadingSpinner />;
  if (error || !data) return <ErrorState />;

  const activity = data.data;

  return (
    <Section>
      <div className="mx-auto max-w-2xl">
        {activity.isDemoData && <div className="mb-3"><DemoDataTag /></div>}
        <h1 className="text-3xl font-bold text-forest-900">{activity.title}</h1>
        <div className="mt-3 flex flex-wrap gap-4 text-sm text-slate-500">
          <span className="flex items-center gap-1.5">
            <Calendar size={14} /> {new Date(activity.date).toLocaleDateString()}
          </span>
          {activity.location && (
            <span className="flex items-center gap-1.5">
              <MapPin size={14} /> {activity.location}
            </span>
          )}
        </div>
        <Card className="mt-6">
          <p className="leading-relaxed text-slate-700">{activity.description}</p>
        </Card>
      </div>
    </Section>
  );
};

export default NewsDetail;
