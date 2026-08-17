import { useEffect, useMemo, useState } from "react";
import { testSupabaseConnection } from "@/lib/test-supabase";
import { createFileRoute } from "@tanstack/react-router";


import { SiteChrome } from "@/components/arena/SiteChrome";
import { TournamentCard } from "@/components/arena/TournamentCard";
import { Button } from "@/components/ui/button";
import { tournaments } from "@/lib/arena-data";

export const Route = createFileRoute("/tournaments/")({
  head: () => ({
    meta: [
      { title: "Tournament Hub — Battle Arena Free Fire Cups" },
      {
        name: "description",
        content:
          "Browse active Free Fire and Free Fire MAX tournaments. Filter by solo, duo, squad, Battle Royale or Clash Squad and register in minutes.",
      },
      { property: "og:title", content: "Tournament Hub — Battle Arena" },
      {
        property: "og:description",
        content: "Active Free Fire cups with live slots, prize pools and instant registration.",
      },
    ],
  }),
  component: TournamentsPage,
});

const FILTERS = [
  "All",
  "Solo",
  "Duo",
  "Squad",
  "Battle Royale",
  "Clash Squad",
  "Upcoming",
  "Live",
  "Completed",
] as const;

function TournamentsPage() {
  useEffect(() => {
    console.log("🔥 TOURNAMENT PAGE LOADED");
    testSupabaseConnection();
  }, []);

  const [filter, setFilter] = useState<(typeof FILTERS)[number]>("All");

  const list = useMemo(
    () =>
      tournaments.filter((t) => {
        switch (filter) {
          case "All":
            return true;
          case "Solo":
          case "Duo":
          case "Squad":
            return t.modes.includes(filter.toLowerCase() as "solo" | "duo" | "squad");
          case "Battle Royale":
          case "Clash Squad":
            return t.type === filter;
          case "Upcoming":
            return t.status === "registration_open" || t.status === "registration_closed";
          case "Live":
            return t.status === "live";
          case "Completed":
            return t.status === "completed";
        }
      }),
    [filter],
  );

  return (
    <SiteChrome>
      <section className="mx-auto w-full max-w-7xl px-4 py-12">
        <p className="text-display text-sm tracking-[0.35em] text-primary">Tournament Hub</p>
        <h1 className="text-display mt-2 text-4xl md:text-5xl">Active Tournaments</h1>
        <p className="mt-3 max-w-2xl text-muted-foreground">
          Choose your battlefield. Every cup has its own slots, prize pool and entry fee set by
          the organizer.
        </p>

        <div className="mt-8 flex flex-wrap gap-2">
          {FILTERS.map((f) => (
            <Button
              key={f}
              size="sm"
              variant={filter === f ? "default" : "outline"}
              className="text-display rounded-full text-xs transition-transform hover:scale-105"
              onClick={() => setFilter(f)}
            >
              {f}
            </Button>
          ))}
        </div>

        <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {list.map((t) => (
            <TournamentCard key={t.id} tournament={t} />
          ))}
        </div>
        {list.length === 0 && (
          <p className="text-display mt-16 text-center text-muted-foreground">
            No tournaments match this filter yet.
          </p>
        )}
      </section>
    </SiteChrome>
  );
}