// Mock AI engine — derives plausible outputs from raw input keywords.

export const delay = (ms = 1500) => new Promise((r) => setTimeout(r, ms));

const cap = (s: string) => s.charAt(0).toUpperCase() + s.slice(1);
const pickKeywords = (text: string, n = 5) => {
  const stop = new Set("the a an and or of to for in on with is are was were be been being i we you they it this that as at by from your our their about into".split(" "));
  const words = text.toLowerCase().match(/[a-z][a-z'-]{2,}/g) ?? [];
  const freq = new Map<string, number>();
  for (const w of words) if (!stop.has(w)) freq.set(w, (freq.get(w) ?? 0) + 1);
  return [...freq.entries()].sort((a, b) => b[1] - a[1]).slice(0, n).map(([w]) => w);
};

export function generateEmail(input: string, recipient: string, tone: string, fileCtx?: string) {
  const kws = pickKeywords(input + " " + (fileCtx ?? ""), 4);
  const topic = kws.slice(0, 2).map(cap).join(" ") || "Project Update";
  const greetings: Record<string, string> = {
    Client: "Dear Valued Partner,",
    Manager: "Hi,",
    Team: "Hey team,",
  };
  const closings: Record<string, string> = {
    Formal: "Kind regards,\n[Your Name]",
    Informal: "Cheers,\n[Your Name]",
    Persuasive: "Looking forward to your decision,\n[Your Name]",
  };
  const subject =
    tone === "Persuasive"
      ? `Action Needed: ${topic}`
      : tone === "Informal"
      ? `Quick note on ${topic.toLowerCase()}`
      : `Update — ${topic}`;

  const bulletLines = input
    .split(/[\n.;]+/)
    .map((s) => s.trim())
    .filter((s) => s.length > 4)
    .slice(0, 4);

  const body = `${greetings[recipient] ?? "Hello,"}

I hope this message finds you well. I wanted to reach out regarding ${topic.toLowerCase()}${kws[2] ? ` and ${kws[2]}` : ""}.

${
  bulletLines.length
    ? bulletLines.map((b) => `• ${cap(b)}`).join("\n")
    : `Based on our recent work around ${kws.join(", ") || "the project"}, I'd like to align on next steps.`
}

${
  tone === "Persuasive"
    ? `Given the momentum we've built, moving forward this week would put us in the strongest position.`
    : tone === "Informal"
    ? `Let me know what you think when you get a sec.`
    : `Please let me know if you have any questions or would like to discuss further.`
}

${closings[tone] ?? "Best,\n[Your Name]"}`;

  return { subject, body };
}

export function summarizeNotes(input: string) {
  const lines = input.split(/\n+/).map((l) => l.trim()).filter(Boolean);
  const kws = pickKeywords(input, 6);

  const keyPoints = (lines.length ? lines : kws).slice(0, 5).map((l) => {
    const t = l.replace(/^[-*•\d.)\s]+/, "");
    return cap(t.length > 110 ? t.slice(0, 107) + "..." : t);
  });

  const decisionLines = lines.filter((l) => /decid|agree|approv|confirm|will|going to|final/i.test(l));
  const decisions = (decisionLines.length ? decisionLines : keyPoints.slice(0, 3)).slice(0, 4).map((l) =>
    cap(l.replace(/^[-*•\d.)\s]+/, ""))
  );

  const actionLines = lines.filter((l) => /todo|action|follow.?up|task|@|by |before |due/i.test(l));
  const owners = ["Alex", "Priya", "Jordan", "Sam", "Taylor"];
  const deadlines = ["Friday", "Next Mon", "EOD", "Next sprint", "TBD"];
  const actions = (actionLines.length ? actionLines : keyPoints).slice(0, 4).map((l, i) => {
    const ownerMatch = l.match(/@(\w+)/);
    const dueMatch = l.match(/by (\w+)|before (\w+)/i);
    return {
      task: cap(l.replace(/^[-*•\d.)\s]+/, "").replace(/@\w+/, "").slice(0, 80)),
      owner: ownerMatch?.[1] ?? (actionLines.length ? "TBD" : owners[i % owners.length]),
      deadline: dueMatch?.[1] || dueMatch?.[2] || (actionLines.length ? "TBD" : deadlines[i % deadlines.length]),
    };
  });

  return { keyPoints, decisions, actions };
}

export function planTasks(input: string) {
  const raw = input.split(/[\n,;]+/).map((s) => s.trim()).filter((s) => s.length > 2);
  const tasks = raw.map((t, i) => {
    const high = /urgent|today|asap|high|critical|priority/i.test(t);
    return {
      id: i,
      title: cap(t.replace(/\b(urgent|today|asap|high priority|priority|critical)\b/gi, "").trim()) || `Task ${i + 1}`,
      priority: high ? "high" : i < 2 ? "med" : "low",
      time: `${9 + i}:00 – ${10 + i}:00`,
      block: i < 3 ? "Morning Focus" : i < 5 ? "Afternoon" : "Wrap-up",
    };
  });
  const insight =
    tasks.length > 6
      ? "Your load is heavy today — consider deferring low-priority items to tomorrow to protect deep-focus time."
      : tasks.length > 3
      ? "Balanced day. Front-load high-priority items in the morning when focus peaks."
      : "Light load — perfect window to tackle a strategic or long-term task you've been deferring.";
  return { tasks, insight };
}

export function researchTopic(input: string) {
  const kws = pickKeywords(input, 5);
  const topic = kws.slice(0, 2).map(cap).join(" ") || "the topic";
  return {
    summary: `${topic} is a rapidly evolving area where ${kws[2] ?? "innovation"} and ${kws[3] ?? "adoption"} are reshaping how teams operate. Current evidence points to measurable productivity gains when integrated thoughtfully.`,
    insights: [
      `${cap(kws[0] ?? "Adoption")} has accelerated significantly across mid-market organizations.`,
      `Cost-benefit ratios favor early integration, especially when ${kws[1] ?? "workflows"} are well-documented.`,
      `Risk concentrates in change management — not in the underlying technology.`,
      `Successful rollouts pair tooling with role-specific training programs.`,
      `Long-term value is unlocked when ${kws[4] ?? "metrics"} are tracked from day one.`,
    ],
    layman: `In plain terms: ${topic.toLowerCase()} is something most teams can now use to save time, but only if they invest in showing people how to use it. The tools work — the trick is the rollout.`,
  };
}

export function chatReply(input: string, fileCtx?: string) {
  const kws = pickKeywords(input + " " + (fileCtx ?? ""), 3);
  if (!input.trim()) return "Could you give me a bit more detail to work with?";
  const lead = fileCtx
    ? `Based on the file you shared and your question about ${kws[0] ?? "this"},`
    : `Great question about ${kws[0] ?? "that"} —`;
  return `${lead} here's how I'd think about it:

• The core idea hinges on ${kws[0] ?? "context"} and how it interacts with ${kws[1] ?? "your goals"}.
• A practical next step would be to clarify scope around ${kws[2] ?? "outcomes"} before committing time.
• If you'd like, I can break this into an action plan or draft a follow-up message.`;
}

export async function extractFileText(file: File): Promise<string> {
  if (file.type.startsWith("text/") || file.name.endsWith(".txt")) {
    return (await file.text()).slice(0, 4000);
  }
  return `[${file.name}] — ${file.type || "document"} (${(file.size / 1024).toFixed(1)} KB). Binary content indexed for context.`;
}
