# Walkthrough Script — Editable Draft

> Edit this file freely. Once you're happy, I'll update `src/data/walkthrough-script.ts` to match.

---

## Document Context

- **Document title**: The Craftsman Table and the IKEA Desk
- **Project name**: Substack Articles

---

## Sidebar — Project Tree (shown when sidebar opens)

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

> Tighten this up and make it flow better. Keep my voice.

**AFTER (polished):**

> When it comes to writing and AI, think about it like a hand-crafted table versus an IKEA table. Before IKEA, every table was handcrafted and that meant only a small number of people could afford them. After IKEA everyone can have a good, solid table. Maybe not a craftsman level table, but a table that works and does what a table should do. But IKEA didn't make the craftsman tables disappear. We just got more tables. That's Jevons Paradox in action. Once something gets cheaper and more ubiquitous, we want more of it.

---

## Act 2: "The Proofread"

**ERRORS CAUGHT:**

1. "handcrafed" → "handcrafted" (missing 't')
2. "people could them" → "people could **afford** them" (missing word)

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

## Guided Tour — Step-by-Step Tooltip Cards

Each step is a tooltip card that appears on screen. Edit the card text, cut steps, reorder — whatever feels right.

---

### Step 1 — INTRO
```
┌─────────────────────────────────────────────────┐
│                                                   │
│  Inkstone is a co-creative writing app where you're in charge.

You write. Your AI buddy handles the research,  │
│  editing, fact-checking, and proofreading.        │
│  
Click me to see how it works!                          │
│                                                   │
│                              [ Start → ]          │
└─────────────────────────────────────────────────┘
```
**Points to:** Center of editor area
**What happens on click:** Advances to Step 2
**Color** First card is yellow: #ffe100  Text is black: #000000
Slow pulse of the card to draw attention to it.
**Type** Clickable card - manual advance

---

### Step 2 — ASK REWRITE
```
┌─────────────────────────────────────────────────┐
│                                                   │
│  When you need a hand, just talk to your AI buddy. It's never about replacing   │
│  you brainstorm and iterate — it's helping you skip a draft or two.      │
│                                                   │
│                            [ Rewrite → ]          │
└─────────────────────────────────────────────────┘
```
**Points to:** Chat input area
**What happens on click:** Typing animation plays in chat ("Tighten this up and make it flow better. Give it more power and punch. Keep my voice."), then text morph begins
**Type** Auto-advance


---

### Step 3 — WATCH MORPH
```
┌─────────────────────────────────────────────────┐
│                                                   │
│  Watch — the AI moves words around like magic.    │
│  Right in your document.                          │
│                                                   │
└─────────────────────────────────────────────────┘
```
**Points to:** Document paragraph text
**What happens:** Auto-advances when morph animation completes. No button — just watch.
**Type** Auto-advance

---

### Step 4 — REWRITE DONE
```
┌─────────────────────────────────────────────────┐
│                                                   │
│  Rough notes → polished prose. No copy-pasting    │
│  between apps. No switching tabs.  Accept or reject one by one or all at once.               │
│                                                   │
│                  [ Next: Proofreading → ]          │
└─────────────────────────────────────────────────┘
```
**Points to:** Document paragraph text (with red/green diffs visible)
We also see the accept/reject toolbar at the bottom.
**What happens on click:** Diffs resolve, proofreading bar disappears, advances to Step 5
**What happens on click:** Advances to Step 5
**Type** Clickable card - manual advance

---

### Step 5 — PROOFREAD
```
┌─────────────────────────────────────────────────┐
│                                                   │
│How about proofreading? Inkstone goes way beyond a spelling and grammer checker.  Fixes missing words, corrects major errors, reformats, fixes spacing, and also catches all those basic spelling and grammer errors too.           │
│                                                   │
│                          [ Proofread → ]          │
└─────────────────────────────────────────────────┘
```
**Points to:** Proofread icon (👓) in toolbar
**What happens on click:** Button is "clicked" and proofreading scoll out appears in the AI toolbar and autoplays and advanced to the next step
**Type** Auto-advance

---

### Step 6 — SCANNING
```
┌─────────────────────────────────────────────────┐
│                                                   │
│  Your AI buddy is scanning your document...         │
│                                                   │
└─────────────────────────────────────────────────┘
```
**Points to:** AI output of tool in the AI toolbar "vanquishing typos...fixing spacing...correcting grammar..."
**What happens:** Auto-advances when diffs appear. No button.
**Type** Auto-advance

---

### Step 7 — SEE DIFFS
```
┌─────────────────────────────────────────────────┐
│                                                   │
│  Not just spell-check. It caught a missing word   │
│  too. Red = delete. Green = insert.               │
│                                                   │
│                        [ Accept All → ]           │
└─────────────────────────────────────────────────┘
```
**Points to:** Document paragraph text (with red/green diffs visible)
**What happens on click:** Diffs resolve, proofreading bar disappears, advances to Step 9 - accept all butto is "clicked"
**Type** Clickable card - manual advance

---

### Step 8 — ASK RESEARCH
```
┌─────────────────────────────────────────────────┐
│                                                   │
│  Need to look something up? No more opening       │
│  20 tabs. Do GPT Deep Research or Perplexity like Web search, right in the app.

Just ask.                               │
│                                                   │
│                           [ Search → ]            │
└─────────────────────────────────────────────────┘
```
**Points to:** Chat input area
**What happens on click:** Typing animation plays ("What is Jevon's Paradox and who first described it?"), then search begins
**Type** Clickable card - manual advance

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
**What happens:** Auto-advances when research response appears. No button.

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
**Points to:** Chat insert button / research card
**What happens on click:** Research content flows into the document
**Type** Auto-advance

---

### Step 11 — SIDEBAR REVEAL
```
┌─────────────────────────────────────────────────┐
│                                                   │
│  Drafts, research, web searches — everything      │
│  lives in your project. Nothing gets lost.        │
│  No more juggling.                                │
│                                                   │
└─────────────────────────────────────────────────┘
```
**Points to:** Sidebar (which animates open)
**What happens:** Sidebar opens showing project tree. Auto-advances or click to continue.
**Type** Clickable card - manual advance

---

### Step 12 — FINALE
```
┌─────────────────────────────────────────────────┐
│                                                   │
│  Think. Brainstorm. Write. Research.              │
│  Edit. Iterate.                                   │
│  One app. One place. You're the boss.             │
│                                                   │
│  [ Try for FREE → ]         [ Replay tour ]       │
└─────────────────────────────────────────────────┘
```
**Points to:** Center of screen
**What happens:** "Try for FREE" links to sign-up. "Replay tour" restarts from Step 1.

---

## Timing (milliseconds)

| Parameter | Value | Notes |
|-----------|-------|-------|
| Chat typing speed | 50ms/char | Act 1 prompt |
| Thinking delay | 800ms | Shimmer before morph |
| Morph duration | 2500ms | Text morph animation |
| Scanning delay | 1200ms | "Scanning for errors..." |
| Diff stagger | 400ms | Between each diff appearing |
| Accept All delay | 1500ms | Before auto-accept (auto mode only) |
| Resolve animation | 600ms | Diffs fading out |
| Research typing speed | 45ms/char | Act 3 prompt |
| Loading shimmer | 1800ms | Research loading skeleton |
| Insert to Doc delay | 1200ms | Before auto-insert (auto mode only) |
| Insert animation | 800ms | Content flowing into doc |
| Inter-act delay | 1000ms | Pause between acts (auto mode) |
