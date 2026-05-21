/**
 * PotPanel — 2×2 grid pot selector
 * Design: Wabi-Sabi Cinematic Dark Garden
 */

import { POTS } from "@/lib/bonsaiData";

interface Props {
  selectedId: string;
  onSelect: (id: string) => void;
}

export default function PotPanel({ selectedId, onSelect }: Props) {
  return (
    <div className="grid grid-cols-2 gap-1.5">
      {POTS.map((pot) => (
        <button
          key={pot.id}
          onClick={() => onSelect(pot.id)}
          className={`pot-item text-left px-2.5 py-2 ${
            selectedId === pot.id ? "selected" : ""
          }`}
        >
          <div
            className="font-display text-[13px] font-medium leading-tight"
            style={{
              color:
                selectedId === pot.id
                  ? "oklch(0.88 0.015 75)"
                  : "oklch(0.70 0.012 75)",
            }}
          >
            {pot.name}
          </div>
          <div
            className="text-[10px] mt-0.5"
            style={{ color: "oklch(0.50 0.010 75)", fontFamily: "'Cormorant Garamond', serif" }}
          >
            {pot.subtitle}
          </div>
        </button>
      ))}
    </div>
  );
}
