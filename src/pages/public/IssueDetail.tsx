import { useParams } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { Section } from "@/components/common/Layout";
import { Card, CategoryBadge, StatusBadge } from "@/components/common/Card";
import { LoadingSpinner, ErrorState, DemoDataTag } from "@/components/common/States";
import { useFetch } from "@/hooks/useFetch";
import { fetchIssueById } from "@/services/issuesService";

const IssueDetail = () => {
  const { id } = useParams<{ id: string }>();
  const { t } = useTranslation("issues");
  const { data, loading, error } = useFetch(() => fetchIssueById(id as string), [id]);

  if (loading) return <LoadingSpinner />;
  if (error || !data) return <ErrorState />;

  const issue = data.data;

  return (
    <Section>
      <div className="mx-auto max-w-2xl">
        <div className="mb-4 flex flex-wrap items-center gap-2">
          <CategoryBadge categoryKey={issue.category} />
          <StatusBadge status={issue.status} />
          {issue.isDemoData && <DemoDataTag />}
        </div>
        <h1 className="text-3xl font-bold text-forest-900">{issue.title}</h1>
        <p className="mt-2 text-slate-500">
          {issue.ward} · {issue.area} · {t("publicPage.submittedOn")}: {new Date(issue.createdAt).toLocaleDateString()}
        </p>
        <p className="mt-2 text-sm font-mono text-slate-400">{issue.referenceNumber}</p>

        <Card className="mt-6">
          <p className="leading-relaxed text-slate-700">{issue.description}</p>
        </Card>

        {issue.updates && issue.updates.length > 0 && (
          <Card className="mt-6">
            <h3 className="mb-4 font-semibold text-forest-900">{t("publicPage.timeline")}</h3>
            <ol className="space-y-4 border-l-2 border-forest-100 pl-4">
              {issue.updates.map((update) => (
                <li key={update._id}>
                  <div className="flex items-center gap-2">
                    <StatusBadge status={update.status} />
                    <span className="text-xs text-slate-400">{new Date(update.createdAt).toLocaleDateString()}</span>
                  </div>
                  {update.note && <p className="mt-1 text-sm text-slate-600">{update.note}</p>}
                </li>
              ))}
            </ol>
          </Card>
        )}
      </div>
    </Section>
  );
};

export default IssueDetail;
