import { Link } from "@tanstack/react-router";
import { CalendarDays, Clock, Trophy, Users } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import {
  formatDateTime,
  formatINR,
  MODE_META,
  STATUS_LABEL,
  type Tournament,
} from "@/lib/arena-data";

function slotsFor(t: Tournament) {
  const filled = t.modes.reduce((sum, m) => sum + t.filled[m], 0);
  const total = t.modes.reduce((sum, m) => sum + t.slots[m], 0);
  return { filled, total, pct: total ? (filled / total) * 100 : 0 };
}

export function TournamentCard({ tournament: t }: { tournament: Tournament }) {
  const { filled, total, pct } = slotsFor(t);
  const cheapest = Math.min(...t.modes.map((m) => t.fees[m]));
  const open = t.status === "registration_open";

  return (
    <article className="group glass-panel relative overflow-hidden rounded-lg transition-all duration-300 hover:-translate-y-1 hover:border-primary/60">
      <div className="relative h-40 overflow-hidden">
        <img
          src={t.banner}
          alt={`${t.name} tournament banner`}
          loading="lazy"
          width={1200}
          height={480}
          className="size-full object-cover transition-transform duration-500 group-hover:scale-110"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-card via-card/50 to-transparent" />
        <Badge
          variant={open ? "default" : "secondary"}
          className="text-display absolute top-3 left-3 rounded-sm text-[10px]"
        >
          {STATUS_LABEL[t.status]}
        </Badge>
        <span className="text-display absolute top-3 right-3 rounded-sm bg-background/70 px-2 py-1 text-[10px] text-muted-foreground">
          {t.type}
        </span>
      </div>

      <div className="space-y-3 p-4">
        <div>
          <h3 className="text-display text-lg">{t.name}</h3>
          <p className="text-sm text-muted-foreground">{t.game}</p>
        </div>

        <div className="flex flex-wrap gap-1.5">
          {t.modes.map((m) => (
            <span
              key={m}
              className="text-display rounded-sm border border-accent/40 px-2 py-0.5 text-[10px] text-accent"
            >
              {MODE_META[m].label} · {formatINR(t.fees[m])}
            </span>
          ))}
        </div>

        <dl className="grid grid-cols-2 gap-2 text-sm">
          <div className="flex items-center gap-2 text-muted-foreground">
            <Trophy className="size-4 text-primary" />
            <span className="text-foreground">{formatINR(t.prizePool)}</span>
          </div>
          <div className="flex items-center gap-2 text-muted-foreground">
            <Users className="size-4 text-primary" />
            <span className="text-foreground">
              {filled} / {total}
            </span>
          </div>
          <div className="flex items-center gap-2 text-muted-foreground">
            <CalendarDays className="size-4 text-primary" />
            <span>{formatDateTime(t.startsAt).split(",")[0]}</span>
          </div>
          <div className="flex items-center gap-2 text-muted-foreground">
            <Clock className="size-4 text-primary" />
            <span>{formatDateTime(t.startsAt).split(", ")[1]}</span>
          </div>
        </dl>

        <Progress value={pct} className="h-1.5" />

        <div className="flex gap-2 pt-1">
          <Button asChild size="sm" className="text-display flex-1" disabled={!open}>
            <Link to="/register/$id" params={{ id: t.id }}>
              {open ? `Register · ${formatINR(cheapest)}+` : "Closed"}
            </Link>
          </Button>
          <Button asChild size="sm" variant="outline" className="text-display">
            <Link to="/tournaments/$id" params={{ id: t.id }}>
              View
            </Link>
          </Button>
        </div>
      </div>
    </article>
  );
}