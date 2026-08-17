export type BattleMode = "solo" | "duo" | "squad";
export type TournamentType = "Battle Royale" | "Clash Squad";
export type TournamentStatus =
  | "draft"
  | "registration_open"
  | "registration_closed"
  | "live"
  | "completed";

export interface Tournament {
  id: string;
  name: string;
  game: "Free Fire" | "Free Fire MAX";
  type: TournamentType;
  description: string;
  banner: string;
  modes: BattleMode[];
  fees: Record<BattleMode, number>;
  slots: Record<BattleMode, number>;
  filled: Record<BattleMode, number>;
  prizePool: number;
  prizeSplit: { place: string; amount: number }[];
  platformFee: number;
  startsAt: string;
  registrationDeadline: string;
  maps: string[];
  matches: number;
  rules: string[];
  allowSubstitute: boolean;
  status: TournamentStatus;
}

export const MODE_META: Record<
  BattleMode,
  { label: string; players: number; icon: string; blurb: string }
> = {
  solo: { label: "Solo", players: 1, icon: "👤", blurb: "One player. No excuses." },
  duo: { label: "Duo", players: 2, icon: "👥", blurb: "Two players. Perfect sync." },
  squad: { label: "Squad", players: 4, icon: "🛡️", blurb: "Four players. Full firepower." },
};

export const SITE_STATS = [
  { label: "Players", value: "5000+" },
  { label: "Tournaments", value: "100+" },
  { label: "Prizes", value: "₹10L+" },
  { label: "Matches", value: "50K+" },
];

const baseRules = [
  "No hacks, mods or third-party applications.",
  "No teaming with other squads.",
  "No abusive behaviour in lobby or chat.",
  "No account sharing — the registered UID must play.",
  "Follow all organizer instructions in the match room.",
  "Late entries after room close are disqualified.",
  "Keep screenshot / video evidence of every match.",
];

export const tournaments: Tournament[] = [
  {
    id: "battle-arena-cup-01",
    name: "Bermuda #01",
    game: "Free Fire MAX",
    type: "Battle Royale",
    description:
      "The flagship Battle Arena squad showdown. Six matches, one champion, full booyah glory.",
    banner:
      "https://images.unsplash.com/photo-1542751371-adc38448a05e?auto=format&fit=crop&w=1200&q=70",
    modes: ["squad"],
    fees: { solo: 500, duo: 99, squad: 199 },
    slots: { solo: 0, duo: 0, squad: 25 },
    filled: { solo: 0, duo: 0, squad: 12 },
    prizePool: 10000,
    prizeSplit: [
      { place: "1st", amount: 5000 },
      { place: "2nd", amount: 3000 },
      { place: "3rd", amount: 2000 },
    ],
    platformFee: 0,
    startsAt: "2026-08-25T19:00:00+05:30",
    registrationDeadline: "2026-08-24T21:00:00+05:30",
    maps: ["Bermuda", "Purgatory", "Alpine", "Kalahari"],
    matches: 6,
    rules: baseRules,
    allowSubstitute: true,
    status: "registration_open",
  },
  {
    id: "night-hunters",
    name: "Kalahari",
    game: "Free Fire",
    type: "Clash Squad",
    description: "Late-night duo warfare. Fast rounds, sharp aim, zero mercy.",
    banner:
      "https://images.unsplash.com/photo-1511512578047-dfb367046420?auto=format&fit=crop&w=1200&q=70",
    modes: ["duo"],
    fees: { solo: 500, duo: 99, squad: 199 },
    slots: { solo: 0, duo: 50, squad: 0 },
    filled: { solo: 0, duo: 31, squad: 0 },
    prizePool: 5000,
    prizeSplit: [
      { place: "1st", amount: 2500 },
      { place: "2nd", amount: 1500 },
      { place: "3rd", amount: 1000 },
    ],
    platformFee: 0,
    startsAt: "2026-08-18T21:30:00+05:30",
    registrationDeadline: "2026-08-18T18:00:00+05:30",
    maps: ["Bermuda", "Purgatory"],
    matches: 5,
    rules: baseRules,
    allowSubstitute: false,
    status: "registration_open",
  },
  {
    id: "solo-warrior",
    name: "Purgatory #01",
    game: "Free Fire MAX",
    type: "Battle Royale",
    description: "One hundred lone wolves drop in. Only one walks out with the booyah.",
    banner:
      "https://images.unsplash.com/photo-1550745165-9bc0b252726f?auto=format&fit=crop&w=1200&q=70",
    modes: ["solo"],
    fees: { solo: 500, duo: 99, squad: 199 },
    slots: { solo: 100, duo: 0, squad: 0 },
    filled: { solo: 74, duo: 0, squad: 0 },
    prizePool: 3000,
    prizeSplit: [
      { place: "1st", amount: 1500 },
      { place: "2nd", amount: 1000 },
      { place: "3rd", amount: 500 },
    ],
    platformFee: 0,
    startsAt: "2026-08-15T20:00:00+05:30",
    registrationDeadline: "2026-08-15T17:00:00+05:30",
    maps: ["Bermuda", "Alpine"],
    matches: 4,
    rules: baseRules,
    allowSubstitute: false,
    status: "registration_open",
  },
  {
    id: "phoenix-open",
    name: "Nexterra #01",
    game: "Free Fire MAX",
    type: "Battle Royale",
    description: "Open-entry mixed-mode cup. Solo, duo or squad — pick your poison.",
    banner:
      "https://images.unsplash.com/photo-1493711662062-fa541adb3fc8?auto=format&fit=crop&w=1200&q=70",
    modes: ["solo", "duo", "squad"],
    fees: { solo: 59, duo: 119, squad: 249 },
    slots: { solo: 60, duo: 30, squad: 20 },
    filled: { solo: 60, duo: 30, squad: 20 },
    prizePool: 15000,
    prizeSplit: [
      { place: "1st", amount: 8000 },
      { place: "2nd", amount: 4000 },
      { place: "3rd", amount: 3000 },
    ],
    platformFee: 10,
    startsAt: "2026-08-12T19:00:00+05:30",
    registrationDeadline: "2026-08-11T21:00:00+05:30",
    maps: ["Bermuda", "Kalahari", "Nexterra"],
    matches: 6,
    rules: baseRules,
    allowSubstitute: true,
    status: "live",
  },
  {
    id: "shadow-cup",
    name: "Shadow Cup",
    game: "Free Fire",
    type: "Clash Squad",
    description: "Completed squad clash — results and prize payouts published.",
    banner:
      "https://images.unsplash.com/photo-1538481199705-c710c4e965fc?auto=format&fit=crop&w=1200&q=70",
    modes: ["squad"],
    fees: { solo: 49, duo: 99, squad: 149 },
    slots: { solo: 0, duo: 0, squad: 16 },
    filled: { solo: 0, duo: 0, squad: 16 },
    prizePool: 6000,
    prizeSplit: [
      { place: "1st", amount: 3000 },
      { place: "2nd", amount: 2000 },
      { place: "3rd", amount: 1000 },
    ],
    platformFee: 0,
    startsAt: "2026-07-28T19:00:00+05:30",
    registrationDeadline: "2026-07-27T21:00:00+05:30",
    maps: ["Bermuda"],
    matches: 5,
    rules: baseRules,
    allowSubstitute: false,
    status: "completed",
  },
];

export function getTournament(id: string) {
  return tournaments.find((t) => t.id === id);
}

export function formatINR(amount: number) {
  return `₹${amount.toLocaleString("en-IN")}`;
}

export function formatDateTime(iso: string) {
  return new Date(iso).toLocaleString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
    timeZone: "Asia/Kolkata",
  });
}

export const STATUS_LABEL: Record<TournamentStatus, string> = {
  draft: "Draft",
  registration_open: "Registration Open",
  registration_closed: "Registration Closed",
  live: "Live",
  completed: "Completed",
};

export interface LeaderboardRow {
  rank: number;
  team: string;
  players: string[];
  kills: number;
  placementPoints: number;
  killPoints: number;
  prize: number;
}

export const leaderboard: LeaderboardRow[] = [
  { rank: 1, team: "Phoenix", players: ["Ash", "Kira", "Vex", "Rook"], kills: 48, placementPoints: 52, killPoints: 48, prize: 5000 },
  { rank: 2, team: "Titans", players: ["Nyx", "Bolt", "Fury", "Drax"], kills: 41, placementPoints: 47, killPoints: 41, prize: 3000 },
  { rank: 3, team: "Shadow", players: ["Ghost", "Riven", "Slate", "Onyx"], kills: 39, placementPoints: 44, killPoints: 39, prize: 2000 },
  { rank: 4, team: "Nova Six", players: ["Sable", "Halo", "Krow", "Jinx"], kills: 33, placementPoints: 38, killPoints: 33, prize: 0 },
  { rank: 5, team: "Iron Wolves", players: ["Fang", "Blitz", "Cinder", "Mako"], kills: 30, placementPoints: 34, killPoints: 30, prize: 0 },
  { rank: 6, team: "Venom Ops", players: ["Sting", "Vypr", "Cobra", "Zeal"], kills: 27, placementPoints: 30, killPoints: 27, prize: 0 },
  { rank: 7, team: "Storm Kings", players: ["Gale", "Thund", "Rain", "Volt"], kills: 24, placementPoints: 26, killPoints: 24, prize: 0 },
  { rank: 8, team: "Ember Clan", players: ["Coal", "Pyre", "Wick", "Soot"], kills: 21, placementPoints: 22, killPoints: 21, prize: 0 },
];

export const newsItems = [
  {
    category: "Tournament Announcement",
    title: "Battle Arena Cup #01 registrations are live",
    date: "05 Aug 2026",
    image:
      "https://images.unsplash.com/photo-1552820728-8b83bb6b773f?auto=format&fit=crop&w=900&q=70",
  },
  {
    category: "Champions",
    title: "Team Phoenix takes the Shadow Cup crown",
    date: "29 Jul 2026",
    image:
      "https://images.unsplash.com/photo-1521295121783-8a321d551ad2?auto=format&fit=crop&w=900&q=70",
  },
  {
    category: "Special Event",
    title: "Kill-race weekend: double kill points in Clash Squad",
    date: "22 Jul 2026",
    image:
      "https://images.unsplash.com/photo-1511512578047-dfb367046420?auto=format&fit=crop&w=900&q=70",
  },
];

export const faqs = [
  {
    q: "How do I join a tournament?",
    a: "Pick a tournament, choose Solo, Duo or Squad, enter every player's name and Free Fire UID, review your entry and pay the entry fee. You get a registration ID instantly.",
  },
  {
    q: "Where do I get the room ID and password?",
    a: "Room details unlock in your Match Room shortly before the scheduled start time, once the organizer publishes them.",
  },
  {
    q: "Do you verify Free Fire UIDs?",
    a: "We validate UID format and block duplicates within a tournament. We do not query Garena servers — organizers manually check UIDs in the lobby.",
  },
  {
    q: "Can I change my squad after registering?",
    a: "Contact support before the registration deadline. Roster edits are locked once the deadline passes.",
  },
  {
    q: "How are prizes paid out?",
    a: "Prizes are transferred via UPI to the captain's registered number within 48 hours of the results being published.",
  },
];