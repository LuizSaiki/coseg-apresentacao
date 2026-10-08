// Grava, com o Playwright, um passeio real pelo código no VS Code (versão web) — sem áudio.
import { createRequire } from "node:module";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
const require = createRequire(import.meta.url);
const { chromium } = require(process.env.LOCALAPPDATA + "/npm-cache/_npx/53b5ca06f5b71ebd/node_modules/playwright-core");
const aqui = path.dirname(fileURLToPath(import.meta.url));
const saida = path.join(aqui, "..", "video", "media");
fs.mkdirSync(saida, { recursive: true });
for (const f of fs.readdirSync(saida)) if (f.endsWith(".webm")) fs.unlinkSync(path.join(saida, f));

const pasta = "/c:/Users/SAIKI/Desktop/Claude/Sessions/coseg-apresentacao/gravacao-repo";
const browser = await chromium.launch({ headless: true, executablePath: process.env.CHROME_EXE });
{ // pré-passo (sem gravar): encerra terminais antigos que o servidor do VS Code mantém vivos
  const c0 = await browser.newContext({ viewport: { width: 1920, height: 1080 }, locale: "en-US" });
  const p0 = await c0.newPage();
  await p0.goto("http://127.0.0.1:8765/?folder=" + pasta, { waitUntil: "load" });
  await p0.waitForSelector(".monaco-workbench", { timeout: 90000 }); await p0.waitForTimeout(4000);
  try { await p0.click("text=Trust Folder & Continue", { timeout: 4000 }); await p0.waitForTimeout(1500); } catch {}
  await p0.keyboard.press("F1"); await p0.waitForTimeout(600);
  await p0.keyboard.type("Terminal: Kill All Terminals", { delay: 30 }); await p0.waitForTimeout(800); await p0.keyboard.press("Enter"); await p0.waitForTimeout(2500);
  await c0.close();
}
const t0 = Date.now();
const ctx = await browser.newContext({ viewport: { width: 1920, height: 1080 }, locale: "en-US", recordVideo: { dir: saida, size: { width: 1920, height: 1080 } } });
const page = await ctx.newPage();
const marcos = [];
const marco = (id) => { marcos.push({ id, t: +((Date.now() - t0) / 1000).toFixed(2) }); console.log(id, marcos.at(-1).t); };
const esperar = (s) => page.waitForTimeout(s * 1000);
const tecla = async (k, n = 1, gap = 0) => { for (let i = 0; i < n; i++) { await page.keyboard.press(k); if (gap) await page.waitForTimeout(gap); } };

await page.goto("http://127.0.0.1:8765/?folder=" + pasta, { waitUntil: "load" });
await page.waitForSelector(".monaco-workbench", { timeout: 90000 });
await page.waitForSelector(".explorer-folders-view .monaco-list-row", { timeout: 60000 });
await esperar(3);
try { await page.click("text=Trust Folder & Continue", { timeout: 4000 }); await esperar(1.5); } catch {}
try { await page.click('.notifications-toasts .codicon-close, .monaco-workbench .notification-toast .codicon-close', { timeout: 1500 }); } catch {}
await esperar(1.5);

// aquecimento (cortado do vídeo): confia na pasta e abre o terminal uma vez para o shell já estar pronto
await tecla("F1"); await esperar(0.6); await page.keyboard.type("Terminal: Create New Terminal", { delay: 25 }); await esperar(0.9); await tecla("Enter");
try { await page.click("text=Trust Folder & Continue", { timeout: 9000 }); } catch {}
await esperar(6);
await tecla("Control+Backquote"); await esperar(1.5);   // recolhe o painel

// ---- ações reutilizáveis ----
async function abrir(arq) { await tecla("Control+p"); await esperar(0.5); await page.keyboard.type(arq, { delay: 70 }); await esperar(0.8); await tecla("Enter"); await esperar(1.2); }
async function selecionar(a, b) {
  await tecla("Control+g"); await esperar(0.4); await page.keyboard.type(String(a), { delay: 90 }); await tecla("Enter"); await esperar(1.0);
  await tecla("Home"); await tecla("Shift+ArrowDown", b - a + 1, 110);
}
async function limpar() { await tecla("Escape"); }

// ---- roteiro ----
marco("pronto");
await esperar(1.5);
marco("arquivos");
await page.click('.explorer-folders-view :text("reservas")'); await esperar(1.0);
await esperar(4.5);

marco("models_veiculo");
await abrir("reservas/models.py"); await tecla("Control+b"); await esperar(0.8); await selecionar(29, 37); await esperar(5.5);
marco("models_reserva");
await selecionar(72, 88); await esperar(6);
marco("cap_const");
await abrir("reservas/services.py"); await selecionar(8, 10); await esperar(5);
marco("cap_regra");
await abrir("reservas/models.py"); await selecionar(198, 217); await esperar(7);
marco("periodo_data");
await abrir("reservas/services.py"); await selecionar(32, 35); await esperar(5);
marco("periodo_retorno");
await selecionar(54, 60); await esperar(5.5);
marco("conflito_services");
await selecionar(79, 83); await esperar(8);
marco("conflito_model");
await abrir("reservas/models.py"); await selecionar(224, 238); await esperar(7);
marco("disponibilidade");
await abrir("reservas/services.py"); await selecionar(91, 104); await esperar(7);
marco("rotas");
await abrir("reservas/urls.py"); await selecionar(4, 15); await esperar(7);
marco("login");
await abrir("reservas/views.py"); await selecionar(169, 190); await esperar(7);
marco("transacao");
await selecionar(288, 299); await esperar(6.5);
marco("permissoes");
await selecionar(145, 154); await esperar(6.5);

// ---- terminal ----
marco("terminal");
await tecla("Control+Backquote"); await esperar(3);
const cmd = async (txt, espera) => { await page.keyboard.type(txt, { delay: 45 }); await tecla("Enter"); await esperar(espera); };
await cmd("../venv/Scripts/python.exe ../tools/demo_terminal.py", 9);
marco("testes");
await tecla("Control+l"); await esperar(0.5);
await cmd("../venv/Scripts/python.exe manage.py test -v 1", 1);
await page.waitForFunction(() => /Destroying test database/.test(document.querySelector(".xterm-rows")?.innerText || ""), null, { timeout: 300000 });
marco("ok");
await esperar(7);
marco("fim");

await fs.promises.writeFile(path.join(saida, "marcos.json"), JSON.stringify(marcos, null, 1));
const vid = page.video();
await ctx.close();
console.log("vídeo:", await vid.path());
await browser.close();
