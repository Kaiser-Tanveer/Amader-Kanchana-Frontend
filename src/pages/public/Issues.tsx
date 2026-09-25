import { useState } from "react";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { Search } from "lucide-react";
import { Section, SectionHeading } from "@/components/common/Layout";
import { Card, CategoryBadge, StatusBadge } from "@/components/common/Card";
import { Input, Select } from "@/components/common/FormFields";
import { LoadingSpinner, EmptyState, ErrorState, DemoDataTag } from "@/components/common/States";
import { useFetch } from "@/hooks/useFetch";
import { fetchIssues } from "@/services/issuesService";
import { ISSUE_CATEGORIES, ISSUE_STATUSES } from "@/utils/categories";
import type { IssueStatus } from "@/types";

const Issues = () => {
  const { t } = useTranslation(["common", "issues"]);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("");
  const [status, setStatus] = useState<IssueStatus | "">("");

  const { data, loading, error } = useFetch(
    () => fetchIssues({ search: search || undefined, category: category || undefined, status: status || undefined }),
    [search, category, status],
  );

  return (
    <Section>
      <SectionHeading title={t("nav.issues")} />

      <div className="mb-8 flex flex-col gap-3 sm:flex-row">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
          <Input
            className="pl-10"
            placeholder={t("actions.search")}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <Select value={category} onChange={(e) => setCategory(e.target.value)} className="sm:w-56">
          <option value="">{t("actions.filter")}: {t("issues:reportPage.form.category")}</option>
          {ISSUE_CATEGORIES.map((c) => (
            <option key={c.key} value={c.key}>
              {t(c.translationKey)}
            </option>
          ))}
        </Select>
        <Select value={status} onChange={(e) => setStatus(e.target.value as IssueStatus)} className="sm:w-56">
          <option value="">{t("actions.filter")}: {t("issues:publicPage.currentStatus")}</option>
          {ISSUE_STATUSES.map((s) => (
            <option key={s} value={s}>
              {t(`issues:status.${s}`)}
            </option>
          ))}
        </Select>
      </div>

      {error && <ErrorState />}
      {loading && <LoadingSpinner />}
      {!loading && !error && data && data.data.length === 0 && <EmptyState />}

      {!loading && data && data.data.length > 0 && (
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {data.data.map((issue) => (
            <Link key={issue._id} to={`/issues/${issue._id}`}>
              <Card className="h-full transition-shadow hover:shadow-md">
                <div className="mb-3 flex flex-wrap items-center gap-2">
                  <CategoryBadge categoryKey={issue.category} />
                  {issue.isDemoData && <DemoDataTag />}
                </div>
                <h4 className="font-semibold text-forest-900">{issue.title}</h4>
                <p className="mt-1 text-sm text-slate-500">{issue.ward} · {issue.area}</p>
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

export default Issues;
