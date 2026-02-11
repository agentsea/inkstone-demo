import { useEffect, useState, useCallback } from "react";
import { LazyMotion, domAnimation } from "motion/react";
import { Walkthrough } from "./components/walkthrough";
import { MobileCameraWrapper } from "./components/mobile-camera";
import { useIsMobile } from "./hooks/use-is-mobile";
import { getInitialTheme, listenForThemeChanges, type Theme } from "./components/theme-listener";

export default function App() {
  const [theme, setTheme] = useState<Theme>(getInitialTheme);
  const isMobile = useIsMobile();

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
  }, [theme]);

  useEffect(() => {
    return listenForThemeChanges(setTheme);
  }, []);

  const toggleTheme = useCallback(() => {
    setTheme((prev) => (prev === "dark" ? "light" : "dark"));
  }, []);

  return (
    <LazyMotion features={domAnimation}>
      {isMobile ? (
        <MobileCameraWrapper theme={theme} onToggleTheme={toggleTheme} />
      ) : (
        <Walkthrough theme={theme} onToggleTheme={toggleTheme} />
      )}
    </LazyMotion>
  );
}
