import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { CalendarCheck, Loader2, Sparkles, Lightbulb } from "lucide-react";
import { toast } from "sonner";
import { FileUpload } from "@/components/FileUpload";
import { EmptyState } from "@/components/EmptyState";
import { Disclaimer } from "@/components/Disclaimer";
import { useStore } from "@/lib/store";
import { delay, planTasks } from "@/lib/mock-ai";
import { PageHeader, SkeletonOut } from "./email";

export const Route = createFileRoute("/planner")({
  head: () => ({ meta: [{ title: "Task Planner — WorkMind" }] }),
  component: PlannerPage,
});

function PlannerPage() {
  const { bump } = useStore();
  const [input, setInput] = useState("");
  const [file, setFile] = useState<{ name: string; text: string } | null>(null);
  const [loading, setLoading] = useState(false);
  const [out, setOut] = useState<ReturnType<typeof planTasks> | null>(null);

  const run = async () => {
    const source = input.trim() || file?.text || "";
    if (!source) { toast.error("Add tasks first."); return; }
    setLoading(true); setOut(null);
    await delay();
    const r = planTasks(source);
    setOut(r); setLoading(false);
    bump("schedules", `Schedule optimized — ${r.tasks.length} tasks blocked`);
    toast.success("Timeline ready");
  };

  return (
    <div className="space-y-6">
      <PageHeader icon={CalendarCheck} title="AI Task Planner & Optimizer" subtitle="Dump your tasks in any order — we'll optimize the day." />

      <div className="rounded-xl border bg-card p-5 space-y-4">
        <textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Dump your tasks here in any order... e.g. 'finish slides urgent, call Sara, review PR, gym, prep demo today'"
          className="w-full min-h-[140px] rounded-lg border bg-background px-3 py-2 text-sm resize-y focus:outline-none focus:ring-2 focus:ring-ring"
          disabled={loading}
        />
        <FileUpload onChange={setFile} />
        <button
          onClick={run}
          disabled={loading}
          className="inline-flex items-center justify-center gap-2 rounded-lg bg-primary text-primary-foreground font-medium px-5 py-2.5 disabled:opacity-60"
        >
          {loading ? <><Loader2 className="w-4 h-4 animate-spin" /> Optimizing...</> : <><Sparkles className="w-4 h-4" /> Optimize Schedule</>}
        </button>
      </div>

      <div className="rounded-xl border bg-card p-5">
        {loading ? <SkeletonOut /> : out ? (
          <div className="space-y-6">
            {(["Morning Focus", "Afternoon", "Wrap-up"] as const).map((block) => {
              const items = out.tasks.filter((t) => t.block === block);
              if (!items.length) return null;
              return (
                <section key={block}>
                  <h2 className="text-sm font-bold uppercase tracking-wider text-muted-foreground mb-2">{block}</h2>
                  <div className="space-y-2">
                    {items.map((t) => (
                      <div key={t.id} className="flex items-center gap-3 rounded-lg border p-3 bg-background/50">
                        <div className="text-xs font-mono text-muted-foreground w-24 shrink-0">{t.time}</div>
                        <div className="flex-1 text-sm">{t.title}</div>
                        {t.priority === "high" && (
                          <span className="text-[10px] font-semibold uppercase tracking-wide bg-primary text-primary-foreground px-2 py-0.5 rounded-full">
                            High
                          </span>
                        )}
                        {t.priority === "med" && (
                          <span className="text-[10px] font-semibold uppercase tracking-wide bg-muted text-muted-foreground px-2 py-0.5 rounded-full">
                            Med
                          </span>
                        )}
                      </div>
                    ))}
                  </div>
                </section>
              );
            })}
            <div className="rounded-lg border border-primary/30 bg-primary/5 p-4 flex gap-3">
              <Lightbulb className="w-5 h-5 text-primary shrink-0 mt-0.5" />
              <div>
                <div className="font-semibold text-sm text-primary">AI Efficiency Insight</div>
                <p className="text-sm mt-1 text-foreground/90">{out.insight}</p>
              </div>
            </div>
            <Disclaimer />
          </div>
        ) : (
          <EmptyState
            icon={CalendarCheck}
            title="Your optimized timeline will appear here"
            description="Dump tasks in any order — mention urgency if you like. We'll block out your day."
            cta="Try: 'demo prep urgent, code review, lunch, write report' →"
          />
        )}
      </div>
    </div>
  );
}
