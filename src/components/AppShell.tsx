import { Link, useRouterState } from "@tanstack/react-router";
import { LayoutDashboard, Mail, BookOpen, MessagesSquare, Menu, Bot } from "lucide-react";
import { useState, type ReactNode } from "react";

import { cn } from "@/lib/utils";

const NAV = [
  { to: "/", label: "Dashboard", icon: LayoutDashboard },
  { to: "/email", label: "Email Generator", icon: Mail },
  { to: "/research", label: "Research Assistant", icon: BookOpen },
  { to: "/chat", label: "AI Chatbot", icon: MessagesSquare },
] as const;

export function ResponsibleAiNote({ className }: { className?: string }) {
  return (
    <p className={cn("text-xs leading-relaxed text-muted-foreground", className)}>
      Responsible AI: responses are AI-generated and may be inaccurate. Review before sending or
      acting, and avoid entering confidential or personal data.
    </p>
  );
}

function NavLinks({ onNavigate }: { onNavigate?: (() => void) | undefined }) {
  const pathname = useRouterState({ select: (s) => s.location.pathname });

  return (
    <nav className="flex flex-col gap-1">
      {NAV.map(({ to, label, icon: Icon }) => {
        const active = pathname === to;
        return (
          <Link
            key={to}
            to={to}
            onClick={onNavigate}
            className={cn(
              "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all duration-200",
              active
                ? "bg-primary text-primary-foreground shadow-sm"
                : "text-muted-foreground hover:bg-accent hover:text-foreground",
            )}
          >
            <Icon className="size-4" />
            {label}
          </Link>
        );
      })}
    </nav>
  );
}

function SidebarInner({ onNavigate }: { onNavigate?: (() => void) | undefined }) {
  return (
    <div className="flex h-full flex-col gap-6 p-5">
      <Link to="/" onClick={onNavigate} className="flex items-center gap-3">
        <span className="flex size-9 items-center justify-center rounded-lg bg-primary text-primary-foreground">
          <Bot className="size-5" />
        </span>
        <span className="text-sm leading-tight font-semibold">
          Workplace
          <span className="block text-xs font-normal text-muted-foreground">AI Assistant</span>
        </span>
      </Link>
      <NavLinks onNavigate={onNavigate} />
      <div className="mt-auto border-t border-border pt-4">
        <ResponsibleAiNote />
      </div>
    </div>
  );
}

export function AppShell({
  title,
  description,
  children,
}: {
  title: string;
  description: string;
  children: ReactNode;
}) {
  const [open, setOpen] = useState(false);

  return (
    <div className="min-h-screen bg-background">
      <aside className="fixed inset-y-0 left-0 z-30 hidden w-64 border-r border-border bg-surface-elevated lg:block">
        <SidebarInner />
      </aside>

      {open ? (
        <div className="fixed inset-0 z-50 lg:hidden">
          <button
            aria-label="Close navigation"
            className="absolute inset-0 bg-foreground/30"
            onClick={() => setOpen(false)}
          />
          <div className="animate-rise absolute inset-y-0 left-0 w-72 border-r border-border bg-surface-elevated">
            <SidebarInner onNavigate={() => setOpen(false)} />
          </div>
        </div>
      ) : null}

      <div className="lg:pl-64">
        <header className="sticky top-0 z-20 flex items-center gap-3 border-b border-border bg-background/85 px-4 py-4 backdrop-blur md:px-8">
          <button
            className="rounded-lg border border-border p-2 text-foreground lg:hidden"
            aria-label={open ? "Close navigation" : "Open navigation"}
            onClick={() => setOpen((v) => !v)}
          >
            <Menu className="size-4" />
          </button>
          <div className="min-w-0">
            <h1 className="truncate text-lg font-semibold md:text-xl">{title}</h1>
            <p className="truncate text-xs text-muted-foreground md:text-sm">{description}</p>
          </div>
        </header>
        <main className="px-4 py-6 md:px-8 md:py-8">{children}</main>
      </div>
    </div>
  );
}
