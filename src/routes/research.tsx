import { createFileRoute } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { BookOpen, Sparkle } from "lucide-react";
import { useState } from "react";

import { AppShell } from "@/components/AppShell";
import { OutputPanel } from "@/components/OutputPanel";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { generateResearch } from "@/lib/ai.functions";
import { recordUsage } from "@/lib/usage";

export const Route = createFileRoute("/research")({
  head: () => ({
    meta: [
      { title: "Research Assistant | AI Workplace Assistant" },
      {
        name: "description",
        content:
          "Summarise any topic, question or pasted article into insights and practical recommendations.",
      },
      { property: "og:title", content: "AI Research Assistant" },
      {
        property: "og:description",
        content: "Get a summary, key insights and next steps from any topic or pasted text.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: ResearchPage,
});

function ResearchPage() {
  const run = useServerFn(generateResearch);
  const [topic, setTopic] = useState("");
  const [output, setOutput] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const submit = async () => {
    setLoading(true);
    setError(null);
    try {
      const result = await run({ data: { topic } });
      setOutput(result.text);
      recordUsage("research");
    } catch (e) {
      setOutput("");
      setError(e instanceof Error ? e.message : "The analysis could not be generated. Try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AppShell
      title="AI Research Assistant"
      description="Summary, insights and recommendations from any input"
    >
      <div className="mx-auto grid max-w-6xl gap-6 lg:grid-cols-2">
        <section className="card-surface animate-rise flex flex-col gap-5 p-5">
          <div className="flex flex-1 flex-col gap-2">
            <Label htmlFor="topic">Topic, question or pasted text</Label>
            <Textarea
              id="topic"
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
              placeholder="Paste an article, or ask something like: How should a small team run asynchronous stand-ups?"
              className="min-h-[340px] flex-1 resize-none text-sm leading-relaxed"
            />
            <p className="text-xs text-muted-foreground">
              {topic.trim().length.toLocaleString()} characters
            </p>
          </div>
          <Button disabled={!topic.trim() || loading} onClick={submit}>
            <Sparkle className="size-4" />
            {loading ? "Analysing…" : "Analyse"}
          </Button>
        </section>

        <OutputPanel
          value={output}
          onChange={setOutput}
          loading={loading}
          error={error}
          loadingLabel="Reading and analysing…"
          emptyState={
            <div className="max-w-xs text-muted-foreground">
              <BookOpen className="mx-auto size-8 text-primary opacity-70" />
              <p className="mt-3 text-sm">
                You'll get a summary, key insights and practical recommendations here.
              </p>
            </div>
          }
        />
      </div>
    </AppShell>
  );
}
