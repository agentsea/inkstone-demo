import { useEffect, useState } from "react";
import { LazyMotion, domAnimation } from "motion/react";
import { Walkthrough } from "./components/walkthrough";
import { getInitialTheme, listenForThemeChanges, type Theme } from "./components/theme-listener";

export default function App() {
  const [theme, setTheme] = useState<Theme>(getInitialTheme);

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
  }, [theme]);

  useEffect(() => {
    return listenForThemeChanges(setTheme);
  }, []);

  return (
    <LazyMotion features={domAnimation}>
      <Walkthrough theme={theme} />
    </LazyMotion>
  );
}
