---
name: sid-music
description: >-
  Adds a dedicated nostalgia-radio person to this gallery site. Interviews the
  8-variable board, generates two gouache backgrounds (16:9 + 9:16), writes
  app/<slug>/page.tsx, registers SITE_PAGES, and adds an empty STATIONS.<slug>
  key in lib/tracks.ts. Use when the user invokes /sid-music or asks to add a
  person, station, or dedicated page to the gallery.
disable-model-invocation: true
---

# sid-music

Add **one person** to the existing gallery. Do **not** scaffold a new site. Do **not** rebuild `Radio`, layout, Hud, or the homepage dome.

## Hard rules

- Interview. Do not assume any board value. Do not invent taglines, tracks, or social URLs. Wordmark is always Devanagari `[Name]` + ` रेडियो` (see step 5).
- Music: create the `STATIONS` key only. Leave the array empty. The user pastes tracks later. Do not search, suggest, or add songs. If they later ask to add a track you believe is copyrighted, warn before adding.
- Images: generate both, write them to disk under `public/bg/<slug>/`. Never reuse another person's files. Never crop wide → tall.
- Touch only: the two images under `public/bg/<slug>/`, `app/globals.css` (one scoped hero class), `app/<slug>/page.tsx`, `lib/pages.ts`, `lib/tracks.ts`.

## Workflow

Copy this checklist and track it:

```
sid-music:
- [ ] 1. Board complete (7 required + notes)
- [ ] 2. slug derived from [Name]
- [ ] 3. scene-wide.png generated + saved
- [ ] 4. scene-tall.png generated + saved (separate composition)
- [ ] 5. .hero-bg-<slug> in app/globals.css
- [ ] 6. app/<slug>/page.tsx
- [ ] 7. SITE_PAGES row
- [ ] 8. STATIONS.<slug> = []
```

### 1. Interview

If the invoking message already fills the 7 required slots, skip to step 2. `[ADDITIONAL NOTES]` may be blank.

Otherwise print the board and **stop**. Do not generate images. Do not write files. Re-ask only the required blanks.

```
[Name]              = for whom it is and the page URL will be named after them
[SETTING]           = the place, e.g. an ordinary Indian urban neighbourhood
[ERA]               = the time period, e.g. the late 1980s / 1990s
[FOCAL SHOP]        = the little shop at the heart of it, e.g. a neighbourhood music / cassette shop
[NOSTALGIC OBJECTS] = the objects that carry the memory, e.g. cassettes, transistor radios, old two-speaker players
[STREET LIFE]       = what the figures are doing, e.g. buying tapes, listening, playing gully cricket, leaning on a scooter
[PALETTE]           = the dominant colours, e.g. terracotta, ochre, faded coral, dusty teal
[ADDITIONAL NOTES]  = extra image constraints, e.g. more trees, no cricket, shop is a tea stall. Blank is fine.
```

Ask nothing else. No tagline, socials, accent, or playlists. Wordmark is derived in step 5.

### 2. Slug

`[Name]` → slug: lowercase ASCII, spaces to hyphens, strip other punctuation. `Kajal` → `kajal`. `Rita Sen` → `rita-sen`.

If `app/<slug>/` or `STATIONS.<slug>` already exists, stop and say so.

### 3. Images

Both prompts are image generation only. Do not rewrite, crop, or derive one from the other.

Substitute every `[SETTING]`, `[ERA]`, `[FOCAL SHOP]`, `[NOSTALGIC OBJECTS]`, `[STREET LIFE]`, `[PALETTE]` token. Leave no brackets.

If `[ADDITIONAL NOTES]` is non-empty, append this block to **each** prompt (do not invent notes):

```
--------------------------------------------------
ADDITIONAL NOTES
--------------------------------------------------
[ADDITIONAL NOTES]
```

If blank, omit the block.

Generate with the image tool. Then **copy the files** into `public/bg/<slug>/` (the tool cannot write that path itself).

**Wide** — read [prompt-bg.md](prompt-bg.md). `aspect_ratio: "16:9"`. Save as `public/bg/<slug>/scene-wide.png`.

**Tall** — read [prompt-tall.md](prompt-tall.md). `aspect_ratio: "9:16"`. Save as `public/bg/<slug>/scene-tall.png`.

If the tool writes elsewhere, `mkdir -p public/bg/<slug>` and `cp` both files there. Confirm both exist before continuing.

### 4. CSS

Append to `app/globals.css`. Do **not** edit another person's `.hero-bg-<slug>` class.

```css
.hero-bg-<slug> {
  background-image: url("/bg/<slug>/scene-wide.png");
}

@media (orientation: portrait) {
  .hero-bg-<slug> {
    background-image: url("/bg/<slug>/scene-tall.png");
  }
}
```

### 5. Page

Clone `app/kajal/page.tsx` → `app/<slug>/page.tsx`. Swap only:

Wordmark: transliterate `[Name]` to Devanagari, then append ` रेडियो`. Do not invent a different phrase. Examples: `Kajal` → `काजल रेडियो`. `Shamili` → `शमीली रेडियो`. `Rita Sen` → `रिता सेन रेडियो`.

| Slot | Value |
|------|--------|
| `metadata.title` | `[Name] Radio` |
| `metadata.description` | `[SETTING], [ERA]` |
| hero class | `hero-bg-<slug>` (not `hero-bg`) |
| small caps line | `[SETTING] · [ERA]` |
| `h1` | Devanagari `[Name]` + ` रेडियो` (still `Link` to `/`) |
| `<Radio station>` | `"<slug>"` |

Delete the poetry/tagline `<p>` under the h1. Do not invent a replacement. Leave `SOCIALS` hrefs as `#`. Clone existing page + `Radio`. Do not rewrite the player. Do not add tracks.

### 6. Gallery

One object in `lib/pages.ts`:

```ts
{
  href: "/<slug>",
  src: "/bg/<slug>/scene-wide.png",
  alt: "[Name] Radio",
  kicker: "[SETTING] · [ERA]",
  title: "Devanagari [Name] रेडियो",
},
```

### 7. Tracks key

In `lib/tracks.ts`, add an empty key. Comment shows where songs go. **No rows.**

```ts
  <slug>: [
    // Add songs here, one line each:
    // { id: "<slug-prefix>1", title: "", artist: "", film: "", year: 0, duration: 0, videoId: "" },
  ],
```

`id` prefix = first letter(s) of slug. `kajal` → `k1`. `rita-sen` → `rs1`.

Do not fill `videoId`. Do not look up YouTube.

## After

Reply with: slug, both image paths, page URL `/<slug>`, and `STATIONS.<slug>` as the paste target. Stop.

## Additional resources

- Prompt 1 wide 16:9 (verbatim): [prompt-bg.md](prompt-bg.md)
- Prompt 2 tall 9:16 (verbatim): [prompt-tall.md](prompt-tall.md)
