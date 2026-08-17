import { useEffect, useState } from "react";

function diff(target: string) {
  return new Date(target).getTime() - Date.now();
}

export function Countdown({ target, compact = false }: { target: string; compact?: boolean }) {
  const [ms, setMs] = useState<number | null>(null);

  useEffect(() => {
    setMs(diff(target));
    const id = setInterval(() => setMs(diff(target)), 1000);
    return () => clearInterval(id);
  }, [target]);

  if (ms === null) {
    return <span className="text-display text-muted-foreground">--D : --H : --M : --S</span>;
  }

  if (ms <= 0) {
    return (
      <span className="text-display text-destructive animate-pulse">MATCH LIVE 🔴</span>
    );
  }

  const s = Math.floor(ms / 1000);
  const parts = [
    { v: Math.floor(s / 86400), l: "D" },
    { v: Math.floor((s % 86400) / 3600), l: "H" },
    { v: Math.floor((s % 3600) / 60), l: "M" },
    { v: s % 60, l: "S" },
  ];

  if (compact) {
    return (
      <span className="text-display tabular-nums text-primary">
        {parts.map((p) => `${String(p.v).padStart(2, "0")}${p.l}`).join(" : ")}
      </span>
    );
  }

  return (
    <div className="flex gap-2">
      {parts.map((p) => (
        <div
          key={p.l}
          className="glass-panel min-w-16 rounded-md px-3 py-2 text-center"
          style={{ boxShadow: "var(--shadow-glow)" }}
        >
          <div className="text-display text-2xl tabular-nums text-foreground">
            {String(p.v).padStart(2, "0")}
          </div>
          <div className="text-[10px] tracking-[0.3em] text-muted-foreground">{p.l}</div>
        </div>
      ))}
    </div>
  );
}