import { createRequire } from "node:module";
const require = createRequire(import.meta.url);
const { chromium } = require(process.env.LOCALAPPDATA + "/npm-cache/_npx/53b5ca06f5b71ebd/node_modules/playwright-core");
const b = await chromium.launch({ headless: true, executablePath: process.env.CHROME_EXE });
const p = await (await b.newContext({ viewport: { width: 1920, height: 1080 } })).newPage();
await p.goto("http://127.0.0.1:4010/index.html?pdf"); await p.waitForTimeout(1500);
await p.pdf({ path: "../slides/COSEG-Mobilidade-slides.pdf", width: "1920px", height: "1080px", printBackground: true, margin: { top: 0, right: 0, bottom: 0, left: 0 } });
await b.close(); console.log("pdf ok");
