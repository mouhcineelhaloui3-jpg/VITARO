import { getSiteChrome } from "@/lib/cms/site";

import { ConditionalSiteChrome } from "./conditional-site-chrome";

export async function StorefrontChrome({ children }: { children: React.ReactNode }) {
  const chrome = await getSiteChrome();

  return <ConditionalSiteChrome chrome={chrome}>{children}</ConditionalSiteChrome>;
}
