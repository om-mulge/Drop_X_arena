import { Link } from "@tanstack/react-router";
import { Menu } from "lucide-react";
import { useState, type ReactNode } from "react";

import { Logo } from "./Logo";
import { Button } from "@/components/ui/button";

const ROUTE_LINKS = [
  { to: "/tournaments" as const, label: "Tournaments" },
  { to: "/leaderboard" as const, label: "Leaderboard" },
];
const HASH_LINKS = [
  { href: "/#how", label: "How it works" },
  { href: "/#faq", label: "FAQ" },
];

function NavLinks({ onNavigate }: { onNavigate?: () => void }) {
  return (
    <>
      {ROUTE_LINKS.map((item) => (
        <Link
          key={item.to}
          to={item.to}
          onClick={onNavigate}
          activeProps={{ className: "text-primary" }}
          className="text-display text-sm text-muted-foreground transition-colors hover:text-primary"
        >
          {item.label}
        </Link>
      ))}
      {HASH_LINKS.map((item) => (
        <a
          key={item.href}
          href={item.href}
          onClick={onNavigate}
          className="text-display text-sm text-muted-foreground transition-colors hover:text-primary"
        >
          {item.label}
        </a>
      ))}
    </>
  );
}

export function SiteChrome({ children }: { children: ReactNode }) {
  const [open, setOpen] = useState(false);

  return (
    <div className="flex min-h-screen flex-col">
      <header className="glass-panel sticky top-0 z-50 border-x-0 border-t-0">
        <div className="mx-auto flex h-16 w-full max-w-7xl items-center justify-between px-4">
          <Logo />
          <nav className="hidden items-center gap-7 md:flex">
            <NavLinks />
          </nav>
          <div className="flex items-center gap-2">
            <Button asChild size="sm" className="text-display hidden sm:inline-flex">
              <Link to="/tournaments">Register Now</Link>
            </Button>
            <Button
              size="icon"
              variant="outline"
              className="md:hidden"
              aria-label="Toggle menu"
              onClick={() => setOpen((v) => !v)}
            >
              <Menu className="size-4" />
            </Button>
          </div>
        </div>
        {open && (
          <nav className="flex flex-col gap-4 border-t border-border px-4 py-4 md:hidden">
            <NavLinks onNavigate={() => setOpen(false)} />
          </nav>
        )}
      </header>

      <main className="flex-1">{children}</main>

      <footer className="mt-20 border-t border-border bg-card/40">
        <div className="mx-auto grid w-full max-w-7xl gap-8 px-4 py-12 md:grid-cols-4">
          <div className="space-y-3">
            <Logo />
            <p className="text-sm text-muted-foreground">Your next battle starts here.</p>
          </div>
          <div>
            <h4 className="text-display mb-3 text-sm">Compete</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>
                <Link to="/tournaments" className="hover:text-primary">
                  Tournaments
                </Link>
              </li>
              <li>
                <Link to="/leaderboard" className="hover:text-primary">
                  Leaderboard
                </Link>
              </li>
              <li>
                <a href="/#how" className="hover:text-primary">
                  How it works
                </a>
              </li>
            </ul>
          </div>
          <div>
            <h4 className="text-display mb-3 text-sm">Support</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>
                <a href="/#faq" className="hover:text-primary">
                  FAQ
                </a>
              </li>
              <li>Contact</li>
              <li>Privacy Policy</li>
              <li>Terms</li>
            </ul>
          </div>
          <div>
            <h4 className="text-display mb-3 text-sm">Community</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>Discord</li>
              <li>Instagram</li>
              <li>YouTube</li>
            </ul>
          </div>
        </div>
        <div className="border-t border-border px-4 py-6">
          <p className="mx-auto max-w-7xl text-xs text-muted-foreground">
            This is an independent community tournament platform and is not affiliated with or
            endorsed by Garena. Free Fire and Free Fire MAX are trademarks of their respective
            owners.
          </p>
        </div>
      </footer>
    </div>
  );
}