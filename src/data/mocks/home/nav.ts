/**
 * 01 Navigation — Figma 3488:21037. Copy is verbatim from the frame; `code`
 * and `note` only feed the 390 menu card (not in Figma, user-picked variant).
 */
export const navMock = {
  brand: { name: "Relay", href: "/" },
  links: [
    {
      label: "Product",
      href: "#product",
      code: "PR",
      note: "Canvas, approvals, run history",
    },
    {
      label: "How it works",
      href: "#how-it-works",
      code: "HW",
      note: "From trigger to answer",
    },
    {
      label: "Customers",
      href: "#customers",
      code: "CU",
      note: "Numbers we did not explain away",
    },
    {
      label: "Pricing",
      href: "#pricing",
      code: "$",
      note: "Pay for runs, not seats",
    },
  ],
  status: "all systems normal",
  cta: { label: "Start free", href: "#start" },
} as const;

export type NavContent = typeof navMock;
