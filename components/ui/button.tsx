import Link from "next/link";
import type { AnchorHTMLAttributes, ButtonHTMLAttributes, ReactNode } from "react";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "group relative inline-flex items-center justify-center gap-2.5 rounded-[0.875rem] px-7 py-3.5 text-[0.9375rem] font-semibold tracking-tight transition-all duration-200 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        primary:
          "bg-accent text-white shadow-[0_4px_14px_rgba(5,150,105,0.25)] hover:bg-accent-hover hover:-translate-y-0.5 hover:shadow-[0_8px_24px_rgba(5,150,105,0.35)]",
        secondary:
          "border-[1.5px] border-border bg-background text-heading hover:bg-section-bg hover:border-subtle hover:-translate-y-0.5",
        outline:
          "border-[1.5px] border-accent text-accent hover:bg-accent hover:text-white hover:-translate-y-0.5",
        ghost:
          "text-body hover:bg-section-bg hover:text-heading",
        accent:
          "bg-accent text-white shadow-[0_4px_14px_rgba(5,150,105,0.25)] hover:bg-accent-hover hover:-translate-y-0.5 hover:shadow-[0_8px_24px_rgba(5,150,105,0.35)]",
      },
      size: {
        sm: "h-11 px-5 py-2.5 text-sm",
        md: "h-[3.25rem] px-7 py-3.5",
        lg: "h-14 px-9 py-4 text-base",
        xl: "h-16 px-11 py-5 text-lg",
      },
    },
    defaultVariants: {
      variant: "primary",
      size: "md",
    },
  },
);

type BaseProps = VariantProps<typeof buttonVariants> & {
  children: ReactNode;
  className?: string;
};

type ButtonProps = BaseProps & ButtonHTMLAttributes<HTMLButtonElement>;

type ButtonLinkProps = BaseProps &
  AnchorHTMLAttributes<HTMLAnchorElement> & {
    href: string;
  };

export function Button({ className, variant, size, children, ...props }: ButtonProps) {
  return (
    <button className={cn(buttonVariants({ variant, size }), className)} {...props}>
      {children}
    </button>
  );
}

export function ButtonLink({
  className,
  variant,
  size,
  children,
  href,
  ...props
}: ButtonLinkProps) {
  return (
    <Link
      className={cn(buttonVariants({ variant, size }), className)}
      href={href}
      {...props}
    >
      {children}
    </Link>
  );
}
