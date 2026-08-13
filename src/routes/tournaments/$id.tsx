import { Link, createFileRoute, notFound } from "@tanstack/react-router";

import { Countdown } from "@/components/arena/Countdown";
import { SiteChrome } from "@/components/arena/SiteChrome";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  MODE_META,
  STATUS_LABEL,
  formatDateTime,
  formatINR,
  getTournament,
} from "@/lib/arena-data";

export const Route = createFileRoute("/tournaments/$id")({
  loader: ({ params }) => {
    const tournament = getTournament(params.id);
    if (!tournament) throw notFound();
    return { tournament };
  },
  head: ({ loaderData }) => {
    if (!loaderData) {
      return {
        meta: [{ title: "Tournament unavailable — Battle Arena" }, { name: "robots", content: "noindex" }],
      };
    }
    const t = loaderData.tournament;
    const description = `${t.name}: ${t.game} ${t.type} with a ${formatINR(t.prizePool)} prize pool. Register solo, duo or squad on Battle Arena.`;
    return {
      meta: [
        { title: `${t.name} — Battle Arena Tournament` },
        { name: "description", content: description },
        { property: "og:title", content: `${t.name} — Battle Arena` },
        { property: "og:description", content: description },
        { property: "og:image", content: t.banner },
        { name: "twitter:image", content: t.banner },
      ],
    };
  },
  component: TournamentDetail,
  notFoundComponent: () => (
    <SiteChrome>
      <div className="mx-auto max-w-3xl px-4 py-24 text-center">
        <h1 className="text-display text-3xl">Tournament not found</h1>
        <Button asChild className="text-display mt-6">
          <Link to="/tournaments">Back to hub</Link>
        </Button>
      </div>
    </SiteChrome>
  ),
  errorComponent: () => (
    <SiteChrome>
      <div className="mx-auto max-w-3xl px-4 py-24 text-center">
        <h1 className="text-display text-3xl">Something broke in the arena</h1>
      </div>
    </SiteChrome>
  ),
});

function TournamentDetail() {
  const { tournament: t } = Route.useLoaderData();

  return (
    <SiteChrome>
      <div className="relative h-64 overflow-hidden md:h-80">
        <img
          src={t.banner}
          alt={`${t.name} cover art`}
          width={1600}
          height={640}
          className="size-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/70 to-transparent" />
        <div className="absolute inset-x-0 bottom-0 mx-auto w-full max-w-7xl px-4 pb-6">
          <Badge className="text-display rounded-sm">{STATUS_LABEL[t.status]}</Badge>
          <h1 className="text-display mt-3 text-4xl md:text-6xl">{t.name}</h1>
          <p className="text-display text-muted-foreground">
            {t.game} · {t.type} · {t.matches} Matches
          </p>
        </div>
      </div>

      <section className="mx-auto grid w-full max-w-7xl gap-8 px-4 py-10 lg:grid-cols-[1fr_320px]">
        <div className="space-y-8">
          <div className="glass-panel rounded-lg p-6">
            <h2 className="text-display text-xl">Overview</h2>
            <p className="mt-2 text-muted-foreground">{t.description}</p>
            <dl className="mt-5 grid grid-cols-2 gap-4 text-sm md:grid-cols-3">
              <Fact label="Date & Time" value={formatDateTime(t.startsAt)} />
              <Fact label="Deadline" value={formatDateTime(t.registrationDeadline)} />
              <Fact label="Prize Pool" value={formatINR(t.prizePool)} />
              {t.modes.map((m) => (
                <Fact
                  key={m}
                  label={`${MODE_META[m].label} Slots`}
                  value={`${t.filled[m]} / ${t.slots[m]} · ${formatINR(t.fees[m])}`}
                />
              ))}
            </dl>
          </div>

          <div className="glass-panel rounded-lg p-6">
            <h2 className="text-display text-xl">Format & Maps</h2>
            <p className="mt-2 text-muted-foreground">
              {t.type} · {t.matches} matches · {t.modes.map((m) => MODE_META[m].players).join("/")}{" "}
              players per entry
            </p>
            <div className="mt-4 flex flex-wrap gap-2">
              {t.maps.map((m) => (
                <span
                  key={m}
                  className="text-display rounded-sm border border-accent/40 px-3 py-1 text-xs text-accent"
                >
                  {m}
                </span>
              ))}
            </div>
          </div>

          <div className="glass-panel rounded-lg p-6">
            <h2 className="text-display text-xl">Prize Pool</h2>
            <ul className="mt-4 space-y-2">
              {t.prizeSplit.map((p) => (
                <li
                  key={p.place}
                  className="text-display flex items-center justify-between border-b border-border/60 pb-2 last:border-0"
                >
                  <span>{p.place}</span>
                  <span className="text-fire">{formatINR(p.amount)}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="glass-panel rounded-lg p-6">
            <h2 className="text-display text-xl">Rules</h2>
            <ul className="mt-4 space-y-2 text-sm text-muted-foreground">
              {t.rules.map((r) => (
                <li key={r} className="flex gap-2">
                  <span className="text-primary">▮</span>
                  {r}
                </li>
              ))}
            </ul>
          </div>
        </div>

        <aside className="space-y-4 lg:sticky lg:top-24 lg:self-start">
          <div className="glass-panel rounded-lg p-6 text-center">
            <p className="text-display text-xs tracking-[0.3em] text-muted-foreground">
              Battle starts in
            </p>
            <div className="mt-3 flex justify-center">
              <Countdown target={t.startsAt} />
            </div>
            <Button
              asChild
              size="lg"
              className="text-display mt-6 w-full"
              disabled={t.status !== "registration_open"}
            >
              <Link to="/register/$id" params={{ id: t.id }}>
                {t.status === "registration_open" ? "Register Now" : "Registration Closed"}
              </Link>
            </Button>
          </div>
        </aside>
      </section>
    </SiteChrome>
  );
}

function Fact({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <dt className="text-display text-[10px] tracking-[0.2em] text-muted-foreground">{label}</dt>
      <dd className="mt-1 text-foreground">{value}</dd>
    </div>
  );
}