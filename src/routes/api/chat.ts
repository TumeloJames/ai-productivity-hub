import { createFileRoute } from "@tanstack/react-router";
import { convertToModelMessages, streamText, type UIMessage } from "ai";

import {
  createLovableAiGatewayRunIdFetch,
  createResponsesModel,
  getLovableAiGatewayResponseHeaders,
  getLovableAiGatewayRunId,
  responsesProviderOptions,
  withLovableAiGatewayRunIdHeader,
} from "@/lib/ai-gateway.server";

const SYSTEM_PROMPT = [
  "You are the AI Workplace Assistant inside a productivity dashboard.",
  "You help with workplace questions: communication, meetings, prioritisation, difficult conversations,",
  "policy interpretation, career growth, documentation, process and productivity.",
  "Answer the specific question asked, using the conversation so far for context.",
  "Be concise and practical: short paragraphs, bullets or numbered steps where useful.",
  "Ask one clarifying question only when the request is genuinely ambiguous.",
  "You are not a lawyer, HR authority or doctor — for legal, medical or formal HR matters, recommend",
  "confirming with a qualified person, briefly and without repeating the caveat every message.",
].join(" ");

type ChatRequestBody = { messages?: unknown };

export const Route = createFileRoute("/api/chat")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        const { messages } = (await request.json()) as ChatRequestBody;
        if (!Array.isArray(messages)) {
          return new Response("Messages are required", { status: 400 });
        }

        const key = process.env["LOVABLE_API_KEY"];
        if (!key) {
          return new Response("AI is not configured yet.", { status: 500 });
        }

        const initialRunId = getLovableAiGatewayRunId(request);
        const runIdFetch = createLovableAiGatewayRunIdFetch(initialRunId);

        const result = streamText({
          model: createResponsesModel(key, runIdFetch),
          system: SYSTEM_PROMPT,
          messages: await convertToModelMessages(messages as UIMessage[]),
          providerOptions: responsesProviderOptions,
        });

        return withLovableAiGatewayRunIdHeader(
          result.toUIMessageStreamResponse({
            originalMessages: messages as UIMessage[],
            headers: getLovableAiGatewayResponseHeaders(undefined, {
              ...(initialRunId ? { "X-Lovable-AIG-Run-ID": initialRunId } : {}),
            }),
          }),
          runIdFetch,
        );
      },
    },
  },
});
