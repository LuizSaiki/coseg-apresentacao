// Monta o vídeo final: abertura + gravação real do VS Code (Playwright) + legendas + fechamento.
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
const aqui = path.dirname(fileURLToPath(import.meta.url));
const V = path.join(aqui, "..", "video");
fs.mkdirSync(path.join(V, "compositions"), { recursive: true });
const marcos = Object.fromEntries(JSON.parse(fs.readFileSync(path.join(V, "media", "marcos.json"), "utf8")).map((m) => [m.id, m.t]));

// mapeamento do tempo da gravação bruta -> tempo do vídeo base (recorte + 6x na espera dos testes)
const base = JSON.parse(fs.readFileSync(path.join(V, "media", "base.json"), "utf8"));
const { T_A, T_S, T_E, VEL } = base;
const nt = (t) => (t <= T_S ? t - T_A : t <= T_E ? (T_S - T_A) + (t - T_S) / VEL : (T_S - T_A) + (T_E - T_S) / VEL + (t - T_E));
const DUR_BASE = base.dur, INTRO = 4.5, OUTRO = 6;
const TOTAL = +(INTRO + DUR_BASE + OUTRO).toFixed(2);

const passos = [
  ["arquivos", ["Este é o projeto COSEG aberto no VS Code. Tudo o que importa fica na pasta reservas."]],
  ["models_veiculo", ["No arquivo models.py estão as tabelas do banco. Primeiro, o Veículo: código, categoria e capacidade.", "A capacidade vem da categoria: leve = 4 lugares, coletivo = 18."]],
  ["models_reserva", ["Depois, a Reserva: quem pediu, origem, destino, data, horários e passageiros.", "Cada reserva aponta para um veículo."]],
  ["cap_const", ["Em services.py ficam as regras do negócio. A primeira é a capacidade: leve 4, coletivo 18.", "Acima de 18 passageiros, nunca; retorno no máximo 1 dia depois."]],
  ["cap_regra", ["De volta ao models.py: antes de salvar, o código compara os passageiros com a capacidade do veículo.", "Passou de 18, ou mais do que cabe no carro escolhido? Rejeita e explica o erro."]],
  ["periodo_data", ["Agora, a validação de datas. Se a data de saída já passou, o servidor devolve um erro.", "O trecho compara a data pedida com a data de hoje."]],
  ["periodo_retorno", ["E o horário de retorno precisa ser depois da saída; se não for, a reserva é recusada."]],
  ["conflito_services", ["O coração do sistema: há conflito se uma reserva começa antes de a outra terminar", "e termina depois de a outra começar (r.inicio < fim e r.fim > inicio)."]],
  ["conflito_model", ["No models.py, a reserva consulta o banco antes de gravar e trava o veículo para ninguém reservar junto.", "Achou conflito? Devolve: “VL-01 já está reservado nesse intervalo”."]],
  ["disponibilidade", ["Se o usuário só informa a categoria, o servidor escolhe o veículo: primeiro tira os que já estão ocupados.", "Depois ordena do menor para o maior e sugere o primeiro."]],
  ["rotas", ["O urls.py lista os endereços da API: veículos, reservas, cancelar e disponibilidade.", "É por esses endereços que a interface conversa com o servidor."]],
  ["login", ["No views.py, o login limita tentativas: depois de cinco erros, bloqueia por cinco minutos.", "Só usuários logados acessam o sistema."]],
  ["transacao", ["Ao criar uma reserva, tudo ocorre numa transação: ou valida e grava, ou nada é gravado."]],
  ["permissoes", ["Só o COSEG pode alterar a frota,", "e cada colaborador só mexe nas próprias reservas."]],
  ["terminal", ["Agora, o sistema funcionando: pedidos de reserva reais disparados no terminal.", "9h às 11h bate com a reserva de 8h às 10h: conflito, código 409.", "10h30 às 12h passa (201). Carro lotado, 19 pessoas e retorno antes da saída: recusados (400)."]],
  ["testes", ["Por fim, os testes automáticos do projeto, que verificam todas essas regras."]],
  ["ok", ["Resultado: 42 testes executados, todos passando."]],
];
const fim = nt(marcos.fim);
const ids = passos.map(([id]) => id);
const caps = []; // {t0, t1, txt}
passos.forEach(([id, textos], i) => {
  const ini = nt(marcos[id]) + 0.6;
  const prox = i + 1 < passos.length ? nt(marcos[ids[i + 1]]) - 0.3 : DUR_BASE - 0.5;
  const fatia = (prox - ini) / textos.length;
  textos.forEach((txt, k) => caps.push({ t0: +(ini + k * fatia).toFixed(2), t1: +(ini + (k + 1) * fatia - 0.1).toFixed(2), txt }));
});

const esc = (s) => s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
const tpl = (id, dur, css, corpo, js) => `<!doctype html>
<html lang="pt-BR"><head><meta charset="UTF-8"/></head><body>
<template>
<style>${css}</style>
<div data-composition-id="${id}" data-width="1920" data-height="1080" data-duration="${dur}" style="position:absolute;inset:0">
${corpo}
</div>
<script>
const tl = gsap.timeline({ paused: true });
${js}
window.__timelines["${id}"] = tl;
</script>
</template></body></html>`;

const COMUM = `.logo{position:absolute;width:340px;height:auto;border-radius:16px;box-shadow:0 8px 24px rgba(109,47,160,.18)}
.chip{display:inline-block;font:700 34px system-ui,sans-serif;padding:10px 26px;border-radius:999px;border:3px solid #c62a88;color:#1b1033;background:#fff;margin-right:16px}`;

// ---------- INTRO ----------
fs.writeFileSync(path.join(V, "compositions", "intro.html"), tpl("intro", INTRO, COMUM + `
#intro-bg{position:absolute;inset:0;background:radial-gradient(1200px 800px at 100% 0%,#f3d9ec,transparent 60%),radial-gradient(900px 700px at 0% 100%,#e4d9f6,transparent 60%),#faf7fd}
#intro-blob{position:absolute;right:-140px;top:-120px;width:640px;height:640px;border-radius:70px;transform:rotate(16deg);background:linear-gradient(135deg,#e5303a,#c62a88 55%,#6d2fa0);opacity:.92}
#intro-blob2{position:absolute;right:230px;top:640px;width:300px;height:300px;border-radius:44px;transform:rotate(-9deg);background:linear-gradient(135deg,#c62a88,#6d2fa0);opacity:.55}
#intro-logo{left:150px;top:110px}
#intro-t{position:absolute;left:150px;top:330px;font:900 150px/1 system-ui,sans-serif;letter-spacing:-.03em;color:#1b1033;overflow:hidden;padding-bottom:12px}
#intro-t span{display:block}
#intro-s{position:absolute;left:150px;top:575px;width:1250px;font:600 54px/1.25 system-ui,sans-serif;color:#3a2a5c}
#intro-r{position:absolute;left:150px;top:520px;width:220px;height:10px;border-radius:5px;background:linear-gradient(90deg,#e5303a,#c62a88,#6d2fa0)}
#intro-c{position:absolute;left:150px;top:780px}
#intro-all{position:absolute;inset:0}`,
`<div id="intro-all"><div id="intro-bg"></div><div id="intro-blob"></div><div id="intro-blob2"></div>
<img id="intro-logo" class="logo" src="assets/logo-undb-claro.jpeg" alt="UNDB Centro Universitário"/>
<div id="intro-t"><span id="intro-t1">COSEG Mobilidade</span></div>
<div id="intro-r"></div>
<div id="intro-s">O código por dentro: um passeio guiado pelo servidor Django</div>
<div id="intro-c"><span class="chip">Programação para Web</span><span class="chip">PBL 1</span><span class="chip">Python + Django</span></div></div>`,
`tl.fromTo("#intro-blob",{x:300,rotation:30,opacity:0},{x:0,rotation:16,opacity:.92,duration:1.4,ease:"power3.out"},0);
tl.fromTo("#intro-blob2",{x:-300,opacity:0},{x:0,opacity:.55,duration:1.4,ease:"power3.out"},.15);
tl.fromTo("#intro-logo",{opacity:0,y:-24},{opacity:1,y:0,duration:.8,ease:"power3.out"},.1);
tl.fromTo("#intro-t1",{yPercent:110},{yPercent:0,duration:.9,ease:"power4.out"},.3);
tl.fromTo("#intro-r",{scaleX:0,transformOrigin:"left center"},{scaleX:1,duration:.8,ease:"power3.inOut"},.7);
tl.fromTo("#intro-s",{opacity:0,y:30},{opacity:1,y:0,duration:.8,ease:"power3.out"},.9);
tl.fromTo("#intro-c",{opacity:0,y:30},{opacity:1,y:0,duration:.8,ease:"power3.out"},1.2);
tl.to("#intro-all",{opacity:0,duration:.7,ease:"power2.inOut"},${INTRO - 0.7});`));

// ---------- LEGENDAS ----------
const capsHtml = caps.map((c, i) => `<div id="cap${i}" class="cap">${esc(c.txt)}</div>`).join("\n");
const capsJs = caps.map((c, i) => `tl.fromTo("#cap${i}",{opacity:0,y:18},{opacity:1,y:0,duration:.45,ease:"power3.out"},${c.t0});
tl.to("#cap${i}",{opacity:0,y:-10,duration:.35,ease:"power2.in"},${Math.max(c.t0 + 0.6, c.t1 - 0.35).toFixed(2)});`).join("\n");
fs.writeFileSync(path.join(V, "compositions", "legendas.html"), tpl("legendas", DUR_BASE, `
#capzona{position:absolute;left:135px;width:1650px;bottom:18px;height:100px}
.cap{position:absolute;left:0;right:0;bottom:0;min-height:96px;display:flex;align-items:center;justify-content:center;text-align:center;font:700 36px/1.22 system-ui,sans-serif;color:#fff;background:#1b1033;border-radius:16px;padding:12px 32px;border-left:10px solid #e5307f;box-shadow:0 8px 24px rgba(27,16,51,.25);opacity:0}
#prog-t{position:absolute;left:135px;width:1650px;top:957px;height:5px;border-radius:3px;background:#d8cfe8}
#prog{position:absolute;left:135px;width:1650px;top:957px;height:5px;border-radius:3px;background:linear-gradient(90deg,#e5303a,#c62a88,#6d2fa0);transform-origin:left center}`,
`<div id="prog-t"></div><div id="prog"></div><div id="capzona">
${capsHtml}
</div>`,
`tl.fromTo("#prog",{scaleX:0},{scaleX:1,duration:${DUR_BASE},ease:"none"},0);
${capsJs}`));

// ---------- OUTRO ----------
const itensOutro = ["42 testes automáticos passando", "Capacidade, data, horário e conflito validados no servidor", "Rotas organizadas e respostas claras em JSON"];
fs.writeFileSync(path.join(V, "compositions", "outro.html"), tpl("outro", OUTRO, COMUM + `
#o-bg{position:absolute;inset:0;background:radial-gradient(1100px 700px at 0% 0%,#f3d9ec,transparent 60%),radial-gradient(900px 700px at 100% 100%,#e4d9f6,transparent 60%),#faf7fd}
#o-logo{left:150px;top:100px}
#o-t{position:absolute;left:150px;top:260px;width:1500px;font:900 92px/1.05 system-ui,sans-serif;letter-spacing:-.02em;color:#1b1033}
#o-l{position:absolute;left:150px;top:600px;display:flex;flex-direction:column;gap:22px}
.o-i{display:flex;align-items:center;gap:22px;font:700 50px/1.1 system-ui,sans-serif;color:#1b1033}
.o-i i{flex:none;width:56px;height:56px;border-radius:50%;background:#1f9d6e;display:grid;place-items:center}
#o-all{position:absolute;inset:0}`,
`<div id="o-all"><div id="o-bg"></div>
<img id="o-logo" class="logo" src="assets/logo-undb-claro.jpeg" alt="UNDB"/>
<div id="o-t">O servidor Django é a fonte de verdade e barra os erros antes de gravar</div>
<div id="o-l">
${itensOutro.map((t, i) => `<div class="o-i" id="o-i${i}"><i><svg width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="#fff" stroke-width="3.4" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12.5l4.5 4.5L19 7"/></svg></i><span>${t}</span></div>`).join("\n")}
</div></div>`,
`tl.fromTo("#o-all",{opacity:0},{opacity:1,duration:.7,ease:"power2.out"},0);
tl.fromTo("#o-logo",{opacity:0,y:-20},{opacity:1,y:0,duration:.7,ease:"power3.out"},.2);
tl.fromTo("#o-t",{opacity:0,y:40},{opacity:1,y:0,duration:.9,ease:"power3.out"},.4);
["#o-i0","#o-i1","#o-i2"].forEach((s,i)=>tl.fromTo(s,{opacity:0,x:-40},{opacity:1,x:0,duration:.7,ease:"power3.out"},1.3+i*.6));`));

// ---------- INDEX ----------
const host = (id, ini, dur, tr) => `<div id="${id}" class="clip" data-composition-id="${id}" data-composition-src="compositions/${id}.html" data-start="${ini}" data-duration="${dur}" data-track-index="${tr}" data-width="1920" data-height="1080"></div>`;
fs.writeFileSync(path.join(V, "index.html"), `<!doctype html>
<html lang="pt-BR"><head><meta charset="UTF-8"/><meta name="viewport" content="width=1920, height=1080"/><title>COSEG Mobilidade — o código por dentro</title>
<script src="https://cdn.jsdelivr.net/npm/gsap@3.14.2/dist/gsap.min.js"></script>
<style>*{margin:0;padding:0;box-sizing:border-box}html,body{width:1920px;height:1080px;overflow:hidden;background:#eceaf6}
#root{position:relative;width:100%;height:100%;overflow:hidden;background:radial-gradient(1200px 800px at 0% 0%,#f6e1ee,transparent 60%),radial-gradient(1000px 800px at 100% 100%,#e2dbf5,transparent 60%),#f1eef8}
#vscode{position:absolute;left:135px;top:18px;width:1650px;height:928px;border-radius:14px;object-fit:cover;box-shadow:0 18px 50px rgba(27,16,51,.28),0 0 0 1px rgba(27,16,51,.12)}</style></head>
<body>
<div id="root" data-composition-id="main" data-start="0" data-width="1920" data-height="1080" data-duration="${TOTAL}">
<video id="vscode" src="media/vscode.mp4" data-start="${INTRO}" data-duration="${DUR_BASE}" data-track-index="1" muted playsinline></video>
${host("legendas", INTRO, DUR_BASE, 2)}
${host("intro", 0, INTRO, 3)}
${host("outro", +(INTRO + DUR_BASE).toFixed(2), OUTRO, 3)}
</div>
<script>
const tl = gsap.timeline({ paused: true });
window.__timelines["main"] = tl;
</script></body></html>`);
console.log("vídeo:", TOTAL, "s,", caps.length, "legendas");
