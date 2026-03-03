"use client";

import { useEffect, useRef, useState } from "react";

type Animation = "fade-up" | "fade-in" | "fade-left" | "fade-right";

interface Props {
  children: React.ReactNode;
  animation?: Animation;
  delay?: number;
  className?: string;
  stagger?: number;
}

export function AnimateOnScroll({
  children,
  animation = "fade-up",
  delay = 0,
  className = "",
  stagger,
}: Props) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (prefersReduced) {
      setVisible(true);
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          observer.unobserve(el);
        }
      },
      { threshold: 0.15 }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  const staggerStyle = stagger
    ? { "--stagger-delay": `${stagger}ms` } as React.CSSProperties
    : undefined;

  return (
    <div
      ref={ref}
      className={`aos-${animation} ${visible ? "aos-visible" : ""} ${className}`}
      style={{ transitionDelay: `${delay}ms`, ...staggerStyle }}
    >
      {children}
    </div>
  );
}
