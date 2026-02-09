/**
 * FakeChatPanel — The "movie set" AI assistant sidebar.
 *
 * Styled to match the real Inkstone chat panel:
 * - Thread-style cards with action names (rewrite, proofread)
 * - OUTPUT sections with code-like monospace blocks
 * - Input: "Ask, check or research anything..."
 */

import { useState, useEffect } from "react";
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
      {/* Panel header — matches real app with fuel credits */}
      <div className="fake-chat__header">
        <div className="fake-chat__header-left">
          <span className="fake-chat__fuel">⚡ 7346</span>
        </div>
        <div className="fake-chat__header-right">
          <span className="fake-chat__header-icon">⏱</span>
          <span className="fake-chat__header-icon">⟫</span>
        </div>
      </div>

      {/* Thread area */}
      <div className="fake-chat__messages">
        {/* Act 1: User prompt → rewrite action card */}
        {(state === "act1" || state === "act1-complete" || state === "act2" || state === "act2-complete" || state === "act3" || state === "act3-complete") && (
          <>
            <div className="fake-chat__user-msg">
              {state === "act1" && !act1TypingDone ? (
                <TypingAnimation
                  text={ACT1.chatPrompt}
                  speed={ACT1.typingSpeed}
                  onComplete={() => {
                    setAct1TypingDone(true);
                    onChatTypingDone?.();
                  }}
                />
              ) : (
                ACT1.chatPrompt
              )}
            </div>

            {/* Show rewrite action card after typing completes */}
            {(act1TypingDone || state !== "act1") && (
              <div className="fake-chat__action-card">
                <div className="fake-chat__action-header">
                  <span className="fake-chat__action-dot" />
                  <span className="fake-chat__action-name">rewrite</span>
                  <span className="fake-chat__action-nav">‹ 2 ›</span>
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
                  text={ACT3.chatPrompt}
                  speed={ACT3.typingSpeed}
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
              <div className="fake-chat__action-card">
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
      <div className="fake-chat__input-area">
        <div className="fake-chat__input" aria-label="Chat input">
          Ask, check or research anything...
        </div>
        <div className="fake-chat__send-btn">↑</div>
      </div>
    </div>
  );
}
