/**
 * Walkthrough Script — All canned content for the 3-act demo.
 *
 * Every word, every diff, every timing value lives here.
 * Zero API calls. Zero runtime cost per visitor.
 */

// ============================================================
// ACT 1: "The Rewrite"
// ============================================================

export const ACT1 = {
  /** The rough draft the visitor first sees */
  roughDraft:
    "Coffee has been drank by people for a really long time. It started in Africa somewhere and then got popular in Europe and now basically everyone drinks it. There's a lot of coffee companies now.",

  /** The polished version after AI "rewrites" it */
  polishedDraft:
    "From its origins in the Ethiopian highlands, coffee has journeyed across continents to become the world\u2019s most traded commodity after oil. Today, over 2.25 billion cups are consumed daily \u2014 a testament to the humble bean\u2019s extraordinary cultural grip.",

  /** Chat message that triggers the rewrite */
  chatPrompt: "Rewrite this to be compelling and well-researched",

  /** Timing */
  typingSpeed: 50, // ms per character for chat message
  thinkingDelay: 800, // ms "thinking" shimmer before morph
  morphDuration: 2500, // ms for the text morph animation
} as const;

// ============================================================
// ACT 2: "The Proofread"
// ============================================================

export const ACT2 = {
  /** Text with deliberate errors (shown after Act 1 completes) */
  textWithErrors:
    "From its origins in the Ethiopian hghlands, coffee has journeyed across continents to become the world\u2019s most traded commodity after oil. Today, over 2.25 billion cups consumed daily \u2014 a testament to the humble bean\u2019s extraordinary cultural grip.",

  /** Clean text after all diffs are accepted */
  cleanText:
    "From its origins in the Ethiopian highlands, coffee has journeyed across continents to become the world\u2019s most traded commodity after oil. Today, over 2.25 billion cups are consumed daily \u2014 a testament to the humble bean\u2019s extraordinary cultural grip.",

  /** Individual diffs to animate */
  diffs: [
    {
      type: "replace" as const,
      original: "hghlands",
      corrected: "highlands",
      description: "Spelling correction",
    },
    {
      type: "insert" as const,
      before: "cups",
      after: "cups are",
      inserted: "are",
      description: "Missing word insertion",
    },
  ],

  /** Timing */
  scanningDelay: 1200, // ms for "Scanning for errors..." text
  diffStaggerDelay: 400, // ms between each diff appearing
  acceptAllDelay: 1500, // ms before "Accept All" auto-clicks
  resolveAnimationDuration: 600, // ms for diffs to resolve
} as const;

// ============================================================
// ACT 3: "The Research"
// ============================================================

export const ACT3 = {
  /** User's research query in chat */
  chatPrompt: "What are the environmental impacts of coffee farming?",

  /** AI's synthesized response with inline citations */
  researchResponse:
    'Coffee farming contributes to deforestation, with an estimated 2.5 million acres of forest cleared annually for production [1]. Water usage is also significant \u2014 producing one cup requires approximately 140 liters [2]. However, shade-grown and organic methods are reducing these impacts [3].',

  /** Citation sources */
  citations: [
    {
      id: 1,
      title: "Global Forest Watch — Coffee & Deforestation Report",
      url: "#",
    },
    {
      id: 2,
      title: "Water Footprint Network — Coffee Production Analysis",
      url: "#",
    },
    {
      id: 3,
      title: "Rainforest Alliance — Sustainable Coffee Farming",
      url: "#",
    },
  ],

  /** Timing */
  typingSpeed: 45, // ms per character for chat query
  loadingShimmerDuration: 1800, // ms for loading skeleton
  responseTypingSpeed: 20, // ms per character for AI response
  insertToDocDelay: 1200, // ms before "Insert to Doc" auto-clicks
  insertAnimationDuration: 800, // ms for content to flow into doc
} as const;

// ============================================================
// Global Timing
// ============================================================

export const TIMING = {
  /** Delay between acts when auto-playing */
  interActDelay: 1000,

  /** How long the complete walkthrough takes (~30s) */
  estimatedTotalDuration: 30_000,
} as const;
