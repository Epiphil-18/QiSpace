/**
 * SpeciesPanel — right-side species selector list
 * Design: Wabi-Sabi Cinematic Dark Garden
 */

import { SPECIES } from "@/lib/bonsaiData";

interface Props {
  selectedId: string;
  onSelect: (id: string) => void;
}

export default function SpeciesPanel({ selectedId, onSelect }: Props) {
  return (
    <div className="stagger-in flex flex-col gap-0">
      {SPECIES.map((species, i) => (
        <div key={species.id}>
        {i > 0 && (
          <div style={{ height: '1px', background: 'oklch(1 0 0 / 7%)', margin: '0 12px' }} />
        )}
        <button
          onClick={() => onSelect(species.id)}
          className={`species-item text-left px-3 py-3 rounded-sm w-full ${
            selectedId === species.id ? "selected" : ""
          }`}
          style={{ animationDelay: `${i * 45}ms` }}
        >
          <div
            className="font-kanji text-[10px] mb-0.5"
            style={{ color: "oklch(0.60 0.09 55)" }}
          >
            {species.kanji}
          </div>
          <div
            className="font-display text-[15px] font-medium leading-tight"
            style={{
              color:
                selectedId === species.id
                  ? "oklch(0.88 0.015 75)"
                  : "oklch(0.75 0.012 75)",
            }}
          >
            {species.name}
          </div>
          <div
            className="text-[11px] mt-0.5 leading-tight"
            style={{ color: "oklch(0.52 0.012 75)", fontFamily: "'Cormorant Garamond', serif" }}
          >
            {species.subtitle}
          </div>
        </button>
        </div>
      ))}
    </div>
  );
}
