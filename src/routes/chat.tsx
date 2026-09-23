import { useChat } from "@ai-sdk/react";
import { createFileRoute } from "@tanstack/react-router";
import { DefaultChatTransport } from "ai";
import { MessagesSquare, RotateCcw } from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";

import { AppShell } from "@/components/AppShell";
import {
  Conversation,
  ConversationContent,
  ConversationEmptyState,
  ConversationScrollButton,
} from "@/components/ai-elements/conversation";
import { Message, MessageContent, MessageResponse } from "@/components/ai-elements/message";
import {
  PromptInput,
  PromptInputFooter,
  PromptInputSubmit,
  PromptInputTextarea,
} from "@/components/ai-elements/prompt-input";
import { Shimmer } from "@/components/ai-elements/shimmer";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/chat")({
  head: () => ({
    meta: [
      { title: "AI Chatbot | AI Workplace Assistant" },
      {
        name: "description",
        content: "Ask workplace questions and get contextual, AI-generated answers in a live chat.",
      },
      { property: "og:title", content: "AI Workplace Chatbot" },
      {
        property: "og:description",
        content: "A conversational assistant for meetings, communication and productivity at work.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: ChatPage,
});

const SUGGESTIONS = [
  "How do I decline a meeting politely?",
  "Help me prioritise a week with three deadlines",
  "How should I give feedback to a peer?",
];

function ChatPage() {
  const transport = useMemo(() => new DefaultChatTransport({ api: "/api/chat" }), []);
  const [sessionId, setSessionId] = useState(0);
  const [input, setInput] = useState("");
  const [error, setError] = useState<string | null>(null);
  const textareaRef = useRef<HTMLTextAreaElement | null>(null);

  const { messages, sendMessage, status } = useChat({
    id: `session-${sessionId}`,
    transport,
    onError: (e) =>
      setError(
        e.message.includes("402")
          ? "AI credits have run out for this workspace."
          : "The assistant could not respond. Please try again.",
      ),
  });

  const busy = status === "submitted" || status === "streaming";

  useEffect(() => {
    if (!busy) textareaRef.current?.focus();
  }, [busy, sessionId]);

  const send = (text: string) => {
    const trimmed = text.trim();
    if (!trimmed || busy) return;
    setError(null);
    setInput("");
    void sendMessage({ text: trimmed });
  };

  return (
    <AppShell title="AI Workplace Chatbot" description="Contextual answers for work questions">
      <div className="mx-auto flex h-[calc(100vh-11rem)] max-w-3xl flex-col">
        <div className="card-surface animate-rise flex min-h-0 flex-1 flex-col overflow-hidden">
          <div className="flex items-center justify-between border-b border-border px-4 py-3">
            <p className="text-sm font-medium">Current session</p>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => {
                setSessionId((v) => v + 1);
                setError(null);
              }}
              disabled={messages.length === 0 || busy}
            >
              <RotateCcw className="size-4" />
              New conversation
            </Button>
          </div>

          <Conversation className="min-h-0 flex-1">
            <ConversationContent className="gap-4">
              {messages.length === 0 ? (
                <ConversationEmptyState
                  icon={<MessagesSquare className="size-8 opacity-40" />}
                  title="Ask a workplace question"
                  description="Your conversation stays in this session only."
                >
                  <MessagesSquare className="size-8 text-muted-foreground opacity-40" />
                  <div className="space-y-1">
                    <h3 className="text-sm font-medium">Ask a workplace question</h3>
                    <p className="text-sm text-muted-foreground">
                      Your conversation stays in this session only.
                    </p>
                  </div>
                  <div className="flex flex-wrap justify-center gap-2">
                    {SUGGESTIONS.map((s) => (
                      <button
                        key={s}
                        onClick={() => send(s)}
                        className="rounded-full border border-border px-3 py-1.5 text-xs text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
                      >
                        {s}
                      </button>
                    ))}
                  </div>
                </ConversationEmptyState>
              ) : null}

              {messages.map((message) => {
                const text = message.parts
                  .map((part) => (part.type === "text" ? part.text : ""))
                  .join("");
                if (!text) return null;
                return (
                  <Message key={message.id} from={message.role}>
                    <MessageContent>
                      <MessageResponse>{text}</MessageResponse>
                    </MessageContent>
                  </Message>
                );
              })}

              {status === "submitted" ? <Shimmer className="text-sm">Thinking…</Shimmer> : null}

              {error ? (
                <div className="rounded-lg border border-destructive/30 bg-destructive/5 px-3 py-2 text-sm text-destructive">
                  {error}
                </div>
              ) : null}
            </ConversationContent>
            <ConversationScrollButton />
          </Conversation>

          <div className="border-t border-border p-3">
            <PromptInput
              onSubmit={(message, event) => {
                event.preventDefault();
                send(message.text || input);
              }}
            >
              <PromptInputTextarea
                ref={textareaRef}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Ask about meetings, priorities, communication…"
              />
              <PromptInputFooter className="justify-end">
                <PromptInputSubmit status={status} disabled={busy} />
              </PromptInputFooter>
            </PromptInput>
          </div>
        </div>
      </div>
    </AppShell>
  );
}
