import { unstable_noStore as noStore } from "next/cache";

/** Opt out of static caching so CMS edits appear on the live site immediately. */
export function cmsNoStore(): void {
  noStore();
}
