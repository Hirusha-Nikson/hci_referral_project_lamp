"use client";
import LoadingOverlay from "@/components/loading-overlay";
import Image from "next/image";
import { useEffect, useState } from "react";
import Index from "./index/page";

export default function Home() {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Start a 2-second timer when component mounts
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 2500);

    // Cleanup timer on component unmount
    return () => clearTimeout(timer);
  }, []);

  return (
    <>
      {isLoading && <LoadingOverlay />}
      <Index />
    </>
  );
}
