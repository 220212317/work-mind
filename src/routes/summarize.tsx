import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { FileText, Loader2, Sparkles } from "lucide-react";
import { toast } from "sonner";
import { useServerFn } from "@tanstack/react-start";
import { FileUpload } from "@/components/FileUpload";
import { EmptyState } from "@/components/EmptyState";
import { EditableOutput } from "@/components/EditableOutput";
import { useStore } from "@/lib/store";
import { aiChat } from "@/lib/api/ai.functions";
import { PageHeader, SkeletonOut } from "./email";

export const Route = createFileRoute("/summarize")({
  head: () => ({ meta: [{ title: "Meeting Summarizer — WorkMind" }] }),
  component: SummarizePage,
});

function SummarizePage() {
  const { bump } = useStore();
  const callAi = useServerFn(aiChat);
  const [input, setInput] = useState("");
  const [file, setFile] = useState<{ name: string; text: string } | null>(null);
  const [loading, setLoading] = useState(false);
  const [out, setOut] = useState<string>("");

  const run = async () => {
    const source = (input.trim() + (file?.text ? `\n\n${file.text}` : "")).trim();
    if (!source) { toast.error("Paste notes or upload a transcript."); return; }
    setLoading(true); setOut("");
    try {
      const { text } = await callAi({ data: { messages: [{ role: "user", content: `Summarize the following notes:\n\n${source}` }], intent: "summary" } });
      setOut(text);
      bump("summaries", `Summary created`);
      toast.success("Summary ready");
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Failed to summarize");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <PageHeader icon={FileText} title="Meeting Notes Summarizer" subtitle="Paste raw, messy notes — we structure them automatically." />

      <div className="rounded-xl border bg-card p-5 space-y-4">
        <textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Paste your raw, messy meeting notes, or upload a transcript..."
          className="w-full min-h-[180px] rounded-lg border bg-background px-3 py-2 text-sm resize-y focus:outline-none focus:ring-2 focus:ring-ring"
          disabled={loading}
        />
        <FileUpload onChange={setFile} />
        <button
          onClick={run}
          disabled={loading}
          className="inline-flex items-center justify-center gap-2 rounded-lg bg-primary text-primary-foreground font-medium px-5 py-2.5 disabled:opacity-60"
        >
          {loading ? <><Loader2 className="w-4 h-4 animate-spin" /> Summarizing...</> : <><Sparkles className="w-4 h-4" /> Summarize Notes</>}
        </button>
      </div>

      <div className="rounded-xl border bg-card p-5">
        {loading ? <SkeletonOut /> : out ? (
          <EditableOutput label="Structured summary" value={out} minHeight={360} />
        ) : (
          <EmptyState
            icon={FileText}
            title="Structured summary will appear here"
            description="Paste messy notes — we'll split them into Key Points, Decisions, and Action Items in an editable text block."
            cta="Drop your transcript above →"
          />
        )}
      </div>
    </div>
  );
}
