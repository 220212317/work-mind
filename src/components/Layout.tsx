import { Link, Outlet, useRouterState } from "@tanstack/react-router";
import { Brain, Home, Mail, FileText, CalendarCheck, Search, MessageSquare, Sun, Moon } from "lucide-react";
import { useTheme } from "@/lib/theme";

const nav = [
  { to: "/", label: "Dashboard", icon: Home },
  { to: "/email", label: "Email", icon: Mail },
  { to: "/summarize", label: "Summarize", icon: FileText },
  { to: "/planner", label: "Planner", icon: CalendarCheck },
  { to: "/research", label: "Research", icon: Search },
  { to: "/chat", label: "Chat", icon: MessageSquare },
] as const;

function ThemeToggle() {
  const { theme, toggle } = useTheme();
  return (
    <button
      onClick={toggle}
      aria-label="Toggle theme"
      className="flex items-center justify-center w-9 h-9 rounded-lg border hover:bg-accent"
    >
      {theme === "dark" ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
    </button>
  );
}

function Logo() {
  return (
    <div className="flex items-center gap-2">
      <div className="w-9 h-9 rounded-lg bg-primary flex items-center justify-center text-primary-foreground">
        <Brain className="w-5 h-5" />
      </div>
        <div className="leading-tight">
        <div className="font-bold text-base">WorkMind</div>
      </div>
    </div>
  );
}

export function Layout() {
  const pathname = useRouterState({ select: (s) => s.location.pathname });

  return (
    <div className="min-h-screen flex bg-background text-foreground">
      {/* Desktop sidebar */}
      <aside className="hidden md:flex w-60 shrink-0 flex-col border-r bg-sidebar text-sidebar-foreground p-4 gap-2">
        <div className="px-2 py-2"><Logo /></div>
        <nav className="flex flex-col gap-1 mt-4">
          {nav.map((n) => {
            const active = n.to === "/" ? pathname === "/" : pathname.startsWith(n.to);
            return (
              <Link
                key={n.to}
                to={n.to}
                className={`flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium ${active ? "bg-primary text-primary-foreground" : "hover:bg-sidebar-accent"}`}
              >
                <n.icon className="w-4 h-4" />
                {n.label}
              </Link>
            );
          })}
        </nav>
        <div className="mt-auto flex items-center justify-between pt-4 border-t">
          <span className="text-xs text-muted-foreground">Theme</span>
          <ThemeToggle />
        </div>
      </aside>

      {/* Mobile top bar */}
      <div className="md:hidden fixed top-0 inset-x-0 h-14 border-b bg-sidebar z-30 flex items-center justify-between px-4">
        <Logo />
        <ThemeToggle />
      </div>

      {/* Main */}
      <main className="flex-1 min-w-0 pt-14 md:pt-0 pb-20 md:pb-0">
        <div className="max-w-5xl mx-auto p-4 md:p-8">
          <Outlet />
        </div>
      </main>

      {/* Mobile bottom nav */}
      <nav className="md:hidden fixed bottom-0 inset-x-0 z-30 border-t bg-sidebar grid grid-cols-6">
        {nav.map((n) => {
          const active = n.to === "/" ? pathname === "/" : pathname.startsWith(n.to);
          return (
            <Link
              key={n.to}
              to={n.to}
              className={`flex flex-col items-center justify-center gap-0.5 py-2 text-[10px] ${active ? "text-primary" : "text-muted-foreground"}`}
            >
              <n.icon className="w-4 h-4" />
              {n.label}
            </Link>
          );
        })}
      </nav>
    </div>
  );
}
