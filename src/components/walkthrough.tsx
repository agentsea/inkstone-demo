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
import { ProofreadingBar } from "./proofreading-bar";
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

/** State snapshot exposed to external consumers (e.g. mobile camera) */
export interface WalkthroughSnapshot {
  state: WalkthroughState;
  chatTypingDone: boolean;
  diffsVisible: boolean;
  sidebarOpen: boolean;
  tourStep: number;
  researchPhase: string;
}

interface WalkthroughProps {
  theme: Theme;
  onToggleTheme: () => void;
  /** Override the mode (instead of reading from URL param) */
  modeOverride?: Mode;
  /** Force the desktop layout even on narrow viewports (for mobile camera) */
  forceDesktopLayout?: boolean;
  /** Called whenever internal state changes — used by mobile camera */
  onSnapshot?: (snapshot: WalkthroughSnapshot) => void;
}

function getMode(override?: Mode): Mode {
  if (override) return override;
  const params = new URLSearchParams(window.location.search);
  return params.get("mode") === "auto" ? "auto" : "guided";
}

export function Walkthrough({ theme, onToggleTheme, modeOverride, forceDesktopLayout, onSnapshot }: WalkthroughProps) {
  const mode = getMode(modeOverride);
  const [state, setState] = useState<WalkthroughState>("idle");
  const [chatTypingDone, setChatTypingDone] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [tourStep, setTourStep] = useState(0);
  const [tourActive, setTourActive] = useState(mode === "guided");
  const [diffsVisible, setDiffsVisible] = useState(false);
  const [acceptAllTriggered, setAcceptAllTriggered] = useState(false);
  const [showProofBar, setShowProofBar] = useState(false);
  const [showRewriteDiffs, setShowRewriteDiffs] = useState(false);
  const [insertTriggered, setInsertTriggered] = useState(false);

  const currentStep = TOUR_STEPS[tourStep];

  // Research phase — waits for user click in guided mode
  const researchPhase = useResearchPhase(
    (state === "act3" && chatTypingDone) || state === "act3-complete",
    () => handleActComplete("research"),
    mode === "guided", // waitForInsert
    insertTriggered, // triggerInsert
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

    // First, execute the CURRENT step's trigger (if any)
    const currentStepDef = TOUR_STEPS[tourStep];
    if (currentStepDef && "triggersAct" in currentStepDef) {
      setChatTypingDone(false);
      switch (currentStepDef.triggersAct) {
        case "act1": setState("act1"); break;
        case "act2": setState("act2"); break;
        case "act3": setState("act3"); break;
      }
    }

    // Then move to next step
    const nextIdx = tourStep + 1;
    if (nextIdx >= TOUR_STEPS.length) {
      setTourActive(false);
      return;
    }

    const nextStep = TOUR_STEPS[nextIdx];

    // Handle sidebar opening on the NEXT step
    if (nextStep && "opensSidebar" in nextStep && nextStep.opensSidebar) {
      setSidebarOpen(true);
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

    // Typing done → advance from hidden typing step to watch-morph
    if (step.id === "typing-in-progress" && chatTypingDone) {
      const t = setTimeout(advanceTour, 300);
      return () => clearTimeout(t);
    }
    // Watch for act completions to auto-advance
    if (step.id === "watch-morph" && state === "act1-complete") {
      const t = setTimeout(advanceTour, 600);
      return () => clearTimeout(t);
    }
    if (step.id === "searching" && researchPhase === "response-visible") {
      const t = setTimeout(advanceTour, 400);
      return () => clearTimeout(t);
    }
  }, [tourActive, tourStep, state, chatTypingDone, researchPhase, advanceTour]);

  // --- GUIDED: advance from scanning when diffs are visible ---
  useEffect(() => {
    if (!tourActive) return;
    const step = TOUR_STEPS[tourStep];
    if (step?.id === "scanning" && diffsVisible) {
      const t = setTimeout(advanceTour, 400);
      return () => clearTimeout(t);
    }
  }, [tourActive, tourStep, diffsVisible, advanceTour]);

  const handleChatTypingDone = useCallback(() => {
    setChatTypingDone(true);
  }, []);

  // Diff callbacks
  const handleDiffsVisible = useCallback(() => {
    setDiffsVisible(true);
    setShowProofBar(true);
  }, []);

  const handleAcceptAll = useCallback(() => {
    setAcceptAllTriggered(true);
    setShowProofBar(false);
  }, []);

  // Show rewrite diffs + proofreading bar when rewrite completes (Step 4)
  useEffect(() => {
    if (tourActive && state === "act1-complete") {
      const step = TOUR_STEPS[tourStep];
      if (step?.id === "rewrite-done") {
        setShowRewriteDiffs(true);
        setShowProofBar(true);
      }
    }
  }, [tourActive, tourStep, state]);

  // Reset diff state based on current act
  useEffect(() => {
    const s = state as string;
    if (s === "act2") {
      setShowRewriteDiffs(false);
    }
    if (s !== "act2" && s !== "act1-complete") {
      setDiffsVisible(false);
      setAcceptAllTriggered(false);
    }
    if (s !== "act2" && s !== "act1-complete") {
      setShowProofBar(false);
    }
  }, [state]);

  // --- SNAPSHOT: expose state to external consumers (mobile camera) ---
  useEffect(() => {
    onSnapshot?.({
      state,
      chatTypingDone,
      diffsVisible,
      sidebarOpen,
      tourStep,
      researchPhase,
    });
  }, [state, chatTypingDone, diffsVisible, sidebarOpen, tourStep, researchPhase, onSnapshot]);

  const handleReplay = useCallback(() => {
    setChatTypingDone(false);
    setSidebarOpen(false);
    setDiffsVisible(false);
    setAcceptAllTriggered(false);
    setShowProofBar(false);
    setShowRewriteDiffs(false);
    setInsertTriggered(false);
    setState("idle");
    setTourStep(0);
    setTourActive(true);
  }, []);

  const handleTourCtaClick = useCallback(() => {
    const step = TOUR_STEPS[tourStep];

    // Step 4 "rewrite-done": dismiss rewrite diffs and bar
    if (step?.id === "rewrite-done") {
      setShowRewriteDiffs(false);
      setShowProofBar(false);
    }

    // Step 7 "see-diffs": trigger acceptance
    if (step?.id === "see-diffs") {
      handleAcceptAll();
    }

    // Step 10 "insert-to-doc": trigger the insert
    if (step?.id === "insert-to-doc") {
      setInsertTriggered(true);
    }

    advanceTour();
  }, [tourStep, advanceTour, handleAcceptAll]);

  return (
    <div className={`walkthrough${forceDesktopLayout ? " walkthrough--desktop-forced" : ""}`} data-theme={theme}>
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
        <div className="walkthrough__editor" style={{ position: "relative" }}>
          <FakeEditor
            state={state}
            researchPhase={researchPhase}
            onActComplete={handleActComplete}
            theme={theme}
            onToggleTheme={onToggleTheme}
            waitForAccept={mode === "guided"}
            acceptAll={acceptAllTriggered}
            onDiffsVisible={handleDiffsVisible}
            showRewriteDiffs={showRewriteDiffs}
            chatTypingDone={chatTypingDone}
          />
          {/* Proofreading bar — inside editor div for centering */}
          <ProofreadingBar
            visible={showProofBar}
            currentIndex={0}
            onAcceptAll={() => {
              handleAcceptAll();
              if (tourActive) {
                const step = TOUR_STEPS[tourStep];
                if (step?.id === "rewrite-done" || step?.id === "see-diffs") {
                  setShowRewriteDiffs(false);
                  advanceTour();
                }
              }
            }}
            onClose={() => setShowProofBar(false)}
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

      {/* Guided tour tooltip */}
      {tourActive && currentStep && !("hidden" in currentStep && currentStep.hidden) && (
        <TourTooltip
          text={currentStep.text}
          cta={"cta" in currentStep ? currentStep.cta : undefined}
          ctaLink={"ctaLink" in currentStep ? currentStep.ctaLink : undefined}
          showReplay={"showReplay" in currentStep ? currentStep.showReplay : undefined}
          target={currentStep.target}
          position={currentStep.position}
          visible={true}
          cardStyle={"style" in currentStep && currentStep.style === "yellow" ? "yellow" : "default"}
          noOverlay={
            currentStep.id === "watch-morph" ||
            currentStep.id === "scanning" ||
            currentStep.id === "see-diffs" ||
            currentStep.id === "searching" ||
            currentStep.id === "insert-to-doc" ||
            currentStep.id === "sidebar-reveal" ||
            currentStep.id === "rewrite-done"
          }
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
