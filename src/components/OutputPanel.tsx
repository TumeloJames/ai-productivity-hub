import { Check, Copy, Loader2 } from "lucide-react";
import { useState, type ReactNode } from "react";

import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";

export function OutputPanel({
  value,
  onChange,
  loading,
  error,
  emptyState,
  loadingLabel,
}: {
  value: string;
  onChange: (next: string) => void;
  loading: boolean;
  error: string | null;
  emptyState: ReactNode;
  loadingLabel: string;
}) {
  const [copied, setCopied] = useState(false);

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(value);
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    } catch {
      setCopied(false);
    }
  };

  return (
    <section className="card-surface flex min-h-[420px] flex-col p-5">
      <div className="mb-4 flex items-center justify-between gap-3">
        <h2 className="text-sm font-semibold">Result</h2>
        {value && !loading ? (
          <Button variant="outline" size="sm" onClick={copy}>
            {copied ? <Check className="size-4" /> : <Copy className="size-4" />}
            {copied ? "Copied" : "Copy"}
          </Button>
        ) : null}
      </div>

      {loading ? (
        <div className="flex flex-1 flex-col items-center justify-center gap-3 text-muted-foreground">
          <Loader2 className="size-5 animate-spin" />
          <p className="text-sm">{loadingLabel}</p>
          <div className="mt-2 w-full max-w-sm space-y-2">
            {[0, 1, 2].map((i) => (
              <div
                key={i}
                className="h-3 animate-pulse rounded bg-muted"
                style={{ width: `${100 - i * 18}%` }}
              />
            ))}
          </div>
        </div>
      ) : error ? (
        <div className="flex flex-1 items-center justify-center">
          <div className="max-w-sm rounded-lg border border-destructive/30 bg-destructive/5 p-4 text-center">
            <p className="text-sm font-medium text-destructive">Something went wrong</p>
            <p className="mt-1 text-sm text-muted-foreground">{error}</p>
          </div>
        </div>
      ) : value ? (
        <Textarea
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="animate-rise min-h-[340px] flex-1 resize-none font-sans text-sm leading-relaxed"
          aria-label="Generated result, editable"
        />
      ) : (
        <div className="flex flex-1 items-center justify-center text-center">{emptyState}</div>
      )}
    </section>
  );
}
