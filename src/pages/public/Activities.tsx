import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { Calendar, MapPin } from "lucide-react";
import { Section, SectionHeading } from "@/components/common/Layout";
import { Card } from "@/components/common/Card";
import { LoadingSpinner, ErrorState, EmptyState, DemoDataTag } from "@/components/common/States";
import { useFetch } from "@/hooks/useFetch";
import { fetchActivities } from "@/services/resourceServices";

const Activities = () => {
  const { t } = useTranslation(["common", "misc"]);
  const { data, loading, error } = useFetch(() => fetchActivities(), []);

  return (
    <Section>
      <SectionHeading title={t("misc:news.heading")} />

      {error && <ErrorState />}
      {loading && <LoadingSpinner />}
      {!loading && !error && data?.data.length === 0 && <EmptyState />}

      {!loading && data && data.data.length > 0 && (
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {data.data.map((activity) => (
            <Link key={activity._id} to={`/news/${activity._id}`}>
              <Card className="h-full transition-shadow hover:shadow-md">
                <div className="mb-3 flex items-center gap-2 text-sm text-slate-500">
                  <Calendar size={14} />
                  {new Date(activity.date).toLocaleDateString()}
                  {activity.isDemoData && <DemoDataTag />}
                </div>
                <h4 className="font-semibold text-forest-900">{activity.title}</h4>
                {activity.location && (
                  <p className="mt-1 flex items-center gap-1.5 text-sm text-slate-500">
                    <MapPin size={13} /> {activity.location}
                  </p>
                )}
                <p className="mt-2 line-clamp-2 text-sm text-slate-500">{activity.description}</p>
              </Card>
            </Link>
          ))}
        </div>
      )}
    </Section>
  );
};

export default Activities;
