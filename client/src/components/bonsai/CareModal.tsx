/**
 * CareModal — shows care action details and confirms the action
 * Design: Wabi-Sabi Cinematic Dark Garden
 */

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { CareActionDef } from "@/lib/bonsaiData";

interface Props {
  action: CareActionDef | null;
  open: boolean;
  onConfirm: () => void;
  onClose: () => void;
}

export default function CareModal({ action, open, onConfirm, onClose }: Props) {
  if (!action) return null;

  return (
    <Dialog open={open} onOpenChange={(v) => !v && onClose()}>
      <DialogContent
        style={{
          background: "oklch(0.16 0.01 60)",
          border: "1px solid oklch(1 0 0 / 12%)",
          color: "oklch(0.88 0.015 75)",
          fontFamily: "'Cormorant Garamond', serif",
          maxWidth: "400px",
        }}
      >
        <DialogHeader>
          <DialogTitle
            className="font-display text-2xl font-medium flex items-center gap-2"
            style={{ color: "oklch(0.88 0.015 75)" }}
          >
            <span className="text-2xl">{action.icon}</span>
            {action.label}
          </DialogTitle>
          <DialogDescription
            className="font-display text-base mt-2"
            style={{ color: "oklch(0.65 0.010 75)" }}
          >
            {action.description}
          </DialogDescription>
        </DialogHeader>

        <div
          className="my-3 p-3 rounded-sm flex items-center gap-3"
          style={{ background: "oklch(0.20 0.01 60)", border: "1px solid oklch(1 0 0 / 8%)" }}
        >
          <span className="text-lg">🌱</span>
          <div>
            <div className="font-kanji text-[10px] mb-0.5" style={{ color: "oklch(0.55 0.09 55)" }}>
              成長
            </div>
            <span
              className="font-mono-bonsai text-lg"
              style={{ color: "oklch(0.65 0.12 55)" }}
            >
              +{action.pointsGained}
            </span>
            <span
              className="font-display text-sm ml-1.5"
              style={{ color: "oklch(0.58 0.010 75)" }}
            >
              growth points
            </span>
          </div>
        </div>

        <DialogFooter className="flex gap-2 mt-2">
          <button
            onClick={onClose}
            className="action-btn action-btn-dark flex-1 px-4 py-2 rounded-sm text-sm font-medium"
            style={{ fontFamily: "'Cormorant Garamond', serif" }}
          >
            Cancel
          </button>
          <button
            onClick={() => { onConfirm(); onClose(); }}
            className="action-btn action-btn-water flex-1 px-4 py-2 rounded-sm text-sm font-medium"
            style={{ fontFamily: "'Cormorant Garamond', serif" }}
          >
            Confirm
          </button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
