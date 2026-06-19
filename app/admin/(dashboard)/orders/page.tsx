"use client";

import useSWR, { mutate } from "swr";
import {
  Check,
  ChevronDown,
  ChevronUp,
  ClipboardList,
  Loader2,
  Package,
  Truck,
  Wallet,
} from "lucide-react";
import { useMemo, useState } from "react";

import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { formatCurrency } from "@/lib/utils";
import {
  ORDER_STATUS_LABELS,
  PAYMENT_METHOD_LABELS,
  orderStatusVariant,
  type AdminOrderRow,
} from "@/lib/services/order-admin";
import type { OrderStatus } from "@prisma/client";

type OrdersResponse = {
  orders: AdminOrderRow[];
  summary: {
    total: number;
    pending: number;
    paid: number;
    fulfilled: number;
    revenue: number;
  };
};

const STATUS_FILTERS: { key: "all" | OrderStatus; label: string }[] = [
  { key: "all", label: "الكل" },
  { key: "PENDING", label: "قيد الانتظار" },
  { key: "PAID", label: "مدفوع" },
  { key: "FULFILLED", label: "مكتمل" },
  { key: "CANCELLED", label: "ملغى" },
];

const ALL_STATUSES: OrderStatus[] = [
  "DRAFT",
  "PENDING",
  "PAID",
  "FULFILLED",
  "CANCELLED",
  "REFUNDED",
];

const fetcher = async (url: string): Promise<OrdersResponse> => {
  const res = await fetch(url);
  if (!res.ok) {
    return {
      orders: [],
      summary: { total: 0, pending: 0, paid: 0, fulfilled: 0, revenue: 0 },
    };
  }
  return res.json();
};

function formatDate(value: string) {
  return new Intl.DateTimeFormat("ar-MA", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(new Date(value));
}

function PaymentIcon({ method }: { method: AdminOrderRow["paymentMethod"] }) {
  if (method === "COD") return <Truck className="h-4 w-4 text-emerald-500" />;
  if (method === "WALLET") return <Wallet className="h-4 w-4 text-emerald-500" />;
  return <Wallet className="h-4 w-4 text-emerald-500" />;
}

export default function AdminOrdersPage() {
  const [statusFilter, setStatusFilter] = useState<"all" | OrderStatus>("all");
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [statusDrafts, setStatusDrafts] = useState<Record<string, OrderStatus>>({});
  const [savingId, setSavingId] = useState<string | null>(null);
  const [feedback, setFeedback] = useState<{ type: "success" | "error"; text: string } | null>(
    null,
  );

  const apiUrl =
    statusFilter === "all"
      ? "/api/admin/orders"
      : `/api/admin/orders?status=${statusFilter}`;

  const { data, isLoading, error } = useSWR<OrdersResponse>(apiUrl, fetcher, {
    refreshInterval: 30000,
  });

  const orders = data?.orders ?? [];
  const summary = data?.summary ?? {
    total: 0,
    pending: 0,
    paid: 0,
    fulfilled: 0,
    revenue: 0,
  };

  const stats = useMemo(
    () => [
      { label: "إجمالي الطلبات", value: String(summary.total), icon: ClipboardList },
      { label: "قيد الانتظار", value: String(summary.pending), icon: Package },
      { label: "مدفوع", value: String(summary.paid), icon: Wallet },
      { label: "مكتمل", value: String(summary.fulfilled), icon: Truck },
    ],
    [summary],
  );

  async function saveStatus(order: AdminOrderRow) {
    const nextStatus = statusDrafts[order.id] ?? order.status;
    if (nextStatus === order.status) return;

    setSavingId(order.id);
    setFeedback(null);

    const res = await fetch(`/api/admin/orders/${order.id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status: nextStatus }),
    });

    setSavingId(null);

    if (!res.ok) {
      const payload = (await res.json().catch(() => null)) as { error?: string } | null;
      setFeedback({ type: "error", text: payload?.error ?? "فشل تحديث حالة الطلب" });
      return;
    }

    setFeedback({ type: "success", text: "تم تحديث حالة الطلب" });
    await mutate(apiUrl);
    await mutate("/api/admin/orders");
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold text-heading">الطلبات</h1>
          <p className="text-sm text-muted-fg">تتبع وإدارة طلبات المتجر وحالات التوصيل والدفع.</p>
        </div>
        <div className="rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-2 text-sm text-emerald-800">
          إيرادات مؤكدة:{" "}
          <strong>{formatCurrency(summary.revenue, "MAD")}</strong>
        </div>
      </div>

      {feedback ? (
        <div
          className={`rounded-xl px-4 py-3 text-sm ${
            feedback.type === "success"
              ? "border border-emerald-200 bg-emerald-50 text-emerald-800"
              : "border border-red-200 bg-red-50 text-red-700"
          }`}
        >
          {feedback.text}
        </div>
      ) : null}

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {stats.map((stat) => (
          <Card key={stat.label} className="p-4">
            <div className="flex items-center gap-3">
              <div className="rounded-xl bg-emerald-50 p-2">
                <stat.icon className="h-5 w-5 text-emerald-600" />
              </div>
              <div>
                <p className="text-xs text-muted-fg">{stat.label}</p>
                <p className="text-2xl font-semibold text-heading">{stat.value}</p>
              </div>
            </div>
          </Card>
        ))}
      </div>

      <div className="flex flex-wrap gap-2">
        {STATUS_FILTERS.map((filter) => (
          <button
            key={filter.key}
            onClick={() => setStatusFilter(filter.key)}
            className={`rounded-full px-4 py-2 text-sm font-medium transition ${
              statusFilter === filter.key
                ? "bg-emerald-500 text-white"
                : "border border-slate-200 bg-white text-body hover:border-emerald-300 dark:border-white/10"
            }`}
          >
            {filter.label}
          </button>
        ))}
      </div>

      {isLoading ? (
        <div className="py-16 text-center text-sm text-subtle">
          <Loader2 className="inline h-5 w-5 animate-spin" />
        </div>
      ) : error ? (
        <Card className="p-8 text-center">
          <p className="text-sm text-red-600">تعذّر تحميل الطلبات. تأكد من اتصال قاعدة البيانات.</p>
        </Card>
      ) : orders.length === 0 ? (
        <Card className="p-8 text-center">
          <ClipboardList className="mx-auto h-8 w-8 text-subtle" />
          <h3 className="mt-4 font-semibold text-heading">لا توجد طلبات بعد</h3>
          <p className="mt-2 text-sm text-muted-fg">
            ستظهر الطلبات هنا عند إنشائها من صفحة الدفع أو عبر واتساب.
          </p>
        </Card>
      ) : (
        <div className="space-y-3">
          {orders.map((order) => {
            const isExpanded = expandedId === order.id;
            const draftStatus = statusDrafts[order.id] ?? order.status;
            const hasChanges = draftStatus !== order.status;

            return (
              <Card key={order.id} className="overflow-hidden">
                <div className="flex flex-wrap items-start justify-between gap-4 p-5">
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="font-semibold text-heading">
                        #{order.id.slice(-8).toUpperCase()}
                      </span>
                      <Badge variant={orderStatusVariant(order.status)}>
                        {ORDER_STATUS_LABELS[order.status]}
                      </Badge>
                      <Badge variant="neutral">{order.itemCount} منتج</Badge>
                    </div>
                    <p className="mt-2 text-sm text-body">
                      {order.customerName}
                    </p>
                    <p className="text-xs text-subtle">
                      {order.phone}
                      {order.gender ? ` · ${order.gender}` : ""}
                    </p>
                    <p className="text-xs text-subtle">
                      {order.address}
                      {order.city ? `، ${order.city}` : ""}
                    </p>
                    <div className="mt-2 flex flex-wrap items-center gap-3 text-xs text-subtle">
                      <span>{formatDate(order.createdAt)}</span>
                      <span className="inline-flex items-center gap-1">
                        <PaymentIcon method={order.paymentMethod} />
                        {PAYMENT_METHOD_LABELS[order.paymentMethod]}
                      </span>
                    </div>
                  </div>

                  <div className="flex shrink-0 flex-col items-end gap-3">
                    <p className="text-lg font-semibold text-heading">
                      {formatCurrency(order.total, order.currency as "MAD")}
                    </p>
                    <button
                      onClick={() => setExpandedId(isExpanded ? null : order.id)}
                      className="inline-flex items-center gap-1 rounded-lg px-3 py-1.5 text-sm text-emerald-700 hover:bg-emerald-50"
                    >
                      {isExpanded ? (
                        <>
                          إخفاء التفاصيل <ChevronUp className="h-4 w-4" />
                        </>
                      ) : (
                        <>
                          التفاصيل <ChevronDown className="h-4 w-4" />
                        </>
                      )}
                    </button>
                  </div>
                </div>

                {isExpanded ? (
                  <div className="border-t border-slate-100 bg-slate-50/60 p-5 dark:border-white/5 dark:bg-white/5">
                    <div className="space-y-3">
                      {order.items.map((item) => (
                        <div
                          key={item.id}
                          className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-slate-100 bg-white px-4 py-3 dark:border-white/10 dark:bg-zinc-900"
                        >
                          <div>
                            <p className="font-medium text-heading">{item.name}</p>
                            <p className="text-xs text-subtle">
                              SKU: {item.sku} · الكمية: {item.quantity}
                            </p>
                          </div>
                          <p className="font-medium text-heading">
                            {formatCurrency(item.price * item.quantity, order.currency as "MAD")}
                          </p>
                        </div>
                      ))}
                    </div>

                    <div className="mt-4 grid gap-2 text-sm sm:grid-cols-3">
                      <div className="flex justify-between rounded-lg bg-white px-3 py-2 dark:bg-zinc-900">
                        <span className="text-muted-fg">المجموع الفرعي</span>
                        <span>{formatCurrency(order.subtotal, order.currency as "MAD")}</span>
                      </div>
                      <div className="flex justify-between rounded-lg bg-white px-3 py-2 dark:bg-zinc-900">
                        <span className="text-muted-fg">الشحن</span>
                        <span>{formatCurrency(order.shipping, order.currency as "MAD")}</span>
                      </div>
                      <div className="flex justify-between rounded-lg bg-white px-3 py-2 dark:bg-zinc-900">
                        <span className="text-muted-fg">الضريبة</span>
                        <span>{formatCurrency(order.tax, order.currency as "MAD")}</span>
                      </div>
                    </div>

                    <div className="mt-4 flex flex-wrap items-center gap-3">
                      <label className="text-sm text-muted-fg">تحديث الحالة</label>
                      <select
                        className="form-input max-w-xs"
                        value={draftStatus}
                        onChange={(e) =>
                          setStatusDrafts((current) => ({
                            ...current,
                            [order.id]: e.target.value as OrderStatus,
                          }))
                        }
                      >
                        {ALL_STATUSES.map((status) => (
                          <option key={status} value={status}>
                            {ORDER_STATUS_LABELS[status]}
                          </option>
                        ))}
                      </select>
                      <button
                        onClick={() => saveStatus(order)}
                        disabled={!hasChanges || savingId === order.id}
                        className="inline-flex items-center gap-2 rounded-xl bg-emerald-500 px-4 py-2 text-sm text-white hover:bg-emerald-600 disabled:opacity-50"
                      >
                        {savingId === order.id ? (
                          <Loader2 className="h-4 w-4 animate-spin" />
                        ) : (
                          <Check className="h-4 w-4" />
                        )}
                        حفظ الحالة
                      </button>
                    </div>
                  </div>
                ) : null}
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}
