import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { LayoutGrid, ArrowRight } from "lucide-react";
import { Section, SectionHeading } from "@/components/common/Layout";
import { Card } from "@/components/common/Card";
import { LoadingSpinner, ErrorState } from "@/components/common/States";
import { useFetch } from "@/hooks/useFetch";
import { fetchWards } from "@/services/resourceServices";

const Wards = () => {
  const { t } = useTranslation("misc");
  const { data, loading, error } = useFetch(() => fetchWards());

  return (
    <Section>
      <SectionHeading title={t("wards.heading")} />

      {error && <ErrorState />}
      {loading && <LoadingSpinner />}

      {!loading && !error && (
        <div className="grid gap-5 sm:grid-cols-3 lg:grid-cols-4">
          {(data?.data ?? []).map((ward) => (
            <Link key={ward._id} to={`/community/wards/${ward._id}`}>
              <Card className="flex h-full flex-col items-start gap-3 transition-shadow hover:shadow-md">
                <div className="flex h-11 w-11 items-center justify-center rounded-full bg-forest-50 text-forest-600">
                  <LayoutGrid size={20} />
                </div>
                <h4 className="font-semibold text-forest-900">
                  {t("wards.wardLabel", { number: ward.number })}
                </h4>
                {ward.name && <p className="text-sm text-slate-500">{ward.name}</p>}
                <span className="mt-auto flex items-center gap-1 text-sm font-medium text-forest-700">
                  {t("wards.overview")}
                  <ArrowRight size={14} />
                </span>
              </Card>
            </Link>
          ))}
        </div>
      )}
    </Section>
  );
};

export default Wards;
