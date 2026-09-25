import { useParams } from "react-router-dom";
import { Calendar, MapPin, Users, Target } from "lucide-react";
import { Section } from "@/components/common/Layout";
import { Card, Badge } from "@/components/common/Card";
import { LoadingSpinner, ErrorState, DemoDataTag } from "@/components/common/States";
import { useFetch } from "@/hooks/useFetch";
import { fetchProjectById } from "@/services/resourceServices";
import type { ProjectStatus } from "@/types";

const statusColor: Record<ProjectStatus, "slate" | "amber" | "forest" | "red"> = {
  PLANNED: "slate",
  ONGOING: "amber",
  COMPLETED: "forest",
  CANCELLED: "red",
};

const ProjectDetail = () => {
  const { id } = useParams<{ id: string }>();
  const { data, loading, error } = useFetch(() => fetchProjectById(id as string), [id]);

  if (loading) return <LoadingSpinner />;
  if (error || !data) return <ErrorState />;

  const project = data.data;

  return (
    <Section>
      <div className="mx-auto max-w-2xl">
        <div className="mb-4 flex flex-wrap items-center gap-2">
          <Badge color={statusColor[project.status]}>{project.status}</Badge>
          {project.isDemoData && <DemoDataTag />}
        </div>
        <h1 className="text-3xl font-bold text-forest-900">{project.title}</h1>

        <div className="mt-4 flex flex-wrap gap-4 text-sm text-slate-500">
          {project.ward && (
            <span className="flex items-center gap-1.5">
              <MapPin size={14} /> {project.ward}
            </span>
          )}
          {project.startDate && (
            <span className="flex items-center gap-1.5">
              <Calendar size={14} /> {new Date(project.startDate).toLocaleDateString()}
              {project.endDate ? ` – ${new Date(project.endDate).toLocaleDateString()}` : ""}
            </span>
          )}
          {typeof project.beneficiaries === "number" && (
            <span className="flex items-center gap-1.5">
              <Users size={14} /> {project.beneficiaries}
            </span>
          )}
        </div>

        <Card className="mt-6">
          <p className="leading-relaxed text-slate-700">{project.description}</p>
        </Card>

        {project.target && (
          <Card className="mt-4">
            <p className="mb-1 flex items-center gap-1.5 text-sm font-semibold text-forest-700">
              <Target size={14} /> Target
            </p>
            <p className="text-slate-600">{project.target}</p>
          </Card>
        )}

        {project.outcomes && (
          <Card className="mt-4">
            <p className="mb-1 text-sm font-semibold text-forest-700">Outcomes</p>
            <p className="text-slate-600">{project.outcomes}</p>
          </Card>
        )}
      </div>
    </Section>
  );
};

export default ProjectDetail;
