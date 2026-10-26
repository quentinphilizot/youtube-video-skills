# YouTube video-skills

Sept vidéos YouTube de référence (hooks, intro, miniatures, montage, méthode MrBeast, cours complet) transformées en **skills Claude Code** et en **modules de code** prêts à brancher dans une agentique de production vidéo.

## Contenu

| Dossier | Contenu |
|---|---|
| `skills/` | 7 skills Claude Code. `youtube-playbook` est l'index : il classe toutes les règles par étape (idée → packaging → hook → rétention → mesure → progression) et tranche les contradictions. |
| `modules/` | `hooklocks.js` (4 verrous du hook), `playbook.js` (idée, titre, intro, script, CTA, flops), `thumbnotes.js` (6 notes de la miniature). |
| `exemples/` | `machines-playbook.test.js` : le test qui fait échouer `npm test` si une machine ne branche pas le playbook. |
| `docs/` | **Guide d'intégration** (Word) et **registre des vidéos sources** (Word). |

## Les vidéos sources

| Code | Vidéo | Créateur | Skill / module |
|---|---|---|---|
| K1 | [Comment maîtriser l'art du HOOK](https://youtu.be/5KD-cedl4A8) | Kael Cruz | `retention-doc-montage` |
| SM | [La Méthode de Montage qui rend Tout CINÉMATOGRAPHIQUE](https://youtu.be/2WXvm1kOq0Y) | Secrets de monteur pro | `retention-doc-montage` |
| K2 | [Donne moi 15 mins, et je vais rendre tes HOOK impossible à scroll](https://youtu.be/0mA5Q6dt4Rg) | Kael Cruz | `storytelling-hooks`, `hooklocks.js` |
| AI | [how to make a killer youtube intro](https://youtu.be/TOHQXdCAo5k) | Aprilynne Alter | `youtube-intro` |
| AT | [give me 9 minutes, I'll make your thumbnails 81% better](https://youtu.be/KE4zqD0ONDI) | Aprilynne Alter | `titles-and-thumbnails`, `thumbnotes.js` |
| MB | [I Watched Every MrBeast Interview](https://youtu.be/5wvmDSMH9AM) | Aprilynne Alter | `mrbeast-method` |
| FC | [How to START & GROW a YouTube Channel \| FULL COURSE](https://youtu.be/SXN9SMLWLzw) | Aprilynne Alter + 7 experts | `youtube-growth-course`, `playbook.js` |

## Démarrage rapide

```bash
git clone https://github.com/quentinphilizot/youtube-video-skills.git
cp -r youtube-video-skills/skills/* mon-projet/.claude/skills/      # un projet
# ou : cp -r youtube-video-skills/skills/* ~/.claude/skills/        # tous les projets
```

Puis, dans le code d'une machine :

```js
const hooklocks = require("./modules/hooklocks");
const playbook = require("./modules/playbook");

const prompt = [base, playbook.brief("script", "fr"), hooklocks.brief("fr")].join("\n\n");
const flags = hooklocks.lockFlags(script, { subject, lang: "fr" }); // [] = hook conforme
```

`hooklocks.js` et `playbook.js` n'ont aucune dépendance. Dans `thumbnotes.js`, `brief()` est autonome, mais `audit()` et les variantes reposent sur Agent OS (stockage, FFmpeg, Claude CLI) : à adapter ou à prendre comme modèle.

La logique complète (les quatre couches skill → index → module → garde-fou, les règles de branchement, l'adaptation à tes chaînes, l'ajout d'une nouvelle vidéo) est dans **`docs/Guide-integration-video-skills.docx`**.
