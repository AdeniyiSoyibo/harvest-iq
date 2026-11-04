import Link from "next/link";

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen gap-4 p-8 text-center">
      <div className="w-16 h-16 rounded-full bg-sky-50 flex items-center justify-center">
        <span className="text-sky-400 text-3xl font-bold">?</span>
      </div>
      <h2 className="text-base font-bold text-[#1a2a3a]">Page not found</h2>
      <p className="text-xs text-[#7a9abf]">This page doesn't exist or has been moved.</p>
      <Link
        href="/"
        className="px-4 py-2 rounded-xl bg-sky-500 hover:bg-sky-600 text-white text-sm font-semibold transition-colors"
      >
        Go to Production Studio
      </Link>
    </div>
  );
}
