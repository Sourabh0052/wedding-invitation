# ॐ Shubh Vivah — Indian Wedding Invitation

A cinematic interactive wedding invitation in the traditional Hindu card format: it opens with ॥ श्री गणेशाय नमः ॥, Shri Ganesh ji and the Vakratunda shloka, over a mandir-on-the-lake scene with marigold ladis and diyas. It also has a 3D envelope that opens, a full-screen wedding film, event cards, a live countdown, a Google Map, an RSVP form, and a share screen. It's built with **React + Vite, Tailwind CSS v4, Framer Motion and Lucide**, and deploys free on **Vercel**.

Guests open one link and need no app and no sign-up. It works on phones, tablets and desktops.

---

## Guest journey

| # | Screen | What happens |
|---|--------|--------------|
| 1 | **Welcome** | Ganesh ji with ॥ श्री गणेशाय नमः ॥, the mandir-on-the-lake scene, floating petals, the couple illustration, a sealed envelope. **Open Invitation** breaks the wax seal, opens the flap and slides out the letter. This tap also starts the music. |
| 2 | **Film** | Full-screen MP4 with custom controls (play/pause, seek, replay, mute, full screen, **Skip Video**). Background music pauses while the film has sound. If the film can't load, a fallback image appears. |
| 3 | **Invitation** | Names, parents, date, time, venue, message, and a "watch the film again" button. |
| 4 | **Events** | One colourful card per ceremony (Lagan-Sagai, Shaadi, …) with scroll animations. |
| 5 | **Countdown** | Live days / hours / minutes / seconds, plus **Add to Google Calendar**. |
| 6 | **Venue** | Embedded Google Map, **Get Directions** and **Copy Address**. |
| 7 | **RSVP** | Name, attendees, yes/no and a note. Saved in the browser by default, and can be sent to Formspree, Google Sheets or your own API. |
| 8 | **Closing** | Farewell message, **Share Invitation** (native share sheet or copy link) and **Send on WhatsApp**. |

Personal greeting: share `https://your-site.vercel.app/?guest=Priya` and that guest sees *"Dear Priya,"* with the RSVP name pre-filled.

---

## 1. Install & run

Requires **Node.js 20+** (check with `node -v`).

```bash
cd wedding-invitation
npm install          # install dependencies
npm run dev          # dev server → http://localhost:5173
```

To test on your phone over the same Wi-Fi, run `npm run dev -- --host` and open the "Network" URL it prints.

```bash
npm run build        # production build → dist/
npm run preview      # serve the production build → http://localhost:4173
```

---

## 2. Customise everything in one file

**`src/config/weddingConfig.js`** controls all the text, dates, events, venue, media paths and RSVP settings. You never need to edit a component.

| Setting | What it controls |
|---|---|
| `couples[]` | One entry per couple: short names, full names, parents' lines and an optional photo. Two couples (or more) are fully supported. |
| `coupleJoiner` / `hashtag` | The word between names (`weds`, `&`, `संग`…) and an optional hashtag |
| `wedding.dateTime` | The wedding moment in ISO format **with the UTC offset**, e.g. `2027-02-14T19:00:00+05:30`. Drives the countdown and calendar link. |
| `wedding.timeZone` | Venue time zone (e.g. `Asia/Kolkata`) so every guest sees venue time |
| `welcome.*` / `invitation.*` / `closing.*` | All the wording |
| `events[]` | Add, remove or reorder events. `icon` can be `sagai`, `haldi`, `mehendi`, `sangeet`, `wedding`, `reception` or `default`. |
| `gallery.photos[]` | Your own photos for the "Our Moments" section (hidden while empty) |
| `venue.*` | Venue name and address. The map and directions links are built automatically, or you can paste your own. |
| `media.*` | Video, music and image paths |
| `rsvp.*` | Where RSVPs go (see §4) |
| `meta.*` | Browser-tab title and the WhatsApp/social link-preview text |

### Colours

Pick the overall look with **`theme.palette`** in `weddingConfig.js`:

- `'pastel'` (default): blush pink, ivory, cream, champagne gold and light peach. Soft and dreamy.
- `'festive'`: marigold yellow, sindoor red and leaf green. Bright and colourful.

The CSS colour tokens live at the top of `src/index.css`; the pastel overrides are under `:root[data-palette='pastel']`. The hand-drawn decorations (garland, petals, roses, envelope) take their colours from `src/theme.js`.

### Names

`nameOrder: 'bride-first'` shows "Sheetal ♥ Gaurav"; `'groom-first'` shows "Gaurav ♥ Sheetal". `coupleJoiner: 'heart'` draws the ♥; set it to a word (`'weds'`, `'&'`, `'संग'`) to show that word instead.

### Add your own photos

1. Copy your original photos (straight from the phone is fine) into **`my-photos/`**.
2. Run **`npm run photos`**. Each photo is shrunk to a fast-loading WebP (≈150–300 KB) in `public/images/photos/`, and the exact lines to paste are printed.
3. In `weddingConfig.js`:
   - **Couple portrait:** set `photo: '/images/photos/gaurav-sheetal.webp'` on that couple. The welcome, invitation and closing screens then show each couple's photo in an arched gold frame instead of the illustration. Portrait photos work best (about 4:5). If faces are cut off, add `photoPosition: 'center 20%'`.
   - **Gallery:** add `{ src: '/images/photos/xyz.webp', caption: 'Optional caption' }` items to `gallery.photos`. Guests can tap a photo to view it full screen, and swipe between photos.
4. Check it with `npm run dev`.

Your originals in `my-photos/` are never changed and are not uploaded to GitHub. iPhone `.HEIC` photos need `pip install pillow-heif` first, or export them as JPG.

### The illustrations in `img/`

`npm run art` (`scripts/prepare_art.py`) turns the pictures in `img/` into web files: `3.jpeg` becomes the couple illustration with its white background removed, and also `couples-two.webp` (both couples side by side, couple 2 mirrored, outfits re-dyed blush and peach), `5.png` and `1.jpeg` become the Lagan-Sagai and Shaadi card pictures (`events[].image`), and `2.jpeg` becomes the countdown and closing background (`media.images.celebration`). Re-run it if you replace any of them.

### Replace the wedding film, music and art

Drop your files into `public/`, keeping the same names, or use new names and update the paths in `media`:

| File | Purpose | Tips |
|---|---|---|
| `public/videos/wedding-invitation.mp4` | The invitation film | H.264 + AAC MP4, 720p–1080p, aim for **under 15 MB**. See the compression command below. |
| `public/audio/background-music.mp3` | Looping background music | 96–128 kbps MP3, 1–3 MB |
| `public/images/couple.webp` | Couple illustration | **Transparent** PNG or WebP, portrait, about 900×1140 |
| `public/images/background.webp` | Welcome scene (mandir on a lotus lake) | 1920×1080, WebP or JPG, under 300 KB |
| `public/images/og-image.jpg` | Link-preview image | 1200×630 JPG |

The video is shown with `fit: 'contain'` by default, so it's never cropped and a blurred backdrop fills the edges. Set `fit: 'cover'` to fill the whole screen. Set `media.video.enabled: false` to skip the film screen.

**Compress a video for fast mobile loading** (needs [ffmpeg](https://ffmpeg.org)):

```bash
ffmpeg -i my-film.mov -vf "scale=-2:1080" -c:v libx264 -crf 24 -preset slow \
  -profile:v main -pix_fmt yuv420p -c:a aac -b:a 128k -movflags +faststart \
  public/videos/wedding-invitation.mp4
```

`+faststart` lets the film start playing before it has fully downloaded. Use `scale=-2:720` and `-crf 26` for an even lighter file.

**Convert an image to WebP:** `ffmpeg -i couple.png -quality 88 public/images/couple.webp`, or use [squoosh.app](https://squoosh.app).

> The welcome scene, link-preview image, favicon and the 12-second film (Ganesh vandana, then the couples) are drawn by `scripts/indian_art.py` (`npm run indian`). To have the Vakratunda mantra chanted over Ganesh ji in the film, save a recording as `img/ganesh-mantra.mp3` (`.m4a`, `.wav`, `.ogg` or `.opus` also work, e.g. a WhatsApp voice note) and run `npm run indian`: the Ganesh scene lasts as long as the chant, and the music plays softly underneath. The names, dates and venue in the film are set at the top of that script, so edit them there and re-run it if they change (needs Python with numpy and Pillow, plus ffmpeg with librsvg). The Ganesh picture is "Shri Mangalmurti" from the Raja Ravi Varma Press, which is public domain (source: `img/ganesh-mangalmurti.jpg`, via Wikimedia Commons). To use your own, replace `public/images/ganesh.webp` or change `invocation.image` in the config. The background music is an original music-box waltz (`public/audio/background-music.mp3`); to use your own, replace that file and run `npm run indian` so the film picks it up.

---

## 3. Deploy: GitHub → Vercel → public URL

### a) Push the code to GitHub

1. Create an **empty** repository at <https://github.com/new> (e.g. `wedding-invitation`; it can be private).
2. In the project folder:

```bash
git init
git add .
git commit -m "Wedding invitation"
git branch -M main
git remote add origin https://github.com/<your-username>/wedding-invitation.git
git push -u origin main
```

### b) Import into Vercel

1. Sign in at <https://vercel.com> with your GitHub account. The Hobby plan is free.
2. **Add New… → Project**, then pick the `wedding-invitation` repository and click **Import**.
3. Vercel detects **Vite** automatically (build `npm run build`, output `dist`). Click **Deploy**.
4. After about a minute you get a public URL such as **`https://wedding-invitation-xyz.vercel.app`**. That's the link to send guests.

**Prettier URL:** under **Project → Settings → Domains**, you can rename the `.vercel.app` subdomain (e.g. `ananya-weds-arjun.vercel.app`) or connect a domain you own.

**Link previews:** once you have the final URL, put it in `meta.siteUrl` in `weddingConfig.js` and push. WhatsApp and iMessage need an absolute image URL to show the preview picture.

**Alternative without GitHub** (Vercel CLI):

```bash
npm i -g vercel
vercel          # first deploy (preview URL)
vercel --prod   # production URL
```

### c) Updating later

Edit `weddingConfig.js` or swap files in `public/`, then:

```bash
git add .
git commit -m "Update invitation details"
git push
```

Vercel redeploys automatically within a minute, and the URL stays the same.

---

## 4. Collecting RSVPs

Every response is always saved in the guest's own browser (`localStorage`), so they can come back and edit it. To **receive** responses yourself, set `rsvp.mode` and `rsvp.endpoint`:

**Option A: Formspree (easiest, emails you each RSVP)**
1. Create a free form at <https://formspree.io> and copy its endpoint.
2. Set `mode: 'formspree'` and `endpoint: 'https://formspree.io/f/abcdwxyz'`.

**Option B: Google Sheets (free spreadsheet of replies)**
1. Create a Google Sheet with headers in row 1: `submittedAt | name | attending | attendees | message`.
2. Open **Extensions → Apps Script**, paste the script below, then **Deploy → New deployment → Web app** (Execute as: *Me*, Who has access: *Anyone*). Copy the web-app URL.
3. Set `mode: 'google-sheets'` and `endpoint: '<web app URL>'`.

```js
function doPost(e) {
  const d = JSON.parse(e.postData.contents);
  SpreadsheetApp.getActiveSpreadsheet().getSheets()[0]
    .appendRow([d.submittedAt, d.name, d.attending, d.attendees, d.message]);
  return ContentService.createTextOutput('ok');
}
```

**Option C: your own backend.** Set `mode: 'webhook'` and point `endpoint` at any URL that accepts a JSON `POST` of `{ name, attending, attendees, message, submittedAt }`. All of this logic lives in `src/services/rsvpService.js`, so a future backend only changes that one file.

---

## 5. Project structure

```
wedding-invitation/
├── public/
│   ├── videos/wedding-invitation.mp4     ← your film
│   ├── audio/background-music.mp3        ← your music
│   ├── images/{couple,background}.webp   ← illustration & landscape
│   ├── images/photos/                    ← your optimised photos (npm run photos)
│   ├── images/og-image.jpg               ← link-preview image
│   └── favicon.svg / favicon.ico
├── src/
│   ├── config/weddingConfig.js           ← ★ edit this
│   ├── components/
│   │   ├── WelcomeScreen.jsx  InvitationEnvelope.jsx  WeddingVideo.jsx
│   │   ├── WeddingDetails.jsx WeddingEvents.jsx       Countdown.jsx
│   │   ├── Location.jsx       RSVP.jsx                ClosingScreen.jsx
│   │   ├── Gallery.jsx        ("Our Moments" photos + lightbox)
│   │   ├── BackgroundMusic.jsx (floating music control)
│   │   ├── InvitationPage.jsx (screens 3–8, lazy-loaded)
│   │   └── ui/  PetalField, FloralBranch, Blossom (marigold), GaneshInvocation, OmSeal, CoupleArt, TextReveal, Reveal, …
│   ├── context/MusicContext.jsx          ← one shared <audio>, survives screen changes
│   ├── services/rsvpService.js           ← where RSVPs are sent
│   ├── hooks/  useCountdown, useMediaQuery
│   ├── utils/wedding.js                  ← date formatting, map & calendar links
│   ├── App.jsx  main.jsx  index.css
├── my-photos/                            ← drop original photos here (not published)
├── scripts/indian_art.py                ← Indian background, film, link preview, favicon
├── scripts/generate_assets.py            ← fallback couple silhouette
├── scripts/optimize_photos.py            ← shrinks your photos for the web
├── vercel.json                           ← caching headers
└── vite.config.js                        ← injects title/preview tags from the config
```

## 6. Performance & compatibility notes

- The welcome screen ships about 130 KB of gzipped JS. Screens 3–8 are code-split and prefetched while the guest looks at the envelope.
- Petals animate only GPU-friendly transforms. Phones get fewer of them, and visitors with *reduce motion* switched on get calm fades instead.
- Images are WebP and lazy-loaded below the fold. The map iframe loads only when scrolled near.
- **Autoplay rules:** browsers only allow sound after a tap, which is why the music and film start from the **Open Invitation** tap. If a browser still blocks sound, the film plays muted with a **Tap for sound** button.
- **iPhone:** iOS ignores web volume sliders, so the music volume slider is hidden there; the hardware buttons control volume. Videos play inline (`playsInline`).
- Missing or broken media never breaks the page: the film falls back to an image, and the music control simply hides.
- Video keyboard shortcuts: **Space/K** play/pause, **M** mute, **F** full screen, **←/→** seek, **S** skip.
