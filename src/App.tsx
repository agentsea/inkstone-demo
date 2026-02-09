import { useEffect, useState } from "react";
import { Walkthrough } from "./components/walkthrough";
import { getInitialTheme, listenForThemeChanges, type Theme } from "./components/theme-listener";

export default function App() {
  const [theme, setTheme] = useState<Theme>(getInitialTheme);

  useEffect(() => {
    // Apply theme to root element
    document.documentElement.setAttribute("data-theme", theme);
  }, [theme]);

  useEffect(() => {
    // Listen for postMessage theme changes from Framer parent
    return listenForThemeChanges(setTheme);
  }, []);

  return <Walkthrough theme={theme} />;
}
