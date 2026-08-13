import { Link } from "@tanstack/react-router";

/** Replaceable brand mark for BATTLE ARENA. Swap the SVG for a real logo later. */
export function Logo({ compact = false }: { compact?: boolean }) {
  return (
    <Link to="/" className="flex items-center gap-2.5">
      <span className="relative grid size-9 place-items-center">
        <svg viewBox="0 0 40 40" className="size-9" aria-hidden="true">
          <defs>
            <linearGradient id="ba-logo" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="oklch(0.62 0.24 28)" />
              <stop offset="100%" stopColor="oklch(0.75 0.19 60)" />
            </linearGradient>
          </defs>
          <path
            d="M20 2 3 11v18l17 9 17-9V11L20 2Z"
            fill="none"
            stroke="url(#ba-logo)"
            strokeWidth="2.5"
          />
          <path d="M20 10 13 27h4.5l2.5-7 2.5 7H27L20 10Z" fill="url(#ba-logo)" />
        </svg>
      </span>
      {!compact && (
        <span className="text-display text-lg leading-none">
          Battle<span className="text-fire"> Arena</span>
        </span>
      )}
    </Link>
  );
}