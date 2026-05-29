import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import { MessageSquare, Send, Paperclip, Loader2, Copy, Check, Pencil } from "lucide-react";
import { toast } from "sonner";
import { useServerFn } from "@tanstack/react-start";
import { useStore, type ChatMsg } from "@/lib/store";
import { extractFileText } from "@/lib/mock-ai";
import { aiChat } from "@/lib/api/ai.functions";

export const Route = createFileRoute("/chat")({
  head: () => ({ meta: [{ title: "AI Chat — WorkMind" }] }),
  component: ChatPage,
});

type Intent = "chat" | "email" | "summary" | "plan" | "research";

function detectIntent(text: string): Intent {
  const t = text.toLowerCase();
  if (/\b(draft|write|compose|send|reply to).{0,30}(email|message|mail)\b/.test(t) || /\bemail\b.*\b(to|about|for)\b/.test(t)) return "email";
  if (/\b(summari[sz]e|summary|tl;dr|key points|recap|notes from)\b/.test(t)) return "summary";
  if (/\b(plan|schedule|organi[sz]e|prioriti[sz]e|to-?do|agenda|day|week)\b/.test(t) && /\b(task|day|week|schedule|plan)\b/.test(t)) return "plan";
  if (/\b(research|explain|deep dive|insights on|what is|overview of|analyze)\b/.test(t)) return "research";
  return "chat";
}

const INTENT_LABELS: Record<Intent, string> = {
  chat: "",
  email: "Email draft",
  summary: "Summary",
  plan: "Schedule",
  research: "Research brief",
};

export type EditableMsg = ChatMsg & { intent?: Intent };

function ChatPage() {
  const { chat, pushChat } = useStore() as ReturnType<typeof useStore> & { chat: EditableMsg[] };
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [fileCtx, setFileCtx] = useState<string | undefined>();
  const [edits, setEdits] = useState<Record<string, string>>({});
  const fileRef = useRef<HTMLInputElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const callAi = useServerFn(aiChat);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [chat, loading]);

  useEffect(() => { inputRef.current?.focus(); }, []);

  const send = async () => {
    if (!input.trim() || loading) return;
    const msg = input.trim();
    const intent = detectIntent(msg);
    pushChat({ role: "user", text: msg });
    setInput("");
    setLoading(true);
    try {
      const history = chat
        .filter((m) => m.role !== "assistant" || !m.text.startsWith("Hi — I'm WorkMind"))
        .slice(-8)
        .map((m) => ({ role: m.role, content: m.text }));
      const userContent = fileCtx ? `${msg}\n\n--- Attached file context ---\n${fileCtx}` : msg;
      const { text } = await callAi({ data: { messages: [...history, { role: "user", content: userContent }], intent } });
      pushChat({ role: "assistant", text, ...(intent !== "chat" ? { file: intent } : {}) } as Omit<ChatMsg, "id">);
    } catch (e) {
      const message = e instanceof Error ? e.message : "Something went wrong";
      toast.error(message);
      pushChat({ role: "assistant", text: `⚠️ ${message}` });
    } finally {
      setLoading(false);
      setTimeout(() => inputRef.current?.focus(), 0);
    }
  };

  const onFile = async (f: File) => {
    const text = await extractFileText(f);
    setFileCtx(text);
    pushChat({ role: "user", text: `📎 Attached ${f.name}`, file: f.name });
    toast.success(`${f.name} indexed — ask a question about it.`);
  };

  return (
    <div className="flex flex-col h-[calc(100vh-8rem)] md:h-[calc(100vh-4rem)]">
      <header className="flex items-center gap-3 pb-4 border-b">
        <div className="w-10 h-10 rounded-lg bg-primary/10 text-primary flex items-center justify-center">
          <MessageSquare className="w-5 h-5" />
        </div>
        <div>
          <h1 className="font-bold text-lg">AI Chatbot</h1>
          <p className="text-xs text-muted-foreground">Drafts, summaries & plans render as editable text — tweak before using.</p>
        </div>
      </header>

      <div ref={scrollRef} className="flex-1 overflow-y-auto py-4 space-y-4 scrollbar-thin">
        {chat.map((m) => {
          const isAssistantDeliverable =
            m.role === "assistant" && m.file && ["email", "summary", "plan", "research"].includes(m.file);
          if (isAssistantDeliverable) {
            const intent = m.file as Intent;
            const current = edits[m.id] ?? m.text;
            return (
              <div key={m.id} className="flex justify-start">
                <div className="max-w-[92%] w-full rounded-2xl rounded-bl-sm bg-muted/60 border p-3 space-y-2">
                  <div className="flex items-center justify-between gap-2 text-xs">
                    <span className="inline-flex items-center gap-1.5 font-medium text-primary">
                      <Pencil className="w-3 h-3" /> {INTENT_LABELS[intent]} — editable
                    </span>
                    <CopyBtn text={current} />
                  </div>
                  <textarea
                    value={current}
                    onChange={(e) => setEdits((s) => ({ ...s, [m.id]: e.target.value }))}
                    className="w-full min-h-[180px] rounded-lg border bg-background px-3 py-2 text-sm font-mono leading-relaxed resize-y focus:outline-none focus:ring-2 focus:ring-ring"
                  />
                  <p className="text-[11px] text-muted-foreground italic">
                    AI-generated content — please review and edit before use.
                  </p>
                </div>
              </div>
            );
          }
          return (
            <div key={m.id} className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`}>
              <div className={`max-w-[80%] rounded-2xl px-4 py-2.5 text-sm whitespace-pre-wrap ${m.role === "user" ? "bg-primary text-primary-foreground rounded-br-sm" : "bg-muted text-foreground rounded-bl-sm"}`}>
                {m.text}
              </div>
            </div>
          );
        })}
        {loading && (
          <div className="flex justify-start">
            <div className="bg-muted rounded-2xl px-4 py-3 flex gap-1">
              <span className="w-1.5 h-1.5 bg-muted-foreground rounded-full animate-bounce" />
              <span className="w-1.5 h-1.5 bg-muted-foreground rounded-full animate-bounce [animation-delay:120ms]" />
              <span className="w-1.5 h-1.5 bg-muted-foreground rounded-full animate-bounce [animation-delay:240ms]" />
            </div>
          </div>
        )}
      </div>

      <div className="border-t pt-3 space-y-2">
        {fileCtx && (
          <div className="text-xs text-muted-foreground flex items-center justify-between bg-muted/40 rounded px-2 py-1">
            <span>📎 File context attached</span>
            <button onClick={() => setFileCtx(undefined)} className="hover:text-primary">Clear</button>
          </div>
        )}
        <div className="flex items-end gap-2">
          <button
            onClick={() => fileRef.current?.click()}
            className="p-2.5 rounded-lg border hover:bg-accent shrink-0"
            aria-label="Attach file"
          >
            <Paperclip className="w-4 h-4" />
          </button>
          <input
            ref={fileRef}
            type="file"
            accept=".pdf,.docx,.txt,text/plain"
            className="hidden"
            onChange={(e) => { const f = e.target.files?.[0]; if (f) onFile(f); }}
          />
          <textarea
            ref={inputRef}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); send(); } }}
            placeholder="Ask anything — try 'Draft an email to my manager about Q3 delays' or 'Plan my Tuesday'..."
            rows={1}
            className="flex-1 resize-none rounded-lg border bg-background px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-ring max-h-32"
            disabled={loading}
          />
          <button
            onClick={send}
            disabled={loading || !input.trim()}
            className="p-2.5 rounded-lg bg-primary text-primary-foreground disabled:opacity-50 shrink-0"
            aria-label="Send"
          >
            {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
          </button>
        </div>
      </div>
    </div>
  );
}

function CopyBtn({ text }: { text: string }) {
  const [done, setDone] = useState(false);
  return (
    <button
      onClick={async () => {
        await navigator.clipboard.writeText(text);
        setDone(true);
        toast.success("Copied");
        setTimeout(() => setDone(false), 1500);
      }}
      className="inline-flex items-center gap-1 px-2 py-1 rounded hover:bg-accent text-muted-foreground hover:text-foreground"
    >
      {done ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
      {done ? "Copied" : "Copy"}
    </button>
  );
}
