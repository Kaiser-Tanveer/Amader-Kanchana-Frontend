import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { Facebook, Mail } from "lucide-react";
import { Container } from "@/components/common/Layout";

const Footer = () => {
  const { t } = useTranslation();
  const year = new Date().getFullYear();

  const quickLinks = [
    { key: "nav.about", to: "/about" },
    { key: "nav.community", to: "/community" },
    { key: "nav.issues", to: "/issues" },
    { key: "nav.projects", to: "/projects" },
    { key: "nav.activities", to: "/activities" },
    { key: "nav.volunteer", to: "/volunteer" },
    { key: "nav.contact", to: "/contact" },
  ];

  return (
    <footer className="bg-forest-900 text-forest-50">
      <Container className="grid grid-cols-1 gap-10 py-14 sm:grid-cols-3">
        <div>
          <p className="text-xl font-bold text-white">{t("org.name")}</p>
          <p className="mt-2 text-forest-200">{t("org.tagline")}</p>
          <p className="mt-4 text-sm text-forest-300">{t("org.location")}</p>
        </div>

        <div>
          <p className="mb-3 font-semibold text-white">{t("footer.quickLinks")}</p>
          <ul className="space-y-2 text-sm text-forest-200">
            {quickLinks.map((link) => (
              <li key={link.to}>
                <Link to={link.to} className="hover:text-white">
                  {t(link.key)}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <p className="mb-3 font-semibold text-white">{t("footer.followUs")}</p>
          <div className="flex gap-3">
            <a
              href="https://facebook.com/amader.kanchana"
              target="_blank"
              rel="noreferrer"
              className="flex h-10 w-10 items-center justify-center rounded-full bg-forest-800 hover:bg-forest-700"
              aria-label="Facebook"
            >
              <Facebook size={18} />
            </a>
            <a
              href="mailto:amaderkanchana@gmail.com"
              className="flex h-10 w-10 items-center justify-center rounded-full bg-forest-800 hover:bg-forest-700"
              aria-label="Email"
            >
              <Mail size={18} />
            </a>
          </div>
        </div>
      </Container>

      <div className="border-t border-forest-800">
        <Container className="flex flex-col items-center justify-between gap-3 py-5 text-sm text-forest-300 sm:flex-row">
          <p>{t("footer.copyright", { year })}</p>
          <div className="flex gap-4">
            <Link to="/privacy" className="hover:text-white">
              {t("footer.privacy")}
            </Link>
            <Link to="/terms" className="hover:text-white">
              {t("footer.terms")}
            </Link>
          </div>
        </Container>
      </div>
    </footer>
  );
};

export default Footer;
