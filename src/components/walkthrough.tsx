/**
 * Walkthrough — Main orchestrator for the 3-act interactive demo.
 *
 * States: idle → act1 → act1-complete → act2 → act2-complete → act3 → act3-complete
 *
 * This is the "movie set" — all content is scripted, all animations are canned.
 * No TipTap, no ProseMirror, no real editor. Just styled divs and Framer Motion.
 */

import { useState, useCallback, useEffect } from "react";
import { StepIndicator, type Act } from "./step-indicator";
import { FakeEditor } from "./fake-editor";
import { FakeChatPanel } from "./fake-chat-panel";
import { useResearchPhase } from "./research-insert";
import type { Theme } from "./theme-listener";
import { TIMING } from "../data/walkthrough-script";
import "./walkthrough.css";

export type WalkthroughState =
  | "idle"
  | "act1"
  | "act1-complete"
  | "act2"
  | "act2-complete"
  | "act3"
  | "act3-complete";

interface WalkthroughProps {
  theme: Theme;
}

export function Walkthrough({ theme }: WalkthroughProps) {
  const [state, setState] = useState<WalkthroughState>("idle");
  const [chatTypingDone, setChatTypingDone] = useState(false);

  // Research phase drives both chat response and doc insert
  const researchPhase = useResearchPhase(
    state === "act3" && chatTypingDone,
    () => handleActComplete("research")
  );

  const currentAct: Act =
    state === "act2" || state === "act2-complete"
      ? "proofread"
      : state === "act3" || state === "act3-complete"
        ? "research"
        : "rewrite";

  const handleActSelect = useCallback((act: Act) => {
    setChatTypingDone(false);
    switch (act) {
      case "rewrite":
        setState("act1");
        break;
      case "proofread":
        setState("act2");
        break;
      case "research":
        setState("act3");
        break;
    }
  }, []);

  const handleActComplete = useCallback((act: Act) => {
    switch (act) {
      case "rewrite":
        setState("act1-complete");
        break;
      case "proofread":
        setState("act2-complete");
        break;
      case "research":
        setState("act3-complete");
        break;
    }
  }, []);

  // Auto-advance between acts
  useEffect(() => {
    if (state === "act1-complete") {
      const timer = setTimeout(() => {
        setChatTypingDone(false);
        setState("act2");
      }, TIMING.interActDelay);
      return () => clearTimeout(timer);
    }
    if (state === "act2-complete") {
      const timer = setTimeout(() => {
        setChatTypingDone(false);
        setState("act3");
      }, TIMING.interActDelay);
      return () => clearTimeout(timer);
    }
  }, [state]);

  const handleReplay = useCallback(() => {
    setChatTypingDone(false);
    setState("idle");
    setTimeout(() => setState("act1"), 300);
  }, []);

  // Auto-start on first render
  useEffect(() => {
    if (state === "idle") {
      const timer = setTimeout(() => setState("act1"), 500);
      return () => clearTimeout(timer);
    }
  }, []);

  const handleChatTypingDone = useCallback(() => {
    setChatTypingDone(true);
  }, []);

  return (
    <div className="walkthrough" data-theme={theme}>
      <StepIndicator
        currentAct={currentAct}
        completedActs={getCompletedActs(state)}
        onActSelect={handleActSelect}
      />
      <div className="walkthrough__content">
        <div className="walkthrough__editor">
          <FakeEditor
            state={state}
            researchPhase={researchPhase}
            onActComplete={handleActComplete}
          />
        </div>
        <div className="walkthrough__chat">
          <FakeChatPanel
            state={state}
            researchPhase={researchPhase}
            onActComplete={handleActComplete}
            onChatTypingDone={handleChatTypingDone}
          />
        </div>
      </div>
      {state === "act3-complete" && (
        <button className="walkthrough__replay" onClick={handleReplay}>
          Replay demo
        </button>
      )}
    </div>
  );
}

function getCompletedActs(state: WalkthroughState): Act[] {
  switch (state) {
    case "act1-complete":
    case "act2":
      return ["rewrite"];
    case "act2-complete":
    case "act3":
      return ["rewrite", "proofread"];
    case "act3-complete":
      return ["rewrite", "proofread", "research"];
    default:
      return [];
  }
}
