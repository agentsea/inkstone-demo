/**
 * FakeEditor — The "movie set" editor surface.
 *
 * Looks exactly like Inkstone's editor. Is actually just divs, spans, and CSS.
 * No TipTap. No ProseMirror. No contentEditable. Just styled HTML.
 */

import type { WalkthroughState } from "./walkthrough";
import type { Act } from "./step-indicator";
import "./fake-editor.css";

interface FakeEditorProps {
  state: WalkthroughState;
  onActComplete: (act: Act) => void;
}

export function FakeEditor({ state }: FakeEditorProps) {
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
          <p className="fake-editor__paragraph">
            {/* Content will be driven by walkthrough state */}
            {getEditorContent(state)}
          </p>
          <span className="fake-editor__cursor" />
        </div>
      </div>
    </div>
  );
}

/** Placeholder — will be replaced with animated components in Act implementations */
function getEditorContent(state: WalkthroughState): string {
  switch (state) {
    case "idle":
    case "act1":
      return "Coffee has been drank by people for a really long time. It started in Africa somewhere and then got popular in Europe and now basically everyone drinks it. There's a lot of coffee companies now.";
    case "act1-complete":
    case "act2":
    case "act2-complete":
    case "act3":
    case "act3-complete":
      return "From its origins in the Ethiopian highlands, coffee has journeyed across continents to become the world's most traded commodity after oil. Today, over 2.25 billion cups are consumed daily \u2014 a testament to the humble bean's extraordinary cultural grip.";
    default:
      return "";
  }
}

function ToolbarIcon({ icon }: { icon: string }) {
  // Simple SVG icon silhouettes matching editor toolbar
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
