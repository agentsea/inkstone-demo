/**
 * Mobile Camera Shots — "Screen Studio" virtual camera positions.
 *
 * Each shot defines where the camera focuses on the 1200×800 desktop canvas.
 * The MobileCameraWrapper maps walkthrough state → shot index → camera transform.
 *
 * Currently implements shots 1–6 (through Act 2 proofreading).
 */

export interface CameraShot {
  id: string;
  scale: number;
  originX: number;
  originY: number;
  caption: string;
  captionLink?: string;
  /** Duration of camera transition IN (ms) */
  transitionMs: number;
  /** CSS easing for the camera move */
  easing: string;
}

/**
 * Canvas dimensions — the walkthrough always renders at this size
 * regardless of actual viewport.
 */
export const CANVAS = {
  width: 1200,
  height: 800,
} as const;

export const MOBILE_SHOTS: CameraShot[] = [
  // Shot 1 — ESTABLISHING WIDE
  {
    id: "wide-open",
    scale: 0.31,
    originX: 600,
    originY: 400,
    caption: "Meet your AI writing team.",
    transitionMs: 0, // no transition — starting position
    easing: "ease",
  },
  // Shot 2 — ZOOM TO CHAT INPUT (typing)
  {
    id: "chat-input-typing",
    scale: 1.15,
    originX: 990,
    originY: 740,
    caption: "When you need a hand, just talk to your AI buddy.",
    transitionMs: 800,
    easing: "cubic-bezier(0.16, 1, 0.3, 1)", // ease-out expo
  },
  // Shot 3 — PAN UP: MESSAGE SENT
  {
    id: "message-sent",
    scale: 1.1,
    originX: 990,
    originY: 480,
    caption: "Watch what happens next\u2026",
    transitionMs: 600,
    easing: "cubic-bezier(0.33, 1, 0.68, 1)", // ease-out cubic
  },
  // Shot 4 — PAN LEFT: TEXT MORPH (the hero transition)
  {
    id: "text-morph",
    scale: 1.1,
    originX: 430,
    originY: 400,
    caption: "Words move like magic. Right in your doc.",
    transitionMs: 800,
    easing: "cubic-bezier(0.33, 1, 0.68, 1)",
  },
  // Shot 5 — HOLD: REWRITE DIFFS
  {
    id: "rewrite-diffs",
    scale: 1.1,
    originX: 430,
    originY: 400,
    caption: "Rough notes \u2192 polished prose.",
    transitionMs: 400,
    easing: "ease",
  },
  // Shot 6 — SLIGHT ZOOM: PROOFREADING DIFFS
  {
    id: "proofread-diffs",
    scale: 1.25,
    originX: 430,
    originY: 380,
    caption: "Catches typos and missing words.",
    transitionMs: 500,
    easing: "cubic-bezier(0.33, 1, 0.68, 1)",
  },
];
