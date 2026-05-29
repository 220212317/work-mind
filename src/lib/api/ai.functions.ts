import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

const MessageSchema = z.object({
  role: z.enum(["system", "user", "assistant"]),
  content: z.string().min(1).max(20000),
});

const InputSchema = z.object({
  messages: z.array(MessageSchema).min(1).max(50),
  intent: z.enum(["chat", "email", "summary", "plan", "research"]).default("chat"),
});

const SYSTEMS: Record<string, string> = {
  chat: `You are WorkMind, a professional workplace AI assistant. Provide accurate, direct, actionable answers. When users ask "how to" questions, give concrete numbered steps — not analysis of the question. Be concise, practical, professional. Use markdown sparingly (short lists, bold key terms). Never include filler like "Great question!". If the user asks you to draft an email, summarize content, plan tasks, or research a topic, produce the deliverable directly in clean plain text suitable for editing.`,
  email: `You are an expert email writer. Produce a single professional email. Output format EXACTLY:
Subject: <subject line>

<body>

Sign off with "[Your Name]". No commentary, no markdown fences. If tone/audience are unspecified, infer reasonable defaults (professional, neutral).`,
  summary: `You summarize meeting notes or documents. Output format EXACTLY using these headers:
KEY POINTS:
- ...
- ...

DECISIONS:
- ...

ACTION ITEMS:
- [Owner] Task — Deadline
- ...

Be concise. No preamble, no closing remarks.`,
  plan: `You are a task planner. Produce a structured daily/weekly schedule prioritized by urgency and importance. Output format EXACTLY:
PRIORITIES:
- HIGH: ...
- MEDIUM: ...
- LOW: ...

SCHEDULE:
- 09:00–10:00 — Task
- 10:00–11:00 — Task
...

NOTE: <one-line strategic insight>

No preamble.`,
  research: `You are a research analyst. Decode the topic clearly. Output format EXACTLY:
SUMMARY:
<2-3 sentence executive summary>

KEY INSIGHTS:
1. ...
2. ...
3. ...

PLAIN ENGLISH:
<one short paragraph any non-expert can grasp>

RECOMMENDATIONS:
- ...
- ...

No preamble.`,
};

export const aiChat = createServerFn({ method: "POST" })
  .inputValidator((d: unknown) => InputSchema.parse(d))
  .handler(async ({ data }) => {
    const apiKey = process.env.LOVABLE_API_KEY;
    if (!apiKey) throw new Error("LOVABLE_API_KEY missing");

    const system = SYSTEMS[data.intent] ?? SYSTEMS.chat;
    const res = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Lovable-API-Key": apiKey,
      },
      body: JSON.stringify({
        model: "google/gemini-3-flash-preview",
        messages: [{ role: "system", content: system }, ...data.messages],
      }),
    });

    if (!res.ok) {
      const body = await res.text().catch(() => "");
      if (res.status === 429) throw new Error("Rate limit — please try again in a moment.");
      if (res.status === 402) throw new Error("AI credits exhausted. Add credits in Workspace → Usage.");
      throw new Error(`AI error (${res.status}): ${body.slice(0, 200)}`);
    }

    const json = (await res.json()) as { choices?: Array<{ message?: { content?: string } }> };
    const text = json.choices?.[0]?.message?.content ?? "";
    return { text };
  });
