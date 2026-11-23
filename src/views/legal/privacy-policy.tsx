import type { Metadata } from "next";

import { LEGAL_UPDATED, privacyPolicy } from "@/data/mocks/legal";
import { generateMetadata } from "@/utils/seo/generate-page-metadata";
import { siteConfig } from "@/lib/site";

import { LegalDocument } from "./legal-document";

export const privacyPolicyMetadata: Metadata = generateMetadata({
  title: `${privacyPolicy.title} — ${siteConfig.name}`,
  description: privacyPolicy.intro,
  url: "/privacy-policy",
});

export const PrivacyPolicyView = () => (
  <LegalDocument {...privacyPolicy} updated={LEGAL_UPDATED} />
);
