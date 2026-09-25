import { useState } from "react";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { Section, SectionHeading } from "@/components/common/Layout";
import { Card, Badge } from "@/components/common/Card";
import { Select } from "@/components/common/FormFields";
import { LoadingSpinner, ErrorState, EmptyState, DemoDataTag } from "@/components/common/States";
import { useFetch } from "@/hooks/useFetch";
import { fetchProjects } from "@/services/resourceServices";
import type { ProjectStatus } from "@/types";

const PROJECT_STATUSES: ProjectStatus[] = ["PLANNED", "ONGOING", "COMPLETED", "CANCELLED"];
const statusColor: Record<ProjectStatus, "slate" | "amber" | "forest" | "red"> = {
  PLANNED: "slate",
  ONGOING: "amber",
  COMPLETED: "forest",
  CANCELLED: "red",
};

const Projects = () => {
  const { t } = useTranslation("common");
  const [status, setStatus] = useState<ProjectStatus | "">("");

  const { data, loading, error } = useFetch(() => fetchProjects({ status: status || undefined }), [status]);

  return (
    <Section>
      <SectionHeading title={t("nav.projects")} />

      <div className="mb-8">
        <Select value={status} onChange={(e) => setStatus(e.target.value as ProjectStatus)} className="sm:w-56">
          <option value="">{t("actions.filter")}</option>
          {PROJECT_STATUSES.map((s) => (
            <option key={s} value={s}>
              {s}
            </option>
          ))}
        </Select>
      </div>

      {error && <ErrorState />}
      {loading && <LoadingSpinner />}
      {!loading && !error && data?.data.length === 0 && <EmptyState />}

      {!loading && data && data.data.length > 0 && (
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {data.data.map((project) => (
            <Link key={project._id} to={`/projects/${project._id}`}>
              <Card className="h-full transition-shadow hover:shadow-md">
                <div className="mb-3 flex flex-wrap items-center gap-2">
                  <Badge color={statusColor[project.status]}>{project.status}</Badge>
                  {project.isDemoData && <DemoDataTag />}
                </div>
                <h4 className="font-semibold text-forest-900">{project.title}</h4>
                <p className="mt-1 line-clamp-2 text-sm text-slate-500">{project.description}</p>
              </Card>
            </Link>
          ))}
        </div>
      )}
    </Section>
  );
};

export default Projects;
