/**
 * BonsaiViewer — hero viewport showing the bonsai image with overlay
 * Design: Wabi-Sabi Cinematic Dark Garden
 */

import { BonsaiSpecies, BonsaiPot, CareAction } from "@/lib/bonsaiData";
import CareActions from "./CareActions";
import { FloatingPoint } from "@/hooks/useBonsaiState";

interface Props {
  species: BonsaiSpecies;
  pot: BonsaiPot;
  growthPoints: number;
  imageVisible: boolean;
  floaters: FloatingPoint[];
  isCoolingDown: (id: CareAction) => boolean;
  formatCooldown: (id: CareAction) => string;
  cooldownProgress: (id: CareAction) => number;
  onAction: (id: CareAction, x: number, y: number) => void;
}

export default function BonsaiViewer({
  species,
  pot,
  growthPoints,
  imageVisible,
  floaters,
  isCoolingDown,
  formatCooldown,
  cooldownProgress,
  onAction,
}: Props) {
  return (
    <div
      className="bonsai-viewport relative flex-1 overflow-hidden"
      style={{ minHeight: "480px", height: "100%" }}
    >
      {/* Bonsai image with cross-fade transition */}
      <img
        key={species.id}
        src={species.image}
        alt={species.name}
        className="bonsai-image-transition absolute inset-0 w-full h-full object-cover object-center"
        style={{ opacity: imageVisible ? 1 : 0 }}
      />

      {/* Dark vignette overlay */}
      <div
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse at 40% 50%, transparent 30%, oklch(0.10 0.006 60 / 55%) 100%)",
        }}
      />

      {/* Right-side fade for panel blending */}
      <div
        className="absolute inset-y-0 right-0 w-1/3"
        style={{
          background:
            "linear-gradient(to left, oklch(0.13 0.008 60 / 75%) 0%, transparent 100%)",
        }}
      />

      {/* Bottom fade for action buttons area */}
      <div
        className="absolute bottom-0 left-0 right-0 h-40"
        style={{
          background:
            "linear-gradient(to top, oklch(0.11 0.006 60 / 80%) 0%, transparent 100%)",
        }}
      />

      {/* Species name overlay */}
      <div className="absolute bottom-28 left-0 right-1/3 flex flex-col items-center justify-center pointer-events-none">
        <div
          className="font-kanji text-xs mb-1 tracking-widest"
          style={{ color: "oklch(0.65 0.12 55 / 85%)", letterSpacing: "0.2em" }}
        >
          {species.kanji}
        </div>
        <h1
          className="font-display text-4xl font-light text-center leading-tight"
          style={{
            color: "oklch(0.92 0.012 75)",
            textShadow: "0 2px 20px oklch(0.08 0.005 60 / 80%)",
          }}
        >
          {species.name}
        </h1>
        <p
          className="font-display text-base mt-1 text-center"
          style={{ color: "oklch(0.70 0.010 75)" }}
        >
          {species.style} · {growthPoints} growth points
        </p>
      </div>

      {/* Care action buttons */}
      <div className="absolute bottom-10 left-0 right-1/3 flex items-center justify-center">
        <CareActions
          isCoolingDown={isCoolingDown}
          formatCooldown={formatCooldown}
          cooldownProgress={cooldownProgress}
          onAction={onAction}
        />
      </div>

      {/* Floating growth point indicators */}
      {floaters.map((f) => (
        <div
          key={f.id}
          className="growth-floater"
          style={{ left: f.x, top: f.y }}
        >
          +{f.value}
        </div>
      ))}
    </div>
  );
}
