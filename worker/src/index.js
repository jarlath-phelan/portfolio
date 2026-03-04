/**
 * Cloudflare Worker proxy for the "Pick One and Apply" form.
 *
 * Accepts a POST with { company, role, url, posting_text, location }
 * and forwards it as a repository_dispatch to GitHub using a server-side PAT.
 */

const ALLOWED_ORIGIN = "https://jarlath-phelan.github.io";
const GITHUB_REPO = "jarlath-phelan/job-search";

const CORS_HEADERS = {
  "Access-Control-Allow-Origin": ALLOWED_ORIGIN,
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type",
};

export default {
  async fetch(request, env) {
    if (request.method === "OPTIONS") {
      return new Response(null, { status: 204, headers: CORS_HEADERS });
    }

    if (request.method !== "POST") {
      return new Response("Method not allowed", { status: 405, headers: CORS_HEADERS });
    }

    try {
      const body = await request.json();

      if (!body.company || !body.role) {
        return new Response(
          JSON.stringify({ error: "company and role are required" }),
          { status: 400, headers: { ...CORS_HEADERS, "Content-Type": "application/json" } }
        );
      }

      const ghResp = await fetch(
        `https://api.github.com/repos/${GITHUB_REPO}/dispatches`,
        {
          method: "POST",
          headers: {
            Accept: "application/vnd.github+json",
            Authorization: `Bearer ${env.GH_DISPATCH_TOKEN}`,
            "X-GitHub-Api-Version": "2022-11-28",
            "User-Agent": "apply-dispatch-worker",
          },
          body: JSON.stringify({
            event_type: "tailor_application",
            client_payload: {
              company: body.company,
              role: body.role,
              url: body.url || "",
              posting_text: body.posting_text || "",
              location: body.location || "",
            },
          }),
        }
      );

      if (ghResp.status === 204) {
        return new Response(
          JSON.stringify({ ok: true }),
          { status: 200, headers: { ...CORS_HEADERS, "Content-Type": "application/json" } }
        );
      }

      const errText = await ghResp.text();
      return new Response(
        JSON.stringify({ error: `GitHub API returned ${ghResp.status}`, detail: errText }),
        { status: 502, headers: { ...CORS_HEADERS, "Content-Type": "application/json" } }
      );
    } catch (err) {
      return new Response(
        JSON.stringify({ error: err.message }),
        { status: 500, headers: { ...CORS_HEADERS, "Content-Type": "application/json" } }
      );
    }
  },
};
