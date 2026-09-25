import { useTranslation } from "react-i18next";
import { Section, SectionHeading } from "@/components/common/Layout";

const Privacy = () => {
  const { t } = useTranslation(["common", "misc"]);

  return (
    <Section>
      <SectionHeading title={t("footer.privacy")} />
      <div className="max-w-2xl space-y-4 leading-relaxed text-slate-600">
        <p>{t("misc:privacyNotice")}</p>
        <p>
          সমস্যা রিপোর্ট (Report a Problem) ও স্বেচ্ছাসেবক (Volunteer) ফর্মে প্রদত্ত নাম, ফোন নম্বর ও ইমেইল
          জনসমক্ষে প্রদর্শিত হয় না। এই তথ্য কেবল প্রতিবেদন যাচাই ও প্রয়োজনীয় যোগাযোগের জন্য ব্যবহৃত হয়।
        </p>
        <p>
          Data submitted through the problem-reporting and volunteer forms is used only for verification and
          necessary follow-up communication, and is never displayed publicly.
        </p>
      </div>
    </Section>
  );
};

export default Privacy;
