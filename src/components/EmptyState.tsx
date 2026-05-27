import type { LucideIcon } from "lucide-react";

export function EmptyState({ icon: Icon, title, description, cta }: { icon: LucideIcon; title: string; description: string; cta?: string }) {
  return (
    <div className="flex flex-col items-center justify-center text-center py-16 px-6 rounded-lg border border-dashed">
      <div className="w-14 h-14 rounded-full bg-primary/10 flex items-center justify-center mb-4">
        <Icon className="w-7 h-7 text-primary" />
      </div>
      <h3 className="text-base font-semibold mb-1">{title}</h3>
      <p className="text-sm text-muted-foreground max-w-md">{description}</p>
      {cta && <p className="mt-4 text-xs text-primary font-medium">{cta}</p>}
    </div>
  );
}
