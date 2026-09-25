import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useTranslation } from "react-i18next";
import { CheckCircle2 } from "lucide-react";
import { Section, SectionHeading } from "@/components/common/Layout";
import { Card } from "@/components/common/Card";
import { Input, Textarea, Select, FieldWrapper } from "@/components/common/FormFields";
import Button from "@/components/common/Button";
import { issueReportSchema, type IssueReportFormValues } from "@/schemas/issueSchema";
import { ISSUE_CATEGORIES } from "@/utils/categories";
import { createIssue } from "@/services/issuesService";

const WARD_NUMBERS = Array.from({ length: 9 }, (_, i) => i + 1);

const ReportProblem = () => {
  const { t } = useTranslation("issues");
  const [referenceNumber, setReferenceNumber] = useState<string | null>(null);
  const [submitError, setSubmitError] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<IssueReportFormValues>({ resolver: zodResolver(issueReportSchema) });

  const onSubmit = async (values: IssueReportFormValues) => {
    setSubmitError(false);
    try {
      const res = await createIssue({
        title: values.title,
        category: values.category,
        ward: values.ward,
        area: values.area,
        description: values.description,
        reporter: {
          name: values.reporterName || undefined,
          phone: values.reporterPhone || undefined,
          email: values.reporterEmail || undefined,
        },
      });
      setReferenceNumber(res.data.referenceNumber);
    } catch {
      setSubmitError(true);
    }
  };

  if (referenceNumber) {
    return (
      <Section>
        <Card className="mx-auto max-w-lg text-center">
          <CheckCircle2 className="mx-auto mb-4 text-forest-600" size={48} />
          <h2 className="text-xl font-bold text-forest-900">{t("reportPage.successTitle")}</h2>
          <p className="mt-3 text-slate-600">{t("reportPage.referenceLabel")}</p>
          <p className="mt-2 text-2xl font-mono font-bold text-forest-700">{referenceNumber}</p>
        </Card>
      </Section>
    );
  }

  return (
    <Section>
      <SectionHeading title={t("reportPage.title")} subtitle={t("reportPage.subtitle")} />
      <Card className="mx-auto max-w-2xl">
        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-5">
          <FieldWrapper label={t("reportPage.form.title")} htmlFor="title" error={errors.title?.message} required>
            <Input id="title" {...register("title")} />
          </FieldWrapper>

          <div className="grid gap-5 sm:grid-cols-2">
            <FieldWrapper label={t("reportPage.form.category")} htmlFor="category" error={errors.category?.message} required>
              <Select id="category" {...register("category")} defaultValue="">
                <option value="" disabled>
                  —
                </option>
                {ISSUE_CATEGORIES.map((c) => (
                  <option key={c.key} value={c.key}>
                    {t(c.translationKey)}
                  </option>
                ))}
              </Select>
            </FieldWrapper>

            <FieldWrapper label={t("reportPage.form.ward")} htmlFor="ward" error={errors.ward?.message} required>
              <Select id="ward" {...register("ward")} defaultValue="">
                <option value="" disabled>
                  —
                </option>
                {WARD_NUMBERS.map((n) => (
                  <option key={n} value={`Ward ${n}`}>
                    Ward {n}
                  </option>
                ))}
              </Select>
            </FieldWrapper>
          </div>

          <FieldWrapper label={t("reportPage.form.area")} htmlFor="area" error={errors.area?.message} required>
            <Input id="area" {...register("area")} />
          </FieldWrapper>

          <FieldWrapper
            label={t("reportPage.form.description")}
            htmlFor="description"
            error={errors.description?.message}
            required
          >
            <Textarea id="description" {...register("description")} />
          </FieldWrapper>

          <p className="rounded-lg bg-forest-50 px-4 py-3 text-sm text-forest-700">{t("reportPage.form.privacyNote")}</p>

          <div className="grid gap-5 sm:grid-cols-3">
            <FieldWrapper label={t("reportPage.form.reporterName")} htmlFor="reporterName">
              <Input id="reporterName" {...register("reporterName")} />
            </FieldWrapper>
            <FieldWrapper label={t("reportPage.form.reporterPhone")} htmlFor="reporterPhone">
              <Input id="reporterPhone" {...register("reporterPhone")} />
            </FieldWrapper>
            <FieldWrapper
              label={t("reportPage.form.reporterEmail")}
              htmlFor="reporterEmail"
              error={errors.reporterEmail?.message}
            >
              <Input id="reporterEmail" type="email" {...register("reporterEmail")} />
            </FieldWrapper>
          </div>

          {submitError && <p className="text-sm text-red-600">{t("common:states.error")}</p>}

          <Button type="submit" disabled={isSubmitting} className="self-start">
            {t("reportPage.form.submit")}
          </Button>
        </form>
      </Card>
    </Section>
  );
};

export default ReportProblem;
