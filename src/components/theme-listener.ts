/**
 * Theme coordination with Framer parent.
 *
 * Reads theme from:
 * 1. URL parameter: ?theme=dark|light
 * 2. postMessage from Framer: { type: 'theme-change', theme: 'dark'|'light' }
 * 3. Fallback: prefers-color-scheme media query
 */

export type Theme = "dark" | "light";

interface ThemeChangeMessage {
  type: "theme-change";
  theme: Theme;
}

function isThemeMessage(data: unknown): data is ThemeChangeMessage {
  return (
    typeof data === "object" &&
    data !== null &&
    "type" in data &&
    (data as ThemeChangeMessage).type === "theme-change" &&
    "theme" in data &&
    ((data as ThemeChangeMessage).theme === "dark" ||
      (data as ThemeChangeMessage).theme === "light")
  );
}

/** Read initial theme from URL param or system preference */
export function getInitialTheme(): Theme {
  // 1. Check URL parameter
  const params = new URLSearchParams(window.location.search);
  const urlTheme = params.get("theme");
  if (urlTheme === "dark" || urlTheme === "light") {
    return urlTheme;
  }

  // 2. Check system preference
  if (window.matchMedia("(prefers-color-scheme: light)").matches) {
    return "light";
  }

  // 3. Default to dark (matches Inkstone's default)
  return "dark";
}

/** Listen for postMessage theme changes from Framer parent. Returns cleanup function. */
export function listenForThemeChanges(
  onThemeChange: (theme: Theme) => void
): () => void {
  function handleMessage(event: MessageEvent) {
    if (isThemeMessage(event.data)) {
      onThemeChange(event.data.theme);
    }
  }

  window.addEventListener("message", handleMessage);
  return () => window.removeEventListener("message", handleMessage);
}
