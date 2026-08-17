import { createFileRoute } from "@tanstack/react-router";

import { SiteChrome } from "@/components/arena/SiteChrome";
import { formatINR, leaderboard } from "@/lib/arena-data";

export const Route = createFileRoute("/leaderboard")({
  head: () => ({
    meta: [
      { title: "Leaderboard — Battle Arena Free Fire Rankings" },
      {
        name: "description",
        content:
          "Live Battle Arena standings: team rank, kills, placement points, total points and prize payouts from the latest Free Fire cups.",
      },
      { property: "og:title", content: "Leaderboard — Battle Arena" },
      {
        property: "og:description",
        content: "Team rankings, kill points and prize payouts from Battle Arena cups.",
      },
    ],
  }),
  component: LeaderboardPage,
});

const MEDALS = ["🥇", "🥈", "🥉"];

export function LeaderboardTable({ limit }: { limit?: number }) {
  const rows = limit ? leaderboard.slice(0, limit) : leaderboard;
  return (
    <div className="glass-panel overflow-x-auto rounded-lg">
      <table className="w-full min-w-[720px] text-sm">
        <thead>
          <tr className="text-display border-b border-border text-left text-xs text-muted-foreground">
            <th className="p-3">Rank</th>
            <th className="p-3">Team</th>
            <th className="p-3">Players</th>
            <th className="p-3">Kills</th>
            <th className="p-3">Place Pts</th>
            <th className="p-3">Kill Pts</th>
            <th className="p-3">Total</th>
            <th className="p-3">Prize</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((r) => (
            <tr
              key={r.rank}
              className="border-b border-border/60 transition-colors last:border-0 hover:bg-primary/5"
            >
              <td className="text-display p-3 text-primary">
                {MEDALS[r.rank - 1] ?? ""} {String(r.rank).padStart(2, "0")}
              </td>
              <td className="text-display p-3">{r.team}</td>
              <td className="p-3 text-muted-foreground">{r.players.join(", ")}</td>
              <td className="p-3 tabular-nums">{r.kills}</td>
              <td className="p-3 tabular-nums">{r.placementPoints}</td>
              <td className="p-3 tabular-nums">{r.killPoints}</td>
              <td className="text-display p-3 tabular-nums text-accent">
                {r.placementPoints + r.killPoints}
              </td>
              <td className="p-3 tabular-nums">{r.prize ? formatINR(r.prize) : "—"}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function LeaderboardPage() {
  const podium = leaderboard.slice(0, 3);

  return (
    <SiteChrome>
      <section className="mx-auto w-full max-w-7xl px-4 py-12">
        <p className="text-display text-sm tracking-[0.35em] text-primary">Standings</p>
        <h1 className="text-display mt-2 text-4xl md:text-5xl">Fight For The Top</h1>

        <div className="mt-10 grid gap-4 md:grid-cols-3">
          {podium.map((p, i) => (
            <div
              key={p.team}
              className="glass-panel rounded-lg p-6 text-center"
              style={{
                boxShadow: i === 0 ? "var(--shadow-glow)" : "var(--shadow-volt)",
                transform: i === 0 ? "translateY(-8px)" : undefined,
              }}
            >
              <div className="text-4xl">{MEDALS[i]}</div>
              <h2 className="text-display mt-2 text-2xl">{p.team}</h2>
              <p className="text-sm text-muted-foreground">{p.players.join(" · ")}</p>
              <p className="text-display mt-4 text-3xl text-fire">
                {p.placementPoints + p.killPoints} PTS
              </p>
              <p className="text-display mt-1 text-sm text-muted-foreground">
                {p.kills} Kills · {formatINR(p.prize)}
              </p>
            </div>
          ))}
        </div>

        <div className="mt-10">
          <LeaderboardTable />
        </div>
      </section>
    </SiteChrome>
  );
}