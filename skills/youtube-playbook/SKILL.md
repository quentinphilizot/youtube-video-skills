---
name: youtube-playbook
description: Le savoir YouTube tiré des vidéos-skills (MrBeast via Aprilynne Alter, cours complet d'Aprilynne Alter et 7 experts, intro et miniatures d'Aprilynne Alter, hooks de Kael Cruz, montage cinématographique) regroupé et structuré par étape de la vie d'une vidéo — idée → packaging (titre, miniature) → hook et intro → rétention et montage → mesure → progression. Donne pour chaque étape les règles retenues, leur source, le skill ou le module de code qui les porte, et les contradictions déjà tranchées. À utiliser en PREMIER dès qu'on conçoit, critique ou améliore une vidéo, une machine ou une chaîne, pour savoir quelle règle s'applique et quel skill détaillé ouvrir ; et à mettre à jour à chaque nouvelle vidéo transformée en skill.
---

# YouTube Playbook — le savoir des vidéos-skills, structuré

Ce skill est l'**index et la synthèse** : il ne répète pas le détail des skills sources, il dit **quelle règle
vaut à quelle étape**, d'où elle vient, où elle est codée, et comment trancher quand deux sources divergent.
Le détail reste dans le skill source (colonne « Où »).

## Les sources (registre)

| Code | Vidéo | Créateur | Adoptée | Porté par |
|---|---|---|---|---|
| **FC** | « How to START & GROW a YouTube Channel | FULL COURSE » — youtu.be/SXN9SMLWLzw (2:39:44) | Aprilynne Alter + Paddy Galloway, Jake Thomas, George Blackman, Chris Galletta, Rene Ritchie (YouTube), Justin Moore | 01/10/2026 | skill `youtube-growth-course`, `lib/playbook.js` (brief, `titleFlags`, `ctaFlags`, `flopDoctor`), `lib/thumbnotes.js` (types, 3 tests, audit `kind` / `glance`) |
| **MB** | « I Watched Every MrBeast Interview » — youtu.be/5wvmDSMH9AM (27:07) | Aprilynne Alter (compile MrBeast) | 01/10/2026 | skill `mrbeast-method` |
| **AI** | « how to make a killer youtube intro » — youtu.be/TOHQXdCAo5k (11:32) | Aprilynne Alter | 27/09/2026 | skill `youtube-intro` |
| **AT** | « give me 9 minutes, I'll make your thumbnails 81% better » — youtu.be/KE4zqD0ONDI (9:55) + antisèche « Thumbnail Notes Cheat Sheet » | Aprilynne Alter | 27/09/2026 | `agent-os/lib/thumbnotes.js` (brief + audit vision), `lib/thumbhistory.js` |
| **K1** | « Comment maîtriser l'art du HOOK » — youtu.be/5KD-cedl4A8 (15:25) | Kael Cruz | 02/09/2026 | skill `retention-doc-montage` (méthode CLAC) |
| **K2** | « Donne moi 15 mins, et je vais rendre tes HOOK impossible à scroll » — youtu.be/0mA5Q6dt4Rg (15:06) | Kael Cruz | 22/09/2026 | skill `storytelling-hooks` (4 verrous), `agent-os/lib/hooklocks.js` |
| **SM** | « La Méthode de Montage qui rend Tout CINÉMATOGRAPHIQUE » — youtu.be/2WXvm1kOq0Y (8:28) | Secrets de monteur pro | 02/09/2026 | skill `retention-doc-montage` |

**Dans le code** : `agent-os/lib/playbook.js` (MB + AI + K1 + FC non couverts ailleurs : `brief("idea"|"title"|"script"|"music")`, `titleFlags`, `openingFlags`, `relaunchPoints`), branché sur toutes les machines le 01/10/2026 ; `lib/hooklocks.js` (K2) ; `lib/thumbnotes.js` (AT + règles miniature MB).

Hors registre (pas des vidéos) : `storytelling-hooks` (6 leviers), `titles-and-thumbnails`, `long-form-youtube`,
`retention-audit`, `channel-formula` = méthodes génériques ; `claude-youtube` = skill tiers (benchmarks chiffrés).

## La loi unique (MB)

YouTube veut que les gens **cliquent** et **regardent** (puis continuent). « Algorithme = audience. » Chaque
étape ci-dessous sert l'un de ces deux verbes ; une règle qui ne sert ni le clic ni le visionnage est du bruit.

---

## Étape 1 — L'idée

| Règle | Source | Où |
|---|---|---|
| Une idée doit être **originale, intéressante pour l'audience de la chaîne, extrême** | MB | `mrbeast-method` §1 |
| Nourrir un **régime d'information** (apprendre volontairement) sinon les idées se répètent | MB | `mrbeast-method` §1 |
| Décider sur **données** (gagnants vs flops de la niche), pas à l'intuition | MB §6 + méthode | `channel-formula`, Banque de Niches, vérificateurs 🔎 |
| **Pas de bonne miniature imaginable = on tue l'idée** (70 % des pitchs de MrBeast) | MB | `mrbeast-method` §2 |
| **Valider** : preuve de succès antérieur + **outliers** (5-10 × la moyenne de leur chaîne) | FC | `youtube-growth-course` §2, `brief("idea")` |
| **Remarquable = différent** plutôt que meilleur (le « burgerito ») ; 6 critères dont **≥ 80 % de l'audience** et **packageable** | FC | `youtube-growth-course` §2 |
| Stratégie = **1-3 formats-piliers** tirés des outliers (4-5 pour viser le million) ; 2-3 vidéos/sem. jusqu'à 30-40, puis 1/sem. | FC | `youtube-growth-course` §1 |

## Étape 2 — Le packaging (AVANT toute production)

**Ordre imposé (MB + AI) :** titre et miniature finalisés → seulement à ~90 % sûr du clic, on construit la
vidéo → puis les 5 premières secondes → puis les 30 premières. Machines : packaging validé avant les étapes
payantes, miniature produite avant le montage (l'intro la réutilise).

### Titre
- **< 50 caractères** (troncature « … » sur certains appareils) — MB.
- **Si on le lit, on est obligé de regarder** : opinion forte, enjeu extrême, « what the… » — MB.
- **Cohérent avec la durée** (un titre « 5 secondes » sur une vidéo de 20 min fait chuter le CTR) — MB.
- Sujet dès le début, une seule idée, un chiffre réel quand il existe — `titles-and-thumbnails`, K2 (verrou TEMPS).
- **Curiosité (reine), peur ou désir** ; **affirmation forte > question** ; boucle ouverte ou **contraste** ; **pas de MAJUSCULES** (un mot d'emphase) ; modèle 10 chaînes adjacentes ; plusieurs titres par idée — FC (`titleFlags` signale MAJUSCULES et question hors formule validée).

### Miniature — les 6 notes (AT) + les règles MrBeast (MB)
1. **Partir du spectateur** : quelle QUESTION doit-il se poser, quelle ÉMOTION ressentir ? Elle doit donner
   envie **sans le titre** — AT (MB : « provoquer une émotion »).
2. **Test TV des 50 %** : la moitié HAUTE seule dit le sujet et donne envie — AT.
3. **Un personnage principal évident** (couleur, taille, lumière) — AT.
4. **Zéro superflu** ; **chaque élément distinct et justifié**, rien ne se fond dans le reste — AT + MB.
5. **Références** : transposer le MÉCANISME (question, émotion, comment), pas la surface — AT.
6. **A/B du texte** : plusieurs formulations, « Tester et comparer » de YouTube Studio — AT.
- **Lumineuse** plutôt que sombre ; **comprise en un coup d'œil** — MB.
- **Test des 210 px** (taille réelle dans le fil), ≤ 4 chiffres, titre d'un mot — règle maison.
- Jamais une image brute de la vidéo ; un gabarit par chaîne, l'utilisateur ne règle que la taille — règles maison.
- **5 types** (moment, histoire, résultat, transformation, nouveauté) + un **scroll stopper** ; **3 tests** : netteté (plus petite taille), contraste (parmi la niche), **coup d'œil** (2 s sur téléphone) ; texte qui n'ajoute que du nouveau — FC.
- Code : `thumbnotes.brief()` dans tout prompt qui conçoit une miniature, `thumbnotes.audit()` (note /100,
  3 corrections, 3 variantes de texte) dans l'onglet Miniature de chaque machine.

## Étape 3 — Le hook et l'intro (0-30 s)

**Enjeu (MB) :** ~30 % des spectateurs partent dans les 30 premières secondes ; en perdre 15 % au lieu de 35 %
= 15 % de public en plus sur toute la vidéo. Avec l'autoplay, les 5 premières secondes pilotent aussi le CTR.

| Règle | Source | Où |
|---|---|---|
| **5 premières s = la miniature** (1er plan) et **1re phrase = le titre** | MB + AI | `youtube-intro` étape 1 |
| **Confirmer l'attente en < 5 s, puis la DÉPASSER** ; zéro mot perdu | MB + AI | `youtube-intro`, `mrbeast-method` §3 |
| Les **4 verrous** de toute 1re phrase : TEMPS (sujet en ligne 1), SENS (mots simples, une interprétation), MIROIR (« tu », un besoin réel), ÉCART (ce qu'il croit vs ce qu'on montre) | K2 | `storytelling-hooks`, `lib/hooklocks.js` (`brief`, `lockFlags`, ≤ 2 réécritures) |
| Hook documentaire voix off : **CLAC** (Contexte → Lean-in → Arrêt « mais… » → Contre-direction) + boucle ouverte | K1 | `retention-doc-montage` §1 |
| **Boucle(s) ouverte(s)** — UNE grande dans l'intro, rappelée à mi-vidéo, toujours refermée | AI + K1 | `youtube-intro` étape 2 |
| **Biais d'effort** : montrer tôt l'effort réel, **compté** jamais inventé | AI | `youtube-intro` étape 4 |
| **Montrer, pas dire** : lisible sans le son (autoplay muet), texte à l'écran dès les 5 s | AI + MB | `youtube-intro` étape 5 |
| **Un nouveau plan toutes les ~1,5 s** dans l'intro ; lumineux ; le plus de coupes possible | AI + MB | `youtube-intro` étape 5 |
| Une idée par temps de ~3 s, **dite ET écrite en même temps** ; ≤ 4 messages ; la voix ne dit pas les chiffres | retour utilisateur 27/09 | `youtube-intro` (NUMBER LINEUP, Data Ranking) |
| Récompense précoce : un fait vertigineux dans la 1re minute | K1 | `retention-doc-montage` §1 |

## Étape 4 — La rétention et le montage (30 s → fin)

| Règle | Source | Où |
|---|---|---|
| **Supprimer chaque moment mou** ; faire critiquer par les 10 personnes les plus exigeantes | MB | `mrbeast-method` §4 |
| **Payoff final** : la meilleure révélation est gardée pour la fin | MB + AI | « ANSWER AT THE END », `LoopReminder` 50/80 %, star en dernier (Pulse FC) |
| Vidéo ≥ 10 min : **intrigues secondaires / relances planifiées** à mi-parcours | MB | relance au point de creux (Pulse FC), CTA de milieu |
| **Transitions : leçon en fin de segment + pont qui re-hooke** — jamais de coupure sèche | K1 | `retention-doc-montage` §2 |
| **Segment = promesse → tension → payoff** ; la réponse n'arrive jamais trop tôt ; **aucun trou** entre un payoff et la promesse suivante (2e zone de décrochage après le hook) | FC | `youtube-growth-course` §6, `brief("script")` §7 |
| **Un seul geste** par appel à l'action ; **fin = une vidéo suivante précise** | FC (Rene Ritchie) | `brief("script")` §8, `ctaFlags` |
| Musique posée **avant** le montage visuel ; le plus beau montage dans l'intro | FC | `youtube-growth-course` §7 |
| Re-hooker à chaque transition (5 frameworks de mini-hooks) | K1 | `retention-doc-montage` §1 |
| **Le son d'abord** (« radio editing ») : la narration tient seule, les yeux fermés | SM | `retention-doc-montage` §3 |
| **Respirations** autour des phrases-clés, plans de coupe contemplatifs, liberté d'ordre de montage | SM | `retention-doc-montage` §3 |
| Pas plus de ~3 s sur un même plan face caméra (caméras B/C) | MB | `mrbeast-method` §4 |
| L'effort se met à l'avant : plus on a regardé, plus on reste | MB | `mrbeast-method` §4 |
| Texte à l'écran = 3-6 mots qui condensent, jamais la voix répétée | K1 | `retention-doc-montage` §4 |
| Image fixe : **jamais de zoom** ; mouvement par annotations, découpage progressif, 0,5 s avant / 1 s après la voix | règles maison | `lib/annotate.js`, CLAUDE.md |

## Étape 5 — La mesure

- Trois questions seulement : **cliquent-ils ? regardent-ils jusqu'au bout ? continuent-ils ?** — MB.
- **70 % de durée vue = le cap de MrBeast** sur ses formats ; chaque chaîne garde la barre MESURÉE de sa niche
  (ex. test Pulse Arena : ≥ 40 % de durée vue à 14 j) — MB + règles maison.
- Recouper les vues déclarées avec les vues validées avant toute analyse — règle maison.
- Diagnostic **satisfaction → durée vue → clic** (le CTR, bruité, en dernier) ; rien avant la courbe de rétention ; plateaux / bosses de chapitres / chutes de fin de segment — FC (`flopDoctor`).
- **Flop** à bonne rétention = repackager : A/B miniature J0, titre J+2-3, 1 changement/semaine, jamais supprimer — FC.
- Lire où l'intro et les transitions perdent les gens : `retention-audit` ; diagnostic express entre deux
  segments : `retention-doc-montage` (fin).

## Étape 6 — La progression

- **« 100 vidéos, améliore UNE chose à chaque fois »** (script, montage, voix, miniature, titre, rythme…) — MB.
- **Qualité > quantité** pour une petite chaîne : mieux vaut 1/3 des vidéos si elles sont assez bonnes pour que
  l'algorithme soit obligé de les pousser ; ne jamais publier sous la barre pour tenir un calendrier — MB.
- **Étudier à plusieurs, en données** (corrélations miniatures ↔ vues, fréquence des coupes des vidéos à 10 M+) — MB.
- Pratique Agent OS : après chaque vidéo publiée, noter UNE amélioration pour le run suivant (journal
  `machine-factory/references/machines-log.md`, run de référence de la machine).

---

## Contradictions tranchées

| Sujet | Sources en tension | Règle retenue |
|---|---|---|
| Longueur du titre | `titles-and-thumbnails` (≤ ~60, 40 visibles) vs MB (< 50) | **< 50 caractères**, mot-clé en tête |
| Rythme des plans | MB (coupe à ~3 s face caméra) vs AI (1,5 s dans l'intro) | **1,5 s dans l'intro**, ~3 s max ensuite ; jamais un nouveau TEXTE toutes les 1,5 s |
| « Plus de mouvement » vs « jamais de zoom » | MB (coupes, angles) vs règle maison | Le mouvement vient des coupes, annotations, découpage progressif, travelling Remotion doux sur photo — jamais `zoompan` sur schéma à libellés |
| Nombre de boucles | K1 / AI (« une ou plusieurs ») vs retour utilisateur 27/09 | **Une seule** boucle dans l'intro ; les autres questions vont à mi-vidéo |
| Cadence | MB (qualité > quantité) vs cadences machines (1/jour Birthday, 3/sem. NUMBER LINEUP) | La cadence est un objectif, pas une obligation : le **stock** absorbe les retards, jamais la qualité |
| Rétention cible | MB (70 %) vs niches documentaires longues | 70 % = cap ; la barre de décision est celle mesurée sur la chaîne |
| Question dans le titre | FC (affirmation > question) vs formules validées qui finissent par « ? » (Pulse FC « Where Are They Now? ») | La formule validée garde sa question ; ailleurs, affirmation. `titleFlags` ne signale la question que hors formule |
| Appels à l'action | FC (un seul geste, fin = vidéo suivante) vs 3 CTA de fidélisation (24/09) | Les 3 CTA restent, **chacun un seul geste** ; le dernier = la vidéo suivante (écran de fin, série, équipe suivante) |
| Texte de miniature | FC (≤ 5 mots) vs règle maison (≤ 4 mots, titre d'un mot) | **≤ 4 mots** (la plus stricte) |
| Cadence | FC (2-3/sem. jusqu'à 30-40 vidéos) vs MB (qualité > quantité) | Volume au démarrage d'une chaîne neuve tant que la qualité tient la barre ; le stock absorbe |
| Miniature chargée vs gabarit figé | AT (zéro superflu) vs gabarit GAS STATION (6 grappes) | Tension ouverte : le gabarit validé par l'utilisateur prime ; l'audit le signale, on ne le casse pas sans accord |

## Checklist transversale (une vidéo, toutes étapes)

- [ ] Idée originale / intéressante pour CETTE audience / extrême — et une miniature évidente existe ; preuve de succès + outliers
- [ ] Titre < 50 car., fort, cohérent avec la durée ; miniature = 6 notes + 210 px + lumineuse
- [ ] Packaging validé AVANT toute dépense
- [ ] 1er plan = miniature, 1re phrase = titre et passe les 4 verrous ; attente confirmée < 5 s puis dépassée
- [ ] Une boucle ouverte, rappelée à mi-vidéo, refermée à la fin (payoff)
- [ ] Effort réel compté, montré tôt ; lisible sans le son ; un plan / 1,5 s dans l'intro
- [ ] Aucun moment mou ; promesse → tension → payoff, leçon + pont à chaque transition ; relance à mi-parcours si ≥ 10 min
- [ ] Un seul geste par CTA ; la fin envoie vers une vidéo précise
- [ ] Après publication : clic / visionnage / suite mesurés, UNE amélioration notée pour la suivante

## Ajouter une nouvelle vidéo-skill (procédure)

1. Transcription : `yt-dlp --skip-download --write-auto-subs --sub-langs "en-orig,fr" --sub-format vtt <url>`
   (yt-dlp depuis la branche master), puis ne garder que les lignes à balises `<c>` du VTT (le reste est dupliqué).
2. Créer le skill détaillé (règles + horodatages + checklist + « Application à Agent OS » : ce qui existe déjà
   dans le code, ce que ça change) — ou enrichir le skill existant de la même étape.
3. **Mettre à jour CE skill** : une ligne au registre, les règles dans l'étape concernée avec leur code source,
   et toute contradiction avec une règle existante dans le tableau « Contradictions tranchées ».
4. Si l'utilisateur adopte la règle pour toutes les machines : module commun dans `agent-os/lib/` (modèle :
   `hooklocks.js`, `thumbnotes.js`) + règle dans `docs/regles-de-travail-claude.md`.
