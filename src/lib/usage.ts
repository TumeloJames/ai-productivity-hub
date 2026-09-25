export type UsageTool = "email" | "research" | "chat";

export type UsageEvent = {
  id: string;
  tool: UsageTool;
  createdAt: string;
};

const STORAGE_KEY = "ai-workplace-usage-v1";
const CHANGE_EVENT = "ai-workplace-usage-change";
const MAX_EVENTS = 250;
const EMPTY_EVENTS: UsageEvent[] = [];

function isUsageEvent(value: unknown): value is UsageEvent {
  if (!value || typeof value !== "object") return false;
  const event = value as Partial<UsageEvent>;
  return (
    typeof event.id === "string" &&
    (event.tool === "email" || event.tool === "research" || event.tool === "chat") &&
    typeof event.createdAt === "string" &&
    !Number.isNaN(Date.parse(event.createdAt))
  );
}

export function readUsageEvents(): UsageEvent[] {
  if (typeof window === "undefined") return EMPTY_EVENTS;

  try {
    const value: unknown = JSON.parse(window.localStorage.getItem(STORAGE_KEY) ?? "[]");
    return Array.isArray(value) ? value.filter(isUsageEvent) : EMPTY_EVENTS;
  } catch {
    return EMPTY_EVENTS;
  }
}

export function recordUsage(tool: UsageTool) {
  if (typeof window === "undefined") return;

  try {
    const event: UsageEvent = {
      id: globalThis.crypto?.randomUUID?.() ?? `${Date.now()}-${Math.random()}`,
      tool,
      createdAt: new Date().toISOString(),
    };
    const events = [event, ...readUsageEvents()].slice(0, MAX_EVENTS);
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(events));
    window.dispatchEvent(new Event(CHANGE_EVENT));
  } catch {
    // The tools should remain usable when browser storage is unavailable.
  }
}

export function subscribeToUsage(onChange: () => void) {
  if (typeof window === "undefined") return () => undefined;

  const onStorage = (event: StorageEvent) => {
    if (event.key === STORAGE_KEY) onChange();
  };
  window.addEventListener("storage", onStorage);
  window.addEventListener(CHANGE_EVENT, onChange);

  return () => {
    window.removeEventListener("storage", onStorage);
    window.removeEventListener(CHANGE_EVENT, onChange);
  };
}

export function getServerUsageSnapshot(): UsageEvent[] {
  return EMPTY_EVENTS;
}