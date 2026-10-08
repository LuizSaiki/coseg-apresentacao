import { createRequire } from "node:module";
import fs from "node:fs";
const require = createRequire(import.meta.url);
const { chromium } = require(process.env.LOCALAPPDATA + "/npm-cache/_npx/53b5ca06f5b71ebd/node_modules/playwright-core");
fs.mkdirSync("cap", { recursive: true });
const b = await chromium.launch({ headless: true, executablePath: process.env.CHROME_EXE });
const p = await (await b.newContext({ viewport: { width: 1920, height: 1080 } })).newPage();
await p.goto("http://127.0.0.1:4010/index.html");
await p.waitForTimeout(800);
const total = await p.evaluate(() => window.__slides.total);
for (let i = 0; i < total; i++) {
  const n = await p.evaluate((i) => { const s = document.querySelectorAll(".slide")[i]; return +s.dataset.n; }, i);
  await p.evaluate(([i, n]) => window.__slides.ir(i, n), [i, n]);
  await p.waitForTimeout(1800);
  await p.screenshot({ path: `cap/slide-${String(i + 1).padStart(2, "0")}.png` });
}
await b.close();
console.log("ok", total);
