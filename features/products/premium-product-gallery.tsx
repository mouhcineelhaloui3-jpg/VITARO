"use client";

import { useState } from "react";
import Image from "next/image";
import { motion } from "framer-motion";

import type { Product } from "@/types/commerce";
import { cn } from "@/lib/utils";

export function PremiumProductGallery({ product }: { product: Product }) {
  const images = product.images.length ? product.images : ["/products/scale-main.png"];
  const [active, setActive] = useState(images[0]);

  return (
    <div className="space-y-5">
      <motion.div
        layout
        className="relative aspect-[4/5] overflow-hidden rounded-[2rem] border border-white/60 bg-gradient-to-b from-white to-slate-50 shadow-[0_24px_80px_rgba(15,23,42,0.08)] backdrop-blur-sm sm:rounded-[2.5rem]"
      >
        <Image
          src={active}
          alt={product.title}
          fill
          priority
          sizes="(max-width: 1024px) 100vw, 58vw"
          className="object-contain p-6 sm:p-10"
        />
      </motion.div>

      <div className="grid grid-cols-5 gap-3">
        {images.slice(0, 5).map((image, index) => (
          <button
            key={image}
            onClick={() => setActive(image)}
            aria-label={`صورة ${index + 1}`}
            className={cn(
              "relative aspect-square overflow-hidden rounded-2xl border bg-white/80 transition-all duration-300",
              active === image
                ? "border-emerald-500 ring-2 ring-emerald-500/25"
                : "border-slate-200/80 hover:border-slate-300",
            )}
          >
            <Image
              src={image}
              alt={`${product.title} ${index + 1}`}
              fill
              sizes="96px"
              className="object-contain p-1.5"
            />
          </button>
        ))}
      </div>
    </div>
  );
}
