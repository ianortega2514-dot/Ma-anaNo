import { create } from "zustand";
import { persist } from "zustand/middleware";

export type SavedCase = {
  id: string;
  tramiteId: string;
  answers: Record<string, string>;
  have: Record<string, boolean>;
  savedAt: number;
};

type DeskState = {
  cases: SavedCase[];
  saveCase: (snap: SavedCase) => void;
  removeCase: (id: string) => void;
};

export const useDesk = create<DeskState>()(
  persist(
    (set) => ({
      cases: [],
      saveCase: (snap) =>
        set((state) => ({
          cases: [snap, ...state.cases.filter((item) => item.tramiteId !== snap.tramiteId)].slice(0, 12),
        })),
      removeCase: (id) => set((state) => ({ cases: state.cases.filter((item) => item.id !== id) })),
    }),
    { name: "mananano-desk", skipHydration: true },
  ),
);
