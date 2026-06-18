import type { Product } from "@/types/commerce";

export type CartLine = {
  productId: string;
  variantId: string;
  title: string;
  quantity: number;
  unitPrice: number;
};

export type CartSnapshot = {
  lines: CartLine[];
  currency: string;
  subtotal: number;
  freeShippingThreshold: number;
};

export function createCartLine(product: Product, variantId: string, quantity = 1): CartLine {
  const variant = product.variants.find((item) => item.id === variantId) ?? product.variants[0];

  return {
    productId: product.id,
    variantId: variant.id,
    title: product.title,
    quantity,
    unitPrice: variant.price,
  };
}

export function calculateCartSubtotal(lines: CartLine[]) {
  return lines.reduce((total, line) => total + line.unitPrice * line.quantity, 0);
}
