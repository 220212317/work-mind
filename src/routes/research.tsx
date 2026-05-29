import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Search, Loader2, Sparkles } from "lucide-react";
import { toast } from "sonner";
import { useServerFn } from "@tanstack/react-start";
import { FileUpload } from "@/components/FileUpload";
import { EmptyState } from "@/components/EmptyState";
import { EditableOutput } from "@/components/EditableOutput";
import { useStore } from "@/lib/store";
import { aiChat } from "@/lib/api/ai.functions";
import { PageHeader, SkeletonOut } from "./email";

export const Route = createFileRoute("/research")({
  head: () => ({ meta: [{ title: "Research Assistant — WorkMind" }] }),
  component: ResearchPage,
});

function ResearchPage() {
  const { bump } = useStore();
  const callAi = useServerFn(aiChat);
  const [input, setInput] = useState("");
  const [file, setFile] = useState<{ name: string; text: string } | null>(null);
  const [loading, setLoading] = useState(false);
  const [out, setOut] = useState<string>("");

  const run = async () => {
    const source = (input.trim() + (file?.text ? `\n\n${file.text}` : "")).trim();
    if (!source) { toast.error("Enter a topic or upload a document."); return; }
    setLoading(true); setOut("");
    try {
      const { text } = await callAi({ data: { messages: [{ role: "user", content: `Research and decode this topic for a busy professional:\n\n${source}` }], intent: "research" } });
      setOut(text);
      bump("research", `Research generated on "${input.slice(0, 40) || file?.name}"`);
      toast.success("Insights ready");
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Failed to research");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <PageHeader icon={Search} title="AI Research Assistant" subtitle="Decode complex topics into scannable, plain-language insights." />

      <div className="rounded-xl border bg-card p-5 space-y-4">
        <textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Enter a complex topic, paste an article, or upload a document you need decoded..."
          className="w-full min-h-[120px] rounded-lg border bg-background px-3 py-2 text-sm resize-y focus:outline-none focus:ring-2 focus:ring-ring"
          disabled={loading}
        />
        <FileUpload onChange={setFile} />
        <button
          onClick={run}
          disabled={loading}
          className="inline-flex items-center justify-center gap-2 rounded-lg bg-primary text-primary-foreground font-medium px-5 py-2.5 disabled:opacity-60"
        >
          {loading ? <><Loader2 className="w-4 h-4 animate-spin" /> Researching...</> : <><Sparkles className="w-4 h-4" /> Generate Insights</>}
        </button>
      </div>

      <div className="rounded-xl border bg-card p-5">
        {loading ? <SkeletonOut /> : out ? (
          <EditableOutput label="Research brief" value={out} minHeight={400} />
        ) : (
          <EmptyState
            icon={Search}
            title="Insights will appear here"
            description="Paste a topic, article, or upload a doc — we'll deliver an executive summary, key insights, and recommendations in an editable brief."
            cta="Try: 'quantum computing in supply chain' →"
          />
        )}
      </div>
    </div>
  );
}
