import {
  ORDER_STATUS_LABELS,
  PAYMENT_METHOD_LABELS,
  type AdminOrderRow,
} from "@/lib/services/order-admin";

function escapeCell(value: string | number | null | undefined) {
  const text = String(value ?? "");
  return text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function formatExportDate(value: string) {
  return new Intl.DateTimeFormat("ar-MA", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(new Date(value));
}

function orderItemsSummary(order: AdminOrderRow) {
  if (!order.items.length) return "—";
  return order.items
    .map((item) => `${item.name} (x${item.quantity}) — ${item.sku}`)
    .join(" | ");
}

export function buildOrdersExcelHtml(orders: AdminOrderRow[]) {
  const headers = [
    "رقم الطلب",
    "التاريخ",
    "الحالة",
    "الاسم",
    "الجنس",
    "الهاتف",
    "العنوان",
    "المدينة",
    "المنتجات",
    "الكمية",
    "المجموع الفرعي",
    "الشحن",
    "الضريبة",
    "الإجمالي",
    "العملة",
    "طريقة الدفع",
  ];

  const rows = orders
    .map((order) => {
      const cells = [
        order.id.slice(-8).toUpperCase(),
        formatExportDate(order.createdAt),
        ORDER_STATUS_LABELS[order.status],
        order.customerName,
        order.gender ?? "—",
        order.phone,
        order.address,
        order.city ?? "—",
        orderItemsSummary(order),
        order.itemCount,
        order.subtotal,
        order.shipping,
        order.tax,
        order.total,
        order.currency,
        PAYMENT_METHOD_LABELS[order.paymentMethod],
      ];

      return `<tr>${cells.map((cell) => `<td>${escapeCell(cell)}</td>`).join("")}</tr>`;
    })
    .join("");

  return `<!DOCTYPE html>
<html xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:x="urn:schemas-microsoft-com:office:excel">
<head>
  <meta charset="UTF-8" />
  <!--[if gte mso 9]><xml><x:ExcelWorkbook><x:ExcelWorksheets><x:ExcelWorksheet>
  <x:Name>الطلبات</x:Name>
  <x:WorksheetOptions><x:DisplayGridlines/></x:WorksheetOptions>
  </x:ExcelWorksheet></x:ExcelWorksheets></x:ExcelWorkbook></xml><![endif]-->
</head>
<body>
  <table border="1">
    <thead>
      <tr>${headers.map((header) => `<th>${escapeCell(header)}</th>`).join("")}</tr>
    </thead>
    <tbody>${rows}</tbody>
  </table>
</body>
</html>`;
}

export function downloadOrdersExcel(orders: AdminOrderRow[], filenamePrefix = "vitaro-orders") {
  if (!orders.length) return false;

  const stamp = new Date().toISOString().slice(0, 10);
  const blob = new Blob([buildOrdersExcelHtml(orders)], {
    type: "application/vnd.ms-excel;charset=utf-8",
  });

  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = `${filenamePrefix}-${stamp}.xls`;
  document.body.appendChild(link);
  link.click();
  link.remove();
  URL.revokeObjectURL(url);
  return true;
}
