import { createOpenAI } from "@ai-sdk/openai";

const GATEWAY_BASE_URL = "https://ai.gateway.lovable.dev/v1";
const RUN_ID_HEADER = "X-Lovable-AIG-Run-ID";

export const CHAT_MODEL = "openai/gpt-6-astra";

export type RunIdFetch = {
  fetch: typeof fetch;
  getRunId: () => string | undefined;
};

export function getLovableAiGatewayRunId(request?: Request): string | undefined {
  return request?.headers.get(RUN_ID_HEADER) ?? undefined;
}

export function createLovableAiGatewayRunIdFetch(initialRunId?: string): RunIdFetch {
  let runId = initialRunId;

  const wrapped: typeof fetch = async (input, init) => {
    const headers = new Headers(init?.headers);
    if (runId) headers.set(RUN_ID_HEADER, runId);
    const response = await fetch(input, { ...init, headers });
    const returned = response.headers.get(RUN_ID_HEADER);
    if (returned) runId = returned;
    return response;
  };

  return { fetch: wrapped, getRunId: () => runId };
}

export function getLovableAiGatewayResponseHeaders(
  _unused?: unknown,
  extra: Record<string, string> = {},
): Record<string, string> {
  return { ...extra };
}

export function withLovableAiGatewayRunIdHeader(
  response: Response,
  runIdFetch: RunIdFetch,
): Response {
  const runId = runIdFetch.getRunId();
  if (runId) response.headers.set(RUN_ID_HEADER, runId);
  return response;
}

export function createResponsesModel(apiKey: string, runIdFetch: RunIdFetch) {
  const lovable = createOpenAI({
    baseURL: GATEWAY_BASE_URL,
    apiKey,
    headers: {
      "Lovable-API-Key": apiKey,
      "X-Lovable-AIG-SDK": "vercel-ai-sdk",
    },
    fetch: runIdFetch.fetch,
  });

  return lovable.responses(CHAT_MODEL);
}

export const responsesProviderOptions = {
  openai: {
    forceReasoning: true,
    reasoningEffort: "low",
    reasoningSummary: "auto",
    store: false,
    include: ["reasoning.encrypted_content"],
  },
} as const;
