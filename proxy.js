// functions/proxy.js — Cloudflare Pages Function
//
// This file lives INSIDE your app's own project folder, in a `functions/`
// subfolder. Cloudflare automatically turns it into a live backend endpoint
// at yoursite.pages.dev/proxy — same domain as the app itself, so there's
// no separate URL to find or paste anywhere, and no CORS to configure
// (same-origin requests don't need CORS headers at all).
//
// SETUP
// 1. Find the line below: const API_KEY = "PASTE_YOUR_ANTHROPIC_API_KEY_HERE";
//    Replace the placeholder with your real key from
//    console.anthropic.com/settings/keys — keep the quotes.
// 2. Deploy this whole folder (index.html + manifest.json + icons + this
//    functions/proxy.js file, all together) to Cloudflare Pages — either by
//    dragging the folder onto "Upload assets", or by pushing it to a GitHub
//    repo and connecting that repo to a new Cloudflare Pages project.
// 3. Open your deployed site, tap "⚙ api endpoint", type exactly: /proxy
//    (just those six characters, not a full URL) — save.
// 4. Upload a chart screenshot to test.

const API_KEY = "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"; // <-- replace this string
const ANTHROPIC_VERSION = "2023-06-01";
const ANTHROPIC_URL = "https://api.anthropic.com/v1/messages";

export async function onRequestPost(context) {
  if (!API_KEY || API_KEY === "PASTE_YOUR_ANTHROPIC_API_KEY_HERE") {
    return new Response(
      JSON.stringify({ error: "No API key set — edit functions/proxy.js and redeploy." }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }

  let body;
  try {
    body = await context.request.text();
  } catch (e) {
    return new Response(JSON.stringify({ error: "Could not read request body" }), {
      status: 400,
      headers: { "Content-Type": "application/json" },
    });
  }

  const upstream = await fetch(ANTHROPIC_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-api-key": API_KEY,
      "anthropic-version": ANTHROPIC_VERSION,
    },
    body,
  });

  const responseBody = await upstream.text();

  return new Response(responseBody, {
    status: upstream.status,
    headers: { "Content-Type": "application/json" },
  });
}

// Same-origin means no CORS preflight in normal use, but handle OPTIONS
// gracefully anyway in case a browser sends one.
export async function onRequestOptions() {
  return new Response(null, { status: 204 });
}
