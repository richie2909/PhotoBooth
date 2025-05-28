import React, { useContext, useEffect, useRef, useState } from "react";
import { imageContext } from "../Context/ImageContext";
import { ChromePicker } from "react-color";
import { layoutInfos } from "../components/layoutInfos";
import { useDownloadCollage } from "../hooks/useDownloadCollage";
import { useLocalStorage } from "../hooks/useLocalStorage";
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
  const [imageSize, setImageSize] = useState(150);
  const [padding] = useState(10);

  const [stickers, setStickers] = useLocalStorage<Sticker[]>("photoBoothStickers", []);
  const [selectedStickerId, setSelectedStickerId] = useState<string | null>(null);

  const selectedLayout = React.useMemo(() => {
    return layoutInfos.find((l) => l.count >= data.length) || layoutInfos[layoutInfos.length - 1];
  }, [data.length]);

  // Load images helper
  const preloadImage = (src: string): Promise<HTMLImageElement> =>
    new Promise((resolve, reject) => {
      const img = new Image();
      img.crossOrigin = "anonymous";
      img.onload = () => resolve(img);
      img.onerror = (e) => reject(e);
      img.src = src;
    });

  // Render images + stickers on canvas
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

    ctx.setTransform(1, 0, 0, 1, 0, 0);
    ctx.scale(dpr, dpr);

    ctx.clearRect(0, 0, canvasWidth, canvasHeight);
    ctx.fillStyle = bgColor;
    ctx.fillRect(0, 0, canvasWidth, canvasHeight);
    ctx.imageSmoothingEnabled = true;
    ctx.imageSmoothingQuality = "high";

    (async () => {
      try {
        const maxImages = layout.flat().reduce((a, b) => a + b, 0);
        const images = await Promise.all(
          data.slice(0, maxImages).map((imgData) => preloadImage(imgData.imgSrc))
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

        // Draw stickers on canvas (final export)
        for (const sticker of stickers) {
          const stickerImg = await preloadImage(sticker.imgSrc);
          ctx.filter = "none";
          ctx.drawImage(stickerImg, sticker.x, sticker.y, sticker.width, sticker.height);
        }

        // Caption text
        ctx.font = "16px sans-serif";
        ctx.fillStyle = fontColor;
        ctx.textAlign = "center";
        ctx.fillText("スナップチャーム", canvasWidth / 2, canvasHeight - 10);
      } catch (e) {
        console.error("Error loading images", e);
      }
    })();
  }, [data, selectedLayout, imageSize, padding, bgColor, filter, fontColor, stickers]);

  // Sticker drag handlers
  const dragData = useRef<{ id: string; offsetX: number; offsetY: number } | null>(null);

  const onMouseDown = (e: React.MouseEvent<HTMLDivElement>, stickerId: string) => {
    const target = e.currentTarget;
    const rect = target.getBoundingClientRect();
    dragData.current = {
      id: stickerId,
      offsetX: e.clientX - rect.left,
      offsetY: e.clientY - rect.top,
    };
    setSelectedStickerId(stickerId);
    e.preventDefault();
  };

  const onMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!dragData.current) return;
    const { id, offsetX, offsetY } = dragData.current;
    const container = canvasRef.current?.parentElement;
    if (!container) return;

    const containerRect = container.getBoundingClientRect();
    let newX = e.clientX - containerRect.left - offsetX;
    let newY = e.clientY - containerRect.top - offsetY;

    // Clamp position so sticker stays within canvas area
    newX = Math.max(0, Math.min(newX, containerRect.width));
    newY = Math.max(0, Math.min(newY, containerRect.height));

    setStickers((prev) =>
      prev.map((s) => (s.id === id ? { ...s, x: newX, y: newY } : s))
    );
  };

  const onMouseUp = () => {
    dragData.current = null;
  };

  // Touch equivalents for mobile
  const onTouchStart = (e: React.TouchEvent<HTMLDivElement>, stickerId: string) => {
    const target = e.currentTarget;
    const rect = target.getBoundingClientRect();
    const touch = e.touches[0];
    dragData.current = {
      id: stickerId,
      offsetX: touch.clientX - rect.left,
      offsetY: touch.clientY - rect.top,
    };
    setSelectedStickerId(stickerId);
    e.preventDefault();
  };

  const onTouchMove = (e: React.TouchEvent<HTMLDivElement>) => {
    if (!dragData.current) return;
    const { id, offsetX, offsetY } = dragData.current;
    const container = canvasRef.current?.parentElement;
    if (!container) return;

    const containerRect = container.getBoundingClientRect();
    const touch = e.touches[0];
    let newX = touch.clientX - containerRect.left - offsetX;
    let newY = touch.clientY - containerRect.top - offsetY;

    newX = Math.max(0, Math.min(newX, containerRect.width));
    newY = Math.max(0, Math.min(newY, containerRect.height));

    setStickers((prev) =>
      prev.map((s) => (s.id === id ? { ...s, x: newX, y: newY } : s))
    );
  };

  const onTouchEnd = () => {
    dragData.current = null;
  };

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
    <div>
      <Navigation />
      <div className="max-w-6xl mx-auto p-4 flex justify-center items-start mt-5 gap-6">
        {/* Canvas container with relative positioning to overlay stickers */}
        <div className="relative w-full lg:w-1/2 border border-gray-300 rounded-xl shadow-lg">
          {data && (
            <>
              <canvas
                ref={canvasRef}
                className="w-full h-auto rounded-xl"
                style={{ backgroundColor: bgColor }}
              />
              {/* Draggable stickers overlay */}
              {stickers.map((sticker) => (
                <div
                  key={sticker.id}
                  onMouseDown={(e) => onMouseDown(e, sticker.id)}
                  onMouseMove={onMouseMove}
                  onMouseUp={onMouseUp}
                  onMouseLeave={onMouseUp}
                  onTouchStart={(e) => onTouchStart(e, sticker.id)}
                  onTouchMove={onTouchMove}
                  onTouchEnd={onTouchEnd}
                  style={{
                    position: "absolute",
                    top: sticker.y,
                    left: sticker.x,
                    width: sticker.width,
                    height: sticker.height,
                    cursor: "grab",
                    userSelect: "none",
                    zIndex: selectedStickerId === sticker.id ? 10 : 5,
                    border: selectedStickerId === sticker.id ? "2px solid #ec4899" : "none",
                    borderRadius: 8,
                  }}
                >
                  <img
                    src={sticker.imgSrc}
                    alt="sticker"
                    draggable={false}
                    style={{ width: "100%", height: "100%", objectFit: "contain" }}
                    onDragStart={(e) => e.preventDefault()}
                  />
                </div>
              ))}
            </>
          )}
          {!data && (
            <div className="w-full h-80 flex items-center justify-center text-center rounded-xl shadow-lg border border-gray-300">
              No Image Taken
            </div>
          )}
        </div>

        {/* Controls Section */}
        <div className="w-full lg:w-1/2 grid gap-6">
          {/* Color pickers */}
          <div className="grid grid-cols-2 gap-4 relative">
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
                    type="button"
                  />
                ))}
                <button
                  onClick={() => setShowPicker1(!showPicker1)}
                  className="w-6 h-6 rounded-full border bg-gradient-to-br from-pink-400 via-yellow-300 to-purple-400"
                  type="button"
                />
              </div>
              {showPicker1 && (
                <div className="absolute z-20">
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
                    onClick={() => setFontColor(color)}
                    type="button"
                  />
                ))}
                <button
                  onClick={() => setShowPicker(!showPicker)}
                  className="w-6 h-6 rounded-full border bg-gradient-to-br from-pink-400 via-yellow-300 to-purple-400"
                  type="button"
                />
              </div>
              {showPicker && (
                <div className="absolute z-20">
                  <ChromePicker color={fontColor} onChange={(c) => setFontColor(c.hex)} disableAlpha />
                </div>
              )}
            </div>
          </div>

          {/* Image size slider */}
          <div>
            <label htmlFor="imageSize" className="block font-semibold mb-1">
              Image Size: {imageSize}px
            </label>
            <input
              id="imageSize"
              type="range"
              min={80}
              max={300}
              value={imageSize}
              onChange={(e) => setImageSize(Number(e.target.value))}
              className="w-full"
            />
          </div>

          {/* Sticker upload */}
          <div>
            <label className="block mb-1 font-semibold">Upload Sticker</label>
            <input
              type="file"
              accept="image/*"
              onChange={handleStickerUpload}
              className="block w-full text-sm text-gray-600"
            />
          </div>

          {/* Display stickers with resize */}
          <div>
            <h4 className="font-semibold mb-2">Stickers</h4>
            <div className="flex flex-wrap gap-3 max-h-48 overflow-y-auto border p-2 rounded">
              {stickers.map((sticker) => (
                <div key={sticker.id} className="relative w-20 h-20 border rounded cursor-pointer">
                  <img
                    src={sticker.imgSrc}
                    alt="sticker"
                    className="w-full h-full object-contain"
                    onClick={() => setSelectedStickerId(sticker.id)}
                    draggable={false}
                  />
                  {selectedStickerId === sticker.id && (
                    <div className="absolute bottom-0 left-0 right-0 bg-white bg-opacity-80 p-1 flex items-center justify-center gap-2 rounded-b">
                      <button
                        onClick={() => {
                          setStickers((prev) => prev.filter((s) => s.id !== sticker.id));
                          if (selectedStickerId === sticker.id) setSelectedStickerId(null);
                        }}
                        className="text-red-600 font-bold text-sm"
                        type="button"
                      >
                        ×
                      </button>
                      <input
                        type="range"
                        min={30}
                        max={200}
                        value={sticker.width}
                        onChange={(e) => {
                          const newWidth = Number(e.target.value);
                          setStickers((prev) =>
                            prev.map((s) =>
                              s.id === sticker.id
                                ? { ...s, width: newWidth, height: (s.height / s.width) * newWidth }
                                : s
                            )
                          );
                        }}
                        className="flex-grow"
                      />
                    </div>
                  )}
                </div>
              ))}
              {stickers.length === 0 && <p className="text-gray-400">No stickers uploaded yet</p>}
            </div>
          </div>

          {/* Action buttons */}
          <div className="flex gap-4">
            <Link
              to="/"
              className="bg-pink-400 hover:bg-pink-500 transition text-white px-4 py-2 rounded shadow"
            >
              Take Photos Again
            </Link>
            <button
              onClick={handleDownload}
              className="bg-indigo-600 hover:bg-indigo-700 transition text-white px-4 py-2 rounded shadow"
            >
              Download Collage
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Result;
