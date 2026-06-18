import { DashboardClient } from "@/features/admin/dashboard-client";

export const metadata = {
  title: "لوحة التحكم",
  description: "لوحة تحكم فيتارو — إدارة التجارة الإلكترونية والتحليلات.",
};

export default function AdminPage() {
  return <DashboardClient />;
}
