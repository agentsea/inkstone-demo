/**
 * TypingAnimation — Character-by-character text reveal.
 *
 * Used for chat messages (user typing a prompt, AI typing a response).
 * Blinking cursor at the end while typing, disappears on completion.
 */

import { useState, useEffect, useRef } from "react";

interface TypingAnimationProps {
  text: string;
  speed?: number; // ms per character
  delay?: number; // ms before typing starts
  onComplete?: () => void;
  className?: string;
}

export function TypingAnimation({
  text,
  speed = 50,
  delay = 0,
  onComplete,
  className = "",
}: TypingAnimationProps) {
  const [displayed, setDisplayed] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const onCompleteRef = useRef(onComplete);
  onCompleteRef.current = onComplete;

  useEffect(() => {
    setDisplayed("");
    setIsTyping(false);

    const delayTimer = setTimeout(() => {
      setIsTyping(true);
      let i = 0;

      const interval = setInterval(() => {
        i++;
        if (i <= text.length) {
          setDisplayed(text.slice(0, i));
        } else {
          clearInterval(interval);
          setIsTyping(false);
          onCompleteRef.current?.();
        }
      }, speed);

      return () => clearInterval(interval);
    }, delay);

    return () => clearTimeout(delayTimer);
  }, [text, speed, delay]);

  return (
    <span className={className}>
      {displayed}
      {isTyping && <span className="typing-cursor">|</span>}
    </span>
  );
}
