import { createFileRoute } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { Mail, Sparkle } from "lucide-react";
import { useState } from "react";

import { AppShell } from "@/components/AppShell";
import { OutputPanel } from "@/components/OutputPanel";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { generateEmail } from "@/lib/ai.functions";

export const Route = createFileRoute("/email")({
  head: () => ({
    meta: [
      { title: "Email Generator | AI Workplace Assistant" },
      {
        name: "description",
        content: "Turn key points into a polished, tone-matched work email you can edit and copy.",
      },
      { property: "og:title", content: "Smart Email Generator" },
      {
        property: "og:description",
        content: "Generate professional emails in a formal, friendly or persuasive tone.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: EmailPage,
});

type Tone = "Formal" | "Friendly" | "Persuasive";

function EmailPage() {
  const run = useServerFn(generateEmail);
  const [recipient, setRecipient] = useState("");
  const [subject, setSubject] = useState("");
  const [keyPoints, setKeyPoints] = useState("");
  const [tone, setTone] = useState<Tone>("Formal");
  const [output, setOutput] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const canSubmit = recipient.trim().length > 0 && keyPoints.trim().length > 0 && !loading;

  const submit = async () => {
    setLoading(true);
    setError(null);
    try {
      const result = await run({
        data: { recipient: recipient.trim(), subject: subject.trim(), keyPoints, tone },
      });
      setOutput(result.text);
    } catch (e) {
      setOutput("");
      setError(e instanceof Error ? e.message : "The email could not be generated. Try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AppShell
      title="Smart Email Generator"
      description="Describe the situation and let AI write the email"
    >
      <div className="mx-auto grid max-w-6xl gap-6 lg:grid-cols-2">
        <section className="card-surface animate-rise space-y-5 p-5">
          <div className="space-y-2">
            <Label htmlFor="recipient">Recipient & context</Label>
            <Input
              id="recipient"
              placeholder="e.g. My manager, Sarah — about a deadline extension"
              value={recipient}
              onChange={(e) => setRecipient(e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="subject">Subject (optional)</Label>
            <Input
              id="subject"
              placeholder="Leave blank and AI will suggest one"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="points">Key points</Label>
            <Textarea
              id="points"
              rows={7}
              placeholder={"One point per line, e.g.\n- Client review moved to Friday\n- Need two extra days\n- Draft already shared"}
              value={keyPoints}
              onChange={(e) => setKeyPoints(e.target.value)}
              className="resize-none"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="tone">Tone</Label>
            <Select value={tone} onValueChange={(v) => setTone(v as Tone)}>
              <SelectTrigger id="tone">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Formal">Formal</SelectItem>
                <SelectItem value="Friendly">Friendly</SelectItem>
                <SelectItem value="Persuasive">Persuasive</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <Button className="w-full" disabled={!canSubmit} onClick={submit}>
            <Sparkle className="size-4" />
            {loading ? "Writing…" : "Generate email"}
          </Button>
        </section>

        <OutputPanel
          value={output}
          onChange={setOutput}
          loading={loading}
          error={error}
          loadingLabel="Drafting your email…"
          emptyState={
            <div className="max-w-xs text-muted-foreground">
              <Mail className="mx-auto size-8 opacity-40" />
              <p className="mt-3 text-sm">
                Your generated email will appear here, fully editable before you copy it.
              </p>
            </div>
          }
        />
      </div>
    </AppShell>
  );
}
