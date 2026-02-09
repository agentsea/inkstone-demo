/**
 * FakeChatPanel — The "movie set" AI assistant sidebar.
 *
 * Looks exactly like Inkstone's chat panel. Just styled divs.
 * Messages are hardcoded. No WebSocket. No API calls.
 */

import type { WalkthroughState } from "./walkthrough";
import type { Act } from "./step-indicator";
import "./fake-chat-panel.css";

interface FakeChatPanelProps {
  state: WalkthroughState;
  onActComplete: (act: Act) => void;
}

export function FakeChatPanel({ state }: FakeChatPanelProps) {
  return (
    <div className="fake-chat">
      {/* Panel header */}
      <div className="fake-chat__header">
        <span className="fake-chat__title">AI Assistant</span>
        <span className="fake-chat__status">Online</span>
      </div>

      {/* Messages area */}
      <div className="fake-chat__messages">
        {getChatMessages(state).map((msg, i) => (
          <div
            key={i}
            className={`fake-chat__message fake-chat__message--${msg.role}`}
          >
            {msg.text}
          </div>
        ))}
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

interface ChatMessage {
  role: "user" | "ai";
  text: string;
}

/** Placeholder — will be replaced with typing animations */
function getChatMessages(state: WalkthroughState): ChatMessage[] {
  switch (state) {
    case "idle":
      return [];
    case "act1":
    case "act1-complete":
      return [
        { role: "user", text: "Rewrite this to be compelling and well-researched" },
      ];
    case "act2":
    case "act2-complete":
      return [
        { role: "user", text: "Rewrite this to be compelling and well-researched" },
      ];
    case "act3":
      return [
        { role: "user", text: "Rewrite this to be compelling and well-researched" },
        { role: "user", text: "What are the environmental impacts of coffee farming?" },
      ];
    case "act3-complete":
      return [
        { role: "user", text: "Rewrite this to be compelling and well-researched" },
        { role: "user", text: "What are the environmental impacts of coffee farming?" },
        {
          role: "ai",
          text: "Coffee farming contributes to deforestation, with an estimated 2.5 million acres of forest cleared annually [1]. Water usage is significant \u2014 one cup requires approximately 140 liters [2]. However, shade-grown methods are reducing impacts [3].",
        },
      ];
    default:
      return [];
  }
}
