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
          { title: "Registration unavailable — DropXArena" },
          { name: "robots", content: "noindex" },
        ],
      };
    }
    const t = loaderData.tournament;
    const description = `Register solo, duo or squad for ${t.name}. Enter player names and Free Fire UIDs, review your entry and pay the entry fee.`;
    return {
      meta: [
        { title: `Register — ${t.name} | DropXArena` },
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

type Step = "mode" | "map" | "details" | "summary" | "payment" | "done";

function RegisterPage() {
  const { tournament } = Route.useLoaderData();
  const [step, setStep] = useState<Step>("mode");
  const [mode, setMode] = useState<BattleMode | null>(null);
  const [mapName, setMapName] = useState<string | null>(null);

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
                setMapName(null);
                setStep("map");
              }}
            />
          )}

          {step === "map" && mode && (
            <MapStep
              tournament={tournament}
              mode={mode}
              selectedMap={mapName}
              onSelect={(value) => {
                setMapName(value);
                setStep("details");
              }}
              onBack={() => setStep("mode")}
            />
          )}

          {step !== "mode" && step !== "map" && mode && (
            <DetailsFlow
              tournament={tournament}
              mode={mode}
              mapName={mapName ?? tournament.maps[0] ?? "Bermuda"}
              step={step}
              setStep={setStep}
              onChangeMode={() => {
                setMapName(null);
                setStep("mode");
              }}
            />
          )}
        </div>
      </section>
    </SiteChrome>
  );
}

const STEPS: { key: Step; label: string }[] = [
  { key: "mode", label: "Mode" },
  { key: "map", label: "Map" },
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

function MapStep({
  tournament,
  mode,
  selectedMap,
  onSelect,
  onBack,
}: {
  tournament: Tournament;
  mode: BattleMode;
  selectedMap: string | null;
  onSelect: (map: string) => void;
  onBack: () => void;
}) {
  const mapChoices = tournament.maps.length ? tournament.maps : ["Bermuda", "Kalahari", "Purgatory"];
  const visibleMaps = mapChoices.length === 1 ? ["Bermuda"] : mapChoices.filter((map) => ["Bermuda", "Kalahari", "Purgatory"].includes(map));

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h1 className="text-display text-3xl md:text-4xl">Choose Your Map</h1>
        <Button variant="outline" size="sm" className="text-display" onClick={onBack}>
          Change mode
        </Button>
      </div>
      <p className="mt-2 text-muted-foreground">
        {MODE_META[mode].label} · {formatINR(tournament.fees[mode])} · Same price on every map
      </p>

      <div className="mt-6 grid gap-4 sm:grid-cols-3">
        {visibleMaps.map((map) => (
          <button
            key={map}
            type="button"
            onClick={() => onSelect(map)}
            className={`glass-panel rounded-lg p-6 text-left transition-all hover:-translate-y-1 hover:border-primary ${
              selectedMap === map ? "border-primary bg-primary/10" : ""
            }`}
          >
            <div className="text-display text-3xl text-primary">{map}</div>
            <p className="mt-3 text-sm text-muted-foreground">Entry fee: {formatINR(tournament.fees[mode])}</p>
            <p className="text-display mt-4 text-xs text-primary">SELECT MAP →</p>
          </button>
        ))}
      </div>
    </div>
  );
}

function DetailsFlow({
  tournament,
  mode,
  mapName,
  step,
  setStep,
  onChangeMode,
}: {
  tournament: Tournament;
  mode: BattleMode;
  mapName: string;
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
  const [paymentMethod, setPaymentMethod] = useState<"UPI" | "QR Code" | null>(null);
  const [paymentState, setPaymentState] = useState<"pending" | "processing" | "paid">("pending");

  const whatsappNumber = "8105928223";

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

  function formatModeLabel(value: BattleMode) {
    const base = MODE_META[value].label.toUpperCase();
    const custom = value === "solo" ? "1V1" : value === "duo" ? "2V2" : "4V4";
    return `${base} / ${custom}`;
  }

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
          {MODE_META[mode].label} · {formatINR(tournament.fees[mode])} · {mapName}
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
        <div className="glass-panel mt-6 overflow-hidden rounded-lg">
          <table className="w-full border-separate border-spacing-0 text-left text-sm">
            <tbody>
              <tr className="border-b border-border/60">
                <th className="text-display px-4 py-3 text-[10px] tracking-[0.2em] text-muted-foreground">
                  Tournament
                </th>
                <td className="px-4 py-3 text-right text-foreground">{tournament.name}</td>
              </tr>
              <tr className="border-b border-border/60">
                <th className="text-display px-4 py-3 text-[10px] tracking-[0.2em] text-muted-foreground">
                  Mode
                </th>
                <td className="px-4 py-3 text-right text-foreground">{formatModeLabel(mode)}</td>
              </tr>
              <tr className="border-b border-border/60">
                <th className="text-display px-4 py-3 text-[10px] tracking-[0.2em] text-muted-foreground">
                  Map
                </th>
                <td className="px-4 py-3 text-right text-foreground">{mapName}</td>
              </tr>
              {count > 1 && (
                <tr className="border-b border-border/60">
                  <th className="text-display px-4 py-3 text-[10px] tracking-[0.2em] text-muted-foreground">
                    Team
                  </th>
                  <td className="px-4 py-3 text-right text-foreground">{teamName}</td>
                </tr>
              )}
              <tr className="align-top border-b border-border/60">
                <th className="text-display px-4 py-3 text-[10px] tracking-[0.2em] text-muted-foreground">
                  Players
                </th>
                <td className="px-4 py-3 text-right text-foreground">
                  <div className="space-y-3">
                    {players.map((p, i) => (
                      <div key={i} className="rounded-md border border-border/50 bg-background/30 p-2 text-right">
                        <div className="font-medium text-foreground">
                          {i === 0 && count > 1 ? "Captain" : `Player ${i + 1}`} — {p.name}
                        </div>
                        <div className="mt-1 text-muted-foreground">
                          IGN: {p.ign} · UID: {p.uid}
                        </div>
                        <div className="mt-1 text-muted-foreground">
                          WA: {contact.whatsapp || contact.phone || "Not provided"}
                        </div>
                      </div>
                    ))}
                    {useSub && sub.name && (
                      <div className="rounded-md border border-border/50 bg-background/30 p-2 text-right">
                        <div className="font-medium text-foreground">Substitute — {sub.name}</div>
                        <div className="mt-1 text-muted-foreground">IGN: {sub.ign} · UID: {sub.uid}</div>
                      </div>
                    )}
                  </div>
                </td>
              </tr>
              <tr className="border-b border-border/60">
                <th className="text-display px-4 py-3 text-[10px] tracking-[0.2em] text-muted-foreground">
                  Entry Fee
                </th>
                <td className="px-4 py-3 text-right text-foreground">
                  {formatINR(tournament.fees[mode])}
                </td>
              </tr>
              <tr className="border-b border-border/60">
                <th className="text-display px-4 py-3 text-[10px] tracking-[0.2em] text-muted-foreground">
                  Platform Fee
                </th>
                <td className="px-4 py-3 text-right text-foreground">
                  {formatINR(tournament.platformFee)}
                </td>
              </tr>
              <tr>
                <th className="text-display px-4 py-3 text-[10px] tracking-[0.2em] text-muted-foreground">
                  Total
                </th>
                <td className="px-4 py-3 text-right text-2xl font-bold text-fire">
                  {formatINR(total)}
                </td>
              </tr>
            </tbody>
          </table>
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
          Choose a payment method. Pay on the specified UPI ID or QR code, then proceed.
        </p>
        <div className="glass-panel mt-6 rounded-lg p-6">
          <div className="text-display flex items-center justify-between text-xl">
            <span>Amount due</span>
            <span className="text-fire">{formatINR(total)}</span>
          </div>

          <div className="mt-6 grid gap-3 sm:grid-cols-2">
            {(["UPI", "QR Code"] as const).map((method) => (
              <button
                key={method}
                type="button"
                onClick={() => setPaymentMethod(method)}
                className={`text-display rounded-md border p-4 text-center text-sm transition-colors ${
                  paymentMethod === method
                    ? "border-primary bg-primary/10 text-primary"
                    : "border-border hover:border-primary/70"
                }`}
              >
                {method}
              </button>
            ))}
          </div>

          {paymentMethod && (
            <div className="mt-6 space-y-4 rounded-md border border-border bg-background/50 p-4 text-left">
              {paymentMethod === "UPI" ? (
                <>
                  <p className="text-display text-xs tracking-[0.2em] text-muted-foreground">
                    UPI ID
                  </p>
                  <p className="text-display text-2xl font-semibold text-fire">ommulge@oksbi</p>
                  <div className="mt-4 space-y-4">
  {/* Payment Instructions */}
  <div className="rounded-lg border border-primary/20 bg-primary/5 p-4">
    <div className="flex items-start gap-3">
      <div className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary/10 text-lg">
        💳
      </div>

      <div className="min-w-0">
        <h3 className="text-sm font-bold text-foreground">
          Payment & Verification
        </h3>

        <p className="mt-2 text-sm font-medium leading-6 text-foreground">
          Complete the payment using the UPI ID shown above.
        </p>

        <p className="mt-1 text-sm leading-6 text-muted-foreground">
          After making the payment, take a screenshot of the successful
          transaction and send it on WhatsApp to:
        </p>

        <div className="mt-3 inline-flex items-center rounded-md bg-background px-3 py-2 shadow-sm ring-1 ring-border">
          <span className="text-base font-bold tracking-wide text-foreground">
            {whatsappNumber}
          </span>
        </div>

        <p className="mt-2 text-xs font-medium text-muted-foreground">
          📱 This screenshot is required for payment verification.
        </p>
      </div>
    </div>
  </div>

  {/* Important Warning */}
  <div className="rounded-lg border-2 border-amber-300 bg-amber-50 p-4 dark:border-amber-700 dark:bg-amber-950/30">
    <div className="flex items-start gap-3">
      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-amber-100 text-lg dark:bg-amber-900/50">
        ⚠️
      </div>

      <div>
        <h3 className="text-sm font-bold text-amber-900 dark:text-amber-200">
          Payment Verification Required
        </h3>

        <p className="mt-2 text-sm leading-6 text-amber-800 dark:text-amber-300">
          <span className="font-semibold">
            Clicking the button below does NOT confirm your payment withou paying.
          </span>{" "}
          Your registration will be reviewed by our team, and your payment
          screenshot will be checked before your participation is confirmed.
        </p>

        <p className="mt-2 text-sm font-semibold leading-6 text-amber-900 dark:text-amber-200">
          Please complete the payment and send the screenshot before
          proceeding.
        </p>
      </div>
    </div>
  </div>

  {/* Verification Status */}
  <div className="flex items-center gap-2 rounded-md bg-muted/50 px-4 py-3">
    <span className="text-base">🔒</span>
    <p className="text-xs font-medium text-muted-foreground">
      Your registration will be confirmed only after successful payment
      verification.
    </p>
  </div>
</div>
                </>
              ) : (
                <>
                 <p className="text-display text-xs tracking-[0.2em] text-muted-foreground">
  QR Code
</p>

<div className="mx-auto flex w-52 items-center justify-center rounded-md border border-dashed border-border bg-white p-3">
  <img
    src="/qr.png"
    alt="Tournament payment QR code"
    className="h-auto w-full max-w-[180px] object-contain"
  />
</div>
                  <div className="mt-4 space-y-4">
  {/* Payment Instructions */}
  <div className="rounded-lg border border-primary/20 bg-primary/5 p-4">
    <div className="flex items-start gap-3">
      <div className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary/10 text-lg">
        💳
      </div>

      <div className="min-w-0">
        <h3 className="text-sm font-bold text-foreground">
          Payment & Verification
        </h3>

        <p className="mt-2 text-sm font-medium leading-6 text-foreground">
          Complete the payment using the QR-Codeshown above.
        </p>

        <p className="mt-1 text-sm leading-6 text-muted-foreground">
          After making the payment, take a screenshot of the successful
          transaction and send it on WhatsApp to:
        </p>

        <div className="mt-3 inline-flex items-center rounded-md bg-background px-3 py-2 shadow-sm ring-1 ring-border">
          <span className="text-base font-bold tracking-wide text-foreground">
            {whatsappNumber}
          </span>
        </div>

        <p className="mt-2 text-xs font-medium text-muted-foreground">
          📱 This screenshot is required for payment verification.
        </p>
      </div>
    </div>
  </div>

  {/* Important Warning */}
  <div className="rounded-lg border-2 border-amber-300 bg-amber-50 p-4 dark:border-amber-700 dark:bg-amber-950/30">
    <div className="flex items-start gap-3">
      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-amber-100 text-lg dark:bg-amber-900/50">
        ⚠️
      </div>

      <div>
        <h3 className="text-sm font-bold text-amber-900 dark:text-amber-200">
          Payment Verification Required
        </h3>

        <p className="mt-2 text-sm leading-6 text-amber-800 dark:text-amber-300">
          <span className="font-semibold">
            Clicking the button below does NOT confirm your payment.
          </span>{" "}
          Your registration will be reviewed by our team, and your payment
          screenshot will be checked before your participation is confirmed.
        </p>

        <p className="mt-2 text-sm font-semibold leading-6 text-amber-900 dark:text-amber-200">
          Please complete the payment and send the screenshot before
          proceeding.
        </p>
      </div>
    </div>
  </div>

  {/* Verification Status */}
  <div className="flex items-center gap-2 rounded-md bg-muted/50 px-4 py-3">
    <span className="text-base">🔒</span>
    <p className="text-xs font-medium text-muted-foreground">
      Your registration will be confirmed only after successful payment
      verification.
    </p>
  </div>
</div>
                </>
              )}
            </div>
          )}

          <p className="text-display mt-4 text-xs text-muted-foreground">
  Status: {paymentState.toUpperCase()}
</p>

<Button
  size="lg"
  className="text-display mt-6 w-full"
  disabled={paymentState === "processing" || !paymentMethod}
  onClick={() => {
    // Vibrate the device
    if (navigator.vibrate) {
      navigator.vibrate([200, 100, 200]);
    }

    // Show confirmation warning instead of proceeding immediately
    const confirmed = window.confirm(
      "⚠️ Did you share the payment screenshot on WhatsApp?If not press Cancel and share it first.\n\n" +
        "Please make sure you have completed the payment and sent the successful transaction screenshot for verification.Even though you paid and dint share the screenshot you will not be able to participate in the tournament"
    );

    // User clicked Cancel
    if (!confirmed) {
      return;
    }

    // User confirmed
    setPaymentState("processing");

    setTimeout(() => {
      setPaymentState("paid");
      setStep("done");
    }, 1200);
  }}
>
  {paymentState === "processing"
    ? "Processing…"
    : "Paid & Took Screenshot — Please Proceed"}
</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="relative text-center">
      <Embers count={22} />
      <div className="relative">
        <div className="text-6xl">🔥</div>
        <h1 className="text-display mt-4 text-5xl text-fire">Congratulations!</h1>
        <p className="text-display text-muted-foreground">Your registration is in progress</p>
        <Badge className="text-display mt-4 rounded-sm text-base">{registrationId}</Badge>

        <div className="glass-panel mt-8 overflow-hidden rounded-lg">
          <table className="w-full border-separate border-spacing-0 text-left text-sm">
            <tbody>
              <tr className="border-b border-border/60">
                <th className="text-display px-4 py-3 text-[10px] tracking-[0.2em] text-muted-foreground">
                  Tournament
                </th>
                <td className="px-4 py-3 text-right text-foreground">{tournament.name}</td>
              </tr>
              <tr className="border-b border-border/60">
                <th className="text-display px-4 py-3 text-[10px] tracking-[0.2em] text-muted-foreground">
                  Mode
                </th>
                <td className="px-4 py-3 text-right text-foreground">{formatModeLabel(mode)}</td>
              </tr>
              <tr className="border-b border-border/60">
                <th className="text-display px-4 py-3 text-[10px] tracking-[0.2em] text-muted-foreground">
                  Map
                </th>
                <td className="px-4 py-3 text-right text-foreground">{mapName ?? "Bermuda"}</td>
              </tr>
              {count > 1 && (
                <tr className="border-b border-border/60">
                  <th className="text-display px-4 py-3 text-[10px] tracking-[0.2em] text-muted-foreground">
                    Team
                  </th>
                  <td className="px-4 py-3 text-right text-foreground">{teamName}</td>
                </tr>
              )}
              <tr className="align-top border-b border-border/60">
                <th className="text-display px-4 py-3 text-[10px] tracking-[0.2em] text-muted-foreground">
                  Players
                </th>
                <td className="px-4 py-3 text-right text-foreground">
                  <div className="space-y-2">
                    {players.map((p, i) => (
                      <div key={i} className="rounded-md border border-border/50 bg-background/30 p-2 text-right">
                        <div className="font-medium text-foreground">
                          {i === 0 && count > 1 ? "Captain" : `Player ${i + 1}`} — {p.name}
                        </div>
                        <div className="mt-1 text-muted-foreground">IGN: {p.ign}</div>
                        <div className="mt-1 text-muted-foreground">UID: {p.uid}</div>
                        <div className="mt-1 text-muted-foreground">
                          WA: {contact.whatsapp || contact.phone || "Not provided"}
                        </div>
                      </div>
                    ))}
                  </div>
                </td>
              </tr>
              <tr className="border-b border-border/60">
                <th className="text-display px-4 py-3 text-[10px] tracking-[0.2em] text-muted-foreground">
                  Entry Fee
                </th>
                <td className="px-4 py-3 text-right text-foreground">{formatINR(total)}</td>
              </tr>
              <tr className="border-b border-border/60">
                <th className="text-display px-4 py-3 text-[10px] tracking-[0.2em] text-muted-foreground">
                  Payment
                </th>
                <td className="px-4 py-3 text-right text-foreground">PENDING VERIFICATION</td>
              </tr>
              <tr className="border-b border-border/60">
                <th className="text-display px-4 py-3 text-[10px] tracking-[0.2em] text-muted-foreground">
                  Match
                </th>
                <td className="px-4 py-3 text-right text-foreground">{formatDateTime(tournament.startsAt)}</td>
              </tr>
              <tr>
                <th className="text-display px-4 py-3 text-[10px] tracking-[0.2em] text-muted-foreground">
                  Room Details
                </th>
                <td className="px-4 py-3 text-right text-foreground">
                  Locked until the team verifies payment
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <div className="glass-panel mt-6 rounded-lg p-6 text-left">
          <p className="text-display text-2xl text-fire">Congratulations on your registration!</p>
          <p className="mt-3 text-sm text-muted-foreground">
            The team will verify your status and payment, and will start the tournament after the
            payment is confirmed.
          </p>
          <p className="mt-4 text-sm text-foreground">
            Take a screenshot for security purpose and send it to the WhatsApp number below: <span className="font-semibold text-fire">{whatsappNumber}</span>
          </p>
          <p className="mt-3 text-sm text-muted-foreground">
            Further instructions will be given in the WhatsApp community.
          </p>
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