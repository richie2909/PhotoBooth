export interface LayoutInfo {
  count: number;
  description: string;
  layout: number[][];
  type: "Grid" | "Strip" | "Other"; // Optional
}

export const layoutInfos: LayoutInfo[] = [
  {
    count: 2,
    description: "2 Photos",
    layout: [
      [1],
      [1],
    ],
    type: "Strip",
  },
  {
    count: 3,
    description: "3 Photos",
    layout: [
      [1],
      [1],
      [1],
    ],
    type: "Strip",
  },
  {
    count: 4,
    description: "4 Photos (Strip)",
    layout: [
      [1],
      [1],
      [1],
      [1],
    ],
    type: "Strip",
  },
  {
    count: 4,
    description: "4 Photos",
    layout: [
      [1, 1],
      [1, 1],
    ],
    type: "Grid",
  },

  {
    count: 6,
    description: "6 Photos",
    layout: [
      [1, 1],
      [1, 1],
      [1, 1],
    ],
    type: "Grid",
  },

  {
    count: 9,
    description: "9 Photos",
    layout: [
      [1, 1, 1],
      [1, 1, 1],
      [1, 1, 1],
    ],
    type: "Grid",
  },
];
