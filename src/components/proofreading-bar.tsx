/**
 * ProofreadingBar — Floating toolbar matching the real Inkstone proofreading UI.
 *
 * Layout: [Reject All] [Accept All] | [< prev] 1/2 [next >] | [Reject] [Accept] | [X]
 * Fixed at bottom center of viewport.
 */

import { ChevronLeft, ChevronRight, X } from "lucide-react";
import { m, AnimatePresence } from "motion/react";
import { ACT2 } from "../data/walkthrough-script";
import "./proofreading-bar.css";

interface ProofreadingBarProps {
  visible: boolean;
  currentIndex?: number;
  onAcceptAll?: () => void;
  onClose?: () => void;
}

export function ProofreadingBar({
  visible,
  currentIndex = 0,
  onAcceptAll,
  onClose,
}: ProofreadingBarProps) {
  const total = ACT2.diffs.length;
  const displayIndex = Math.min(currentIndex + 1, total);

  return (
    <AnimatePresence>
      {visible && (
        <m.div
          className="proofbar-wrapper"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 20 }}
          transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
        >
        <div className="proofbar" data-tour-target="proofbar">
          {/* Bulk actions */}
          <button className="proofbar__btn proofbar__btn--outline">
            Reject All
          </button>
          <button
            className="proofbar__btn proofbar__btn--primary"
            onClick={onAcceptAll}
          >
            Accept All
          </button>

          <div className="proofbar__separator" />

          {/* Navigation */}
          <button className="proofbar__icon-btn" title="Previous suggestion">
            <ChevronLeft size={16} />
          </button>
          <span className="proofbar__counter">
            {displayIndex}/{total}
          </span>
          <button className="proofbar__icon-btn" title="Next suggestion">
            <ChevronRight size={16} />
          </button>

          {/* Single actions */}
          <button className="proofbar__btn proofbar__btn--outline">
            Reject
          </button>
          <button className="proofbar__btn proofbar__btn--primary">
            Accept
          </button>

          <div className="proofbar__separator" />

          {/* Close */}
          <button
            className="proofbar__icon-btn"
            onClick={onClose}
            title="Close proofreading"
          >
            <X size={16} />
          </button>
        </div>
        </m.div>
      )}
    </AnimatePresence>
  );
}
