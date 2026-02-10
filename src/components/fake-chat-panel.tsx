/**
 * FakeChatPanel — The "movie set" AI assistant sidebar.
 *
 * Styled to match the real Inkstone chat panel with Lucide icons,
 * thread tabs, fuel credits, and action cards.
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

export function FakeChatPanel({
  state,
  researchPhase = "idle",
  onChatTypingDone,
}: FakeChatPanelProps) {
  const [act1TypingDone, setAct1TypingDone] = useState(false);
  const [act3TypingDone, setAct3TypingDone] = useState(false);

  useEffect(() => {
    if (state === "act1") setAct1TypingDone(false);
    if (state === "act3") setAct3TypingDone(false);
  }, [state]);

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
        {/* Act 1: User prompt → rewrite action */}
        {(state === "act1" || state === "act1-complete" || state === "act2" || state === "act2-complete" || state === "act3" || state === "act3-complete") && (
          <>
            <div className="fake-chat__user-msg">
              {state === "act1" && !act1TypingDone ? (
                <TypingAnimation
                  key="act1-typing"
                  text={ACT1.chatPrompt}
                  speed={ACT1.typingSpeed}
                  delay={400}
                  onComplete={() => {
                    setAct1TypingDone(true);
                    onChatTypingDone?.();
                  }}
                />
              ) : (
                ACT1.chatPrompt
              )}
            </div>

            {(act1TypingDone || state !== "act1") && (
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
            )}
          </>
        )}

        {/* Act 3: Research query → response */}
        {(state === "act3" || state === "act3-complete") && (
          <>
            <div className="fake-chat__user-msg">
              {state === "act3" && !act3TypingDone ? (
                <TypingAnimation
                  key="act3-typing"
                  text={ACT3.chatPrompt}
                  speed={ACT3.typingSpeed}
                  delay={400}
                  onComplete={() => {
                    setAct3TypingDone(true);
                    onChatTypingDone?.();
                  }}
                />
              ) : (
                ACT3.chatPrompt
              )}
            </div>

            {act3TypingDone && (
              <div className="fake-chat__action-card" data-tour-target="chat-insert-btn">
                <div className="fake-chat__action-header">
                  <span className="fake-chat__action-dot fake-chat__action-dot--blue" />
                  <span className="fake-chat__action-name">web_search</span>
                </div>
                <div className="fake-chat__action-output">
                  <ResearchChatResponse phase={researchPhase} />
                </div>
              </div>
            )}
          </>
        )}
      </div>

      {/* Input area */}
      <div className="fake-chat__input-area" data-tour-target="chat-input">
        <div className="fake-chat__input">
          Ask, check or research anything...
        </div>
        <button className="fake-chat__send-btn">
          <ArrowUp size={16} />
        </button>
      </div>
    </div>
  );
}
