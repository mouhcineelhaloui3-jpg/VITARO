"use client";

export async function trackEvent(eventName: string, metadata?: Record<string, any>) {
  try {
    const url = typeof window !== "undefined" ? window.location.href : undefined;
    const source = typeof window !== "undefined" ? new URLSearchParams(window.location.search).get("utm_source") || undefined : undefined;

    await fetch("/api/analytics/events", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        eventName,
        url,
        source,
        metadata,
      }),
    });
  } catch {
    // Analytics must never break the storefront experience.
  }
}
