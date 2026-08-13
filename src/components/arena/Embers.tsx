import { useMemo } from "react";

/** Lightweight CSS ember particle field. */
export function Embers({ count = 18 }: { count?: number }) {
  const embers = useMemo(
    () =>
      Array.from({ length: count }, (_, i) => ({
        left: (i * 97) % 100,
        delay: (i % 9) * 1.4,
        duration: 9 + (i % 5) * 2.5,
        size: 2 + (i % 3),
      })),
    [count],
  );

  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden="true">
      {embers.map((e, i) => (
        <span
          key={i}
          className="absolute bottom-0 rounded-full bg-ember"
          style={{
            left: `${e.left}%`,
            width: e.size,
            height: e.size,
            filter: "blur(0.5px)",
            boxShadow: "0 0 10px 2px color-mix(in oklab, var(--ember) 60%, transparent)",
            animation: `ember-rise ${e.duration}s linear ${e.delay}s infinite`,
          }}
        />
      ))}
    </div>
  );
}