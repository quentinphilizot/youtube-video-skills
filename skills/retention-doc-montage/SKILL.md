---
name: retention-doc-montage
description: Règles de rétention et de montage pour documentaires voix off + b-roll (machine B-Roll Voyage et similaires) — hook méthode CLAC, re-hook aux transitions, leçon tirée de chaque segment, ponts narratifs fluides entre lieux, temps cinématographique, son avant image. À utiliser dès qu'on écrit ou améliore un script de documentaire, un hook, des transitions entre segments, ou qu'on diagnostique une chute de rétention entre deux parties d'une vidéo.
---

# Rétention & montage documentaire — hook CLAC, transitions-leçons, temps cinématographique

Distillé de deux sources (transcripts scrapés le 2 sept. 2026, banque Agent OS) :
- **« Comment maîtriser l'art du HOOK »** (Kael Cruz, youtu.be/5KD-cedl4A8 — même créateur que les 4 verrous de `storytelling-hooks`) — psychologie de l'attention, méthode CLAC, frameworks de hooks, re-hook.
- **« La Méthode de Montage qui rend Tout CINÉMATOGRAPHIQUE »** (chaîne « Secrets de monteur pro », youtu.be/2WXvm1kOq0Y) — radio editing, temps cinématographique, plans de coupe, son avant image.

Appliqué en premier à la machine **B-Roll Voyage** (`agent-os/lib/machines/brollvoyage.js`) — mais valable pour toute machine documentaire voix off + visuels.

## 1. Le hook (scène 1) — méthode CLAC

> Un hook n'est pas une introduction, c'est une **interruption**. Il ne présente pas le sujet : il crée un choc cognitif (« Attends, quoi ? ») puis ouvre une boucle que le cerveau a besoin de refermer.

Structure obligatoire, dans cet ordre :

| Étape | Rôle | Exemple (documentaire lieux) |
|---|---|---|
| **C — Contexte** | Le territoire mental en 1 phrase COURTE (≤ 3 s) | « Sous les champs d'Égypte dorment des villes entières. » |
| **L — Lean-in** | Le spectateur se dit « ça me concerne » : image mentale forte, fascination ou douleur universelle | « Des capitales plus vastes que Paris — effacées si complètement qu'on labourait dessus. » |
| **A — Arrêt** | La rupture : « Mais… », « Pourtant… », « Sauf que… » — contredire la croyance commune | « Pourtant, ce ne sont pas les archéologues qui les ont retrouvées. » |
| **C — Contre-direction** | L'angle inattendu MAIS crédible de CETTE vidéo | « Ce sont des satellites, à 700 km d'altitude — et ce qu'ils ont vu dérange. » |
| **+ Boucle ouverte** | Teaser du segment le plus extrême, JAMAIS nommé, gardé pour la fin | « L'une de ces villes n'aurait jamais dû exister. Nous la garderons pour la fin. » |

Règles d'écriture du hook :
- **Phrases courtes, denses** : au début, chaque mot coûte cher. Zéro préambule (« dans cette vidéo nous allons… » = mort).
- **Clair sur le sujet, incomplet sur la réponse** — trop flou, on ne comprend pas ; trop complet, plus besoin de rester.
- **Promesse émotionnelle**, pas seulement informative : le vertige, la curiosité, « l'information que les autres n'ont pas ».
- **Récompense précoce** : un premier fait vertigineux (chiffre, révélation) dans la PREMIÈRE minute — le spectateur doit sentir qu'il a « déjà gagné quelque chose ». La rétention = une succession de récompenses, pas une seule accroche.

### 5 frameworks de mini-hooks (réutilisables PARTOUT dans la vidéo)
1. **Croyance retournée** : « Tu crois que X, mais le vrai problème c'est Y. »
2. **Coût caché** : « Le vrai [prix/danger] de X, ce n'est pas [conséquence évidente], c'est [conséquence cachée]. »
3. **Erreur intelligente** : « Même les [experts] se trompent ici — et c'est exactement pour ça que… »
4. **Phrase impossible à ignorer** : déclaration forte + « et une fois que tu as compris ça, [conséquence] ».
5. **Démonstration** : prouver immédiatement au lieu d'annoncer.

## 2. Les transitions entre segments — JAMAIS de coupure sèche

C'est là que les documentaires perdent leur audience : fin d'un lieu → enchaînement immédiat sur le suivant = le spectateur sent une « fin » et décroche. La règle :

**Chaque segment se FERME par une LEÇON, chaque segment suivant s'OUVRE par un PONT qui re-hooke.**

1. **La leçon** (1-2 phrases, fin de segment) : une vérité UNIVERSELLE tirée de ce lieu précis — pas un résumé, une élévation. Ex : « Tanis ne s'est pas perdue parce qu'on l'a oubliée. Elle s'est perdue parce qu'un fleuve a changé d'avis. » C'est la respiration, le moment suspendu.
2. **Le pont** (2-3 phrases, début du segment suivant) : relie la leçon au nouveau lieu ET rouvre une boucle de curiosité — un mini-hook par transition. Ex : « Un fleuve peut effacer une capitale. Mais à huit mille kilomètres de là, c'est l'inverse qui s'est produit : une ville que la jungle a protégée si bien que personne ne pouvait plus la trouver. »
3. Le pont utilise un des 5 frameworks (coût caché et croyance retournée marchent le mieux en documentaire).
4. **Re-hooker constamment** : dans une vidéo de 10+ minutes, on ne hooke pas une fois — chaque transition est un mini-hook, chaque segment contient une phrase impossible à ignorer.

## 3. Le temps cinématographique (montage)

- **Le son d'abord, l'image ensuite** (« radio editing ») : la narration doit fonctionner SEULE, les yeux fermés. Si le script ne captive pas en audio pur, aucun b-roll ne le sauvera. Tester chaque script en écoute aveugle.
- **Espacer, respirer** : le temps du film n'est pas le temps réel. Les silences et respirations autour des phrases-clés (leçons, chiffres choc) créent l'émotion — écrire des phrases courtes suivies de pauses plutôt qu'un flux continu.
- **Plans de coupe** : les respirations de la narration sont remplies par des plans de coupe contemplatifs (détail, regard, geste, matière) — dans B-Roll Voyage : les gros plans « échelle 3 » (détail-matière) servent exactement à ça.
- **Liberté de montage** : ne jamais être esclave de l'ordre du rush/du script — réordonner tant qu'on ne déforme pas les faits.
- **Look film** : étalonnage contrasté + grain léger + noirs légèrement relevés (options `montageFx` de la machine) ; ralentis sur les plans de coupe si la source le permet.

## 4. Le hook visuel (miniature, texte à l'écran, 1re image)

- **Texte à l'écran = 3 à 6 mots** qui CONDENSENT l'idée, jamais qui répètent la voix off (les callouts de la machine suivent cette règle).
- La **première image** doit annoncer le sujet avant le premier mot — pour un doc « cités perdues » : une ruine vue du ciel, pas un paysage générique.
- Mouvement dosé : trop fatigue, pas assez ennuie.

## 5. Application concrète à B-Roll Voyage (encodée dans `coreRules`)

- Hook scène 1 = structure CLAC complète + boucle ouverte sur le lieu final (~90-120 mots).
- Chaque segment lieu : pont (2-3 phrases) → accroche sensorielle → mini-hook interne → faits chiffrés développés + vie quotidienne → **leçon du lieu** (~110-160 mots ≈ 50-70 s : deux fois plus riche que la v1).
- Fondu enchaîné visuel rallongé (0,8 s) entre segments — la transition douce s'entend ET se voit.
- Le zoom progressif (large → humain → détail) fournit les plans de coupe des respirations.
- L'outro reboucle sur la promesse du hook (fermer la boucle ouverte) avant la remise en perspective.

## Diagnostic express d'une chute de rétention entre deux segments
1. Le segment précédent finit-il par une leçon (élévation) ou par un simple fait ? → sans leçon, ça sent la « fin ».
2. Le segment suivant s'ouvre-t-il par un pont qui rouvre une boucle ? → sans pont, c'est une coupure sèche.
3. Y a-t-il eu une récompense (fait vertigineux) dans les 60 s précédentes ? → sinon, la confiance expire.
4. La transition visuelle est-elle un cut sec ? → fondu enchaîné + plan de coupe contemplatif.

## Liens
- **youtube-playbook** — tout le savoir issu des vidéos-skills, par étape ; **mrbeast-method** — relances à mi-parcours et payoff final (vidéos ≥ 10 min).
