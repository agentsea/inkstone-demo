/**
 * Walkthrough — Main orchestrator for the 3-act guided interactive demo.
 *
 * Two modes:
 * - "guided" (default): Step-by-step tooltips, user clicks to advance
 * - "auto" (?mode=auto): Auto-play for embeds/repeat visits
 *
 * Integrates: FakeSidebar + FakeEditor + FakeChatPanel + TourTooltip
 */

import { useState, useCallback, useEffect } from "react";
import { StepIndicator, type Act } from "./step-indicator";
import { FakeSidebar } from "./fake-sidebar";
import { FakeEditor } from "./fake-editor";
import { FakeChatPanel } from "./fake-chat-panel";
import { BottomBar } from "./bottom-bar";
import { TourTooltip } from "./tour-tooltip";
import { useResearchPhase } from "./research-insert";
import type { Theme } from "./theme-listener";
import { TIMING, TOUR_STEPS } from "../data/walkthrough-script";
import "./walkthrough.css";

export type WalkthroughState =
  | "idle"
  | "act1"
  | "act1-complete"
  | "act2"
  | "act2-complete"
  | "act3"
  | "act3-complete";

type Mode = "guided" | "auto";

interface WalkthroughProps {
  theme: Theme;
  onToggleTheme: () => void;
}

function getMode(): Mode {
  const params = new URLSearchParams(window.location.search);
  return params.get("mode") === "auto" ? "auto" : "guided";
}

export function Walkthrough({ theme, onToggleTheme }: WalkthroughProps) {
  const mode = getMode();
  const [state, setState] = useState<WalkthroughState>("idle");
  const [chatTypingDone, setChatTypingDone] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [tourStep, setTourStep] = useState(0);
  const [tourActive, setTourActive] = useState(mode === "guided");

  const currentStep = TOUR_STEPS[tourStep];

  // Research phase
  const researchPhase = useResearchPhase(
    (state === "act3" && chatTypingDone) || state === "act3-complete",
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
      case "rewrite": setState("act1"); break;
      case "proofread": setState("act2"); break;
      case "research": setState("act3"); break;
    }
  }, []);

  const handleActComplete = useCallback((act: Act) => {
    switch (act) {
      case "rewrite": setState("act1-complete"); break;
      case "proofread": setState("act2-complete"); break;
      case "research": setState("act3-complete"); break;
    }
  }, []);

  // --- GUIDED TOUR: advance to next step ---
  const advanceTour = useCallback(() => {
    if (!tourActive) return;
    const nextIdx = tourStep + 1;
    if (nextIdx >= TOUR_STEPS.length) {
      setTourActive(false);
      return;
    }

    const nextStep = TOUR_STEPS[nextIdx];

    // Handle sidebar opening
    if (nextStep && "opensSidebar" in nextStep && nextStep.opensSidebar) {
      setSidebarOpen(true);
    }

    // Handle act triggers
    if (nextStep && "triggersAct" in nextStep) {
      setChatTypingDone(false);
      switch (nextStep.triggersAct) {
        case "act1": setState("act1"); break;
        case "act2": setState("act2"); break;
        case "act3": setState("act3"); break;
      }
    }

    setTourStep(nextIdx);
  }, [tourStep, tourActive]);

  // --- AUTO MODE: advance between acts ---
  useEffect(() => {
    if (mode !== "auto") return;
    if (state === "act1-complete") {
      const t = setTimeout(() => { setChatTypingDone(false); setState("act2"); }, TIMING.interActDelay);
      return () => clearTimeout(t);
    }
    if (state === "act2-complete") {
      const t = setTimeout(() => { setChatTypingDone(false); setState("act3"); }, TIMING.interActDelay);
      return () => clearTimeout(t);
    }
  }, [state, mode]);

  // --- AUTO MODE: auto-start ---
  useEffect(() => {
    if (mode === "auto" && state === "idle") {
      const t = setTimeout(() => setState("act1"), 500);
      return () => clearTimeout(t);
    }
  }, [mode, state]);

  // --- GUIDED: auto-advance on act completion ---
  useEffect(() => {
    if (!tourActive) return;

    const step = TOUR_STEPS[tourStep];
    if (!step || !("autoAdvance" in step) || !step.autoAdvance) return;

    // Watch for act completions to auto-advance
    if (step.id === "watch-morph" && state === "act1-complete") {
      const t = setTimeout(advanceTour, 600);
      return () => clearTimeout(t);
    }
    if (step.id === "scanning" && (state === "act2" || state === "act2-complete")) {
      // Wait for diffs to show, then advance
    }
    if (step.id === "searching" && researchPhase === "response-visible") {
      const t = setTimeout(advanceTour, 400);
      return () => clearTimeout(t);
    }
  }, [tourActive, tourStep, state, researchPhase, advanceTour]);

  // --- GUIDED: advance after diff scanning completes ---
  useEffect(() => {
    if (!tourActive) return;
    const step = TOUR_STEPS[tourStep];
    if (step?.id === "scanning" && state === "act2") {
      // The diff animation has its own internal scanning delay
      // Advance after it shows diffs (scanningDelay + small buffer)
      const t = setTimeout(advanceTour, 1600);
      return () => clearTimeout(t);
    }
  }, [tourActive, tourStep, state, advanceTour]);

  const handleChatTypingDone = useCallback(() => {
    setChatTypingDone(true);
  }, []);

  const handleReplay = useCallback(() => {
    setChatTypingDone(false);
    setSidebarOpen(false);
    setState("idle");
    setTourStep(0);
    setTourActive(true);
  }, []);

  const handleTourCtaClick = useCallback(() => {
    const step = TOUR_STEPS[tourStep];

    // Special handling for steps that trigger actions
    if (step && "triggersAct" in step) {
      // The act is already triggered in advanceTour, just advance
      advanceTour();
      return;
    }

    // For "Accept All" step, trigger diff resolution then advance
    if (step?.id === "see-diffs") {
      // The diff animation handles its own Accept All timing
      advanceTour();
      return;
    }

    // For sidebar reveal
    if (step && "opensSidebar" in step) {
      advanceTour();
      return;
    }

    advanceTour();
  }, [tourStep, advanceTour]);

  return (
    <div className="walkthrough" data-theme={theme}>
      <StepIndicator
        currentAct={currentAct}
        completedActs={getCompletedActs(state)}
        onActSelect={handleActSelect}
      />
      <div className="walkthrough__content">
        <FakeSidebar
          isOpen={sidebarOpen}
          onToggle={() => setSidebarOpen(!sidebarOpen)}
        />
        <div className="walkthrough__resizer" />
        <div className="walkthrough__editor">
          <FakeEditor
            state={state}
            researchPhase={researchPhase}
            onActComplete={handleActComplete}
          />
        </div>
        <div className="walkthrough__resizer" />
        <div className="walkthrough__chat">
          <FakeChatPanel
            state={state}
            researchPhase={researchPhase}
            onActComplete={handleActComplete}
            onChatTypingDone={handleChatTypingDone}
          />
        </div>
      </div>

      <BottomBar theme={theme} onToggleTheme={onToggleTheme} />

      {/* Guided tour tooltip */}
      {tourActive && currentStep && (
        <TourTooltip
          text={currentStep.text}
          cta={"cta" in currentStep ? currentStep.cta : undefined}
          ctaLink={"ctaLink" in currentStep ? currentStep.ctaLink : undefined}
          showReplay={"showReplay" in currentStep ? currentStep.showReplay : undefined}
          target={currentStep.target}
          position={currentStep.position}
          visible={true}
          onCtaClick={handleTourCtaClick}
          onReplay={handleReplay}
        />
      )}

      {/* Auto mode replay */}
      {mode === "auto" && state === "act3-complete" && (
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
