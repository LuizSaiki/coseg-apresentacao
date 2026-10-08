# COSEG Mobilidade — apresentação (slides + vídeo)

Material de apresentação do sistema de reserva de veículos do COSEG (Porto do Itaqui),
baseado no repositório `Dantas-PRO/COSEG_beta` (Python + Django). Programação para Web — UNDB, PBL 1.

## O que já está pronto (é só abrir)

| Arquivo | O que é |
|---|---|
| `slides/index.html` | Slides. Abra no navegador (funciona offline). Setas ou espaço avançam; **N** mostra as notas do apresentador; **F** tela cheia. |
| `slides/COSEG-Mobilidade-slides.pdf` | Os mesmos slides em PDF (reserva). |
| `video/renders/COSEG-Mobilidade-video.mp4` | Vídeo (3 min 34 s, sem áudio, com legendas): passeio real pelo código no VS Code, terminal rodando os pedidos e os 42 testes. |

## Como regenerar (opcional)

Requer Node 20+ e, para refazer a gravação, o VS Code (`code serve-web`), Python 3.12+ com Django 6.1.2, ffmpeg e o `playwright-core`.

```bash
git clone https://github.com/Dantas-PRO/COSEG_beta.git repo      # código analisado (não está neste repositório)
node tools/build-slides.mjs      # gera slides/index.html a partir de tools/conteudo.mjs
node tools/build-video2.mjs      # gera video/index.html e video/compositions/ (precisa de video/media/vscode.mp4)
cd video && npx hyperframes@0.8.142 render --quality looks --fps 30 --output renders/COSEG-Mobilidade-video.mp4
```

- `tools/conteudo.mjs` — textos e trechos de código dos slides (os trechos são lidos do repositório `repo/`, com números de linha reais).
- `tools/gravar.mjs` — roteiro do Playwright que grava o VS Code (caminhos absolutos do Windows: ajuste antes de usar em outro computador).
- `tools/preparar-base.mjs` — recorta a gravação e acelera só a espera dos testes.
- `tools/demo_terminal.py` — pedidos de reserva mostrados no terminal durante o vídeo (modo demonstração).
- `video/media/vscode.mp4` — gravação já recortada, usada pelo vídeo.
