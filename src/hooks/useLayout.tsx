import React from "react";

interface DynamicGridLayoutProps {
  images: string[]; // array of image URLs
  columns: number;
  size: number; // width/height in px
  padding: number;
  bgColor?: string;
  fontFamily?: string;
  label?: string;
}

const DynamicGridLayout: React.FC<DynamicGridLayoutProps> = ({
  images,
  columns,
  size,
  padding,
  bgColor = "white",
  fontFamily = "Noto Sans JP",
  label = "スナップチャーム",
}) => {
  const rows = Math.ceil(images.length / columns);

  const gridStyle: React.CSSProperties = {
    display: "grid",
    gridTemplateColumns: `repeat(${columns}, minmax(0, 1fr))`,
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
