import { create } from "zustand";

interface CanvasState {
  position: { x: number; y: number };
  size: { width: number; height: number };
  scale: number;

  // actions
  setPosition: (pos: { x: number; y: number }) => void;
  moveBy: (dx: number, dy: number) => void;

  setSize: (size: { width: number; height: number }) => void;

  setScale: (scale: number) => void;
  zoomIn: () => void;
  zoomOut: () => void;
  resetZoom: () => void;
}

const MIN_SCALE = 0.5;
const MAX_SCALE = 2.0;
const SCALE_STEP = 0.1;

export const useCanvasStore = create<CanvasState>((set, get) => ({
  position: { x: 0, y: 0 },
  size: { width: 375, height: 812 },
  scale: 1,

  setPosition: (pos) => set({ position: pos }),
  moveBy: (dx, dy) =>
    set((state) => ({
      position: {
        x: state.position.x + dx,
        y: state.position.y + dy,
      },
    })),

  setSize: (size) => set({ size }),

  setScale: (newScale) =>
    set({ scale: Math.max(MIN_SCALE, Math.min(MAX_SCALE, newScale)) }),

  zoomIn: () => {
    const newScale = Math.min(get().scale + SCALE_STEP, MAX_SCALE);
    set({ scale: newScale });
  },

  zoomOut: () => {
    const newScale = Math.max(get().scale - SCALE_STEP, MIN_SCALE);
    set({ scale: newScale });
  },

  resetZoom: () => set({ scale: 1 }),
}));
