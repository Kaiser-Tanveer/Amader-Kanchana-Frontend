import { useParams } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { Section, SectionHeading } from "@/components/common/Layout";
import { Card, CategoryBadge, StatusBadge } from "@/components/common/Card";
import { LoadingSpinner, ErrorState, EmptyState } from "@/components/common/States";
import { useFetch } from "@/hooks/useFetch";
import { fetchWardById } from "@/services/resourceServices";
import { fetchIssues } from "@/services/issuesService";
import { fetchInstitutions } from "@/services/resourceServices";

const WardDetail = () => {
  const { wardId } = useParams<{ wardId: string }>();
  const { t } = useTranslation("misc");

  const wardQuery = useFetch(() => fetchWardById(wardId as string), [wardId]);
  const wardName = wardQuery.data ? `Ward ${wardQuery.data.data.number}` : undefined;

  const issuesQuery = useFetch(() => fetchIssues({ ward: wardName }), [wardName]);
  const institutionsQuery = useFetch(() => fetchInstitutions({ ward: wardName }), [wardName]);

  if (wardQuery.loading) return <LoadingSpinner />;
  if (wardQuery.error || !wardQuery.data) return <ErrorState />;

  const ward = wardQuery.data.data;

  return (
    <>
      <Section>
        <SectionHeading title={t("wards.wardLabel", { number: ward.number })} subtitle={ward.name} />
      </Section>

      <Section tint="sand">
        <h3 className="mb-4 text-xl font-bold text-forest-900">{t("common:nav.issues")}</h3>
        {issuesQuery.loading && <LoadingSpinner />}
        {!issuesQuery.loading && (issuesQuery.data?.data.length ?? 0) === 0 && <EmptyState />}
        {!issuesQuery.loading && (issuesQuery.data?.data.length ?? 0) > 0 && (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {issuesQuery.data?.data.map((issue) => (
              <Card key={issue._id}>
                <div className="mb-2 flex items-center gap-2">
                  <CategoryBadge categoryKey={issue.category} />
                </div>
                <h4 className="font-semibold text-forest-900">{issue.title}</h4>
                <div className="mt-3">
                  <StatusBadge status={issue.status} />
                </div>
              </Card>
            ))}
          </div>
        )}
      </Section>

      <Section>
        <h3 className="mb-4 text-xl font-bold text-forest-900">{t("common:nav.institutions")}</h3>
        {institutionsQuery.loading && <LoadingSpinner />}
        {!institutionsQuery.loading && (institutionsQuery.data?.data.length ?? 0) === 0 && <EmptyState />}
        {!institutionsQuery.loading && (institutionsQuery.data?.data.length ?? 0) > 0 && (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {institutionsQuery.data?.data.map((inst) => (
              <Card key={inst._id}>
                <h4 className="font-semibold text-forest-900">{inst.name}</h4>
                <p className="mt-1 text-sm text-slate-500">{t(`institutions.categories.${inst.category}`)}</p>
              </Card>
            ))}
          </div>
        )}
      </Section>
    </>
  );
};

export default WardDetail;
