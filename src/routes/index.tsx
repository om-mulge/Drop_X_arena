import { Link, createFileRoute } from "@tanstack/react-router";

import heroImage from "@/assets/hero-arena.jpg";
import characterImg from "@/assets/welcome-3d-character.png";
import { Countdown } from "@/components/arena/Countdown";
import { Embers } from "@/components/arena/Embers";
import { Reveal } from "@/components/arena/Reveal";
import { SiteChrome } from "@/components/arena/SiteChrome";
import { TournamentCard } from "@/components/arena/TournamentCard";
import { LeaderboardTable } from "@/routes/leaderboard";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import {
  MODE_META,
  SITE_STATS,
  faqs,
  formatINR,
  newsItems,
  tournaments,
} from "@/lib/arena-data";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Battle Arena — Free Fire Tournaments, Solo Duo & Squad" },
      {
        name: "description",
        content:
          "Enter the battlefield. Register solo, duo or squad for community Free Fire and Free Fire MAX tournaments, get room details and climb the leaderboard.",
      },
      { property: "og:title", content: "Battle Arena — Enter The Battlefield" },
      {
        property: "og:description",
        content: "Compete. Conquer. Become the champion in community Free Fire cups.",
      },
    ],
  }),
  component: Index,
});

const STEPS = [
  { n: "01", t: "Register", d: "Choose your tournament and battle mode." },
  { n: "02", t: "Build your team", d: "Enter player names and Free Fire UIDs." },
  { n: "03", t: "Join the match", d: "Room ID and password unlock before drop." },
  { n: "04", t: "Fight & win", d: "Score points and climb the leaderboard." },
];

function Index() {
  const featured = tournaments[0]!;
  const open = tournaments.filter((t) => t.status !== "completed").slice(0, 3);

  return (
    <SiteChrome>
      <section className="relative isolate overflow-hidden">
        <img
          src={heroImage}
          alt="Silhouetted esports squad overlooking a burning neon battlefield"
          width={1920}
          height={1088}
          className="absolute inset-0 size-full object-cover opacity-45"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-background/60 via-background/80 to-background" />
        <div className="grid-lines absolute inset-0 opacity-30" />
        <Embers count={24} />
        <img
          src={characterImg}
          alt="Battle Arena esports character"
          width={832}
          height={1216}
          className="pointer-events-none absolute right-0 bottom-0 hidden h-[92%] w-auto object-contain opacity-90 drop-shadow-2xl lg:block"
          style={{ animation: "hero-enter 1s cubic-bezier(0.16,1,0.3,1) both, float-y 6s ease-in-out 1s infinite" }}
        />
        <div className="relative mx-auto w-full max-w-7xl px-4 py-24 md:py-36">
          <span
            className="text-display inline-flex rounded-full border border-primary/50 px-3 py-1 text-xs text-primary"
            style={{ animation: "pulse-glow 3s ease-in-out infinite" }}
          >
            🔥 Registrations Open
          </span>
          <h1 className="text-display mt-6 max-w-4xl text-5xl leading-[0.95] md:text-8xl">
            Enter The <span className="text-fire">Battlefield</span>
          </h1>
          <p className="mt-4 max-w-xl text-lg text-muted-foreground">
            Compete. Conquer. Become the Champion. Drop in. Fight hard. Booyah.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Button asChild size="lg" className="text-display shine-on-hover">
              <Link to="/register/$id" params={{ id: featured.id }}>
                Register For Tournament
              </Link>
            </Button>
            <Button asChild size="lg" variant="outline" className="text-display">
              <Link to="/tournaments">Explore Tournaments</Link>
            </Button>
          </div>

          <dl className="mt-16 grid grid-cols-2 gap-4 md:grid-cols-4">
            {SITE_STATS.map((s, i) => (
              <Reveal key={s.label} delay={i * 90} className="glass-panel hover-lift rounded-lg p-4">
                <dt className="text-display text-3xl text-fire">{s.value}</dt>
                <dd className="text-display text-xs tracking-[0.25em] text-muted-foreground">
                  {s.label}
                </dd>
              </Reveal>
            ))}
          </dl>
        </div>
      </section>

      <section className="mx-auto w-full max-w-7xl px-4 py-16">
        <Reveal>
          <h2 className="text-display text-3xl md:text-4xl">Active Tournaments</h2>
        </Reveal>
        <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {open.map((t, i) => (
            <Reveal key={t.id} delay={i * 110}>
              <TournamentCard tournament={t} />
            </Reveal>
          ))}
        </div>
      </section>

      <section className="mx-auto w-full max-w-7xl px-4 py-10">
        <Reveal>
          <h2 className="text-display text-3xl md:text-4xl">Choose Your Battle Mode</h2>
        </Reveal>
        <div className="mt-8 grid gap-4 sm:grid-cols-3">
          {(["solo", "duo", "squad"] as const).map((m, i) => (
            <Reveal
              key={m}
              delay={i * 110}
              className="glass-panel hover-lift shine-on-hover group rounded-lg p-6"
            >
              <div className="text-4xl transition-transform duration-300 group-hover:scale-125">
                {MODE_META[m].icon}
              </div>
              <h3 className="text-display mt-3 text-2xl">{MODE_META[m].label}</h3>
              <p className="text-display text-xs text-muted-foreground">
                {MODE_META[m].players} Player{MODE_META[m].players > 1 ? "s" : ""}
              </p>
              <p className="mt-2 text-sm text-muted-foreground">{MODE_META[m].blurb}</p>
            </Reveal>
          ))}
        </div>
      </section>

      <section className="mx-auto w-full max-w-7xl px-4 py-16">
        <div className="glass-panel relative overflow-hidden rounded-lg p-8">
          <Embers count={12} />
          <div className="relative flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
            <div>
              <p className="text-display text-xs tracking-[0.3em] text-primary">
                Featured Tournament
              </p>
              <h2 className="text-display mt-2 text-4xl">{featured.name}</h2>
              <p className="text-display mt-1 text-muted-foreground">
                {featured.game} · Prize Pool {formatINR(featured.prizePool)}
              </p>
              <Button asChild className="text-display mt-5">
                <Link to="/tournaments/$id" params={{ id: featured.id }}>
                  View Tournament
                </Link>
              </Button>
            </div>
            <div className="text-center">
              <p className="text-display text-xs tracking-[0.3em] text-muted-foreground">
                Battle starts in
              </p>
              <div className="mt-3">
                <Countdown target={featured.startsAt} />
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="how" className="mx-auto w-full max-w-7xl px-4 py-16">
        <h2 className="text-display text-3xl md:text-4xl">How It Works</h2>
        <div className="mt-8 grid gap-4 md:grid-cols-4">
          {STEPS.map((s, i) => (
            <Reveal key={s.n} delay={i * 90} className="glass-panel hover-lift rounded-lg p-6">
              <span className="text-display text-4xl text-fire">{s.n}</span>
              <h3 className="text-display mt-3 text-lg">{s.t}</h3>
              <p className="mt-1 text-sm text-muted-foreground">{s.d}</p>
            </Reveal>
          ))}
        </div>
      </section>

      <section className="mx-auto w-full max-w-7xl px-4 py-10">
        <h2 className="text-display text-3xl md:text-4xl">Live Leaderboard</h2>
        <div className="mt-8">
          <LeaderboardTable limit={5} />
        </div>
        <Button asChild variant="outline" className="text-display mt-4">
          <Link to="/leaderboard">Full standings</Link>
        </Button>
      </section>

      <section className="mx-auto w-full max-w-7xl px-4 py-16">
        <h2 className="text-display text-3xl md:text-4xl">Latest Events</h2>
        <div className="mt-8 grid gap-6 md:grid-cols-3">
          {newsItems.map((n, i) => (
            <Reveal
              key={n.title}
              delay={i * 110}
              className="glass-panel hover-lift group overflow-hidden rounded-lg"
            >
              <img
                src={n.image}
                alt={n.title}
                loading="lazy"
                width={900}
                height={480}
                className="h-40 w-full object-cover transition-transform duration-500 group-hover:scale-110"
              />
              <div className="p-5">
                <p className="text-display text-[10px] tracking-[0.25em] text-primary">
                  {n.category}
                </p>
                <h3 className="text-display mt-2 text-lg">{n.title}</h3>
                <p className="mt-1 text-xs text-muted-foreground">{n.date}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      <section id="faq" className="mx-auto w-full max-w-3xl px-4 py-16">
        <h2 className="text-display text-3xl md:text-4xl">FAQ</h2>
        <Accordion type="single" collapsible className="mt-6">
          {faqs.map((f, i) => (
            <AccordionItem key={f.q} value={`item-${i}`}>
              <AccordionTrigger className="text-display text-left">{f.q}</AccordionTrigger>
              <AccordionContent className="text-muted-foreground">{f.a}</AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </section>

      <section className="relative mx-auto w-full max-w-7xl px-4 pb-20">
        <div className="glass-panel relative overflow-hidden rounded-lg p-12 text-center">
          <Embers count={16} />
          <div className="relative">
            <h2 className="text-display text-4xl md:text-6xl">Ready To Booyah?</h2>
            <Button asChild size="lg" className="text-display mt-6">
              <Link to="/tournaments">Claim Your Slot</Link>
            </Button>
          </div>
        </div>
      </section>
    </SiteChrome>
  );
}
