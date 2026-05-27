import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Search, Loader2, Sparkles, BookOpen } from "lucide-react";
import { toast } from "sonner";
import { FileUpload } from "@/components/FileUpload";
import { EmptyState } from "@/components/EmptyState";
import { Disclaimer } from "@/components/Disclaimer";
import { useStore } from "@/lib/store";
import { delay, researchTopic } from "@/lib/mock-ai";
import { PageHeader, SkeletonOut } from "./email";

export const Route = createFileRoute("/research")({
  head: () => ({ meta: [{ title: "Research Assistant — WorkMind AI" }] }),
  component: ResearchPage,
});

function ResearchPage() {
  const { bump } = useStore();
  const [input, setInput] = useState("");
  const [file, setFile] = useState<{ name: string; text: string } | null>(null);
  const [loading, setLoading] = useState(false);
  const [out, setOut] = useState<ReturnType<typeof researchTopic> | null>(null);

  const run = async () => {
    const source = (input + " " + (file?.text ?? "")).trim();
    if (!source) { toast.error("Enter a topic or upload a document."); return; }
    setLoading(true); setOut(null);
    await delay();
    setOut(researchTopic(source));
    setLoading(false);
    bump("research", `Research generated on "${input.slice(0, 40) || file?.name}"`);
    toast.success("Insights ready");
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
          <article className="space-y-6 prose-academic">
            <section>
              <h2 className="text-sm font-bold uppercase tracking-wider text-primary mb-2">Executive Summary</h2>
              <p className="text-base leading-relaxed">{out.summary}</p>
            </section>
            <section>
              <h2 className="text-sm font-bold uppercase tracking-wider text-primary mb-3">Core Insights</h2>
              <ul className="space-y-2">
                {out.insights.map((i, idx) => (
                  <li key={idx} className="flex gap-3 text-sm">
                    <span className="font-mono text-primary font-semibold">0{idx + 1}</span>
                    <span>{i}</span>
                  </li>
                ))}
              </ul>
            </section>
            <section className="rounded-lg border bg-muted/30 p-4">
              <div className="flex items-center gap-2 mb-2 text-primary">
                <BookOpen className="w-4 h-4" />
                <h2 className="text-sm font-bold uppercase tracking-wider">Layman's Terms</h2>
              </div>
              <p className="text-sm leading-relaxed">{out.layman}</p>
            </section>
            <Disclaimer />
          </article>
        ) : (
          <EmptyState
            icon={Search}
            title="Insights will appear here"
            description="Paste a topic, article, or upload a doc — we'll deliver an exec summary, core insights, and a plain-English translation."
            cta="Try: 'quantum computing in supply chain' →"
          />
        )}
      </div>
    </div>
  );
}
