import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { FileText, Loader2, Sparkles } from "lucide-react";
import { toast } from "sonner";
import { FileUpload } from "@/components/FileUpload";
import { EmptyState } from "@/components/EmptyState";
import { Disclaimer } from "@/components/Disclaimer";
import { useStore } from "@/lib/store";
import { delay, summarizeNotes } from "@/lib/mock-ai";
import { PageHeader, SkeletonOut } from "./email";

export const Route = createFileRoute("/summarize")({
  head: () => ({ meta: [{ title: "Meeting Summarizer — WorkMind AI" }] }),
  component: SummarizePage,
});

function SummarizePage() {
  const { bump } = useStore();
  const [input, setInput] = useState("");
  const [file, setFile] = useState<{ name: string; text: string } | null>(null);
  const [loading, setLoading] = useState(false);
  const [out, setOut] = useState<ReturnType<typeof summarizeNotes> | null>(null);

  const run = async () => {
    const source = input.trim() || file?.text || "";
    if (!source) { toast.error("Paste notes or upload a transcript."); return; }
    setLoading(true);
    setOut(null);
    await delay();
    const r = summarizeNotes(source);
    setOut(r);
    setLoading(false);
    bump("summaries", `Summary created — ${r.keyPoints.length} key points`);
    toast.success("Summary ready");
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
          <div className="space-y-6">
            <section>
              <h2 className="text-sm font-bold uppercase tracking-wider text-primary mb-3">Key Points</h2>
              <ul className="space-y-2">
                {out.keyPoints.map((k, i) => (
                  <li key={i} className="flex gap-2 text-sm"><span className="text-primary">•</span><span>{k}</span></li>
                ))}
              </ul>
            </section>

            <section>
              <h2 className="text-sm font-bold uppercase tracking-wider text-primary mb-3">Decisions Made</h2>
              <ol className="space-y-2 list-decimal list-inside">
                {out.decisions.map((d, i) => (<li key={i} className="text-sm">{d}</li>))}
              </ol>
            </section>

            <section>
              <h2 className="text-sm font-bold uppercase tracking-wider text-primary mb-3">Action Items</h2>
              <div className="overflow-x-auto rounded-lg border">
                <table className="w-full text-sm">
                  <thead className="bg-muted/50 text-left">
                    <tr>
                      <th className="px-3 py-2 font-medium">Task</th>
                      <th className="px-3 py-2 font-medium">Owner</th>
                      <th className="px-3 py-2 font-medium">Deadline</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y">
                    {out.actions.map((a, i) => (
                      <tr key={i}>
                        <td className="px-3 py-2">{a.task}</td>
                        <td className="px-3 py-2">
                          <span className={a.owner === "TBD" ? "text-muted-foreground italic" : ""}>{a.owner}</span>
                        </td>
                        <td className="px-3 py-2">
                          <span className={a.deadline === "TBD" ? "text-muted-foreground italic" : ""}>{a.deadline}</span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </section>
            <Disclaimer />
          </div>
        ) : (
          <EmptyState
            icon={FileText}
            title="Structured summary will appear here"
            description="Paste messy notes — we'll split them into Key Points, Decisions, and an Action Items table."
            cta="Drop your transcript above →"
          />
        )}
      </div>
    </div>
  );
}
