import { useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useTranslation } from "react-i18next";
import { CheckCircle2 } from "lucide-react";
import { Section, SectionHeading } from "@/components/common/Layout";
import { Card } from "@/components/common/Card";
import { Input, Textarea, Select, FieldWrapper } from "@/components/common/FormFields";
import Button from "@/components/common/Button";
import { volunteerSchema, type VolunteerFormValues } from "@/schemas/volunteerSchema";
import { createVolunteer } from "@/services/resourceServices";

const WARD_NUMBERS = Array.from({ length: 9 }, (_, i) => i + 1);
const INTEREST_KEYS = [
  "health",
  "education",
  "youth",
  "sports",
  "environment",
  "social",
  "mapping",
  "digital",
  "media",
];

const Volunteer = () => {
  const { t } = useTranslation("misc");
  const [submitted, setSubmitted] = useState(false);
  const [submitError, setSubmitError] = useState(false);

  const {
    register,
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<VolunteerFormValues>({
    resolver: zodResolver(volunteerSchema),
    defaultValues: { interests: [] },
  });

  const onSubmit = async (values: VolunteerFormValues) => {
    setSubmitError(false);
    try {
      await createVolunteer({ ...values, email: values.email || undefined });
      setSubmitted(true);
    } catch {
      setSubmitError(true);
    }
  };

  if (submitted) {
    return (
      <Section>
        <Card className="mx-auto max-w-lg text-center">
          <CheckCircle2 className="mx-auto mb-4 text-forest-600" size={48} />
          <p className="text-lg text-slate-700">{t("volunteer.successMessage")}</p>
        </Card>
      </Section>
    );
  }

  return (
    <Section>
      <SectionHeading title={t("volunteer.heading")} subtitle={t("volunteer.subheading")} />
      <Card className="mx-auto max-w-2xl">
        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-5">
          <div className="grid gap-5 sm:grid-cols-2">
            <FieldWrapper label={t("volunteer.form.name")} error={errors.name?.message} required>
              <Input {...register("name")} />
            </FieldWrapper>
            <FieldWrapper label={t("volunteer.form.mobile")} error={errors.mobile?.message} required>
              <Input {...register("mobile")} />
            </FieldWrapper>
          </div>

          <div className="grid gap-5 sm:grid-cols-2">
            <FieldWrapper label={t("volunteer.form.email")} error={errors.email?.message}>
              <Input type="email" {...register("email")} />
            </FieldWrapper>
            <FieldWrapper label={t("volunteer.form.ward")} error={errors.ward?.message} required>
              <Select {...register("ward")} defaultValue="">
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

          <FieldWrapper label={t("volunteer.form.profession")}>
            <Input {...register("profession")} />
          </FieldWrapper>

          <FieldWrapper label={t("volunteer.form.interests")} error={errors.interests?.message} required>
            <Controller
              control={control}
              name="interests"
              render={({ field }) => (
                <div className="flex flex-wrap gap-2">
                  {INTEREST_KEYS.map((key) => {
                    const checked = field.value?.includes(key);
                    return (
                      <button
                        type="button"
                        key={key}
                        onClick={() =>
                          field.onChange(
                            checked ? field.value.filter((v) => v !== key) : [...(field.value ?? []), key],
                          )
                        }
                        className={`rounded-full border px-3 py-1.5 text-sm font-medium transition-colors ${
                          checked
                            ? "border-forest-600 bg-forest-600 text-white"
                            : "border-slate-200 text-slate-600 hover:border-forest-300"
                        }`}
                      >
                        {t(`volunteer.interests.${key}`)}
                      </button>
                    );
                  })}
                </div>
              )}
            />
          </FieldWrapper>

          <FieldWrapper label={t("volunteer.form.skills")}>
            <Input {...register("skills")} />
          </FieldWrapper>

          <FieldWrapper label={t("volunteer.form.availability")}>
            <Input {...register("availability")} />
          </FieldWrapper>

          <FieldWrapper label={t("volunteer.form.message")}>
            <Textarea {...register("message")} />
          </FieldWrapper>

          {submitError && <p className="text-sm text-red-600">{t("common:states.error")}</p>}

          <Button type="submit" disabled={isSubmitting} className="self-start">
            {t("volunteer.form.submit")}
          </Button>
        </form>
      </Card>
    </Section>
  );
};

export default Volunteer;
