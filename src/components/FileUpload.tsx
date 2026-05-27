import { useRef, useState } from "react";
import { Upload, X, FileText } from "lucide-react";
import { extractFileText } from "@/lib/mock-ai";

export function FileUpload({
  onChange,
}: {
  onChange: (data: { name: string; text: string } | null) => void;
}) {
  const [drag, setDrag] = useState(false);
  const [file, setFile] = useState<{ name: string; text: string } | null>(null);
  const ref = useRef<HTMLInputElement>(null);

  const handle = async (f: File) => {
    const text = await extractFileText(f);
    const data = { name: f.name, text };
    setFile(data);
    onChange(data);
  };

  const clear = () => {
    setFile(null);
    onChange(null);
    if (ref.current) ref.current.value = "";
  };

  if (file) {
    return (
      <div className="rounded-lg border bg-muted/40 p-3">
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-2 min-w-0">
            <FileText className="w-4 h-4 text-primary shrink-0" />
            <span className="text-sm font-medium truncate">{file.name}</span>
          </div>
          <button onClick={clear} className="text-xs text-muted-foreground hover:text-primary flex items-center gap-1">
            <X className="w-3 h-3" /> Clear
          </button>
        </div>
        <div className="mt-2 text-xs text-muted-foreground bg-background/60 rounded p-2 max-h-20 overflow-hidden">
          {file.text.slice(0, 200)}{file.text.length > 200 ? "..." : ""}
        </div>
      </div>
    );
  }

  return (
    <label
      onDragOver={(e) => { e.preventDefault(); setDrag(true); }}
      onDragLeave={() => setDrag(false)}
      onDrop={async (e) => {
        e.preventDefault(); setDrag(false);
        const f = e.dataTransfer.files?.[0];
        if (f) await handle(f);
      }}
      className={`flex flex-col items-center justify-center gap-2 rounded-lg border-2 border-dashed p-4 cursor-pointer text-center ${drag ? "border-primary bg-primary/5" : "border-border hover:border-primary/50"}`}
    >
      <Upload className="w-5 h-5 text-muted-foreground" />
      <div className="text-sm">
        <span className="text-primary font-medium">Drop a file</span> or click to upload
      </div>
      <div className="text-xs text-muted-foreground">.pdf, .docx, .txt — for deeper context</div>
      <input
        ref={ref}
        type="file"
        accept=".pdf,.docx,.txt,text/plain"
        className="hidden"
        onChange={(e) => { const f = e.target.files?.[0]; if (f) handle(f); }}
      />
    </label>
  );
}
