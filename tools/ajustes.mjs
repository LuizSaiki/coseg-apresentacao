// Ajustes pontuais: sem menções a "PBL 2", logo claro, e gravação que espera o resultado dos testes.
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
const aqui = path.dirname(fileURLToPath(import.meta.url));
const raiz = path.join(aqui, "..");
function editar(arquivo, pares) {
  const p = path.join(aqui, arquivo);
  let s = fs.readFileSync(p, "utf8");
  for (const [a, b] of pares) {
    if (!s.includes(a)) throw new Error(`${arquivo}: não achei: ${a.slice(0, 70)}`);
    s = s.split(a).join(b);
  }
  fs.writeFileSync(p, s);
}

// logo claro (Downloads) -> assets
fs.copyFileSync("C:/Users/SAIKI/Downloads/UNDB.jpeg", path.join(raiz, "assets", "logo-undb-claro.jpeg"));
fs.mkdirSync(path.join(raiz, "video", "assets"), { recursive: true });
fs.copyFileSync("C:/Users/SAIKI/Downloads/UNDB.jpeg", path.join(raiz, "video", "assets", "logo-undb-claro.jpeg"));

editar("conteudo.mjs", [
  ['A interface (PBL 2) envia o pedido de reserva ao servidor.', 'A interface web envia o pedido de reserva ao servidor.'],
  ['O servidor oferece endereços (rotas) que a interface do PBL 2 vai consumir', 'O servidor oferece endereços (rotas) para cadastrar, consultar e cancelar reservas'],
  ['Pronto para a interface do PBL 2 (rotas e respostas em JSON).', 'Rotas organizadas e respostas claras em JSON.'],
  ['E já está pronto para a interface do PBL 2, com rotas organizadas e respostas em JSON.', 'E oferece rotas organizadas e respostas em JSON, com mensagens claras de erro e sucesso.'],
  ['Rotas organizadas para o PBL 2', 'Rotas organizadas para a interface'],
]);

editar("build-slides.mjs", [
  ['PBL 2: o usuário preenche o pedido', 'o usuário preenche o pedido'],
  ['fs.readFileSync(path.join(aqui, "..", "assets", "logo-undb.png")).toString("base64")', 'fs.readFileSync(path.join(aqui, "..", "assets", "logo-undb-claro.jpeg")).toString("base64")'],
  ['"data:image/png;base64,"', '"data:image/jpeg;base64,"'],
  ['.top img{height:54px;width:auto;border-radius:6px}', '.top img{height:62px;width:auto;border-radius:12px;box-shadow:0 4px 14px rgba(109,47,160,.15)}'],
  ['.capa .clogo{position:absolute;left:150px;top:90px;width:291px;height:89px;border-radius:6px}', '.capa .clogo{position:absolute;left:150px;top:80px;width:340px;height:auto;border-radius:16px;box-shadow:0 8px 24px rgba(109,47,160,.18)}'],
  ['      <div class="dica rv" style="--d:1.2s">Use as setas ← → ou a barra de espaço · N mostra as notas · F tela cheia</div></section>`;', '</section>`;'],
]);

editar("build-video2.mjs", [
  ['É por eles que a interface do PBL 2 vai conversar com o servidor.', 'É por esses endereços que a interface conversa com o servidor.'],
  ['"Pronto para a interface do PBL 2"', '"Rotas organizadas e respostas claras em JSON"'],
  ['assets/logo-undb.png', 'assets/logo-undb-claro.jpeg'],
  ['.logo{position:absolute;width:291px;height:89px}', '.logo{position:absolute;width:340px;height:auto;border-radius:16px;box-shadow:0 8px 24px rgba(109,47,160,.18)}'],
  // o final dos testes vira dois passos: rodando e resultado (OK)
  ['["testes", ["Por fim, os testes automáticos do projeto, que verificam todas essas regras.", "42 testes, todos passando."]],', '["testes", ["Por fim, os testes automáticos do projeto, que verificam todas essas regras."]],\n  ["ok", ["Resultado: 42 testes executados, todos passando."]],'],
]);

// gravação: espera o resultado dos testes aparecer no terminal (em vez de um tempo fixo)
editar("gravar.mjs", [
  ['await cmd("../venv/Scripts/python.exe manage.py test -v 1", 62);\nmarco("fim");\nawait esperar(4);',
   'await cmd("../venv/Scripts/python.exe manage.py test -v 1", 1);\nawait page.waitForFunction(() => /Destroying test database/.test(document.querySelector(".xterm-rows")?.innerText || ""), null, { timeout: 300000 });\nmarco("ok");\nawait esperar(7);\nmarco("fim");'],
]);

// preparar-base: acelera só enquanto os testes rodam; mantém o resultado em tempo real
editar("preparar-base.mjs", [
  ['const T_A = +(marcos.pronto + 0.2).toFixed(2), T_S = +(marcos.testes + 6).toFixed(2), T_E = +(Math.min(durRaw - 2.5, marcos.fim + 0.8)).toFixed(2);',
   'const T_A = +(marcos.pronto + 0.2).toFixed(2), T_S = +(marcos.testes + 6).toFixed(2), T_E = +(Math.min(durRaw - 1, marcos.ok - 1.5)).toFixed(2);'],
  ['const VEL = 6, TAIL = 3;', 'const VEL = 6, TAIL = 2;'],
]);

// configuração do VS Code da gravação: terminal em DOM (permite ler o texto)
const cfg = path.join(raiz, "gravacao-repo", ".vscode", "settings.json");
const j = JSON.parse(fs.readFileSync(cfg, "utf8"));
j["terminal.integrated.gpuAcceleration"] = "off";
fs.writeFileSync(cfg, JSON.stringify(j, null, 2));
console.log("ajustes ok");
