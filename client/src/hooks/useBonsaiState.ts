/**
 * QiSpace Bonsai — Game State Hook
 * Manages species selection, pot selection, growth points, and care action cooldowns.
 * State is persisted to localStorage.
 */

import { useCallback, useEffect, useRef, useState } from "react";
import {
  CARE_ACTIONS,
  CareAction,
  POTS,
  SPECIES,
} from "@/lib/bonsaiData";

interface CooldownState {
  [actionId: string]: number; // timestamp when cooldown expires
}

interface BonsaiGameState {
  selectedSpeciesId: string;
  selectedPotId: string;
  growthPoints: number;
  cooldowns: CooldownState;
  lastWatered: number | null;
}

const STORAGE_KEY = "qispace-bonsai-state";

function loadState(): BonsaiGameState {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) return JSON.parse(raw) as BonsaiGameState;
  } catch {
    // ignore
  }
  return {
    selectedSpeciesId: SPECIES[0].id,
    selectedPotId: POTS[2].id, // Round Cobalt default
    growthPoints: SPECIES[0].baseGrowthPoints,
    cooldowns: {},
    lastWatered: null,
  };
}

function saveState(state: BonsaiGameState) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch {
    // ignore
  }
}

export interface FloatingPoint {
  id: string;
  value: number;
  x: number;
  y: number;
}

export function useBonsaiState() {
  const [state, setState] = useState<BonsaiGameState>(loadState);
  const [floaters, setFloaters] = useState<FloatingPoint[]>([]);
  const [imageVisible, setImageVisible] = useState(true);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const [now, setNow] = useState(Date.now());

  // Tick every second to update cooldown displays
  useEffect(() => {
    timerRef.current = setInterval(() => setNow(Date.now()), 1000);
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, []);

  // Persist on change
  useEffect(() => {
    saveState(state);
  }, [state]);

  const selectedSpecies =
    SPECIES.find((s) => s.id === state.selectedSpeciesId) ?? SPECIES[0];
  const selectedPot =
    POTS.find((p) => p.id === state.selectedPotId) ?? POTS[2];

  const selectSpecies = useCallback(
    (id: string) => {
      if (id === state.selectedSpeciesId) return;
      setImageVisible(false);
      setTimeout(() => {
        setState((prev) => ({ ...prev, selectedSpeciesId: id }));
        setImageVisible(true);
      }, 350);
    },
    [state.selectedSpeciesId]
  );

  const selectPot = useCallback((id: string) => {
    setState((prev) => ({ ...prev, selectedPotId: id }));
  }, []);

  const isCoolingDown = useCallback(
    (actionId: CareAction) => {
      const expires = state.cooldowns[actionId] ?? 0;
      return now < expires;
    },
    [state.cooldowns, now]
  );

  const cooldownRemaining = useCallback(
    (actionId: CareAction): number => {
      const expires = state.cooldowns[actionId] ?? 0;
      return Math.max(0, expires - now);
    },
    [state.cooldowns, now]
  );

  const cooldownProgress = useCallback(
    (actionId: CareAction): number => {
      const action = CARE_ACTIONS.find((a) => a.id === actionId);
      if (!action) return 0;
      const expires = state.cooldowns[actionId] ?? 0;
      const remaining = Math.max(0, expires - now);
      return remaining / action.cooldownMs;
    },
    [state.cooldowns, now]
  );

  const performAction = useCallback(
    (actionId: CareAction, triggerX: number, triggerY: number) => {
      if (isCoolingDown(actionId)) return;
      const action = CARE_ACTIONS.find((a) => a.id === actionId);
      if (!action) return;

      const expiresAt = Date.now() + action.cooldownMs;

      setState((prev) => ({
        ...prev,
        growthPoints: prev.growthPoints + action.pointsGained,
        cooldowns: { ...prev.cooldowns, [actionId]: expiresAt },
        lastWatered: actionId === "water" ? Date.now() : prev.lastWatered,
      }));

      // Spawn floating point indicator
      const floaterId = `${actionId}-${Date.now()}`;
      setFloaters((prev) => [
        ...prev,
        { id: floaterId, value: action.pointsGained, x: triggerX, y: triggerY },
      ]);
      setTimeout(() => {
        setFloaters((prev) => prev.filter((f) => f.id !== floaterId));
      }, 1300);
    },
    [isCoolingDown]
  );

  const formatCooldown = useCallback(
    (actionId: CareAction): string => {
      const ms = cooldownRemaining(actionId);
      if (ms <= 0) return "";
      const totalSec = Math.ceil(ms / 1000);
      const h = Math.floor(totalSec / 3600);
      const m = Math.floor((totalSec % 3600) / 60);
      const s = totalSec % 60;
      if (h > 0) return `${h}h ${m}m`;
      if (m > 0) return `${m}m ${s}s`;
      return `${s}s`;
    },
    [cooldownRemaining]
  );

  return {
    state,
    selectedSpecies,
    selectedPot,
    selectSpecies,
    selectPot,
    isCoolingDown,
    cooldownRemaining,
    cooldownProgress,
    performAction,
    formatCooldown,
    floaters,
    imageVisible,
    now,
  };
}
