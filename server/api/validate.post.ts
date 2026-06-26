// Proxies an uploaded invoice to the validator service (the container in validator/). This keeps the
// browser same-origin and the validator itself off the public internet - this route is its only door.
// proxyRequest streams the upload body straight through, so large PDFs never buffer in this layer.

// Generous ceiling for an invoice PDF; rejecting oversized uploads at the door keeps the validator
// from chewing on them. Checked via Content-Length so we stay streaming (a chunked upload without the
// header slips past this guard - the validator service enforces its own hard limit as the backstop).
const MAX_UPLOAD_BYTES = 15 * 1024 * 1024;

export default defineEventHandler(async (event) => {
  const declaredLength = Number(getHeader(event, "content-length") ?? 0);
  if (declaredLength > MAX_UPLOAD_BYTES) {
    setResponseStatus(event, 413);
    return { error: "That file is too large. Invoices are usually well under 15 MB." };
  }

  const base = process.env.VALIDATOR_URL || "http://localhost:4000";
  try {
    return await proxyRequest(event, `${base}/validate`);
  } catch {
    setResponseStatus(event, 502);
    return { error: "The validator is not reachable right now. Please try again shortly." };
  }
});
