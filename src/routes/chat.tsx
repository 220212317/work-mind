import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import { MessageSquare, Send, Paperclip, Loader2 } from "lucide-react";
import { useStore } from "@/lib/store";
import { chatReply, delay, extractFileText } from "@/lib/mock-ai";
import { Disclaimer } from "@/components/Disclaimer";

export const Route = createFileRoute("/chat")({
  head: () => ({ meta: [{ title: "AI Chat — WorkMind" }] }),
  component: ChatPage,
});

function ChatPage() {
  const { chat, pushChat } = useStore();
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [fileCtx, setFileCtx] = useState<string | undefined>();
  const fileRef = useRef<HTMLInputElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [chat, loading]);

  const send = async () => {
    if (!input.trim() || loading) return;
    const msg = input.trim();
    pushChat({ role: "user", text: msg });
    setInput("");
    setLoading(true);
    await delay(1200);
    pushChat({ role: "assistant", text: chatReply(msg, fileCtx) });
    setLoading(false);
  };

  const onFile = async (f: File) => {
    const text = await extractFileText(f);
    setFileCtx(text);
    pushChat({ role: "user", text: `📎 Uploaded ${f.name}`, file: f.name });
    setLoading(true);
    await delay(900);
    pushChat({
      role: "assistant",
      text: `I've successfully indexed ${f.name}. What specific questions can I answer for you about this data?`,
    });
    setLoading(false);
  };

  return (
    <div className="flex flex-col h-[calc(100vh-8rem)] md:h-[calc(100vh-4rem)]">
      <header className="flex items-center gap-3 pb-4 border-b">
        <div className="w-10 h-10 rounded-lg bg-primary/10 text-primary flex items-center justify-center">
          <MessageSquare className="w-5 h-5" />
        </div>
        <div>
          <h1 className="font-bold text-lg">AI Chatbot</h1>
          <p className="text-xs text-muted-foreground">Persistent across views — drop files for context.</p>
        </div>
      </header>

      <div ref={scrollRef} className="flex-1 overflow-y-auto py-4 space-y-4 scrollbar-thin">
        {chat.map((m) => (
          <div key={m.id} className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`}>
            <div className={`max-w-[80%] rounded-2xl px-4 py-2.5 text-sm whitespace-pre-wrap ${m.role === "user" ? "bg-primary text-primary-foreground rounded-br-sm" : "bg-muted text-foreground rounded-bl-sm"}`}>
              {m.text}
            </div>
          </div>
        ))}
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
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); send(); } }}
            placeholder="Ask anything..."
            rows={1}
            className="flex-1 resize-none rounded-lg border bg-background px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-ring max-h-32"
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
        <Disclaimer />
      </div>
    </div>
  );
}
