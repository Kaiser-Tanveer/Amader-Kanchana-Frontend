import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { ArrowRight } from "lucide-react";
import { Section, SectionHeading } from "@/components/common/Layout";
import { Card, CategoryBadge, StatusBadge } from "@/components/common/Card";
import { LoadingSpinner, EmptyState, ErrorState, DemoDataTag } from "@/components/common/States";
import { fetchIssues } from "@/services/issuesService";
import type { Issue } from "@/types";

const HomeIssuesPreview = () => {
  const { t } = useTranslation("home");
  const [issues, setIssues] = useState<Issue[] | null>(null);
  const [error, setError] = useState(false);

  useEffect(() => {
    fetchIssues({ limit: 3 })
      .then((res) => setIssues(res.data))
      .catch(() => setError(true));
  }, []);

  return (
    <Section>
      <div className="mb-6 flex items-center justify-between">
        <SectionHeading title={t("issuesSection.heading")} />
        <Link to="/issues" className="hidden items-center gap-1 text-sm font-semibold text-forest-700 sm:flex">
          {t("issuesSection.cta")}
          <ArrowRight size={16} />
        </Link>
      </div>

      {error && <ErrorState />}
      {!error && issues === null && <LoadingSpinner />}
      {!error && issues !== null && issues.length === 0 && <EmptyState />}

      {issues && issues.length > 0 && (
        <div className="grid gap-5 sm:grid-cols-3">
          {issues.map((issue) => (
            <Link key={issue._id} to={`/issues/${issue._id}`}>
              <Card className="h-full transition-shadow hover:shadow-md">
                <div className="mb-3 flex flex-wrap items-center gap-2">
                  <CategoryBadge categoryKey={issue.category} />
                  {issue.isDemoData && <DemoDataTag />}
                </div>
                <h4 className="font-semibold text-forest-900">{issue.title}</h4>
                <p className="mt-1 line-clamp-2 text-sm text-slate-500">{issue.description}</p>
                <div className="mt-4">
                  <StatusBadge status={issue.status} />
                </div>
              </Card>
            </Link>
          ))}
        </div>
      )}
    </Section>
  );
};

export default HomeIssuesPreview;
