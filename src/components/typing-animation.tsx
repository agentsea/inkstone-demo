/**
 * TypingAnimation — Character-by-character text reveal.
 *
 * Used for chat messages (user typing a prompt).
 * Blinking cursor at the end while typing, disappears on completion.
 * Robust against React StrictMode double-mounting.
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
  delay = 300,
  onComplete,
  className = "",
}: TypingAnimationProps) {
  const [charIndex, setCharIndex] = useState(0);
  const [started, setStarted] = useState(false);
  const onCompleteRef = useRef(onComplete);
  onCompleteRef.current = onComplete;
  const completedRef = useRef(false);

  // Reset when text changes
  useEffect(() => {
    setCharIndex(0);
    setStarted(false);
    completedRef.current = false;
  }, [text]);

  // Delay before starting
  useEffect(() => {
    const timer = setTimeout(() => setStarted(true), delay);
    return () => clearTimeout(timer);
  }, [delay, text]);

  // Type one character at a time
  useEffect(() => {
    if (!started) return;
    if (charIndex >= text.length) {
      if (!completedRef.current) {
        completedRef.current = true;
        onCompleteRef.current?.();
      }
      return;
    }

    const timer = setTimeout(() => {
      setCharIndex((prev) => prev + 1);
    }, speed);

    return () => clearTimeout(timer);
  }, [started, charIndex, text.length, speed]);

  const displayed = started ? text.slice(0, charIndex) : "";
  const isTyping = started && charIndex < text.length;

  return (
    <span className={className}>
      {displayed}
      {isTyping && <span className="typing-cursor">|</span>}
    </span>
  );
}
