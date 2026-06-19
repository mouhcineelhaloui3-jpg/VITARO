import type { ReactNode } from "react";
import { Badge } from "@/components/ui/badge";
import {
  resolveSectionSpacing,
  type SectionSpacingPreset,
} from "@/lib/cms/layout-spacing";
import { cn } from "@/lib/utils";

type SectionSpacingInput = SectionSpacingPreset | ReturnType<typeof resolveSectionSpacing>;

type SectionProps = {
  id?: string;
  eyebrow?: string;
  title?: string;
  description?: string;
  children: ReactNode;
  className?: string;
  headerClassName?: string;
  background?: "white" | "gray";
  spacing?: SectionSpacingInput;
};

function spacingClasses(spacing?: SectionSpacingInput) {
  if (!spacing) return resolveSectionSpacing("normal");
  if (typeof spacing === "string") return resolveSectionSpacing(spacing);
  return spacing;
}

export function Section({
  id,
  eyebrow,
  title,
  description,
  children,
  className,
  headerClassName,
  background = "white",
  spacing,
}: SectionProps) {
  const resolved = spacingClasses(spacing);

  return (
    <section
      id={id}
      className={cn(
        "px-4 sm:px-6 lg:px-8",
        resolved.section,
        background === "gray" && "bg-section-bg",
        background === "white" && "bg-background",
        className,
      )}
    >
      <div className="mx-auto max-w-7xl">
        {(eyebrow || title || description) && (
          <div className={cn("mx-auto max-w-3xl text-center", resolved.header, headerClassName)}>
            {eyebrow && <Badge variant="success">{eyebrow}</Badge>}
            {title && (
              <h2 className="mt-6 text-[2.5rem] font-bold leading-[1.2] tracking-[-0.03em] text-heading sm:text-5xl">
                {title}
              </h2>
            )}
            {description && (
              <p className="mt-6 text-[1.125rem] leading-[1.75] text-body">
                {description}
              </p>
            )}
          </div>
        )}
        {children}
      </div>
    </section>
  );
}
