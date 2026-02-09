/**
 * StepIndicator — Three tabs showing walkthrough progress.
 * Rewrite | Proofread | Research
 */

import "./step-indicator.css";

export type Act = "rewrite" | "proofread" | "research";

interface StepIndicatorProps {
  currentAct: Act;
  completedActs: Act[];
  onActSelect: (act: Act) => void;
}

const ACTS: { id: Act; label: string }[] = [
  { id: "rewrite", label: "Rewrite" },
  { id: "proofread", label: "Proofread" },
  { id: "research", label: "Research" },
];

export function StepIndicator({
  currentAct,
  completedActs,
  onActSelect,
}: StepIndicatorProps) {
  return (
    <nav className="step-indicator" role="tablist" aria-label="Walkthrough steps">
      {ACTS.map((act, index) => {
        const isActive = currentAct === act.id;
        const isCompleted = completedActs.includes(act.id);

        return (
          <button
            key={act.id}
            role="tab"
            aria-selected={isActive}
            className={`step-indicator__tab ${isActive ? "step-indicator__tab--active" : ""} ${isCompleted ? "step-indicator__tab--completed" : ""}`}
            onClick={() => onActSelect(act.id)}
          >
            <span className="step-indicator__number">
              {isCompleted ? "✓" : index + 1}
            </span>
            <span className="step-indicator__label">{act.label}</span>
          </button>
        );
      })}
    </nav>
  );
}
