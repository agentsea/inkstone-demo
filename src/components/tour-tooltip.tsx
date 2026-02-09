/**
 * TourTooltip — Guided tour tooltip that points at target elements.
 *
 * Shows text + optional CTA button. Positioned relative to a target
 * element using data-tour-target attributes. Includes a pointer arrow
 * and a subtle spotlight effect on the target.
 */

import { useEffect, useState, useRef } from "react";
import { m, AnimatePresence } from "motion/react";
import "./tour-tooltip.css";

interface TourTooltipProps {
  text: string;
  cta?: string;
  ctaLink?: string;
  showReplay?: boolean;
  target: string; // data-tour-target value, or "center"
  position: "top" | "bottom" | "left" | "right" | "center";
  visible: boolean;
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
  onCtaClick,
  onReplay,
}: TourTooltipProps) {
  const [style, setStyle] = useState<React.CSSProperties>({});
  const tooltipRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!visible) return;

    if (target === "center") {
      setStyle({
        position: "fixed",
        top: "50%",
        left: "50%",
        transform: "translate(-50%, -50%)",
      });
      return;
    }

    // Find target element
    const el = document.querySelector(`[data-tour-target="${target}"]`);
    if (!el) {
      // Fallback to center
      setStyle({
        position: "fixed",
        top: "50%",
        left: "50%",
        transform: "translate(-50%, -50%)",
      });
      return;
    }

    const rect = el.getBoundingClientRect();
    const tooltip = tooltipRef.current;
    const tw = tooltip?.offsetWidth || 280;
    const th = tooltip?.offsetHeight || 100;
    const gap = 12;

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
      default:
        top = rect.bottom + gap;
        left = rect.left + rect.width / 2 - tw / 2;
    }

    // Clamp to viewport
    left = Math.max(8, Math.min(left, window.innerWidth - tw - 8));
    top = Math.max(8, Math.min(top, window.innerHeight - th - 8));

    setStyle({
      position: "fixed",
      top: `${top}px`,
      left: `${left}px`,
    });
  }, [visible, target, position]);

  return (
    <AnimatePresence>
      {visible && (
        <>
          {/* Spotlight overlay — dim everything except target */}
          {target !== "center" && (
            <SpotlightOverlay target={target} />
          )}

          <m.div
            ref={tooltipRef}
            className={`tour-tooltip tour-tooltip--${position}`}
            style={style}
            initial={{ opacity: 0, y: 8, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -8, scale: 0.95 }}
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
}

/** Subtle overlay that highlights the target element */
function SpotlightOverlay({ target }: { target: string }) {
  const [clipPath, setClipPath] = useState<string>("none");

  useEffect(() => {
    const el = document.querySelector(`[data-tour-target="${target}"]`);
    if (!el) return;

    const update = () => {
    const rect = el.getBoundingClientRect();
    const pad = 4;
    // Create a clip-path that cuts out the target area
      const x = rect.left - pad;
      const y = rect.top - pad;
      const w = rect.width + pad * 2;
      const h = rect.height + pad * 2;

      setClipPath(
        `polygon(0% 0%, 0% 100%, ${x}px 100%, ${x}px ${y}px, ${x + w}px ${y}px, ${x + w}px ${y + h}px, ${x}px ${y + h}px, ${x}px 100%, 100% 100%, 100% 0%)`
      );
    };

    update();
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, [target]);

  return (
    <m.div
      className="tour-spotlight"
      style={{ clipPath }}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
    />
  );
}
