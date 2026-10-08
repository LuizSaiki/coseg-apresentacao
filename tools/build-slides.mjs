// Gera slides/index.html: apresentação autônoma (HTML+CSS+JS puro, funciona offline), tema claro UNDB.
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { slides } from "./conteudo.mjs";
const aqui = path.dirname(fileURLToPath(import.meta.url));
const OUT = path.join(aqui, "..", "slides");
fs.mkdirSync(OUT, { recursive: true });
const logo = "data:image/jpeg;base64," + fs.readFileSync(path.join(aqui, "..", "assets", "logo-undb-claro.jpeg")).toString("base64");
const esc = (s) => String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");

const KW = new Set("from import def return if elif else for in not and or is None True False class with try except raise as lambda".split(" "));
function realce(linha) {
  const re = /(#.*$)|(\bf?"(?:[^"\\]|\\.)*")|(\bf?'(?:[^'\\]|\\.)*')|([A-Za-z_]\w*)|(\d+)|([\s\S])/g;
  let out = "", m;
  while ((m = re.exec(linha))) {
    const [t, com, s1, s2, id, num] = m;
    if (com) out += `<span class="c">${esc(t)}</span>`;
    else if (s1 || s2) out += `<span class="s">${esc(t)}</span>`;
    else if (id) { const p = linha[re.lastIndex]; out += KW.has(t) ? `<span class="k">${t}</span>` : p === "(" ? `<span class="f">${t}</span>` : esc(t); }
    else if (num) out += `<span class="n">${t}</span>`;
    else out += esc(t);
  }
  return out;
}

function codeCard(entradas, arq) {
  let atual = null, h = "";
  const primeiro = entradas.find((e) => e.f)?.f;
  const minInd = {};
  for (const e of entradas) if (e.f && e.t.trim()) minInd[e.f] = Math.min(minInd[e.f] ?? 99, e.t.match(/^ */)[0].length);
  for (const e of entradas) {
    if (e.sep) { h += `<div class="sp"></div>`; continue; }
    if (atual !== null && e.f !== atual) h += `<div class="fh">${e.f}</div>`;
    atual = e.f;
    const p = e.passo === null ? "" : [].concat(e.passo);
    const attr = p === "" ? "" : ` data-p="${p[0]}" data-u="${p[p.length - 1]}"`;
    h += `<div class="ln"${attr}><span class="no">${e.n}</span><span class="tx">${realce(e.t.slice(minInd[e.f] || 0))}</span></div>`;
  }
  return `<div class="code"><div class="tab"><i></i>${primeiro}</div><div class="ls">${h}</div></div>`;
}

const check = `<svg width="38" height="38" viewBox="0 0 24 24" fill="none" stroke="#1f9d6e" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10" stroke-width="2"/><path d="M7 12.5l3.5 3.5L17 9"/></svg>`;
const st = (p, cls, inner, style = "") => `<div class="step ${cls}" data-step="${p}"${style ? ` style="${style}"` : ""}>${inner}</div>`;

function visual(s) {
  if (s.tipo === "codigo") return codeCard(s.codigo, s.arq);
  switch (s.visual) {
    case "frota":
      return `<div class="panel frota">
        <div class="stat"><b>8</b><span>veículos leves<br>até 4 passageiros</span></div>
        <div class="stat"><b>2</b><span>veículos coletivos<br>até 18 passageiros</span></div>
        <div><p class="lbl">Pedidos chegavam sem padrão:</p>
        <div class="chips"><span class="chip">telefone</span><span class="chip">mensagem</span><span class="chip">e-mail</span><span class="chip">balcão</span><span class="chip">planilhas</span></div></div></div>`;
    case "arq":
      return `<div class="arq">
        ${st(0, "box", `<b>Interface web</b><span>o usuário preenche o pedido</span>`)}
        ${st(0, "arr", "")}
        ${st(1, "box mid", `<b>Servidor Django</b><span>confere capacidade, data, horário e conflito</span>`)}
        ${st(2, "arr", "")}
        ${st(2, "box", `<b>Banco de dados</b><span>guarda as reservas de forma persistente</span>`)}</div>`;
    case "arquivos": {
      const l = (p, f, d) => st(p, "row", `<span class="fn">${f}</span><span class="ds">${d}</span>`);
      return `<div class="rows">${l(0, "models.py", "Tabelas: Veículo e Reserva")}${l(1, "services.py", "Regras: período, conflito, disponibilidade")}
        ${l(2, "views.py", "API: login, CRUD e cancelamento")}${l(2, "urls.py", "Endereços (rotas) do servidor")}${l(2, "forms.py", "Valida os dados recebidos")}
        ${l(2, "seguranca.py", "Login obrigatório")}${l(2, "tests.py", "42 testes automáticos")}</div>`;
    }
    case "conflito": {
      const eixo = [8, 9, 10, 11, 12].map((h, i) => `<span style="left:${i * 25}%">${h}h</span>`).join("");
      return `<div class="conf"><div class="axis">${eixo}</div>
        ${st(0, "trk grow", `<div class="bl ex">VL-01 · reserva existente (8h–10h)</div>`, "--l:0%;--w:50%")}
        ${st(1, "trk grow", `<div class="bl bad">Pedido 9h–11h · CONFLITO</div>`, "--l:25%;--w:50%")}
        ${st(2, "trk grow", `<div class="bl good">10h30–12h · livre</div>`, "--l:62.5%;--w:37.5%")}
        <div style="margin-top:22px">${codeCard(s.codigo, s.arq)}</div></div>`;
    }
    case "cenarios": {
      const cls = { 201: "a", 400: "b", 409: "c" };
      return `<div class="rows tight">` + s.cenarios.map((c) => st(c.p, "crow", `<div class="n2"><b>${esc(c.n)}</b><span>${esc(c.m)}</span></div><div class="bd ${cls[c.c]}">${c.c}</div>`)).join("") +
        `<div class="okb">${check}<span>42 testes automáticos do projeto: todos passaram</span></div></div>`;
    }
    case "checklist":
      return `<div class="rows tight">` + s.checks.map((c) => st(c.p, "row chk", `${check}<span>${esc(c.t)}</span><em>${c.f}</em>`)).join("") + `</div>`;
  }
  return "";
}

const total = slides.length;
const secoes = slides.map((s, i) => {
  const num = `${String(i + 1).padStart(2, "0")} / ${String(total).padStart(2, "0")}`;
  if (s.tipo === "capa") {
    return `<section class="slide capa" data-n="0" data-notes="${esc(s.notas)}">
      <div class="blob b1"></div><div class="blob b2"></div><div class="blob b3"></div>
      <img class="clogo rv" style="--d:.1s" src="${logo}" alt="UNDB Centro Universitário"/>
      <h1 class="rv" style="--d:.25s">${esc(s.titulo)}</h1>
      <div class="traco rv" style="--d:.45s"></div>
      <p class="sub rv" style="--d:.6s">${esc(s.sub)}</p>
      <div class="tags rv" style="--d:.8s">${s.tags.map((t) => `<span class="tag">${esc(t)}</span>`).join("")}</div>
</section>`;
  }
  const cards = s.itens.map((it, k) => `<div class="card step" data-step="${k}"><span class="nb">${k + 1}</span><p>${esc(it.t)}</p></div>`).join("");
  return `<section class="slide" data-n="${s.itens.length}" data-notes="${esc(s.notas)}">
    <header class="top rv" style="--d:0s"><img src="${logo}" alt="UNDB"/><span>COSEG Mobilidade · Programação para Web · PBL 1</span><span class="pg">${num}</span></header>
    <h2 class="rv" style="--d:.08s">${esc(s.titulo)}</h2>
    <div class="vis rv" style="--d:.2s">${visual(s)}</div>
    <div class="side">${cards}</div></section>`;
}).join("\n");

const CSS = `
*{margin:0;padding:0;box-sizing:border-box}
:root{--ink:#1b1033;--mut:#54456f;--mag:#c62a88;--pur:#6d2fa0;--red:#e5303a;--line:#e2d8f0;--ease:cubic-bezier(.22,1,.36,1)}
html,body{height:100%;background:#e9e4f3;overflow:hidden;font-family:system-ui,"Segoe UI",sans-serif;color:var(--ink)}
#stage{position:absolute;left:50%;top:50%;width:1920px;height:1080px;transform-origin:center;background:#faf7fd;overflow:hidden;box-shadow:0 20px 60px rgba(27,16,51,.2)}
#stage:before{content:"";position:absolute;inset:0;background:radial-gradient(1000px 640px at 100% 0%,#f4dcee,transparent 62%),radial-gradient(900px 600px at 0% 100%,#e5dcf7,transparent 62%)}
.slide{position:absolute;inset:0;opacity:0;visibility:hidden;transition:opacity .55s ease,transform .9s var(--ease),visibility 0s linear .55s}
.slide.before{transform:translateX(-70px)}.slide.after{transform:translateX(70px)}
.slide.on{opacity:1;visibility:visible;transform:none;transition:opacity .6s ease .12s,transform .9s var(--ease) .05s,visibility 0s}
.rv{opacity:0;transform:translateY(28px);transition:opacity .8s ease,transform 1s var(--ease)}
.slide.on .rv{opacity:1;transform:none;transition-delay:calc(var(--d,0s) + .15s)}
.step{opacity:0;transform:translateY(26px) scale(.985);transition:opacity .6s ease,transform .8s var(--ease)}
.step.shown{opacity:1;transform:none}
.step.grow{opacity:1;transform:none}.step.grow .bl{transform:scaleX(0);transform-origin:left center;transition:transform .9s var(--ease)}.step.grow.shown .bl{transform:scaleX(1)}
.top{position:absolute;left:80px;right:80px;top:30px;height:58px;display:flex;align-items:center;gap:26px;font-size:26px;color:var(--mut)}
.top img{height:62px;width:auto;border-radius:12px;box-shadow:0 4px 14px rgba(109,47,160,.15)}.pg{margin-left:auto;font-variant-numeric:tabular-nums;font-weight:600}
h2{position:absolute;left:80px;top:122px;width:1760px;font-size:60px;line-height:1.1;font-weight:800;letter-spacing:-.015em}
h2:after{content:"";display:block;width:140px;height:8px;border-radius:4px;margin-top:20px;background:linear-gradient(90deg,var(--red),var(--mag),var(--pur))}
.vis{position:absolute;left:80px;top:318px;width:1100px;height:720px}
.side{position:absolute;left:1230px;top:318px;width:610px;display:flex;flex-direction:column;gap:20px}
.card{display:flex;gap:20px;align-items:flex-start;background:#fff;border:2px solid var(--line);border-radius:22px;padding:22px 26px;box-shadow:0 6px 20px rgba(109,47,160,.08)}
.card .nb{flex:none;width:48px;height:48px;border-radius:50%;background:var(--mag);color:#fff;font-weight:800;font-size:28px;display:grid;place-items:center}
.card p{font-size:36px;line-height:1.22;font-weight:600}
.code{background:#fff;border:2px solid var(--line);border-radius:22px;overflow:hidden;box-shadow:0 10px 30px rgba(109,47,160,.1)}
.code .tab{display:flex;align-items:center;gap:14px;padding:14px 26px;background:#f2ecfa;font:700 26px ui-monospace,Consolas,monospace;color:var(--ink)}
.code .tab i{width:16px;height:16px;border-radius:50%;background:var(--mag);display:block}
.ls{padding:14px 0 16px}
.ln{display:flex;font:500 23px/1.45 ui-monospace,Consolas,monospace;color:var(--ink);padding-right:26px;border-left:7px solid transparent;transition:opacity .5s ease,background-color .5s ease,border-color .5s ease}
.ln .no{flex:none;width:70px;text-align:right;padding-right:20px;color:#7a6a96}.ln .tx{white-space:pre-wrap;overflow-wrap:anywhere}
.ln.cur{background:rgba(198,42,136,.13);border-left-color:var(--mag)}.ln.dim{opacity:.5}.ln.past{opacity:.8}
.fh{font:700 22px ui-monospace,Consolas,monospace;color:var(--mag);padding:10px 26px 2px;border-top:2px dashed var(--line);margin-top:8px}.sp{height:10px}
.k{color:#a000c4;font-weight:700}.s{color:#a31515}.c{color:#2d7a32;font-style:italic}.n{color:#0b7a50}.f{color:#6a4f00;font-weight:600}
.panel{background:#fff;border:2px solid var(--line);border-radius:22px;padding:30px 34px;box-shadow:0 10px 30px rgba(109,47,160,.1)}
.frota{display:flex;flex-direction:column;gap:30px}.stat{display:flex;align-items:center;gap:26px}.stat b{font-size:110px;line-height:1;font-weight:900;color:var(--mag);min-width:90px}.stat span{font-size:40px;font-weight:700;line-height:1.2}
.lbl{font-size:34px;font-weight:700;margin-bottom:14px}.chips{display:flex;flex-wrap:wrap;gap:14px}.chip{font-size:30px;font-weight:600;padding:8px 22px;border-radius:999px;background:#f2ecfa;border:2px solid #d9c9ef}
.arq{display:flex;align-items:center;height:100%;gap:0}.box{width:300px;border-radius:22px;padding:28px 22px;text-align:center;border:3px solid var(--pur);background:#fff;box-shadow:0 10px 30px rgba(109,47,160,.1)}
.box b{display:block;font-size:36px;line-height:1.15;margin-bottom:12px}.box span{font-size:27px;color:var(--mut);line-height:1.25}.box.mid{border-color:var(--mag);background:#fdf0f8;width:340px}
.arr{width:60px;height:8px;background:var(--pur);position:relative;flex:none;border-radius:4px}.arr:after{content:"";position:absolute;right:-6px;top:-14px;border-left:24px solid var(--pur);border-top:18px solid transparent;border-bottom:18px solid transparent}
.rows{display:flex;flex-direction:column;gap:14px}.rows.tight{gap:8px}
.row{display:flex;align-items:center;gap:24px;background:#fff;border:2px solid var(--line);border-radius:16px;padding:16px 24px}
.row .fn{flex:none;font:800 30px ui-monospace,Consolas,monospace;color:var(--mag);min-width:270px}.row .ds{font-size:32px;font-weight:600}
.row.chk{gap:18px;padding:11px 22px}.row.chk span{font-size:31px;font-weight:700;flex:1}.row.chk em{font:700 24px ui-monospace,Consolas,monospace;color:var(--mag);font-style:normal}.row.chk svg{flex:none}
.conf .axis{position:relative;height:36px;margin-bottom:6px;font-size:24px;color:var(--mut);font-weight:600}.axis span{position:absolute;top:0;transform:translateX(-50%)}
.trk{position:relative;height:62px;margin-bottom:10px;border-left:3px solid var(--line)}
.bl{position:absolute;top:0;height:62px;left:var(--l);width:var(--w);border-radius:12px;display:flex;align-items:center;padding:0 16px;font-size:26px;font-weight:700;color:#fff;white-space:nowrap;overflow:hidden}
.bl.ex{background:var(--pur)}.bl.bad{background:#c8202c}.bl.good{background:#14805a}
.crow{display:flex;align-items:center;gap:16px;background:#fff;border:2px solid var(--line);border-radius:14px;padding:5px 16px}
.crow .n2{flex:1;min-width:0}.crow .n2 b{display:block;font-size:29px;line-height:1.15}.crow .n2 span{display:block;font-size:24px;color:var(--mut);white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
.bd{flex:none;font-size:30px;font-weight:800;padding:5px 18px;border-radius:10px}.bd.a{background:#d6f4e7;color:#0b5c3e}.bd.b{background:#ffecc7;color:#7a4300}.bd.c{background:#ffdde0;color:#9c1020}
.okb{display:flex;align-items:center;gap:14px;margin-top:6px;font-size:30px;font-weight:700;color:#0b6e4a}
/* capa */
.capa{padding:0 150px;display:flex;flex-direction:column;justify-content:center}
.capa h1{font-size:176px;line-height:1;font-weight:900;letter-spacing:-.035em;position:relative}
.capa .clogo{position:absolute;left:150px;top:80px;width:340px;height:auto;border-radius:16px;box-shadow:0 8px 24px rgba(109,47,160,.18)}
.traco{width:240px;height:10px;border-radius:5px;margin:34px 0 30px;background:linear-gradient(90deg,var(--red),var(--mag),var(--pur));position:relative}
.sub{font-size:56px;line-height:1.22;font-weight:600;color:#3a2a5c;max-width:1350px;position:relative}
.tags{display:flex;gap:18px;margin-top:56px;position:relative}.tag{font-size:34px;font-weight:700;padding:10px 28px;border-radius:999px;border:3px solid var(--mag);background:#fff}
.dica{position:absolute;left:150px;bottom:60px;font-size:26px;color:var(--mut)}
.blob{position:absolute;border-radius:70px;animation:flutua 9s ease-in-out infinite alternate}
.b1{right:-250px;top:-200px;width:600px;height:600px;transform:rotate(16deg);background:linear-gradient(135deg,var(--red),var(--mag) 55%,var(--pur));opacity:.92}
.b2{right:140px;top:700px;width:260px;height:260px;transform:rotate(-9deg);background:linear-gradient(135deg,var(--mag),var(--pur));opacity:.5;animation-delay:-3s}
.b3{right:70px;top:380px;width:150px;height:150px;border-radius:40px;background:var(--red);opacity:.35;animation-delay:-6s}
@keyframes flutua{from{translate:0 0}to{translate:-22px 26px}}
/* barra de progresso e notas */
#prog{position:absolute;left:0;bottom:0;height:10px;width:0;background:linear-gradient(90deg,var(--red),var(--mag),var(--pur));transition:width .8s var(--ease);z-index:5}
#notas{position:absolute;left:80px;right:80px;bottom:34px;background:var(--ink);color:#fff;border-radius:20px;padding:22px 32px;font-size:32px;line-height:1.3;z-index:6;opacity:0;transform:translateY(20px);pointer-events:none;transition:opacity .4s ease,transform .6s var(--ease)}
#notas.on{opacity:1;transform:none}#notas small{display:block;font-size:22px;color:#e7a6d0;letter-spacing:.08em;text-transform:uppercase;margin-bottom:6px;font-weight:700}
@media (prefers-reduced-motion:reduce){*{transition-duration:.01s!important;animation:none!important}}
/* modo PDF/impressão: ?pdf */
.pdf html,.pdf body{overflow:visible;height:auto;background:#fff}.pdf #stage{position:static;transform:none!important;box-shadow:none;height:auto;overflow:visible}.pdf #stage:before{display:none}
.pdf .slide{position:relative;width:1920px;height:1080px;opacity:1;visibility:visible;transform:none;page-break-after:always;overflow:hidden;background:#faf7fd}
.pdf .rv,.pdf .step{opacity:1!important;transform:none!important}.pdf .step.grow .bl{transform:none!important}.pdf .ln{opacity:1!important}.pdf #prog,.pdf #notas,.pdf .dica{display:none}
@page{size:1920px 1080px;margin:0}`;

const JS = `
(() => {
  const params = new URLSearchParams(location.search);
  if (params.has("pdf")) document.documentElement.classList.add("pdf");
  const stage = document.getElementById("stage"), prog = document.getElementById("prog"), notas = document.getElementById("notas");
  const S = [...document.querySelectorAll(".slide")];
  let cur = 0, step = 0, anterior = -1;
  const fit = () => { const k = Math.min(innerWidth / 1920, innerHeight / 1080); stage.style.transform = "translate(-50%,-50%) scale(" + k + ")"; };
  addEventListener("resize", fit); fit();
  function pintar() {
    S.forEach((el, i) => { el.classList.toggle("on", i === cur); el.classList.toggle("before", i < cur); el.classList.toggle("after", i > cur); });
    const el = S[cur], k = step - 1;
    el.querySelectorAll(".step").forEach((e) => e.classList.toggle("shown", +e.dataset.step < step));
    el.querySelectorAll(".ln").forEach((l) => {
      l.classList.remove("cur", "dim", "past");
      if (step === 0 || l.dataset.p === undefined) { if (step > 0) l.classList.add("dim"); return; }
      const p = +l.dataset.p, u = +l.dataset.u;
      if (k >= p && k <= u) l.classList.add("cur"); else if (u < k) l.classList.add("past"); else l.classList.add("dim");
    });
    const total = S.length - 1, frac = (cur + (el.dataset.n > 0 ? step / el.dataset.n : 1) * 0.999) / (total + 1);
    prog.style.width = Math.min(100, (cur === 0 && step === 0 ? 0 : frac * 100)) + "%";
    notas.innerHTML = "<small>Notas do apresentador</small>" + (el.dataset.notes || "");
    history.replaceState(null, "", "#" + (cur + 1));
  }
  function proximo() { const n = +S[cur].dataset.n; if (step < n) step++; else if (cur < S.length - 1) { cur++; step = 0; } pintar(); }
  function voltar() { if (step > 0) step--; else if (cur > 0) { cur--; step = +S[cur].dataset.n; } pintar(); }
  addEventListener("keydown", (e) => {
    if (["ArrowRight", "ArrowDown", "PageDown", " ", "Enter"].includes(e.key)) { e.preventDefault(); proximo(); }
    else if (["ArrowLeft", "ArrowUp", "PageUp", "Backspace"].includes(e.key)) { e.preventDefault(); voltar(); }
    else if (e.key === "Home") { cur = 0; step = 0; pintar(); }
    else if (e.key === "End") { cur = S.length - 1; step = +S[cur].dataset.n; pintar(); }
    else if (e.key.toLowerCase() === "n") notas.classList.toggle("on");
    else if (e.key.toLowerCase() === "f") { document.fullscreenElement ? document.exitFullscreen() : document.documentElement.requestFullscreen(); }
  });
  stage.addEventListener("click", (e) => { const r = stage.getBoundingClientRect(); (e.clientX - r.left) < r.width * 0.25 ? voltar() : proximo(); });
  let x0 = null; addEventListener("touchstart", (e) => { x0 = e.touches[0].clientX; });
  addEventListener("touchend", (e) => { if (x0 === null) return; const dx = e.changedTouches[0].clientX - x0; if (Math.abs(dx) > 50) dx < 0 ? proximo() : voltar(); x0 = null; });
  const h = parseInt(location.hash.slice(1)); if (h >= 1 && h <= S.length) cur = h - 1;
  pintar();
  window.__slides = { proximo, voltar, ir: (i, s = 0) => { cur = i; step = s; pintar(); }, total: S.length };
})();`;

const html = `<!doctype html>
<html lang="pt-BR"><head><meta charset="UTF-8"/><meta name="viewport" content="width=device-width, initial-scale=1"/>
<title>COSEG Mobilidade — Apresentação</title><style>${CSS}</style></head>
<body><div id="stage">
${secoes}
<div id="notas"></div><div id="prog"></div>
</div>
<script>${JS}</script></body></html>`;
fs.writeFileSync(path.join(OUT, "index.html"), html);
console.log("slides:", total, "·", (html.length / 1024).toFixed(0), "KB");
