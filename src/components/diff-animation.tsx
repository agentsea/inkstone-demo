/**
 * DiffAnimation — Inline red/green proofreading diffs for Act 2.
 *
 * Renders text with animated diff markers that appear sequentially.
 * Deletions: red background + strikethrough.
 * Insertions: green background.
 * "Accept All" resolves all diffs with a smooth fade.
 */

import { useState, useEffect, useRef } from "react";
import { m, AnimatePresence } from "motion/react";
import { ACT2 } from "../data/walkthrough-script";

interface DiffAnimationProps {
  isActive: boolean;
  onComplete?: () => void;
}

type DiffPhase = "idle" | "scanning" | "showing-diffs" | "accepting" | "clean";

export function DiffAnimation({ isActive, onComplete }: DiffAnimationProps) {
  const [phase, setPhase] = useState<DiffPhase>("idle");
  const [visibleDiffs, setVisibleDiffs] = useState(0);
  const [showAcceptButton, setShowAcceptButton] = useState(false);
  const onCompleteRef = useRef(onComplete);
  onCompleteRef.current = onComplete;

  useEffect(() => {
    if (!isActive) {
      setPhase("idle");
      setVisibleDiffs(0);
      setShowAcceptButton(false);
      return;
    }

    // Sequence: scanning → show diffs one by one → accept all → clean
    setPhase("scanning");

    const timers: ReturnType<typeof setTimeout>[] = [];

    // After scanning delay, start showing diffs
    timers.push(
      setTimeout(() => {
        setPhase("showing-diffs");

        // Stagger each diff
        ACT2.diffs.forEach((_, i) => {
          timers.push(
            setTimeout(() => {
              setVisibleDiffs(i + 1);

              // After last diff, show Accept All button
              if (i === ACT2.diffs.length - 1) {
                timers.push(
                  setTimeout(() => {
                    setShowAcceptButton(true);

                    // Auto-click Accept All
                    timers.push(
                      setTimeout(() => {
                        setPhase("accepting");
                        setShowAcceptButton(false);

                        // After resolve animation, go clean
                        timers.push(
                          setTimeout(() => {
                            setPhase("clean");
                            onCompleteRef.current?.();
                          }, ACT2.resolveAnimationDuration)
                        );
                      }, ACT2.acceptAllDelay)
                    );
                  }, 400)
                );
              }
            }, i * ACT2.diffStaggerDelay)
          );
        });
      }, ACT2.scanningDelay)
    );

    return () => timers.forEach(clearTimeout);
  }, [isActive]);

  if (phase === "idle") {
    return <span className="diff-text">{ACT2.textWithErrors}</span>;
  }

  if (phase === "scanning") {
    return (
      <span className="diff-text">
        {ACT2.textWithErrors}
        <m.span
          className="diff-scanning"
          initial={{ opacity: 0 }}
          animate={{ opacity: [0.4, 1, 0.4] }}
          transition={{ duration: 1.2, repeat: Infinity }}
        >
          {" "}
          Scanning for errors...
        </m.span>
      </span>
    );
  }

  if (phase === "clean") {
    return <span className="diff-text">{ACT2.cleanText}</span>;
  }

  // showing-diffs or accepting phase
  const isResolving = phase === "accepting";

  return (
    <span className="diff-text">
      {renderTextWithDiffs(visibleDiffs, isResolving)}
      <AnimatePresence>
        {showAcceptButton && (
          <m.button
            className="diff-accept-btn"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.3 }}
          >
            ✓ Accept All
          </m.button>
        )}
      </AnimatePresence>
    </span>
  );
}

function renderTextWithDiffs(
  visibleCount: number,
  isResolving: boolean
): React.ReactNode[] {
  // We need to render the text with inline diffs at the right positions.
  // For our simple 2-diff case, we do this by splitting the text at diff locations.

  const text: string = ACT2.textWithErrors;
  const nodes: React.ReactNode[] = [];
  let remaining: string = text;
  let diffIndex = 0;

  for (const diff of ACT2.diffs) {
    const isVisible = diffIndex < visibleCount;
    diffIndex++;

    if (diff.type === "replace") {
      const pos = remaining.indexOf(diff.original);
      if (pos === -1) continue;

      // Text before the diff
      nodes.push(remaining.slice(0, pos));

      if (isVisible) {
        nodes.push(
          <m.span
            key={`del-${diff.original}`}
            className="diff-deletion"
            initial={{ opacity: 0 }}
            animate={{
              opacity: isResolving ? 0 : 1,
            }}
            transition={{ duration: 0.3 }}
          >
            {diff.original}
          </m.span>
        );
        nodes.push(
          <m.span
            key={`ins-${diff.corrected}`}
            className="diff-insertion"
            initial={{ opacity: 0 }}
            animate={{
              opacity: 1,
            }}
            transition={{ duration: 0.3 }}
          >
            {diff.corrected}
          </m.span>
        );
      } else {
        nodes.push(diff.original);
      }

      remaining = remaining.slice(pos + diff.original.length);
    } else if (diff.type === "insert") {
      const pos = remaining.indexOf(diff.before);
      if (pos === -1) continue;

      // Text before the insertion point (including the "before" word)
      nodes.push(remaining.slice(0, pos + diff.before.length));

      if (isVisible) {
        nodes.push(
          <m.span
            key={`ins-${diff.inserted}`}
            className="diff-insertion"
            initial={{ opacity: 0 }}
            animate={{
              opacity: 1,
            }}
            transition={{ duration: 0.3 }}
          >
            {" "}
            {diff.inserted}
          </m.span>
        );
      }

      remaining = remaining.slice(pos + diff.before.length);
    }
  }

  // Remaining text
  nodes.push(remaining);

  return nodes;
}
