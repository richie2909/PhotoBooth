// utils/layoutPresets.ts

export interface SmartLayoutConfig {
  columns: number;
  rows?: number; // optional; we calculate it
}

// Map number of images to grid layout
export const layoutByImageCount: Record<number, SmartLayoutConfig> = {
  1: { columns: 1 },
  2: { columns: 2 },
  3: { columns: 1 },
  4: { columns: 2 },
  5: { columns: 3 },
  6: { columns: 3 },
  7: { columns: 3 },
  8: { columns: 4 },
  9: { columns: 3 },
};
