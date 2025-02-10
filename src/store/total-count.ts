import { create } from "zustand";

interface TotalCountState {
  total: number;
  setTotal: (count: number) => void;
  increaseTotal: () => void;
  decreaseTotal: () => void;
}

export const useTotalCount = create<TotalCountState>((set) => ({
  total: 1,
  setTotal: (count) => set({ total: count }),
  increaseTotal: () => set((state) => ({ total: state.total + 1 })),
  decreaseTotal: () => set((state) => ({ total: state.total - 1 })),
}));
