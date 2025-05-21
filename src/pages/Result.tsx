import React, { useContext, useEffect, useRef, useState, useCallback } from "react";
import { imageContext } from "../Context/ImageContext";
import { SketchPicker } from "react-color";

// Layout info (import or define somewhere)
export interface LayoutInfo {
  count: number;
  description: string;
  layout: number[][];
  type: "Grid" | "Strip" | "Other";
}

export const layoutInfos: LayoutInfo[] = [
  { count: 2, description: "2 Photos", layout: [[1], [1]], type: "Strip" },
  { count: 3, description: "3 Photos", layout: [[1], [1], [1]], type: "Strip" },
  { count: 4, description: "4 Photos (Strip)", layout: [[1], [1], [1], [1]], type: "Strip" },
  { count: 4, description: "4 Photos", layout: [[1, 1], [1, 1]], type: "Grid" },
  { count: 6, description: "6 Photos", layout: [[1, 1], [1, 1], [1, 1]], type: "Grid" },
  { count: 9, description: "9 Photos", layout: [[1, 1, 1], [1, 1, 1], [1, 1, 1]], type: "Grid" },
];

type Sticker = {
  id: string;
  imgSrc: string;
  x: number;
  y: number;
  width: number;
  height: number;
};

const predefinedColors = ["#ffffff", "#f8f8f8", "#ffcccc", "#ccffcc", "#ccccff"];

// Hook implementation inline
const useDownloadCollage = () => {
  const preloadImage = (src: string): Promise<HTMLImageElement> =>
    new Promise((resolve, reject) => {
      const img = new Image();
      img.crossOrigin = "anonymous";
      img.onload = () => resolve(img);
      img.onerror = (e) => reject(e);
      img.src = src;
    });

  const download = useCallback(
    async (
      data: { imgSrc: string; filter?: string }[],
      layout: number[][],
      imageSize: number,
      padding: number,
      bgColor: string,
      filter: string,
      stickers: Sticker[],
      caption: string,
      fontColor: string
    ) => {
      const rows = layout.length;
      const maxCols = Math.max(...layout.map((row) => row.length));
      const canvasWidth = maxCols * imageSize + (maxCols + 1) * padding;
      const canvasHeight = rows * imageSize + (rows + 1) * padding + 30;

      const canvas = document.createElement("canvas");
      canvas.width = canvasWidth;
      canvas.height = canvasHeight;
      const ctx = canvas.getContext("2d");
      if (!ctx) return;

      ctx.fillStyle = bgColor;
      ctx.fillRect(0, 0, canvasWidth, canvasHeight);

      try {
        const images = await Promise.all(
          data.slice(0, layout.flat().reduce((a, b) => a + b, 0)).map((d) => preloadImage(d.imgSrc))
        );

        let imgIndex = 0;
        for (let row = 0; row < rows; row++) {
          for (let col = 0; col < layout[row].length; col++) {
            if (layout[row][col] === 1 && imgIndex < images.length) {
              const x = padding + col * (imageSize + padding);
              const y = padding + row * (imageSize + padding);

              ctx.filter = data[imgIndex].filter || filter || "none";
              ctx.drawImage(images[imgIndex], x, y, imageSize, imageSize);
              imgIndex++;
            }
          }
        }

        // Draw stickers
        for (const sticker of stickers) {
          const stickerImg = await preloadImage(sticker.imgSrc);
          ctx.filter = "none";
          ctx.drawImage(stickerImg, sticker.x, sticker.y, sticker.width, sticker.height);
        }

        ctx.font = "16px sans-serif";
        ctx.fillStyle = fontColor;
        ctx.textAlign = "center";
        ctx.fillText(caption, canvasWidth / 2, canvasHeight - 10);

        const url = canvas.toDataURL("image/png");
        const link = document.createElement("a");
        link.href = url;
        link.download = "collage.png";
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      } catch (e) {
        console.error("Error downloading collage", e);
      }
    },
    []
  );

  return { download };
};

const Result = () => {
  const context = useContext(imageContext);
  if (!context) throw new Error("Must be used within ImageContextProvider");
  const { data } = context;
  if (!data) throw new Error("No image data");

  const canvasRef = useRef<HTMLCanvasElement>(null);
  const { download } = useDownloadCollage();

  const [bgColor, setBgColor] = useState("#ffffff");
  const [fontColor, setFontColor] = useState("#333");
  const [filter, setFilter] = useState("none");
  const [imageSize, setImageSize] = useState(150);
  const [padding, setPadding] = useState(15);
  const [stickers, setStickers] = useState<Sticker[]>([]);
  const [selectedStickerId, setSelectedStickerId] = useState<string | null>(null);
  const selectedSticker = stickers.find((s) => s.id === selectedStickerId);

  const selectedLayout = React.useMemo(() => {
    return layoutInfos.find((l) => l.count >= data.length) || layoutInfos[layoutInfos.length - 1];
  }, [data.length]);

  const preloadImage = (src: string): Promise<HTMLImageElement> =>
    new Promise((resolve, reject) => {
      const img = new Image();
      img.crossOrigin = "anonymous";
      img.onload = () => resolve(img);
      img.onerror = (e) => reject(e);
      img.src = src;
    });

  useEffect(() => {
    if (!canvasRef.current || !data.length) return;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const layout = selectedLayout.layout;
    const rows = layout.length;
    const maxCols = Math.max(...layout.map((row) => row.length));

    const canvasWidth = maxCols * imageSize + (maxCols + 1) * padding;
    const canvasHeight = rows * imageSize + (rows + 1) * padding + 30;

    canvas.width = canvasWidth;
    canvas.height = canvasHeight;

    ctx.clearRect(0, 0, canvasWidth, canvasHeight);
    ctx.fillStyle = bgColor;
    ctx.fillRect(0, 0, canvasWidth, canvasHeight);

    (async () => {
      try {
        const images = await Promise.all(
          data.slice(0, layout.flat().reduce((a, b) => a + b, 0)).map((imgData) => preloadImage(imgData.imgSrc))
        );

        let imgIndex = 0;
        for (let row = 0; row < rows; row++) {
          for (let col = 0; col < layout[row].length; col++) {
            if (layout[row][col] === 1 && imgIndex < images.length) {
              const x = padding + col * (imageSize + padding);
              const y = padding + row * (imageSize + padding);

              ctx.filter = data[imgIndex].filter || filter || "none";
              ctx.drawImage(images[imgIndex], x, y, imageSize, imageSize);
              imgIndex++;
            }
          }
        }

        for (const sticker of stickers) {
          const stickerImg = await preloadImage(sticker.imgSrc);
          ctx.filter = "none";
          ctx.drawImage(stickerImg, sticker.x, sticker.y, sticker.width, sticker.height);
        }

        ctx.font = "16px sans-serif";
        ctx.fillStyle = fontColor;
        ctx.textAlign = "center";
        ctx.fillText("スナップチャーム", canvasWidth / 2, canvasHeight - 10);
      } catch (e) {
        console.error("Error loading images", e);
      }
    })();
  }, [data, selectedLayout, imageSize, padding, bgColor, filter, fontColor, stickers]);

  const handleDownload = () => {
    const normalizedData = data.map(({ imgSrc, filter }) => ({
      imgSrc,
      filter: filter === null ? undefined : filter,
    }));
  
    download(
      normalizedData,
      selectedLayout.layout,
      imageSize,
      padding,
      bgColor,
      filter,
      stickers,
      "スナップチャーム",
      fontColor
    );
  };
  

  const handleStickerUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (!event.target.files || event.target.files.length === 0) return;
    const file = event.target.files[0];
    const reader = new FileReader();
    reader.onload = (ev) => {
      const imgSrc = ev.target?.result as string;
      setStickers((prev) => [
        ...prev,
        {
          id: Math.random().toString(36).substring(2, 9),
          imgSrc,
          x: 50,
          y: 50,
          width: 100,
          height: 100,
        },
      ]);
    };
    reader.readAsDataURL(file);
    event.target.value = "";
  };

  return (
    <div className="flex flex-col lg:flex-row gap-6 p-4 max-w-7xl mx-auto">
      {/* Canvas */}
      <div
        className="relative border rounded shadow-md p-4"
        style={{ maxWidth: 700, flexShrink: 0 }}
      >
        <canvas
          ref={canvasRef}
          style={{
            backgroundColor: bgColor,
            display: "block",
            width: "100%",
            height: "auto",
            boxSizing: "border-box",
          }}
        />
      </div>

      {/* Controls */}
      <div className="flex flex-col gap-4 w-full max-w-xs">
        {/* Background Color */}
        <div>
          <h3 className="font-semibold mb-2">Background Color</h3>
          <div className="flex gap-2 mb-2">
            {predefinedColors.map((color) => (
              <button
                key={color}
                className={`w-6 h-6 rounded ${
                  bgColor === color ? "ring-2 ring-pink-500" : ""
                }`}
                style={{ backgroundColor: color }}
                onClick={() => setBgColor(color)}
              />
            ))}
          </div>
          <SketchPicker color={bgColor} onChange={(color) => setBgColor(color.hex)} />
        </div>

        {/* Filter */}
        <div>
          <h3 className="font-semibold mb-2">Image Filter</h3>
          <select
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className="border rounded p-1 w-full"
          >
            <option value="none">None</option>
            <option value="grayscale(1)">Grayscale</option>
            <option value="sepia(1)">Sepia</option>
            <option value="contrast(1.5)">High Contrast</option>
            <option value="brightness(1.2)">Brighten</option>
          </select>
        </div>

        {/* Layout Info */}
        <div>
          <h3 className="font-semibold mb-2">Layout</h3>
          <p>{selectedLayout.description}</p>
          <label className="block mt-2">Image Size</label>
          <input
            type="range"
            min={50}
            max={300}
            value={imageSize}
            onChange={(e) => setImageSize(Number(e.target.value))}
          />

          <label className="block mt-2">Padding</label>
          <input
            type="range"
            min={5}
            max={50}
            value={padding}
            onChange={(e) => setPadding(Number(e.target.value))}
          />
        </div>

        {/* Sticker Upload */}
        <div>
          <h3 className="font-semibold mb-2">Upload Sticker</h3>
          <input type="file" accept="image/*" onChange={handleStickerUpload} />
        </div>

        {/* Resize selected sticker */}
        {selectedSticker && (
          <div>
            <label className="block font-semibold">Resize Sticker</label>
            <input
              type="range"
              min={20}
              max={300}
              value={selectedSticker.width}
              onChange={(e) => {
                const val = Number(e.target.value);
                setStickers((prev) =>
                  prev.map((s) =>
                    s.id === selectedStickerId ? { ...s, width: val, height: val } : s
                  )
                );
              }}
            />
          </div>
        )}

        {/* Caption Color */}
        <div>
          <h3 className="font-semibold mb-2">Caption Color</h3>
          <SketchPicker color={fontColor} onChange={(color) => setFontColor(color.hex)} />
        </div>

        {/* Download Button */}
        <button
          onClick={handleDownload}
          className="mt-4 bg-pink-600 text-white py-2 rounded"
        >
          Download Collage
        </button>
      </div>

      {/* Sticker Strip */}
      <div className="flex flex-col gap-2 max-h-[600px] overflow-auto">
        {stickers.map((sticker) => (
          <div
            key={sticker.id}
            onClick={() => setSelectedStickerId(sticker.id)}
            className={`w-20 h-20 cursor-pointer border ${
              selectedStickerId === sticker.id ? "border-pink-500" : "border-gray-300"
            }`}
          >
            <img
              src={sticker.imgSrc}
              alt="Sticker"
              className="w-full h-full object-contain"
              draggable={false}
            />
          </div>
        ))}
      </div>
    </div>
  );
};

export default Result;
