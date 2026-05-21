/**
 * Journal page — placeholder for future journal feature
 * Design: Wabi-Sabi Cinematic Dark Garden
 */

import { Link } from "wouter";

export default function Journal() {
  return (
    <div
      className="min-h-screen flex flex-col items-center justify-center"
      style={{ background: "oklch(0.11 0.006 60)" }}
    >
      <div className="text-center max-w-md px-6">
        <div className="font-kanji text-3xl mb-3" style={{ color: "oklch(0.65 0.12 55 / 60%)" }}>
          日誌
        </div>
        <h1
          className="font-display text-4xl font-light mb-4"
          style={{ color: "oklch(0.88 0.015 75)" }}
        >
          Bonsai Journal
        </h1>
        <p
          className="font-display text-lg mb-8"
          style={{ color: "oklch(0.60 0.010 75)" }}
        >
          Record your care sessions, observations, and reflections. Each entry earns growth points for your tree.
        </p>
        <div
          className="inline-flex items-center gap-2 px-5 py-2 rounded-sm border mb-8"
          style={{
            background: "oklch(0.15 0.008 60 / 80%)",
            borderColor: "oklch(0.65 0.12 55 / 40%)",
            color: "oklch(0.65 0.12 55)",
          }}
        >
          <span>✦</span>
          <span className="font-display text-sm tracking-widest uppercase" style={{ letterSpacing: "0.2em" }}>
            Coming Soon
          </span>
          <span>✦</span>
        </div>
        <div>
          <Link
            href="/"
            className="font-display text-sm"
            style={{ color: "oklch(0.55 0.010 75)", textDecoration: "underline", textUnderlineOffset: "4px" }}
          >
            ← Return to your bonsai
          </Link>
        </div>
      </div>
    </div>
  );
}
