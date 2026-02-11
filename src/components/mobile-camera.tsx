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

/**
 * Map a walkthrough state snapshot → shot index (0-based).
 * Returns the shot that should be active for the given state.
 */
function snapshotToShotIndex(snap: WalkthroughSnapshot): number {
  const { state, chatTypingDone, diffsVisible } = snap;

  // Shot 6: Act 2 running, diffs visible
  if ((state === "act2" || state === "act2-complete") && diffsVisible) return 5;
  // Shot 6: Act 2 running, diffs not yet
  if (state === "act2") return 5;
  // Shot 5: Act 1 complete (rewrite diffs visible)
  if (state === "act1-complete") return 4;
  // Shot 4: Act 1 running, typing done → morph playing
  if (state === "act1" && chatTypingDone) return 3;
  // Shot 3: This is a brief transition — we'll merge it into shot 2→4
  // Shot 2: Act 1 running, typing in progress
  if (state === "act1" && !chatTypingDone) return 1;
  // Shot 1: Idle
  return 0;
}

export function MobileCameraWrapper({ theme, onToggleTheme }: MobileCameraProps) {
  const [shotIndex, setShotIndex] = useState(0);
  const [caption, setCaption] = useState(MOBILE_SHOTS[0].caption);
  const viewportRef = useRef<HTMLDivElement>(null);

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

  // For the "message sent" beat (shot 3 in the doc), we transition through
  // an intermediate position. For now, shots 2→4 is a direct pan.
  // We can add shot 3 as a refinement later.

  const canvasStyle: React.CSSProperties = {
    width: CANVAS.width,
    height: CANVAS.height,
    transformOrigin: `${shot.originX}px ${shot.originY}px`,
    transform: `scale(${shot.scale})`,
    transition: shot.transitionMs > 0
      ? `transform ${shot.transitionMs}ms ${shot.easing}, transform-origin ${shot.transitionMs}ms ${shot.easing}`
      : "none",
  };

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
