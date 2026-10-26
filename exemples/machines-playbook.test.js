// Garde-fou : TOUTE machine (actuelle et future) est construite sur le YouTube Playbook (lib/playbook.js,
// skills youtube-playbook + mrbeast-method, règle du 01/10/2026). Une machine qui ne le branche pas fait
// échouer npm test. Fichiers d'aide d'une machine (`*-cast.js`, `*-myth.js` : format bestiaire de stickman, `*-zelan.js` : gabarit de miniature de stickman — leurs prompts passent par stickman.js) exclus.
const test = require("node:test");
const assert = require("node:assert/strict");
const fs = require("fs");
const path = require("path");

const DIR = path.join(__dirname, "..", "lib", "machines");
const machines = fs.readdirSync(DIR).filter((f) => f.endsWith(".js") && !/-(cast|myth|moments|zelan)\.js$/.test(f));

test("au moins une machine trouvée", () => assert.ok(machines.length > 0));

for (const f of machines) {
  test(`${f} : construite sur le YouTube Playbook`, () => {
    const src = fs.readFileSync(path.join(DIR, f), "utf8");
    assert.match(src, /require\(["']\.\.\/playbook["']\)/, "require(\"../playbook\") manquant");
    assert.match(src, /playbook\.brief\(\s*["']title["']/, "aucun prompt de titre ne reçoit playbook.brief(\"title\") (voir machine-factory, étape 8 ter)");
    assert.match(src, /playbook\.titleFlags\(/, "le titre final n'est pas contrôlé par playbook.titleFlags");
    // Exception explicite et justifiée dans le fichier : « // PLAYBOOK-EXEMPT(idea|script|music) : <raison> »
    // (machine sans aucun appel Claude d'idée ni de script, ex. birthday).
    if (!/PLAYBOOK-EXEMPT\(idea\|script\|music\) : \S/.test(src)) {
      assert.match(src, /playbook\.brief\(\s*["'](idea|script|music)["']/, "ni consigne d'idée, ni de script, ni de vidéo sans voix");
    }
  });
}
