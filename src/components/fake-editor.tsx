/**
 * FakeEditor — The "movie set" editor surface.
 *
 * Looks exactly like Inkstone's editor. Is actually just divs, spans, and CSS.
 * No TipTap. No ProseMirror. No contentEditable. Just styled HTML.
 *
 * Content is driven by the walkthrough state machine. Each act swaps in
 * its own animation component (TextMorph, DiffAnimation, ResearchDocInsert).
 */

import type { WalkthroughState } from "./walkthrough";
import type { Act } from "./step-indicator";
import type { ResearchPhase } from "./research-insert";
import { TextMorph } from "./text-morph";
import { DiffAnimation } from "./diff-animation";
import { ResearchDocInsert } from "./research-insert";
import { ACT1, ACT2 } from "../data/walkthrough-script";
import "./fake-editor.css";
import "./animations.css";

interface FakeEditorProps {
  state: WalkthroughState;
  researchPhase?: ResearchPhase;
  onActComplete: (act: Act) => void;
}

export function FakeEditor({ state, researchPhase = "idle", onActComplete }: FakeEditorProps) {
  const isMorphing = state === "act1";

  return (
    <div className="fake-editor">
      {/* Toolbar silhouette */}
      <div className="fake-editor__toolbar">
        <div className="fake-editor__toolbar-group">
          <ToolbarIcon icon="bold" />
          <ToolbarIcon icon="italic" />
          <ToolbarIcon icon="underline" />
          <div className="fake-editor__toolbar-divider" />
          <ToolbarIcon icon="heading" />
          <ToolbarIcon icon="list" />
          <ToolbarIcon icon="quote" />
        </div>
        <div className="fake-editor__toolbar-group">
          <button
            className={`fake-editor__toolbar-btn ${state === "act2" ? "fake-editor__toolbar-btn--active" : ""}`}
          >
            Proofread
          </button>
        </div>
      </div>

      {/* Document content area */}
      <div className="fake-editor__content">
        <div className="fake-editor__page">
          <p className={`fake-editor__paragraph ${isMorphing ? "fake-editor__paragraph--morphing" : ""}`}>
            {renderEditorContent(state, onActComplete)}
          </p>

          {/* Research insert flows into doc during Act 3 */}
          <ResearchDocInsert phase={researchPhase} />

          <span className="fake-editor__cursor" />
        </div>
      </div>
    </div>
  );
}

function renderEditorContent(
  state: WalkthroughState,
  onActComplete: (act: Act) => void
): React.ReactNode {
  switch (state) {
    case "idle":
      return ACT1.roughDraft;

    case "act1":
      return (
        <TextMorph
          from={ACT1.roughDraft}
          to={ACT1.polishedDraft}
          isActive={true}
          duration={ACT1.morphDuration}
          onComplete={() => onActComplete("rewrite")}
        />
      );

    case "act1-complete":
      return ACT1.polishedDraft;

    case "act2":
      return (
        <DiffAnimation
          isActive={true}
          onComplete={() => onActComplete("proofread")}
        />
      );

    case "act2-complete":
    case "act3":
    case "act3-complete":
      return ACT2.cleanText;

    default:
      return "";
  }
}

function ToolbarIcon({ icon }: { icon: string }) {
  const icons: Record<string, string> = {
    bold: "B",
    italic: "I",
    underline: "U",
    heading: "H",
    list: "≡",
    quote: "❝",
  };

  return (
    <button className="fake-editor__toolbar-icon" aria-label={icon}>
      {icons[icon] || "•"}
    </button>
  );
}
