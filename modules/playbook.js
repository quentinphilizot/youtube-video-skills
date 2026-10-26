"use strict";
/**
 * YOUTUBE PLAYBOOK — module commun à toutes les machines (skills youtube-playbook + mrbeast-method).
 *
 * Regroupe en consignes de prompt et en contrôles en code le savoir des vidéos-skills qui n'avait pas
 * encore de module (les 4 verrous du hook → lib/hooklocks.js, les 6 notes de miniature → lib/thumbnotes.js) :
 *   - MB : « I Watched Every MrBeast Interview » (Aprilynne Alter, youtu.be/5wvmDSMH9AM), adopté le 01/10/2026
 *   - AI : « how to make a killer youtube intro » (Aprilynne Alter, youtu.be/TOHQXdCAo5k)
 *   - K1 / SM : méthode CLAC et montage cinématographique (skill retention-doc-montage)
 *   - FC : « How to START & GROW a YouTube Channel | FULL COURSE » (Aprilynne Alter + Paddy Galloway, Jake
 *          Thomas, George Blackman, Chris Galletta, Rene Ritchie — youtu.be/SXN9SMLWLzw), adopté le 01/10/2026
 *          (skill youtube-growth-course) : validation d'idée (preuve + outliers, 6 critères), 3 émotions du
 *          titre (curiosité > peur / désir), affirmation > question, pas de MAJUSCULES, segments
 *          promesse → tension → payoff sans trou entre deux segments, UN seul geste demandé et la vidéo
 *          suivante en fin de vidéo, diagnostic de flop dans l'ordre satisfaction → durée vue → clic.
 * Règles retenues (contradictions tranchées dans .claude/skills/youtube-playbook/SKILL.md) :
 *   IDÉE      — originale, intéressante pour CETTE audience, extrême ; pas de miniature évidente = idée à changer.
 *   TITRE     — les 50 premiers caractères portent le sujet et l'enjeu (troncature « … » au-delà) ; opinion /
 *               enjeu fort ; cohérent avec la durée. Une formule de chaîne validée n'est jamais cassée : on
 *               vérifie seulement que le sujet tombe dans les 50 premiers caractères.
 *   INTRO     — 1re phrase = le titre, 1er plan = la miniature ; l'attente est confirmée en < 5 s puis
 *               dépassée ; zéro mot perdu ; UNE boucle ouverte, refermée à la fin ; effort réel compté.
 *   RÉTENTION — aucun moment mou ; la meilleure révélation gardée pour la fin (payoff) ; vidéo ≥ 10 min →
 *               relances planifiées (intrigue secondaire, question nouvelle) vers 40-50 % et 70-75 % ;
 *               chaque segment finit par une leçon, le suivant s'ouvre par un pont qui re-hooke.
 *   SEGMENTS  — (FC) chaque segment = PROMESSE (la crainte / l'attente du spectateur nommée) → TENSION (preuves
 *               visuelles, réponse retenue) → PAYOFF ; le passage payoff → promesse suivante tient en une
 *               phrase (c'est là, après le hook, que la rétention chute).
 *   FIN       — (FC, Rene Ritchie / YouTube) un seul geste demandé à la fois ; le meilleur appel de fin = la
 *               vidéo SUIVANTE à regarder (suite, approfondissement), pas « like, abonne-toi, commente ».
 *
 * Usage : `brief(kind, lang, opts)` s'ajoute au prompt Claude (kind = "idea" | "title" | "script" | "music") ;
 * `titleFlags(title, opts)`, `openingFlags(firstSentence, title, opts)` et `ctaFlags(text, opts)` renvoient la
 * liste des règles non tenues (liste vide = conforme) — à journaliser, jamais bloquant ; `relaunchPoints(sec)`
 * donne les instants de relance d'une vidéo longue ; `flopDoctor(metrics)` dit quoi faire d'une vidéo publiée
 * qui déçoit. Aucun appel payant.
 */

const langOf = (lang) => (/^fr|fran/i.test(String(lang || "")) ? "fr" : "en");
const TITLE_MAX = 50;

const STOP = new Set(("the a an of and or to in on for with from at by is are was were be this that these those it its " +
  "how why what when who which your you my i we our they their his her vs versus every all each new " +
  "le la les un une des de du d l et ou à au aux en dans sur pour par avec sans ce cet cette ces son sa ses " +
  "ton ta tes votre vos mon ma mes est sont qui que quoi comment pourquoi quand tout tous toute toutes").split(/\s+/));

/** Mots significatifs d'un texte (minuscules, sans accents ni ponctuation, sans mots vides). */
function keywords(text) {
  return String(text || "")
    .toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "")
    .replace(/[^a-z0-9$€%]+/g, " ").split(" ")
    .filter((w) => w.length > 2 && !STOP.has(w));
}

/** Instants (s) où une vidéo longue doit relancer l'attention : rien sous 10 min, ~45 % dès 10 min, + ~72 % dès 15 min. */
function relaunchPoints(durationSec) {
  const d = Number(durationSec) || 0;
  if (d < 600) return [];
  const pts = [Math.round(d * 0.45)];
  if (d >= 900) pts.push(Math.round(d * 0.72));
  return pts;
}
const mmss = (s) => `${Math.floor(s / 60)}:${String(Math.round(s % 60)).padStart(2, "0")}`;

/**
 * Consigne à ajouter au prompt. `kind` :
 *   "idea"   — choisir / noter une idée de vidéo ;
 *   "title"  — écrire un titre (opts.fixedFormula : la chaîne a une formule validée, on remplit ses cases) ;
 *   "script" — écrire une voix off (opts.durationSec, opts.onScreen pour un hook écrit) ;
 *   "music"  — vidéo sans voix (musique, lyric video) : ouverture visuelle, payoff, rythme.
 */
function brief(kind = "script", lang = "en", opts = {}) {
  const fr = langOf(lang) === "fr";
  if (kind === "idea") {
    return [
      "IDEA FILTER (MrBeast). Keep an idea only if it is (1) ORIGINAL — not the generic version everyone already made, (2) INTERESTING to THIS channel's audience, (3) EXTREME — the most striking version of the topic (\"first to climb a mountain\" beats \"first to finish a race\"). Then the packaging test: if you cannot picture an obvious, clickable thumbnail for it, the idea is weak — change the angle or drop it (MrBeast kills 70% of his pitches this way).",
      "VALIDATION (YouTube full course, Aprilynne Alter). (a) PROOF OF PRIOR SUCCESS: similar videos in the niche already reached the channel's view goal; (b) OUTLIERS: the topic produced videos at 5-10x their channel's average — a topic with neither is a gamble, say so. (c) REMARKABILITY: being significantly DIFFERENT beats trying to be better (a \"burgerito\", not a knock-off of the leader) — name the twist no competitor has. (d) The 6 checks: feasible with this machine; interesting to someone who has NEVER heard of the channel; interesting to at least 80% of the existing audience; can reach the view goal; fits the channel's brand; PACKAGEABLE (a strong title AND thumbnail exist). (e) Stay inside the channel's proven FORMAT buckets (what its outliers have in common); a new format is an explicit experiment, never the default.",
    ].join("\n");
  }
  if (kind === "title") {
    return [
      `TITLE (MrBeast). The FIRST ${TITLE_MAX} CHARACTERS carry the subject AND the stake — beyond that, devices truncate with \"…\" and people no longer know what they click.${opts.fixedFormula ? "" : ` Aim for the whole title under ${TITLE_MAX} characters.`}`,
      "Reading it must make watching feel MANDATORY: a strong stance or an extreme stake (not \"I like bananas\" but \"Bananas are the best food on the planet\"), never a neutral topic label.",
      "It must fit the video's LENGTH (a \"5-second\" title on a long video lowers clicks) and lead straight into what the first seconds show.",
      "CLICK EMOTION (Jake Thomas): every title triggers at least one of CURIOSITY (the gatekeeper — the most important), FEAR or DESIRE; a plain statement that makes nobody feel anything is a bad title. Build curiosity with an OPEN LOOP (start the story, don't finish it) or a CONTRAST (two things that should not go together: \"$1 vs $250,000,000\", \"Luxury fashion is for broke people\"). Prefer a BOLD STATEMENT to a question — a question is weaker unless the channel's validated formula uses one.",
      "No ALL-CAPS title (harder to read = fewer clicks): Capitalize Each Word or sentence case, at most ONE word in caps for emphasis. Browse / home-page videos: shorter and curiosity-led; search videos: clarity first (the intent to click already exists).",
      opts.fixedFormula ? `The channel's title formula and its length rule are fixed and WIN over this note: keep the formula EXACTLY and only fill its slots — just make sure the subject lands in the first ${TITLE_MAX} characters.` : "",
      fr ? "Title language: French." : "",
    ].filter(Boolean).join("\n");
  }
  if (kind === "music") {
    return [
      "OPENING & RETENTION (no voice-over — the picture and on-screen text do all the work).",
      "1. FIRST 5 SECONDS = THE THUMBNAIL: the first shot shows the same subject, colours and promise as the thumbnail (autoplay plays the video before people see the thumbnail), readable MUTED; any on-screen text states the title's promise.",
      "2. Confirm the promise immediately, then EXCEED it; bright images, a new shot every ~1.5 s at the start.",
      "3. Keep the strongest moment (the reveal, the drop, the best image) for the END — the payoff that keeps people to the last second.",
      "4. No dull stretch: anything the viewer would look away from is cut or changed.",
      "5. END: ask for ONE thing only — and the best ending is the NEXT video to watch (the series' next episode, a deeper dive), not a list of \"like, subscribe, comment\".",
    ].join("\n");
  }
  // script (voix off)
  const pts = relaunchPoints(opts.durationSec);
  return [
    `VIDEO STRUCTURE — PLAYBOOK (MrBeast + intro method, mandatory).${opts.onScreen ? " The opening is on-screen text, watched muted." : ""}`,
    "1. 5-SECOND MATCH: the FIRST SENTENCE says the title's promise in spoken words (not word for word) and what is shown first is the thumbnail — the viewer checks \"did I get what I clicked for?\" within 5 seconds. Confirm it, then EXCEED it (\"…and that's not even the craziest part\"). Zero wasted words: no greeting, no \"in this video\", no channel intro.",
    "2. ONE OPEN LOOP in the intro (a question, a hidden answer, \"the last one breaks the pattern\") that the video CLOSES at the end — never a loop left unpaid. If the effort behind the video is real and countable (sources read, numbers checked, years covered), say it early, with the TRUE count — never invented.",
    "3. PAYOFF AT THE END: keep the strongest reveal / most extreme item / answer to the loop for the final part, and remind it once mid-video (\"…and the last one is the one you won't believe\").",
    "4. NO DULL MOMENT: every sentence either teaches, raises a stake or advances the story; cut recaps, filler and repeated ideas. Each segment ends on a short LESSON (an insight, not a summary) and the next one opens with a BRIDGE that re-hooks (a new question, a contradiction).",
    pts.length
      ? `5. LONG VIDEO: one storyline cannot hold ${Math.round(opts.durationSec / 60)} minutes — plan a RELAUNCH around ${pts.map(mmss).join(" and ")} (a side story, a twist, a new stake or question) so viewers re-engage instead of drifting.`
      : "",
    "6. Write for the ear first (it must work eyes closed) and give every idea a visual that SHOWS it (it must also work muted). Every sentence must be easy to SAY aloud in one breath — rewrite any sentence a narrator would trip over.",
    "7. SEGMENTS = PROMISE → TENSION → PAYOFF (George Blackman / Brandon Sanderson). PROMISE: name the viewer's fear or expectation for this part and promise to resolve it. TENSION: show visual evidence and build towards the answer WITHOUT giving it away (never answer the segment's question in its first sentence). PAYOFF: the answer, in one clear sentence. Then go STRAIGHT into the next promise — the gap between one payoff and the next setup is, after the hook, where viewers leave: one line reminds why the next part matters for the video's big question. Never land the point 10-15 s before the transition.",
    "8. CALLS TO ACTION: one job at a time (never \"like, subscribe, comment and check the link\" in one go). The END call points to ONE next video to watch (the next episode, a deeper dive) — the strongest growth signal.",
    "9. INTRO (youtube-intro): after the 5-second match, give only the context needed to follow (what it is, why it matters now), then SHOW the effort early (true, counted figures: sources read, numbers checked). Front-load the pace: a new idea or visual every ~1.5 s in the first 15 s; the picture must carry the promise even with the sound off (autoplay is muted).",
    "10. MRBEAST METHOD: the idea was chosen for its packaging — the video must DELIVER exactly the promise of the title and thumbnail, at the most extreme version the facts allow; retention is the goal (aim for 70 %), so cut anything a viewer would skip. After this video, note ONE thing to improve for the next (\"100 videos, one improvement each\") — never several at once.",
  ].filter(Boolean).join("\n");
}

/**
 * Règles de titre non tenues. `subject` : mots qui nomment le sujet (doivent tomber dans les 50 premiers
 * caractères) ; `fixedFormula` : formule de chaîne validée → la longueur totale n'est pas signalée.
 */
function titleFlags(title, { subject = "", fixedFormula = false, max = TITLE_MAX } = {}) {
  const t = String(title || "").replace(/\s+/g, " ").trim();
  if (!t) return ["TITRE : vide"];
  const flags = [];
  if (!fixedFormula && t.length > max) flags.push(`TITRE : ${t.length} caractères (> ${max}, tronqué « … » sur certains appareils)`);
  const subj = keywords(subject);
  if (subj.length) {
    // à la racine près (« lycée » / « lycées », « censure » / « censurer ») : 5 premières lettres, 4 pour les mots courts
    const root = (w) => w.slice(0, Math.min(5, Math.max(4, w.length)));
    const head = new Set(keywords(t.slice(0, max)).map(root));
    if (!subj.some((w) => head.has(root(w)))) flags.push(`TITRE : le sujet n'est pas dans les ${max} premiers caractères`);
  }
  if (/^(the (evolution|history|story) of|l'(histoire|évolution) d)/i.test(t)) flags.push("TITRE : étiquette neutre (« The history of… ») au lieu d'un enjeu");
  // FC (Jake Thomas) : pas de titre en MAJUSCULES — un seul mot d'emphase toléré ; une formule de chaîne
  // validée garde sa casse (chaîne « hype » : les capitales font partie de la marque)
  const words = t.match(/\p{L}{3,}/gu) || [];
  const caps = words.filter((w) => w === w.toUpperCase() && w !== w.toLowerCase());
  if (!fixedFormula && caps.length >= 2 && caps.length / words.length > 0.5) flags.push("TITRE : en MAJUSCULES (plus dur à lire) — Une Majuscule Par Mot, un seul mot en capitales au plus");
  // FC : une affirmation forte bat une question (une formule de chaîne validée garde la sienne)
  if (!fixedFormula && /\?\s*$/.test(t)) flags.push("TITRE : question plutôt qu'une affirmation forte (la question attire moins)");
  return flags;
}

/**
 * Règle des 5 secondes : la 1re phrase (voix off ou texte d'ouverture) reprend la promesse du titre.
 * Contrôle simple et tolérant : au moins un mot significatif du titre (ou du sujet) dans la 1re phrase.
 */
function openingFlags(firstSentence, title, { subject = "" } = {}) {
  const first = new Set(keywords(firstSentence));
  if (!first.size) return ["OUVERTURE : 1re phrase vide"];
  const ref = [...new Set([...keywords(title), ...keywords(subject)])];
  if (!ref.length) return [];
  return ref.some((w) => first.has(w) || [...first].some((f) => f.length > 4 && (f.startsWith(w) || w.startsWith(f))))
    ? []
    : ["OUVERTURE : la 1re phrase ne reprend pas la promesse du titre (règle des 5 secondes)"];
}

/**
 * FC (Rene Ritchie, YouTube) : un seul geste demandé à la fois. Compte les gestes d'un appel à l'action
 * (abonnement, like, commentaire, cloche, lien, partage). `end: true` = appel de FIN de vidéo : il doit
 * pointer vers une vidéo suivante (la cliquer = signal de satisfaction le plus fort).
 */
const CTA_JOBS = [
  ["abonnement", /\bsubscrib|\bsub\b|abonne/i],
  ["like", /\blike( button|,| and\b| this\b| the video| it\b)|\b(hit|leave|drop|smash) (a |the )?like\b|\bthumbs? up\b|\bpouce\b|j'aime/i],
  ["commentaire", /\bcomment|\bcommente/i],
  ["cloche", /\bbell\b|\bcloche\b/i],
  ["lien", /\blink\b|\blien\b/i],
  ["partage", /\bshare\b|\bpartage/i],
];
function ctaFlags(text, { end = false } = {}) {
  const t = String(text || "");
  if (!t.trim()) return [];
  const jobs = CTA_JOBS.filter(([, re]) => re.test(t)).map(([k]) => k);
  const flags = [];
  if (jobs.length > 1) flags.push(`CTA : ${jobs.length} gestes demandés d'un coup (${jobs.join(", ")}) — un seul à la fois`);
  if (end && !/\b(next|watch|part \d|episode|series)\b|prochain|suivant|regarde|épisode|série/i.test(t))
    flags.push("CTA de fin : ne pointe pas vers une vidéo suivante (le meilleur appel de fin)");
  return flags;
}

/**
 * Audit complet d'un script voix off — À CHAQUE RUN, jamais bloquant (journalisé « 📘 Playbook : »).
 * Regroupe : règle des 5 s (openingFlags), boucle ouverte dans l'intro, rythme de la 1re phrase, CTA (un geste à la fois,
 * fin = vidéo suivante), relance d'une vidéo longue.
 */
function scriptFlags(script, { title = "", subject = "", durationSec = 0 } = {}) {
  const txt = String(script || "").replace(/\s+/g, " ").trim();
  if (!txt) return ["SCRIPT : vide"];
  const sentences = txt.match(/[^.!?…]+[.!?…]*/g) || [txt];
  const flags = [...openingFlags(sentences[0], title, { subject })];
  const words = txt.split(" ");
  const intro = words.slice(0, 70).join(" ");
  if (!/\?|\b(but|yet|until|except|secret|hidden|never|still|last one|nobody|why|how)\b|mais|pourtant|jamais|secret|caché|personne|pourquoi|comment|le dernier|la dernière/i.test(intro))
    flags.push("INTRO : aucune boucle ouverte dans les ~70 premiers mots (question, réponse cachée, « le dernier… »)");
  if ((sentences[0].match(/\S+/g) || []).length > 22) flags.push("INTRO : 1re phrase trop longue (> 22 mots) — rythme lent là où l'on perd le plus de monde");
  flags.push(...ctaFlags(words.slice(-45).join(" "), { end: true }));
  flags.push(...ctaFlags(words.slice(0, Math.max(0, words.length - 45)).join(" ")));
  const rl = relaunchPoints(durationSec);
  if (rl.length && !/\b(that's not even|but here's|meanwhile|twist|but wait)\b|mais attends|et ce n'est pas tout|retournement/i.test(txt))
    flags.push(`LONGUE VIDÉO : aucune relance repérée (prévue vers ${rl.map(mmss).join(" et ")})`);
  return flags;
}

/**
 * FC (Chris Galletta) : que faire d'une vidéo publiée qui déçoit. Ordre : satisfaction → durée vue → clic
 * (le CTR, le plus bruité et propre à chaque niche, ne se juge qu'une fois le reste écarté). Valeurs RELATIVES
 * à la moyenne de la chaîne (1 = normal) : `views`, `avd` (durée moyenne vue), `ctr`, `intro30` (part restée à
 * 30 s). `ageDays` : âge de la vidéo ; `changes` : changements de packaging déjà faits ; `lastChangeDays`.
 * Renvoie { verdict: "attendre"|"visionnage"|"clic"|"ok", actions[] } en français.
 */
function flopDoctor({ views = null, avd = null, ctr = null, intro30 = null, ageDays = 0, changes = 0, lastChangeDays = null } = {}) {
  const n = (x) => (x == null || x === "" || !isFinite(Number(x)) ? null : Number(x));
  const v = n(views), a = n(avd), c = n(ctr), i = n(intro30), age = n(ageDays) || 0, last = n(lastChangeDays);
  if (a == null && i == null) return { verdict: "attendre", actions: ["Ne rien juger avant la courbe de rétention : problème de clic ou de visionnage ?"] };
  if (i != null && i < 0.8) return { verdict: "visionnage", actions: [
    "L'intro perd nettement plus que d'habitude : promesse du titre / de la miniature pas confirmée en 5 s, ou intro trop lente.",
    "Leçon pour la vidéo suivante ; si la miniature promet autre chose que le 1er plan, la rapprocher de la vidéo.",
  ] };
  if (a != null && a < 0.8) return { verdict: "visionnage", actions: [
    "Durée vue sous la moyenne : lire la courbe — plateaux (ce qui tient), chutes en fin de segment (point posé 10-15 s trop tôt, transition trop longue), bosses = passages sautés.",
    "Le packaging n'est pas en cause : noter UNE amélioration de script / montage pour la suivante.",
  ] };
  if (v != null && v >= 0.8) return { verdict: "ok", actions: ["Dans la norme de la chaîne : rien à changer."] };
  // Rétention correcte mais peu de vues → le clic : titre, miniature ou sujet
  const actions = [];
  if (age >= 21 || changes >= 3) {
    actions.push("Arrêter les retouches : relancer plus tard par l'écran de fin d'une vidéo qui marche ou un Short ; ne jamais supprimer la vidéo.");
  } else if (last != null && last < 7) {
    actions.push("Dernier changement il y a moins de 7 jours : attendre (1 changement par semaine au plus).");
  } else {
    if (age < 1) actions.push("Lancer tout de suite un A/B de miniature (Tester et comparer, jusqu'à 3 versions).");
    if (c != null && c < 0.6 && age < 3) actions.push("Clic très sous la moyenne dès les premières heures : le public de la chaîne ne s'y retrouve pas — changer titre / miniature sans attendre.");
    else if (age >= 2) actions.push("Changer le titre sous un autre angle (curiosité / peur / désir, ex. « You don't understand X ») — rétention bonne = la vidéo a encore du potentiel.");
    else actions.push("Attendre 2-3 jours avant de toucher au titre.");
  }
  return { verdict: "clic", actions };
}

module.exports = { brief, titleFlags, openingFlags, scriptFlags, ctaFlags, flopDoctor, relaunchPoints, keywords, langOf, TITLE_MAX };
