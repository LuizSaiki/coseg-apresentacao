import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { slides } from "./conteudo.mjs";
import { cena, CSS } from "./render.mjs";
const aqui = path.dirname(fileURLToPath(import.meta.url));
const GSAP = '<script src="https://cdn.jsdelivr.net/npm/gsap@3.14.2/dist/gsap.min.js"></script>';
const head = (t, extra = "") => `<!doctype html>
<html lang="pt-BR"><head><meta charset="UTF-8"/><meta name="viewport" content="width=1920, height=1080"/><title>${t}</title>
${GSAP}<style>${CSS}${extra}</style></head>`;

// ---------- DECK ----------
{
  let S = 0; const cenas = [], ilha = [];
  slides.forEach((s, i) => {
    const c = cena(s, i, slides.length, "deck", 0); // tempos locais à cena (a cena fica dentro da raiz "main")
    c.html = c.html.replace('data-composition-id="' + s.id + '" data-start="0"', 'data-composition-id="' + s.id + '" data-start="' + S + '"');
    cenas.push(c);
    const ref = { sceneId: s.id, notes: s.notas };
    if (c.frags) ref.fragments = c.frags.map((f) => +(f + S).toFixed(2));
    S += c.dur;
    ilha.push(ref);
  });
  const html = head("COSEG Mobilidade — Apresentação", "html,body{width:1920px;height:1080px;overflow:hidden}") +
`<body style="margin:0">
<script type="application/hyperframes-slideshow+json">
${JSON.stringify({ slides: ilha, slideSequences: [] }, null, 1)}
</script>
<div id="root" data-composition-id="main" data-start="0" data-width="1920" data-height="1080" data-duration="${+S.toFixed(2)}" style="position:relative;width:1920px;height:1080px;overflow:hidden">
${cenas.map((c) => c.html).join("\n")}
</div>
<script>
window.__timelines = window.__timelines || {};
window.__timelines["main"] = gsap.timeline({ paused: true });
${cenas.map((c) => `{ const tl = gsap.timeline({ paused: true });\n${c.js}\nwindow.__timelines["${c.id}"] = tl; }`).join("\n")}
</script></body></html>`;
  fs.writeFileSync(path.join(aqui, "..", "deck", "index.html"), html);
  console.log("deck:", slides.length, "slides,", S.toFixed(1), "s de timeline");
}

// ---------- VÍDEO ----------
{
  fs.mkdirSync(path.join(aqui, "..", "video", "compositions"), { recursive: true });
  let S = 0; const hosts = [];
  slides.forEach((s, i) => {
    const c = cena(s, i, slides.length, "video", 0);
    const ini = +S.toFixed(2);
    const arq = `<!doctype html>
<html lang="pt-BR"><head><meta charset="UTF-8"/></head><body>
<template>
<div data-composition-id="${c.id}" data-width="1920" data-height="1080" data-duration="${c.dur}" style="position:absolute;inset:0">
${c.sub}
</div>
<script>
const tl = gsap.timeline({ paused: true });
${c.js}
window.__timelines["${c.id}"] = tl;
</script>
</template></body></html>`;
    fs.writeFileSync(path.join(aqui, "..", "video", "compositions", c.id + ".html"), arq);
    hosts.push(`<div id="${c.id}" class="clip" data-composition-id="${c.id}" data-composition-src="compositions/${c.id}.html" data-start="${ini}" data-duration="${c.dur}" data-track-index="1" data-width="1920" data-height="1080"></div>`);
    S += c.dur;
  });
  const total = +S.toFixed(2);
  const html = head("COSEG Mobilidade — Vídeo", "html,body{width:1920px;height:1080px;overflow:hidden}#root{position:relative;width:100%;height:100%;overflow:hidden}") +
`<body>
<div id="root" data-composition-id="main" data-start="0" data-width="1920" data-height="1080" data-duration="${total}">
${hosts.join("")}
</div>
<script>
const tl = gsap.timeline({ paused: true });
window.__timelines["main"] = tl;
</script></body></html>`;
  fs.writeFileSync(path.join(aqui, "..", "video", "index.html"), html);
  console.log("video:", total, "s =", (total / 60).toFixed(1), "min");
}
