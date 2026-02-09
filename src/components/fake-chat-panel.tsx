/**
 * FakeChatPanel — The "movie set" AI assistant sidebar.
 *
 * Looks exactly like Inkstone's chat panel. Just styled divs.
 * Messages animate in with the TypingAnimation component.
 * Act 3 shows the research response with citations.
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

  // Reset typing states when state changes
  useEffect(() => {
    if (state === "act1") {
      setAct1TypingDone(false);
    }
    if (state === "act3") {
      setAct3TypingDone(false);
    }
  }, [state]);

  return (
    <div className="fake-chat">
      {/* Panel header */}
      <div className="fake-chat__header">
        <span className="fake-chat__title">AI Assistant</span>
        <span className="fake-chat__status">Online</span>
      </div>

      {/* Messages area */}
      <div className="fake-chat__messages">
        {/* Act 1: User types rewrite prompt */}
        {(state === "act1" || state === "act1-complete" || state === "act2" || state === "act2-complete" || state === "act3" || state === "act3-complete") && (
          <div className="fake-chat__message fake-chat__message--user">
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
        )}

        {/* Act 3: User types research query */}
        {(state === "act3" || state === "act3-complete") && (
          <div className="fake-chat__message fake-chat__message--user">
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
        )}

        {/* Act 3: AI research response */}
        {(state === "act3" || state === "act3-complete") && act3TypingDone && (
          <div className="fake-chat__message fake-chat__message--ai">
            <ResearchChatResponse phase={researchPhase} />
          </div>
        )}
      </div>

      {/* Input area (decorative) */}
      <div className="fake-chat__input-area">
        <div className="fake-chat__input" aria-label="Chat input">
          Ask anything...
        </div>
      </div>
    </div>
  );
}
