import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { Map, LayoutGrid, Landmark, ArrowRight } from "lucide-react";
import { Section, SectionHeading } from "@/components/common/Layout";
import { Card } from "@/components/common/Card";

const Community = () => {
  const { t } = useTranslation(["common", "home"]);

  const links = [
    { to: "/community/map", icon: Map, label: t("nav.communityMap") },
    { to: "/community/wards", icon: LayoutGrid, label: t("nav.wards") },
    { to: "/community/institutions", icon: Landmark, label: t("nav.institutions") },
  ];

  return (
    <Section>
      <SectionHeading title={t("nav.community")} subtitle={t("mapPreview.body", { ns: "home" })} />
      <div className="grid gap-5 sm:grid-cols-3">
        {links.map((link) => {
          const Icon = link.icon;
          return (
            <Link key={link.to} to={link.to}>
              <Card className="flex h-full flex-col items-start gap-3 transition-shadow hover:shadow-md">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-forest-50 text-forest-600">
                  <Icon size={22} />
                </div>
                <h4 className="font-semibold text-forest-900">{link.label}</h4>
                <span className="mt-auto flex items-center gap-1 text-sm font-medium text-forest-700">
                  {t("actions.viewAll")}
                  <ArrowRight size={14} />
                </span>
              </Card>
            </Link>
          );
        })}
      </div>
    </Section>
  );
};

export default Community;
