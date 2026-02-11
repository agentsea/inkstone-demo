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

/** Approximate height of caption card (for initial viewport size estimate) */
const CAPTION_CARD_HEIGHT = 80;

/**
 * Map a walkthrough state snapshot → shot index (0-based).
 * Returns the shot that should be active for the given state.
 *
 * Shot indices:
 *  0 = wide open          6 = research typing
 *  1 = chat input typing  7 = research response
 *  2 = message sent        8 = insert to doc
 *  3 = text morph           9 = sidebar reveal
 *  4 = rewrite diffs       10 = finale
 *  5 = proofread diffs
 */
function snapshotToShotIndex(snap: WalkthroughSnapshot): number {
  const { state, chatTypingDone, sidebarOpen, researchPhase } = snap;

  // --- Act 3 complete → finale (shot 11)
  if (state === "act3-complete") return 10;
  // --- Sidebar opened → sidebar reveal (shot 10)
  if (sidebarOpen) return 9;
  // --- Research: inserted → insert to doc (shot 9)
  if (researchPhase === "inserted" || researchPhase === "inserting") return 8;
  // --- Research: response visible → research response (shot 8)
  if (researchPhase === "response-visible") return 7;
  // --- Act 3 running, typing done → research loading/response (shot 8)
  if (state === "act3" && chatTypingDone) return 7;
  // --- Act 3 running, typing → research typing (shot 7)
  if (state === "act3" && !chatTypingDone) return 6;
  // --- Act 2 complete → stays on proofread diffs briefly
  if (state === "act2-complete") return 5;
  // --- Act 2 running → proofread diffs (shot 6)
  if (state === "act2") return 5;
  // --- Act 1 complete → rewrite diffs (shot 5)
  if (state === "act1-complete") return 4;
  // --- Act 1 running, typing done → text morph (shot 4)
  if (state === "act1" && chatTypingDone) return 3;
  // --- Act 1 running, typing → chat input (shot 2)
  if (state === "act1" && !chatTypingDone) return 1;
  // --- Idle → wide (shot 1)
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
  const [viewportSize, setViewportSize] = useState({ w: 375, h: 667 - CAPTION_CARD_HEIGHT });

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

  // Hold the establishing wide shot for a fixed duration before the camera starts tracking.
  // The walkthrough auto-starts after 500ms, but we want to hold the wide shot for 2.5s
  // so the viewer absorbs "this is a real desktop app" before we zoom in.
  const [holdingWide, setHoldingWide] = useState(true);
  const holdTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Start hold timer when first meaningful state arrives
  const handleSnapshot = useCallback(
    (snap: WalkthroughSnapshot) => {
      // When the walkthrough starts act1, begin the hold countdown
      if (holdingWide && snap.state === "act1" && !holdTimerRef.current) {
        holdTimerRef.current = setTimeout(() => {
          setHoldingWide(false);
        }, 2000); // 2s hold on wide shot after act starts
      }

      if (holdingWide) return; // still showing establishing wide shot

      const idx = snapshotToShotIndex(snap);
      const clamped = Math.min(idx, MOBILE_SHOTS.length - 1);

      if (clamped !== shotIndex) {
        setShotIndex(clamped);
        setCaption(MOBILE_SHOTS[clamped].caption);
      }
    },
    [holdingWide, shotIndex],
  );

  // Cleanup hold timer
  useEffect(() => {
    return () => {
      if (holdTimerRef.current) clearTimeout(holdTimerRef.current);
    };
  }, []);

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

      {/* Caption card — frosted glass, overlaid at bottom, NOT transformed */}
      <div className="mobile-camera__caption-card">
        {shot.captionLink ? (
          <a
            className="mobile-camera__caption-link"
            href={shot.captionLink}
            target="_blank"
            rel="noopener noreferrer"
            key={shot.id}
          >
            {caption}
          </a>
        ) : (
          <p className="mobile-camera__caption-text" key={shot.id}>
            {caption}
          </p>
        )}
      </div>
    </div>
  );
}
