# Self-contained validator image: Node + a JRE + veraPDF + @jasy/cli, all baked in. The server has
# zero runtime deps (node builtins only) and node:24 runs the .ts directly, so there is no build step.
FROM node:24-bookworm-slim

# A JRE - veraPDF is a Java app (the official ISO 19005 / PDF-A seal). Headless + no recommends = lean.
RUN apt-get update \
  && apt-get install -y --no-install-recommends default-jre-headless ca-certificates \
  && rm -rf /var/lib/apt/lists/*

# The CLI provides the `jasy` binary (the validation engine) AND its veraPDF installer. Pinned for a
# reproducible image - bump the ARG to move the image to a newer CLI.
ARG CLI_VERSION=1.0.0-alpha.3
RUN npm install -g @jasy/cli@${CLI_VERSION}

# Run as the unprivileged `node` user. Installing veraPDF as this user drops it in the home dir where
# findVerapdf() looks (~/.jasy/verapdf), so the runtime user finds it with no extra config.
USER node
RUN jasy verapdf --install

WORKDIR /home/node/app
COPY --chown=node:node server.ts ./server.ts

ENV PORT=4000
EXPOSE 4000
# JASY_BIN defaults to "jasy" (on PATH from the global install); the server spawns it per request.
CMD ["node", "server.ts"]
