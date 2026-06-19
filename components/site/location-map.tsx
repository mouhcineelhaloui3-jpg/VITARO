type LocationMapProps = {
  title?: string;
  subtitle?: string;
  /** Display label under the map */
  locationLabel?: string;
  /** Google Maps query, e.g. "Beni Mellal, Morocco" */
  query?: string;
  zoom?: number;
};

const DEFAULT_QUERY = "Beni Mellal, Morocco";
const DEFAULT_LABEL = "بني ملال، المغرب";

function buildEmbedUrl(query: string, zoom: number) {
  const params = new URLSearchParams({
    q: query,
    hl: "ar",
    z: String(zoom),
  });
  return `https://maps.google.com/maps?${params.toString()}&output=embed`;
}

function buildMapsLink(query: string) {
  const params = new URLSearchParams({
    api: "1",
    query,
  });
  return `https://www.google.com/maps/search/?${params.toString()}`;
}

export function LocationMap({
  title = "بني ملال، المغرب",
  subtitle = "موقعنا في قلب المغرب — بني ملال.",
  locationLabel = DEFAULT_LABEL,
  query = DEFAULT_QUERY,
  zoom = 13,
}: LocationMapProps) {
  const embedUrl = buildEmbedUrl(query, zoom);
  const mapsLink = buildMapsLink(query);

  return (
    <div className="overflow-hidden rounded-[1.75rem] border border-border bg-card shadow-sm">
      <div className="border-b border-border px-6 py-5">
        <h2 className="text-xl font-bold tracking-tight text-heading">{title}</h2>
        <p className="mt-1 text-sm text-body">{subtitle}</p>
      </div>

      <div className="relative aspect-[16/10] w-full min-h-[22rem] bg-section-bg sm:min-h-[26rem]">
        <iframe
          title={`خريطة ${locationLabel}`}
          src={embedUrl}
          className="absolute inset-0 h-full w-full border-0"
          loading="lazy"
          allowFullScreen
          referrerPolicy="no-referrer-when-downgrade"
        />
      </div>

      <div className="flex flex-wrap items-center justify-between gap-3 border-t border-border px-6 py-4 text-sm">
        <p className="font-medium text-heading">{locationLabel}</p>
        <a
          href={mapsLink}
          target="_blank"
          rel="noopener noreferrer"
          className="font-semibold text-emerald-700 transition hover:text-emerald-800 hover:underline"
        >
          فتح في خرائط جوجل
        </a>
      </div>
    </div>
  );
}
