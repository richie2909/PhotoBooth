// components/DynamicGridLayout.tsx

import React from "react";
import { layoutByImageCount } from "./layoutByImageCount";

interface DynamicGridLayoutProps {
  images: string[];
  size: number;
  padding: number;
  columns?: number;
  bgColor?: string;
  fontFamily?: string;
  label?: string;
}

const DynamicGridLayout: React.FC<DynamicGridLayoutProps> = ({
  images,
  size,
  padding,
  columns,
  bgColor = "white",
  fontFamily = "Noto Sans JP",
  label = "スナップチャーム",
}) => {
  const imgCount = images.length;
  const layout = layoutByImageCount[imgCount] || { columns: 3 };
  const cols = columns || layout.columns;

  const gridStyle: React.CSSProperties = {
    display: "grid",
    gridTemplateColumns: `repeat(${cols}, minmax(0, 1fr))`,
    gap: `${padding}px`,
    backgroundColor: bgColor,
    padding,
  };

  return (
    <div>
      <div style={gridStyle}>
        {images.map((src, i) => (
          <img
            key={i}
            src={src}
            alt={`img-${i}`}
            style={{ width: size, height: size, objectFit: "cover" }}
          />
        ))}
      </div>
      <div
        className="text-xs font-bold text-center py-2"
        style={{ fontFamily }}
      >
        {label}
      </div>
    </div>
  );
};

export default DynamicGridLayout;
