// Recorta a gravação bruta (sem o carregamento inicial) e acelera só a espera dos testes.
import fs from "node:fs";
import path from "node:path";
import { execFileSync } from "node:child_process";
import { fileURLToPath } from "node:url";
const V = path.join(path.dirname(fileURLToPath(import.meta.url)), "..", "video", "media");
const marcos = Object.fromEntries(JSON.parse(fs.readFileSync(path.join(V, "marcos.json"), "utf8")).map((m) => [m.id, m.t]));
const raw = path.join(V, "vscode-raw.webm");
const durRaw = +execFileSync("ffprobe", ["-v", "error", "-show_entries", "format=duration", "-of", "csv=p=0", raw]).toString();
const VEL = 6, TAIL = 2;
const T_A = +(marcos.pronto + 0.2).toFixed(2), T_S = +(marcos.testes + 6).toFixed(2), T_E = +(Math.min(durRaw - 1, marcos.ok - 1.5)).toFixed(2);
const f = `[0:v]fps=30,split=3[v1][v2][v3];[v1]trim=start=${T_A}:end=${T_S},setpts=PTS-STARTPTS[a];[v2]trim=start=${T_S}:end=${T_E},setpts=(PTS-STARTPTS)/${VEL}[b];[v3]trim=start=${T_E},setpts=PTS-STARTPTS,tpad=stop_mode=clone:stop_duration=${TAIL}[c];[a][b][c]concat=n=3:v=1:a=0[o]`;
execFileSync("ffmpeg", ["-loglevel", "error", "-y", "-i", raw, "-filter_complex", f, "-map", "[o]", "-c:v", "libx264", "-crf", "17", "-preset", "medium", "-pix_fmt", "yuv420p", "-movflags", "+faststart", path.join(V, "vscode.mp4")]);
const dur = +execFileSync("ffprobe", ["-v", "error", "-show_entries", "format=duration", "-of", "csv=p=0", path.join(V, "vscode.mp4")]).toString();
fs.writeFileSync(path.join(V, "base.json"), JSON.stringify({ T_A, T_S, T_E, VEL, dur: +dur.toFixed(2) }, null, 1));
console.log("base:", { T_A, T_S, T_E, VEL, dur });
