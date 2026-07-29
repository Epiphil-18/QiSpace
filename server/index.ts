import express from "express";
import { createServer } from "http";
import path from "path";
import { fileURLToPath } from "url";

type ConversationMessage = {
  role: "user" | "assistant";
  content: string;
};

type GuidanceRequest = {
  messages?: ConversationMessage[];
  imageDataUrl?: string;
};

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const MAX_MESSAGES = 16;
const MAX_MESSAGE_LENGTH = 5_000;
const MAX_IMAGE_DATA_URL_LENGTH = 7_000_000;

function getChatCompletionUrl(apiBase: string) {
  const normalizedBase = apiBase.replace(/\/+$/, "");
  return normalizedBase.endsWith("/v1")
    ? `${normalizedBase}/chat/completions`
    : `${normalizedBase}/v1/chat/completions`;
}

function isValidImageDataUrl(value: string) {
  return /^data:image\/(png|jpe?g|webp);base64,[A-Za-z0-9+/=\s]+$/i.test(value);
}

function normalizeMessages(messages: GuidanceRequest["messages"]): ConversationMessage[] | null {
  if (!Array.isArray(messages) || messages.length === 0 || messages.length > MAX_MESSAGES) {
    return null;
  }

  const normalized: ConversationMessage[] = [];
  for (const message of messages) {
    if (
      !message ||
      (message.role !== "user" && message.role !== "assistant") ||
      typeof message.content !== "string"
    ) {
      return null;
    }

    const content = message.content.trim();
    if (!content || content.length > MAX_MESSAGE_LENGTH) {
      return null;
    }

    normalized.push({ role: message.role, content });
  }

  return normalized;
}

async function createGuidanceResponse(
  messages: ConversationMessage[],
  imageDataUrl?: string,
) {
  const apiBase = process.env.OPENAI_API_BASE;
  const apiKey = process.env.OPENAI_API_KEY;
  const model = process.env.HOLISTIC_HARMONY_MODEL || "gemini-3-flash-preview";

  if (!apiBase || !apiKey) {
    const configurationError = new Error(
      "Live guidance is not configured. Set OPENAI_API_BASE and OPENAI_API_KEY on the server before using this feature.",
    );
    (configurationError as Error & { statusCode?: number }).statusCode = 503;
    throw configurationError;
  }

  const systemInstruction = [
    "You are Holistic Harmony, a thoughtful interior-design guide for intentional home environments.",
    "Offer practical, evidence-aware design observations and optional Feng Shui-inspired perspectives.",
    "Do not present Feng Shui or energy concepts as medical, financial, or scientific facts, and do not promise outcomes.",
    "When an image is supplied, distinguish visible observations from interpretive suggestions. Do not invent objects, dimensions, compass directions, rooms, people, or personal details that are not clearly available.",
    "Keep recommendations concrete, reversible when possible, and considerate of the user's stated needs.",
    "Ask a concise clarifying question when necessary instead of filling gaps with assumptions.",
    "Reply in concise plain text with short paragraphs. Do not use Markdown syntax, tables, bullet characters, or numbered-list markers.",
  ].join(" ");

  const upstreamMessages = [
    { role: "system", content: systemInstruction },
    ...messages.map((message, index) => {
      const isLatestUserMessage = index === messages.length - 1 && message.role === "user";
      if (isLatestUserMessage && imageDataUrl) {
        return {
          role: "user",
          content: [
            { type: "text", text: message.content },
            { type: "image_url", image_url: { url: imageDataUrl, detail: "auto" } },
          ],
        };
      }

      return message;
    }),
  ];

  const upstreamResponse = await fetch(getChatCompletionUrl(apiBase), {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model,
      messages: upstreamMessages,
      max_tokens: 1_200,
      temperature: 0.45,
    }),
  });

  const body = await upstreamResponse.json().catch(() => null);
  if (!upstreamResponse.ok) {
    const upstreamMessage =
      body && typeof body === "object" && "error" in body && body.error && typeof body.error === "object" && "message" in body.error
        ? String(body.error.message)
        : "The guidance service returned an unexpected error.";
    const serviceError = new Error(upstreamMessage);
    (serviceError as Error & { statusCode?: number }).statusCode = 502;
    throw serviceError;
  }

  const content = body?.choices?.[0]?.message?.content;
  const responseText = typeof content === "string" ? content.trim() : "";
  if (!responseText) {
    const emptyResponseError = new Error("The guidance service did not return a usable response.");
    (emptyResponseError as Error & { statusCode?: number }).statusCode = 502;
    throw emptyResponseError;
  }

  return responseText;
}

async function startServer() {
  const app = express();
  const server = createServer(app);

  app.use(express.json({ limit: "8mb" }));

  app.post("/api/guidance", async (req, res) => {
    const payload = req.body as GuidanceRequest;
    const messages = normalizeMessages(payload.messages);
    const imageDataUrl = payload.imageDataUrl;

    if (!messages) {
      res.status(400).json({
        error: "Provide between 1 and 16 non-empty conversation messages with valid roles.",
      });
      return;
    }

    if (
      imageDataUrl !== undefined &&
      (typeof imageDataUrl !== "string" ||
        imageDataUrl.length > MAX_IMAGE_DATA_URL_LENGTH ||
        !isValidImageDataUrl(imageDataUrl))
    ) {
      res.status(400).json({
        error: "Attach a PNG, JPEG, or WebP room image smaller than 7 MB.",
      });
      return;
    }

    try {
      const message = await createGuidanceResponse(messages, imageDataUrl);
      res.json({ message });
    } catch (error) {
      const typedError = error as Error & { statusCode?: number };
      res.status(typedError.statusCode ?? 500).json({
        error: typedError.message || "Unable to create guidance right now.",
      });
    }
  });

  // Serve static files from dist/public in production.
  const staticPath =
    process.env.NODE_ENV === "production"
      ? path.resolve(__dirname, "public")
      : path.resolve(__dirname, "..", "dist", "public");

  app.use(express.static(staticPath));

  // Handle client-side routing by serving the application entry point.
  app.get("*", (_req, res) => {
    res.sendFile(path.join(staticPath, "index.html"));
  });

  const port = Number(process.env.PORT || 3000);
  server.listen(port, () => {
    console.log(`Holistic Harmony is available at http://localhost:${port}/`);
  });
}

startServer().catch((error) => {
  console.error("Unable to start Holistic Harmony:", error);
  process.exitCode = 1;
});
