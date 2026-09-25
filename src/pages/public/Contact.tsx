import { useTranslation } from "react-i18next";
import { Facebook, Mail, MapPin, Phone } from "lucide-react";
import { Section, SectionHeading } from "@/components/common/Layout";
import { Card } from "@/components/common/Card";
import { Input, Textarea, FieldWrapper } from "@/components/common/FormFields";
import Button from "@/components/common/Button";

const Contact = () => {
  const { t } = useTranslation(["misc", "common"]);

  return (
    <Section>
      <SectionHeading title={t("contact.heading")} />
      <div className="grid gap-8 sm:grid-cols-2">
        <Card>
          <ul className="flex flex-col gap-5">
            <li className="flex items-start gap-3">
              <MapPin className="mt-0.5 shrink-0 text-forest-600" size={20} />
              <div>
                <p className="text-sm text-slate-500">{t("contact.address")}</p>
                <p className="font-medium text-slate-800">{t("org.location", { ns: "common" })}</p>
              </div>
            </li>
            <li className="flex items-start gap-3">
              <Mail className="mt-0.5 shrink-0 text-forest-600" size={20} />
              <div>
                <p className="text-sm text-slate-500">{t("contact.email")}</p>
                <a href="mailto:amaderkanchana@gmail.com" className="font-medium text-forest-700 hover:underline">
                  amaderkanchana@gmail.com
                </a>
              </div>
            </li>
            <li className="flex items-start gap-3">
              <Facebook className="mt-0.5 shrink-0 text-forest-600" size={20} />
              <div>
                <p className="text-sm text-slate-500">{t("contact.facebook")}</p>
                <a
                  href="https://facebook.com/amader.kanchana"
                  target="_blank"
                  rel="noreferrer"
                  className="font-medium text-forest-700 hover:underline"
                >
                  facebook.com/amader.kanchana
                </a>
              </div>
            </li>
            <li className="flex items-start gap-3">
              <Phone className="mt-0.5 shrink-0 text-slate-300" size={20} />
              <div>
                <p className="text-sm text-slate-500">{t("contact.phone")}</p>
                <p className="font-medium text-slate-400">— ({t("common:states.demoData")}) —</p>
              </div>
            </li>
          </ul>
        </Card>

        <Card>
          <form className="flex flex-col gap-5" onSubmit={(e) => e.preventDefault()}>
            <FieldWrapper label={t("contact.form.name")} required>
              <Input required />
            </FieldWrapper>
            <FieldWrapper label={t("contact.form.email")} required>
              <Input type="email" required />
            </FieldWrapper>
            <FieldWrapper label={t("contact.form.message")} required>
              <Textarea required />
            </FieldWrapper>
            <Button type="submit" className="self-start">
              {t("contact.form.submit")}
            </Button>
          </form>
        </Card>
      </div>
    </Section>
  );
};

export default Contact;
