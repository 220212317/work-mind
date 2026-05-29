import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Mail, Loader2, Sparkles } from "lucide-react";
import { toast } from "sonner";
import { useServerFn } from "@tanstack/react-start";
import { FileUpload } from "@/components/FileUpload";
import { EmptyState } from "@/components/EmptyState";
import { EditableOutput } from "@/components/EditableOutput";
import { useStore } from "@/lib/store";
import { aiChat } from "@/lib/api/ai.functions";

export const Route = createFileRoute("/email")({
  head: () => ({ meta: [{ title: "Smart Email Draftsman — WorkMind" }] }),
  component: EmailPage,
});

const recipients = ["Client", "Manager", "Team"] as const;
const tones = ["Formal", "Informal", "Persuasive"] as const;

function Pill({ active, onClick, children }: { active: boolean; onClick: () => void; children: React.ReactNode }) {
  return (
    <button
      onClick={onClick}
      className={`px-3 py-1.5 rounded-full text-sm font-medium border ${active ? "bg-primary text-primary-foreground border-primary" : "bg-card hover:bg-accent"}`}
    >
      {children}
    </button>
  );
}

function EmailPage() {
  const { bump } = useStore();
  const callAi = useServerFn(aiChat);
  const [input, setInput] = useState("");
  const [recipient, setRecipient] = useState<(typeof recipients)[number]>("Client");
  const [tone, setTone] = useState<(typeof tones)[number]>("Formal");
  const [file, setFile] = useState<{ name: string; text: string } | null>(null);
  const [loading, setLoading] = useState(false);
  const [out, setOut] = useState<string>("");

  const run = async () => {
    if (!input.trim()) { toast.error("Add a few key points first."); return; }
    setLoading(true); setOut("");
    try {
      const prompt = `Draft a ${tone.toLowerCase()} email to a ${recipient.toLowerCase()}. Context / key points:\n${input}${file?.text ? `\n\nReference document:\n${file.text}` : ""}`;
      const { text } = await callAi({ data: { messages: [{ role: "user", content: prompt }], intent: "email" } });
      setOut(text);
      bump("emails", `Email drafted (${tone}, ${recipient})`);
      toast.success("Email drafted");
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Failed to draft email");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <PageHeader icon={Mail} title="Smart Email Draftsman" subtitle="Drop in keywords or context — we draft the email, you edit and send." />

      <div className="grid md:grid-cols-2 gap-6">
        <div className="rounded-xl border bg-card p-5 space-y-4">
          <div>
            <label className="text-sm font-medium">What is this email about?</label>
            <textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Enter raw key points, keywords, or context... e.g. 'project delay 2 weeks, vendor issue, need extension'"
              className="mt-2 w-full min-h-[140px] rounded-lg border bg-background px-3 py-2 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-ring"
              disabled={loading}
            />
          </div>

          <div>
            <div className="text-sm font-medium mb-2">Recipient</div>
            <div className="flex flex-wrap gap-2">
              {recipients.map((r) => <Pill key={r} active={recipient === r} onClick={() => setRecipient(r)}>{r}</Pill>)}
            </div>
          </div>

          <div>
            <div className="text-sm font-medium mb-2">Tone</div>
            <div className="flex flex-wrap gap-2">
              {tones.map((t) => <Pill key={t} active={tone === t} onClick={() => setTone(t)}>{t}</Pill>)}
            </div>
          </div>

          <FileUpload onChange={setFile} />

          <button
            onClick={run}
            disabled={loading}
            className="w-full inline-flex items-center justify-center gap-2 rounded-lg bg-primary text-primary-foreground font-medium py-2.5 disabled:opacity-60"
          >
            {loading ? <><Loader2 className="w-4 h-4 animate-spin" /> Drafting...</> : <><Sparkles className="w-4 h-4" /> Draft Email</>}
          </button>
        </div>

        <div className="rounded-xl border bg-card p-5">
          {loading ? <SkeletonOut /> : out ? (
            <EditableOutput label="Email draft" value={out} minHeight={320} />
          ) : (
            <EmptyState
              icon={Mail}
              title="Your draft will appear here"
              description="Add a few key points on the left — we'll generate a polished email you can edit inline."
              cta="Start with any keywords →"
            />
          )}
        </div>
      </div>
    </div>
  );
}

export function PageHeader({ icon: Icon, title, subtitle }: { icon: React.ComponentType<{ className?: string }>; title: string; subtitle: string }) {
  return (
    <header className="flex items-start gap-3">
      <div className="w-11 h-11 rounded-lg bg-primary/10 text-primary flex items-center justify-center shrink-0">
        <Icon className="w-5 h-5" />
      </div>
      <div>
        <h1 className="text-2xl md:text-3xl font-bold tracking-tight">{title}</h1>
        <p className="text-sm text-muted-foreground mt-1">{subtitle}</p>
      </div>
    </header>
  );
}

export function SkeletonOut() {
  return (
    <div className="space-y-3 animate-pulse">
      <div className="h-4 bg-muted rounded w-1/3" />
      <div className="h-5 bg-muted rounded w-2/3" />
      <div className="h-32 bg-muted rounded" />
    </div>
  );
}
