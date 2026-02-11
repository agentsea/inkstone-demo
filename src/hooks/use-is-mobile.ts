import { useState, useEffect, useCallback } from "react";

/**
 * Detects whether the viewport is too small for the full desktop walkthrough.
 *
 * Triggers mobile camera when:
 * - Portrait phone: width < 768px
 * - Landscape phone: width < 1024px AND height < 500px
 *
 * Tablets in portrait (768×1024) get the full desktop experience.
 */
function checkMobile(): boolean {
  if (typeof window === "undefined") return false;
  const w = window.innerWidth;
  const h = window.innerHeight;
  return w < 768 || (w < 1024 && h < 500);
}

export function useIsMobile(): boolean {
  const [isMobile, setIsMobile] = useState(checkMobile);

  const handleResize = useCallback(() => {
    setIsMobile(checkMobile());
  }, []);

  useEffect(() => {
    window.addEventListener("resize", handleResize);
    // Also listen for orientation changes (mobile Safari)
    window.addEventListener("orientationchange", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
      window.removeEventListener("orientationchange", handleResize);
    };
  }, [handleResize]);

  return isMobile;
}
