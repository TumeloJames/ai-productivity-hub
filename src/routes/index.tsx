import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight, BookOpen, Mail, MessagesSquare, ShieldCheck } from "lucide-react";

import { AppShell, ResponsibleAiNote } from "@/components/AppShell";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Dashboard | AI Workplace Productivity Assistant" },
      {
        name: "description",
        content:
          "A clean AI workspace for drafting emails, researching topics and answering workplace questions.",
      },
      { property: "og:title", content: "AI Workplace Productivity Assistant" },
      {
        property: "og:description",
        content: "Draft emails, run research and chat with an AI assistant built for work.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Dashboard,
});

const FEATURES = [
  {
    to: "/email" as const,
    icon: Mail,
    title: "Smart Email Generator",
    body: "Turn rough notes into a polished email with the tone you choose.",
  },
  {
    to: "/research" as const,
    icon: BookOpen,
    title: "AI Research Assistant",
    body: "Summarise a topic or pasted text into insights and next steps.",
  },
  {
    to: "/chat" as const,
    icon: MessagesSquare,
    title: "AI Workplace Chatbot",
    body: "Ask anything about work and keep the thread going in one session.",
  },
];

function Dashboard() {
  return (
    <AppShell title="Dashboard" description="Three AI tools for everyday work">
      <div className="mx-auto max-w-5xl space-y-8">
        <section className="animate-rise card-surface overflow-hidden p-6 md:p-8">
          <span className="inline-flex items-center gap-2 rounded-full bg-accent px-3 py-1 text-xs font-medium text-primary">
            <ShieldCheck className="size-3.5" /> AI-assisted, human-reviewed
          </span>
          <h2 className="mt-4 text-base font-medium text-primary md:text-lg">Welcome back 👋</h2>
          <p className="mt-2 text-lg md:text-xl">
            Get the writing, reading and thinking done faster.
          </p>
          <p className="mt-2 max-w-2xl text-sm text-muted-foreground md:text-base">
            Every result is generated live from what you type — edit it, copy it and make it yours.
          </p>
        </section>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {FEATURES.map(({ to, icon: Icon, title, body }, i) => (
            <Link
              key={to}
              to={to}
              className="card-surface animate-rise group flex flex-col p-5 transition-all duration-200 hover:-translate-y-0.5 hover:shadow-lg"
              style={{ animationDelay: `${60 * (i + 1)}ms` }}
            >
              <span className="flex size-10 items-center justify-center rounded-xl bg-accent text-primary">
                <Icon className="size-5" />
              </span>
              <h3 className="mt-4 text-base font-semibold">{title}</h3>
              <p className="mt-1.5 flex-1 text-sm text-muted-foreground">{body}</p>
              <span className="mt-4 inline-flex items-center gap-1.5 text-sm font-medium text-primary">
                Open
                <ArrowRight className="size-4 transition-transform group-hover:translate-x-0.5" />
              </span>
            </Link>
          ))}
        </div>

        <ResponsibleAiNote className="max-w-2xl" />
      </div>
    </AppShell>
  );
}
