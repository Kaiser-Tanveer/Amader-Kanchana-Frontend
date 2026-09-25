import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { ArrowRight, Calendar } from "lucide-react";
import { Section, SectionHeading } from "@/components/common/Layout";
import { Card } from "@/components/common/Card";
import { LoadingSpinner, EmptyState, ErrorState, DemoDataTag } from "@/components/common/States";
import { fetchActivities } from "@/services/resourceServices";
import type { Activity } from "@/types";

const HomeActivitiesPreview = () => {
  const { t } = useTranslation("home");
  const [activities, setActivities] = useState<Activity[] | null>(null);
  const [error, setError] = useState(false);

  useEffect(() => {
    fetchActivities()
      .then((res) => setActivities(res.data.slice(0, 3)))
      .catch(() => setError(true));
  }, []);

  return (
    <Section>
      <div className="mb-6 flex items-center justify-between">
        <SectionHeading title={t("activitiesSection.heading")} />
        <Link to="/news" className="hidden items-center gap-1 text-sm font-semibold text-forest-700 sm:flex">
          {t("activitiesSection.cta")}
          <ArrowRight size={16} />
        </Link>
      </div>

      {error && <ErrorState />}
      {!error && activities === null && <LoadingSpinner />}
      {!error && activities !== null && activities.length === 0 && <EmptyState />}

      {activities && activities.length > 0 && (
        <div className="grid gap-5 sm:grid-cols-3">
          {activities.map((activity) => (
            <Link key={activity._id} to={`/news/${activity._id}`}>
              <Card className="h-full transition-shadow hover:shadow-md">
                <div className="mb-3 flex items-center gap-2 text-sm text-slate-500">
                  <Calendar size={14} />
                  {new Date(activity.date).toLocaleDateString()}
                  {activity.isDemoData && <DemoDataTag />}
                </div>
                <h4 className="font-semibold text-forest-900">{activity.title}</h4>
                <p className="mt-1 line-clamp-2 text-sm text-slate-500">{activity.description}</p>
              </Card>
            </Link>
          ))}
        </div>
      )}
    </Section>
  );
};

export default HomeActivitiesPreview;
