import type { HTMLAttributes, PropsWithChildren } from "react";
import { useTranslation } from "react-i18next";
import { getIssueCategory } from "@/utils/categories";
import type { IssueStatus } from "@/types";

export const Card = ({ className = "", children, ...props }: PropsWithChildren<HTMLAttributes<HTMLDivElement>>) => (
  <div
    className={`rounded-2xl border border-slate-100 bg-white p-6 shadow-sm shadow-slate-200/60 ${className}`}
    {...props}
  >
    {children}
  </div>
);

export const Badge = ({
  children,
  color = "forest",
}: PropsWithChildren<{ color?: "forest" | "river" | "slate" | "amber" | "red" }>) => {
  const colorClasses = {
    forest: "bg-forest-50 text-forest-700",
    river: "bg-river-50 text-river-700",
    slate: "bg-slate-100 text-slate-700",
    amber: "bg-amber-50 text-amber-700",
    red: "bg-red-50 text-red-700",
  }[color];

  return (
    <span className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold ${colorClasses}`}>
      {children}
    </span>
  );
};

const statusColor: Record<IssueStatus, "slate" | "river" | "forest" | "amber" | "red"> = {
  SUBMITTED: "slate",
  UNDER_REVIEW: "amber",
  VERIFIED: "river",
  FORWARDED: "river",
  IN_PROGRESS: "amber",
  RESOLVED: "forest",
  CLOSED: "slate",
};

export const StatusBadge = ({ status }: { status: IssueStatus }) => {
  const { t } = useTranslation("issues");
  return <Badge color={statusColor[status]}>{t(`status.${status}`)}</Badge>;
};

export const CategoryBadge = ({ categoryKey }: { categoryKey: string }) => {
  const { t } = useTranslation();
  const category = getIssueCategory(categoryKey);
  const Icon = category.icon;
  return (
    <span
      className="inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold"
      style={{ backgroundColor: `${category.color}1a`, color: category.color }}
    >
      <Icon size={14} />
      {t(category.translationKey)}
    </span>
  );
};
