import { useTranslation } from "react-i18next";
import { Section, SectionHeading } from "@/components/common/Layout";

const Terms = () => {
  const { t } = useTranslation("common");

  return (
    <Section>
      <SectionHeading title={t("footer.terms")} />
      <div className="max-w-2xl space-y-4 leading-relaxed text-slate-600">
        <p>
          আমাদের কাঞ্চনা প্ল্যাটফর্ম ব্যবহারের মাধ্যমে আপনি সম্মত হচ্ছেন যে, এখানে প্রদত্ত তথ্য দায়িত্বশীলভাবে ও
          সরল বিশ্বাসে ব্যবহার করবেন এবং কমিউনিটির স্বার্থ বিরোধী কোনো কার্যকলাপে জড়িত হবেন না।
        </p>
        <p>
          By using the Our Kanchana platform, you agree to use the information provided here responsibly and in
          good faith, and not to engage in any activity that works against the interest of the community.
        </p>
      </div>
    </Section>
  );
};

export default Terms;
