"use strict";
/**
 * LES 4 VERROUS D'UN HOOK — module commun à toutes les machines (skill storytelling-hooks).
 *
 * Source : Kael Cruz, « Donne moi 15 mins, et je vais rendre tes HOOK impossible à scroll »
 * (youtu.be/0mA5Q6dt4Rg), adoptée par l'utilisateur le 22/09/2026 pour CHAQUE machine et CHAQUE run.
 * Un hook ne capte pas l'attention : il rend la décision de rester évidente. Le spectateur décide en
 * < 3 s et a besoin de deux choses : COMPRENDRE de quoi on parle, se sentir CONCERNÉ. Quatre verrous :
 *   1. TEMPS  — le sujet est dans la 1re phrase (pas d'ambiance, pas d'annonce, pas de suspense vide).
 *   2. SENS   — mots de tous les jours, phrases courtes, voix active, UNE seule interprétation.
 *   3. MIROIR — on parle au spectateur (« you » / « tu / vous »), d'un besoin ou d'une douleur qu'il a déjà.
 *   4. ÉCART  — la 2e phrase oppose ce qu'il CROIT à ce que la vidéo MONTRE (écart affiché ou implicite).
 * Architecture : phrase 1 = clarté, phrase 2 = écart.
 *
 * Usage : `brief(lang)` s'ajoute aux consignes du script/hook envoyées à Claude ; `lockFlags(text, opts)`
 * renvoie les verrous restés fermés (liste vide = hook conforme) ; `split(text)` isole les 2 premières phrases.
 */

const RX = {
  en: {
    mirror: /\b(you|your|you're|yours|yourself)\b/i,
    gap: /\b(but|yet|not|isn'?t|wasn'?t|aren'?t|weren'?t|didn'?t|doesn'?t|don'?t|never|only|actually|instead|really|nobody|no one|wrong|myth|truth|secret|except|while|although|though)\b/i,
    label: /^(here (are|is)|this is|the (evolution|history|story) of|welcome|in this video|today (we|i)|let'?s (talk|look|dive)|have you ever wondered|imagine|picture this|what if i told you)/i,
  },
  fr: {
    mirror: /\b(tu|toi|ton|ta|tes|t'|vous|votre|vos)\b/i,
    // « pas » ou « que » seuls laissaient passer presque tout : on exige un vrai marqueur d'opposition
    // ou une négation complète (ne … pas / que / jamais / plus)
    gap: /\b(mais|pourtant|jamais|seulement|en fait|en réalité|alors que|sauf|faux|mythe|vérité|secret|personne|aucun|contrairement|plutôt)\b|\bn(?:e\s+|')\S+\s+(?:pas|que|jamais|plus)\b/i,
    label: /^(voici|aujourd'hui (on|je|nous)|dans cette vidéo|bienvenue|on va (parler|voir)|vous êtes-vous déjà demandé|imagine[zs]?|et si je vous disais)/i,
  },
};
const langOf = (lang) => (/^fr|fran/i.test(String(lang || "")) ? "fr" : "en");
const words = (s) => String(s || "").trim().split(/\s+/).filter(Boolean);

/** Les deux premières phrases d'un texte (le hook d'une voix off). */
function split(text) {
  const parts = String(text || "").replace(/\s+/g, " ").trim().match(/[^.!?…]+[.!?…]*/g) || [];
  return { first: (parts[0] || "").trim(), second: (parts[1] || "").trim() };
}

/**
 * Verrous restés fermés. `text` = le hook entier (voix off) OU passer `first` / `second` explicitement
 * (hook à l'écran en deux lignes). `subject` (optionnel) : mots qui nomment le sujet (verrou TEMPS).
 * `maxWords` : longueur max de la 1re phrase (verrou SENS).
 */
function lockFlags(text, { first, second, subject = "", lang = "en", maxWords = 20 } = {}) {
  const L = RX[langOf(lang)];
  const s = first !== undefined ? { first: String(first || ""), second: String(second || "") } : split(text);
  const flags = [];
  if (!s.first) return ["hook vide"];
  const subj = String(subject || "").toLowerCase().split(/[\s,/|]+/).filter((w) => w.length > 2);
  if (subj.length && !subj.some((w) => s.first.toLowerCase().includes(w))) flags.push("TEMPS : le sujet n'est pas dans la 1re phrase");
  if (L.label.test(s.first.trim())) flags.push("TEMPS : ouverture « annonce / ambiance » au lieu du sujet");
  if (words(s.first).length > maxWords) flags.push(`SENS : 1re phrase > ${maxWords} mots`);
  if (!L.mirror.test(`${s.first} ${s.second}`)) flags.push(langOf(lang) === "fr" ? "MIROIR : pas de « tu / vous »" : "MIROIR : pas de « you / your »");
  if (!s.second || !L.gap.test(s.second)) flags.push("ÉCART : la 2e phrase n'oppose pas ce qu'on croit à ce qu'on montre");
  return flags;
}

/** Consigne à ajouter au prompt du script/hook (en anglais : les prompts de la maison le sont souvent). */
function brief(lang = "en", { onScreen = false } = {}) {
  const fr = langOf(lang) === "fr";
  return [
    `HOOK — THE 4 LOCKS (mandatory). A hook does not grab attention, it makes the decision to stay OBVIOUS: in < 3 s the viewer must UNDERSTAND what it is about and feel CONCERNED.${onScreen ? " The video is watched muted: the hook is on-screen text." : ""}`,
    "1. TIME — the SUBJECT is in the very first sentence. No mood-setting, no intro, no empty suspense (\"you won't believe what happened\"). If the subject arrives in sentence 3, delete sentences 1-2.",
    "2. MEANING — everyday words, short sentences, active voice, ONE possible interpretation. Isolation test: read the hook alone — if it can be misunderstood, rewrite it.",
    `3. MIRROR — talk TO the viewer (${fr ? "« tu » ou « vous »" : "\"you\" / \"your\""}) about a need or a pain they ALREADY have, not trivia they might find nice to know. Never open on \"I\" / \"my story\".`,
    "4. GAP — the SECOND sentence opposes what the viewer BELIEVES to what the video SHOWS (displayed gap: \"Everyone does X. The best do the opposite.\" — or implicit gap: only the surprising alternative). No gap = an announcement, not a hook.",
    "Architecture: sentence 1 = clarity (subject + concrete fact/number), sentence 2 = the gap. Before writing, answer: what does the viewer believe before clicking, and what does this video show that is different?",
  ].join("\n");
}

module.exports = { lockFlags, brief, split, langOf };
