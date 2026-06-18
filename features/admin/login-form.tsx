"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Lock, Shield } from "lucide-react";

import { Button } from "@/components/ui/button";

export function AdminLoginForm() {
  const router = useRouter();
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setLoading(true);

    const result = await signIn("credentials", {
      password,
      redirect: false,
    });

    setLoading(false);

    if (result?.error) {
      if (result.error === "Configuration") {
        setError("خطأ في إعداد الخادم: NEXTAUTH_SECRET أو NEXTAUTH_URL غير مضبوطين في ملف .env");
      } else {
        setError("كلمة المرور غير صحيحة.");
      }
      return;
    }

    router.push("/admin");
    router.refresh();
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div
        data-surface="light"
        className="w-full max-w-md rounded-3xl border border-surface bg-surface p-8 shadow-xl dark:border-white/10 dark:bg-[#111827] dark:[--surface-bg:#111827] dark:[--surface-fg-heading:#f8fafc] dark:[--surface-fg-body:#e2e8f0] dark:[--surface-fg-muted:#cbd5e1] dark:[--surface-fg-subtle:#94a3b8] dark:[--surface-icon:#f8fafc] dark:[--surface-border:rgba(255,255,255,0.1)]"
      >
        <div className="mb-8 flex items-center gap-3">
          <span className="grid h-12 w-12 place-items-center rounded-2xl bg-[#020617] text-white dark:bg-white dark:text-[#0f172a]">
            <Shield className="h-6 w-6" />
          </span>
          <div>
            <h1 className="text-xl font-semibold text-surface-heading">دخول الإدارة</h1>
            <p className="text-sm text-surface-muted">لوحة تحكم فيتارو — للمسؤولين فقط</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <label className="block space-y-2">
            <span className="text-sm font-medium text-surface-body">كلمة المرور</span>
            <input
              type="password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              required
              minLength={8}
              autoComplete="current-password"
              className="form-input"
            />
          </label>

          {error ? (
            <p className="rounded-xl bg-red-50 px-4 py-3 text-sm text-red-700 dark:bg-red-500/10 dark:text-red-300">
              {error}
            </p>
          ) : null}

          <Button type="submit" variant="accent" className="w-full" disabled={loading}>
            <Lock className="h-4 w-4" />
            {loading ? "جاري التحقق..." : "تسجيل الدخول"}
          </Button>
        </form>
      </div>
    </div>
  );
}
