"use strict";
/**
 * LES 6 NOTES D'UNE MINIATURE — module commun à toutes les machines (brief de conception + audit vision).
 *
 * Source : Aprilynne Alter, « give me 9 minutes, I'll make your thumbnails 81% better »
 * (youtu.be/KE4zqD0ONDI) + son antisèche « Thumbnail Notes Cheat Sheet », adoptées par l'utilisateur
 * le 27/09/2026 pour la miniature de CHAQUE machine. Les 6 notes :
 *   1. TV (test des 50 %) — sur la TV (1er appareil YouTube aux US) seule la moitié HAUTE de la miniature
 *      est visible dans l'accueil et les suggestions. Moitié basse cachée : il doit rester assez pour
 *      (a) donner envie d'appuyer sur « bas » et (b) comprendre le sujet. Le sujet et le texte vont en haut.
 *   2. QUESTION + ÉMOTION — les titres rétrécissent face aux miniatures : la miniature doit donner envie
 *      TOUTE SEULE. On ne part pas de « quoi montrer » mais de « que doit-il se DEMANDER, que doit-il
 *      RESSENTIR ? ». Question et émotion battent la simple pertinence.
 *   3. RÉFÉRENCES — 10-15 références variées (outliers internes, outliers externes, chaînes au même format
 *      sur un autre sujet, favoris, hors YouTube) ; de chacune on extrait le MÉCANISME : quelle question,
 *      quelle émotion, et COMMENT elle les provoque. On transpose le mécanisme, pas la surface.
 *   4. SUPERFLU — tout ce qui ne travaille pas pour la miniature travaille contre elle : on l'enlève.
 *   5. PERSONNAGE PRINCIPAL ÉVIDENT — c'est la 1re chose que l'œil voit : il se détache de tout le reste
 *      (couleur contrastée, taille, étiquette).
 *   6. A/B DU TEXTE — 5 minutes de plus pour trouver d'autres mots : plusieurs variantes, testées dans
 *      YouTube Studio (« Tester et comparer », jusqu'à 3 miniatures).
 *
 * Usage : `brief(lang, { template, hasText })` s'ajoute au prompt Claude qui CONÇOIT une miniature (scène,
 * texte, spec) ; `audit(machineId, mod, runId)` fait relire la miniature finale par Claude vision (image
 * entière + moitié haute seule + export 210 px) et rend un diagnostic noté /100 avec 3 variantes de texte
 * pour l'A/B. Jamais bloquant, 0 $ (Claude CLI + FFmpeg local). Persistance :
 * data/machines/<machine>-thumbaudits.json, une entrée par run, périmée dès que la miniature change.
 */
const fs = require("fs");
const path = require("path");
const { execFile } = require("child_process");
const { readJSON, writeJSON } = require("./store");
const files = require("./files");
const claude = require("./claude");
// Historique / import / restauration des miniatures (module commun, lib/thumbhistory.js)
const history = require("./thumbhistory");
const { PROJECT_ROOT, relOf, thumbState, runFile } = history;

const langOf = (lang) => (/^fr|fran/i.test(String(lang || "")) ? "fr" : "en");

/**
 * Consigne à ajouter au prompt de conception d'une miniature.
 * `template` : la chaîne a un gabarit figé (la structure ne change pas, seuls le sujet et le texte
 * bougent) ; `hasText` : la miniature porte du texte incrusté.
 */
function brief(lang = "en", { template = false, hasText = true } = {}) {
  const fr = langOf(lang) === "fr";
  return [
    "THUMBNAIL — THE 6 NOTES (mandatory, Aprilynne Alter method).",
    "1. START FROM THE VIEWER, NOT FROM THE TOPIC: before choosing what to show, decide in one line what the viewer must WONDER (a precise question) and what they must FEEL (one emotion: fear, awe, envy, vulnerability, nostalgia, outrage…). Every element must serve that question or that emotion. The thumbnail must make people want to click WITHOUT the title (titles are now tiny next to thumbnails) — question + emotion beat mere relevance.",
    `2. TV 50% TEST: on TV only the TOP HALF of the thumbnail is visible. The main subject (or at least its most telling part) and ${hasText ? "the text (top third)" : "the key visual"} sit in the UPPER half; covering the bottom half must still show what the video is about and make people press \"down\".`,
    "3. ONE MAIN CHARACTER, OBVIOUS: a single hero element, the first thing the eye lands on — it stands out from everything else by contrasting color, size and light (a short label or arrow if needed).",
    "4. NO CLUTTER: anything that is not actively working for the thumbnail works against it — remove secondary objects, busy backgrounds, extra props, extra words. Realism does not matter; clarity does. Every remaining element must be DISTINCT (never the same colour as what is behind or next to it, a clear silhouette) and there for a reason; BRIGHT rather than dark; understood in one glance while scrolling (MrBeast).",
    "5. REFERENCES: if reference thumbnails are provided (niche winners, channel template), reuse their MECHANISM — which question they raise, which emotion, and HOW — never just their surface.",
    hasText ? `6. TEXT: silently brainstorm 5 different wordings (${fr ? "en français" : "in the video's language"}), keep the one that creates the strongest question in the fewest words (≤ 4 words); it must COMPLEMENT the image and the title, never repeat them.` : "",
    "7. CURIOSITY TYPE + SCROLL STOPPER (YouTube full course): pick ONE of the 5 curiosity types — MOMENT (the instant right before a powerful reaction), STORY (a point of tension that sets up act one), RESULT (the desired result), TRANSFORMATION (before AND after), NOVELTY (something never seen) — and at least one scroll stopper (a face/emotion, familiarity, money, a large number, bright colour, danger or movement, something beautiful). COMPOSITION: the main character in the centre (symmetrical) or on a third (asymmetrical), the eye led to it by an arrow, a leading line, scale or blur. CONTRAST: light vs dark and saturated vs grey make the main character pop (complementary hues are optional).",
    "8. THE 3 TESTS before validating: CLARITY (at its smallest size every word reads and every object is recognisable), CONTRAST (placed among the niche's thumbnails it stands out), GLANCE (shown 2 seconds on a phone, someone can say what they saw and what the video is about).",
    template ? "The channel's template layout is fixed: apply these notes through the choice of subject, pose, colors and words — never by changing the layout." : "",
  ].filter(Boolean).join("\n");
}

// ---------------------------------------------------------------------------------------------
// Audit vision
// ---------------------------------------------------------------------------------------------
const auditFile = (machineId) => `machines/${machineId}-thumbaudits.json`;
function load(machineId) {
  const d = readJSON(auditFile(machineId), {});
  return d && typeof d === "object" && !Array.isArray(d) ? d : {};
}

function ffmpeg(args) {
  return new Promise((resolve, reject) => {
    execFile("ffmpeg", ["-y", "-v", "error", ...args], { timeout: 60000, windowsHide: true }, (e, _o, err) =>
      e ? reject(new Error(`ffmpeg : ${String(err || e.message).trim().slice(-200)}`)) : resolve());
  });
}

/** Clé de version de la miniature d'un run : l'audit est périmé dès qu'elle change. */
function thumbKey(run) {
  const pk = (run && run.pack) || {};
  const rel = relOf(run);
  if (!rel) return "";
  const full = files.resolveLocal(rel);
  let mtime = 0;
  try { mtime = full ? Math.round(fs.statSync(full).mtimeMs) : 0; } catch {}
  return `${rel}|${pk.thumbTs || ""}|${mtime}`;
}

/** Poids de chaque note dans la note /100 (calculée en code, pas par Claude). */
const WEIGHTS = { tv: 25, curiosity: 30, mainCharacter: 20, clutter: 15, small: 10 };
const clamp = (n, max) => Math.max(0, Math.min(max, Math.round(Number(n) || 0)));

function normalize(a) {
  const sub = a.points || {};
  const points = {
    tv: clamp(sub.tv, WEIGHTS.tv),
    curiosity: clamp(sub.curiosity, WEIGHTS.curiosity),
    mainCharacter: clamp(sub.mainCharacter, WEIGHTS.mainCharacter),
    clutter: clamp(sub.clutter, WEIGHTS.clutter),
    small: clamp(sub.small, WEIGHTS.small),
  };
  const str = (s, n = 400) => String(s || "").trim().slice(0, n);
  const list = (l, n, len = 200) => (Array.isArray(l) ? l : []).map((x) => str(x, len)).filter(Boolean).slice(0, n);
  return {
    score: Object.values(points).reduce((s, v) => s + v, 0),
    points,
    tv: { pass: !!(a.tv && a.tv.pass), seen: str(a.tv && a.tv.seen), why: str(a.tv && a.tv.why) },
    wonder: str(a.wonder),
    feel: str(a.feel, 160),
    mainCharacter: { what: str(a.mainCharacter && a.mainCharacter.what, 120), obvious: !!(a.mainCharacter && a.mainCharacter.obvious) },
    // Cours complet YouTube (01/10/2026) : type de curiosité + test du coup d'œil (2 s sur un téléphone)
    kind: ["moment", "story", "result", "transformation", "novelty"].includes(String(a.kind || "").toLowerCase()) ? String(a.kind).toLowerCase() : "",
    glance: str(a.glance, 200),
    clutter: list(a.clutter, 5, 120),
    currentText: str(a.currentText, 80),
    textVariants: list(a.textVariants, 3, 60),
    fixes: list(a.fixes, 3, 320),
  };
}

/** Contexte texte du run pour que Claude juge la miniature par rapport à la vidéo. */
function context(run, mod) {
  const pk = run.pack || {};
  const p = run.params || {};
  return [
    `Chaîne / machine : ${mod.MACHINE_NAME || ""}`,
    pk.title ? `Titre de la vidéo : ${pk.title}` : "",
    run.theme || p.topic || p.theme ? `Sujet : ${run.theme || p.topic || p.theme}` : "",
    p.lang || run.lang ? `Langue de la vidéo : ${p.lang || run.lang}` : "",
  ].filter(Boolean).join("\n");
}

const inflight = new Map();

/** Fait relire la miniature finale d'un run par Claude vision et enregistre le diagnostic. */
async function audit(machineId, mod, runId) {
  const run = mod.getRun(runId);
  if (!run) throw new Error("run introuvable");
  const key = thumbKey(run);
  if (!key) throw new Error("ce run n'a pas encore de miniature");
  const flightKey = `${machineId}:${runId}:${key}`;
  if (inflight.has(flightKey)) return inflight.get(flightKey);
  const job = (async () => {
    const full = files.resolveLocal(relOf(run));
    if (!full || !fs.existsSync(full)) throw new Error("fichier de miniature introuvable");
    const dir = path.join(path.dirname(full), "thumb-audit");
    fs.mkdirSync(dir, { recursive: true });
    const top = path.join(dir, "top50.png");
    const small = path.join(dir, "small210.png");
    // Test des 50 % : la moitié HAUTE seule (ce que montre la TV) ; test des 210 px : taille du fil mobile
    await ffmpeg(["-i", full, "-vf", "crop=iw:ih/2:0:0", "-frames:v", "1", top]);
    await ffmpeg(["-i", full, "-vf", "scale=210:-2", "-frames:v", "1", small]);
    const raw = await claude.ask([
      "Tu es un stratège YouTube spécialiste des miniatures (méthode Aprilynne Alter). Lis ces 3 images avec ton outil Read. Ne modifie aucun fichier, n'exécute rien d'autre.",
      `1. La miniature entière : « ${path.resolve(full)} »`,
      `2. Sa moitié HAUTE seule (ce qu'on voit sur une TV avant d'appuyer sur « bas ») : « ${path.resolve(top)} »`,
      `3. La miniature à 210 px de large (sa taille réelle dans le fil mobile) : « ${path.resolve(small)} »`,
      "",
      context(run, mod),
      "",
      "Juge-la SANS t'appuyer sur le titre (la miniature doit donner envie seule), selon 5 notes :",
      `- tv (/${WEIGHTS.tv}) : TEST DES 50 % — sur l'image 2 seule, comprend-on de quoi parle la vidéo, et y a-t-il assez pour donner envie d'appuyer sur « bas » ?`,
      `- curiosity (/${WEIGHTS.curiosity}) : quelle QUESTION précise fait-elle se poser, quelle ÉMOTION fait-elle ressentir ? Question + émotion > simple pertinence. Une miniature seulement « illustrative » plafonne à 12.`,
      `- mainCharacter (/${WEIGHTS.mainCharacter}) : le personnage/élément principal est-il la 1re chose que l'œil voit, détaché du reste (couleur, taille, lumière, étiquette) ?`,
      `- clutter (/${WEIGHTS.clutter}) : tout ce qui ne travaille pas pour la miniature travaille contre elle — liste les éléments superflus (15 = rien à enlever).`,
      `- small (/${WEIGHTS.small}) : à 210 px, le sujet et le texte se lisent-ils encore ?`,
      "",
      "Classe-la dans UN des 5 types de curiosité (« kind ») : moment (l'instant juste avant une réaction forte), story (une tension qui ouvre une histoire), result (le résultat désiré), transformation (avant ET après), novelty (jamais vu) — vide si aucun. TEST DU COUP D'ŒIL (« glance ») : montrée 2 secondes sur un téléphone, que dirait quelqu'un avoir vu et de quoi parle la vidéo selon lui (≤ 25 mots) ? Une réponse floue ou fausse = le texte et le personnage principal sont à revoir.",
      "",
      "Puis : recopie le texte incrusté actuel (vide s'il n'y en a pas) et propose 3 VARIANTES de ce texte pour un test A/B dans YouTube Studio (même langue, même longueur ou plus court, ≤ 4 mots, chacune un angle différent : question, chiffre/enjeu, émotion ; aucune si la miniature n'a pas de texte). Enfin les 3 corrections les plus rentables, concrètes et actionnables (« remonter le texte dans le tiers haut », « passer le personnage en rouge sur fond froid »…), de la plus à la moins importante, ≤ 30 mots chacune. Champs courts : « seen » et « why » ≤ 40 mots, « feel » ≤ 12 mots.",
      'RÉPONDS UNIQUEMENT EN JSON (textes en français sauf les variantes, dans la langue de la miniature) : {"points":{"tv":0,"curiosity":0,"mainCharacter":0,"clutter":0,"small":0},"tv":{"pass":true,"seen":"ce que la moitié haute laisse comprendre","why":""},"wonder":"la question que la miniature fait se poser (vide si aucune)","feel":"l\'émotion (vide si aucune)","mainCharacter":{"what":"","obvious":true},"kind":"moment|story|result|transformation|novelty","glance":"ce qu\'on retient en 2 s","clutter":["élément superflu"],"currentText":"","textVariants":["","",""],"fixes":["","",""]}',
    ].join("\n"), { timeoutMs: 4 * 60 * 1000 });
    const topRel = path.relative(PROJECT_ROOT, top).split(path.sep).join("/");
    const result = { at: new Date().toISOString(), key, topRel, ...normalize(claude.parseJson(raw)) };
    const all = load(machineId);
    // la sauvegarde de l'originale (variante en cours d'essai) survit aux nouveaux audits
    if (all[runId] && all[runId].original) result.original = all[runId].original;
    all[runId] = result;
    writeJSON(auditFile(machineId), all);
    history.tagScore(machineId, mod, runId, result.score);
    return result;
  })();
  inflight.set(flightKey, job);
  try { return await job; } finally { inflight.delete(flightKey); }
}

/** Dernier audit d'un run + état : `fresh` = il porte sur la miniature actuelle, `running` = en cours. */
function get(machineId, mod, runId) {
  const run = mod.getRun(runId);
  if (!run) throw new Error("run introuvable");
  const key = thumbKey(run);
  const a = load(machineId)[runId] || null;
  const running = [...inflight.keys()].some((k) => k.startsWith(`${machineId}:${runId}:`));
  const variantRunning = variantInflight.has(`${machineId}:${runId}`);
  let hist = [];
  try { hist = history.list(machineId, mod, runId, a && a.key === key ? { score: a.score } : undefined); } catch {}
  return {
    hasThumb: !!key, thumbRel: relOf(run) || null, audit: a, fresh: !!(a && a.key === key), running, variantRunning,
    variant: VARIANT_INFO[machineId] || null, ai: AI_INFO, aiReady: aiReady(), importNote: IMPORT_NOTE[machineId] || "",
    imported: (run.pack && run.pack.thumbImported) || null, history: hist, weights: WEIGHTS,
  };
}

// ---------------------------------------------------------------------------------------------
// Variante qui coche les notes : la machine régénère sa miniature avec les corrections de l'audit
// ---------------------------------------------------------------------------------------------
/**
 * Comment chaque machine régénère sa miniature avec une consigne. `null` = gabarit figé sans
 * point d'entrée pour une consigne (le texte et l'image viennent de règles codées) : l'audit reste
 * un diagnostic, les corrections se font par les réglages de l'onglet.
 */
const VARIANT_INFO = {
  timetravel: { cost: "≈ 0,03 $" }, asmrbeds: { cost: "≈ 0,03 $" }, cosmicfiles: { cost: "≈ 0,03 $" },
  linguistique: { cost: "≈ 0,03 $" }, homemoney: { cost: "≈ 0,03 $" }, prehisto: { cost: "≈ 0,03 $" },
  gildedcage: { cost: "≈ 0,05 $" }, stickman: { cost: "≈ 0,06 $ (gabarit Zelan : GPT Image 2 + relecture)" }, actu: { cost: "≈ 0,05 $" }, clubexplained: { cost: "≈ 0,06 à 0,18 $ (1 à 3 essais GPT Image 2)" }, howmoney: { cost: "≈ 0,10 $" },
  brollvoyage: { cost: "0 $ (texte seul)" }, djcomposer: { cost: "≈ 0,05 $" },
  // 27/09/2026 : la régénération d'après les notes doit exister sur CHAQUE machine
  pulsefc: { cost: "≈ 0 $ (texte réécrit + recomposition)" },
  footballsongs: { cost: "0 $ (les 1-3 mots re-choisis + recomposition)" },
  retroanime: { cost: "≈ 0,03 $ (image clé régénérée d'après l'audit + recomposition)" },
  barrace: { cost: "≈ 0,06 $ (i2i de la miniature de référence) + re-rendu de l'intro (0 $)" },
  mangacards: { cost: "0 $ (bandeau réécrit d'après les notes + recomposition des 4 fiches)" },
  footballphonk: { cost: "≈ 0,03 $ (visuel) + 0,33 $ (boucle) + re-rendu de la vidéo", warn: "Sur cette chaîne l'image de la miniature EST celle de la vidéo : la variante redessine la mascotte dans la scène, ré-anime la boucle et re-rend la vidéo en arrière-plan." },
  musique: { cost: "≈ 0,10 $ + re-rendu de la vidéo", warn: "Sur cette chaîne l'image de la miniature EST celle de la vidéo : la variante régénère le visuel et re-rend la vidéo en arrière-plan." },
};
// Gabarits sans consigne (birthday, evolution3d) : la régénération d'après les notes passe par la retouche IA ci-dessous.

/**
 * ✨ RETOUCHE IA — pour toute machine et toute miniature (y compris importée ou à gabarit figé) : la
 * miniature actuelle est retouchée en i2i par GPT Image 2 via le Miniature Creator (lib/studio.js) avec
 * les corrections de l'audit, puis posée comme nouvelle miniature (l'ancienne reste dans l'historique).
 */
const AI_INFO = { tool: "gpt", cost: "≈ 0,06 $" };
function aiReady() { try { return require("./studio").configured(); } catch { return false; } }

/** Avertissements d'import par machine (l'import lui-même reste possible partout). */
const IMPORT_NOTE = {
  musique: "Sur cette chaîne l'image de la vidéo et la miniature sont normalement identiques : une miniature importée ne changera pas l'image de la vidéo.",
};
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
async function regenWith(machineId, mod, runId, instructions) {
  if (machineId === "brollvoyage") return mod.suggestThumbLines(runId, instructions);
  if (machineId === "djcomposer") {
    // l'adaptation passe par l'étape Miniature du run (asynchrone) : on attend qu'elle se termine
    mod.adaptThumbnail(runId, instructions.slice(0, 500));
    for (let i = 0; i < 200; i++) {
      await sleep(3000);
      const r = mod.getRun(runId);
      if (!String(r.status).endsWith("_running")) {
        if (r.error) throw new Error(r.error);
        // la miniature adaptée attend la validation de l'étape : on la reporte dans le packaging
        if (typeof mod.generateThumbnail === "function" && r.thumbImage) await mod.generateThumbnail(r).catch(() => {});
        return r;
      }
    }
    throw new Error("la régénération de la miniature n'a pas fini en 10 min");
  }
  return mod.regenThumbnail(runId, instructions);
}

/** Consigne de correction tirée de l'audit (les défauts à corriger, dans l'ordre d'impact). */
function instructionsFrom(a) {
  const weak = [];
  if (!a.tv.pass || a.points.tv < WEIGHTS.tv * 0.8) weak.push("TEST TV 50 % : le sujet et le texte doivent se comprendre sur la MOITIÉ HAUTE seule (monte le sujet / le texte dans le haut)");
  if (a.points.curiosity < WEIGHTS.curiosity * 0.7) weak.push("la miniature doit faire se poser UNE question précise et provoquer UNE émotion forte, sans l'aide du titre");
  if (!a.mainCharacter.obvious) weak.push(`UN seul élément principal, évident au 1er regard (${a.mainCharacter.what || "le sujet"}), détaché par la couleur, la taille et la lumière`);
  if (a.clutter.length) weak.push(`ENLÈVE : ${a.clutter.slice(0, 4).join(" ; ")}`);
  if (a.points.small < WEIGHTS.small * 0.7) weak.push("lisible à 210 px : moins d'éléments, plus gros");
  return [
    "Variante qui applique les 6 notes (audit miniature).",
    a.fixes.length ? `Corrections prioritaires : ${a.fixes.join(" | ")}` : "",
    weak.length ? `Défauts à corriger : ${weak.join(" | ")}` : "",
    a.textVariants.length ? `Texte : prends une formulation plus forte, par ex. « ${a.textVariants[0]} » (autres pistes : ${a.textVariants.slice(1).map((v) => `« ${v} »`).join(", ")}), en respectant les règles de longueur de la chaîne.` : "",
  ].filter(Boolean).join("\n");
}


const variantInflight = new Set();

/**
 * Génère une variante corrigée : sauvegarde l'originale, la fait régénérer par la machine avec les
 * corrections de l'audit, puis audite la variante. Renvoie { before, after } (notes /100).
 */
async function variant(machineId, mod, runId) {
  if (!VARIANT_INFO[machineId]) throw new Error("cette machine a un gabarit figé : applique les corrections avec les réglages de l'onglet Miniature");
  const flight = `${machineId}:${runId}`;
  if (variantInflight.has(flight)) throw new Error("une variante est déjà en cours");
  variantInflight.add(flight);
  try {
    let run = mod.getRun(runId);
    if (String(run.status || "").endsWith("_running")) throw new Error("attends la fin de l'étape en cours");
    let g = get(machineId, mod, runId);
    const before = g.fresh ? g.audit : await audit(machineId, mod, runId);
    // Sauvegarde de l'originale (une seule : la 1re, pour pouvoir y revenir après plusieurs variantes)
    const all = load(machineId);
    if (!(all[runId] && all[runId].original)) {
      const full = files.resolveLocal(relOf(run));
      const dir = path.join(path.dirname(full), "thumb-audit");
      fs.mkdirSync(dir, { recursive: true });
      const bak = path.join(dir, `original${path.extname(full) || ".png"}`);
      fs.copyFileSync(full, bak);
      all[runId] = { ...before, original: { rel: path.relative(PROJECT_ROOT, bak).split(path.sep).join("/"), thumbRel: relOf(run), score: before.score, at: new Date().toISOString(), state: thumbState(run) } };
      writeJSON(auditFile(machineId), all);
    }
    history.sync(machineId, mod, runId);
    await regenWith(machineId, mod, runId, instructionsFrom(before));
    history.sync(machineId, mod, runId, { source: "variant", label: "✨ variante d'après l'audit" });
    const after = await audit(machineId, mod, runId);
    return { before: before.score, after: after.score, ...get(machineId, mod, runId) };
  } finally {
    variantInflight.delete(flight);
  }
}

/** Prompt d'édition i2i (anglais, GPT Image 2) tiré de l'audit : on corrige, on ne redessine pas. */
function aiPromptFrom(a, run) {
  const lang = (run.params && run.params.lang) || run.lang || "";
  const text = a.textVariants && a.textVariants[0];
  return [
    "Edit this existing YouTube thumbnail (16:9, 1280x720). KEEP its subject, art style, colors, composition family and brand look — this is a correction pass, not a new image. Any text must stay razor sharp, perfectly spelled, in the same font family and language" + (lang ? ` (${lang})` : "") + ".",
    "Apply these corrections, in order of importance:",
    ...a.fixes.map((f, i) => `${i + 1}. ${f}`),
    !a.tv.pass ? "- TV 50% test: the main subject and the text must be understandable from the TOP HALF alone — move them up." : "",
    !a.mainCharacter.obvious ? `- ONE obvious main character (${a.mainCharacter.what || "the subject"}): make it stand out by contrast, size and light.` : "",
    a.clutter.length ? `- Remove the clutter: ${a.clutter.slice(0, 4).join("; ")}.` : "",
    a.points.small < WEIGHTS.small * 0.7 ? "- Must stay readable at 210 px wide: fewer, bigger elements." : "",
    text && a.currentText && text.toLowerCase() !== a.currentText.toLowerCase() ? `- Replace the text « ${a.currentText} » with « ${text} » (same style, same placement or higher).` : "",
    "No watermark, no border, no extra caption.",
  ].filter(Boolean).join("\n");
}

/**
 * ✨ Retouche IA : audite si besoin, envoie la miniature actuelle en i2i au Miniature Creator (GPT Image 2)
 * avec les corrections, importe le résultat comme miniature du run (≈ 0,06 $ Kie, 0 appel Claude payant),
 * puis audite la nouvelle version. Renvoie { before, after, … }.
 */
async function variantAi(machineId, mod, runId) {
  const studio = require("./studio");
  if (!studio.configured()) throw new Error("clé Kie absente : renseigne-la dans Paramètres (coffre)");
  const flight = `${machineId}:${runId}`;
  if (variantInflight.has(flight)) throw new Error("une variante est déjà en cours");
  variantInflight.add(flight);
  try {
    const run = mod.getRun(runId);
    if (String(run.status || "").endsWith("_running")) throw new Error("attends la fin de l'étape en cours");
    const g = get(machineId, mod, runId);
    if (!g.hasThumb) throw new Error("ce run n'a pas encore de miniature");
    const before = g.fresh ? g.audit : await audit(machineId, mod, runId);
    history.sync(machineId, mod, runId);
    const [job] = await studio.generate({ tool: AI_INFO.tool, count: 1, mode: "i2i", aspect: "16:9", prompt: aiPromptFrom(before, run), sources: [{ rel: relOf(run) }] });
    if (!job) throw new Error("le Miniature Creator n'a pas lancé la retouche");
    let j = job;
    for (let i = 0; i < 160 && j && j.status === "running"; i++) { await sleep(5000); j = studio.publicJobs().find((x) => x.id === job.id) || j; }
    if (!j || j.status !== "done" || !j.resultRel) throw new Error((j && j.error) || "retouche IA non terminée");
    await history.importImage(machineId, mod, runId, { studioRel: j.resultRel, source: "ai", label: "✨ retouche IA d'après l'audit" });
    const after = await audit(machineId, mod, runId);
    return { before: before.score, after: after.score, ...get(machineId, mod, runId) };
  } finally {
    variantInflight.delete(flight);
  }
}

/** Revient à la miniature d'origine (celle d'avant la 1re variante) et oublie la sauvegarde. */
function restoreOriginal(machineId, mod, runId) {
  const all = load(machineId);
  const o = all[runId] && all[runId].original;
  if (!o) throw new Error("pas de miniature d'origine sauvegardée");
  const bak = files.resolveLocal(o.rel);
  if (!bak) throw new Error("sauvegarde de l'originale introuvable");
  const f = runFile(machineId, runId);
  if (!f) throw new Error("fichier du run introuvable");
  const run = JSON.parse(fs.readFileSync(f, "utf8"));
  // on réécrit l'image sur le chemin d'origine (les machines à versions ont changé de fichier)
  const dest = path.join(PROJECT_ROOT, o.thumbRel);
  fs.copyFileSync(bak, dest);
  if (o.state) {
    for (const k of Object.keys(run)) if (/^thumb/i.test(k)) delete run[k];
    Object.assign(run, o.state.run);
    if (run.pack) for (const k of Object.keys(run.pack)) if (/^thumb/i.test(k)) delete run.pack[k];
    if (run.pack) Object.assign(run.pack, o.state.pack);
  }
  if (run.pack) run.pack.thumbTs = Date.now(); // nouveau cache-buster : l'image a changé sur le même chemin
  fs.writeFileSync(f, JSON.stringify(run, null, 2));
  delete all[runId].original;
  writeJSON(auditFile(machineId), all);
  return get(machineId, mod, runId);
}

/** Actions d'historique / d'import exposées par les routes partagées (renvoient l'état complet). */
async function restoreVersion(machineId, mod, runId, versionId) { await history.restore(machineId, mod, runId, versionId); return get(machineId, mod, runId); }
async function importThumb(machineId, mod, runId, body) { await history.importImage(machineId, mod, runId, body || {}); return get(machineId, mod, runId); }
function removeVersion(machineId, mod, runId, versionId) { history.remove(machineId, mod, runId, versionId); return get(machineId, mod, runId); }

module.exports = { brief, audit, get, variant, variantAi, restoreOriginal, restoreVersion, importThumb, removeVersion, instructionsFrom, aiPromptFrom, langOf, WEIGHTS, normalize, VARIANT_INFO, AI_INFO };
