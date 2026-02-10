/**
 * Walkthrough Script — All canned content for the 3-act demo.
 *
 * Content based on real Substack article "The Craftsman Table and the
 * IKEA Desk" — a real knowledge work session, not a contrived example.
 *
 * Every word, every diff, every timing value lives here.
 * Zero API calls. Zero runtime cost per visitor.
 */

// ============================================================
// DOCUMENT CONTEXT
// ============================================================

export const DOC = {
  title: "The Craftsman Table and the IKEA Desk",
  project: "Substack Articles",
} as const;

// ============================================================
// SIDEBAR — Project tree shown when sidebar opens
// ============================================================

export const SIDEBAR = {
  projectName: "Substack Articles",
  documents: [
    { name: "The Craftsman Table and the IKEA Desk", active: true, icon: "file" as const },
    { name: "Web Search: Jevons Paradox origin", active: false, icon: "search" as const },
    { name: "Deep Research: AI writing tools landscape", active: false, icon: "research" as const },
    { name: "Notes: Ben Goertzel jagged edge quotes", active: false, icon: "file" as const },
    { name: "Draft: Future of Knowledge Work", active: false, icon: "file" as const },
  ],
} as const;

// ============================================================
// ACT 1: "The Rewrite"
// ============================================================

export const ACT1 = {
  roughDraft:
    "AI is like the difference between an IKEA table and a handmade one. Before IKEA you had to make tables by hand or pay a lot. After IKEA everyone gets a table. Not amazing but functional. But the craftsman tables didn\u2019t go away. We just ended up with more tables everywhere. Kitchen table, dining room, side tables, office desk. That\u2019s called Jevons Paradox I think. When something gets cheap we want more of it not less.",

  polishedDraft:
    "When it comes to writing and AI, think about it like a hand-crafted table versus an IKEA table. Before IKEA, every table was handcrafted and that meant only a small number of people could afford them. After IKEA everyone can have a good, solid table. Maybe not a craftsman level table, but a table that works and does what a table should do. But IKEA didn\u2019t make the craftsman tables disappear. We just got more tables. That\u2019s Jevons Paradox in action. Once something gets cheaper and more ubiquitous, we want more of it.",

  chatPrompt: "Tighten this up and make it flow better. Give it more power and punch. Keep my voice.",

  typingSpeed: 50,
  thinkingDelay: 800,
  morphDuration: 2500,
} as const;

// ============================================================
// ACT 2: "The Proofread"
// ============================================================

export const ACT2 = {
  textWithErrors:
    "When it comes to writing and AI, think about it like a hand-crafted table versus an IKEA table. Before IKEA, every table was handcrafed and that meant only a small number of people could them. After IKEA everyone can have a good, solid table. Maybe not a craftsman level table, but a table that works and does what a table should do. But IKEA didn\u2019t make the craftsman tables disappear. We just got more tables. That\u2019s Jevons Paradox in action. Once something gets cheaper and more ubiquitous, we want more of it.",

  cleanText:
    "When it comes to writing and AI, think about it like a hand-crafted table versus an IKEA table. Before IKEA, every table was handcrafted and that meant only a small number of people could afford them. After IKEA everyone can have a good, solid table. Maybe not a craftsman level table, but a table that works and does what a table should do. But IKEA didn\u2019t make the craftsman tables disappear. We just got more tables. That\u2019s Jevons Paradox in action. Once something gets cheaper and more ubiquitous, we want more of it.",

  diffs: [
    {
      type: "replace" as const,
      original: "handcrafed",
      corrected: "handcrafted",
      description: "Spelling: missing 't'",
    },
    {
      type: "insert" as const,
      before: "could",
      after: "could afford",
      inserted: "afford",
      description: "Missing word: 'afford'",
    },
  ],

  /** Scanning output text shown in AI chat panel */
  scanningOutput: "vanquishing typos...fixing spacing...correcting grammar...",

  scanningDelay: 1200,
  diffStaggerDelay: 400,
  acceptAllDelay: 1500,
  resolveAnimationDuration: 600,
} as const;

// ============================================================
// ACT 3: "The Research"
// ============================================================

export const ACT3 = {
  chatPrompt: "What is Jevons Paradox and who first described it?",

  researchResponse:
    "Jevons Paradox was first described by English economist William Stanley Jevons in his 1865 book The Coal Question [1]. He observed that as coal use became more efficient, total consumption increased rather than decreased [2]. The principle has since been applied broadly \u2014 when a resource becomes cheaper or more efficient to use, total consumption often rises because demand grows faster than efficiency gains [3].",

  citations: [
    { id: 1, title: "Jevons, W.S. \u2014 The Coal Question (1865)", url: "#" },
    { id: 2, title: "Alcott, B. \u2014 Jevons\u2019 Paradox, Ecological Economics (2005)", url: "#" },
    { id: 3, title: "Sorrell, S. \u2014 The Rebound Effect, UK Energy Research Centre", url: "#" },
  ],

  typingSpeed: 45,
  loadingShimmerDuration: 1800,
  responseTypingSpeed: 20,
  insertToDocDelay: 1200,
  insertAnimationDuration: 800,
} as const;

// ============================================================
// GUIDED TOUR — 12 STEPS
// ============================================================

export const TOUR_STEPS = [
  // --- Step 1: INTRO (yellow card, pulsing) ---
  {
    id: "intro",
    target: "editor-area",
    text: "Inkstone is a co-creative writing app where you\u2019re in charge.\n\nYou write. Your AI buddy handles the research, editing, fact-checking, and proofreading.\n\nClick me to see how it works!",
    cta: "Start \u2192",
    position: "center" as const,
    style: "yellow" as const, // special yellow card
  },
  // --- Step 2: ASK REWRITE ---
  {
    id: "ask-rewrite",
    target: "chat-input",
    text: "When you need a hand, just talk to your AI buddy. It\u2019s never about replacing you \u2014 it\u2019s helping you brainstorm and iterate, skip a draft or two.",
    cta: "Rewrite \u2192",
    position: "left" as const,
    triggersAct: "act1" as const,
  },
  // --- Step 3: WATCH MORPH ---
  {
    id: "watch-morph",
    target: "editor-paragraph",
    text: "Watch \u2014 the AI moves words around like magic. Right in your document.",
    position: "top" as const,
    autoAdvance: true,
  },
  // --- Step 4: REWRITE DONE — tooltip sits above the proofreading bar ---
  {
    id: "rewrite-done",
    target: "proofbar",
    text: "Rough notes \u2192 polished prose. No copy-pasting between apps. No switching tabs. Accept or reject one by one or all at once.",
    cta: "Next: Proofreading \u2192",
    position: "top" as const,
    triggersAct: "act2" as const, // auto-starts proofread when advancing
  },
  // --- Step 5: SCANNING (auto-advances when diffs appear) ---
  {
    id: "scanning",
    target: "editor-paragraph",
    text: "Proofreading your document...",
    position: "top" as const,
    autoAdvance: true,
  },
  // --- Step 6: SEE DIFFS — explain AFTER they see the result ---
  {
    id: "see-diffs",
    target: "editor-paragraph",
    text: "Caught a typo and a missing word. Not just spell-check \u2014 it fills in what\u2019s missing too.",
    cta: "Accept All \u2192",
    position: "bottom" as const,
  },
  // --- Step 8: ASK RESEARCH ---
  {
    id: "ask-research",
    target: "chat-input",
    text: "Need to look something up? No more opening 20 tabs. Do GPT Deep Research or Perplexity-like Web Search, right in the app. Just ask.",
    cta: "Search \u2192",
    position: "left" as const,
    triggersAct: "act3" as const,
  },
  // --- Step 9: SEARCHING ---
  {
    id: "searching",
    target: "chat-messages",
    text: "Your AI research assistant is searching the web and synthesizing an answer with sources...",
    position: "left" as const,
    autoAdvance: true,
  },
  // --- Step 10: INSERT TO DOC ---
  {
    id: "insert-to-doc",
    target: "chat-insert-btn",
    text: "Research done. Citations included. One click to add it to your doc.",
    cta: "Insert to Doc \u2192",
    position: "left" as const,
  },
  // --- Step 10: SIDEBAR REVEAL ---
  {
    id: "sidebar-reveal",
    target: "sidebar",
    text: "Drafts, research, web searches \u2014 everything lives in your project. Nothing gets lost. No more juggling.",
    cta: "One more thing \u2192",
    position: "right" as const,
    opensSidebar: true,
  },
  // --- Step 11: FINALE ---
  {
    id: "finale",
    target: "center",
    text: "Write. Rewrite. Proofread. Research. Fact-check.\n\nAll in one place. No more 20 tabs and 5 subscriptions.\n\nYou\u2019re the boss. Your AI team handles the rest.",
    cta: "Try Inkstone for FREE \u2192",
    ctaLink: "https://accounts.inkstone.pro/sign-up",
    position: "center" as const,
    showReplay: true,
    style: "yellow" as const,
  },
] as const;

// ============================================================
// Global Timing
// ============================================================

export const TIMING = {
  interActDelay: 1000,
  estimatedTotalDuration: 35_000,
} as const;
