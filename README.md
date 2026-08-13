# Battle Arena Hub

Yes — I checked the current official Garena Free Fire website and used its current structure/content as inspiration. The official site emphasizes Battle Royale, Clash Squad, characters, events, Free Fire MAX, and esports/FFWS. (Garena Free Fire)

For your website, I would not copy Garena's website. Instead, use its gaming/esports feel as inspiration and build your own tournament-registration platform.

Here is a stronger prompt you can paste into Lovable / Bolt / Cursor / v0 / Claude Code:

FREE FIRE ESPORTS TOURNAMENT PLATFORM

Build a premium, futuristic and highly immersive Free Fire / Free Fire MAX community tournament website where players can discover tournaments, register as SOLO, DUO or SQUAD, submit their Free Fire player information and UID, pay a configurable entry fee, receive registration confirmation, and later access match-room and leaderboard information.

The website should be inspired by the visual quality, gaming atmosphere, character-focused presentation, esports sections, event presentation and dark cinematic feel of the official Garena Free Fire website:

https://ff.garena.com/en

IMPORTANT:
Do NOT copy Garena's website, branding, copyrighted artwork, exact layouts, logos, or text.

Create a completely original esports brand and UI inspired by modern Free Fire-style gaming aesthetics.

1. WEBSITE BRAND

Use a fictional tournament brand:

BATTLE ARENA

Tagline:

"DROP IN. FIGHT HARD. BOOYAH."

Create a futuristic esports logo placeholder.

The logo should be easily replaceable later.

Use terminology such as:

Battle Arena

Tournament Hub

Squad Arena

Battle Royale

Clash Squad

Leaderboard

Match Room

Champions

Victory

Booyah

2. VISUAL STYLE

The website must look like a serious professional esports platform.

Design direction:

Dark cinematic background

Black / charcoal base

Neon orange

Fire red

Electric purple

Deep blue

Metallic surfaces

Glassmorphism

Glowing borders

Large cinematic gaming imagery

Character silhouettes

Smoke

Fire particles

Energy effects

Subtle grid patterns

Futuristic HUD elements

Premium typography

Use large bold gaming headings.

Examples:

ENTER THE BATTLE

BUILD YOUR SQUAD

CHOOSE YOUR MODE

FIGHT FOR THE TOP

CLAIM YOUR BOOYAH

Do not make the interface look like a normal college registration form.

The registration form should still be extremely easy to use.

3. HOMEPAGE

Create an impressive full-screen hero section.

Hero headline:

ENTER THE BATTLEFIELD

Subheading:

Compete. Conquer. Become the Champion.

Buttons:

REGISTER FOR TOURNAMENT

EXPLORE TOURNAMENTS

Add a cinematic gaming background.

Include animated lighting and particles.

Add a small badge:

🔥 REGISTRATIONS OPEN

Below the hero, show statistics:

5000+ PLAYERS

100+ TOURNAMENTS

₹10L+ PRIZES

50K+ MATCHES

Make all numbers configurable through the admin panel.

4. TOURNAMENT HUB

Create a section called:

ACTIVE TOURNAMENTS

Display tournament cards.

Each card should contain:

Tournament banner

Tournament name

Game

Tournament mode

Date

Starting time

Registration deadline

Entry fee

Prize pool

Slots

Registered players/teams

Status

Register button

View tournament button

Example:

BATTLE ARENA CUP #01

Game:
Free Fire MAX

Mode:
Squad

Entry:
₹199

Prize Pool:
₹10,000

Slots:
12 / 25 Squads

Date:
25 August 2026

Time:
7:00 PM

Status:

REGISTRATION OPEN

Button:

REGISTER NOW

5. TOURNAMENT FILTER

Add filters at the top.

Filters:

ALL

SOLO

DUO

SQUAD

BATTLE ROYALE

CLASH SQUAD

UPCOMING

LIVE

COMPLETED

Make filters animated.

6. SOLO / DUO / SQUAD

This is one of the most important features.

When the user clicks REGISTER NOW, first show:

SELECT YOUR BATTLE MODE

Three large gaming cards:

SOLO

👤

1 PLAYER

DUO

👥

2 PLAYERS

SQUAD

👥👥

4 PLAYERS

Each card should have:

Icon

Description

Entry fee

Number of players

Select button

Example:

SOLO

₹49

1 PLAYER

DUO

₹99

2 PLAYERS

SQUAD

₹199

4 PLAYERS

IMPORTANT:

The prices must NOT be hardcoded.

The tournament organizer must be able to configure the price for each tournament.

7. DYNAMIC ENTRY FEE SYSTEM

Every tournament should have configurable pricing.

Admin should be able to set:

Solo Fee

Duo Fee

Squad Fee

Example:

Solo = ₹49

Duo = ₹99

Squad = ₹199

If the organizer changes the price to:

Solo = ₹59

Duo = ₹119

Squad = ₹249

the registration page should automatically display the new prices.

Never hardcode tournament pricing in the frontend.

8. SOLO REGISTRATION

If the player selects SOLO, display:

PLAYER INFORMATION

Player Name

Free Fire UID

Free Fire In-Game Name

Phone Number

Email Address

WhatsApp Number

Optional:

Age

City

Discord ID

Create a clean gaming-style form.

Add:

VERIFY PLAYER DETAILS

button.

9. DUO REGISTRATION

If DUO is selected:

TEAM INFORMATION

Team Name

Captain Name

Captain Free Fire UID

Captain In-Game Name

PLAYER 2

Player Name

Free Fire UID

In-Game Name

Contact information:

Captain Phone

Captain Email

Display a progress indicator:

1 / 2 PLAYERS ADDED

2 / 2 PLAYERS ADDED

Do not allow submission until all required players are entered.

10. SQUAD REGISTRATION

If SQUAD is selected:

CREATE YOUR SQUAD

Team Name

Captain Name

Captain UID

Captain In-Game Name

Then:

PLAYER 2

Name

Free Fire UID

In-Game Name

PLAYER 3

Name

Free Fire UID

In-Game Name

PLAYER 4

Name

Free Fire UID

In-Game Name

Display:

SQUAD READY: 4 / 4

Optional:

SUBSTITUTE

Allow the tournament organizer to enable/disable substitute players.

If enabled:

Substitute Name

Substitute UID

Substitute In-Game Name

11. UID VALIDATION

Create proper validation for Free Fire UID fields.

The system should:

Accept numeric UID

Prevent obviously invalid values

Prevent empty UID

Display validation errors

Prevent duplicate player registration for the same tournament if configured by admin

Example error:

⚠ INVALID FREE FIRE UID

Example:

✓ PLAYER UID ACCEPTED

Important:

Do not claim to verify the UID against Garena servers unless an actual official API/integration exists.

12. REGISTRATION SUMMARY

Before payment, show a beautiful summary screen.

CONFIRM YOUR ENTRY

Tournament:

Battle Arena Cup #01

Mode:

SQUAD

Team:

Team Phoenix

Players:

Captain — Player Name

Player 2 — Player Name

Player 3 — Player Name

Player 4 — Player Name

Entry Fee:

₹199

Platform Fee:

₹0 / configurable

TOTAL:

₹199

Button:

PROCEED TO PAYMENT

13. PAYMENT

Create a professional payment interface.

Support architecture for:

UPI

QR payment

Razorpay

Other payment gateways

Payment amount must automatically come from the selected tournament and mode.

Payment states:

PENDING

PROCESSING

PAID

FAILED

REFUNDED

Do not expose payment secret keys in frontend code.

Verify payment on the backend.

Only mark registration as confirmed after successful payment verification.

14. SUCCESS PAGE

After successful registration:

Create an impressive animation.

Show:

🔥

YOU'RE IN!

REGISTRATION CONFIRMED

Generate unique registration ID.

Example:

BA-2026-008721

Show:

Tournament

Team

Mode

Players

Entry Fee

Payment Status

Match Date

Match Time

Registration ID

Buttons:

VIEW MY REGISTRATION

GO TO DASHBOARD

DOWNLOAD RECEIPT

15. PLAYER DASHBOARD

Create a gaming-style player dashboard.

Sidebar:

Dashboard

My Tournaments

My Teams

Upcoming Matches

Match Rooms

Leaderboard

Results

Profile

Support

Dashboard cards:

UPCOMING MATCH

REGISTRATIONS

WINS

TOTAL KILLS

CURRENT RANK

Show upcoming tournament cards.

Example:

BATTLE ARENA CUP #01

SQUAD

25 AUG

7:00 PM

ROOM DETAILS: LOCKED

16. MATCH ROOM

Create a match-room page.

Before the organizer publishes details:

ROOM DETAILS LOCKED

"Room ID and password will be available before the match."

Once admin publishes:

ROOM ID

12345678

ROOM PASSWORD

987654

MAP

Bermuda

MODE

Battle Royale

MATCH TIME

7:00 PM

Add:

COPY ROOM ID

COPY PASSWORD

Buttons.

17. COUNTDOWN

Every upcoming tournament should have a live countdown.

Example:

BATTLE STARTS IN

02D : 14H : 35M : 21S

The countdown should automatically update.

When countdown reaches zero:

MATCH LIVE 🔴

18. LEADERBOARD

Create a professional esports leaderboard.

Columns:

Rank

Team

Players

Kills

Placement

Placement Points

Kill Points

Total Points

Prize

Example:

🥇 01 — PHOENIX

🥈 02 — TITANS

🥉 03 — SHADOW

Make the top 3 visually impressive.

Use glowing podium cards.

Admin must be able to enter/update results.

19. TOURNAMENT DETAILS

Every tournament should have its own page.

Sections:

OVERVIEW

Game

Mode

Date

Time

Entry Fee

Prize Pool

Slots

Registration Deadline

FORMAT

Example:

Battle Royale

4 Players per Squad

6 Matches

Bermuda

Purgatory

Alpine

Kalahari

etc.

Make maps configurable.

PRIZE POOL

1st — ₹5000

2nd — ₹3000

3rd — ₹2000

Prize distribution must be configurable.

RULES

No hacks

No third-party applications

No teaming

No abusive behavior

No account sharing

Follow tournament organizer instructions

Disqualification rules

Late entry rules

Screenshot/video evidence requirements

Allow admin to edit rules.

20. ESPORTS NEWS / EVENTS

Create a section inspired by the event/news presentation style of modern Free Fire esports websites.

Cards:

TOURNAMENT ANNOUNCEMENT

NEW CUP

MATCH RESULTS

CHAMPIONS

SPECIAL EVENT

Each card should have:

Image

Category

Title

Date

Read More

21. HOW IT WORKS

Create a simple 4-step section.

01 — REGISTER

Choose your tournament.

02 — BUILD YOUR TEAM

Enter player names and UIDs.

03 — JOIN THE MATCH

Receive room information.

04 — FIGHT & WIN

Play, score points and climb the leaderboard.

22. ADMIN DASHBOARD

This is extremely important.

Create a completely separate protected admin dashboard.

Admin navigation:

Dashboard

Tournaments

Registrations

Players

Teams

Payments

Matches

Rooms

Results

Leaderboard

Prize Pools

Rules

Announcements

Settings

23. ADMIN TOURNAMENT CREATION

Admin should be able to create a tournament.

Fields:

Tournament Name

Description

Banner

Game

Tournament Type

Battle Royale / Clash Squad

Available Modes:

☑ Solo

☑ Duo

☑ Squad

Solo Entry Fee

Duo Entry Fee

Squad Entry Fee

Prize Pool

Maximum Solo Players

Maximum Duo Teams

Maximum Squad Teams

Registration Start

Registration Deadline

Tournament Date

Tournament Time

Maps

Tournament Rules

Status

Draft

Registration Open

Registration Closed

Live

Completed

24. ADMIN REGISTRATION MANAGEMENT

Show a table:

Registration ID

Tournament

Mode

Team

Captain

Players

UIDs

Phone

Payment

Status

Created At

Admin actions:

View

Approve

Reject

Edit

Refund

Delete

Export

Add search and filters.

Filters:

Tournament

Solo/Duo/Squad

Paid/Pending/Failed

Date

Team

Player UID

25. ADMIN PAYMENT MANAGEMENT

Dashboard should display:

Total Revenue

Paid Registrations

Pending Payments

Failed Payments

Refunds

Create payment table:

Registration ID

Amount

Transaction ID

Payment Method

Payment Status

Date

26. ADMIN MATCH MANAGEMENT

Admin can create matches.

Fields:

Tournament

Match Number

Date

Time

Map

Mode

Room ID

Room Password

Room Status

Then:

PUBLISH ROOM

Once published, registered players can see the room details.

27. ADMIN RESULT MANAGEMENT

Admin can enter:

Team

Kills

Placement

Placement Points

Kill Points

Total Points

The system should automatically calculate:

TOTAL POINTS = PLACEMENT POINTS + KILL POINTS

Update leaderboard automatically.

28. DATABASE

Use a real backend.

Recommended:

Frontend:

Next.js / React

Styling:

Tailwind CSS

Animation:

Framer Motion

Icons:

Lucide React

Backend:

Supabase

Database:

PostgreSQL

Authentication:

Supabase Auth

Storage:

Supabase Storage

Payment:

Razorpay / UPI integration

Create tables for:

users

tournaments

teams

players

registrations

payments

matches

rooms

results

leaderboards

announcements

rules

29. SECURITY

Implement:

Protected admin routes

Authentication

Authorization

Backend payment verification

Server-side validation

Input sanitization

Duplicate registration protection

Rate limiting where appropriate

Secure database policies

Never expose secret API keys

Players should only be able to access their own registration and dashboard information.

30. MOBILE-FIRST DESIGN

Most tournament players will probably register from their phones.

Make the website extremely mobile friendly.

Mobile requirements:

Large buttons

Easy UID entry

Sticky Register button

Fast loading

Responsive tournament cards

Simple payment flow

Easy team/player entry

Bottom navigation for player dashboard

The registration process should be possible comfortably with one hand.

31. GAMING ANIMATIONS

Use subtle premium animations:

Neon glow

Card hover

Animated borders

Particle background

Character/parallax effect

Smooth page transitions

Tournament countdown

Loading animations

Button hover effects

Score counter animation

Leaderboard rank animations

Avoid excessive animations that slow the website.

32. HOMEPAGE STRUCTURE

Use this exact flow:

NAVBAR

↓

HERO

"ENTER THE BATTLEFIELD"

↓

LIVE / UPCOMING TOURNAMENTS

↓

CHOOSE YOUR BATTLE MODE

SOLO | DUO | SQUAD

↓

FEATURED TOURNAMENT

↓

HOW IT WORKS

↓

PRIZE POOL

↓

LIVE LEADERBOARD

↓

LATEST EVENTS / NEWS

↓

WHY PLAY WITH US

↓

FAQ

↓

CALL TO ACTION

"READY TO BOOYAH?"

↓

FOOTER

33. FOOTER

Include:

BATTLE ARENA

"Your next battle starts here."

Links:

Tournaments

Leaderboard

Rules

Support

Contact

Privacy Policy

Terms

Social Media

Add a clear disclaimer:

"This is an independent community tournament platform and is not affiliated with or endorsed by Garena unless explicitly stated."

Do not falsely claim to be an official Garena tournament platform.

34. DESIGN DETAILS

Use premium typography.

Headings should be bold and condensed/futuristic.

Buttons should have:

Sharp or slightly rounded corners

Glow effect

Strong contrast

Hover animation

Cards should have:

Dark translucent background

Thin glowing border

Background image

Gradient overlay

Hover zoom

Create a strong visual hierarchy.

The website should feel like:

ESPORTS ARENA + GAMING DASHBOARD + TOURNAMENT PLATFORM

not:

ONLINE FORM WEBSITE

35. SAMPLE TOURNAMENT DATA

Populate the initial UI with realistic sample tournaments:

BATTLE ARENA CUP

Mode: SQUAD

Entry: ₹199

Prize Pool: ₹10,000

Slots: 25 Squads

Status: OPEN

NIGHT HUNTERS

Mode: DUO

Entry: ₹99

Prize Pool: ₹5,000

Slots: 50 Teams

Status: OPEN

SOLO WARRIOR

Mode: SOLO

Entry: ₹49

Prize Pool: ₹3,000

Slots: 100 Players

Status: OPEN

Make these sample values editable from the admin panel.

36. IMPORTANT BRANDING RULE

Use Free Fire / Free Fire MAX as the game being supported, but make the tournament platform's branding completely original.

Do not reproduce:

Garena logo

Official Free Fire logo as the site's own logo

Garena characters as original site characters

Copyrighted promotional artwork

Exact Garena page layouts

Instead, use original esports visuals and placeholders that can later be replaced with properly licensed assets.

FINAL OBJECTIVE

The finished website should make a Free Fire player immediately feel:

🔥 "This is a REAL esports tournament platform."

The experience should be:

DISCOVER TOURNAMENT → SELECT SOLO/DUO/SQUAD → ENTER NAME + UID → REVIEW ENTRY → PAY → GET REGISTRATION ID → JOIN MATCH → VIEW RESULTS → CLIMB LEADERBOARD

Build the frontend, backend architecture, database structure, authentication flow, admin dashboard and responsive UI so the project is ready to connect to real payment and tournament operations.

Prioritize:

Premium gaming aesthetics

Extremely easy registration

Dynamic Solo/Duo/Squad pricing

Player name + Free Fire UID collection

Team management

Payment integration readiness

Admin tournament management

Match-room management

Results and leaderboard

Mobile-first experience

Security

Fast performance

This project was built with [Lovable](https://lovable.dev).

## Build with Lovable

Continue developing this project in the [Lovable editor](https://lovable.dev/projects/ffdd229b-71d1-4834-a4c0-bd2d6e3c1752).

- **Ship faster**: describe what you want to build and Lovable handles the code.
- **Stay in sync**: every change made in Lovable is committed straight to this repository.
- **Full ownership**: this code is yours. Push to `main` on GitHub and your changes sync back into Lovable, ready for your next prompt.

## Development

Prefer working locally? You need Node.js and npm — [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating).

```sh
git clone <this-repository-url>
cd <repository-name>
npm i
npm run dev
```
