import { env } from "~/env";

export const dynamic = "force-dynamic";

const HOP_BY_HOP_HEADERS = new Set([
  "connection",
  "content-length",
  "host",
  "keep-alive",
  "proxy-authenticate",
  "proxy-authorization",
  "te",
  "trailer",
  "transfer-encoding",
  "upgrade",
]);

function backendBaseUrl() {
  return env.NEURO_API_BASE_URL ?? env.NEXT_PUBLIC_API_BASE_URL;
}

function buildBackendUrl(request: Request) {
  const baseUrl = backendBaseUrl();
  if (!baseUrl) {
    return null;
  }

  const requestUrl = new URL(request.url);
  return new URL(`${requestUrl.pathname}${requestUrl.search}`, baseUrl);
}

function forwardHeaders(headers: Headers) {
  const nextHeaders = new Headers();

  for (const [key, value] of headers.entries()) {
    if (HOP_BY_HOP_HEADERS.has(key.toLowerCase())) {
      continue;
    }

    nextHeaders.set(key, value);
  }

  return nextHeaders;
}

async function proxy(request: Request): Promise<Response> {
  const targetUrl = buildBackendUrl(request);
  if (!targetUrl) {
    return Response.json(
      {
        error: "API backend not configured",
        suggestion:
          "Set NEURO_API_BASE_URL for server-side proxying or NEXT_PUBLIC_API_BASE_URL as a fallback.",
      },
      { status: 503 },
    );
  }

  try {
    const method = request.method.toUpperCase();
    const upstreamResponse = await fetch(targetUrl, {
      method,
      headers: forwardHeaders(request.headers),
      body:
        method === "GET" || method === "HEAD"
          ? undefined
          : await request.arrayBuffer(),
      redirect: "manual",
      cache: "no-store",
    });

    return new Response(upstreamResponse.body, {
      status: upstreamResponse.status,
      headers: upstreamResponse.headers,
    });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Unknown upstream error";

    return Response.json(
      {
        error: "API proxy request failed",
        details: { message, target: targetUrl.toString() },
      },
      { status: 502 },
    );
  }
}

export { proxy as GET, proxy as POST, proxy as OPTIONS, proxy as HEAD };
