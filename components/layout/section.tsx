import type { ReactNode } from "react";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

type SectionProps = {
  id?: string;
  eyebrow?: string;
  title?: string;
  description?: string;
  children: ReactNode;
  className?: string;
  headerClassName?: string;
  background?: "white" | "gray";
};

export function Section({
  id,
  eyebrow,
  title,
  description,
  children,
  className,
  headerClassName,
  background = "white",
}: SectionProps) {
  return (
    <section
      id={id}
      className={cn(
        "px-4 py-20 sm:px-6 lg:px-8 lg:py-32",
        background === "gray" && "bg-section-bg",
        background === "white" && "bg-background",
        className,
      )}
    >
      <div className="mx-auto max-w-7xl">
        {(eyebrow || title || description) && (
          <div className={cn("mx-auto mb-16 max-w-3xl text-center", headerClassName)}>
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
