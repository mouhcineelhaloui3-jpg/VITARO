"use client";

import { useState } from "react";
import Image from "next/image";

import type { Product } from "@/types/commerce";
import { cn } from "@/lib/utils";

export function ProductGallery({ product }: { product: Product }) {
  const images = product.images.length ? product.images : ["/products/scale-main.png"];
  const [active, setActive] = useState(images[0]);

  return (
    <div className="space-y-4">
      <div className="relative aspect-square overflow-hidden rounded-[2rem] border border-zinc-200 bg-white dark:border-white/10 dark:bg-white/5">
        <Image
          src={active}
          alt={product.title}
          fill
          priority
          sizes="(max-width: 1024px) 100vw, 600px"
          className="object-contain p-2"
        />
      </div>
      <div className="grid grid-cols-4 gap-3 sm:grid-cols-5">
        {images.map((image, index) => (
          <button
            key={image}
            onClick={() => setActive(image)}
            aria-label={`صورة ${index + 1}`}
            className={cn(
              "relative aspect-square overflow-hidden rounded-2xl border bg-white transition dark:bg-white/5",
              active === image
                ? "border-emerald-500 ring-2 ring-emerald-500/30"
                : "border-zinc-200 hover:border-zinc-300 dark:border-white/10",
            )}
          >
            <Image
              src={image}
              alt={`${product.title} - ${index + 1}`}
              fill
              sizes="120px"
              className="object-contain p-1"
            />
          </button>
        ))}
      </div>
    </div>
  );
}
