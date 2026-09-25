import { useState } from "react";
import { useTranslation } from "react-i18next";
import { Section, SectionHeading } from "@/components/common/Layout";
import { Card, Badge } from "@/components/common/Card";
import { Select } from "@/components/common/FormFields";
import { LoadingSpinner, ErrorState, EmptyState, DemoDataTag } from "@/components/common/States";
import { useFetch } from "@/hooks/useFetch";
import { fetchInstitutions } from "@/services/resourceServices";
import { INSTITUTION_CATEGORIES } from "@/utils/categories";

const WARD_NUMBERS = Array.from({ length: 9 }, (_, i) => i + 1);

const Institutions = () => {
  const { t } = useTranslation(["common", "misc"]);
  const [category, setCategory] = useState("");
  const [ward, setWard] = useState("");

  const { data, loading, error } = useFetch(
    () => fetchInstitutions({ category: category || undefined, ward: ward || undefined }),
    [category, ward],
  );

  return (
    <Section>
      <SectionHeading title={t("nav.institutions")} />

      <div className="mb-8 flex flex-col gap-3 sm:flex-row">
        <Select value={category} onChange={(e) => setCategory(e.target.value)} className="sm:w-56">
          <option value="">{t("actions.filter")}</option>
          {INSTITUTION_CATEGORIES.map((c) => (
            <option key={c} value={c}>
              {t(`misc:institutions.categories.${c}`)}
            </option>
          ))}
        </Select>
        <Select value={ward} onChange={(e) => setWard(e.target.value)} className="sm:w-48">
          <option value="">{t("actions.filter")}: {t("nav.wards")}</option>
          {WARD_NUMBERS.map((n) => (
            <option key={n} value={`Ward ${n}`}>
              Ward {n}
            </option>
          ))}
        </Select>
      </div>

      {error && <ErrorState />}
      {loading && <LoadingSpinner />}
      {!loading && !error && data?.data.length === 0 && <EmptyState />}

      {!loading && data && data.data.length > 0 && (
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {data.data.map((inst) => (
            <Card key={inst._id}>
              <div className="mb-2 flex flex-wrap items-center gap-2">
                <Badge>{t(`misc:institutions.categories.${inst.category}`)}</Badge>
                {inst.isDemoData && <DemoDataTag />}
              </div>
              <h4 className="font-semibold text-forest-900">{inst.name}</h4>
              <p className="mt-1 text-sm text-slate-500">{inst.ward}{inst.address ? ` · ${inst.address}` : ""}</p>
              {inst.description && <p className="mt-2 text-sm text-slate-600">{inst.description}</p>}
            </Card>
          ))}
        </div>
      )}
    </Section>
  );
};

export default Institutions;
