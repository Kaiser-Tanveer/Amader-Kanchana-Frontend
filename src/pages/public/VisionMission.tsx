import { useTranslation } from "react-i18next";
import { Section, SectionHeading } from "@/components/common/Layout";
import { Card } from "@/components/common/Card";

const VisionMission = () => {
  const { t } = useTranslation("home");

  return (
    <Section>
      <SectionHeading title={t("common:nav.visionMission")} />
      <div className="grid gap-6 sm:grid-cols-2">
        <Card className="border-l-4 border-l-forest-600">
          <h3 className="text-xl font-bold text-forest-800">{t("vision.heading")}</h3>
          <p className="mt-3 text-lg leading-relaxed text-slate-600">{t("vision.body")}</p>
        </Card>
        <Card className="border-l-4 border-l-river-600">
          <h3 className="text-xl font-bold text-river-800">{t("mission.heading")}</h3>
          <p className="mt-3 text-lg leading-relaxed text-slate-600">{t("mission.body")}</p>
        </Card>
      </div>
    </Section>
  );
};

export default VisionMission;
