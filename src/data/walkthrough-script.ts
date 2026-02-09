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
  /** Document title shown in the title bar */
  title: "The Craftsman Table and the IKEA Desk",
  /** Project name shown below title */
  project: "Substack Articles",
} as const;

// ============================================================
// SIDEBAR — Project tree shown when sidebar opens at Step 13
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
// Rough notes about the IKEA/craftsman metaphor → polished prose
// ============================================================

export const ACT1 = {
  /** Rough notes — how a writer actually drafts */
  roughDraft:
    "AI is like the difference between an IKEA table and a handmade one. Before IKEA you had to make tables by hand or pay a lot. After IKEA everyone gets a table. Not amazing but functional. But the craftsman tables didn\u2019t go away. We just ended up with more tables everywhere. Kitchen table, dining room, side tables, office desk. That\u2019s called Jevons Paradox I think. When something gets cheap we want more of it not less.",

  /** Polished version — from the published article */
  polishedDraft:
    "When it comes to writing and AI, think about it like a hand-crafted table versus an IKEA table. Before IKEA, every table was handcrafted and that meant only a small number of people could afford them. After IKEA everyone can have a good, solid table. Maybe not a craftsman level table, but a table that works and does what a table should do. But IKEA didn\u2019t make the craftsman tables disappear. We just got more tables. That\u2019s Jevons Paradox in action. Once something gets cheaper and more ubiquitous, we want more of it.",

  /** Chat message that triggers the rewrite */
  chatPrompt: "Tighten this up and make it flow better. Keep my voice.",

  /** Timing */
  typingSpeed: 50, // ms per character for chat message
  thinkingDelay: 800, // ms "thinking" shimmer before morph
  morphDuration: 2500, // ms for the text morph animation
} as const;

// ============================================================
// ACT 2: "The Proofread"
// The polished draft has a typo and a missing word
// ============================================================

export const ACT2 = {
  /** Text with deliberate errors */
  textWithErrors:
    "When it comes to writing and AI, think about it like a hand-crafted table versus an IKEA table. Before IKEA, every table was handcrafed and that meant only a small number of people could them. After IKEA everyone can have a good, solid table. Maybe not a craftsman level table, but a table that works and does what a table should do. But IKEA didn\u2019t make the craftsman tables disappear. We just got more tables. That\u2019s Jevons Paradox in action. Once something gets cheaper and more ubiquitous, we want more of it.",

  /** Clean text after all diffs are accepted */
  cleanText:
    "When it comes to writing and AI, think about it like a hand-crafted table versus an IKEA table. Before IKEA, every table was handcrafted and that meant only a small number of people could afford them. After IKEA everyone can have a good, solid table. Maybe not a craftsman level table, but a table that works and does what a table should do. But IKEA didn\u2019t make the craftsman tables disappear. We just got more tables. That\u2019s Jevons Paradox in action. Once something gets cheaper and more ubiquitous, we want more of it.",

  /** Individual diffs to animate */
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

  /** Timing */
  scanningDelay: 1200,
  diffStaggerDelay: 400,
  acceptAllDelay: 1500,
  resolveAnimationDuration: 600,
} as const;

// ============================================================
// ACT 3: "The Research"
// Look up Jevons Paradox — a fact referenced in the article
// ============================================================

export const ACT3 = {
  /** User's research query */
  chatPrompt: "What is Jevons Paradox and who first described it?",

  /** AI's synthesized response with inline citations */
  researchResponse:
    "Jevons Paradox was first described by English economist William Stanley Jevons in his 1865 book The Coal Question [1]. He observed that as coal use became more efficient, total consumption increased rather than decreased [2]. The principle has since been applied broadly \u2014 when a resource becomes cheaper or more efficient to use, total consumption often rises because demand grows faster than efficiency gains [3].",

  /** Citation sources */
  citations: [
    {
      id: 1,
      title: "Jevons, W.S. \u2014 The Coal Question (1865)",
      url: "#",
    },
    {
      id: 2,
      title: "Alcott, B. \u2014 Jevons\u2019 Paradox, Ecological Economics (2005)",
      url: "#",
    },
    {
      id: 3,
      title: "Sorrell, S. \u2014 The Rebound Effect, UK Energy Research Centre",
      url: "#",
    },
  ],

  /** Timing */
  typingSpeed: 45,
  loadingShimmerDuration: 1800,
  responseTypingSpeed: 20,
  insertToDocDelay: 1200,
  insertAnimationDuration: 800,
} as const;

// ============================================================
// GUIDED TOUR STEPS
// ============================================================

/**
 * GUIDED TOUR STEPS
 *
 * Each tooltip hits one of the emotional themes proven to convert
 * from X ad performance data:
 * - Co-creativity and partnership (top performer: 1.53%)
 * - User agency / "you're the boss"
 * - Offloading tedium
 * - No more 50 tabs / one place
 * - Magic / delight
 * - Nothing gets lost
 */

export const TOUR_STEPS = [
  {
    id: "intro",
    target: "editor-area",
    text: "You write. Your AI buddy handles the research, editing, fact-checking, and proofreading. Let\u2019s see how it works.",
    cta: "Start \u2192",
    position: "center" as const,
  },
  {
    id: "rough-draft",
    target: "editor-paragraph",
    text: "Every great piece starts rough. Notes, half-baked ideas, fragments. That\u2019s fine \u2014 you\u2019re the idea machine.",
    cta: "Next \u2192",
    position: "bottom" as const,
  },
  {
    id: "ask-rewrite",
    target: "chat-input",
    text: "Just talk to your AI buddy. It\u2019s not replacing you \u2014 it\u2019s helping you skip a draft or two.",
    cta: "Rewrite \u2192",
    position: "left" as const,
    triggersAct: "act1" as const,
  },
  {
    id: "watch-morph",
    target: "editor-paragraph",
    text: "Watch \u2014 the AI moves words around like magic. Right in your document.",
    position: "top" as const,
    autoAdvance: true,
  },
  {
    id: "rewrite-done",
    target: "editor-paragraph",
    text: "Rough notes \u2192 polished prose. No copy-pasting between apps. No switching tabs.",
    cta: "Next: Proofreading \u2192",
    position: "bottom" as const,
  },
  {
    id: "click-proofread",
    target: "toolbar-proofread",
    text: "Now hand off the tedious stuff. One click and your AI proofreader gets to work.",
    cta: "Proofread \u2192",
    position: "bottom" as const,
    triggersAct: "act2" as const,
  },
  {
    id: "scanning",
    target: "editor-paragraph",
    text: "Your AI team is scanning the document...",
    position: "top" as const,
    autoAdvance: true,
  },
  {
    id: "see-diffs",
    target: "editor-paragraph",
    text: "Not just spell-check. It caught a missing word too. Red = delete. Green = insert.",
    cta: "Accept All \u2192",
    position: "bottom" as const,
  },
  {
    id: "diffs-resolved",
    target: "editor-paragraph",
    text: "All fixed. One click. That\u2019s your proofreader, fact-checker, and editor on call 24/7.",
    cta: "Next: Research \u2192",
    position: "bottom" as const,
  },
  {
    id: "ask-research",
    target: "chat-input",
    text: "Need to look something up? No more opening 20 tabs. Just ask.",
    cta: "Search \u2192",
    position: "left" as const,
    triggersAct: "act3" as const,
  },
  {
    id: "searching",
    target: "chat-messages",
    text: "Your AI research assistant is searching the web and synthesizing an answer with sources...",
    position: "left" as const,
    autoAdvance: true,
  },
  {
    id: "insert-to-doc",
    target: "chat-insert-btn",
    text: "Research done. Citations included. One click to add it to your doc.",
    cta: "Insert to Doc \u2192",
    position: "left" as const,
  },
  {
    id: "sidebar-reveal",
    target: "sidebar",
    text: "Drafts, research, web searches \u2014 everything lives in your project. Nothing gets lost. No more juggling.",
    position: "right" as const,
    opensSidebar: true,
  },
  {
    id: "finale",
    target: "center",
    text: "Think. Brainstorm. Write. Research. Edit. Iterate.\nOne app. One place. You\u2019re the boss.",
    cta: "Try for FREE \u2192",
    ctaLink: "https://accounts.inkstone.pro/sign-up",
    position: "center" as const,
    showReplay: true,
  },
] as const;

// ============================================================
// Global Timing
// ============================================================

export const TIMING = {
  /** Delay between acts when auto-playing */
  interActDelay: 1000,
  /** How long the complete walkthrough takes (~30-45s guided) */
  estimatedTotalDuration: 40_000,
} as const;
