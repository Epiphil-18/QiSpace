/**
 * CareActions — Water / Prune / Carve Jin buttons with cooldown display
 * Design: Wabi-Sabi Cinematic Dark Garden
 */

import { useState } from "react";
import { CARE_ACTIONS, CareAction, CareActionDef } from "@/lib/bonsaiData";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import CareModal from "./CareModal";

interface Props {
  isCoolingDown: (id: CareAction) => boolean;
  formatCooldown: (id: CareAction) => string;
  cooldownProgress: (id: CareAction) => number;
  onAction: (id: CareAction, x: number, y: number) => void;
}

export default function CareActions({
  isCoolingDown,
  formatCooldown,
  cooldownProgress,
  onAction,
}: Props) {
  const [pendingAction, setPendingAction] = useState<{
    def: CareActionDef;
    x: number;
    y: number;
  } | null>(null);

  const handleClick = (actionId: CareAction, e: React.MouseEvent) => {
    if (isCoolingDown(actionId)) return;
    const action = CARE_ACTIONS.find((a) => a.id === actionId);
    if (!action) return;

    const rect = (e.currentTarget as HTMLElement).getBoundingClientRect();
    const containerRect = (e.currentTarget as HTMLElement)
      .closest(".bonsai-viewport")
      ?.getBoundingClientRect();
    const x = rect.left + rect.width / 2 - (containerRect?.left ?? 0);
    const y = rect.top - (containerRect?.top ?? 0) - 10;

    // Prune and Carve Jin get a confirmation modal; Water is instant
    if (actionId === "water") {
      onAction(actionId, x, y);
    } else {
      setPendingAction({ def: action, x, y });
    }
  };

  const confirmAction = () => {
    if (!pendingAction) return;
    onAction(pendingAction.def.id as CareAction, pendingAction.x, pendingAction.y);
    setPendingAction(null);
  };

  return (
    <>
      <div className="flex items-center gap-2">
        {CARE_ACTIONS.map((action) => {
          const cooling = isCoolingDown(action.id as CareAction);
          const remaining = formatCooldown(action.id as CareAction);
          const progress = cooldownProgress(action.id as CareAction);
          const isWater = action.id === "water";

          return (
            <Tooltip key={action.id}>
              <TooltipTrigger asChild>
                <button
                  onClick={(e) => handleClick(action.id as CareAction, e)}
                  disabled={cooling}
                  className={`action-btn relative flex items-center gap-1.5 px-4 py-2 rounded-sm text-sm font-medium
                    ${isWater ? "action-btn-water" : "action-btn-dark"}
                    ${cooling ? "opacity-55 cursor-not-allowed" : isWater ? "pulse-available" : ""}
                  `}
                  style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "0.9rem" }}
                >
                  {/* Cooldown arc overlay */}
                  {cooling && (
                    <span className="absolute inset-0 flex items-center justify-center rounded-sm overflow-hidden pointer-events-none">
                      <span
                        className="absolute inset-0 rounded-sm"
                        style={{
                          background: `conic-gradient(oklch(0.65 0.12 55 / 25%) ${(1 - progress) * 360}deg, transparent 0deg)`,
                        }}
                      />
                    </span>
                  )}
                  <span className="relative z-10 flex items-center gap-1.5">
                    <span className="text-base leading-none">{action.icon}</span>
                    <span>
                      {cooling ? remaining : action.label}
                    </span>
                  </span>
                </button>
              </TooltipTrigger>
              <TooltipContent
                side="top"
                style={{
                  background: "oklch(0.17 0.01 60)",
                  border: "1px solid oklch(1 0 0 / 12%)",
                  color: "oklch(0.78 0.012 75)",
                  fontFamily: "'Cormorant Garamond', serif",
                  fontSize: "0.8rem",
                }}
              >
                {cooling
                  ? `Ready in ${remaining}`
                  : `${action.description} (+${action.pointsGained} pts)`}
              </TooltipContent>
            </Tooltip>
          );
        })}
      </div>

      <CareModal
        action={pendingAction?.def ?? null}
        open={!!pendingAction}
        onConfirm={confirmAction}
        onClose={() => setPendingAction(null)}
      />
    </>
  );
}
