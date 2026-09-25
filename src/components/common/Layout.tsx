import type { HTMLAttributes, PropsWithChildren } from "react";

export const Container = ({ className = "", children, ...props }: HTMLAttributes<HTMLDivElement>) => (
  <div className={`mx-auto w-full max-w-6xl px-4 sm:px-6 lg:px-8 ${className}`} {...props}>
    {children}
  </div>
);

interface SectionProps extends HTMLAttributes<HTMLElement> {
  tint?: "none" | "sand" | "forest";
}

export const Section = ({ tint = "none", className = "", children, ...props }: PropsWithChildren<SectionProps>) => {
  const tintClasses = {
    none: "",
    sand: "bg-sand-50",
    forest: "bg-forest-900 text-white",
  }[tint];

  return (
    <section className={`py-14 sm:py-20 ${tintClasses} ${className}`} {...props}>
      <Container>{children}</Container>
    </section>
  );
};

export const SectionHeading = ({
  eyebrow,
  title,
  subtitle,
  align = "left",
}: {
  eyebrow?: string;
  title: string;
  subtitle?: string;
  align?: "left" | "center";
}) => (
  <div className={`mb-10 max-w-2xl ${align === "center" ? "mx-auto text-center" : ""}`}>
    {eyebrow && <p className="mb-2 text-sm font-semibold text-forest-600">{eyebrow}</p>}
    <h2 className="text-3xl font-bold text-forest-900 sm:text-4xl">{title}</h2>
    {subtitle && <p className="mt-3 text-lg text-slate-600">{subtitle}</p>}
  </div>
);
