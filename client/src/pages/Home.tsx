/**
 * QiSpace Bonsai — Home Page
 * Design: Wabi-Sabi Cinematic Dark Garden
 *
 * Layout:
 *   - Top nav bar (minimal)
 *   - Main viewport: [BonsaiViewer 65%] [Glass right panel 35%]
 *     - Right panel: SPECIES list + POT grid
 *   - Bottom: GrowthGuide + ZenGardenTeaser
 */

import { useBonsaiState } from "@/hooks/useBonsaiState";
import { Link } from "wouter";
import BonsaiViewer from "@/components/bonsai/BonsaiViewer";
import SpeciesPanel from "@/components/bonsai/SpeciesPanel";
import PotPanel from "@/components/bonsai/PotPanel";
import GrowthGuide from "@/components/bonsai/GrowthGuide";
import ZenGardenTeaser from "@/components/bonsai/ZenGardenTeaser";
import { CareAction } from "@/lib/bonsaiData";

export default function Home() {
  const {
    state,
    selectedSpecies,
    selectedPot,
    selectSpecies,
    selectPot,
    isCoolingDown,
    cooldownProgress,
    performAction,
    formatCooldown,
    floaters,
    imageVisible,
  } = useBonsaiState();

  return (
    <div
      className="min-h-screen flex flex-col"
      style={{ background: "oklch(0.11 0.006 60)" }}
    >
      {/* ── Top Navigation ── */}
      <nav
        className="flex items-center justify-between px-6 py-3 border-b"
        style={{
          background: "oklch(0.13 0.008 60 / 95%)",
          borderColor: "oklch(1 0 0 / 8%)",
          backdropFilter: "blur(8px)",
          position: "sticky",
          top: 0,
          zIndex: 50,
        }}
      >
        <div className="flex items-center gap-3">
          <span className="text-xl" style={{ lineHeight: 1 }}>🌿</span>
          <div>
            <span
              className="font-display text-lg font-medium"
              style={{ color: "oklch(0.88 0.015 75)" }}
            >
              QiSpace
            </span>
            <span
              className="font-kanji text-xs ml-2"
              style={{ color: "oklch(0.55 0.012 75)" }}
            >
              盆栽
            </span>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <div
            className="flex items-center gap-1.5 px-3 py-1 rounded-sm"
            style={{
              background: "oklch(0.17 0.01 60)",
              border: "1px solid oklch(0.65 0.12 55 / 30%)",
            }}
          >
            <span className="text-sm">🌱</span>
            <span
              className="font-mono-bonsai text-sm"
              style={{ color: "oklch(0.65 0.12 55)" }}
            >
              {state.growthPoints}
            </span>
            <span
              className="font-display text-xs"
              style={{ color: "oklch(0.55 0.010 75)" }}
            >
              growth pts
            </span>
          </div>
          <Link
            href="/journal"
            className="font-display text-sm px-3 py-1 rounded-sm border"
            style={{
              color: "oklch(0.65 0.012 75)",
              borderColor: "oklch(1 0 0 / 12%)",
              background: "transparent",
              textDecoration: "none",
            }}
          >
            Journal
          </Link>
        </div>
      </nav>

      {/* ── Main Viewport ── */}
      <div className="flex relative" style={{ height: "calc(100vh - 52px)", minHeight: "540px" }}>
        {/* Bonsai viewer — left ~65%, fills full height */}
        <BonsaiViewer
          species={selectedSpecies}
          pot={selectedPot}
          growthPoints={state.growthPoints}
          imageVisible={imageVisible}
          floaters={floaters}
          isCoolingDown={isCoolingDown}
          formatCooldown={formatCooldown}
          cooldownProgress={cooldownProgress}
          onAction={(id: CareAction, x: number, y: number) =>
            performAction(id, x, y)
          }
        />

        {/* Right glass panel — ~35% */}
        <aside
          className="glass-panel flex flex-col overflow-y-auto h-full"
          style={{
            width: "clamp(260px, 32%, 360px)",
            flexShrink: 0,
          }}
        >
          {/* Species section */}
          <div className="px-4 pt-5 pb-2">
            <div className="section-label mb-3">Species</div>
            <SpeciesPanel
              selectedId={state.selectedSpeciesId}
              onSelect={selectSpecies}
            />
          </div>

          {/* Divider */}
          <div
            className="mx-4 my-2"
            style={{ height: "1px", background: "oklch(1 0 0 / 8%)" }}
          />

          {/* Pot section */}
          <div className="px-4 pb-5">
            <div className="section-label mb-3">Pot</div>
            <PotPanel selectedId={state.selectedPotId} onSelect={selectPot} />
          </div>

          {/* Care notes for selected species */}
          <div
            className="mx-4 mb-5 p-3 rounded-sm"
            style={{
              background: "oklch(0.16 0.008 60 / 70%)",
              border: "1px solid oklch(1 0 0 / 8%)",
            }}
          >
            <div className="section-label mb-2">Care Notes</div>
            <div className="flex flex-col gap-1.5">
              {selectedSpecies.careNotes.map((note, i) => (
                <p
                  key={i}
                  className="font-display text-[12px] leading-snug"
                  style={{ color: "oklch(0.60 0.010 75)" }}
                >
                  · {note}
                </p>
              ))}
            </div>
          </div>
        </aside>
      </div>

      {/* ── Bottom Sections ── */}
      <GrowthGuide />

      {/* Thin separator */}
      <div style={{ height: "1px", background: "oklch(1 0 0 / 6%)" }} />

      <ZenGardenTeaser />

      {/* Footer */}
      <footer
        className="px-8 py-4 flex items-center justify-between"
        style={{
          background: "oklch(0.10 0.005 60)",
          borderTop: "1px solid oklch(1 0 0 / 6%)",
        }}
      >
        <span
          className="font-display text-sm"
          style={{ color: "oklch(0.42 0.008 75)" }}
        >
          QiSpace Bonsai — cultivate patience, grow beauty
        </span>
        <span
          className="font-kanji text-xs"
          style={{ color: "oklch(0.35 0.008 75)" }}
        >
          盆栽の道
        </span>
      </footer>
    </div>
  );
}
