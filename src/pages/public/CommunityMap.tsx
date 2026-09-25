import { useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { Search } from "lucide-react";
import { Section, SectionHeading } from "@/components/common/Layout";
import { Input, Select } from "@/components/common/FormFields";
import { LoadingSpinner, ErrorState } from "@/components/common/States";
import KanchanaMap from "@/components/map/KanchanaMap";
import type { MapMarkerData, MapMarkerType } from "@/components/map/mapMarker";
import { useFetch } from "@/hooks/useFetch";
import { fetchIssues } from "@/services/issuesService";
import { fetchInstitutions, fetchProjects } from "@/services/resourceServices";
import { ISSUE_CATEGORIES } from "@/utils/categories";

const WARD_NUMBERS = Array.from({ length: 9 }, (_, i) => i + 1);

const CommunityMap = () => {
  const { t } = useTranslation(["common", "issues"]);
  const [search, setSearch] = useState("");
  const [ward, setWard] = useState("");
  const [category, setCategory] = useState("");
  const [visibleTypes, setVisibleTypes] = useState<Record<MapMarkerType, boolean>>({
    issue: true,
    institution: true,
    project: true,
    facility: true,
  });

  const issuesQuery = useFetch(() => fetchIssues({ ward: ward || undefined, category: category || undefined }), [ward, category]);
  const institutionsQuery = useFetch(() => fetchInstitutions({ ward: ward || undefined }), [ward]);
  const projectsQuery = useFetch(() => fetchProjects({ ward: ward || undefined }), [ward]);

  const loading = issuesQuery.loading || institutionsQuery.loading || projectsQuery.loading;
  const error = issuesQuery.error || institutionsQuery.error || projectsQuery.error;

  const markers: MapMarkerData[] = useMemo(() => {
    const list: MapMarkerData[] = [];

    if (visibleTypes.issue) {
      (issuesQuery.data?.data ?? [])
        .filter((i) => i.location)
        .forEach((i) =>
          list.push({
            id: i._id,
            type: "issue",
            latitude: i.location!.latitude,
            longitude: i.location!.longitude,
            title: i.title,
            subtitle: `${i.ward} · ${i.area}`,
            categoryKey: i.category,
            href: `/issues/${i._id}`,
          }),
        );
    }

    if (visibleTypes.institution) {
      (institutionsQuery.data?.data ?? [])
        .filter((inst) => inst.location)
        .forEach((inst) =>
          list.push({
            id: inst._id,
            type: "institution",
            latitude: inst.location!.latitude,
            longitude: inst.location!.longitude,
            title: inst.name,
            subtitle: inst.category,
          }),
        );
    }

    if (visibleTypes.project) {
      (projectsQuery.data?.data ?? [])
        .filter((p) => p.location)
        .forEach((p) =>
          list.push({
            id: p._id,
            type: "project",
            latitude: p.location!.latitude,
            longitude: p.location!.longitude,
            title: p.title,
            subtitle: p.status,
            href: `/projects/${p._id}`,
          }),
        );
    }

    return search ? list.filter((m) => m.title.toLowerCase().includes(search.toLowerCase())) : list;
  }, [issuesQuery.data, institutionsQuery.data, projectsQuery.data, visibleTypes, search]);

  const toggleType = (type: MapMarkerType) => setVisibleTypes((prev) => ({ ...prev, [type]: !prev[type] }));

  return (
    <Section>
      <SectionHeading title={t("nav.communityMap")} />

      <div className="mb-5 flex flex-col gap-3 sm:flex-row">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
          <Input className="pl-10" placeholder={t("actions.search")} value={search} onChange={(e) => setSearch(e.target.value)} />
        </div>
        <Select value={ward} onChange={(e) => setWard(e.target.value)} className="sm:w-48">
          <option value="">{t("actions.filter")}: {t("nav.wards")}</option>
          {WARD_NUMBERS.map((n) => (
            <option key={n} value={`Ward ${n}`}>
              Ward {n}
            </option>
          ))}
        </Select>
        <Select value={category} onChange={(e) => setCategory(e.target.value)} className="sm:w-56">
          <option value="">{t("actions.filter")}: {t("issues:reportPage.form.category")}</option>
          {ISSUE_CATEGORIES.map((c) => (
            <option key={c.key} value={c.key}>
              {t(c.translationKey)}
            </option>
          ))}
        </Select>
      </div>

      <div className="mb-5 flex flex-wrap gap-2">
        {(["issue", "institution", "project"] as MapMarkerType[]).map((type) => (
          <button
            key={type}
            onClick={() => toggleType(type)}
            className={`rounded-full border px-3 py-1.5 text-sm font-medium transition-colors ${
              visibleTypes[type] ? "border-forest-600 bg-forest-50 text-forest-700" : "border-slate-200 text-slate-400"
            }`}
          >
            {type === "issue" ? t("nav.issues") : type === "institution" ? t("nav.institutions") : t("nav.projects")}
          </button>
        ))}
      </div>

      {error && <ErrorState />}
      {loading && <LoadingSpinner />}
      {!loading && !error && <KanchanaMap markers={markers} />}
    </Section>
  );
};

export default CommunityMap;
