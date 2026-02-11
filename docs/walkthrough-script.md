# Walkthrough Script — Editable Draft

> Edit this file freely. Once you're happy, I'll update `src/data/walkthrough-script.ts` to match.
>
> **Last synced with code**: February 10, 2026 — matches `walkthrough-script.ts` exactly.

---

## Document Context

- **Document title**: The Craftsman Table and the IKEA Desk
- **Project name**: Substack Articles

---

## Sidebar — Project Tree (shown when sidebar opens at Step 11)

```
▼ Substack Articles
  ├── The Craftsman Table and the IKEA Desk   ← current doc
  ├── Web Search: Jevons Paradox origin
  ├── Deep Research: AI writing tools landscape
  ├── Notes: Ben Goertzel jagged edge quotes
  └── Draft: Future of Knowledge Work
```

---

## Act 1: "The Rewrite"

**BEFORE (rough notes):**

> AI is like the difference between an IKEA table and a handmade one. Before IKEA you had to make tables by hand or pay a lot. After IKEA everyone gets a table. Not amazing but functional. But the craftsman tables didn't go away. We just ended up with more tables everywhere. Kitchen table, dining room, side tables, office desk. That's called Jevons Paradox I think. When something gets cheap we want more of it not less.

**CHAT PROMPT:**

> Tighten this up and make it flow better. Give it more power and punch. Keep my voice.

**AFTER (polished):**

> When it comes to writing and AI, think about it like a hand-crafted table versus an IKEA table. Before IKEA, every table was handcrafted and that meant only a small number of people could afford them. After IKEA everyone can have a good, solid table. Maybe not a craftsman level table, but a table that works and does what a table should do. But IKEA didn't make the craftsman tables disappear. We just got more tables. That's Jevons Paradox in action. Once something gets cheaper and more ubiquitous, we want more of it.

---

## Act 2: "The Proofread"

**ERRORS CAUGHT:**

1. "handcrafed" → "handcrafted" (missing 't')
2. "people could them" → "people could **afford** them" (missing word)

**Scanning output** (shown in AI chat): "vanquishing typos...fixing spacing...correcting grammar..."

---

## Act 3: "The Research"

**CHAT PROMPT:**

> What is Jevons Paradox and who first described it?

**AI RESPONSE:**

> Jevons Paradox was first described by English economist William Stanley Jevons in his 1865 book The Coal Question [1]. He observed that as coal use became more efficient, total consumption increased rather than decreased [2]. The principle has since been applied broadly — when a resource becomes cheaper or more efficient to use, total consumption often rises because demand grows faster than efficiency gains [3].

**CITATIONS:**

1. Jevons, W.S. — The Coal Question (1865)
2. Alcott, B. — Jevons' Paradox, Ecological Economics (2005)
3. Sorrell, S. — The Rebound Effect, UK Energy Research Centre

---

## Guided Tour — 12 Steps

Each step is a tooltip card that appears on screen. Edit the card text, cut steps, reorder — whatever feels right.

---

### Step 1 — INTRO (yellow card, pulsing)
```
┌─────────────────────────────────────────────────┐
│                                                   │
│  Inkstone is a co-creative writing app where      │
│  you're in charge.                                │
│                                                   │
│  You write. Your AI buddy handles the research,   │
│  editing, fact-checking, and proofreading.         │
│                                                   │
│  Click me to see how it works!                    │
│                                                   │
│                              [ Start → ]          │
└─────────────────────────────────────────────────┘
```
**Points to:** Center of editor area
**Style:** Yellow card (#f5ce42), black text, slow pulse animation
**Type:** Clickable — manual advance to Step 2

---

### Step 2 — ASK REWRITE
```
┌─────────────────────────────────────────────────┐
│                                                   │
│  When you need a hand, just talk to your AI       │
│  buddy. It's never about replacing you — it's     │
│  helping you brainstorm and iterate, skip a       │
│  draft or two.                                    │
│                                                   │
│                            [ Rewrite → ]          │
└─────────────────────────────────────────────────┘
```
**Points to:** Chat input area
**Type:** Clickable — triggers Act 1 (typing animation plays in chat input: "Tighten this up and make it flow better. Give it more power and punch. Keep my voice.")

---

### Step 3 — TYPING IN PROGRESS (hidden step)
```
No tooltip shown. Chat input has pulsing glow.
Typing animation plays in the input box.
When typing completes, message "sends" as blue bubble.
```
**Points to:** Chat input area
**Type:** Auto-advance — advances when chat typing completes

---

### Step 4 — WATCH MORPH
```
┌─────────────────────────────────────────────────┐
│                                                   │
│  Watch — the AI moves words around like magic.    │
│  Right in your document.                          │
│                                                   │
└─────────────────────────────────────────────────┘
```
**Points to:** Editor paragraph text
**Type:** Auto-advance — advances when morph animation completes

---

### Step 5 — REWRITE DONE
```
┌─────────────────────────────────────────────────┐
│                                                   │
│  Rough notes → polished prose. No copy-pasting    │
│  between apps. No switching tabs. Accept or       │
│  reject one by one or all at once.                │
│                                                   │
│                  [ Next: Proofreading → ]          │
└─────────────────────────────────────────────────┘
```
**Points to:** Proofreading bar (proofbar)
**Type:** Clickable — triggers Act 2 (proofreading starts automatically)

---

### Step 6 — SCANNING
```
┌─────────────────────────────────────────────────┐
│                                                   │
│  Proofreading your document...                    │
│                                                   │
└─────────────────────────────────────────────────┘
```
**Points to:** Editor paragraph text
**Type:** Auto-advance — advances when diffs appear

---

### Step 7 — SEE DIFFS
```
┌─────────────────────────────────────────────────┐
│                                                   │
│  Caught a typo and a missing word. Not just       │
│  spell-check — it fills in what's missing too.    │
│                                                   │
│                        [ Accept All → ]           │
└─────────────────────────────────────────────────┘
```
**Points to:** Editor paragraph text (red/green diffs visible)
**Type:** Clickable — triggers Accept All, diffs resolve, proofreading bar disappears

---

### Step 8 — ASK RESEARCH
```
┌─────────────────────────────────────────────────┐
│                                                   │
│  Need to look something up? No more opening 20   │
│  tabs. Do GPT Deep Research or Perplexity-like    │
│  Web Search, right in the app. Just ask.          │
│                                                   │
│                           [ Search → ]            │
└─────────────────────────────────────────────────┘
```
**Points to:** Chat input area
**Type:** Clickable — triggers Act 3 (typing animation: "What is Jevons Paradox and who first described it?")

---

### Step 9 — SEARCHING
```
┌─────────────────────────────────────────────────┐
│                                                   │
│  Your AI research assistant is searching the      │
│  web and synthesizing an answer with sources...   │
│                                                   │
└─────────────────────────────────────────────────┘
```
**Points to:** Chat messages area
**Type:** Auto-advance — advances when research response appears

---

### Step 10 — INSERT TO DOC
```
┌─────────────────────────────────────────────────┐
│                                                   │
│  Research done. Citations included. One click      │
│  to add it to your doc.                           │
│                                                   │
│                      [ Insert to Doc → ]          │
└─────────────────────────────────────────────────┘
```
**Points to:** Chat insert button
**Type:** Clickable — triggers Insert to Doc, research content flows into the document

---

### Step 11 — SIDEBAR REVEAL
```
┌─────────────────────────────────────────────────┐
│                                                   │
│  Drafts, research, web searches — everything      │
│  lives in your project. Nothing gets lost.        │
│  No more juggling.                                │
│                                                   │
│                      [ One more thing → ]         │
└─────────────────────────────────────────────────┘
```
**Points to:** Sidebar (animates open showing project tree)
**Type:** Clickable — sidebar opens, then manual advance to finale

---

### Step 12 — FINALE (yellow card, pulsing)
```
┌─────────────────────────────────────────────────┐
│                                                   │
│  Write. Rewrite. Proofread. Research.             │
│  Fact-check.                                      │
│                                                   │
│  All in one place. No more 20 tabs and            │
│  5 subscriptions.                                 │
│                                                   │
│  You're the boss. Your AI team handles the rest.  │
│                                                   │
│  [ Try Inkstone for FREE → ]    [ Replay tour ]   │
└─────────────────────────────────────────────────┘
```
**Points to:** Center of screen
**Style:** Yellow card (#f5ce42), black text, slow pulse animation
**CTA:** "Try Inkstone for FREE →" links to https://accounts.inkstone.pro/sign-up
**Replay:** "Replay tour" restarts from Step 1

---

## Timing (milliseconds)

| Parameter | Value | Notes |
|-----------|-------|-------|
| Chat typing speed | 50ms/char | Act 1 prompt |
| Thinking delay | 800ms | Shimmer before morph |
| Morph duration | 2500ms | Text morph animation |
| Scanning delay | 1200ms | "Proofreading your document..." |
| Diff stagger | 400ms | Between each diff appearing |
| Accept All delay | 1500ms | Before auto-accept (auto mode only) |
| Resolve animation | 600ms | Diffs fading out |
| Research typing speed | 45ms/char | Act 3 prompt |
| Loading shimmer | 1800ms | Research loading skeleton |
| Response typing speed | 20ms/char | Research response appearing |
| Insert to Doc delay | 1200ms | Before auto-insert (auto mode only) |
| Insert animation | 800ms | Content flowing into doc |
| Inter-act delay | 1000ms | Pause between acts (auto mode) |
| Estimated total | ~35s | Full guided tour |
