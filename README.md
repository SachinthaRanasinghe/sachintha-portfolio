# Sachintha Ranasinghe — Portfolio

Personal portfolio of Sachintha Ranasinghe, AI Systems Engineer. Static site (HTML/CSS/JS, no build step) served by GitHub Pages.

**Live:** https://sachintharanasinghe.github.io/sachintha-portfolio/

## Structure

- `index.html` — page layout and section copy
- `data.js` — projects (featured flag, case-study content, videos)
- `app.js` — project cards, case-study dialog with video player, hash routing (`#project/<slug>`), nav state
- `assistant.js` — "Ask my portfolio": answers from `data.js` in the browser, no API key
- `assets/videos` — project demo videos (H.264, faststart)

## Adding a project video

1. Compress: `ffmpeg -i in.mp4 -vf "scale='min(1280,iw)':-2" -c:v libx264 -crf 27 -preset slow -c:a aac -b:a 96k -movflags +faststart assets/videos/<slug>.mp4`
2. Add `{ label: "Demo · 0:30", src: "assets/videos/<slug>.mp4", poster: "assets/img/<slug>.jpg" }` to the project's `videos` array in `data.js`.

## Run locally

```sh
python3 -m http.server 8000
```
