import type { OrderStatus, PaymentMethod } from "@prisma/client";

export type AdminOrderItem = {
  id: string;
  name: string;
  sku: string;
  quantity: number;
  price: number;
};

export type AdminOrderRow = {
  id: string;
  email: string;
  status: OrderStatus;
  paymentMethod: PaymentMethod;
  subtotal: number;
  shipping: number;
  tax: number;
  total: number;
  currency: string;
  createdAt: string;
  updatedAt: string;
  customerName: string;
  phone: string;
  gender: string | null;
  address: string;
  city: string | null;
  items: AdminOrderItem[];
  itemCount: number;
};

export const ORDER_STATUS_LABELS: Record<OrderStatus, string> = {
  DRAFT: "مسودة",
  PENDING: "قيد الانتظار",
  PAID: "مدفوع",
  FULFILLED: "مكتمل",
  CANCELLED: "ملغى",
  REFUNDED: "مسترد",
};

export const PAYMENT_METHOD_LABELS: Record<PaymentMethod, string> = {
  CARD: "بطاقة بنكية",
  WALLET: "محفظة إلكترونية",
  COD: "الدفع عند الاستلام",
};

type DbOrder = {
  id: string;
  email: string;
  customerName: string;
  phone: string;
  gender: string | null;
  address: string;
  city: string | null;
  status: OrderStatus;
  paymentMethod: PaymentMethod;
  subtotal: { toNumber(): number };
  shipping: { toNumber(): number };
  tax: { toNumber(): number };
  total: { toNumber(): number };
  currency: string;
  createdAt: Date;
  updatedAt: Date;
  items: {
    id: string;
    name: string;
    sku: string;
    quantity: number;
    price: { toNumber(): number };
  }[];
};

export function mapAdminOrder(row: DbOrder): AdminOrderRow {
  return {
    id: row.id,
    email: row.email,
    status: row.status,
    paymentMethod: row.paymentMethod,
    subtotal: row.subtotal.toNumber(),
    shipping: row.shipping.toNumber(),
    tax: row.tax.toNumber(),
    total: row.total.toNumber(),
    currency: row.currency,
    createdAt: row.createdAt.toISOString(),
    updatedAt: row.updatedAt.toISOString(),
    customerName: row.customerName || "—",
    phone: row.phone || "—",
    gender: row.gender,
    address: row.address || "—",
    city: row.city,
    items: row.items.map((item) => ({
      id: item.id,
      name: item.name,
      sku: item.sku,
      quantity: item.quantity,
      price: item.price.toNumber(),
    })),
    itemCount: row.items.reduce((sum, item) => sum + item.quantity, 0),
  };
}

export function orderStatusVariant(
  status: OrderStatus,
): "success" | "neutral" | "accent" {
  if (status === "PAID" || status === "FULFILLED") return "success";
  if (status === "PENDING") return "accent";
  return "neutral";
}
