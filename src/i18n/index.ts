import i18n from "i18next";
import { initReactI18next } from "react-i18next";

import bnCommon from "@/locales/bn/common.json";
import bnHome from "@/locales/bn/home.json";
import bnAbout from "@/locales/bn/about.json";
import bnIssues from "@/locales/bn/issues.json";
import bnMisc from "@/locales/bn/misc.json";

import enCommon from "@/locales/en/common.json";
import enHome from "@/locales/en/home.json";
import enAbout from "@/locales/en/about.json";
import enIssues from "@/locales/en/issues.json";
import enMisc from "@/locales/en/misc.json";

export const LANGUAGE_STORAGE_KEY = "kanchana_language";

const savedLanguage =
  typeof window !== "undefined" ? window.localStorage.getItem(LANGUAGE_STORAGE_KEY) : null;

i18n.use(initReactI18next).init({
  resources: {
    bn: {
      common: bnCommon,
      home: bnHome,
      about: bnAbout,
      issues: bnIssues,
      misc: bnMisc,
    },
    en: {
      common: enCommon,
      home: enHome,
      about: enAbout,
      issues: enIssues,
      misc: enMisc,
    },
  },
  lng: savedLanguage ?? "bn",
  fallbackLng: "bn",
  defaultNS: "common",
  ns: ["common", "home", "about", "issues", "misc"],
  interpolation: {
    escapeValue: false,
  },
});

export default i18n;
