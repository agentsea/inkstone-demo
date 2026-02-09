/**
 * TourTooltip — Guided tour tooltip rendered via portal.
 *
 * Renders to document.body to escape all stacking contexts.
 * Simple dim overlay instead of clip-path spotlight (avoids artifacts).
 * Target element gets a highlight ring via a positioned outline.
 */

import { useEffect, useState, useRef } from "react";
import { createPortal } from "react-dom";
import { m, AnimatePresence } from "motion/react";
import "./tour-tooltip.css";

interface TourTooltipProps {
  text: string;
  cta?: string;
  ctaLink?: string;
  showReplay?: boolean;
  target: string;
  position: "top" | "bottom" | "left" | "right" | "center";
  visible: boolean;
  noOverlay?: boolean; // Don't dim — let user see the content (diffs, morph, etc.)
  onCtaClick?: () => void;
  onReplay?: () => void;
}

export function TourTooltip({
  text,
  cta,
  ctaLink,
  showReplay,
  target,
  position,
  visible,
  noOverlay = false,
  onCtaClick,
  onReplay,
}: TourTooltipProps) {
  const [tooltipStyle, setTooltipStyle] = useState<React.CSSProperties>({});
  const [highlightStyle, setHighlightStyle] = useState<React.CSSProperties>({});
  const [showHighlight, setShowHighlight] = useState(false);
  const tooltipRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!visible) {
      setShowHighlight(false);
      return;
    }

    const positionTooltip = () => {
      if (target === "center") {
        setTooltipStyle({
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
        });
        setShowHighlight(false);
        return;
      }

      const el = document.querySelector(`[data-tour-target="${target}"]`);
      if (!el) {
        setTooltipStyle({
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
        });
        setShowHighlight(false);
        return;
      }

      const rect = el.getBoundingClientRect();
      const tw = tooltipRef.current?.offsetWidth || 300;
      const th = tooltipRef.current?.offsetHeight || 120;
      const gap = 16;

      let top = 0;
      let left = 0;

      switch (position) {
        case "top":
          top = rect.top - th - gap;
          left = rect.left + rect.width / 2 - tw / 2;
          break;
        case "bottom":
          top = rect.bottom + gap;
          left = rect.left + rect.width / 2 - tw / 2;
          break;
        case "left":
          top = rect.top + rect.height / 2 - th / 2;
          left = rect.left - tw - gap;
          break;
        case "right":
          top = rect.top + rect.height / 2 - th / 2;
          left = rect.right + gap;
          break;
      }

      // Clamp to viewport
      left = Math.max(12, Math.min(left, window.innerWidth - tw - 12));
      top = Math.max(12, Math.min(top, window.innerHeight - th - 12));

      setTooltipStyle({ top: `${top}px`, left: `${left}px` });

      // Position highlight ring around target
      const pad = 4;
      setHighlightStyle({
        top: `${rect.top - pad}px`,
        left: `${rect.left - pad}px`,
        width: `${rect.width + pad * 2}px`,
        height: `${rect.height + pad * 2}px`,
      });
      setShowHighlight(true);
    };

    positionTooltip();

    // Reposition on resize/scroll
    window.addEventListener("resize", positionTooltip);
    window.addEventListener("scroll", positionTooltip, true);
    return () => {
      window.removeEventListener("resize", positionTooltip);
      window.removeEventListener("scroll", positionTooltip, true);
    };
  }, [visible, target, position]);

  const content = (
    <AnimatePresence>
      {visible && (
        <>
          {/* Dim overlay — hidden when noOverlay so user can see content */}
          {!noOverlay && (
            <m.div
              className="tour-overlay"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
            />
          )}

          {/* Highlight ring around target */}
          {showHighlight && !noOverlay && (
            <m.div
              className="tour-highlight"
              style={highlightStyle}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
            />
          )}

          {/* Tooltip */}
          <m.div
            ref={tooltipRef}
            className="tour-tooltip"
            style={tooltipStyle}
            initial={{ opacity: 0, y: 8, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -8, scale: 0.96 }}
            transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
          >
            <p className="tour-tooltip__text">{text}</p>
            <div className="tour-tooltip__actions">
              {cta && !ctaLink && (
                <button className="tour-tooltip__cta" onClick={onCtaClick}>
                  {cta}
                </button>
              )}
              {cta && ctaLink && (
                <a
                  className="tour-tooltip__cta tour-tooltip__cta--link"
                  href={ctaLink}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {cta}
                </a>
              )}
              {showReplay && (
                <button className="tour-tooltip__replay" onClick={onReplay}>
                  Replay tour
                </button>
              )}
            </div>
          </m.div>
        </>
      )}
    </AnimatePresence>
  );

  // Render via portal to escape stacking contexts
  return createPortal(content, document.body);
}
