import { createFileRoute, Link } from "@tanstack/react-router";
import {
  ArrowRight,
  BarChart3,
  BookOpen,
  CheckCircle2,
  Mail,
  MessageSquareText,
  MessagesSquare,
  Sparkles,
} from "lucide-react";
import { useEffect, useState } from "react";
import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from "recharts";

import { AppShell } from "@/components/AppShell";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import {
  readUsageEvents,
  subscribeToUsage,
  type UsageEvent,
  type UsageTool,
} from "@/lib/usage";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Dashboard | AI Workplace Productivity Assistant" },
      {
        name: "description",
        content:
          "A personal AI productivity dashboard for emails, research and workplace conversations.",
      },
      { property: "og:title", content: "AI Workplace Productivity Assistant" },
      {
        property: "og:description",
        content: "Track your personal AI-assisted email, research and chat activity.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Dashboard,
});

const TOOL_DETAILS = {
  email: { label: "Email Generator", activity: "Generated an email", icon: Mail },
  research: { label: "Research Assistant", activity: "Completed a research task", icon: BookOpen },
  chat: { label: "AI Chatbot", activity: "Started a chat interaction", icon: MessagesSquare },
} satisfies Record<UsageTool, { label: string; activity: string; icon: typeof Mail }>;

const FEATURES = [
  {
    to: "/email" as const,
    tool: "email" as const,
    title: "Smart Email Generator",
    body: "Turn rough notes into a polished email with the tone you choose.",
  },
  {
    to: "/research" as const,
    tool: "research" as const,
    title: "AI Research Assistant",
    body: "Summarise a topic or pasted text into insights and next steps.",
  },
  {
    to: "/chat" as const,
    tool: "chat" as const,
    title: "AI Workplace Chatbot",
    body: "Ask anything about work and keep the thread going in one session.",
  },
];

const chartConfig = {
  tasks: { label: "AI tasks", color: "var(--color-chart-1)" },
} satisfies ChartConfig;

function toLocalDateKey(date: Date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

function getActivityData(events: UsageEvent[]) {
  const counts = new Map<string, number>();
  events.forEach((event) => {
    const key = toLocalDateKey(new Date(event.createdAt));
    counts.set(key, (counts.get(key) ?? 0) + 1);
  });

  return Array.from({ length: 7 }, (_, index) => {
    const date = new Date();
    date.setHours(0, 0, 0, 0);
    date.setDate(date.getDate() - (6 - index));
    return {
      date: date.toLocaleDateString(undefined, { weekday: "short" }),
      tasks: counts.get(toLocalDateKey(date)) ?? 0,
    };
  });
}

function formatActivityTime(value: string) {
  const date = new Date(value);
  const today = new Date();
  const yesterday = new Date();
  yesterday.setDate(today.getDate() - 1);

  const time = date.toLocaleTimeString(undefined, { hour: "numeric", minute: "2-digit" });
  if (toLocalDateKey(date) === toLocalDateKey(today)) return `Today, ${time}`;
  if (toLocalDateKey(date) === toLocalDateKey(yesterday)) return `Yesterday, ${time}`;
  return date.toLocaleDateString(undefined, { month: "short", day: "numeric" });
}

function Dashboard() {
  const [events, setEvents] = useState<UsageEvent[]>([]);

  useEffect(() => {
    const update = () => setEvents(readUsageEvents());
    update();
    return subscribeToUsage(update);
  }, []);
  const counts = {
    email: events.filter((event) => event.tool === "email").length,
    research: events.filter((event) => event.tool === "research").length,
    chat: events.filter((event) => event.tool === "chat").length,
  };
  const activityData = getActivityData(events);
  const maxUsage = Math.max(counts.email, counts.research, counts.chat, 1);
  const kpis = [
    { label: "AI Tasks Completed", value: events.length, icon: CheckCircle2 },
    { label: "Emails Generated", value: counts.email, icon: Mail },
    { label: "Research Tasks", value: counts.research, icon: BookOpen },
    { label: "Chat Interactions", value: counts.chat, icon: MessageSquareText },
  ];

  return (
    <AppShell title="Dashboard" description="Your personal AI productivity overview">
      <div className="mx-auto max-w-7xl space-y-6">
        <section className="animate-rise py-3 md:py-6">
          <p className="mb-3 text-sm font-medium text-primary">AI Workplace Productivity Assistant</p>
          <h2 className="max-w-3xl text-3xl font-semibold text-foreground md:text-4xl">
            Welcome back
          </h2>
          <p className="mt-3 text-lg font-normal text-foreground md:text-xl">
            Get the writing, reading and thinking done faster.
          </p>
          <p className="mt-2 max-w-2xl text-sm leading-relaxed text-muted-foreground">
            Your dashboard reflects only the AI tasks completed in this browser.
          </p>
        </section>

        <section aria-label="Personal productivity totals" className="grid grid-cols-2 gap-3 lg:grid-cols-4">
          {kpis.map(({ label, value, icon: Icon }, index) => (
            <article
              key={label}
              className="card-surface animate-rise flex min-h-32 flex-col justify-between p-4 md:min-h-36 md:p-5"
              style={{ animationDelay: `${index * 45}ms` }}
            >
              <span className="flex size-9 items-center justify-center rounded-xl bg-accent text-accent-foreground">
                <Icon className="size-4" />
              </span>
              <div className="mt-5">
                <p className="text-2xl font-semibold tabular-nums md:text-3xl">{value}</p>
                <p className="mt-1 text-xs text-muted-foreground md:text-sm">{label}</p>
              </div>
            </article>
          ))}
        </section>

        <section className="grid gap-4 xl:grid-cols-[1.4fr_1fr]">
          <article className="card-surface p-5 md:p-6">
            <div>
              <h3 className="text-base font-semibold">Productivity activity</h3>
              <p className="mt-1 text-sm text-muted-foreground">Your completed AI tasks over the last 7 days</p>
            </div>
            <ChartContainer config={chartConfig} className="mt-6 h-64 w-full aspect-auto">
              <BarChart accessibilityLayer data={activityData} margin={{ left: -20, right: 4 }}>
                <CartesianGrid vertical={false} />
                <XAxis dataKey="date" tickLine={false} axisLine={false} tickMargin={10} />
                <YAxis allowDecimals={false} tickLine={false} axisLine={false} />
                <ChartTooltip cursor={false} content={<ChartTooltipContent indicator="dot" />} />
                <Bar dataKey="tasks" fill="var(--color-tasks)" radius={[6, 6, 2, 2]} />
              </BarChart>
            </ChartContainer>
          </article>

          <article className="card-surface p-5 md:p-6">
            <h3 className="text-base font-semibold">AI tool usage</h3>
            <p className="mt-1 text-sm text-muted-foreground">Your activity by tool</p>
            <div className="mt-8 space-y-6">
              {(["email", "research", "chat"] as const).map((tool) => {
                const DetailIcon = TOOL_DETAILS[tool].icon;
                return (
                  <div key={tool}>
                    <div className="mb-2 flex items-center justify-between gap-3 text-sm">
                      <span className="flex items-center gap-2 font-medium">
                        <DetailIcon className="size-4 text-primary-hover" />
                        {TOOL_DETAILS[tool].label}
                      </span>
                      <span className="tabular-nums text-muted-foreground">{counts[tool]}</span>
                    </div>
                    <div className="h-2 overflow-hidden rounded-full bg-muted">
                      <div
                        className="h-full rounded-full bg-primary transition-[width] duration-500"
                        style={{ width: `${(counts[tool] / maxUsage) * 100}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </article>
        </section>

        <section className="grid gap-4 xl:grid-cols-[1.4fr_1fr]">
          <article className="card-surface overflow-hidden">
            <div className="border-b border-border px-5 py-4 md:px-6">
              <h3 className="text-base font-semibold">Recent activity</h3>
              <p className="mt-1 text-sm text-muted-foreground">Stored privately in this browser</p>
            </div>
            {events.length ? (
              <ul className="divide-y divide-border">
                {events.slice(0, 5).map((event) => {
                  const detail = TOOL_DETAILS[event.tool];
                  const ActivityIcon = detail.icon;
                  return (
                    <li key={event.id} className="flex items-center gap-3 px-5 py-4 md:px-6">
                      <span className="flex size-9 shrink-0 items-center justify-center rounded-xl bg-accent text-accent-foreground">
                        <ActivityIcon className="size-4" />
                      </span>
                      <div className="min-w-0 flex-1">
                        <p className="truncate text-sm font-medium">{detail.activity}</p>
                        <p className="text-xs text-muted-foreground">{detail.label}</p>
                      </div>
                      <time className="shrink-0 text-xs text-muted-foreground">
                        {formatActivityTime(event.createdAt)}
                      </time>
                    </li>
                  );
                })}
              </ul>
            ) : (
              <div className="flex min-h-56 flex-col items-center justify-center px-6 text-center">
                <BarChart3 className="size-7 text-primary" />
                <p className="mt-3 text-sm font-medium">No activity yet</p>
                <p className="mt-1 max-w-sm text-sm text-muted-foreground">
                  Use any AI tool and your personal activity will appear here.
                </p>
              </div>
            )}
          </article>

          <div className="grid gap-3 sm:grid-cols-3 xl:grid-cols-1">
            {FEATURES.map(({ to, tool, title, body }) => {
              const Icon = TOOL_DETAILS[tool].icon;
              return (
                <Link
                  key={to}
                  to={to}
                  className="card-surface group flex items-center gap-4 p-4 transition-colors hover:bg-muted"
                >
                  <span className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-accent text-accent-foreground">
                    <Icon className="size-5" />
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="block text-sm font-semibold">{title}</span>
                    <span className="mt-1 hidden text-xs leading-relaxed text-muted-foreground xl:block">
                      {body}
                    </span>
                  </span>
                  <ArrowRight className="size-4 shrink-0 text-muted-foreground transition-transform group-hover:translate-x-0.5" />
                </Link>
              );
            })}
          </div>
        </section>

        <p className="flex items-start gap-2 pb-2 text-xs leading-relaxed text-muted-foreground">
          <Sparkles className="mt-0.5 size-3.5 shrink-0 text-primary-hover" />
          Responsible AI: responses may be inaccurate. Review before acting and avoid entering confidential or personal data.
        </p>
      </div>
    </AppShell>
  );
}