// Renderiza cenas (slide ou vídeo) a partir do conteúdo compartilhado.
const esc = (s) => String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");

const KW = new Set("from import def return if elif else for in not and or is None True False class with try except raise as lambda".split(" "));
function realce(linha) {
  const re = /(#.*$)|(\bf?"(?:[^"\\]|\\.)*")|(\bf?'(?:[^'\\]|\\.)*')|([A-Za-z_]\w*)|(\d+)|([\s\S])/g;
  let out = "", m;
  while ((m = re.exec(linha))) {
    const [t, com, s1, s2, id, num] = m;
    if (com) out += `<span class="c">${esc(t)}</span>`;
    else if (s1 || s2) out += `<span class="s">${esc(t)}</span>`;
    else if (id) {
      const prox = linha[re.lastIndex];
      out += KW.has(t) ? `<span class="k">${t}</span>` : prox === "(" ? `<span class="f">${t}</span>` : esc(t);
    } else if (num) out += `<span class="n">${t}</span>`;
    else out += esc(t);
  }
  return out;
}

export const CSS = `
*{margin:0;padding:0;box-sizing:border-box}
:root{--bg:#150928;--card:#241043;--card2:#1c0c35;--txt:#f7f1ff;--mut:#bfa8e3;--mag:#d63a9a;--pur:#8e44c4;--red:#e5303a;--ok:#35d49a;--warn:#ffb547}
html,body{margin:0;background:#150928;font-family:system-ui,sans-serif;color:#f7f1ff}
.frame{position:absolute;inset:0;overflow:hidden;background:
 radial-gradient(1100px 700px at 100% 0%,rgba(142,68,196,.30),transparent 60%),
 radial-gradient(900px 600px at 0% 100%,rgba(214,58,154,.18),transparent 60%),#150928}
.inner{position:absolute;inset:0;padding:54px 90px 0 90px;display:flex;flex-direction:column}
.top{display:flex;align-items:center;gap:22px;height:48px;font-size:26px;color:#bfa8e3;letter-spacing:.02em}
.brand{font-weight:800;font-size:30px;color:#fff;padding:2px 16px;border-radius:8px;background:linear-gradient(90deg,#e5303a,#d63a9a 55%,#8e44c4)}
.pg{margin-left:auto;font-variant-numeric:tabular-nums}
.body{flex:1;display:grid;grid-template-columns:740px 940px;column-gap:60px;align-items:center;padding:20px 0 56px}
.vid .body{padding-bottom:200px}
.bar{position:absolute;left:0;right:0;bottom:0;height:12px;background:linear-gradient(90deg,#e5303a,#d63a9a 50%,#8e44c4)}
h2{font-size:54px;line-height:1.13;font-weight:800;letter-spacing:-.01em;margin-bottom:34px}
ol{list-style:none;display:flex;flex-direction:column;gap:24px}
li{display:flex;gap:20px;font-size:40px;line-height:1.24;font-weight:500;color:#f1e8ff}
li .nb{flex:none;width:52px;height:52px;border-radius:50%;background:#d63a9a;color:#fff;font-weight:800;font-size:30px;display:grid;place-items:center;margin-top:1px}
.code{background:#0f0620;border:2px solid #3a1d63;border-radius:20px;overflow:hidden;width:940px}
.code .tab{display:flex;align-items:center;gap:14px;padding:14px 26px;background:#1d0d38;font:600 26px ui-monospace,monospace;color:#e9d9ff}
.code .tab i{width:16px;height:16px;border-radius:50%;background:#d63a9a;display:block}
.code .ls{padding:18px 0 20px}
.ln{display:flex;font:500 23px/1.42 ui-monospace,monospace;color:#e8ddf8;padding:0 26px 0 0;opacity:.62;background-color:rgba(214,58,154,0)}
.ln .no{flex:none;width:68px;text-align:right;padding-right:20px;color:#b49bdc}
.ln .tx{white-space:pre-wrap;overflow-wrap:anywhere}
.fh{font:600 22px ui-monospace,monospace;color:#d63a9a;padding:10px 26px 2px 26px;border-top:2px dashed #3a1d63;margin-top:8px}
.sp{height:12px}
.k{color:#ff79c6}.s{color:#8be9a8}.c{color:#b9abd8;font-style:italic}.n{color:#ffb86c}.f{color:#7fd0ff}
.cap{position:absolute;left:150px;right:150px;bottom:48px;text-align:center;font-size:40px;line-height:1.3;font-weight:600;color:#fff;background:rgba(12,4,24,.88);border:2px solid #3a1d63;border-radius:16px;padding:18px 34px;opacity:0}
.cover{display:flex;flex-direction:column;justify-content:center;padding:0 160px}
.cover .t{font-size:156px;font-weight:900;line-height:1;letter-spacing:-.03em;background:linear-gradient(90deg,#fff 20%,#f08bc8);-webkit-background-clip:text;background-clip:text;color:transparent}
.cover .sb{font-size:56px;line-height:1.22;margin-top:34px;max-width:1450px;font-weight:600;color:#e9d9ff}
.tags{display:flex;gap:18px;margin-top:56px}
.tag{font-size:34px;font-weight:700;padding:10px 26px;border-radius:999px;border:3px solid #d63a9a;color:#fff}
.stripe{position:absolute;right:-120px;top:120px;width:560px;height:560px;border-radius:50px;transform:rotate(14deg);background:linear-gradient(135deg,rgba(229,48,58,.9),rgba(214,58,154,.85) 50%,rgba(142,68,196,.9));opacity:.9}
.stripe.b{right:150px;top:560px;width:300px;height:300px;opacity:.55;transform:rotate(-8deg)}
.panel{background:#241043;border:2px solid #3a1d63;border-radius:20px;padding:26px 30px}
.stat{display:flex;align-items:baseline;gap:22px}
.stat b{font-size:96px;line-height:1;font-weight:900;color:#d63a9a}
.stat span{font-size:36px;font-weight:600}
.chips{display:flex;flex-wrap:wrap;gap:14px;margin-top:16px}
.chip{font-size:30px;font-weight:600;padding:8px 22px;border-radius:999px;background:#35195c;border:2px solid #5a2f94}
.arq{display:flex;align-items:center;gap:0}
.box{width:250px;border-radius:20px;padding:24px 20px;text-align:center;border:3px solid #8e44c4;background:#241043}
.box b{display:block;font-size:34px;line-height:1.15;margin-bottom:10px}.box span{font-size:26px;color:#bfa8e3}
.box.mid{border-color:#d63a9a;background:#34154f;width:300px}
.arr{width:60px;height:8px;background:#8e44c4;position:relative;flex:none}
.arr:after{content:"";position:absolute;right:-4px;top:-14px;border-left:24px solid #8e44c4;border-top:18px solid transparent;border-bottom:18px solid transparent}
.rows{display:flex;flex-direction:column;gap:14px}
.row{display:flex;align-items:center;gap:22px;background:#241043;border:2px solid #3a1d63;border-radius:16px;padding:14px 22px}
.row .fn{flex:none;font:700 28px ui-monospace,monospace;color:#ff9ad1;min-width:250px}
.row .ds{font-size:30px;font-weight:500;color:#f1e8ff}
.axis{position:relative;height:40px;width:800px;margin:0 0 6px 0;font-size:24px;color:#bfa8e3}
.axis span{position:absolute;top:0;transform:translateX(-50%)}
.trk{position:relative;width:800px;height:74px;margin-bottom:12px;border-left:3px solid #3a1d63}
.bl{position:absolute;top:0;height:74px;border-radius:14px;display:flex;align-items:center;padding:0 16px;font-size:26px;font-weight:700;white-space:nowrap;overflow:hidden}
.bl.ex{background:#6b2fa5}.bl.bad{background:#e5303a}.bl.good{background:#1fa87a}
.crow{display:flex;align-items:center;gap:16px;background:#241043;border:2px solid #3a1d63;border-radius:14px;padding:10px 18px}
.crow .n2{flex:1;min-width:0}.crow .n2 b{display:block;font-size:30px;line-height:1.2}
.crow .n2 span{display:block;font-size:24px;color:#bfa8e3;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
.bd{flex:none;font-size:30px;font-weight:800;padding:6px 18px;border-radius:10px;color:#0b0518}
.bd.a{background:#35d49a}.bd.b{background:#ffb547}.bd.c{background:#ff6b73}
.okb{display:flex;align-items:center;gap:16px;margin-top:6px;font-size:30px;font-weight:700;color:#35d49a}
.chk{display:flex;align-items:center;gap:18px;font-size:32px;font-weight:600}
.chk svg{flex:none}.chk em{margin-left:auto;font:600 24px ui-monospace,monospace;color:#ff9ad1;font-style:normal}
`;

/** Constrói uma cena. modo = "deck" | "video". S = início absoluto (s). */
export function cena(slide, idx, total, modo, S) {
  const id = slide.id;
  const deck = modo === "deck";
  const n = slide.itens?.length || 0;
  let cont = 0;
  const rev = [];   // {id, passo}
  const novoId = () => `${id}-e${cont++}`;
  const el = (passo, cls, inner, style = "") => {
    const i = novoId();
    if (passo !== null && passo !== undefined) rev.push({ id: i, passo });
    return `<div id="${i}" class="${cls}"${style ? ` style="${style}"` : ""}>${inner}</div>`;
  };

  // ---- tempos ----
  let T, dur, frags = null, durs = [];
  if (deck) {
    T = (k) => S + 0.9 + 1.2 * k;
    if (n) { frags = slide.itens.map((_, k) => +(T(k) + 0.7).toFixed(2)); dur = +(frags[n - 1] + 1.5 - S).toFixed(2); }
    else dur = 4;
  } else {
    if (slide.tipo === "capa") { dur = 8; }
    else {
      durs = slide.itens.map((it) => Math.max(5, Math.ceil((it.l.length / 16) * 2) / 2));
      const ts = [S + 1.4]; durs.forEach((d, k) => ts.push(ts[k] + d));
      T = (k) => ts[k];
      dur = +(ts[n] - S + 0.9).toFixed(2);
    }
  }

  // ---- visual ----
  const code = (entradas, arq) => {
    let atual = null, h = "", primeiro = arq || entradas.find((e) => e.f)?.f;
    const minInd = {};
    for (const e of entradas) if (e.f && e.t.trim()) minInd[e.f] = Math.min(minInd[e.f] ?? 99, e.t.match(/^ */)[0].length);
    for (const e of entradas) {
      if (e.sep) { h += `<div class="sp"></div>`; continue; }
      if (atual !== null && e.f !== atual) h += `<div class="fh">${e.f}</div>`;
      atual = e.f;
      const i = novoId();
      if (e.passo !== null) { const p = [].concat(e.passo); rev.push({ id: i, passo: p[0], ult: p[p.length - 1], linha: true }); }
      h += `<div id="${i}" class="ln"><span class="no">${e.n}</span><span class="tx">${realce(e.t.slice(minInd[e.f] || 0))}</span></div>`;
    }
    return `<div class="code"><div class="tab"><i></i>${primeiro}</div><div class="ls">${h}</div></div>`;
  };

  let direita = "";
  const v = slide.visual;
  if (slide.tipo === "codigo") direita = code(slide.codigo, slide.arq);
  else if (v === "frota") {
    direita = `<div class="panel" style="display:flex;flex-direction:column;gap:26px">
      <div class="stat"><b>8</b><span>veículos leves<br>até 4 passageiros</span></div>
      <div class="stat"><b>2</b><span>veículos coletivos<br>até 18 passageiros</span></div>
      <div><div style="font-size:32px;font-weight:700">Pedidos chegavam sem padrão:</div>
      <div class="chips"><span class="chip">telefone</span><span class="chip">mensagem</span><span class="chip">e-mail</span><span class="chip">balcão</span><span class="chip">planilhas</span></div></div></div>`;
  } else if (v === "arq") {
    direita = `<div class="arq">
      ${el(0, "box", `<b>Interface web</b><span>PBL 2: o usuário preenche o pedido</span>`)}
      ${el(0, "arr", "")}
      ${el(1, "box mid", `<b>Servidor Django</b><span>confere capacidade, data, horário e conflito</span>`)}
      ${el(2, "arr", "")}
      ${el(2, "box", `<b>Banco de dados</b><span>guarda as reservas de forma persistente</span>`)}
    </div>`;
  } else if (v === "arquivos") {
    const linha = (p, f, d) => el(p, "row", `<span class="fn">${f}</span><span class="ds">${d}</span>`);
    direita = `<div class="rows">
      ${linha(0, "models.py", "Tabelas: Veículo e Reserva")}
      ${linha(1, "services.py", "Regras: período, conflito, disponibilidade")}
      ${linha(2, "views.py", "API: login, CRUD e cancelamento")}
      ${linha(2, "urls.py", "Endereços (rotas) do servidor")}
      ${linha(2, "forms.py", "Valida os dados recebidos")}
      ${linha(2, "seguranca.py", "Login obrigatório")}
      ${linha(2, "tests.py", "42 testes automáticos")}
    </div>`;
  } else if (v === "conflito") {
    const eixo = [8, 9, 10, 11, 12].map((h, i) => `<span style="left:${i * 200}px">${h}h</span>`).join("");
    direita = `<div>
      <div class="axis">${eixo}</div>
      ${el(0, "trk", `<div class="bl ex" style="left:0;width:400px">VL-01 · reserva existente</div>`)}
      ${el(1, "trk", `<div class="bl bad" style="left:200px;width:400px">9h–11h · CONFLITO</div>`)}
      ${el(2, "trk", `<div class="bl good" style="left:500px;width:300px">10h30–12h · livre</div>`)}
      <div style="margin-top:18px">${code(slide.codigo, slide.arq)}</div></div>`;
  } else if (v === "cenarios") {
    const cls = { 201: "a", 400: "b", 409: "c" };
    direita = `<div class="rows" style="gap:10px">` + slide.cenarios.map((c) =>
      el(c.p, "crow", `<div class="n2"><b>${esc(c.n)}</b><span>${esc(c.m)}</span></div><div class="bd ${cls[c.c]}">${c.c}</div>`)).join("") +
      `<div class="okb"><svg width="34" height="34" viewBox="0 0 24 24" fill="none" stroke="#35d49a" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><path d="M4 12l5 5 11-11"/></svg>42 testes automáticos do projeto: todos passaram</div></div>`;
  } else if (v === "checklist") {
    const svg = `<svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="#35d49a" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10" stroke-width="2"/><path d="M7 12.5l3.5 3.5L17 9"/></svg>`;
    direita = `<div class="rows" style="gap:12px">` + slide.checks.map((c) =>
      el(c.p, "row", `<div class="chk">${svg}<span>${esc(c.t)}</span><em>${c.f}</em></div>`).replace('class="row"', 'class="row" ').replace(/<div class="chk">/, '<div class="chk" style="flex:1">')).join("") + `</div>`;
  }

  // ---- HTML ----
  const num = String(idx + 1).padStart(2, "0") + " / " + String(total).padStart(2, "0");
  let corpo;
  if (slide.tipo === "capa") {
    corpo = `<div class="inner cover">
      <div class="stripe" id="${id}-st1"></div><div class="stripe b" id="${id}-st2"></div>
      <div class="t" id="${id}-t">${esc(slide.titulo)}</div>
      <div class="sb" id="${id}-sb">${esc(slide.sub)}</div>
      <div class="tags" id="${id}-tg">${slide.tags.map((t) => `<span class="tag">${esc(t)}</span>`).join("")}</div></div>`;
  } else {
    const lis = slide.itens.map((it, k) => `<li id="${id}-li${k}"><span class="nb">${k + 1}</span><span>${esc(it.t)}</span></li>`).join("");
    slide.itens.forEach((_, k) => rev.push({ id: `${id}-li${k}`, passo: k }));
    corpo = `<div class="inner">
      <div class="top"><span class="brand">UNDB</span><span>COSEG Mobilidade · Programação para Web · PBL 1</span><span class="pg">${num}</span></div>
      <div class="body"><div id="${id}-L"><h2 id="${id}-h">${esc(slide.titulo)}</h2><ol>${lis}</ol></div><div id="${id}-R">${direita}</div></div></div>`;
  }
  if (!deck) {
    const caps = (slide.tipo === "capa" ? [{ l: slide.legenda }] : slide.itens).map((it, k) => `<div id="${id}-cap${k}" class="cap">${esc(it.l ?? it.legenda)}</div>`).join("");
    corpo += caps;
  }
  corpo += `<div class="bar"></div>`;

  // ---- animações ----
  const J = [];
  const ent = (sel, t, de = { opacity: 0, y: 24 }) =>
    J.push(`tl.fromTo(${JSON.stringify(sel)},${JSON.stringify(de)},{opacity:1,y:0,duration:.5,ease:"power2.out"},${(+t).toFixed(2)});`);
  if (slide.tipo === "capa") {
    ent(`#${id}-t`, S + 0.2, { opacity: 0, y: 40 }); ent(`#${id}-sb`, S + 0.6); ent(`#${id}-tg`, S + 1.0);
    J.push(`tl.fromTo("#${id}-st1",{x:200,opacity:0},{x:0,opacity:.9,duration:.9,ease:"power3.out"},${S + 0.1});`);
    J.push(`tl.fromTo("#${id}-st2",{x:-200,opacity:0},{x:0,opacity:.55,duration:.9,ease:"power3.out"},${S + 0.3});`);
  } else {
    ent(`#${id}-h`, S + 0.05, { opacity: 0, y: 30 });
    ent(`#${id}-R`, S + 0.2, { opacity: 0, x: 40 });
    const passos = new Set(rev.filter((r) => r.linha).map((r) => r.passo));
    for (const r of rev) {
      if (r.linha) {
        J.push(`tl.to("#${r.id}",{opacity:1,backgroundColor:"rgba(214,58,154,0.30)",duration:.4},${T(r.passo).toFixed(2)});`);
        if (r.ult + 1 < n) J.push(`tl.to("#${r.id}",{opacity:.8,backgroundColor:"rgba(214,58,154,0)",duration:.4},${T(r.ult + 1).toFixed(2)});`);
      } else ent(`#${r.id}`, T(r.passo));
    }
  }
  if (!deck) {
    J.push(`tl.fromTo("#${id}-in",{opacity:0},{opacity:1,duration:.5},${S.toFixed(2)});`);
    J.push(`tl.to("#${id}-in",{opacity:0,duration:.5},${(S + dur - 0.5).toFixed(2)});`);
    const k0 = slide.tipo === "capa" ? [{}] : slide.itens;
    k0.forEach((_, k) => {
      const t0 = slide.tipo === "capa" ? S + 1.0 : T(k);
      const d = slide.tipo === "capa" ? 6 : durs[k];
      J.push(`tl.fromTo("#${id}-cap${k}",{opacity:0,y:14},{opacity:1,y:0,duration:.35},${t0.toFixed(2)});`);
      if (!(slide.tipo !== "capa" && k === n - 1)) J.push(`tl.to("#${id}-cap${k}",{opacity:0,duration:.3},${(t0 + d - 0.35).toFixed(2)});`);
    });
  }

  const wrapCls = deck ? "frame" : "frame vid";
  const sub = deck ? null : `<div id="${id}-in" class="${wrapCls}">${corpo}</div>`;
  let html;
  if (deck) {
    html = `<div id="${id}" data-composition-id="${id}" data-start="${S}" data-duration="${dur}" data-label="${esc(slide.titulo.slice(0, 40))}" data-width="1920" data-height="1080" style="position:relative;width:1920px;height:1080px;overflow:hidden">
<section id="${id}-sec" class="clip ${wrapCls}" data-start="${S}" data-duration="${dur}" data-track-index="1">${corpo}</section></div>`;
  } else {
    html = `<section id="${id}" class="clip ${wrapCls}" data-start="${S}" data-duration="${dur}" data-track-index="1"><div id="${id}-in" class="inner-wrap" style="position:absolute;inset:0">${corpo}</div></section>`;
  }
  return { html, sub, js: J.join("\n"), dur, frags, id };
}
