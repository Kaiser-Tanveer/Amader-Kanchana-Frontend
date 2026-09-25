import { useTranslation } from "react-i18next";
import { Loader2, Inbox, AlertTriangle } from "lucide-react";

export const LoadingSpinner = ({ label }: { label?: string }) => {
  const { t } = useTranslation();
  return (
    <div className="flex flex-col items-center justify-center gap-3 py-16 text-slate-500">
      <Loader2 className="animate-spin text-forest-600" size={28} />
      <span>{label ?? t("states.loading")}</span>
    </div>
  );
};

export const EmptyState = ({ message }: { message?: string }) => {
  const { t } = useTranslation();
  return (
    <div className="flex flex-col items-center justify-center gap-3 rounded-2xl border border-dashed border-slate-200 py-16 text-slate-500">
      <Inbox size={28} />
      <span>{message ?? t("states.empty")}</span>
    </div>
  );
};

export const ErrorState = ({ message }: { message?: string }) => {
  const { t } = useTranslation();
  return (
    <div className="flex flex-col items-center justify-center gap-3 rounded-2xl border border-red-100 bg-red-50 py-16 text-red-600">
      <AlertTriangle size={28} />
      <span>{message ?? t("states.error")}</span>
    </div>
  );
};

export const DemoDataTag = () => {
  const { t } = useTranslation();
  return (
    <span className="inline-flex items-center rounded-full bg-amber-50 px-2.5 py-0.5 text-[11px] font-semibold uppercase tracking-wide text-amber-600">
      {t("states.demoData")}
    </span>
  );
};
