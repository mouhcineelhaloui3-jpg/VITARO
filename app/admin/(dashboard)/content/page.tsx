"use client";

import { useState, useCallback } from "react";
import useSWR, { mutate } from "swr";
import {
  Check,
  ChevronDown,
  ChevronUp,
  ExternalLink,
  Eye,
  Loader2,
  MessageCircle,
  Package,
  Plus,
  Settings,
  Star,
  Trash2,
  AlignLeft,
  Home,
  Globe,
  Menu,
  PanelBottom,
  BookOpen,
  Megaphone,
} from "lucide-react";
import { Card } from "@/components/ui/card";
import { brand as staticBrand, faqs as staticFaqs, testimonials as staticTestimonials } from "@/lib/data/content";
import {
  AnnouncementSection,
  BlogSection,
  FooterSection,
  HeaderSection,
  HomeSectionsPanel,
  NavigationSection,
} from "@/features/admin/site-cms-sections";

const fetcher = (url: string) => fetch(url).then((r) => (r.ok ? r.json() : []));

type ConfigItem = { id: string; key: string; value: string; group: string };
type TestimonialItem = { id: string; name: string; role?: string; quote: string; rating: number; active: boolean };
type FaqItem = { id: string; question: string; answer: string; active: boolean };

// ─── Inline save helper ────────────────────────────────────────────────────

async function saveSettings(items: { key: string; value: string; group: string }[]) {
  const res = await fetch("/api/admin/cms/settings", {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(items),
  });
  return res.ok;
}

async function saveContentBlocks(blocks: { page: string; section: string; key: string; value: string }[]) {
  const res = await fetch("/api/admin/cms/content", {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(blocks),
  });
  return res.ok;
}

// ─── Seed Banner ────────────────────────────────────────────────────────────

function SeedBanner({ onDone }: { onDone: () => void }) {
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function runSeed() {
    setLoading(true);
    setError(null);
    const res = await fetch("/api/admin/cms/seed", { method: "POST" });
    setLoading(false);
    if (res.ok) {
      setDone(true);
      onDone();
      return;
    }
    const payload = (await res.json().catch(() => null)) as { error?: string } | null;
    setError(payload?.error ?? "تعذّر التهيئة. أضف DATABASE_URL في Vercel ثم أعد النشر.");
  }

  if (done) return null;

  return (
    <div className="flex items-center justify-between rounded-2xl border border-emerald-200 bg-emerald-50 px-5 py-4 dark:border-emerald-500/20 dark:bg-emerald-500/10">
      <div>
        <p className="font-medium text-emerald-800 dark:text-emerald-300">
          استورد البيانات من الملفات الثابتة إلى قاعدة البيانات
        </p>
        <p className="mt-0.5 text-sm text-emerald-700 dark:text-emerald-400">
          سيتم نقل المنتجات، التقييمات، الأسئلة، وإعدادات العلامة إلى قاعدة البيانات لتمكين التعديل الكامل.
        </p>
        {error ? <p className="mt-2 text-sm text-red-600">{error}</p> : null}
      </div>
      <button
        onClick={runSeed}
        disabled={loading}
        className="ml-4 shrink-0 flex items-center gap-2 rounded-xl bg-emerald-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-emerald-700 disabled:opacity-60"
      >
        {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Plus className="h-4 w-4" />}
        {loading ? "جاري الاستيراد..." : "استورد الآن"}
      </button>
    </div>
  );
}

// ─── Settings Section ────────────────────────────────────────────────────────

function SettingsSection({ configs }: { configs: ConfigItem[] }) {
  const brandKeys = ["name", "tagline", "description", "supportEmail", "whatsapp", "address"];
  const brandRecord: Record<string, string> = {
    name: staticBrand.name,
    tagline: staticBrand.tagline,
    description: staticBrand.description,
    supportEmail: staticBrand.supportEmail,
    whatsapp: staticBrand.whatsapp,
    address: staticBrand.address,
  };
  const current = (key: string) =>
    configs.find((c) => c.key === key)?.value ?? brandRecord[key] ?? "";

  const [values, setValues] = useState<Record<string, string>>(
    Object.fromEntries(brandKeys.map((k) => [k, current(k)])),
  );
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  async function handleSave() {
    setSaving(true);
    const ok = await saveSettings(brandKeys.map((k) => ({ key: k, value: values[k] ?? "", group: "brand" })));
    setSaving(false);
    if (ok) {
      setSaved(true);
      setTimeout(() => setSaved(false), 2500);
      await mutate("/api/admin/cms/settings");
    }
  }

  const fields: { key: string; label: string; multiline?: boolean }[] = [
    { key: "name", label: "اسم الموقع" },
    { key: "tagline", label: "الشعار (Tagline)" },
    { key: "description", label: "الوصف", multiline: true },
    { key: "supportEmail", label: "البريد الإلكتروني" },
    { key: "whatsapp", label: "رقم واتساب" },
    { key: "address", label: "العنوان" },
  ];

  return (
    <div className="space-y-4">
      <div className="grid gap-4 sm:grid-cols-2">
        {fields.map((f) => (
          <label key={f.key} className={`block space-y-1.5${f.multiline ? " sm:col-span-2" : ""}`}>
            <span className="text-xs font-medium text-muted-fg">{f.label}</span>
            {f.multiline ? (
              <textarea
                rows={3}
                className="form-input resize-none"
                value={values[f.key] ?? ""}
                onChange={(e) => setValues((v) => ({ ...v, [f.key]: e.target.value }))}
              />
            ) : (
              <input
                className="form-input"
                value={values[f.key] ?? ""}
                onChange={(e) => setValues((v) => ({ ...v, [f.key]: e.target.value }))}
              />
            )}
          </label>
        ))}
      </div>
      <SaveBar saving={saving} saved={saved} onSave={handleSave} />
    </div>
  );
}

// ─── Hero Section ─────────────────────────────────────────────────────────

function HeroSection({ blocks }: { blocks: { page: string; section: string; key: string; value: string }[] }) {
  const heroKeys = [
    { key: "badge", label: "شارة الهيرو (Badge)" },
    { key: "title", label: "العنوان الرئيسي" },
    { key: "subtitle", label: "الوصف" },
    { key: "cta_whatsapp", label: "زر واتساب" },
    { key: "cta_buy", label: "زر الشراء" },
  ];
  const defaults: Record<string, string> = {
    badge: "الميزان الذكي رقم 1 فالمغرب",
    title: "عرف جسمك بزاف ديال التفاصيل، فثواني.",
    subtitle: "ميزان ذكي كيقيس ليك الوزن، الشحم، العضلات، الماء وأكثر من 13 مؤشر.",
    cta_whatsapp: "طلب عبر واتساب",
    cta_buy: "شري دابا",
  };

  const currentVal = (key: string) =>
    blocks.find((b) => b.page === "home" && b.section === "hero" && b.key === key)?.value ??
    defaults[key] ??
    "";

  const [values, setValues] = useState<Record<string, string>>(
    Object.fromEntries(heroKeys.map((f) => [f.key, currentVal(f.key)])),
  );
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  async function handleSave() {
    setSaving(true);
    const ok = await saveContentBlocks(
      heroKeys.map((f) => ({ page: "home", section: "hero", key: f.key, value: values[f.key] ?? "" })),
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
      <div className="grid gap-4 sm:grid-cols-2">
        {heroKeys.map((f) => (
          <label key={f.key} className={`block space-y-1.5${f.key === "title" || f.key === "subtitle" ? " sm:col-span-2" : ""}`}>
            <span className="text-xs font-medium text-muted-fg">{f.label}</span>
            <input
              className="form-input"
              value={values[f.key] ?? ""}
              onChange={(e) => setValues((v) => ({ ...v, [f.key]: e.target.value }))}
            />
          </label>
        ))}
      </div>
      <SaveBar saving={saving} saved={saved} onSave={handleSave} />
    </div>
  );
}

// ─── Testimonials Section ─────────────────────────────────────────────────

function TestimonialsSection() {
  const { data: dbItems, isLoading } = useSWR<TestimonialItem[]>("/api/admin/cms/testimonials", fetcher);
  const displayItems = dbItems && dbItems.length > 0 ? dbItems : staticTestimonials.map((t, i) => ({ id: String(i), ...t, active: true }));

  const [editing, setEditing] = useState<string | null>(null);
  const [editValues, setEditValues] = useState<Partial<TestimonialItem>>({});
  const [saving, setSaving] = useState(false);

  async function saveEdit(id: string) {
    setSaving(true);
    await fetch(`/api/admin/cms/testimonials/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(editValues),
    });
    setSaving(false);
    setEditing(null);
    await mutate("/api/admin/cms/testimonials");
  }

  async function deleteItem(id: string) {
    await fetch(`/api/admin/cms/testimonials/${id}`, { method: "DELETE" });
    await mutate("/api/admin/cms/testimonials");
  }

  if (isLoading) return <div className="py-4 text-center text-sm text-subtle"><Loader2 className="inline h-4 w-4 animate-spin" /></div>;

  return (
    <div className="space-y-3">
      {displayItems.map((t) => (
        <div key={t.id} className="rounded-xl border border-slate-100 bg-white dark:border-white/5 dark:bg-white/8 overflow-hidden">
          {editing === t.id ? (
            <div className="space-y-3 p-4">
              <div className="grid gap-3 sm:grid-cols-2">
                <label className="block space-y-1">
                  <span className="text-xs text-muted-fg">الاسم</span>
                  <input className="form-input" defaultValue={t.name} onChange={(e) => setEditValues((v) => ({ ...v, name: e.target.value }))} />
                </label>
                <label className="block space-y-1">
                  <span className="text-xs text-muted-fg">الدور</span>
                  <input className="form-input" defaultValue={t.role} onChange={(e) => setEditValues((v) => ({ ...v, role: e.target.value }))} />
                </label>
              </div>
              <label className="block space-y-1">
                <span className="text-xs text-muted-fg">التعليق</span>
                <textarea className="form-input resize-none" rows={3} defaultValue={t.quote} onChange={(e) => setEditValues((v) => ({ ...v, quote: e.target.value }))} />
              </label>
              <div className="flex gap-2">
                <button onClick={() => saveEdit(t.id)} disabled={saving} className="flex items-center gap-2 rounded-xl bg-emerald-500 px-3 py-1.5 text-sm text-white hover:bg-emerald-600 disabled:opacity-60">
                  {saving ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Check className="h-3.5 w-3.5" />} حفظ
                </button>
                <button onClick={() => setEditing(null)} className="rounded-xl border border-slate-200 px-3 py-1.5 text-sm dark:border-white/10">إلغاء</button>
              </div>
            </div>
          ) : (
            <div className="flex items-start justify-between gap-3 p-4">
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-medium text-heading">{t.name}</span>
                  <span className="text-xs text-subtle">{t.role}</span>
                </div>
                <p className="mt-1 text-sm text-body line-clamp-2">{t.quote}</p>
                <span className="mt-1 block text-xs text-amber-400">{"★".repeat(t.rating)}</span>
              </div>
              <div className="flex shrink-0 items-center gap-1">
                <button onClick={() => { setEditing(t.id); setEditValues({}); }} className="rounded-lg p-1.5 text-subtle hover:bg-slate-100 hover:text-slate-700 dark:hover:bg-white/10">
                  <Settings className="h-3.5 w-3.5" />
                </button>
                {dbItems && dbItems.length > 0 && (
                  <button onClick={() => deleteItem(t.id)} className="rounded-lg p-1.5 text-subtle hover:bg-red-50 hover:text-red-500 dark:hover:bg-red-500/10">
                    <Trash2 className="h-3.5 w-3.5" />
                  </button>
                )}
              </div>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}

// ─── FAQ Section ──────────────────────────────────────────────────────────

function FaqSection() {
  const { data: dbItems, isLoading } = useSWR<FaqItem[]>("/api/admin/cms/faqs", fetcher);
  const displayItems = dbItems && dbItems.length > 0 ? dbItems : staticFaqs.map((f, i) => ({ id: String(i), ...f, active: true }));
  const [editing, setEditing] = useState<string | null>(null);
  const [editValues, setEditValues] = useState<Partial<FaqItem>>({});
  const [saving, setSaving] = useState(false);
  const [adding, setAdding] = useState(false);
  const [newFaq, setNewFaq] = useState({ question: "", answer: "" });

  async function saveEdit(id: string) {
    setSaving(true);
    await fetch(`/api/admin/cms/faqs/${id}`, { method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify(editValues) });
    setSaving(false);
    setEditing(null);
    await mutate("/api/admin/cms/faqs");
  }

  async function deleteItem(id: string) {
    await fetch(`/api/admin/cms/faqs/${id}`, { method: "DELETE" });
    await mutate("/api/admin/cms/faqs");
  }

  async function addFaq() {
    if (!newFaq.question || !newFaq.answer) return;
    setSaving(true);
    await fetch("/api/admin/cms/faqs", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ ...newFaq, sortOrder: displayItems.length }) });
    setSaving(false);
    setAdding(false);
    setNewFaq({ question: "", answer: "" });
    await mutate("/api/admin/cms/faqs");
  }

  if (isLoading) return <div className="py-4 text-center text-sm text-subtle"><Loader2 className="inline h-4 w-4 animate-spin" /></div>;

  return (
    <div className="space-y-3">
      {displayItems.map((f) => (
        <div key={f.id} className="rounded-xl border border-slate-100 bg-white dark:border-white/5 dark:bg-white/8 overflow-hidden">
          {editing === f.id ? (
            <div className="space-y-3 p-4">
              <label className="block space-y-1"><span className="text-xs text-muted-fg">السؤال</span><input className="form-input" defaultValue={f.question} onChange={(e) => setEditValues((v) => ({ ...v, question: e.target.value }))} /></label>
              <label className="block space-y-1"><span className="text-xs text-muted-fg">الجواب</span><textarea className="form-input resize-none" rows={4} defaultValue={f.answer} onChange={(e) => setEditValues((v) => ({ ...v, answer: e.target.value }))} /></label>
              <div className="flex gap-2">
                <button onClick={() => saveEdit(f.id)} disabled={saving} className="flex items-center gap-2 rounded-xl bg-emerald-500 px-3 py-1.5 text-sm text-white hover:bg-emerald-600 disabled:opacity-60">
                  {saving ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Check className="h-3.5 w-3.5" />} حفظ
                </button>
                <button onClick={() => setEditing(null)} className="rounded-xl border border-slate-200 px-3 py-1.5 text-sm dark:border-white/10">إلغاء</button>
              </div>
            </div>
          ) : (
            <div className="flex items-start justify-between gap-3 p-4">
              <div>
                <p className="font-medium text-heading">{f.question}</p>
                <p className="mt-1 text-sm text-muted-fg line-clamp-2">{f.answer}</p>
              </div>
              <div className="flex shrink-0 items-center gap-1">
                <button onClick={() => { setEditing(f.id); setEditValues({}); }} className="rounded-lg p-1.5 text-subtle hover:bg-slate-100 hover:text-slate-700 dark:hover:bg-white/10"><Settings className="h-3.5 w-3.5" /></button>
                {dbItems && dbItems.length > 0 && (
                  <button onClick={() => deleteItem(f.id)} className="rounded-lg p-1.5 text-subtle hover:bg-red-50 hover:text-red-500 dark:hover:bg-red-500/10"><Trash2 className="h-3.5 w-3.5" /></button>
                )}
              </div>
            </div>
          )}
        </div>
      ))}

      {adding ? (
        <div className="rounded-xl border border-emerald-200 bg-emerald-50 p-4 dark:border-emerald-500/20 dark:bg-emerald-500/10 space-y-3">
          <label className="block space-y-1"><span className="text-xs text-muted-fg">السؤال الجديد</span><input className="form-input" value={newFaq.question} onChange={(e) => setNewFaq((v) => ({ ...v, question: e.target.value }))} /></label>
          <label className="block space-y-1"><span className="text-xs text-muted-fg">الجواب</span><textarea className="form-input resize-none" rows={3} value={newFaq.answer} onChange={(e) => setNewFaq((v) => ({ ...v, answer: e.target.value }))} /></label>
          <div className="flex gap-2">
            <button onClick={addFaq} disabled={saving} className="flex items-center gap-2 rounded-xl bg-emerald-500 px-3 py-1.5 text-sm text-white hover:bg-emerald-600 disabled:opacity-60"><Plus className="h-3.5 w-3.5" /> إضافة</button>
            <button onClick={() => setAdding(false)} className="rounded-xl border border-slate-200 px-3 py-1.5 text-sm dark:border-white/10">إلغاء</button>
          </div>
        </div>
      ) : (
        <button onClick={() => setAdding(true)} className="flex w-full items-center justify-center gap-2 rounded-xl border border-dashed border-slate-300 py-3 text-sm text-muted-fg hover:border-emerald-400 hover:text-emerald-600 dark:border-white/10 dark:hover:border-emerald-500">
          <Plus className="h-4 w-4" /> إضافة سؤال جديد
        </button>
      )}
    </div>
  );
}

// ─── Save Bar ─────────────────────────────────────────────────────────────

function SaveBar({ saving, saved, onSave }: { saving: boolean; saved: boolean; onSave: () => void }) {
  return (
    <div className="flex items-center gap-3">
      <button
        onClick={onSave}
        disabled={saving}
        className="flex items-center gap-2 rounded-xl bg-emerald-500 px-4 py-2 text-sm font-medium text-white transition hover:bg-emerald-600 disabled:opacity-60"
      >
        {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : saved ? <Check className="h-4 w-4" /> : null}
        {saving ? "جاري الحفظ..." : saved ? "تم الحفظ ✓" : "حفظ التغييرات"}
      </button>
    </div>
  );
}

// ─── Main Component ──────────────────────────────────────────────────────

const SECTIONS = [
  { key: "settings", label: "إعدادات الموقع", icon: Settings, route: "/" },
  { key: "header", label: "الهيدر والشعار", icon: Menu, route: "/" },
  { key: "navigation", label: "قائمة التنقل", icon: Globe, route: "/" },
  { key: "announcement", label: "شريط الإعلانات", icon: Megaphone, route: "/" },
  { key: "hero", label: "الصفحة الرئيسية (Hero)", icon: Home, route: "/" },
  { key: "home-sections", label: "أقسام الصفحة الرئيسية", icon: Package, route: "/" },
  { key: "footer", label: "الفوتر", icon: PanelBottom, route: "/" },
  { key: "blog", label: "المدونة", icon: BookOpen, route: "/blog" },
  { key: "testimonials", label: "تقييمات الزبناء", icon: Star, route: "/#reviews" },
  { key: "faq", label: "الأسئلة الشائعة", icon: AlignLeft, route: "/#faq" },
];

export default function AdminContentPage() {
  const { data: configs = [] } = useSWR<ConfigItem[]>("/api/admin/cms/settings", fetcher);
  const { data: contentBlocks = [] } = useSWR("/api/admin/cms/content", fetcher);
  const [open, setOpen] = useState<string>("settings");
  const [seeded, setSeeded] = useState(false);

  const handleSeedDone = useCallback(() => {
    setSeeded(true);
    mutate("/api/admin/cms/settings");
    mutate("/api/admin/cms/content");
    mutate("/api/admin/cms/testimonials");
    mutate("/api/admin/cms/faqs");
    mutate("/api/admin/cms/blog");
  }, []);

  const hasConfigs = configs.length > 0;
  const headerConfigs = configs.filter((c) => c.group === "header");
  const footerConfigs = configs.filter((c) => c.group === "footer");
  const navConfigs = configs.filter((c) => c.group === "nav");

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-heading">المحتوى والصفحات</h1>
          <p className="text-sm text-muted-fg">تعديل جميع نصوص وإعدادات الموقع مباشرة.</p>
        </div>
        <a href="/" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-700 transition hover:border-emerald-300 hover:text-emerald-700 dark:border-white/10 dark:bg-white/5 dark:text-slate-200">
          <Eye className="h-4 w-4" />
          معاينة الموقع
        </a>
      </div>

      {!hasConfigs && !seeded && <SeedBanner onDone={handleSeedDone} />}

      <div className="space-y-2">
        {SECTIONS.map((section) => {
          const isOpen = open === section.key;
          return (
            <Card key={section.key} className="overflow-hidden">
              <button
                onClick={() => setOpen(isOpen ? "" : section.key)}
                className="flex w-full items-center gap-3 p-4 text-right transition hover:bg-slate-50 dark:hover:bg-white/5"
              >
                <span className="grid h-9 w-9 shrink-0 place-items-center rounded-xl bg-emerald-50 text-emerald-600 dark:bg-emerald-500/10 dark:text-emerald-400">
                  <section.icon className="h-4 w-4" />
                </span>
                <span className="flex-1 font-medium text-heading">{section.label}</span>
                <a href={section.route} target="_blank" rel="noopener noreferrer" onClick={(e) => e.stopPropagation()} className="mr-2 rounded-lg p-1.5 text-subtle hover:text-emerald-600">
                  <ExternalLink className="h-3.5 w-3.5" />
                </a>
                {isOpen ? <ChevronUp className="h-4 w-4 text-subtle" /> : <ChevronDown className="h-4 w-4 text-subtle" />}
              </button>

              {isOpen && (
                <div className="border-t border-slate-100 p-5 dark:border-white/5">
                  {section.key === "settings" && <SettingsSection configs={configs.filter((c) => c.group === "brand")} />}
                  {section.key === "header" && <HeaderSection configs={headerConfigs} />}
                  {section.key === "navigation" && <NavigationSection configs={navConfigs} />}
                  {section.key === "announcement" && <AnnouncementSection blocks={contentBlocks} />}
                  {section.key === "hero" && <HeroSection blocks={contentBlocks} />}
                  {section.key === "home-sections" && <HomeSectionsPanel blocks={contentBlocks} />}
                  {section.key === "footer" && <FooterSection configs={footerConfigs} />}
                  {section.key === "blog" && <BlogSection />}
                  {section.key === "testimonials" && <TestimonialsSection />}
                  {section.key === "faq" && <FaqSection />}
                </div>
              )}
            </Card>
          );
        })}
      </div>
    </div>
  );
}
