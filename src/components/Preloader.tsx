"use client";

import { useState, useEffect } from "react";

export default function Preloader() {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setIsLoading(false);
  }, []);

  if (!isLoading) return null;

  return (
    <div className={`preloader ${!isLoading ? "hidden" : ""}`}>
      <div className="flex flex-col items-center gap-4">
        <div className="preloader-spinner" />
      </div>
    </div>
  );
}
