# floofybottoms.com

A plain static site with no build step. Netlify publishes this folder exactly as it is.

## Pages
| URL | File |
|---|---|
| `/` | `index.html` (studio home) |
| `/a-maize-in-mazes/` | `a-maize-in-mazes/index.html` (game page, the canonical URL) |
| `/maize` | 301 redirect to `/a-maize-in-mazes/` (see `_redirects`) |
| `/a-maize-in-mazes/press/` | press kit |
| `/privacy/`, `/eula/` | placeholders |
| `/discord`, `/steam`, `/wishlist`, `/playtest`, `/press` | short links (see `_redirects`) |

## Deploy (Netlify)
1. Push this folder to a new repo, e.g. `floofybottoms/website`.
2. In Netlify, go to Add new site → Import from Git and pick the repo. Leave the build command blank. Set the publish directory to `.`.
3. Under Domain management, add `floofybottoms.com` and `www`. **Keep DNS at Porkbun.** Add only the A/ALIAS and CNAME records Netlify gives you. Don't switch nameservers to Netlify, or your Google email records will break.

Redirects only work on Netlify, not when you open the files locally.

## Swapping in real art
Drop your files into `assets/img/` with **the same file names** and they appear everywhere:

| File | What | Size |
|---|---|---|
| `key-art.jpg` | key art | 1920×1080 |
| `capsule-header.jpg` | Steam header capsule (studio home card + press kit) | 920×430 |
| `og-image.jpg` | preview image when the link is shared on Discord, X, etc. | 1200×630 |
| `screenshot-1.jpg` … `screenshot-6.jpg` | screenshots | 1920×1080 |
| `gameplay-loop.jpg` | still shown where the trailer will go | 1280×720 |
| `mascot.png` | full mascot, transparent (press kit + 404 page) | any |
| `mascot-body.png` | mascot with the pupils painted out; the page draws the moving pupils and the plastic shine on top | keep the same size, or the eye positions need re-measuring |
| `pom-placeholder.svg` | studio logo placeholder, used in the nav and on the home page | square |

If your file uses a different extension (.png or .webp), find and replace the name in the HTML files.

## Settings (top of `assets/js/site.js`)
- **Launch switch:** `mode: "auto"` flips every button from *Wishlist / Join the Playtest* to *Buy on Steam, $3.99* at `releaseAt` (Nov 6, 2026, 10:00 AM PT). If the release slips, set `mode: "prelaunch"`. To flip early, set `"launched"`.
- **Trailer:** paste the YouTube ID into `youtubeId`. For a looping gameplay clip before then, put an MP4 at `assets/img/gameplay-loop.mp4` and set `loopVideo: "/assets/img/gameplay-loop.mp4"`.

## Discord
In `_redirects`, replace the Steam URL on the `/discord` line with your permanent `discord.gg/...` invite. Reveal the game's category before you do.

## Fonts
Chewy and Nunito are self-hosted in `assets/fonts/`. Both use the SIL Open Font License, so they're free for commercial use.
