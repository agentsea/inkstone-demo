/**
 * FakeEditor — The "movie set" editor surface.
 *
 * Styled to closely match the real Inkstone app:
 * - Document header bar (title + "Edited just now" + "Claims")
 * - Two-row toolbar: tab row (AI | STYLE | FORMAT | ...) + icon row
 * - Document content area with proper typography
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
      {/* Document header bar */}
      <div className="fake-editor__header">
        <div className="fake-editor__header-left">
          <span className="fake-editor__doc-title">Coffee Article Draft</span>
          <span className="fake-editor__doc-subtitle">My Project</span>
        </div>
        <div className="fake-editor__header-right">
          <span className="fake-editor__edited">Edited just now</span>
          <span className="fake-editor__claims-btn">Claims</span>
        </div>
      </div>

      {/* Toolbar row 1: tabs */}
      <div className="fake-editor__toolbar-tabs">
        <span className="fake-editor__tab fake-editor__tab--active">AI</span>
        <span className="fake-editor__tab">STYLE</span>
        <span className="fake-editor__tab">FORMAT</span>
        <span className="fake-editor__tab">ALIGN</span>
        <span className="fake-editor__tab">LISTS</span>
        <span className="fake-editor__tab">HISTORY</span>
        <span className="fake-editor__tab">PRINT</span>
      </div>

      {/* Toolbar row 2: formatting icons */}
      <div className="fake-editor__toolbar">
        <div className="fake-editor__toolbar-group">
          <ToolbarIcon icon="bold" />
          <ToolbarIcon icon="italic" />
          <ToolbarIcon icon="underline" />
          <ToolbarIcon icon="strike" />
          <div className="fake-editor__toolbar-divider" />
          <ToolbarIcon icon="code" />
          <ToolbarIcon icon="link" />
          <div className="fake-editor__toolbar-divider" />
          <ToolbarIcon icon="heading" />
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
    strike: "S",
    code: "<>",
    link: "🔗",
    heading: "H1",
  };

  return (
    <button className="fake-editor__toolbar-icon" aria-label={icon}>
      {icons[icon] || "•"}
    </button>
  );
}
