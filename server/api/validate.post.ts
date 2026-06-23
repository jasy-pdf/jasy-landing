// Proxies an uploaded invoice to the validator service (the container in validator/). This keeps the
// browser same-origin and the validator itself off the public internet - this route is its only door.
// proxyRequest streams the upload body straight through, so large PDFs never buffer in this layer.
export default defineEventHandler(async (event) => {
  const base = process.env.VALIDATOR_URL || "http://localhost:4000";
  try {
    return await proxyRequest(event, `${base}/validate`);
  } catch {
    setResponseStatus(event, 502);
    return { error: "The validator is not reachable right now. Please try again shortly." };
  }
});
