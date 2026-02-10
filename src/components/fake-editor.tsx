/**
 * FakeEditor — The "movie set" editor surface.
 *
 * Styled to closely match the real Inkstone app using exact Lucide icons,
 * two-row toolbar, and document title bar.
 */

import { forwardRef } from "react";
import {
  Glasses, BadgeCheck, BookOpen, Globe,
  Bold, Italic, Underline, Strikethrough, Code, Link, Image, Table, Search,
  AlignLeft, AlignCenter, AlignRight, AlignJustify,
  List, ListOrdered, CheckSquare,
  Undo, Redo,
  Printer,
  History,
  Sun, Moon,
} from "lucide-react";
import type { Theme } from "./theme-listener";
import type { WalkthroughState } from "./walkthrough";
import type { Act } from "./step-indicator";
import type { ResearchPhase } from "./research-insert";
import { TextMorph } from "./text-morph";
import { DiffAnimation } from "./diff-animation";
import { ResearchDocInsert } from "./research-insert";
import { DOC, ACT1, ACT2 } from "../data/walkthrough-script";
import "./fake-editor.css";
import "./animations.css";

interface FakeEditorProps {
  state: WalkthroughState;
  researchPhase?: ResearchPhase;
  onActComplete: (act: Act) => void;
  theme?: Theme;
  onToggleTheme?: () => void;
  waitForAccept?: boolean;
  acceptAll?: boolean;
  onDiffsVisible?: () => void;
  showRewriteDiffs?: boolean;
  chatTypingDone?: boolean;
}

export const FakeEditor = forwardRef<HTMLDivElement, FakeEditorProps>(
  function FakeEditor({ state, researchPhase = "idle", onActComplete, theme, onToggleTheme, waitForAccept, acceptAll, onDiffsVisible, showRewriteDiffs, chatTypingDone }, ref) {
    const isMorphing = state === "act1";

    return (
      <div className="fake-editor" ref={ref}>
        {/* Document header bar */}
        <div className="fake-editor__header">
          <div className="fake-editor__header-left">
            <span className="fake-editor__doc-title">{DOC.title}</span>
            <span className="fake-editor__doc-subtitle">{DOC.project}</span>
          </div>
          <div className="fake-editor__header-right">
            <button className="fake-editor__header-btn">
              <History size={14} />
              <span>Edited just now</span>
            </button>
            <button className="fake-editor__header-btn">
              <BadgeCheck size={14} />
              <span>Claims</span>
            </button>
            {onToggleTheme && (
              <button
                className="fake-editor__header-btn fake-editor__theme-toggle"
                onClick={onToggleTheme}
                title={`Switch to ${theme === "dark" ? "light" : "dark"} mode`}
              >
                {theme === "dark" ? <Sun size={14} /> : <Moon size={14} />}
              </button>
            )}
          </div>
        </div>

        {/* Toolbar: label + icons per section, laid out horizontally */}
        <div className="fake-editor__toolbar">
          {/* AI section */}
          <div className="fake-editor__toolbar-section">
            <span className="fake-editor__toolbar-label fake-editor__toolbar-label--active">AI</span>
            <div className="fake-editor__toolbar-icons">
              <button
                className={`fake-editor__toolbar-icon ${state === "act2" ? "fake-editor__toolbar-icon--active" : ""}`}
                data-tour-target="toolbar-proofread"
                title="Proofread"
              >
                <Glasses size={16} />
              </button>
              <button className="fake-editor__toolbar-icon" title="Fact-check">
                <BadgeCheck size={16} />
              </button>
              <button className="fake-editor__toolbar-icon" title="Deep Research">
                <BookOpen size={16} />
              </button>
              <button className="fake-editor__toolbar-icon" title="Web Search">
                <Globe size={16} />
              </button>
            </div>
          </div>

          {/* STYLE section */}
          <div className="fake-editor__toolbar-section">
            <span className="fake-editor__toolbar-label">STYLE</span>
            <div className="fake-editor__toolbar-icons">
              <span className="fake-editor__toolbar-dropdown">Heading 1</span>
            </div>
          </div>

          {/* FORMAT section */}
          <div className="fake-editor__toolbar-section">
            <span className="fake-editor__toolbar-label">FORMAT</span>
            <div className="fake-editor__toolbar-icons">
              <button className="fake-editor__toolbar-icon" title="Bold"><Bold size={16} /></button>
              <button className="fake-editor__toolbar-icon" title="Italic"><Italic size={16} /></button>
              <button className="fake-editor__toolbar-icon" title="Underline"><Underline size={16} /></button>
              <button className="fake-editor__toolbar-icon" title="Strikethrough"><Strikethrough size={16} /></button>
              <button className="fake-editor__toolbar-icon" title="Code"><Code size={16} /></button>
              <button className="fake-editor__toolbar-icon" title="Link"><Link size={16} /></button>
              <button className="fake-editor__toolbar-icon" title="Image"><Image size={16} /></button>
              <button className="fake-editor__toolbar-icon" title="Table"><Table size={16} /></button>
              <button className="fake-editor__toolbar-icon fake-editor__toolbar-icon--text-color" title="Text Color">
                <span>A</span>
              </button>
              <button className="fake-editor__toolbar-icon" title="Find & Replace"><Search size={16} /></button>
            </div>
          </div>

          {/* ALIGN section */}
          <div className="fake-editor__toolbar-section">
            <span className="fake-editor__toolbar-label">ALIGN</span>
            <div className="fake-editor__toolbar-icons">
              <button className="fake-editor__toolbar-icon" title="Align Left"><AlignLeft size={16} /></button>
              <button className="fake-editor__toolbar-icon" title="Align Center"><AlignCenter size={16} /></button>
              <button className="fake-editor__toolbar-icon" title="Align Right"><AlignRight size={16} /></button>
              <button className="fake-editor__toolbar-icon" title="Justify"><AlignJustify size={16} /></button>
            </div>
          </div>

          {/* LISTS section */}
          <div className="fake-editor__toolbar-section">
            <span className="fake-editor__toolbar-label">LISTS</span>
            <div className="fake-editor__toolbar-icons">
              <button className="fake-editor__toolbar-icon" title="Bullet List"><List size={16} /></button>
              <button className="fake-editor__toolbar-icon" title="Numbered List"><ListOrdered size={16} /></button>
              <button className="fake-editor__toolbar-icon" title="Task List"><CheckSquare size={16} /></button>
            </div>
          </div>

          {/* HISTORY section */}
          <div className="fake-editor__toolbar-section">
            <span className="fake-editor__toolbar-label">HISTORY</span>
            <div className="fake-editor__toolbar-icons">
              <button className="fake-editor__toolbar-icon" title="Undo"><Undo size={16} /></button>
              <button className="fake-editor__toolbar-icon" title="Redo"><Redo size={16} /></button>
            </div>
          </div>

          {/* PRINT section */}
          <div className="fake-editor__toolbar-section">
            <span className="fake-editor__toolbar-label">PRINT</span>
            <div className="fake-editor__toolbar-icons">
              <button className="fake-editor__toolbar-icon" title="Print"><Printer size={16} /></button>
            </div>
          </div>
        </div>

        {/* Document content area */}
        <div className="fake-editor__content" data-tour-target="editor-area">
          <div className="fake-editor__page">
            <p
              className={`fake-editor__paragraph ${isMorphing ? "fake-editor__paragraph--morphing" : ""}`}
              data-tour-target="editor-paragraph"
            >
              {renderEditorContent(state, onActComplete, waitForAccept, acceptAll, onDiffsVisible, showRewriteDiffs, chatTypingDone)}
            </p>

            <ResearchDocInsert phase={researchPhase} />

            <span className="fake-editor__cursor" />
          </div>
        </div>
      </div>
    );
  }
);

function renderEditorContent(
  state: WalkthroughState,
  onActComplete: (act: Act) => void,
  waitForAccept?: boolean,
  acceptAll?: boolean,
  onDiffsVisible?: () => void,
  showRewriteDiffs?: boolean,
  chatTypingDone?: boolean,
): React.ReactNode {
  switch (state) {
    case "idle":
      return ACT1.roughDraft;
    case "act1":
      // Wait for chat typing to finish before starting morph
      if (!chatTypingDone) {
        return ACT1.roughDraft;
      }
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
      // Show rewrite result as diffs if enabled (Step 4)
      if (showRewriteDiffs) {
        return <RewriteDiffView />;
      }
      return ACT1.polishedDraft;
    case "act2":
      return (
        <DiffAnimation
          isActive={true}
          waitForAccept={waitForAccept}
          acceptAll={acceptAll}
          onDiffsVisible={onDiffsVisible}
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

/** Shows the rough→polished rewrite as inline red/green diffs */
function RewriteDiffView() {
  // Key phrases that changed — show a few representative diffs
  // from the rough draft to polished version
  return (
    <span className="diff-text">
      <span className="diff-deletion">AI is like the difference between an IKEA table and a handmade one. Before IKEA you had to make tables by hand or pay a lot. After IKEA everyone gets a table. Not amazing but functional.</span>
      <span className="diff-insertion">When it comes to writing and AI, think about it like a hand-crafted table versus an IKEA table. Before IKEA, every table was handcrafted and that meant only a small number of people could afford them. After IKEA everyone can have a good, solid table. Maybe not a craftsman level table, but a table that works and does what a table should do.</span>
      {" "}But{" "}
      <span className="diff-deletion">the craftsman tables didn{"\u2019"}t go away. We just ended up with more tables everywhere. Kitchen table, dining room, side tables, office desk. That{"\u2019"}s called Jevons Paradox I think. When something gets cheap we want more of it not less.</span>
      <span className="diff-insertion">IKEA didn{"\u2019"}t make the craftsman tables disappear. We just got more tables. That{"\u2019"}s Jevons Paradox in action. Once something gets cheaper and more ubiquitous, we want more of it.</span>
    </span>
  );
}
