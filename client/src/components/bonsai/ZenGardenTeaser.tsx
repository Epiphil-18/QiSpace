/**
 * ZenGardenTeaser — Coming-soon Zen Sand Garden section
 * Design: Wabi-Sabi Cinematic Dark Garden
 */

import { toast } from "sonner";

export default function ZenGardenTeaser() {
  const handleClick = () => {
    toast("The Zen Sand Garden is coming soon — a fully interactive raking experience.", {
      description: "We are crafting each grain of sand with care. Check back soon.",
      duration: 4000,
    });
  };

  return (
    <section
      className="relative overflow-hidden cursor-pointer group"
      onClick={handleClick}
      style={{ background: "oklch(0.11 0.006 60)" }}
    >
      {/* Blurred background image */}
      <div
        className="absolute inset-0 transition-all duration-700 group-hover:scale-105"
        style={{
          backgroundImage: "url('/manus-storage/Tokimeki-ZenSerenityGarden_f40f2554.webp')",
          backgroundSize: "cover",
          backgroundPosition: "center 30%",
          filter: "blur(3px) brightness(0.35)",
        }}
      />

      {/* Overlay gradient */}
      <div
        className="absolute inset-0"
        style={{
          background:
            "linear-gradient(to right, oklch(0.11 0.006 60 / 70%) 0%, oklch(0.11 0.006 60 / 40%) 50%, oklch(0.11 0.006 60 / 70%) 100%)",
        }}
      />

      {/* Content */}
      <div className="relative z-10 flex flex-col items-center justify-center py-16 px-8 text-center">
        <div
          className="font-kanji text-sm mb-2 tracking-widest"
          style={{ color: "oklch(0.65 0.12 55 / 80%)" }}
        >
          赤杉森
        </div>
        <h2
          className="font-display text-4xl font-light mb-2"
          style={{ color: "oklch(0.90 0.015 75)" }}
        >
          Zen Serenity Garden
        </h2>
        <p
          className="font-display text-lg mb-6"
          style={{ color: "oklch(0.65 0.012 75)" }}
        >
          Raked Sand Pattern · Mindfulness Points
        </p>

        {/* Coming Soon badge */}
        <div
          className="inline-flex items-center gap-2 px-5 py-2 rounded-sm border"
          style={{
            background: "oklch(0.15 0.008 60 / 80%)",
            borderColor: "oklch(0.65 0.12 55 / 40%)",
            color: "oklch(0.65 0.12 55)",
          }}
        >
          <span className="text-base">✦</span>
          <span
            className="font-display text-sm tracking-widest uppercase"
            style={{ letterSpacing: "0.2em" }}
          >
            Coming Soon
          </span>
          <span className="text-base">✦</span>
        </div>

        <p
          className="mt-4 font-display text-sm max-w-sm"
          style={{ color: "oklch(0.50 0.010 75)" }}
        >
          Rake patterns into fine quartz sand, arrange basalt stones, and cultivate mindfulness — one breath at a time.
        </p>
      </div>
    </section>
  );
}
