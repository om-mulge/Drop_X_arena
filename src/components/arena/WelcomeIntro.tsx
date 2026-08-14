import { useEffect, useState } from "react";

import characterImg from "@/assets/welcome-character.png";
import { Embers } from "./Embers";
import { Button } from "@/components/ui/button";

/** Cinematic welcome overlay with a character greeting on first open. */
export function WelcomeIntro() {
  const [mounted, setMounted] = useState(false);
  const [visible, setVisible] = useState(false);
  const [closing, setClosing] = useState(false);

  useEffect(() => {
    setMounted(true);
    if (typeof window === "undefined") return;
    if (sessionStorage.getItem("ba-welcome-seen")) return;
    setVisible(true);
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "";
    };
  }, []);

  function dismiss() {
    setClosing(true);
    sessionStorage.setItem("ba-welcome-seen", "1");
    document.body.style.overflow = "";
    window.setTimeout(() => setVisible(false), 550);
  }

  useEffect(() => {
    if (!visible || closing) return;
    const t = window.setTimeout(dismiss, 6500);
    return () => window.clearTimeout(t);
  }, [visible, closing]);

  if (!mounted || !visible) return null;

  return (
    <div
      className="fixed inset-0 z-[100] overflow-hidden bg-background"
      style={{ animation: closing ? "intro-out 0.55s ease-in forwards" : undefined }}
      role="dialog"
      aria-label="Welcome to Battle Arena"
    >
      <div className="grid-lines absolute inset-0 opacity-25" />
      <div
        className="absolute inset-0"
        style={{ background: "var(--gradient-arena)", opacity: 0.9 }}
      />
      <Embers count={26} />
      <div
        className="absolute inset-x-0 top-0 h-px"
        style={{
          background: "var(--gradient-fire)",
          animation: "scan-sweep 2.4s ease-in-out infinite",
        }}
      />

      <div className="relative mx-auto flex h-full w-full max-w-6xl flex-col items-center justify-center gap-6 px-6 md:flex-row md:justify-between">
        <div className="order-2 text-center md:order-1 md:text-left">
          <p
            className="text-display text-xs tracking-[0.4em] text-primary"
            style={{ animation: "fade-in 0.6s ease-out 0.2s both" }}
          >
            Squad Detected
          </p>
          <h2
            className="text-display mt-3 text-4xl leading-[0.95] md:text-7xl"
            style={{ animation: "fade-in 0.7s ease-out 0.35s both" }}
          >
            Welcome, <span className="text-fire">Warrior</span>
          </h2>
          <p
            className="mt-3 max-w-sm text-muted-foreground"
            style={{ animation: "fade-in 0.7s ease-out 0.5s both" }}
          >
            Your squad is waiting on the drop zone. Gear up and claim your Booyah.
          </p>
          <Button
            size="lg"
            className="text-display mt-7"
            style={{ animation: "fade-in 0.7s ease-out 0.65s both" }}
            onClick={dismiss}
          >
            Enter The Arena
          </Button>
        </div>

        <div className="relative order-1 md:order-2">
          <div
            className="absolute inset-0 rounded-full blur-3xl"
            style={{
              background: "var(--gradient-fire)",
              opacity: 0.35,
              animation: "pulse-glow 3s ease-in-out infinite",
            }}
          />
          <img
            src={characterImg}
            alt="Battle Arena esports character welcoming players"
            width={768}
            height={1024}
            className="relative h-[42vh] w-auto object-contain drop-shadow-2xl md:h-[78vh]"
            style={{ animation: "hero-enter 0.9s cubic-bezier(0.16,1,0.3,1) both, float-y 5s ease-in-out 0.9s infinite" }}
          />
        </div>
      </div>

      <button
        onClick={dismiss}
        className="text-display absolute top-5 right-5 rounded-sm border border-border px-3 py-1.5 text-xs text-muted-foreground transition-colors hover:text-primary"
      >
        Skip
      </button>
    </div>
  );
}
