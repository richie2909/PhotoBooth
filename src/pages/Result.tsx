import React, { useContext, useEffect, useRef, useState } from "react";
import { imageContext } from "../Context/ImageContext";
import { ChromePicker } from "react-color";
import { layoutInfos } from "../components/layoutInfos";
import { useDownloadCollage } from "../hooks/useDownloadCollage";
import { useLocalStorage } from "../hooks/useLocalStorage";  // <-- import hook
import type { Sticker } from "../hooks/useDownloadCollage";

import Navigation from "../components/Navigation";
import { Link } from "react-router-dom";

const predefinedColors = ["#ffffff", "#f8f8f8", "#ffcccc", "#ccffcc", "#ccccff"];

const Result = () => {
  const [showPicker, setShowPicker] = useState(false);
  const [showPicker1, setShowPicker1] = useState(false);

  const context = useContext(imageContext);
  if (!context) throw new Error("Must be used within ImageContextProvider");
  const { data } = context;
  if (!data) throw new Error("No image data");

  const canvasRef = useRef<HTMLCanvasElement>(null);
  const { download } = useDownloadCollage();

  const [bgColor, setBgColor] = useState("#ffffff");
  const [fontColor, setFontColor] = useState("#333");
  const [filter] = useState("none");
  const [imageSize, setImageSize] = useState(200);
  const [padding] = useState(10);

  // Use localStorage hook here for stickers state persistence
  const [stickers, setStickers] = useLocalStorage<Sticker[]>("photoBoothStickers", []);
  const [selectedStickerId] = useState<string | null>(null);
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

    const dpr = window.devicePixelRatio || 1;
    canvas.width = canvasWidth * dpr;
    canvas.height = canvasHeight * dpr;
    canvas.style.width = `${canvasWidth}px`;
    canvas.style.height = `${canvasHeight}px`;
    ctx.scale(dpr, dpr);

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
    <div className="">
      <Navigation />
      <div className="max-w-6xl mx-auto p-4 flex justify-center items-center m-50 mt-5 flex-col lg:flex-row gap-6">
        <div className="w-full lg:w-1/2">
          {data && (
            <canvas
              ref={canvasRef}
              className="w-full h-auto rounded-xl shadow-lg border border-gray-300"
              style={{ backgroundColor: bgColor }}
            />
          )}

          {!data && (
            <div className="w-full h-auto text-center rounded-xl shadow-lg border border-gray-300">
              No Image Taken
            </div>
          )}
        </div>

        {/* Controls Section */}
        <div className="w-full lg:w-1/2 grid gap-6">
          {/* Color pickers */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <h4 className="font-semibold text-sm mb-1">Background Color</h4>
              <div className="flex flex-wrap gap-2 items-center">
                {predefinedColors.map((color) => (
                  <button
                    key={color}
                    className={`w-6 h-6 rounded-full border transition-all duration-200 ${
                      bgColor === color ? "ring-2 ring-pink-500 scale-110" : ""
                    }`}
                    style={{ backgroundColor: color }}
                    onClick={() => setBgColor(color)}
                  />
                ))}
                <button
                  onClick={() => setShowPicker1(!showPicker1)}
                  className="w-6 h-6 rounded-full border bg-gradient-to-br from-pink-400 via-yellow-300 to-purple-400"
                />
              </div>
              {showPicker1 && (
                <div className="absolute">
                  <ChromePicker color={bgColor} onChange={(c) => setBgColor(c.hex)} disableAlpha />
                </div>
              )}
            </div>

            <div>
              <h4 className="font-semibold text-sm mb-1">Caption Color</h4>
              <div className="flex flex-wrap gap-2 items-center">
                {predefinedColors.map((color) => (
                  <button
                    key={color}
                    className={`w-6 h-6 rounded-full border transition-all duration-200 ${
                      fontColor === color ? "ring-2 ring-pink-500 scale-110" : ""
                    }`}
                    style={{ backgroundColor: color }}
                    onFocus={() => setFontColor(color)}
                  />
                ))}
                <button
                  onFocus={() => setShowPicker(!showPicker)}
                  className="w-6 h-6 rounded-full border bg-gradient-to-br from-pink-400 via-yellow-300 to-purple-400"
                />
              </div>
              {showPicker && (
                <div className="absolute">
                  <ChromePicker color={fontColor} onChange={(c) => setFontColor(c.hex)} disableAlpha />
                </div>
              )}
            </div>
          </div>

          {/* Image size */}
          <div>
            <label className="block font-semibold text-sm mb-1">Image Size</label>
            <div className="flex items-center gap-2">
              <button onClick={() => setImageSize((s) => Math.max(50, s - 10))} className="px-3 py-1 bg-gray-200 rounded text-lg">
                −
              </button>
              <input
                type="number"
                className="w-16 text-center border rounded"
                value={imageSize}
                min={50}
                max={300}
                onChange={(e) => setImageSize(Number(e.target.value))}
              />
              <button onClick={() => setImageSize((s) => Math.min(300, s + 10))} className="px-3 py-1 bg-gray-200 rounded text-lg">
                +
              </button>
              <span className="text-sm text-gray-600">px</span>
            </div>
          </div>

          {/* Sticker upload */}
          <div>
            <h4 className="font-semibold text-sm mb-1">Upload Sticker</h4>
            <input type="file" accept="image/*" onChange={handleStickerUpload} className="block w-full text-sm" />
          </div>

          {/* Sticker resize slider */}
          {selectedSticker && (
            <div>
              <label className="block font-semibold text-sm mb-1">Resize Sticker</label>
              <input
                type="range"
                min={20}
                max={300}
                value={selectedSticker.width}
                onChange={(e) => {
                  const val = Number(e.target.value);
                  setStickers((prev) =>
                    prev.map((s) => (s.id === selectedStickerId ? { ...s, width: val, height: val } : s))
                  );
                }}
                className="w-full"
              />
            </div>
          )}

          <div className="flex gap-5">
           <button
            onClick={handleDownload}
            className=" mt-4 duration-300 ease-in-out w-full py-2 text-center  bg-pink-500 text-white rounded-xl hover:bg-purple-600 transition"
          >
            Download Collage
          </button>

          <Link to="/booth" className="mt-4 duration-300 ease-in-out w-full py-2 text-center  bg-pink-500 text-white rounded-xl hover:bg-purple-600 transition">
            retake
          </Link>
          </div>

      
        </div>
      </div>
    </div>
  );
};

export default Result;
