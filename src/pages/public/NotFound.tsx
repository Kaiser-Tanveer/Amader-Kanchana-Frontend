import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { Home } from "lucide-react";
import { Section } from "@/components/common/Layout";
import Button from "@/components/common/Button";

const NotFound = () => {
  const { t } = useTranslation("common");

  return (
    <Section>
      <div className="flex flex-col items-center gap-4 py-16 text-center">
        <p className="text-6xl font-extrabold text-forest-200">404</p>
        <h1 className="text-2xl font-bold text-forest-900">{t("states.notFound")}</h1>
        <Link to="/">
          <Button>
            <Home size={16} />
            {t("nav.home")}
          </Button>
        </Link>
      </div>
    </Section>
  );
};

export default NotFound;
