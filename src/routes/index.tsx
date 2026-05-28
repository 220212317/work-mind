import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Mail, FileText, CalendarCheck, Search, MessageSquare, Sparkles, Clock, ArrowRight } from "lucide-react";
import { useStore, relativeTime } from "@/lib/store";

export const Route = createFileRoute("/")({
  head: () => ({ meta: [{ title: "Dashboard — WorkMind AI" }] }),
  component: Dashboard,
});

const features = [
  { to: "/email", icon: Mail, name: "Smart Email Draftsman", desc: "Turn raw keywords into polished, on-tone emails with auto-generated subject lines." },
  { to: "/summarize", icon: FileText, name: "Meeting Summarizer", desc: "Convert messy transcripts into key points, decisions, and action items." },
  { to: "/planner", icon: CalendarCheck, name: "Task Planner", desc: "Dump tasks in any order — get an optimized, blocked daily timeline." },
  { to: "/research", icon: Search, name: "Research Assistant", desc: "Decode complex topics into executive summaries and plain-language takeaways." },
  { to: "/chat", icon: MessageSquare, name: "AI Chatbot", desc: "Ask, brainstorm, or drop files for contextual conversation." },
  { to: "/email", icon: Sparkles, name: "Quick Start", desc: "Not sure where to begin? Start with a quick email draft." },
] as const;

function Dashboard() {
  const { stats, activity } = useStore();
  const cards = [
    { label: "Emails Drafted", value: stats.emails, icon: Mail },
    { label: "Summaries Created", value: stats.summaries, icon: FileText },
    { label: "Schedules Optimized", value: stats.schedules, icon: CalendarCheck },
    { label: "Research Insights", value: stats.research, icon: Search },
  ];

  return (
    <div className="space-y-8">
      <header className="space-y-2">
        <div className="inline-flex items-center gap-1.5 text-xs font-medium text-primary bg-primary/10 px-3 py-1 rounded-full">
          <Sparkles className="w-3 h-3" /> Intent-first AI workspace
        </div>
        <h1 className="text-3xl md:text-4xl font-bold tracking-tight">
          Welcome to WorkMind AI — What would you like to do today?
        </h1>
        <p className="text-muted-foreground">Five generative tools, one open input. Just describe what you need.</p>
      </header>

      <section className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {cards.map((c) => (
          <div key={c.label} className="rounded-xl border bg-card p-4">
            <div className="flex items-center justify-between">
              <c.icon className="w-4 h-4 text-primary" />
              <span className="text-3xl font-bold tabular-nums">{c.value}</span>
            </div>
            <div className="mt-2 text-xs font-medium text-muted-foreground">{c.label}</div>
          </div>
        ))}
      </section>

      <section>
        <h2 className="text-lg font-semibold mb-3">Core Features</h2>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {features.map((f) => (
            <div key={f.name + f.to} className="rounded-xl border bg-card p-5 flex flex-col">
              <div className="w-10 h-10 rounded-lg bg-primary/10 text-primary flex items-center justify-center mb-3">
                <f.icon className="w-5 h-5" />
              </div>
              <h3 className="font-semibold">{f.name}</h3>
              <p className="mt-1 text-sm text-muted-foreground flex-1">{f.desc}</p>
              <Link
                to={f.to}
                className="mt-4 inline-flex items-center gap-1 text-sm font-medium text-primary hover:gap-2 transition-all"
              >
                Get Started <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          ))}
        </div>
      </section>

      <section>
        <h2 className="text-lg font-semibold mb-3 flex items-center gap-2">
          <Clock className="w-4 h-4" /> Recent Activity
        </h2>
        <div className="rounded-xl border bg-card divide-y">
          {activity.slice(0, 5).map((a) => (
            <div key={a.id} className="px-4 py-3 flex items-center justify-between text-sm">
              <span>{a.text}</span>
              <span className="text-xs text-muted-foreground shrink-0 ml-3">{relativeTime(a.at)}</span>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
