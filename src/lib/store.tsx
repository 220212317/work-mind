import { createContext, useContext, useState, type ReactNode } from "react";

export type StatKey = "emails" | "summaries" | "schedules" | "research";

export type Activity = { id: string; text: string; at: number };
export type ChatMsg = { id: string; role: "user" | "assistant"; text: string; file?: string };

type Store = {
  stats: Record<StatKey, number>;
  bump: (k: StatKey, activity: string) => void;
  activity: Activity[];
  chat: ChatMsg[];
  pushChat: (m: Omit<ChatMsg, "id">) => void;
};

const Ctx = createContext<Store | null>(null);

const seedActivity: Activity[] = [
  { id: "s1", text: "Welcome to WorkMind — let's get productive.", at: Date.now() - 1000 * 60 * 10 },
  { id: "s2", text: "Session started — your workspace is ready.", at: Date.now() - 1000 * 60 * 2 },
];

export function StoreProvider({ children }: { children: ReactNode }) {
  const [stats, setStats] = useState<Record<StatKey, number>>({ emails: 0, summaries: 0, schedules: 0, research: 0 });
  const [activity, setActivity] = useState<Activity[]>(seedActivity);
  const [chat, setChat] = useState<ChatMsg[]>([
    { id: "c0", role: "assistant", text: "Hi — I'm WorkMind. Ask me anything, or drop a file to give me context." },
  ]);

  const bump: Store["bump"] = (k, text) => {
    setStats((s) => ({ ...s, [k]: s[k] + 1 }));
    setActivity((a) => [{ id: crypto.randomUUID(), text, at: Date.now() }, ...a].slice(0, 20));
  };

  const pushChat: Store["pushChat"] = (m) =>
    setChat((c) => [...c, { ...m, id: crypto.randomUUID() }]);

  return <Ctx.Provider value={{ stats, bump, activity, chat, pushChat }}>{children}</Ctx.Provider>;
}

export const useStore = () => {
  const v = useContext(Ctx);
  if (!v) throw new Error("StoreProvider missing");
  return v;
};

export function relativeTime(ts: number) {
  const s = Math.floor((Date.now() - ts) / 1000);
  if (s < 60) return `${s}s ago`;
  const m = Math.floor(s / 60);
  if (m < 60) return `${m} min ago`;
  const h = Math.floor(m / 60);
  if (h < 24) return `${h}h ago`;
  return `${Math.floor(h / 24)}d ago`;
}
