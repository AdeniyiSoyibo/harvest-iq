"use client";

import { useEffect } from "react";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen gap-4 p-8 text-center">
      <div className="w-12 h-12 rounded-full bg-rose-100 flex items-center justify-center">
        <span className="text-rose-500 text-xl">!</span>
      </div>
      <h2 className="text-base font-bold text-[#1a2a3a]">Something went wrong</h2>
      <p className="text-xs text-[#7a9abf] max-w-xs">{error.message || "An unexpected error occurred."}</p>
      <button
        onClick={reset}
        className="px-4 py-2 rounded-xl bg-sky-500 hover:bg-sky-600 text-white text-sm font-semibold transition-colors"
      >
        Try again
      </button>
    </div>
  );
}
