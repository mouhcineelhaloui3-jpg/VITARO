import Image from "next/image";
import Link from "next/link";

type VitaroLogoProps = {
  href?: string;
  className?: string;
  variant?: "full" | "mark";
  priority?: boolean;
};

export function VitaroLogo({
  href = "/",
  className = "",
  variant = "full",
  priority = false,
}: VitaroLogoProps) {
  const src = variant === "mark" ? "/logo-mark.svg" : "/logo.svg";
  const width = variant === "mark" ? 44 : 196;
  const height = 44;

  const image = (
    <Image
      src={src}
      alt="VITARO"
      width={width}
      height={height}
      priority={priority}
      className={`h-11 w-auto ${className}`}
    />
  );

  if (!href) return image;

  return (
    <Link href={href} aria-label="VITARO — الصفحة الرئيسية" className="inline-flex shrink-0 items-center">
      {image}
    </Link>
  );
}
