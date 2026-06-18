import Link from "next/link";
import Image from "next/image";
import { Star } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { ProductCard as Card } from "@/components/ui/card";
import { formatCurrency } from "@/lib/utils";
import type { Product } from "@/types/commerce";

export function ProductCard({ product }: { product: Product }) {
  const image = product.images[0] ?? "/products/scale-main.png";

  return (
    <Link href={`/products/${product.slug}`}>
      <Card className="h-full">
        <div className="relative aspect-[4/3] overflow-hidden rounded-t-3xl bg-section-bg">
          <div className="absolute left-6 top-6 z-10">
            <Badge variant="success">مخزون محدود</Badge>
          </div>
          <Image
            src={image}
            alt={product.title}
            fill
            sizes="(max-width: 768px) 100vw, 400px"
            className="object-contain p-4 transition-transform duration-500 group-hover:scale-105"
          />
        </div>
        <div className="p-7">
          <div className="mb-4 flex items-center gap-1.5 text-[0.9375rem] font-bold text-heading">
            <Star className="h-5 w-5 fill-accent text-accent" />
            {product.rating} · {product.reviewCount.toLocaleString()} تقييم
          </div>
          <h3 className="text-xl font-bold tracking-tight text-heading">
            {product.title}
          </h3>
          <p className="mt-2.5 text-[0.9375rem] leading-[1.7] text-body">
            {product.subtitle}
          </p>
          <div className="mt-6 flex items-end justify-between">
            <div>
              <p className="text-xs font-bold uppercase tracking-wider text-muted">
                ابتداءً من
              </p>
              <p className="mt-1 text-2xl font-extrabold tracking-tight text-heading">
                {formatCurrency(product.price, product.currency)}
              </p>
            </div>
            <span className="rounded-xl bg-heading px-5 py-2.5 text-sm font-bold text-white transition-colors group-hover:bg-accent">
              شوف المنتج
            </span>
          </div>
        </div>
      </Card>
    </Link>
  );
}
