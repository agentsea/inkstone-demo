/**
 * BottomBar — Status bar at the bottom with theme toggle.
 * Matches the real Inkstone app's bottom bar with sun/moon toggle.
 */

import { Sun, Moon } from "lucide-react";
import type { Theme } from "./theme-listener";
import "./bottom-bar.css";

interface BottomBarProps {
  theme: Theme;
  onToggleTheme: () => void;
}

export function BottomBar({ theme, onToggleTheme }: BottomBarProps) {
  return (
    <div className="bottom-bar">
      <div className="bottom-bar__left" />
      <div className="bottom-bar__center">
        <button
          className="bottom-bar__theme-toggle"
          onClick={onToggleTheme}
          title={`Switch to ${theme === "dark" ? "light" : "dark"} mode`}
          aria-label={`Switch to ${theme === "dark" ? "light" : "dark"} mode`}
        >
          {theme === "dark" ? <Sun size={14} /> : <Moon size={14} />}
        </button>
      </div>
      <div className="bottom-bar__right" />
    </div>
  );
}
