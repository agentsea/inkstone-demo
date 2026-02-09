/**
 * TextMorph — Word-level morphing animation for Act 1.
 *
 * Diffs old and new text at the word level. Words that stay slide to
 * their new position. Words removed fade out. Words added fade in.
 * This is the "wow moment" — the entire rough paragraph reshapes
 * into polished prose before the visitor's eyes.
 *
 * Uses Framer Motion's layout animations for smooth repositioning.
 */

import { useState, useEffect, useRef, useMemo } from "react";
import { m } from "motion/react";

interface TextMorphProps {
  from: string;
  to: string;
  isActive: boolean;
  duration?: number; // total morph duration in ms
  onComplete?: () => void;
}

interface WordToken {
  id: string;
  text: string;
  isNew?: boolean;
  isRemoved?: boolean;
}

/**
 * Simple word-level diff: finds common subsequence and marks
 * additions/removals. Good enough for our scripted content.
 */
function diffWords(oldText: string, newText: string): WordToken[] {
  const oldWords = oldText.split(/\s+/);
  const newWords = newText.split(/\s+/);

  // Build LCS table
  const m = oldWords.length;
  const n = newWords.length;
  const dp: number[][] = Array.from({ length: m + 1 }, () =>
    Array(n + 1).fill(0)
  );

  for (let i = 1; i <= m; i++) {
    for (let j = 1; j <= n; j++) {
      if (oldWords[i - 1] === newWords[j - 1]) {
        dp[i][j] = dp[i - 1][j - 1] + 1;
      } else {
        dp[i][j] = Math.max(dp[i - 1][j], dp[i][j - 1]);
      }
    }
  }

  // Backtrack to get the diff
  let i = m,
    j = n;

  const result: WordToken[] = [];

  while (i > 0 || j > 0) {
    if (i > 0 && j > 0 && oldWords[i - 1] === newWords[j - 1]) {
      result.unshift({
        id: `keep-${j}-${newWords[j - 1]}`,
        text: newWords[j - 1],
      });
      i--;
      j--;
    } else if (j > 0 && (i === 0 || dp[i][j - 1] >= dp[i - 1][j])) {
      result.unshift({
        id: `add-${j}-${newWords[j - 1]}`,
        text: newWords[j - 1],
        isNew: true,
      });
      j--;
    } else {
      result.unshift({
        id: `rm-${i}-${oldWords[i - 1]}`,
        text: oldWords[i - 1],
        isRemoved: true,
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
  const [phase, setPhase] = useState<"before" | "morphing" | "after">(
    "before"
  );
  const onCompleteRef = useRef(onComplete);
  onCompleteRef.current = onComplete;

  const tokens = useMemo(() => diffWords(from, to), [from, to]);

  useEffect(() => {
    if (!isActive) {
      setPhase("before");
      return;
    }

    setPhase("morphing");

    const timer = setTimeout(() => {
      setPhase("after");
      onCompleteRef.current?.();
    }, duration);

    return () => clearTimeout(timer);
  }, [isActive, duration]);

  if (phase === "before") {
    return (
      <span className="text-morph">
        {from.split(/\s+/).map((word, i) => (
          <span key={`before-${i}`} className="text-morph__word">
            {word}{" "}
          </span>
        ))}
      </span>
    );
  }

  if (phase === "after") {
    return (
      <span className="text-morph">
        {to.split(/\s+/).map((word, i) => (
          <span key={`after-${i}`} className="text-morph__word">
            {word}{" "}
          </span>
        ))}
      </span>
    );
  }

  // Morphing phase — animated
  const staggerDelay = duration / (tokens.length * 3);

  return (
    <span className="text-morph text-morph--active">
      {tokens
        .filter((t) => !t.isRemoved)
        .map((token, index) => (
          <m.span
            key={token.id}
            className={`text-morph__word ${token.isNew ? "text-morph__word--new" : ""}`}
            initial={
              token.isNew
                ? { opacity: 0, scale: 0.8 }
                : { opacity: 1, scale: 1 }
            }
            animate={{
              opacity: 1,
              scale: 1,
            }}
            transition={{
              opacity: {
                duration: 0.4,
                delay: index * staggerDelay * 0.001,
              },
              scale: {
                duration: 0.3,
                delay: index * staggerDelay * 0.001,
              },
            }}
          >
            {token.text}{" "}
          </m.span>
        ))}
    </span>
  );
}
