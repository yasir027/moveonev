/**
 * Sends a website form to the showroom's inbox through Web3Forms. Both forms use it: the
 * test-ride booking (GetInTouch, home page and /models) and the contact page's enquiry form.
 *
 * The access key is registered to moveonevmoto@gmail.com, so every submission is emailed
 * there. It is meant to sit in the browser (Web3Forms' free plan only takes browser
 * submissions) and lives in .env.local, which git ignores. Setup steps are in the README.
 */
const WEB3FORMS_KEY = process.env.NEXT_PUBLIC_WEB3FORMS_KEY;

export async function sendEnquiry({
  subject,
  name,
  phone,
  email,
  fields = {},
}: {
  subject: string;
  name: string;
  phone: string;
  /** Optional. When given, Web3Forms makes it the reply-to, so "Reply" in Gmail reaches the customer. */
  email?: string;
  /** Anything else the form asked, as label: value. Each becomes a line in the email. */
  fields?: Record<string, string>;
}) {
  if (!WEB3FORMS_KEY) {
    console.warn("Enquiry form: NEXT_PUBLIC_WEB3FORMS_KEY is not set (see README).");
    throw new Error("Web3Forms key missing");
  }

  // FormData, not JSON: with no Content-Type of our own this is a "simple" cross-origin
  // request, so the browser skips the OPTIONS pre-check that Web3Forms' Cloudflare can
  // challenge. Web3Forms still answers in JSON.
  const body = new FormData();
  const entries: Record<string, string> = {
    access_key: WEB3FORMS_KEY,
    subject,
    from_name: "MOVE ON website",
    name,
    phone,
    ...(email ? { email } : {}),
    ...fields,
  };
  for (const [key, value] of Object.entries(entries)) body.append(key, value);

  const res = await fetch("https://api.web3forms.com/submit", {
    method: "POST",
    headers: { Accept: "application/json" },
    body,
  });
  const data: { success?: boolean } = await res.json();
  if (!res.ok || !data.success) throw new Error("Web3Forms rejected the enquiry");
}
