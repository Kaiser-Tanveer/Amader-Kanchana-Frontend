import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";
import { Section, SectionHeading } from "@/components/common/Layout";
import { Card } from "@/components/common/Card";
import { LoadingSpinner, ErrorState } from "@/components/common/States";
import { fetchDashboardStats } from "@/services/resourceServices";
import type { DashboardStats } from "@/types";

const StatBlock = ({ label, value }: { label: string; value: number }) => (
  <Card className="text-center">
    <p className="text-3xl font-extrabold text-forest-700">{value}</p>
    <p className="mt-1 text-sm text-slate-500">{label}</p>
  </Card>
);

const HomeStatsPreview = () => {
  const { t } = useTranslation(["home", "issues"]);
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [error, setError] = useState(false);

  useEffect(() => {
    fetchDashboardStats()
      .then((res) => setStats(res.data))
      .catch(() => setError(true));
  }, []);

  return (
    <Section tint="sand">
      <SectionHeading title={t("stats.heading", { ns: "home" })} />
      {error && <ErrorState />}
      {!error && !stats && <LoadingSpinner />}
      {stats && (
        <>
          <div className="grid gap-4 sm:grid-cols-4">
            <StatBlock label={t("dashboard.total", { ns: "issues" })} value={stats.totalIssues} />
            <StatBlock label={t("dashboard.verified", { ns: "issues" })} value={stats.verifiedIssues} />
            <StatBlock label={t("dashboard.inProgress", { ns: "issues" })} value={stats.inProgressIssues} />
            <StatBlock label={t("dashboard.resolved", { ns: "issues" })} value={stats.resolvedIssues} />
          </div>
          {stats.issuesByWard.length > 0 && (
            <Card className="mt-6">
              <p className="mb-4 text-sm font-semibold text-slate-600">{t("dashboard.byWard", { ns: "issues" })}</p>
              <ResponsiveContainer width="100%" height={240}>
                <BarChart data={stats.issuesByWard}>
                  <XAxis dataKey="ward" tick={{ fontSize: 12 }} />
                  <YAxis allowDecimals={false} tick={{ fontSize: 12 }} />
                  <Tooltip />
                  <Bar dataKey="count" fill="#2c8256" radius={[6, 6, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </Card>
          )}
        </>
      )}
    </Section>
  );
};

export default HomeStatsPreview;
