"use client";

import { useEffect } from "react";
import Preloader from "@/components/Preloader";
import ReadingProgress from "@/components/ReadingProgress";
import MobileCallButton from "@/components/MobileCallButton";

export default function ClientBody({
  children,
}: {
  children: React.ReactNode;
}) {
  useEffect(() => {
    document.body.className = "antialiased";
  }, []);

  return (
    <>
      <Preloader />
      <ReadingProgress />
      <div className="antialiased">{children}</div>
      <MobileCallButton />
    </>
  );
}
