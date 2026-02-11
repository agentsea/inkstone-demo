/**
 * TextMorph — FLIP word-swap animation for Act 1.
 *
 * Words physically move to new positions:
 * - Matched words SLIDE from old position to new position
 * - Removed words SHRINK and FADE OUT
 * - New words FADE IN and EXPAND into place
 *
 * No color changes. Pure spatial animation. "Moves words around like magic."
 *
 * Uses manual FLIP (First, Last, Invert, Play) for precise control.
 */

import { useState, useEffect, useRef, useCallback } from "react";

interface TextMorphProps {
  from: string;
  to: string;
  isActive: boolean;
  duration?: number;
  onComplete?: () => void;
}

type Phase = "before" | "measuring" | "animating" | "after";

interface DiffToken {
  text: string;
  type: "keep" | "add" | "remove";
  /** Index in old word array (for "keep" and "remove") */
  oldIdx?: number;
  /** Index in new word array (for "keep" and "add") */
  newIdx?: number;
}

/**
 * LCS-based word diff. Returns tokens tagged as keep/add/remove.
 */
function diffWords(oldText: string, newText: string): DiffToken[] {
  const oldWords = oldText.split(/\s+/);
  const newWords = newText.split(/\s+/);
  const M = oldWords.length;
  const N = newWords.length;

  // Build LCS table
  const dp: number[][] = Array.from({ length: M + 1 }, () =>
    Array(N + 1).fill(0)
  );
  for (let i = 1; i <= M; i++) {
    for (let j = 1; j <= N; j++) {
      dp[i][j] =
        oldWords[i - 1] === newWords[j - 1]
          ? dp[i - 1][j - 1] + 1
          : Math.max(dp[i - 1][j], dp[i][j - 1]);
    }
  }

  // Backtrack
  let i = M;
  let j = N;
  const result: DiffToken[] = [];

  while (i > 0 || j > 0) {
    if (i > 0 && j > 0 && oldWords[i - 1] === newWords[j - 1]) {
      result.unshift({
        text: newWords[j - 1],
        type: "keep",
        oldIdx: i - 1,
        newIdx: j - 1,
      });
      i--;
      j--;
    } else if (j > 0 && (i === 0 || dp[i][j - 1] >= dp[i - 1][j])) {
      result.unshift({
        text: newWords[j - 1],
        type: "add",
        newIdx: j - 1,
      });
      j--;
    } else {
      result.unshift({
        text: oldWords[i - 1],
        type: "remove",
        oldIdx: i - 1,
      });
      i--;
    }
  }

  return result;
}

export function TextMorph({
  from,
  to,
  isActive,
  duration = 2500,
  onComplete,
}: TextMorphProps) {
  const [phase, setPhase] = useState<Phase>("before");
  const onCompleteRef = useRef(onComplete);
  onCompleteRef.current = onComplete;

  const containerRef = useRef<HTMLSpanElement>(null);
  const wordRefsOld = useRef<Map<number, HTMLSpanElement>>(new Map());
  const wordRefsNew = useRef<Map<string, HTMLSpanElement>>(new Map());

  // Stored "First" positions from the old layout
  const firstPositions = useRef<Map<number, DOMRect>>(new Map());

  const tokens = useRef<DiffToken[]>([]);
  tokens.current = diffWords(from, to);

  const oldWords = from.split(/\s+/);
  const newWords = to.split(/\s+/);

  // Transition timing
  const morphDuration = duration * 0.7; // 70% for movement
  const settleDuration = duration * 0.3; // 30% for settle + shimmer

  // Step 1: Measure "First" positions, then swap to new layout
  const startMorph = useCallback(() => {
    // Capture positions of all old words
    firstPositions.current.clear();
    wordRefsOld.current.forEach((el, idx) => {
      firstPositions.current.set(idx, el.getBoundingClientRect());
    });
    // Swap to measuring phase (renders new layout)
    setPhase("measuring");
  }, []);

  // Step 2: After new layout renders, calculate deltas and animate
  useEffect(() => {
    if (phase !== "measuring") return;

    // Use rAF to ensure layout is committed
    requestAnimationFrame(() => {
      const containerRect = containerRef.current?.getBoundingClientRect();
      if (!containerRect) return;

      // Animate each token in the new layout
      wordRefsNew.current.forEach((el, key) => {
        const token = tokens.current.find(
          (t) =>
            (t.type === "keep" && `keep-${t.oldIdx}` === key) ||
            (t.type === "add" && `add-${t.newIdx}` === key)
        );
        if (!token) return;

        const lastRect = el.getBoundingClientRect();

        if (token.type === "keep" && token.oldIdx !== undefined) {
          const firstRect = firstPositions.current.get(token.oldIdx);
          if (firstRect) {
            // FLIP: Invert + Play
            const dx = firstRect.left - lastRect.left;
            const dy = firstRect.top - lastRect.top;

            if (Math.abs(dx) > 1 || Math.abs(dy) > 1) {
              // Word needs to move — apply FLIP
              el.style.transform = `translate(${dx}px, ${dy}px)`;
              el.style.transition = "none";

              requestAnimationFrame(() => {
                el.style.transition = `transform ${morphDuration}ms cubic-bezier(0.25, 0.1, 0.25, 1), box-shadow ${morphDuration * 0.3}ms ease`;
                el.style.transform = "translate(0, 0)";
                // Brief lift effect for moving words
                el.style.boxShadow = "0 2px 8px rgba(0,0,0,0.12)";
                setTimeout(() => {
                  el.style.boxShadow = "none";
                }, morphDuration * 0.7);
              });
            }
          }
        } else if (token.type === "add") {
          // New word — fade in + scale up
          el.style.opacity = "0";
          el.style.transform = "scale(0.85)";
          el.style.transition = "none";

          // Stagger new words slightly
          const addIndex = tokens.current
            .filter((t) => t.type === "add")
            .findIndex((t) => t.newIdx === token.newIdx);
          const staggerDelay = addIndex * 60;

          requestAnimationFrame(() => {
            el.style.transition = `opacity ${morphDuration * 0.5}ms ease ${staggerDelay}ms, transform ${morphDuration * 0.5}ms cubic-bezier(0.25, 0.1, 0.25, 1) ${staggerDelay}ms`;
            el.style.opacity = "1";
            el.style.transform = "scale(1)";
          });
        }
      });

      setPhase("animating");
    });
  }, [phase, morphDuration]);

  // Step 3: After morph completes, transition to "after" (clean state)
  useEffect(() => {
    if (phase !== "animating") return;

    const timer = setTimeout(() => {
      setPhase("after");
      onCompleteRef.current?.();
    }, morphDuration + settleDuration);

    return () => clearTimeout(timer);
  }, [phase, morphDuration, settleDuration]);

  // Trigger morph when isActive changes
  useEffect(() => {
    if (!isActive) {
      setPhase("before");
      return;
    }
    startMorph();
  }, [isActive, startMorph]);

  // --- RENDER ---

  // Before: show original text
  if (phase === "before") {
    return (
      <span className="text-morph" ref={containerRef}>
        {oldWords.map((word, i) => (
          <span
            key={`old-${i}`}
            className="text-morph__word"
            ref={(el) => {
              if (el) wordRefsOld.current.set(i, el);
            }}
          >
            {word}{" "}
          </span>
        ))}
      </span>
    );
  }

  // After: show clean final text
  if (phase === "after") {
    return (
      <span className="text-morph text-morph--done" ref={containerRef}>
        {newWords.map((word, i) => (
          <span key={`final-${i}`} className="text-morph__word">
            {word}{" "}
          </span>
        ))}
      </span>
    );
  }

  // Measuring + Animating: show new layout with refs for FLIP
  // Only render keep + add tokens (removed words handled by fade-out overlay)
  const newLayoutTokens = tokens.current.filter((t) => t.type !== "remove");

  return (
    <span className="text-morph text-morph--active" ref={containerRef}>
      {newLayoutTokens.map((token) => {
        const key =
          token.type === "keep"
            ? `keep-${token.oldIdx}`
            : `add-${token.newIdx}`;

        return (
          <span
            key={key}
            className="text-morph__word"
            ref={(el) => {
              if (el) wordRefsNew.current.set(key, el);
            }}
          >
            {token.text}{" "}
          </span>
        );
      })}
    </span>
  );
}
