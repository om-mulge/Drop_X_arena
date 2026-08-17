import { Link, createFileRoute, notFound } from "@tanstack/react-router";
import { ArrowLeft, Check, ShieldCheck, Sparkles } from "lucide-react";
import { useMemo, useState } from "react";

import { Embers } from "@/components/arena/Embers";
import { SiteChrome } from "@/components/arena/SiteChrome";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import {
  MODE_META,
  formatDateTime,
  formatINR,
  getTournament,
  type BattleMode,
  type Tournament,
} from "@/lib/arena-data";

export const Route = createFileRoute("/register/$id")({
  loader: ({ params }) => {
    const tournament = getTournament(params.id);
    if (!tournament) throw notFound();
    return { tournament };
  },
  head: ({ loaderData }) => {
    if (!loaderData) {
      return {
        meta: [
          { title: "Registration unavailable — Battle Arena" },
          { name: "robots", content: "noindex" },
        ],
      };
    }
    const t = loaderData.tournament;
    const description = `Register solo, duo or squad for ${t.name}. Enter player names and Free Fire UIDs, review your entry and pay the entry fee.`;
    return {
      meta: [
        { title: `Register — ${t.name} | Battle Arena` },
        { name: "description", content: description },
        { property: "og:title", content: `Register for ${t.name}` },
        { property: "og:description", content: description },
      ],
    };
  },
  component: RegisterPage,
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
        <h1 className="text-display text-3xl">Registration failed to load</h1>
      </div>
    </SiteChrome>
  ),
});

interface PlayerEntry {
  name: string;
  uid: string;
  ign: string;
}

const emptyPlayer = (): PlayerEntry => ({ name: "", uid: "", ign: "" });

function uidError(uid: string) {
  if (!uid.trim()) return "UID is required";
  if (!/^\d+$/.test(uid.trim())) return "UID must be numbers only";
  if (uid.trim().length < 8 || uid.trim().length > 12) return "UID must be 8-12 digits";
  return null;
}

type Step = "mode" | "details" | "summary" | "payment" | "done";

function RegisterPage() {
  const { tournament } = Route.useLoaderData();
  const [step, setStep] = useState<Step>("mode");
  const [mode, setMode] = useState<BattleMode | null>(null);

  return (
    <SiteChrome>
      <section className="relative mx-auto w-full max-w-4xl px-4 py-10">
        <Embers count={10} />
        <div className="relative">
          <Link
            to="/tournaments/$id"
            params={{ id: tournament.id }}
            className="text-display inline-flex items-center gap-1 text-xs text-muted-foreground hover:text-primary"
          >
            <ArrowLeft className="size-3" /> {tournament.name}
          </Link>

          <StepBar step={step} />

          {step === "mode" && (
            <ModeStep
              tournament={tournament}
              onSelect={(m) => {
                setMode(m);
                setStep("details");
              }}
            />
          )}

          {step !== "mode" && mode && (
            <DetailsFlow
              tournament={tournament}
              mode={mode}
              step={step}
              setStep={setStep}
              onChangeMode={() => setStep("mode")}
            />
          )}
        </div>
      </section>
    </SiteChrome>
  );
}

const STEPS: { key: Step; label: string }[] = [
  { key: "mode", label: "Mode" },
  { key: "details", label: "Players" },
  { key: "summary", label: "Review" },
  { key: "payment", label: "Payment" },
  { key: "done", label: "Booyah" },
];

function StepBar({ step }: { step: Step }) {
  const idx = STEPS.findIndex((s) => s.key === step);
  return (
    <div className="mt-6 mb-8">
      <div className="flex justify-between">
        {STEPS.map((s, i) => (
          <span
            key={s.key}
            className={`text-display text-[10px] tracking-[0.2em] ${
              i <= idx ? "text-primary" : "text-muted-foreground"
            }`}
          >
            {String(i + 1).padStart(2, "0")} {s.label}
          </span>
        ))}
      </div>
      <Progress value={((idx + 1) / STEPS.length) * 100} className="mt-3 h-1.5" />
    </div>
  );
}

function ModeStep({
  tournament,
  onSelect,
}: {
  tournament: Tournament;
  onSelect: (m: BattleMode) => void;
}) {
  return (
    <div>
      <h1 className="text-display text-3xl md:text-4xl">Select Your Battle Mode</h1>
      <p className="mt-2 text-muted-foreground">
        Entry fees are set by the organizer for this tournament.
      </p>
      <div className="mt-6 grid gap-4 sm:grid-cols-3">
        {tournament.modes.map((m) => {
          const full = tournament.filled[m] >= tournament.slots[m];
          return (
            <button
              key={m}
              type="button"
              disabled={full}
              onClick={() => onSelect(m)}
              className="glass-panel group rounded-lg p-6 text-left transition-all hover:-translate-y-1 hover:border-primary disabled:opacity-50"
            >
              <div className="text-4xl">{MODE_META[m].icon}</div>
              <h2 className="text-display mt-3 text-2xl">{MODE_META[m].label}</h2>
              <p className="text-display text-xs text-muted-foreground">
                {MODE_META[m].players} Player{MODE_META[m].players > 1 ? "s" : ""}
              </p>
              <p className="mt-2 text-sm text-muted-foreground">{MODE_META[m].blurb}</p>
              <p className="text-display mt-4 text-3xl text-fire">
                {formatINR(tournament.fees[m])}
              </p>
              <p className="text-display mt-3 text-xs text-primary">
                {full ? "SLOTS FULL" : "SELECT →"}
              </p>
            </button>
          );
        })}
      </div>
    </div>
  );
}

function DetailsFlow({
  tournament,
  mode,
  step,
  setStep,
  onChangeMode,
}: {
  tournament: Tournament;
  mode: BattleMode;
  step: Step;
  setStep: (s: Step) => void;
  onChangeMode: () => void;
}) {
  const count = MODE_META[mode].players;
  const [teamName, setTeamName] = useState("");
  const [players, setPlayers] = useState<PlayerEntry[]>(() =>
    Array.from({ length: count }, emptyPlayer),
  );
  const [sub, setSub] = useState<PlayerEntry>(emptyPlayer);
  const [useSub, setUseSub] = useState(false);
  const [contact, setContact] = useState({ phone: "", email: "", whatsapp: "", city: "" });
  const [touched, setTouched] = useState(false);
  const [paymentState, setPaymentState] = useState<"pending" | "processing" | "paid">("pending");

  const registrationId = useMemo(
    () => `BA-2026-${String(Math.floor(100000 + Math.random() * 899999)).slice(0, 6)}`,
    [],
  );

  const uids = players.map((p) => p.uid.trim()).filter(Boolean);
  const duplicateUid = new Set(uids).size !== uids.length;

  const complete =
    (count === 1 || teamName.trim().length >= 3) &&
    players.every((p) => p.name.trim() && p.ign.trim() && !uidError(p.uid)) &&
    /^\d{10}$/.test(contact.phone.trim()) &&
    /^\S+@\S+\.\S+$/.test(contact.email.trim()) &&
    !duplicateUid;

  const total = tournament.fees[mode] + tournament.platformFee;
  const filledCount = players.filter((p) => p.name.trim() && !uidError(p.uid)).length;

  function update(i: number, patch: Partial<PlayerEntry>) {
    setPlayers((prev) => prev.map((p, idx) => (idx === i ? { ...p, ...patch } : p)));
  }

  if (step === "details") {
    return (
      <div>
        <div className="flex flex-wrap items-center justify-between gap-3">
          <h1 className="text-display text-3xl md:text-4xl">
            {count === 1 ? "Player Information" : "Build Your Squad"}
          </h1>
          <Button variant="outline" size="sm" className="text-display" onClick={onChangeMode}>
            Change mode
          </Button>
        </div>
        <p className="text-display mt-2 text-sm text-primary">
          {MODE_META[mode].label} · {formatINR(tournament.fees[mode])} · {filledCount} /{" "}
          {count} players added
        </p>

        <div className="mt-6 space-y-5">
          {count > 1 && (
            <div className="glass-panel rounded-lg p-5">
              <Label className="text-display text-xs" htmlFor="team">
                Team Name
              </Label>
              <Input
                id="team"
                value={teamName}
                placeholder="Team Phoenix"
                onChange={(e) => setTeamName(e.target.value)}
                className="mt-2"
              />
            </div>
          )}

          {players.map((p, i) => (
            <PlayerFields
              key={i}
              index={i}
              player={p}
              solo={count === 1}
              showErrors={touched}
              onChange={(patch) => update(i, patch)}
            />
          ))}

          {tournament.allowSubstitute && count > 1 && (
            <div className="glass-panel rounded-lg p-5">
              <label className="flex items-center gap-3">
                <Checkbox checked={useSub} onCheckedChange={(v) => setUseSub(Boolean(v))} />
                <span className="text-display text-sm">Add a substitute player (optional)</span>
              </label>
              {useSub && (
                <div className="mt-4 grid gap-3 sm:grid-cols-3">
                  <Field label="Substitute Name" value={sub.name} onChange={(v) => setSub({ ...sub, name: v })} />
                  <Field label="Substitute UID" value={sub.uid} onChange={(v) => setSub({ ...sub, uid: v })} inputMode="numeric" />
                  <Field label="In-Game Name" value={sub.ign} onChange={(v) => setSub({ ...sub, ign: v })} />
                </div>
              )}
            </div>
          )}

          <div className="glass-panel rounded-lg p-5">
            <h2 className="text-display text-lg">
              {count === 1 ? "Contact Details" : "Captain Contact"}
            </h2>
            <div className="mt-4 grid gap-3 sm:grid-cols-2">
              <Field
                label="Phone Number"
                value={contact.phone}
                inputMode="numeric"
                onChange={(v) => setContact({ ...contact, phone: v.replace(/\D/g, "").slice(0, 10) })}
                error={touched && !/^\d{10}$/.test(contact.phone) ? "Enter a valid 10-digit number" : null}
              />
              <Field
                label="Email Address"
                value={contact.email}
                onChange={(v) => setContact({ ...contact, email: v })}
                error={touched && !/^\S+@\S+\.\S+$/.test(contact.email) ? "Enter a valid email" : null}
              />
              <Field
                label="WhatsApp Number (optional)"
                value={contact.whatsapp}
                inputMode="numeric"
                onChange={(v) => setContact({ ...contact, whatsapp: v.replace(/\D/g, "").slice(0, 10) })}
              />
              <Field
                label="City (optional)"
                value={contact.city}
                onChange={(v) => setContact({ ...contact, city: v })}
              />
            </div>
          </div>

          {duplicateUid && (
            <p className="text-display text-sm text-destructive">
              ⚠ Duplicate Free Fire UID in this entry
            </p>
          )}

          <Button
            size="lg"
            className="text-display w-full"
            onClick={() => {
              setTouched(true);
              if (complete) setStep("summary");
            }}
          >
            <ShieldCheck className="size-4" /> Verify Player Details
          </Button>
        </div>
      </div>
    );
  }

  if (step === "summary") {
    return (
      <div>
        <h1 className="text-display text-3xl md:text-4xl">Confirm Your Entry</h1>
        <div className="glass-panel mt-6 space-y-4 rounded-lg p-6">
          <Row label="Tournament" value={tournament.name} />
          <Row label="Mode" value={MODE_META[mode].label.toUpperCase()} />
          {count > 1 && <Row label="Team" value={teamName} />}
          <div>
            <p className="text-display text-[10px] tracking-[0.2em] text-muted-foreground">
              Players
            </p>
            <ul className="mt-2 space-y-1 text-sm">
              {players.map((p, i) => (
                <li key={i} className="flex justify-between border-b border-border/50 pb-1">
                  <span>
                    {i === 0 && count > 1 ? "Captain" : `Player ${i + 1}`} — {p.name} ({p.ign})
                  </span>
                  <span className="text-muted-foreground tabular-nums">{p.uid}</span>
                </li>
              ))}
              {useSub && sub.name && (
                <li className="flex justify-between text-muted-foreground">
                  <span>Substitute — {sub.name}</span>
                  <span className="tabular-nums">{sub.uid}</span>
                </li>
              )}
            </ul>
          </div>
          <Row label="Entry Fee" value={formatINR(tournament.fees[mode])} />
          <Row label="Platform Fee" value={formatINR(tournament.platformFee)} />
          <div className="text-display flex items-center justify-between border-t border-border pt-4 text-2xl">
            <span>Total</span>
            <span className="text-fire">{formatINR(total)}</span>
          </div>
        </div>
        <div className="mt-6 flex gap-3">
          <Button variant="outline" className="text-display" onClick={() => setStep("details")}>
            Edit entry
          </Button>
          <Button size="lg" className="text-display flex-1" onClick={() => setStep("payment")}>
            Proceed to Payment
          </Button>
        </div>
      </div>
    );
  }

  if (step === "payment") {
    return (
      <div>
        <h1 className="text-display text-3xl md:text-4xl">Payment</h1>
        <p className="mt-2 text-muted-foreground">
          Choose a method. Payment is verified server-side before your slot is confirmed.
        </p>
        <div className="glass-panel mt-6 rounded-lg p-6">
          <div className="text-display flex items-center justify-between text-xl">
            <span>Amount due</span>
            <span className="text-fire">{formatINR(total)}</span>
          </div>
          <div className="mt-6 grid gap-3 sm:grid-cols-3">
            {["UPI", "QR Code", "Razorpay"].map((method) => (
              <div
                key={method}
                className="text-display rounded-md border border-border p-4 text-center text-sm"
              >
                {method}
              </div>
            ))}
          </div>
          <p className="text-display mt-4 text-xs text-muted-foreground">
            Status: {paymentState.toUpperCase()}
          </p>
          <Button
            size="lg"
            className="text-display mt-6 w-full"
            disabled={paymentState === "processing"}
            onClick={() => {
              setPaymentState("processing");
              setTimeout(() => {
                setPaymentState("paid");
                setStep("done");
              }, 1200);
            }}
          >
            {paymentState === "processing" ? "Processing…" : `Pay ${formatINR(total)}`}
          </Button>
          <p className="mt-3 text-xs text-muted-foreground">
            Demo checkout — connect a live gateway to take real payments.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="relative text-center">
      <Embers count={22} />
      <div className="relative">
        <div className="text-6xl">🔥</div>
        <h1 className="text-display mt-4 text-5xl text-fire">You're In!</h1>
        <p className="text-display text-muted-foreground">Registration confirmed</p>
        <Badge className="text-display mt-4 rounded-sm text-base">{registrationId}</Badge>

        <div className="glass-panel mt-8 space-y-3 rounded-lg p-6 text-left">
          <Row label="Tournament" value={tournament.name} />
          <Row label="Mode" value={MODE_META[mode].label.toUpperCase()} />
          {count > 1 && <Row label="Team" value={teamName} />}
          <Row label="Players" value={players.map((p) => p.name).join(", ")} />
          <Row label="Entry Fee" value={formatINR(total)} />
          <Row label="Payment" value="PAID" />
          <Row label="Match" value={formatDateTime(tournament.startsAt)} />
          <Row label="Room Details" value="Locked until match day" />
        </div>

        <div className="mt-6 flex flex-wrap justify-center gap-3">
          <Button asChild className="text-display">
            <Link to="/tournaments/$id" params={{ id: tournament.id }}>
              <Sparkles className="size-4" /> View Tournament
            </Link>
          </Button>
          <Button asChild variant="outline" className="text-display">
            <Link to="/leaderboard">Leaderboard</Link>
          </Button>
        </div>
      </div>
    </div>
  );
}

function PlayerFields({
  index,
  player,
  solo,
  showErrors,
  onChange,
}: {
  index: number;
  player: PlayerEntry;
  solo: boolean;
  showErrors: boolean;
  onChange: (patch: Partial<PlayerEntry>) => void;
}) {
  const err = uidError(player.uid);
  const title = solo ? "Player Information" : index === 0 ? "Captain" : `Player ${index + 1}`;

  return (
    <div className="glass-panel rounded-lg p-5">
      <h2 className="text-display text-lg">{title}</h2>
      <div className="mt-4 grid gap-3 sm:grid-cols-3">
        <Field
          label="Player Name"
          value={player.name}
          onChange={(v) => onChange({ name: v })}
          error={showErrors && !player.name.trim() ? "Name is required" : null}
        />
        <div>
          <Label className="text-display text-xs">Free Fire UID</Label>
          <Input
            value={player.uid}
            inputMode="numeric"
            placeholder="123456789"
            onChange={(e) => onChange({ uid: e.target.value.replace(/\D/g, "").slice(0, 12) })}
            className="mt-2"
          />
          {player.uid && err && (
            <p className="text-display mt-1 text-xs text-destructive">⚠ {err}</p>
          )}
          {player.uid && !err && (
            <p className="text-display mt-1 flex items-center gap-1 text-xs text-primary">
              <Check className="size-3" /> UID accepted
            </p>
          )}
          {!player.uid && showErrors && (
            <p className="text-display mt-1 text-xs text-destructive">⚠ UID is required</p>
          )}
        </div>
        <Field
          label="In-Game Name"
          value={player.ign}
          onChange={(v) => onChange({ ign: v })}
          error={showErrors && !player.ign.trim() ? "IGN is required" : null}
        />
      </div>
    </div>
  );
}

function Field({
  label,
  value,
  onChange,
  error,
  inputMode,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  error?: string | null;
  inputMode?: "numeric" | "text";
}) {
  return (
    <div>
      <Label className="text-display text-xs">{label}</Label>
      <Input
        value={value}
        inputMode={inputMode}
        onChange={(e) => onChange(e.target.value)}
        className="mt-2"
      />
      {error && <p className="text-display mt-1 text-xs text-destructive">⚠ {error}</p>}
    </div>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-start justify-between gap-4">
      <span className="text-display text-[10px] tracking-[0.2em] text-muted-foreground">
        {label}
      </span>
      <span className="text-right text-sm">{value}</span>
    </div>
  );
}