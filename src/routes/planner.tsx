import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { CalendarCheck, Loader2, Sparkles } from "lucide-react";
import { toast } from "sonner";
import { useServerFn } from "@tanstack/react-start";
import { FileUpload } from "@/components/FileUpload";
import { EmptyState } from "@/components/EmptyState";
import { EditableOutput } from "@/components/EditableOutput";
import { useStore } from "@/lib/store";
import { aiChat } from "@/lib/api/ai.functions";
import { PageHeader, SkeletonOut } from "./email";

export const Route = createFileRoute("/planner")({
  head: () => ({ meta: [{ title: "Task Planner — WorkMind" }] }),
  component: PlannerPage,
});

function PlannerPage() {
  const { bump } = useStore();
  const callAi = useServerFn(aiChat);
  const [input, setInput] = useState("");
  const [file, setFile] = useState<{ name: string; text: string } | null>(null);
  const [loading, setLoading] = useState(false);
  const [out, setOut] = useState<string>("");

  const run = async () => {
    const source = (input.trim() + (file?.text ? `\n\n${file.text}` : "")).trim();
    if (!source) { toast.error("Add tasks first."); return; }
    setLoading(true); setOut("");
    try {
      const { text } = await callAi({ data: { messages: [{ role: "user", content: `Organize these tasks into a prioritized schedule:\n\n${source}` }], intent: "plan" } });
      setOut(text);
      bump("schedules", `Schedule optimized`);
      toast.success("Timeline ready");
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Failed to plan");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <PageHeader icon={CalendarCheck} title="AI Task Planner & Optimizer" subtitle="Dump your tasks in any order — we'll prioritize and time-block them." />

      <div className="rounded-xl border bg-card p-5 space-y-4">
        <textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Dump your tasks here... e.g. 'finish slides urgent, call Sara, review PR, gym, prep demo today'"
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
          <EditableOutput label="Prioritized schedule" value={out} minHeight={360} />
        ) : (
          <EmptyState
            icon={CalendarCheck}
            title="Your optimized timeline will appear here"
            description="Dump tasks in any order — we'll prioritize and time-block them into an editable schedule."
            cta="Try: 'demo prep urgent, code review, lunch, write report' →"
          />
        )}
      </div>
    </div>
  );
}
