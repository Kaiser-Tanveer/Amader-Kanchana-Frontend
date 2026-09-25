import { useTranslation } from "react-i18next";
import { CheckCircle2 } from "lucide-react";
import { Section, SectionHeading } from "@/components/common/Layout";
import { Card } from "@/components/common/Card";

const About = () => {
  const { t } = useTranslation(["about", "home"]);
  const coreValues = t("coreValues", { ns: "about", returnObjects: true }) as string[];
  const priorityPrograms = t("priorityPrograms", { ns: "about", returnObjects: true }) as string[];

  return (
    <>
      <Section>
        <SectionHeading title={t("title", { ns: "about" })} />
        <p className="max-w-3xl text-lg leading-relaxed text-slate-600">{t("intro", { ns: "about" })}</p>
      </Section>

      <Section tint="sand">
        <div className="grid gap-6 sm:grid-cols-2">
          <Card className="border-l-4 border-l-forest-600">
            <h3 className="text-xl font-bold text-forest-800">{t("vision.heading", { ns: "home" })}</h3>
            <p className="mt-3 text-slate-600">{t("vision.body", { ns: "home" })}</p>
          </Card>
          <Card className="border-l-4 border-l-river-600">
            <h3 className="text-xl font-bold text-river-800">{t("mission.heading", { ns: "home" })}</h3>
            <p className="mt-3 text-slate-600">{t("mission.body", { ns: "home" })}</p>
          </Card>
        </div>
      </Section>

      <Section>
        <SectionHeading title={t("coreValuesHeading", { ns: "about" })} />
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {coreValues.map((value) => (
            <div key={value} className="flex items-center gap-3 rounded-xl bg-forest-50 px-4 py-3">
              <CheckCircle2 className="shrink-0 text-forest-600" size={20} />
              <span className="text-slate-700">{value}</span>
            </div>
          ))}
        </div>
      </Section>

      <Section tint="sand">
        <div className="grid gap-8 sm:grid-cols-2">
          <div>
            <h3 className="text-xl font-bold text-forest-900">{t("approachHeading", { ns: "about" })}</h3>
            <p className="mt-3 text-slate-600">{t("approachBody", { ns: "about" })}</p>
          </div>
          <div>
            <h3 className="text-xl font-bold text-forest-900">{t("futureDirectionHeading", { ns: "about" })}</h3>
            <p className="mt-3 text-slate-600">{t("futureDirectionBody", { ns: "about" })}</p>
          </div>
        </div>
      </Section>

      <Section>
        <SectionHeading title={t("priorityProgramsHeading", { ns: "about" })} />
        <ol className="grid gap-3 sm:grid-cols-2">
          {priorityPrograms.map((program, i) => (
            <li key={program} className="flex items-start gap-3 rounded-xl border border-slate-100 px-4 py-3">
              <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-forest-600 text-sm font-bold text-white">
                {i + 1}
              </span>
              <span className="text-slate-700">{program}</span>
            </li>
          ))}
        </ol>
      </Section>
    </>
  );
};

export default About;
