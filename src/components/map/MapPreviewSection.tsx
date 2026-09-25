import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { Map as MapIcon, ArrowRight } from "lucide-react";
import { Section, SectionHeading } from "@/components/common/Layout";
import Button from "@/components/common/Button";

const MapPreviewSection = () => {
  const { t } = useTranslation("home");

  return (
    <Section tint="sand">
      <div className="grid items-center gap-10 sm:grid-cols-2">
        <div>
          <SectionHeading title={t("mapPreview.heading")} subtitle={t("mapPreview.body")} />
          <Link to="/community/map">
            <Button>
              {t("mapPreview.cta")}
              <ArrowRight size={16} />
            </Button>
          </Link>
        </div>
        <Link
          to="/community/map"
          className="flex aspect-video items-center justify-center rounded-2xl border border-forest-200 bg-white shadow-sm transition-transform hover:scale-[1.01]"
        >
          <div className="flex flex-col items-center gap-3 text-forest-500">
            <MapIcon size={48} strokeWidth={1.5} />
            <span className="text-sm font-medium">{t("mapPreview.cta")}</span>
          </div>
        </Link>
      </div>
    </Section>
  );
};

export default MapPreviewSection;
