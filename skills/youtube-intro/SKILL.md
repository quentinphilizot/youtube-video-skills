---
name: youtube-intro
description: Use when designing, scripting, editing or diagnosing the first 5-30 seconds of a long-form YouTube video (the intro after the click) for any niche — voice-over, music-only or talking-head. Covers the title+thumbnail-first rule, the 5-second match (first sentence = title, first shot = thumbnail), curiosity gaps / open loops, context, input bias (showing effort), show-don't-tell for muted autoplay, and front-loaded pacing (a new visual every ~1.5 s). Pairs with storytelling-hooks (the 4 locks) and titles-and-thumbnails.
---

# YouTube Intro: meet, then exceed, the promise of the click

Source: Aprilynne Alter, « how to make a killer youtube intro (to blow up your channel) » (youtu.be/TOHQXdCAo5k, 11:32), with MrBeast (to Coffeezilla), Mark Rober's « Egg Drop from Space », Mr. Who's the Boss, Michelle Khare as worked examples. Adopted by the user on 27/09/2026 for every Agent OS machine, first applied to NUMBER LINEUP (machine `evolution3d`).

**Core idea:** the intro has ONE job — **meet and exceed the expectations set by the title and thumbnail (T&T)**. The viewer who clicked is checking « did I get what I clicked for? ». Answer yes in 5 seconds, then give them reasons to stay.

## The 5 steps (in this order)

### 0. Title + thumbnail FIRST — before the intro exists
- If people don't click, they don't watch. The audience never sees your video, only the T&T.
- Most creators do idea → script → film → edit → « oh, a title » → publish. That is thinking like you, not like the audience.
- Finalise the T&T first (days or weeks is fine). **Only once you're ~90 % sure people will click do you build the intro** — you can't match a promise that doesn't exist yet.
- Machine rule: the thumbnail is produced **before** the montage (the intro reuses it). If the thumbnail changes afterwards, re-render the montage (0 $).

### 1. The first 5 seconds = match the T&T (biggest drop-off of the whole video)
Improving retention in the first 5 s improves retention of the entire video by default. Two-part formula:
- **First sentence matches the title.** (Rober: title « Egg Drop from Space » → « This is space, and this is an egg moments before I attempted the world's highest egg drop. »)
- **First shot matches the thumbnail.** (Same egg above Earth on a black rod, same blue/white/black palette.)
- Not word for word, not pixel for pixel — close enough to prove it wasn't clickbait.

### 2. Curiosity gaps / open loops
- The brain craves closure: an open question makes people stay for the answer (« will he get the world record? »).
- A loop doesn't have to be a big mystery: promising « a 3-step formula » (we want the 3 steps), **blurring or masking something** (we want to see what's behind), a number hidden behind « ??? ».
- Open **one or more** loops in the intro, and **close every one** later (an unpaid loop is clickbait and kills trust).
- Re-open or remind the loop mid-video, where retention sags (« answer at the end · 7 to go »).

### 3. Context & setup
- Give just what's needed to follow: what the thing is, and why we're doing it (Rober explains what an egg drop is and why space: taller buildings keep getting built, so future-proof the record).

### 4. Input bias — exceed the expectation by showing the effort
- We value what took effort (time, energy, money): a $50 bottle of wine tastes better than the same bottle at $20.
- Rober: « when I started this journey **3 years ago** … the most physically, financially and mentally draining video I'd ever attempt ».
- No space budget needed: « **7 days straight researching** », a high level of editing, doing what few would do. **Get it across EARLY** — the sooner they see the effort, the sooner they value the video.
- ⚠ Agent OS rule: effort figures must be **true and counted** (models screened, numbers checked, sources read, years covered) — never an invented duration.

### 5. Construction: show, don't tell + front-load the stimulus
- **Show, don't tell.** Autoplay means many intros are watched **muted**: the intro must draw someone in without hearing a thing. Every line of script gets a visual that SHOWS it (Rober shows egg-drop examples; MrBeast shows a clip of each event). Write the shot list from the script: one visual per idea.
- **Pacing.** Once people go full-screen they're in; the 20 s before that are full of distractions. Top creators increase the pace of clips, visuals and angles at the very start: **MrBeast changes visual every 1.4 s, Rober every 1.6 s.** User rule: **one new shot every 1.5 s** in the intro.
- Intro length varies (MrBeast ≤ 25 s, Rober up to 45 s, Mr. Who's the Boss < 10 s) — the structure doesn't.
- **Test it:** watch it again and again, in a noisy room, with no sound, with a 7-year-old. Wherever you (or they) look away → change it or cut it.

## Intro checklist (before any render)
- [ ] T&T finalised first, ~90 % confident of the click
- [ ] Shot 1 = the thumbnail (same object, same colours, same « ??? »)
- [ ] Sentence 1 = the title in spoken words (+ passes the 4 locks of storytelling-hooks)
- [ ] ≥ 1 open loop, each one closed later; the big one reminded mid-video
- [ ] Context shown in one shot (what it is, how many, over how long)
- [ ] Input bias: a real, counted effort figure, said AND shown, before ~15 s
- [ ] Every idea has a visual; readable muted
- [ ] A new shot every ~1.5 s; nothing on screen a 7-year-old would look away from
- [ ] **One idea per ~3 s beat, said AND written at the same moment** — the rhythm comes from changing the SHOT, never from a new text; ≤ 4 messages in the whole intro (promise, gap, loop, effort). Test: mute it, then close your eyes and only listen — both versions must tell the same story.
- [ ] Full spoken sentences (never « One fell. Which? »); numbers stay on screen, the voice says the idea (a spoken price costs 2-3 s)

## Applied: NUMBER LINEUP (`agent-os/lib/machines/evolution3d.js`, `remotion/src/Evolution3D.tsx`)

### What failed first (27/09/2026, user: « on ne comprend pas tout ») — the lessons
Version 2 applied every rule of this skill at once and became unreadable: 12 shots, **~10 different messages in 18 s** (masked hook, gap, count, curve, 2031 label, twist, 3rd question, effort headline, counter, sources…). Measured problems:
1. **Voice and screen out of sync** — one voice clip per segment carried 3 loops; « 2031? » was heard over the curve, « One fell. Which? » over the 2031 reels, « Fastest decade? » over the twist. What you hear ≠ what you read.
2. **Telegraphic voice** — word budgets squeezed sentences into fragments (« One fell. Which? », « No record before 1963, 68 checked. »): nobody understands them.
3. **3.6 s → 6.2 s of silence** — the gap and lineup shots had no voice at all.
4. **« ??? » everywhere looks like a bug** — « Your house costs ??? times the 1950 one », slot reels spinning random digits ($88,777), curve labels « $?????? ».
5. **Repeated shots** — the 2031 reels twice, VERIFIED three times: the filler looked stuck.
6. **Too many loops** — 3 questions in 6 s, none has time to land; a loop the viewer did not register creates no curiosity.

**Rule:** the 1.5 s rhythm comes from CHANGING THE SHOT, never from a new text. One idea per ~3 s beat, said and written at the same moment. One loop in the intro (the answer at the end); the other questions belong mid-video.

### Current version: 4 beats × 2 shots (`introShots`, voices from `introFor`, 0 $)
| Beat | Shot 1 | Shot 2 | Voice (starts with its beat) |
|---|---|---|---|
| 1 PROMISE | the thumbnail, push-in to its « $??? » | the whole lineup parades — « 24 US HOUSES · 1950 → 2026 » | « Every US house price since 1950. » (= the title) |
| 2 GAP | the original: « 1950 · $7,354 » (already on the thumbnail) | the newest, same layout: « 2026 · $??? » | « Here is 1950. Guess 2026. » |
| 3 LOOP | the curve draws itself, no value, only the two end years — « MEDIAN PRICE · 1950 → 2026 » | the curve extends in a dotted line to a « ? » at 2031 — « AND IN 2031? » + « ANSWER AT THE END » | « And 2031? Answer at the end. » |
| 4 EFFORT | counter « 68 NUMBERS CHECKED » over a faint data wall, « 7 SOURCES · 76 YEARS · NO NATIONAL RECORD BEFORE 1963 » (the last part written by Claude, `lineup.intro.effort.screen`) | same + stamp VERIFIED + source domains | « We checked 68 numbers across 7 sources. » |

- **Spoken numbers are slow**: « $7,354 » or « 1950 to 2026 » cost 2-3 s of voice each (measured). The figure stays ON SCREEN; the voice says the idea in ~2.5 s. Beat length = max(2 × 1.5 s, its voice + 0.3 s) → 16 s on the US House run.
- **No result before the end**: only the first value (already on the thumbnail) appears; the last value, the multiplier and the 2031 range wait for the lineup and the outro forecast.
- Mid-video reminder: `LoopReminder` pill at 50 % and 80 % of the lineup (« MEDIAN PRICE IN 2031: REVEALED AT THE END · 7 TO GO »).
- Colour code per pillar (`PILLAR_COLORS`): tech blue · money green · auto red · aviation silver · sport orange · luxury violet — Studio thumbnail background, title gradient, 3D scene accent.
- Settings: `introShots: false` → the old single hook frame; `introThumb: false` → no thumbnail-first. Re-run the montage (≈ 0 $) after changing the thumbnail or the intro.

## Applied: Data Ranking (`agent-os/lib/machines/datarank.js`, `remotion/src/DataCarousel.tsx`, 28/09/2026)
Same 4 beats with a voice-over carousel: PROMISE (thumbnail → all cards parading with « ??? ») · GAP (4 countries spread through the list, never #1: flag + « ??? » + the question) · LOOP (#1 masked, « ANSWER AT THE END », reminded at 50 % and 80 %) · EFFORT (counted checks). **The voice never says a number** (code-checked): the duration guard adds or removes cards after the script, so any spoken figure can become false — the first run said « starts at $1.71 in Brazil » after 4 cheaper countries had been added in front.

## Related
- **storytelling-hooks** — the 4 locks every first sentence must pass (TIME / MEANING / MIRROR / GAP).
- **titles-and-thumbnails** — step 0.
- **retention-audit** — reading where the intro loses people.
- **long-form-youtube** — what comes after the intro.
- **youtube-playbook** — index of all video-derived knowledge by stage (idea → packaging → intro → retention → measure → progress); **mrbeast-method** — the MrBeast interviews compilation.
