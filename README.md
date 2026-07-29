# Holistic Harmony

**Holistic Harmony** is a single workspace for intentional room-design guidance. It brings a user's uploaded room image, selected design focus, and follow-up questions into one continuous conversation, rather than separating the experience into disconnected tools or simulated result screens.

The interface contains no prewritten analysis, sample chat replies, fabricated scores, or placeholder room findings. Guidance appears only after the live server endpoint receives a user request and returns a response from the configured model provider.

## Application capabilities

| Capability | Implementation |
| --- | --- |
| Unified conversation | The user keeps an evolving guidance thread in one workspace. The selected focus remains available to each live request. |
| Optional room-image context | A user can attach a PNG, JPEG, or WebP room image up to 6 MB. The image is sent only with a guidance request. |
| Live server endpoint | Express validates the request and calls an OpenAI-compatible chat-completions endpoint from the server only. No API key is exposed to the browser. |
| Brand assets | The visual-direction modal uses the generated Holistic Harmony logo, AR preview, brand-identity board, and whole-home flow presentation. |

> **Important:** Feng Shui-inspired perspectives are framed as optional design lenses, not medical, scientific, financial, or guaranteed claims. The guidance system is instructed to distinguish visible details from interpretive suggestions.

## Run locally

Install the locked dependencies and start the Vite development server:

```bash
pnpm install --frozen-lockfile
pnpm dev
```

Create a production-style build and serve it through Express:

```bash
pnpm build
NODE_ENV=production pnpm start
```

## Configure live guidance

The conversation endpoint is intentionally server-side. Configure these environment variables in the environment running the Express server:

| Variable | Required | Purpose |
| --- | --- | --- |
| `OPENAI_API_BASE` | Yes | Base URL for an OpenAI-compatible API. A URL ending in `/v1` or a base URL without it is accepted. |
| `OPENAI_API_KEY` | Yes | Server-only API credential. Never prefix it with `VITE_` or put it in browser source. |
| `HOLISTIC_HARMONY_MODEL` | No | Model ID used by the endpoint. The default is `gemini-3-flash-preview`. |
| `PORT` | No | HTTP server port. Defaults to `3000`. |

The live endpoint is `POST /api/guidance`. It accepts validated conversation messages and an optional base64-encoded room image. If the service is not configured or returns an error, the interface displays the actual error rather than inventing a response.

## Key project files

```text
attached_assets/                         Generated Holistic Harmony visual assets
client/src/pages/Home.tsx                Unified guidance workspace
client/src/index.css                     Brand design system and responsive layout
server/index.ts                          Request validation, live model call, static server
```

## Quality and privacy

The client limits image selection to PNG, JPEG, and WebP files smaller than 6 MB. The server repeats that validation, allows no more than 16 messages per request, and does not write the image data or conversation to disk. Provider-side handling is governed by the provider configured through the server environment.
