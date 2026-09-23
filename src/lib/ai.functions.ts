import { createServerFn } from "@tanstack/react-start";
import { streamText } from "ai";
import { z } from "zod";

import {
  createLovableAiGatewayRunIdFetch,
  createResponsesModel,
  responsesProviderOptions,
} from "./ai-gateway.server";

const EmailInput = z.object({
  recipient: z.string().min(1).max(400),
  subject: z.string().max(200).optional().default(""),
  keyPoints: z.string().min(1).max(4000),
  tone: z.enum(["Formal", "Friendly", "Persuasive"]),
});

const ResearchInput = z.object({
  topic: z.string().min(1).max(20000),
});

function requireKey() {
  const key = process.env["LOVABLE_API_KEY"];
  if (!key) throw new Error("AI is not configured yet. Add an AI key to enable generation.");
  return key;
}

async function runPrompt(system: string, prompt: string) {
  const apiKey = requireKey();
  const runIdFetch = createLovableAiGatewayRunIdFetch();
  const result = streamText({
    model: createResponsesModel(apiKey, runIdFetch),
    system,
    prompt,
    providerOptions: responsesProviderOptions,
  });
  const text = await result.text;
  return text.trim();
}

export const generateEmail = createServerFn({ method: "POST" })
  .inputValidator((input: unknown) => EmailInput.parse(input))
  .handler(async ({ data }) => {
    const system = [
      "You are an expert workplace communication assistant.",
      "Write a complete, ready-to-send business email based strictly on the user's inputs.",
      "Rules: no placeholder brackets unless a detail is genuinely unknown; keep it concise and scannable;",
      "match the requested tone exactly; end with an appropriate sign-off.",
      "Return plain text only: a 'Subject: ...' line, a blank line, then the email body. No commentary.",
    ].join(" ");

    const prompt = [
      `Tone: ${data.tone}`,
      `Recipient / context: ${data.recipient}`,
      data.subject ? `Requested subject: ${data.subject}` : "Requested subject: (propose one)",
      `Key points to cover:\n${data.keyPoints}`,
    ].join("\n");

    return { text: await runPrompt(system, prompt) };
  });

export const generateResearch = createServerFn({ method: "POST" })
  .inputValidator((input: unknown) => ResearchInput.parse(input))
  .handler(async ({ data }) => {
    const system = [
      "You are a rigorous workplace research analyst.",
      "Analyse the user's topic, question or pasted text and respond in markdown with exactly these sections:",
      "'## Summary' (a tight paragraph), '## Key Insights' (4-6 bullets),",
      "'## Practical Recommendations' (4-6 actionable bullets, each starting with a verb).",
      "Be specific and grounded in the supplied input. Flag uncertainty explicitly instead of inventing facts.",
    ].join(" ");

    return { text: await runPrompt(system, `Input to analyse:\n\n${data.topic}`) };
  });
