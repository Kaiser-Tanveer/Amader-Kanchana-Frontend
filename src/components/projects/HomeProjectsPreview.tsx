import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { ArrowRight } from "lucide-react";
import { Section, SectionHeading } from "@/components/common/Layout";
import { Card, Badge } from "@/components/common/Card";
import { LoadingSpinner, EmptyState, ErrorState, DemoDataTag } from "@/components/common/States";
import { fetchProjects } from "@/services/resourceServices";
import type { Project } from "@/types";

const HomeProjectsPreview = () => {
  const { t } = useTranslation("home");
  const [projects, setProjects] = useState<Project[] | null>(null);
  const [error, setError] = useState(false);

  useEffect(() => {
    fetchProjects()
      .then((res) => setProjects(res.data.slice(0, 3)))
      .catch(() => setError(true));
  }, []);

  return (
    <Section tint="sand">
      <div className="mb-6 flex items-center justify-between">
        <SectionHeading title={t("projectsSection.heading")} />
        <Link to="/projects" className="hidden items-center gap-1 text-sm font-semibold text-forest-700 sm:flex">
          {t("projectsSection.cta")}
          <ArrowRight size={16} />
        </Link>
      </div>

      {error && <ErrorState />}
      {!error && projects === null && <LoadingSpinner />}
      {!error && projects !== null && projects.length === 0 && <EmptyState />}

      {projects && projects.length > 0 && (
        <div className="grid gap-5 sm:grid-cols-3">
          {projects.map((project) => (
            <Link key={project._id} to={`/projects/${project._id}`}>
              <Card className="h-full transition-shadow hover:shadow-md">
                <div className="mb-3 flex flex-wrap items-center gap-2">
                  <Badge color="river">{project.status}</Badge>
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

export default HomeProjectsPreview;
