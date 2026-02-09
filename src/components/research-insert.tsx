/**
 * ResearchInsert — Act 3: Chat search → synthesized answer → Insert to Doc.
 *
 * Exposes a custom hook (useResearchPhase) that drives both the chat-side
 * response component and the editor-side document insert component.
 */

import { useState, useEffect, useRef } from "react";
import { m, AnimatePresence } from "motion/react";
import { ACT3 } from "../data/walkthrough-script";

export type ResearchPhase =
  | "idle"
  | "loading"
  | "response-visible"
  | "inserting"
  | "inserted";

/** Hook that drives the research phase state machine */
export function useResearchPhase(
  isActive: boolean,
  onComplete?: () => void
): ResearchPhase {
  const [phase, setPhase] = useState<ResearchPhase>("idle");
  const onCompleteRef = useRef(onComplete);
  onCompleteRef.current = onComplete;

  useEffect(() => {
    if (!isActive) {
      setPhase("idle");
      return;
    }

    // If already inserted, don't restart the sequence
    if (phase === "inserted") return;

    setPhase("loading");
    const timers: ReturnType<typeof setTimeout>[] = [];

    // Show loading shimmer, then response
    timers.push(
      setTimeout(() => {
        setPhase("response-visible");

        // Auto-click "Insert to Doc"
        timers.push(
          setTimeout(() => {
            setPhase("inserting");

            timers.push(
              setTimeout(() => {
                setPhase("inserted");
                onCompleteRef.current?.();
              }, ACT3.insertAnimationDuration)
            );
          }, ACT3.insertToDocDelay)
        );
      }, ACT3.loadingShimmerDuration)
    );

    return () => timers.forEach(clearTimeout);
  }, [isActive]);

  return phase;
}

/** Chat-side component: loading shimmer → response with citations → Insert button */
export function ResearchChatResponse({
  phase,
}: {
  phase: ResearchPhase;
}) {
  if (phase === "idle") return null;

  if (phase === "loading") {
    return (
      <div className="research-loading">
        <m.div
          className="research-shimmer"
          animate={{ opacity: [0.3, 0.7, 0.3] }}
          transition={{ duration: 1.2, repeat: Infinity }}
        >
          <div className="research-shimmer__line research-shimmer__line--long" />
          <div className="research-shimmer__line research-shimmer__line--medium" />
          <div className="research-shimmer__line research-shimmer__line--short" />
        </m.div>
      </div>
    );
  }

  return (
    <m.div
      className="research-response"
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
    >
      <div className="research-response__text">{ACT3.researchResponse}</div>
      <div className="research-response__citations">
        {ACT3.citations.map((c) => (
          <span key={c.id} className="research-citation">
            [{c.id}] {c.title}
          </span>
        ))}
      </div>
      <AnimatePresence>
        {phase === "response-visible" && (
          <m.button
            className="research-insert-btn"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            transition={{ duration: 0.3 }}
          >
            Insert to Doc
          </m.button>
        )}
      </AnimatePresence>
    </m.div>
  );
}

/** Editor-side component: research content that animates into the document */
export function ResearchDocInsert({
  phase,
}: {
  phase: ResearchPhase;
}) {
  if (phase !== "inserting" && phase !== "inserted") return null;

  return (
    <m.div
      className="research-doc-insert"
      initial={{ opacity: 0, y: -20, height: 0 }}
      animate={{ opacity: 1, y: 0, height: "auto" }}
      transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
    >
      <div className="research-doc-insert__divider" />
      <p className="research-doc-insert__text">{ACT3.researchResponse}</p>
      <div className="research-doc-insert__citations">
        {ACT3.citations.map((c) => (
          <span key={c.id} className="research-doc-citation">
            [{c.id}] {c.title}
          </span>
        ))}
      </div>
    </m.div>
  );
}
