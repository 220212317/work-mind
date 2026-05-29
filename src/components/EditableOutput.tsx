import { useEffect, useState } from "react";
import { Copy, Check, Pencil } from "lucide-react";
import { toast } from "sonner";

export function EditableOutput({
  label,
  value,
  onChange,
  minHeight = 260,
}: {
  label: string;
  value: string;
  onChange?: (v: string) => void;
  minHeight?: number;
}) {
  const [local, setLocal] = useState(value);
  const [done, setDone] = useState(false);

  useEffect(() => { setLocal(value); }, [value]);

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between text-xs">
        <span className="inline-flex items-center gap-1.5 font-medium text-primary uppercase tracking-wider">
          <Pencil className="w-3 h-3" /> {label} — editable
        </span>
        <button
          onClick={async () => {
            await navigator.clipboard.writeText(local);
            setDone(true); toast.success("Copied");
            setTimeout(() => setDone(false), 1500);
          }}
          className="inline-flex items-center gap-1 px-2 py-1 rounded hover:bg-accent text-muted-foreground hover:text-foreground"
        >
          {done ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
          {done ? "Copied" : "Copy"}
        </button>
      </div>
      <textarea
        value={local}
        onChange={(e) => { setLocal(e.target.value); onChange?.(e.target.value); }}
        style={{ minHeight }}
        className="w-full rounded-lg border bg-background px-3 py-2 text-sm font-mono leading-relaxed resize-y focus:outline-none focus:ring-2 focus:ring-ring"
      />
      <p className="text-[11px] text-muted-foreground italic">
        AI-generated content — please review and edit before use.
      </p>
    </div>
  );
}
