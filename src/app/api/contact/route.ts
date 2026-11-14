import { z } from "zod";

import { getServerEnv } from "@/env";
import { ApiError, handle } from "@/lib/api";

/**
 * Example `app/api` endpoint — a contact / lead submission.
 *
 * Demonstrates the convention: the handler owns the work — it validates input,
 * reads a secret env var, and calls an upstream service inline. Secrets are
 * safe here because `route.ts` is never bundled to the browser.
 */

// Request schema — kept in the route since it isn't shared. Lift to a shared
// module only once another route needs it.
const contactSchema = z.object({
  name: z.string().min(1).max(100),
  email: z.email(),
  message: z.string().min(1).max(2000),
});

export const POST = handle(async (req) => {
  const input = contactSchema.parse(await req.json());

  const { CONTACT_ENDPOINT } = getServerEnv();

  if (CONTACT_ENDPOINT) {
    // Forward the lead to the configured upstream (CRM, webhook, …).
    const upstream = await fetch(CONTACT_ENDPOINT, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify(input),
    });
    if (!upstream.ok) {
      throw new ApiError(502, "upstream_error", "Failed to deliver the message.");
    }
  } else if (process.env.NODE_ENV === "production") {
    // No upstream in production: refuse rather than report success. A silent
    // `{ received: true }` here would drop every lead (and `removeConsole`
    // strips any log line from the production bundle).
    throw new ApiError(
      503,
      "not_configured",
      "The contact form is not configured yet.",
    );
  } else {
    // Development without an upstream — note the submission without logging
    // personal data (no name or email in server logs).
    console.info("[api/contact] dev submission received (CONTACT_ENDPOINT unset)", {
      messageLength: input.message.length,
    });
  }

  return { received: true };
});
