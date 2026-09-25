import { useState } from "react";
import { NavLink, Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { Menu, X, Megaphone } from "lucide-react";
import { useAppDispatch, useAppSelector } from "@/hooks/useAppStore";
import { toggleLanguage } from "@/store/slices/languageSlice";
import Button from "@/components/common/Button";

const NAV_ITEMS: { key: string; to: string }[] = [
  { key: "nav.home", to: "/" },
  { key: "nav.about", to: "/about" },
  { key: "nav.community", to: "/community" },
  { key: "nav.issues", to: "/issues" },
  { key: "nav.projects", to: "/projects" },
  { key: "nav.activities", to: "/activities" },
  { key: "nav.gallery", to: "/gallery" },
  { key: "nav.contact", to: "/contact" },
];

const Header = () => {
  const { t } = useTranslation();
  const dispatch = useAppDispatch();
  const language = useAppSelector((state) => state.language.current);
  const [isOpen, setIsOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 border-b border-slate-100 bg-white/95 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3 sm:px-6 lg:px-8">
        <Link to="/" className="flex items-center gap-2 font-bold text-forest-800">
          <span className="flex h-9 w-9 items-center justify-center rounded-full bg-forest-600 text-sm text-white">
            আক
          </span>
          <span className="text-lg leading-tight">{t("org.name")}</span>
        </Link>

        <nav className="hidden items-center gap-1 lg:flex">
          {NAV_ITEMS.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.to === "/"}
              className={({ isActive }) =>
                `rounded-full px-3 py-2 text-sm font-medium transition-colors ${
                  isActive ? "bg-forest-50 text-forest-700" : "text-slate-600 hover:text-forest-700"
                }`
              }
            >
              {t(item.key)}
            </NavLink>
          ))}
        </nav>

        <div className="hidden items-center gap-2 lg:flex">
          <button
            onClick={() => dispatch(toggleLanguage())}
            className="rounded-full border border-slate-200 px-3 py-1.5 text-sm font-medium text-slate-600 hover:border-forest-300 hover:text-forest-700"
          >
            {language === "bn" ? t("language.en") : t("language.bn")}
          </button>
          <Link to="/report-problem">
            <Button size="sm">
              <Megaphone size={16} />
              {t("nav.reportProblem")}
            </Button>
          </Link>
        </div>

        <button
          className="rounded-lg p-2 text-slate-600 lg:hidden"
          onClick={() => setIsOpen((v) => !v)}
          aria-label="Toggle navigation menu"
        >
          {isOpen ? <X size={22} /> : <Menu size={22} />}
        </button>
      </div>

      {isOpen && (
        <div className="border-t border-slate-100 bg-white px-4 py-4 lg:hidden">
          <nav className="flex flex-col gap-1">
            {NAV_ITEMS.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                end={item.to === "/"}
                onClick={() => setIsOpen(false)}
                className={({ isActive }) =>
                  `rounded-lg px-3 py-2.5 text-sm font-medium ${
                    isActive ? "bg-forest-50 text-forest-700" : "text-slate-600"
                  }`
                }
              >
                {t(item.key)}
              </NavLink>
            ))}
          </nav>
          <div className="mt-4 flex items-center gap-2">
            <button
              onClick={() => dispatch(toggleLanguage())}
              className="rounded-full border border-slate-200 px-3 py-1.5 text-sm font-medium text-slate-600"
            >
              {language === "bn" ? t("language.en") : t("language.bn")}
            </button>
            <Link to="/report-problem" onClick={() => setIsOpen(false)} className="flex-1">
              <Button size="sm" className="w-full">
                {t("nav.reportProblem")}
              </Button>
            </Link>
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;
