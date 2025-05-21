import type { LayoutInfo } from "./layoutInfos";

// --- Props include type now ---
type LayoutPreviewProps = {
  layout: number[][];
  type: LayoutInfo["type"];
};

export const LayoutPreview: React.FC<LayoutPreviewProps> = ({ layout, type }) => {
  const rowCount = layout.length;
  const colCount = layout[0]?.length || 0;

  if (rowCount === 0 || colCount === 0) {
    return <div>No layout to preview</div>;
  }

  const isStrip = type === "Strip";

  return (
    <div className="flex flex-col scale-45 items-center px-2" style={{ position: "relative" }}>
      <div
        style={{
          display: "grid",
          gridTemplateRows: `repeat(${rowCount}, 24px)`,
          gridTemplateColumns: isStrip
            ? `repeat(1, 1fr)`
            : `repeat(${colCount}, 24px)`,
          gap: "4px",
          border: "1px solid #ddd",
          padding: 8,
          paddingBottom: 16, // half padding bottom
          borderRadius: 6,
          backgroundColor: "#fff",
          minWidth: isStrip
            ? undefined
            : `${colCount * 24 + (colCount - 1) * 4 + 16 - 24}px`, // reduced by 24px
          boxShadow: "0 2px 6px rgba(0,0,0,0.1)",
          boxSizing: "border-box",
          position: "relative",
        }}
        role="grid"
        aria-label="Layout preview"
      >
        {layout.flatMap((row, rowIndex) =>
          row.map((cell, cellIndex) => (
            <div
              key={`${rowIndex}-${cellIndex}`}
              role="gridcell"
              style={{
                width: 24,
                height: 24,
                borderRadius: 4,
                backgroundColor: cell === 1 ? "#f9c1d9" : "transparent",
              }}
            />
          ))
        )}
<span
  className="scale-50"
  style={{
    position: "absolute",
    bottom: 4,
    left: 0,
    right: 0,
    fontSize: 7,
    color: "#555",
    textAlign: "center",
    fontWeight: 500,
    userSelect: "none",
    pointerEvents: "none",
    whiteSpace: "nowrap",
    overflow: "hidden",
    lineHeight: 1.1,
  }}
>
  スナップチャーム
</span>


      </div>
    </div>
  );
};
