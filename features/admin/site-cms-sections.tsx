"use client";

import { useState } from "react";
import useSWR, { mutate } from "swr";
import { Check, Loader2, Plus, Trash2 } from "lucide-react";

import {
  defaultAnnouncement,
  defaultFooter,
  defaultFooterHelpLinks,
  defaultHeader,
  defaultHomeSections,
  defaultNavigation,
  defaultTrustChips,
} from "@/lib/cms/defaults";
import type { NavItem } from "@/lib/cms/defaults";

const fetcher = (url: string) => fetch(url).then((r) => (r.ok ? r.json() : []));

async function saveSettings(items: { key: string; value: string; group: string }[]) {
  const res = await fetch("/api/admin/cms/settings", {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(items),
  });
  return res.ok;
}

async function saveContentBlocks(
  blocks: { page: string; section: string; key: string; value: string }[],
) {
  const res = await fetch("/api/admin/cms/content", {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(blocks),
  });
  return res.ok;
}

function SaveBar({
  saving,
  saved,
  onSave,
}: {
  saving: boolean;
  saved: boolean;
  onSave: () => void;
}) {
  return (
    <button
      onClick={onSave}
      disabled={saving}
      className="inline-flex items-center gap-2 rounded-xl bg-emerald-500 px-4 py-2 text-sm font-medium text-white transition hover:bg-emerald-600 disabled:opacity-60"
    >
      {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : saved ? <Check className="h-4 w-4" /> : null}
      {saving ? "جاري الحفظ..." : saved ? "تم الحفظ ✓" : "حفظ التغييرات"}
    </button>
  );
}

export function HeaderSection({ configs }: { configs: { key: string; value: string }[] }) {
  const keys = ["logoLetter", "logoText", "ctaLabel", "productSlug"] as const;
  const current = (key: string) =>
    configs.find((c) => c.key === key)?.value ??
    defaultHeader[key as keyof typeof defaultHeader] ??
    "";

  const [values, setValues] = useState(
    Object.fromEntries(keys.map((key) => [key, current(key)])),
  );
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  async function handleSave() {
    setSaving(true);
    const ok = await saveSettings(keys.map((key) => ({ key, value: values[key] ?? "", group: "header" })));
    setSaving(false);
    if (ok) {
      setSaved(true);
      setTimeout(() => setSaved(false), 2500);
      await mutate("/api/admin/cms/settings");
    }
  }

  return (
    <div className="space-y-4">
      <div className="grid gap-4 sm:grid-cols-2">
        <label className="block space-y-1.5">
          <span className="text-xs font-medium text-muted-fg">حرف الشعار (أيقونة)</span>
          <input className="form-input" value={values.logoLetter} onChange={(e) => setValues((v) => ({ ...v, logoLetter: e.target.value }))} />
        </label>
        <label className="block space-y-1.5">
          <span className="text-xs font-medium text-muted-fg">نص الشعار</span>
          <input className="form-input" value={values.logoText} onChange={(e) => setValues((v) => ({ ...v, logoText: e.target.value }))} />
        </label>
        <label className="block space-y-1.5">
          <span className="text-xs font-medium text-muted-fg">زر الشراء في الهيدر</span>
          <input className="form-input" value={values.ctaLabel} onChange={(e) => setValues((v) => ({ ...v, ctaLabel: e.target.value }))} />
        </label>
        <label className="block space-y-1.5">
          <span className="text-xs font-medium text-muted-fg">رابط المنتج (slug)</span>
          <input className="form-input" value={values.productSlug} onChange={(e) => setValues((v) => ({ ...v, productSlug: e.target.value }))} />
        </label>
      </div>
      <SaveBar saving={saving} saved={saved} onSave={handleSave} />
    </div>
  );
}

export function FooterSection({ configs }: { configs: { key: string; value: string }[] }) {
  const keys = ["description", "whatsappCta", "shopColumnTitle", "helpColumnTitle"] as const;
  const current = (key: string) =>
    configs.find((c) => c.key === key)?.value ??
    defaultFooter[key as keyof typeof defaultFooter] ??
    "";

  const helpLinksRaw = configs.find((c) => c.key === "helpLinks")?.value;
  const initialHelpLinks: NavItem[] = helpLinksRaw
    ? (() => {
        try {
          return JSON.parse(helpLinksRaw) as NavItem[];
        } catch {
          return defaultFooterHelpLinks;
        }
      })()
    : defaultFooterHelpLinks;

  const [values, setValues] = useState(
    Object.fromEntries(keys.map((key) => [key, current(key)])),
  );
  const [helpLinks, setHelpLinks] = useState<NavItem[]>(initialHelpLinks);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  async function handleSave() {
    setSaving(true);
    const ok = await saveSettings([
      ...keys.map((key) => ({ key, value: values[key] ?? "", group: "footer" })),
      { key: "helpLinks", value: JSON.stringify(helpLinks), group: "footer" },
    ]);
    setSaving(false);
    if (ok) {
      setSaved(true);
      setTimeout(() => setSaved(false), 2500);
      await mutate("/api/admin/cms/settings");
    }
  }

  return (
    <div className="space-y-4">
      <label className="block space-y-1.5">
        <span className="text-xs font-medium text-muted-fg">وصف الفوتر</span>
        <textarea rows={3} className="form-input resize-none" value={values.description} onChange={(e) => setValues((v) => ({ ...v, description: e.target.value }))} />
      </label>
      <div className="grid gap-4 sm:grid-cols-2">
        {[
          { key: "whatsappCta", label: "زر واتساب" },
          { key: "shopColumnTitle", label: "عنوان عمود المتجر" },
          { key: "helpColumnTitle", label: "عنوان عمود المساعدة" },
        ].map((field) => (
          <label key={field.key} className="block space-y-1.5">
            <span className="text-xs font-medium text-muted-fg">{field.label}</span>
            <input className="form-input" value={values[field.key]} onChange={(e) => setValues((v) => ({ ...v, [field.key]: e.target.value }))} />
          </label>
        ))}
      </div>
      <div className="space-y-2">
        <p className="text-xs font-medium text-muted-fg">روابط عمود المساعدة</p>
        {helpLinks.map((item, index) => (
          <div key={index} className="grid gap-3 rounded-xl border border-slate-100 p-3 sm:grid-cols-[1fr_1fr_auto]">
            <input
              className="form-input"
              value={item.label}
              placeholder="النص"
              onChange={(e) =>
                setHelpLinks((current) =>
                  current.map((entry, i) => (i === index ? { ...entry, label: e.target.value } : entry)),
                )
              }
            />
            <input
              className="form-input"
              value={item.href}
              placeholder="/contact"
              onChange={(e) =>
                setHelpLinks((current) =>
                  current.map((entry, i) => (i === index ? { ...entry, href: e.target.value } : entry)),
                )
              }
            />
            <button
              onClick={() => setHelpLinks((current) => current.filter((_, i) => i !== index))}
              className="rounded-lg p-2 text-red-500 hover:bg-red-50"
            >
              <Trash2 className="h-4 w-4" />
            </button>
          </div>
        ))}
        <button
          onClick={() => setHelpLinks((current) => [...current, { label: "رابط جديد", href: "/" }])}
          className="inline-flex items-center gap-2 rounded-xl border border-dashed border-slate-300 px-4 py-2 text-sm text-muted-fg hover:border-emerald-400 hover:text-emerald-600"
        >
          <Plus className="h-4 w-4" /> إضافة رابط
        </button>
      </div>
      <SaveBar saving={saving} saved={saved} onSave={handleSave} />
    </div>
  );
}

export function NavigationSection({ configs }: { configs: { key: string; value: string }[] }) {
  const raw = configs.find((c) => c.key === "navigation")?.value;
  const initial: NavItem[] = raw
    ? (() => {
        try {
          return JSON.parse(raw) as NavItem[];
        } catch {
          return defaultNavigation;
        }
      })()
    : defaultNavigation;

  const [items, setItems] = useState<NavItem[]>(initial);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  async function handleSave() {
    setSaving(true);
    const ok = await saveSettings([
      { key: "navigation", value: JSON.stringify(items), group: "nav" },
    ]);
    setSaving(false);
    if (ok) {
      setSaved(true);
      setTimeout(() => setSaved(false), 2500);
      await mutate("/api/admin/cms/settings");
    }
  }

  return (
    <div className="space-y-3">
      {items.map((item, index) => (
        <div key={index} className="grid gap-3 rounded-xl border border-slate-100 p-4 sm:grid-cols-[1fr_1fr_auto]">
          <input
            className="form-input"
            value={item.label}
            placeholder="النص"
            onChange={(e) =>
              setItems((current) =>
                current.map((entry, i) => (i === index ? { ...entry, label: e.target.value } : entry)),
              )
            }
          />
          <input
            className="form-input"
            value={item.href}
            placeholder="/contact"
            onChange={(e) =>
              setItems((current) =>
                current.map((entry, i) => (i === index ? { ...entry, href: e.target.value } : entry)),
              )
            }
          />
          <button
            onClick={() => setItems((current) => current.filter((_, i) => i !== index))}
            className="rounded-lg p-2 text-red-500 hover:bg-red-50"
          >
            <Trash2 className="h-4 w-4" />
          </button>
        </div>
      ))}
      <button
        onClick={() => setItems((current) => [...current, { label: "رابط جديد", href: "/" }])}
        className="inline-flex items-center gap-2 rounded-xl border border-dashed border-slate-300 px-4 py-2 text-sm text-muted-fg hover:border-emerald-400 hover:text-emerald-600"
      >
        <Plus className="h-4 w-4" /> إضافة رابط
      </button>
      <SaveBar saving={saving} saved={saved} onSave={handleSave} />
    </div>
  );
}

export function AnnouncementSection({
  blocks,
}: {
  blocks: { page: string; section: string; key: string; value: string }[];
}) {
  const keys = [
    { key: "text", label: "النص الرئيسي" },
    { key: "chip1", label: "شارة 1" },
    { key: "chip2", label: "شارة 2" },
    { key: "chip3", label: "شارة 3" },
  ];
  const current = (key: string) =>
    blocks.find((b) => b.page === "home" && b.section === "announcement" && b.key === key)?.value ??
    defaultAnnouncement[key as keyof typeof defaultAnnouncement] ??
    "";

  const [values, setValues] = useState(
    Object.fromEntries(keys.map((field) => [field.key, current(field.key)])),
  );
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  async function handleSave() {
    setSaving(true);
    const ok = await saveContentBlocks(
      keys.map((field) => ({
        page: "home",
        section: "announcement",
        key: field.key,
        value: values[field.key] ?? "",
      })),
    );
    setSaving(false);
    if (ok) {
      setSaved(true);
      setTimeout(() => setSaved(false), 2500);
      await mutate("/api/admin/cms/content");
    }
  }

  return (
    <div className="space-y-4">
      {keys.map((field) => (
        <label key={field.key} className="block space-y-1.5">
          <span className="text-xs font-medium text-muted-fg">{field.label}</span>
          <input className="form-input" value={values[field.key]} onChange={(e) => setValues((v) => ({ ...v, [field.key]: e.target.value }))} />
        </label>
      ))}
      <SaveBar saving={saving} saved={saved} onSave={handleSave} />
    </div>
  );
}

export function HomeSectionsPanel({
  blocks,
}: {
  blocks: { page: string; section: string; key: string; value: string }[];
}) {
  const sectionFields = Object.entries(defaultHomeSections).map(([key, fallback]) => ({
    key,
    label: key.replaceAll("_", " "),
    fallback,
  }));

  const current = (key: string, fallback: string) =>
    blocks.find((b) => b.page === "home" && b.section === "sections" && b.key === key)?.value ??
    fallback;

  const [values, setValues] = useState<Record<string, string>>(
    Object.fromEntries(sectionFields.map((field) => [field.key, current(field.key, field.fallback)])),
  );
  const [trustChips, setTrustChips] = useState(() => {
    const raw = blocks.find((b) => b.page === "home" && b.section === "sections" && b.key === "trust_chips")?.value;
    if (!raw) return defaultTrustChips;
    try {
      return JSON.parse(raw) as string[];
    } catch {
      return defaultTrustChips;
    }
  });
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  async function handleSave() {
    setSaving(true);
    const ok = await saveContentBlocks([
      ...sectionFields.map((field) => ({
        page: "home",
        section: "sections",
        key: field.key,
        value: values[field.key] ?? "",
      })),
      {
        page: "home",
        section: "sections",
        key: "trust_chips",
        value: JSON.stringify(trustChips),
      },
    ]);
    setSaving(false);
    if (ok) {
      setSaved(true);
      setTimeout(() => setSaved(false), 2500);
      await mutate("/api/admin/cms/content");
    }
  }

  return (
    <div className="space-y-4">
      <div className="grid gap-4 sm:grid-cols-2">
        {sectionFields.map((field) => (
          <label key={field.key} className="block space-y-1.5">
            <span className="text-xs font-medium text-muted-fg">{field.label}</span>
            <input className="form-input" value={values[field.key]} onChange={(e) => setValues((v) => ({ ...v, [field.key]: e.target.value }))} />
          </label>
        ))}
      </div>
      <div className="space-y-2">
        <p className="text-xs font-medium text-muted-fg">شارات الثقة تحت الهيرو</p>
        {trustChips.map((chip, index) => (
          <input
            key={index}
            className="form-input"
            value={chip}
            onChange={(e) =>
              setTrustChips((current) =>
                current.map((entry, i) => (i === index ? e.target.value : entry)),
              )
            }
          />
        ))}
      </div>
      <SaveBar saving={saving} saved={saved} onSave={handleSave} />
    </div>
  );
}

type BlogItem = {
  id: string;
  slug: string;
  title: string;
  category: string;
  excerpt: string;
  body: string;
  readTime: string;
  status: string;
};

export function BlogSection() {
  const { data: dbItems = [], isLoading } = useSWR<BlogItem[]>("/api/admin/cms/blog", fetcher);
  const [editing, setEditing] = useState<string | null>(null);
  const [editValues, setEditValues] = useState<Partial<BlogItem>>({});
  const [saving, setSaving] = useState(false);
  const [adding, setAdding] = useState(false);
  const [newPost, setNewPost] = useState({
    slug: "",
    title: "",
    category: "",
    excerpt: "",
    body: "",
    readTime: "",
  });

  async function saveEdit(id: string) {
    setSaving(true);
    await fetch(`/api/admin/cms/blog/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(editValues),
    });
    setSaving(false);
    setEditing(null);
    await mutate("/api/admin/cms/blog");
  }

  async function deleteItem(id: string) {
    await fetch(`/api/admin/cms/blog/${id}`, { method: "DELETE" });
    await mutate("/api/admin/cms/blog");
  }

  async function addPost() {
    if (!newPost.slug || !newPost.title) return;
    setSaving(true);
    await fetch("/api/admin/cms/blog", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...newPost, sortOrder: dbItems.length }),
    });
    setSaving(false);
    setAdding(false);
    setNewPost({ slug: "", title: "", category: "", excerpt: "", body: "", readTime: "" });
    await mutate("/api/admin/cms/blog");
  }

  if (isLoading) {
    return (
      <div className="py-4 text-center text-sm text-subtle">
        <Loader2 className="inline h-4 w-4 animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {dbItems.map((post) => (
        <div key={post.id} className="rounded-xl border border-slate-100 bg-white overflow-hidden">
          {editing === post.id ? (
            <div className="space-y-3 p-4">
              {[
                { key: "title", label: "العنوان" },
                { key: "category", label: "التصنيف" },
                { key: "readTime", label: "مدة القراءة" },
                { key: "excerpt", label: "المقتطف" },
              ].map((field) => (
                <label key={field.key} className="block space-y-1">
                  <span className="text-xs text-muted-fg">{field.label}</span>
                  <input
                    className="form-input"
                    defaultValue={post[field.key as keyof BlogItem] as string}
                    onChange={(e) => setEditValues((v) => ({ ...v, [field.key]: e.target.value }))}
                  />
                </label>
              ))}
              <label className="block space-y-1">
                <span className="text-xs text-muted-fg">المحتوى</span>
                <textarea className="form-input resize-none" rows={6} defaultValue={post.body} onChange={(e) => setEditValues((v) => ({ ...v, body: e.target.value }))} />
              </label>
              <div className="flex gap-2">
                <button onClick={() => saveEdit(post.id)} disabled={saving} className="rounded-xl bg-emerald-500 px-3 py-1.5 text-sm text-white">حفظ</button>
                <button onClick={() => setEditing(null)} className="rounded-xl border px-3 py-1.5 text-sm">إلغاء</button>
              </div>
            </div>
          ) : (
            <div className="flex items-start justify-between gap-3 p-4">
              <div>
                <p className="font-medium text-heading">{post.title}</p>
                <p className="mt-1 text-xs text-subtle">/{post.slug}</p>
                <p className="mt-1 text-sm text-body line-clamp-2">{post.excerpt}</p>
              </div>
              <div className="flex gap-1">
                <button onClick={() => { setEditing(post.id); setEditValues({}); }} className="rounded-lg px-3 py-1.5 text-sm text-emerald-700 hover:bg-emerald-50">تعديل</button>
                <button onClick={() => deleteItem(post.id)} className="rounded-lg p-1.5 text-red-500 hover:bg-red-50"><Trash2 className="h-4 w-4" /></button>
              </div>
            </div>
          )}
        </div>
      ))}

      {adding ? (
        <div className="space-y-3 rounded-xl border border-emerald-200 bg-emerald-50 p-4">
          {[
            { key: "slug", label: "Slug" },
            { key: "title", label: "العنوان" },
            { key: "category", label: "التصنيف" },
            { key: "readTime", label: "مدة القراءة" },
            { key: "excerpt", label: "المقتطف" },
          ].map((field) => (
            <label key={field.key} className="block space-y-1">
              <span className="text-xs text-muted-fg">{field.label}</span>
              <input className="form-input" value={newPost[field.key as keyof typeof newPost]} onChange={(e) => setNewPost((v) => ({ ...v, [field.key]: e.target.value }))} />
            </label>
          ))}
          <textarea className="form-input resize-none" rows={5} placeholder="المحتوى" value={newPost.body} onChange={(e) => setNewPost((v) => ({ ...v, body: e.target.value }))} />
          <div className="flex gap-2">
            <button onClick={addPost} disabled={saving} className="rounded-xl bg-emerald-500 px-3 py-1.5 text-sm text-white">إضافة</button>
            <button onClick={() => setAdding(false)} className="rounded-xl border px-3 py-1.5 text-sm">إلغاء</button>
          </div>
        </div>
      ) : (
        <button onClick={() => setAdding(true)} className="inline-flex items-center gap-2 rounded-xl border border-dashed border-slate-300 px-4 py-2 text-sm text-muted-fg hover:border-emerald-400 hover:text-emerald-600">
          <Plus className="h-4 w-4" /> إضافة مقال
        </button>
      )}
    </div>
  );
}
