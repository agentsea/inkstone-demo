/**
 * MobileCameraWrapper — "Screen Studio" virtual camera for mobile viewports.
 *
 * Renders the desktop walkthrough at 1200×800 inside an overflow:hidden viewport,
 * then applies CSS transform: scale() + transform-origin to zoom/pan to the action.
 *
 * A caption bar at the bottom replaces tooltips on mobile.
 *
 * Desktop is completely untouched — this component is only mounted on mobile.
 */

import { useState, useCallback, useRef, useEffect } from "react";
import { Walkthrough, type WalkthroughSnapshot } from "./walkthrough";
import type { Theme } from "./theme-listener";
import { MOBILE_SHOTS, CANVAS, type CameraShot } from "../data/mobile-shots";
import "./mobile-camera.css";

interface MobileCameraProps {
  theme: Theme;
  onToggleTheme: () => void;
}

/** Height reserved for the caption bar at the bottom */
const CAPTION_BAR_HEIGHT = 48;

/**
 * Map a walkthrough state snapshot → shot index (0-based).
 * Returns the shot that should be active for the given state.
 */
function snapshotToShotIndex(snap: WalkthroughSnapshot): number {
  const { state, chatTypingDone } = snap;

  // Shot 6: Act 2 running or complete
  if (state === "act2" || state === "act2-complete") return 5;
  // Shot 5: Act 1 complete (rewrite diffs visible)
  if (state === "act1-complete") return 4;
  // Shot 4: Act 1 running, typing done → morph playing
  if (state === "act1" && chatTypingDone) return 3;
  // Shot 2: Act 1 running, typing in progress
  if (state === "act1" && !chatTypingDone) return 1;
  // Shot 1: Idle
  return 0;
}

/**
 * Compute CSS transform to center (originX, originY) in the viewport at the given scale.
 *
 * The math:
 * 1. Scale the canvas by `scale` from top-left (transform-origin: 0 0)
 * 2. Translate so that the focus point (originX, originY) lands at the viewport center
 *
 * translateX = viewportWidth/2 - originX * scale
 * translateY = viewportHeight/2 - originY * scale
 */
function computeTransform(
  shot: CameraShot,
  viewportW: number,
  viewportH: number,
): React.CSSProperties {
  const tx = viewportW / 2 - shot.originX * shot.scale;
  const ty = viewportH / 2 - shot.originY * shot.scale;

  return {
    width: CANVAS.width,
    height: CANVAS.height,
    transformOrigin: "0 0",
    transform: `translate(${tx}px, ${ty}px) scale(${shot.scale})`,
    transition:
      shot.transitionMs > 0
        ? `transform ${shot.transitionMs}ms ${shot.easing}`
        : "none",
  };
}

export function MobileCameraWrapper({ theme, onToggleTheme }: MobileCameraProps) {
  const [shotIndex, setShotIndex] = useState(0);
  const [caption, setCaption] = useState(MOBILE_SHOTS[0].caption);
  const viewportRef = useRef<HTMLDivElement>(null);
  const [viewportSize, setViewportSize] = useState({ w: 375, h: 667 - CAPTION_BAR_HEIGHT });

  // Measure the actual viewport size
  useEffect(() => {
    const el = viewportRef.current;
    if (!el) return;
    const ro = new ResizeObserver((entries) => {
      for (const entry of entries) {
        setViewportSize({
          w: entry.contentRect.width,
          h: entry.contentRect.height,
        });
      }
    });
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  // Track the walkthrough auto-start delay — show wide shot first
  const [started, setStarted] = useState(false);
  useEffect(() => {
    const t = setTimeout(() => setStarted(true), 2500); // hold wide shot for 2.5s
    return () => clearTimeout(t);
  }, []);

  const handleSnapshot = useCallback(
    (snap: WalkthroughSnapshot) => {
      if (!started) return; // still showing establishing wide shot

      const idx = snapshotToShotIndex(snap);
      // Clamp to available shots (we only have 1–6 so far)
      const clamped = Math.min(idx, MOBILE_SHOTS.length - 1);

      if (clamped !== shotIndex) {
        setShotIndex(clamped);
        setCaption(MOBILE_SHOTS[clamped].caption);
      }
    },
    [started, shotIndex],
  );

  const shot: CameraShot = MOBILE_SHOTS[shotIndex];
  const canvasStyle = computeTransform(shot, viewportSize.w, viewportSize.h);

  return (
    <div className="mobile-camera" data-theme={theme}>
      {/* Viewport — clips the 1200×800 canvas to mobile size */}
      <div className="mobile-camera__viewport" ref={viewportRef}>
        <div className="mobile-camera__canvas" style={canvasStyle}>
          <Walkthrough
            theme={theme}
            onToggleTheme={onToggleTheme}
            modeOverride="auto"
            forceDesktopLayout={true}
            onSnapshot={handleSnapshot}
          />
        </div>
      </div>

      {/* Caption bar — overlaid at bottom, NOT transformed */}
      <div className="mobile-camera__caption-bar">
        <p className="mobile-camera__caption-text" key={shot.id}>
          {caption}
        </p>
      </div>
    </div>
  );
}
