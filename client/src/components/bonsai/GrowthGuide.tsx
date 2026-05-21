/**
 * GrowthGuide — "How your tree grows" scoring section
 * Design: Wabi-Sabi Cinematic Dark Garden
 */

import { GROWTH_RULES } from "@/lib/bonsaiData";

export default function GrowthGuide() {
  return (
    <section
      className="px-8 py-8"
      style={{ background: "oklch(0.11 0.006 60)" }}
    >
      <div className="max-w-2xl">
        <h2
          className="font-display text-2xl font-medium mb-5"
          style={{ color: "oklch(0.85 0.015 75)" }}
        >
          How your tree grows
        </h2>
        <div className="flex flex-col gap-2.5">
          {GROWTH_RULES.map((rule, i) => (
            <div key={i} className="flex items-center gap-3">
              <span className="text-base w-5 text-center">{rule.icon}</span>
              <span
                className="font-display text-[15px]"
                style={{ color: "oklch(0.72 0.012 75)" }}
              >
                {rule.label}
              </span>
              <span
                className="font-mono-bonsai text-[13px] ml-1"
                style={{ color: "oklch(0.65 0.12 55)" }}
              >
                — +{rule.points}
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
