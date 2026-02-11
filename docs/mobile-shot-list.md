# Mobile Shot List — "Screen Studio" Virtual Camera

> Director's cut of the walkthrough for mobile devices.
> The desktop walkthrough renders at full resolution. A virtual camera zooms and pans to follow the action.
> No tooltips on mobile — a **caption bar** at the bottom of the viewport replaces them.

---

## Technical Setup

### Canvas & Viewport

| Property | Value |
|----------|-------|
| **Canvas size** (walkthrough renders at) | 1200 × 800 px (fixed, desktop resolution) |
| **Mobile viewport** (what the user sees) | ~375 × 280 px (iframe in Framer, 16:10 aspect, full-width minus padding) |
| **Scale to fit full width** | 375 / 1200 = **0.31** (everything visible, text tiny) |
| **Scale for readable text** | **1.0 – 1.5** (focused on one panel, text crisp) |

### Layout Regions (approximate pixel coordinates on the 1200×800 canvas)

```
┌──────────────────────────────────────────────────────────────┐
│ 0,0                                                    1200,0│
│  ┌──────┬───┬──────────────────────────────┬───┬───────────┐ │
│  │SIDE  │ R │         EDITOR               │ R │   CHAT    │ │
│  │BAR   │ E │                               │ E │  PANEL   │ │
│  │      │ S │  Toolbar: y=40..100           │ S │           │ │
│  │ 0-44 │ I │  Doc header: y=0..40          │ I │  Header:  │ │
│  │  px  │ Z │  Content: y=100..700          │ Z │  y=0..60  │ │
│  │      │ E │  Paragraph: centered,         │ E │  Tabs:    │ │
│  │      │ R │  max-width 680px              │ R │  y=60..96 │ │
│  │      │   │                               │   │  Thread:  │ │
│  │      │   │                               │   │  y=96..650│ │
│  │      │   │                               │   │  Input:   │ │
│  │      │   │                               │   │  y=700..  │ │
│  │      │   │  Proofbar: bottom of editor   │   │  800      │ │
│  └──────┴───┴──────────────────────────────┴───┴───────────┘ │
│ 0,800                                                1200,800│
└──────────────────────────────────────────────────────────────┘

Sidebar:    x = 0 .. 44       (collapsed) / 0 .. 220 (expanded)
Editor:     x = 46 .. 818     (flex: 1, ~772px when sidebar collapsed)
Chat panel: x = 820 .. 1200   (width: 380px fixed)
```

### Camera System

The camera is defined by three values per shot:

- **`scale`** — zoom level (0.31 = full canvas fits viewport, 1.0 = 1:1 pixel, 1.5 = zoomed in)
- **`originX`** — horizontal focus point on the canvas (0 = left edge, 1200 = right edge)
- **`originY`** — vertical focus point on the canvas (0 = top edge, 800 = bottom edge)

CSS implementation: `transform-origin: {originX}px {originY}px; transform: scale({scale});`
The container is `overflow: hidden` with the viewport dimensions.

### Caption Bar

Overlaid at the **bottom** of the viewport (not transformed with the canvas):
- **Height**: 48px
- **Background**: `rgba(0, 0, 0, 0.75)` with `backdrop-filter: blur(8px)`
- **Text**: White, 14px, centered, single line (two lines max)
- **Transition**: crossfade between captions (200ms)

---

## The Shots

### Shot 1 — ESTABLISHING WIDE
```
┌─────────────────────────┐
│  Full app, scaled down  │
│  ┌────┬────────┬──────┐ │
│  │side│ editor │ chat │ │
│  │    │        │      │ │
│  └────┴────────┴──────┘ │
│ ▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓│ ← caption bar
│  "Meet your AI writing  │
│        team."           │
└─────────────────────────┘
```

| Property | Value |
|----------|-------|
| **Scale** | 0.31 |
| **Origin** | 600, 400 (center of canvas) |
| **Caption** | "Meet your AI writing team." |
| **Duration** | 2.5s |
| **Easing** | — (hold) |
| **Purpose** | Establish context. "This is a real, professional desktop app." The full layout is tiny but recognizable — sidebar, editor, chat. Builds credibility before we zoom in. |

---

### Shot 2 — ZOOM TO CHAT INPUT
```
┌─────────────────────────┐
│                         │
│  ┌───────────────────┐  │
│  │ Ask, check or     │  │
│  │ research anything │  │
│  │              [↑]  │  │
│  └───────────────────┘  │
│                         │
│ ▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓│
│  "Just talk to your AI  │
│       buddy."           │
└─────────────────────────┘
```

| Property | Value |
|----------|-------|
| **Scale** | 1.4 |
| **Origin** | 1010, 750 (chat input area, bottom-right of canvas) |
| **Caption** | "Just talk to your AI buddy." |
| **Duration** | Hold through typing animation (~3s) |
| **Transition** | 0.8s ease-out zoom from wide |
| **Purpose** | Dramatic zoom into the chat input. User sees typing animation happen character by character — text is fully readable at this scale. The pulsing glow on the input draws the eye. |

---

### Shot 3 — PAN UP: MESSAGE SENT
```
┌─────────────────────────┐
│  ┌───────────────────┐  │
│  │                   │  │
│  │   "Tighten this   │  │  ← blue bubble
│  │    up and make    │  │
│  │    it flow..."    │  │
│  │                   │  │
│  └───────────────────┘  │
│ ▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓│
│  "Watch what happens    │
│       next..."          │
└─────────────────────────┘
```

| Property | Value |
|----------|-------|
| **Scale** | 1.2 |
| **Origin** | 1010, 500 (chat thread area, mid-right) |
| **Caption** | "Watch what happens next..." |
| **Duration** | 1.5s |
| **Transition** | 0.6s ease-in-out pan up + slight zoom out |
| **Purpose** | After typing completes, the message sends as a blue bubble. Camera pans up to show it in the thread. Brief pause for the user to read. Builds anticipation before the morph. |

---

### Shot 4 — PAN LEFT: TEXT MORPH
```
┌─────────────────────────┐
│                         │
│  AI is like the differ- │
│  ence between an IKEA   │
│  table and a handmade   │
│  one. Before IKEA you   │
│  had to make tables...  │
│                         │
│ ▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓│
│  "Words move like magic.│
│   Right in your doc."   │
└─────────────────────────┘
```

| Property | Value |
|----------|-------|
| **Scale** | 1.1 |
| **Origin** | 430, 400 (editor paragraph, center of editor area) |
| **Caption** | "Words move like magic. Right in your doc." |
| **Duration** | Hold through morph animation (~2.5s) |
| **Transition** | 0.8s ease-in-out pan left across the full app width — the HERO transition. Camera sweeps from chat to editor. |
| **Purpose** | The money shot of Act 1. Camera pans LEFT across the entire app, arriving at the editor body. User watches words rearrange, insert, delete in real-time. The pan itself is cinematic — it shows the spatial relationship between chat and editor. Text is readable at 1.1× scale. |

---

### Shot 5 — HOLD: REWRITE DIFFS
```
┌─────────────────────────┐
│                         │
│  When it comes to writ- │
│  ing and AI, think      │
│  ~~about~~ → [about it] │
│  like a hand-crafted    │
│  table versus an IKEA   │
│  table...               │
│ ▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓│
│  "Rough notes → polished│
│        prose."          │
└─────────────────────────┘
```

| Property | Value |
|----------|-------|
| **Scale** | 1.1 |
| **Origin** | 430, 400 (same as Shot 4 — no camera move) |
| **Caption** | "Rough notes → polished prose." |
| **Duration** | 2s |
| **Transition** | Caption crossfade only. Camera holds. |
| **Purpose** | Hold on the editor after morph completes. Red/green rewrite diffs are visible. Brief moment to absorb the before→after. Then auto-accept fires. |

---

### Shot 6 — SLIGHT ZOOM: PROOFREADING DIFFS
```
┌─────────────────────────┐
│                         │
│  ...every table was     │
│  ~~handcrafed~~ →       │
│   [handcrafted] and     │
│  that meant only a      │
│  small number of people │
│  could [afford] them.   │
│ ▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓│
│  "Catches typos and     │
│    missing words."      │
└─────────────────────────┘
```

| Property | Value |
|----------|-------|
| **Scale** | 1.25 |
| **Origin** | 430, 380 (editor paragraph, slightly higher to frame diffs) |
| **Caption** | "Catches typos and missing words." |
| **Duration** | 2.5s (scan animation + diffs appear + hold) |
| **Transition** | 0.5s ease slight zoom in to emphasize the diff detail |
| **Purpose** | Act 2 fires automatically. Camera tightens slightly on the paragraph area where proofreading diffs appear. "handcrafed" → "handcrafted" and "could them" → "could afford them" are clearly visible. The slight zoom draws attention to the red/green inline changes. Auto-accept fires after hold. |

---

### Shot 7 — PAN RIGHT: RESEARCH TYPING
```
┌─────────────────────────┐
│                         │
│  ┌───────────────────┐  │
│  │ What is Jevons    │  │
│  │ Paradox and who   │  │
│  │ first described   │  │
│  │ it?          [↑]  │  │
│  └───────────────────┘  │
│ ▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓│
│  "Need to research?     │
│      Just ask."         │
└─────────────────────────┘
```

| Property | Value |
|----------|-------|
| **Scale** | 1.4 |
| **Origin** | 1010, 750 (chat input area — same as Shot 2) |
| **Caption** | "Need to research something? Just ask." |
| **Duration** | Hold through typing animation (~2.5s) |
| **Transition** | 0.8s ease-in-out pan right — mirrors the Shot 4 pan, but in reverse. |
| **Purpose** | Act 3 begins. Camera sweeps RIGHT back to the chat input. Typing animation: "What is Jevons Paradox and who first described it?" The mirror-pan creates rhythm. |

---

### Shot 8 — PAN UP: RESEARCH RESPONSE
```
┌─────────────────────────┐
│  Jevons Paradox was     │
│  first described by     │
│  William Stanley Jevons │
│  in his 1865 book The   │
│  Coal Question [1]...   │
│                         │
│  [1] Jevons, W.S. —     │
│ ▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓│
│  "Sources included.     │
│    One click to insert."│
└─────────────────────────┘
```

| Property | Value |
|----------|-------|
| **Scale** | 1.1 |
| **Origin** | 1010, 400 (chat thread, mid-panel) |
| **Caption** | "Sources included. One click to insert." |
| **Duration** | 3s (shimmer → response types in → hold) |
| **Transition** | 0.6s ease pan up + slight zoom out to show full response with citations |
| **Purpose** | Research response materializes with citations. Camera shows the full response card. User sees this is a real answer with real sources — not just an AI blurb. The citations are the credibility moment. |

---

### Shot 9 — PAN LEFT: INSERT INTO EDITOR
```
┌─────────────────────────┐
│                         │
│  ...we want more of it. │
│                         │
│  ─────────────────────  │
│                         │
│  Jevons Paradox was     │
│  first described by...  │
│ ▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓│
│  "Research flows into   │
│     your document."     │
└─────────────────────────┘
```

| Property | Value |
|----------|-------|
| **Scale** | 1.0 |
| **Origin** | 430, 500 (editor content, lower section where insert lands) |
| **Caption** | "Research flows right into your document." |
| **Duration** | 2s (insert animation + hold) |
| **Transition** | 0.6s ease-in-out pan left — the insert triggers during the pan, so the user sees text flowing into the doc as the camera arrives. |
| **Purpose** | The "Insert to Doc" fires automatically. Camera pans left to the editor where research text animates into the document below the existing content. The simultaneous pan + insert is the smoothest moment in the whole sequence. |

---

### Shot 10 — ZOOM OUT: SIDEBAR REVEAL
```
┌─────────────────────────┐
│ ┌────┬──────────┬─────┐ │
│ │▼ S │          │     │ │
│ │ ├──│ editor   │chat │ │
│ │ ├──│ content  │panel│ │
│ │ ├──│          │     │ │
│ │ └──│          │     │ │
│ └────┴──────────┴─────┘ │
│ ▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓│
│  "Everything lives in   │
│     one project."       │
└─────────────────────────┘
```

| Property | Value |
|----------|-------|
| **Scale** | 0.45 |
| **Origin** | 500, 400 (shifted left of center to emphasize sidebar) |
| **Caption** | "Everything lives in one project." |
| **Duration** | 3s (sidebar animates open + hold) |
| **Transition** | 1.0s ease-out zoom out — the BIG pull-back. Slow, dramatic. |
| **Purpose** | The dramatic reveal. Camera zooms out to show the sidebar opening with the full project tree. The user sees that research, web searches, notes, and drafts all accumulate in one organized project. Three panels visible: sidebar + editor + chat. This is the "oh, all of that was one app" moment. |

---

### Shot 11 — FULL WIDE: FINALE
```
┌─────────────────────────┐
│ ┌────┬──────────┬─────┐ │
│ │    │          │     │ │
│ │side│  editor  │chat │ │
│ │bar │  content │panel│ │
│ │    │          │     │ │
│ └────┴──────────┴─────┘ │
│ ▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓│
│  "Try Inkstone for FREE"│
│        [→ Sign up]      │
└─────────────────────────┘
```

| Property | Value |
|----------|-------|
| **Scale** | 0.31 |
| **Origin** | 600, 400 (center — same as Shot 1) |
| **Caption** | "Try Inkstone for FREE →" (tappable link to sign-up) |
| **Duration** | Hold indefinitely (end state) |
| **Transition** | 0.6s ease final zoom out to full wide |
| **Purpose** | Full circle. Back to the establishing shot — but now the app is populated. Sidebar is open, editor has content, chat has threads. The contrast with Shot 1 (empty/idle) shows the product's value. Caption becomes a CTA link. Tapping anywhere on the caption bar opens the sign-up page. |

---

## Timing Summary

| Shot | Caption | Duration | Cumulative |
|------|---------|----------|------------|
| 1. Wide | "Meet your AI writing team." | 2.5s | 2.5s |
| 2. Chat input | "Just talk to your AI buddy." | ~3.5s (typing) | 6.0s |
| 3. Message sent | "Watch what happens next..." | 1.5s | 7.5s |
| 4. Text morph | "Words move like magic." | ~3.3s (pan + morph) | 10.8s |
| 5. Rewrite diffs | "Rough notes → polished prose." | 2.0s | 12.8s |
| 6. Proofread diffs | "Catches typos and missing words." | 2.5s | 15.3s |
| 7. Research typing | "Need to research? Just ask." | ~3.3s (pan + typing) | 18.6s |
| 8. Research response | "Sources included. One click." | 3.0s | 21.6s |
| 9. Insert to doc | "Research flows into your doc." | 2.0s | 23.6s |
| 10. Sidebar reveal | "Everything lives in one project." | 3.0s | 26.6s |
| 11. Finale | "Try Inkstone for FREE →" | Hold | 26.6s + |

**Total runtime**: ~27 seconds (tighter than desktop's 35s — mobile attention spans are shorter)

---

## Camera Motion Language

The shot list uses a deliberate visual rhythm:

1. **Wide** → **Zoom in right** (chat) — "here's where you talk"
2. **Pan up** (chat thread) — "message sent"
3. **Pan left** (editor) — "watch the magic" ← HERO TRANSITION
4. **Hold** (editor) — "see the result"
5. **Slight zoom** (editor) — "proofreading"
6. **Pan right** (chat) — "ask a question" ← MIRROR OF #3
7. **Pan up** (chat) — "here's the answer"
8. **Pan left** (editor) — "inserted" ← MIRROR OF #6
9. **Zoom out** — "the big reveal"
10. **Full wide** — "the whole picture"

The **left-right ping-pong** between editor and chat is intentional. It teaches the spatial relationship: "you talk on the right, things happen on the left." The final zoom-out connects them into one coherent workspace.

The **zoom out at the end** is the money shot. The viewer has been seeing focused clips, and the pull-back reveals the complete professional tool. Screen Studio uses exactly this technique.

---

## Implementation Notes

### What the component needs

```tsx
// New component: MobileCameraWrapper
// Wraps <Walkthrough /> on mobile viewports

interface CameraShot {
  scale: number;
  originX: number;
  originY: number;
  caption: string;
  captionLink?: string;  // for finale CTA
  duration: number;       // ms to hold
  transition: number;     // ms for camera move
  easing: string;         // CSS easing function
}

// Activated by media query: max-width 768px
// Walkthrough renders at 1200×800 inside overflow:hidden container
// Camera applies: transform: scale(S); transform-origin: Xpx Ypx;
// Caption bar is position:absolute, bottom:0, NOT inside transformed container
```

### Playback mode on mobile
- Always `auto-silent` — no tooltips, no click interaction
- Camera choreography drives the experience
- Animations still triggered by the walkthrough state machine
- Caption bar crossfades between shots

### Desktop is untouched
- Media query activates camera system only below 768px
- Desktop keeps the guided tooltip tour as-is
- No code changes to existing walkthrough components

### What syncs camera to walkthrough state
The camera doesn't use timers — it reacts to the **same state changes** the walkthrough already emits:
- `state === "idle"` → Shot 1 (wide)
- `state === "act1"` + `!chatTypingDone` → Shot 2 (chat input)
- `state === "act1"` + `chatTypingDone` → Shot 3 (message sent) → Shot 4 (morph)
- `state === "act1-complete"` → Shot 5 (rewrite diffs)
- `state === "act2"` → Shot 6 (proofread diffs)
- `state === "act2-complete"` → Shot 7 (research typing)
- `state === "act3"` + `chatTypingDone` → Shot 8 (research response)
- `researchPhase === "inserted"` → Shot 9 (insert)
- `sidebarOpen` → Shot 10 (sidebar reveal)
- `state === "act3-complete"` → Shot 11 (finale)

This means the camera wrapper is **stateless** — it just maps walkthrough state to camera positions. No new timers, no new state machines.
