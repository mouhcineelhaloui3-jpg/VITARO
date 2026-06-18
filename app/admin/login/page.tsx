import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";

import { authOptions } from "@/lib/auth";
import { AdminLoginForm } from "@/features/admin/login-form";

export const metadata = {
  title: "دخول الإدارة",
  description: "تسجيل الدخول إلى لوحة تحكم فيتارو.",
};

export default async function AdminLoginPage() {
  const session = await getServerSession(authOptions);

  if (session?.user?.role === "ADMIN") {
    redirect("/admin");
  }

  return <AdminLoginForm />;
}
