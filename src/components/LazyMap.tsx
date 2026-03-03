"use client";

import { useEffect, useRef, useState } from "react";

interface Props {
  src: string;
  title: string;
}

export function LazyMap({ src, title }: Props) {
  const ref = useRef<HTMLDivElement>(null);
  const [load, setLoad] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setLoad(true);
          observer.unobserve(el);
        }
      },
      { rootMargin: "200px" }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <div ref={ref} className="w-full h-full min-h-[400px]">
      {load ? (
        <iframe
          src={src}
          width="100%"
          height="100%"
          style={{ minHeight: 400, border: 0 }}
          title={title}
          loading="lazy"
        />
      ) : (
        <div className="w-full h-full min-h-[400px] flex items-center justify-center">
          <div className="w-8 h-8 border-2 border-[#1e3a51] border-t-[#c9a962] rounded-full animate-spin" />
        </div>
      )}
    </div>
  );
}
