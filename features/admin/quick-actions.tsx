"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import {
  LayoutDashboard,
  LogOut,
  Settings,
  X,
} from "lucide-react";

const actions = [
  { icon: LayoutDashboard, label: "الصفحة الرئيسية", href: "/" },
  { icon: Settings, label: "الإعدادات", href: "/admin/settings" },
  { icon: LogOut, label: "تسجيل الخروج", href: "/api/auth/signout" },
];

export function AdminQuickActions() {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    if (open) document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, [open]);

  return (
    <div
      ref={ref}
      className="fixed bottom-6 left-6 z-50 flex flex-col items-start gap-2"
    >
      {open && (
        <div className="mb-1 w-52 overflow-hidden rounded-2xl border border-zinc-200 bg-white shadow-2xl">
          <div className="border-b border-zinc-100 px-4 py-3">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-subtle">
              أدوات الإدارة
            </p>
          </div>
          {actions.map((action) => (
            <Link
              key={action.label}
              href={action.href}
              onClick={() => setOpen(false)}
              className="flex items-center gap-3 px-4 py-3 text-sm font-medium text-zinc-700 transition hover:bg-zinc-50"
            >
              <action.icon className="h-4 w-4 text-subtle" />
              {action.label}
            </Link>
          ))}
        </div>
      )}

      <button
        onClick={() => setOpen((o) => !o)}
        aria-label="أدوات الإدارة"
        title="أدوات الإدارة"
        className="grid h-11 w-11 place-items-center rounded-2xl border border-zinc-200 bg-white text-zinc-600 shadow-md transition hover:-translate-y-0.5 hover:border-emerald-300 hover:text-emerald-600 hover:shadow-lg"
      >
        {open ? <X className="h-4.5 w-4.5" /> : <LayoutDashboard className="h-4.5 w-4.5" />}
      </button>
    </div>
  );
}
