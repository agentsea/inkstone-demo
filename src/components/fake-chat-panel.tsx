/**
 * FakeChatPanel — The "movie set" AI assistant sidebar.
 *
 * Typing happens in the INPUT BOX at the bottom (like a real user typing),
 * then the message "sends" and appears as a blue bubble at the top.
 */

import { useState, useEffect } from "react";
import { Zap, SquarePen, ChevronsRight, ArrowUp } from "lucide-react";
import type { WalkthroughState } from "./walkthrough";
import type { Act } from "./step-indicator";
import type { ResearchPhase } from "./research-insert";
import { TypingAnimation } from "./typing-animation";
import { ResearchChatResponse } from "./research-insert";
import { ACT1, ACT3 } from "../data/walkthrough-script";
import "./fake-chat-panel.css";
import "./animations.css";

interface FakeChatPanelProps {
  state: WalkthroughState;
  researchPhase?: ResearchPhase;
  onActComplete: (act: Act) => void;
  onChatTypingDone?: () => void;
}

type InputPhase = "idle" | "typing" | "sent";

export function FakeChatPanel({
  state,
  researchPhase = "idle",
  onChatTypingDone,
}: FakeChatPanelProps) {
  const [act1InputPhase, setAct1InputPhase] = useState<InputPhase>("idle");
  const [act3InputPhase, setAct3InputPhase] = useState<InputPhase>("idle");

  // Start typing in input when act begins
  useEffect(() => {
    if (state === "act1") {
      setAct1InputPhase("typing");
    }
  }, [state]);

  useEffect(() => {
    if (state === "act3") {
      setAct3InputPhase("typing");
    }
  }, [state]);

  // Reset on replay
  useEffect(() => {
    if (state === "idle") {
      setAct1InputPhase("idle");
      setAct3InputPhase("idle");
    }
  }, [state]);

  const handleAct1TypeDone = () => {
    // "Send" the message — move from input to bubble
    setAct1InputPhase("sent");
    onChatTypingDone?.();
  };

  const handleAct3TypeDone = () => {
    setAct3InputPhase("sent");
    onChatTypingDone?.();
  };

  // What text is currently being typed in the input box?
  const inputTypingText =
    state === "act1" && act1InputPhase === "typing" ? ACT1.chatPrompt :
    state === "act3" && act3InputPhase === "typing" ? ACT3.chatPrompt :
    null;

  // Should we show messages in the thread?
  const showAct1Message = act1InputPhase === "sent" || (state !== "act1" && state !== "idle");
  const showAct3Message = act3InputPhase === "sent" || state === "act3-complete";

  return (
    <div className="fake-chat">
      {/* Header — fuel credits + actions */}
      <div className="fake-chat__header">
        <div className="fake-chat__header-left">
          <button className="fake-chat__fuel-btn">
            <Zap size={14} className="fake-chat__fuel-icon" />
            <span>7,346</span>
          </button>
        </div>
        <div className="fake-chat__header-right">
          <button className="fake-chat__header-icon-btn" title="New thread">
            <SquarePen size={14} />
          </button>
          <button className="fake-chat__header-icon-btn" title="Collapse">
            <ChevronsRight size={14} />
          </button>
        </div>
      </div>

      {/* Thread tabs */}
      <div className="fake-chat__tabs">
        <button className="fake-chat__tab fake-chat__tab--active">
          <span className="fake-chat__tab-dot" />
          Thread 1
        </button>
      </div>

      {/* Messages area */}
      <div className="fake-chat__messages" data-tour-target="chat-messages">
        {/* Act 1: User message (shown after "sent") */}
        {showAct1Message && (
          <>
            <div className="fake-chat__user-msg">
              {ACT1.chatPrompt}
            </div>
            <div className="fake-chat__action-card">
              <div className="fake-chat__action-header">
                <span className="fake-chat__action-dot" />
                <span className="fake-chat__action-name">rewrite</span>
              </div>
              <div className="fake-chat__action-output">
                <span className="fake-chat__output-label">OUTPUT</span>
                <div className="fake-chat__output-content">
                  Rewrote 1 block(s).
                </div>
              </div>
            </div>
          </>
        )}

        {/* Act 3: User message + research response */}
        {(state === "act3" || state === "act3-complete") && showAct3Message && (
          <>
            <div className="fake-chat__user-msg">
              {ACT3.chatPrompt}
            </div>
            <div className="fake-chat__action-card" data-tour-target="chat-insert-btn">
              <div className="fake-chat__action-header">
                <span className="fake-chat__action-dot fake-chat__action-dot--blue" />
                <span className="fake-chat__action-name">web_search</span>
              </div>
              <div className="fake-chat__action-output">
                <ResearchChatResponse phase={researchPhase} />
              </div>
            </div>
          </>
        )}
      </div>

      {/* Input area — shows typing animation when active */}
      <div className="fake-chat__input-area" data-tour-target="chat-input">
        <div className={`fake-chat__input ${inputTypingText ? "fake-chat__input--active" : ""}`}>
          {inputTypingText ? (
            <TypingAnimation
              key={`input-${state}`}
              text={inputTypingText}
              speed={state === "act1" ? ACT1.typingSpeed : ACT3.typingSpeed}
              delay={400}
              onComplete={state === "act1" ? handleAct1TypeDone : handleAct3TypeDone}
            />
          ) : (
            <span className="fake-chat__input-placeholder">Ask, check or research anything...</span>
          )}
        </div>
        <button className="fake-chat__send-btn">
          <ArrowUp size={16} />
        </button>
      </div>
    </div>
  );
}
