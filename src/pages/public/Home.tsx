import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import {
  ShieldOff,
  HeartPulse,
  GraduationCap,
  Trophy,
  Landmark,
  MapPin,
  ArrowRight,
} from "lucide-react";
import Button from "@/components/common/Button";
import { Card } from "@/components/common/Card";
import { Section, SectionHeading, Container } from "@/components/common/Layout";
import MapPreviewSection from "@/components/map/MapPreviewSection";
import HomeIssuesPreview from "@/components/issues/HomeIssuesPreview";
import HomeProjectsPreview from "@/components/projects/HomeProjectsPreview";
import HomeActivitiesPreview from "@/components/activities/HomeActivitiesPreview";
import HomeStatsPreview from "@/components/dashboard/HomeStatsPreview";

const FOCUS_ICONS = [ShieldOff, HeartPulse, GraduationCap, Trophy, Landmark];

const Home = () => {
  const { t } = useTranslation(["home", "common"]);
  const focusItems = t("focusAreas.items", { ns: "home", returnObjects: true }) as {
    title: string;
    subtitle: string;
  }[];
  const steps = t("model.steps", { ns: "home", returnObjects: true }) as {
    key: string;
    title: string;
    desc: string;
  }[];

  return (
    <>
      {/* Hero */}
      <section className="relative overflow-hidden bg-forest-900">
        <div
          aria-hidden
          className="absolute inset-0 opacity-[0.15]"
          style={{
            backgroundImage:
              "radial-gradient(circle at 20% 20%, #ffffff 1px, transparent 1px), radial-gradient(circle at 60% 70%, #ffffff 1px, transparent 1px)",
            backgroundSize: "48px 48px",
          }}
        />
        <Container className="relative flex flex-col items-start gap-6 py-24 sm:py-32">
          <span className="inline-flex items-center gap-2 rounded-full bg-forest-800 px-4 py-1.5 text-sm font-medium text-forest-200">
            <MapPin size={14} />
            {t("org.location", { ns: "common" })}
          </span>
          <h1 className="max-w-2xl text-4xl font-extrabold leading-tight text-white sm:text-5xl lg:text-6xl">
            {t("hero.title", { ns: "home" })}
          </h1>
          <p className="max-w-xl text-lg text-forest-100 sm:text-xl">{t("hero.subtitle", { ns: "home" })}</p>
          <div className="flex flex-wrap gap-3 pt-2">
            <Link to="/about">
              <Button size="lg">{t("hero.ctaAbout", { ns: "home" })}</Button>
            </Link>
            <Link to="/community/map">
              <Button size="lg" variant="outline" className="border-forest-300 text-forest-50 hover:bg-forest-800">
                {t("hero.ctaMap", { ns: "home" })}
              </Button>
            </Link>
          </div>
        </Container>
      </section>

      {/* About */}
      <Section>
        <SectionHeading title={t("about.heading", { ns: "home" })} />
        <div className="grid gap-6 text-lg leading-relaxed text-slate-600 sm:grid-cols-3">
          <p>{t("about.body1", { ns: "home" })}</p>
          <p>{t("about.body2", { ns: "home" })}</p>
          <p>{t("about.body3", { ns: "home" })}</p>
        </div>
      </Section>

      {/* Vision & Mission */}
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

      {/* Focus Areas */}
      <Section>
        <SectionHeading title={t("focusAreas.heading", { ns: "home" })} subtitle={t("focusAreas.subheading", { ns: "home" })} />
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-5">
          {focusItems.map((item, i) => {
            const Icon = FOCUS_ICONS[i] ?? Landmark;
            return (
              <Card key={item.title} className="text-center">
                <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-forest-50 text-forest-600">
                  <Icon size={22} />
                </div>
                <h4 className="font-semibold text-forest-900">{item.title}</h4>
                <p className="mt-1 text-sm text-slate-500">{item.subtitle}</p>
              </Card>
            );
          })}
        </div>
      </Section>

      {/* Community model - IDENTIFY -> MONITOR (genuine sequence) */}
      <Section tint="forest">
        <SectionHeading title={t("model.heading", { ns: "home" })} subtitle={t("model.subheading", { ns: "home" })} />
        <div className="grid gap-4 sm:grid-cols-5">
          {steps.map((step, i) => (
            <div key={step.key} className="relative rounded-2xl bg-forest-800 p-5">
              <span className="text-3xl font-extrabold text-forest-600">{i + 1}</span>
              <h4 className="mt-2 font-semibold text-white">{step.title}</h4>
              <p className="mt-1 text-sm text-forest-200">{step.desc}</p>
              {i < steps.length - 1 && (
                <ArrowRight
                  className="absolute -right-3 top-1/2 hidden -translate-y-1/2 text-forest-500 sm:block"
                  size={18}
                />
              )}
            </div>
          ))}
        </div>
      </Section>

      <MapPreviewSection />
      <HomeIssuesPreview />
      <HomeProjectsPreview />
      <HomeActivitiesPreview />
      <HomeStatsPreview />

      {/* Volunteer + Partnership CTAs */}
      <Section>
        <div className="grid gap-6 sm:grid-cols-2">
          <Card className="bg-forest-600 text-white">
            <h3 className="text-2xl font-bold">{t("volunteerCta.heading", { ns: "home" })}</h3>
            <p className="mt-2 text-forest-100">{t("volunteerCta.body", { ns: "home" })}</p>
            <Link to="/volunteer" className="mt-5 inline-block">
              <Button variant="secondary" className="bg-white text-forest-700 hover:bg-forest-50">
                {t("volunteerCta.cta", { ns: "home" })}
              </Button>
            </Link>
          </Card>
          <Card className="bg-river-600 text-white">
            <h3 className="text-2xl font-bold">{t("partnershipCta.heading", { ns: "home" })}</h3>
            <Link to="/contact" className="mt-5 inline-block">
              <Button variant="secondary" className="bg-white text-river-700 hover:bg-river-50">
                {t("partnershipCta.cta", { ns: "home" })}
              </Button>
            </Link>
          </Card>
        </div>
      </Section>
    </>
  );
};

export default Home;
