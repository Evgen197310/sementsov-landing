/**
 * AI client wrappers for Claude (Anthropic) and OpenAI.
 * Adapted from pustoshilov-lawyer project. No SDKs — just fetch().
 */

export interface AiGenerateResult {
  data: Record<string, unknown>;
  provider: "claude" | "openai";
}

/** Call Claude API with native PDF support (document content block). */
async function callClaudeWithPdf(
  pdfBase64: string,
  systemPrompt: string,
): Promise<Record<string, unknown>> {
  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) throw new Error("ANTHROPIC_API_KEY not configured");

  const res = await fetch("https://api.anthropic.com/v1/messages", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-api-key": apiKey,
      "anthropic-version": "2023-06-01",
    },
    body: JSON.stringify({
      model: "claude-sonnet-4-20250514",
      max_tokens: 4096,
      system: systemPrompt,
      messages: [
        {
          role: "user",
          content: [
            {
              type: "document",
              source: { type: "base64", media_type: "application/pdf", data: pdfBase64 },
            },
            {
              type: "text",
              text: "Проанализируй этот документ и создай карточку дела в формате JSON согласно инструкции.",
            },
          ],
        },
      ],
    }),
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({ error: { message: res.statusText } }));
    throw new Error(`Claude API error ${res.status}: ${err?.error?.message || JSON.stringify(err)}`);
  }

  const body = await res.json();
  const textBlock = body.content?.find((b: { type: string }) => b.type === "text");
  if (!textBlock?.text) throw new Error("Claude returned empty response");
  return extractJson(textBlock.text);
}

/** Call Claude API with image (vision). */
async function callClaudeWithImage(
  imageBase64: string,
  mediaType: string,
  systemPrompt: string,
): Promise<Record<string, unknown>> {
  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) throw new Error("ANTHROPIC_API_KEY not configured");

  const res = await fetch("https://api.anthropic.com/v1/messages", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-api-key": apiKey,
      "anthropic-version": "2023-06-01",
    },
    body: JSON.stringify({
      model: "claude-sonnet-4-20250514",
      max_tokens: 4096,
      system: systemPrompt,
      messages: [
        {
          role: "user",
          content: [
            {
              type: "image",
              source: { type: "base64", media_type: mediaType, data: imageBase64 },
            },
            {
              type: "text",
              text: "Проанализируй это изображение документа и создай карточку дела в формате JSON согласно инструкции.",
            },
          ],
        },
      ],
    }),
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({ error: { message: res.statusText } }));
    throw new Error(`Claude API error ${res.status}: ${err?.error?.message || JSON.stringify(err)}`);
  }

  const body = await res.json();
  const textBlock = body.content?.find((b: { type: string }) => b.type === "text");
  if (!textBlock?.text) throw new Error("Claude returned empty response");
  return extractJson(textBlock.text);
}

/** Call Claude API with plain text. */
async function callClaudeWithText(
  text: string,
  systemPrompt: string,
): Promise<Record<string, unknown>> {
  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) throw new Error("ANTHROPIC_API_KEY not configured");

  const res = await fetch("https://api.anthropic.com/v1/messages", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-api-key": apiKey,
      "anthropic-version": "2023-06-01",
    },
    body: JSON.stringify({
      model: "claude-sonnet-4-20250514",
      max_tokens: 4096,
      system: systemPrompt,
      messages: [{ role: "user", content: text }],
    }),
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({ error: { message: res.statusText } }));
    throw new Error(`Claude API error ${res.status}: ${err?.error?.message || JSON.stringify(err)}`);
  }

  const body = await res.json();
  const textBlock = body.content?.find((b: { type: string }) => b.type === "text");
  if (!textBlock?.text) throw new Error("Claude returned empty response");
  return extractJson(textBlock.text);
}

/** Call OpenAI API with text (fallback). */
async function callOpenAI(
  text: string,
  systemPrompt: string,
): Promise<Record<string, unknown>> {
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) throw new Error("OPENAI_API_KEY not configured");

  const maxChars = 400_000;
  const truncated = text.length > maxChars ? text.slice(0, maxChars) : text;

  const res = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model: "gpt-4o",
      max_tokens: 4096,
      messages: [
        { role: "system", content: systemPrompt },
        {
          role: "user",
          content: `Проанализируй этот документ и создай карточку дела в формате JSON.\n\n${truncated}`,
        },
      ],
    }),
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({ error: { message: res.statusText } }));
    throw new Error(`OpenAI API error ${res.status}: ${err?.error?.message || JSON.stringify(err)}`);
  }

  const body = await res.json();
  const content = body.choices?.[0]?.message?.content;
  if (!content) throw new Error("OpenAI returned empty response");
  return extractJson(content);
}

/** Extract JSON from AI response text (handles markdown code blocks). */
function extractJson(text: string): Record<string, unknown> {
  const codeBlockMatch = text.match(/```(?:json)?\s*([\s\S]*?)```/);
  const jsonStr = codeBlockMatch ? codeBlockMatch[1].trim() : text.trim();

  try {
    const parsed = JSON.parse(jsonStr);
    if (typeof parsed === "object" && parsed !== null && !Array.isArray(parsed)) return parsed;
    throw new Error("Expected JSON object");
  } catch {
    const match = text.match(/\{[\s\S]*\}/);
    if (match) {
      const parsed = JSON.parse(match[0]);
      if (typeof parsed === "object" && parsed !== null && !Array.isArray(parsed)) return parsed;
    }
    throw new Error("Failed to parse JSON from AI response");
  }
}

/**
 * Generate practice case data from a PDF file.
 * Tries Claude first (native PDF), falls back to OpenAI (text extraction).
 */
export async function generateFromPdf(
  pdfBuffer: Buffer,
  systemPrompt: string,
): Promise<AiGenerateResult> {
  const pdfBase64 = pdfBuffer.toString("base64");

  if (process.env.ANTHROPIC_API_KEY) {
    try {
      const data = await callClaudeWithPdf(pdfBase64, systemPrompt);
      return { data, provider: "claude" };
    } catch (err) {
      console.error("[AI] Claude failed, trying OpenAI fallback:", (err as Error).message);
    }
  }

  if (process.env.OPENAI_API_KEY) {
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const pdfParse = require("pdf-parse") as (buf: Buffer) => Promise<{ text: string }>;
    const parsed = await pdfParse(pdfBuffer);
    if (!parsed.text || parsed.text.trim().length < 100) {
      throw new Error("PDF не содержит текстового слоя. Для сканов нужен Claude (ANTHROPIC_API_KEY).");
    }
    const data = await callOpenAI(parsed.text, systemPrompt);
    return { data, provider: "openai" };
  }

  throw new Error("Ни ANTHROPIC_API_KEY, ни OPENAI_API_KEY не настроены");
}

/**
 * Generate practice case data from an image (JPG/PNG).
 * Uses Claude Vision for recognition.
 */
export async function generateFromImage(
  imageBuffer: Buffer,
  mediaType: string,
  systemPrompt: string,
): Promise<AiGenerateResult> {
  const imageBase64 = imageBuffer.toString("base64");

  if (process.env.ANTHROPIC_API_KEY) {
    const data = await callClaudeWithImage(imageBase64, mediaType, systemPrompt);
    return { data, provider: "claude" };
  }

  throw new Error("Для распознавания изображений нужен ANTHROPIC_API_KEY (Claude Vision)");
}

/**
 * Generate practice case data from DOCX text.
 * Extracts text with mammoth, then sends to AI.
 */
export async function generateFromDocx(
  docxBuffer: Buffer,
  systemPrompt: string,
): Promise<AiGenerateResult & { html: string }> {
  const mammoth = await import("mammoth");
  const htmlResult = await mammoth.convertToHtml({ buffer: docxBuffer });
  const textResult = await mammoth.extractRawText({ buffer: docxBuffer });

  const text = textResult.value;
  if (!text || text.trim().length < 50) {
    throw new Error("DOCX файл пуст или содержит слишком мало текста");
  }

  if (process.env.ANTHROPIC_API_KEY) {
    try {
      const data = await callClaudeWithText(text, systemPrompt);
      return { data, provider: "claude", html: htmlResult.value };
    } catch (err) {
      console.error("[AI] Claude failed for DOCX:", (err as Error).message);
    }
  }

  if (process.env.OPENAI_API_KEY) {
    const data = await callOpenAI(text, systemPrompt);
    return { data, provider: "openai", html: htmlResult.value };
  }

  throw new Error("Ни ANTHROPIC_API_KEY, ни OPENAI_API_KEY не настроены");
}
