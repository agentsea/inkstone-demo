/**
 * DiffAnimation — Inline red/green proofreading diffs for Act 2.
 *
 * In guided mode, diffs appear and WAIT for external accept signal.
 * In auto mode, diffs auto-accept after a delay.
 *
 * Renders inline red (deletion) and green (insertion) markers.
 */

import { useState, useEffect, useRef } from "react";
import { ACT2 } from "../data/walkthrough-script";

interface DiffAnimationProps {
  isActive: boolean;
  /** When true, diffs hold visible until acceptAll is called */
  waitForAccept?: boolean;
  /** External trigger to accept all diffs */
  acceptAll?: boolean;
  onDiffsVisible?: () => void;
  onComplete?: () => void;
}

type DiffPhase = "idle" | "scanning" | "showing-diffs" | "accepting" | "clean";

export function DiffAnimation({
  isActive,
  waitForAccept = false,
  acceptAll = false,
  onDiffsVisible,
  onComplete,
}: DiffAnimationProps) {
  const [phase, setPhase] = useState<DiffPhase>("idle");
  const [visibleDiffs, setVisibleDiffs] = useState(0);
  const onCompleteRef = useRef(onComplete);
  const onDiffsVisibleRef = useRef(onDiffsVisible);
  onCompleteRef.current = onComplete;
  onDiffsVisibleRef.current = onDiffsVisible;

  // Main animation sequence
  useEffect(() => {
    if (!isActive) {
      setPhase("idle");
      setVisibleDiffs(0);
      return;
    }

    setPhase("scanning");
    const timers: ReturnType<typeof setTimeout>[] = [];

    // After scanning delay, show diffs one by one
    timers.push(
      setTimeout(() => {
        setPhase("showing-diffs");

        ACT2.diffs.forEach((_, i) => {
          timers.push(
            setTimeout(() => {
              setVisibleDiffs(i + 1);

              // After last diff appears, notify and optionally auto-accept
              if (i === ACT2.diffs.length - 1) {
                timers.push(
                  setTimeout(() => {
                    onDiffsVisibleRef.current?.();

                    // In auto mode, accept after delay
                    if (!waitForAccept) {
                      timers.push(
                        setTimeout(() => {
                          setPhase("accepting");
                          timers.push(
                            setTimeout(() => {
                              setPhase("clean");
                              onCompleteRef.current?.();
                            }, ACT2.resolveAnimationDuration)
                          );
                        }, ACT2.acceptAllDelay)
                      );
                    }
                  }, 300)
                );
              }
            }, i * ACT2.diffStaggerDelay)
          );
        });
      }, ACT2.scanningDelay)
    );

    return () => timers.forEach(clearTimeout);
  }, [isActive, waitForAccept]);

  // External accept trigger (from guided tour)
  useEffect(() => {
    if (acceptAll && phase === "showing-diffs") {
      setPhase("accepting");
      const timer = setTimeout(() => {
        setPhase("clean");
        onCompleteRef.current?.();
      }, ACT2.resolveAnimationDuration);
      return () => clearTimeout(timer);
    }
  }, [acceptAll, phase]);

  if (phase === "idle") {
    return <span className="diff-text">{ACT2.textWithErrors}</span>;
  }

  if (phase === "scanning") {
    return (
      <span className="diff-text">
        {ACT2.textWithErrors}
        <span className="diff-scanning">
          {" "}Scanning for errors...
        </span>
      </span>
    );
  }

  if (phase === "clean") {
    return <span className="diff-text">{ACT2.cleanText}</span>;
  }

  // showing-diffs or accepting
  const isResolving = phase === "accepting";

  return (
    <span className="diff-text">
      {renderTextWithDiffs(visibleDiffs, isResolving)}
    </span>
  );
}

function renderTextWithDiffs(
  visibleCount: number,
  isResolving: boolean
): React.ReactNode[] {
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

      nodes.push(remaining.slice(0, pos));

      if (isVisible) {
        nodes.push(
          <span
            key={`del-${diff.original}`}
            className={`diff-deletion ${isResolving ? "diff-deletion--resolved" : ""}`}
          >
            {diff.original}
          </span>
        );
        nodes.push(
          <span
            key={`ins-${diff.corrected}`}
            className="diff-insertion"
          >
            {diff.corrected}
          </span>
        );
      } else {
        nodes.push(diff.original);
      }

      remaining = remaining.slice(pos + diff.original.length);
    } else if (diff.type === "insert") {
      const pos = remaining.indexOf(diff.before);
      if (pos === -1) continue;

      nodes.push(remaining.slice(0, pos + diff.before.length));

      if (isVisible) {
        nodes.push(
          <span
            key={`ins-${diff.inserted}`}
            className="diff-insertion"
          >
            {" "}{diff.inserted}
          </span>
        );
      }

      remaining = remaining.slice(pos + diff.before.length);
    }
  }

  nodes.push(remaining);
  return nodes;
}
