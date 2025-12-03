import React, { useContext, useEffect, useRef, useState } from "react";
import { handleStickerUpload } from "../utils/stickerHelpFunction";
import { imageContext } from "../Context/ImageContext";

import { onResizeHandleDown } from "../utils/stickerHelpFunction";
import {onStickerSelect} from  "../utils/stickerHelpFunction"
import { ChromePicker } from "react-color";
import { layoutInfos } from "../components/layoutInfos";

import type { Sticker } from "../hooks/useDownloadCollage";

import Navigation from "../components/Navigation";
import ActionButton from "../components/ActionButton";
import StickerUpload from "../components/StickerUpload";
import Caption from "../components/Caption";

const predefinedColors = ["#ffffff", "#f8f8f8", "#ffcccc", "#ccffcc", "#ccccff"];

const Result = () => {
  const [showPicker, setShowPicker] = useState(false);
  const [showPicker1, setShowPicker1] = useState(false);
  const [selectedLanguage, setSelectedLanguage] = useState<'en' | 'ja' | 'ko'>('ja');

  const captions = {
    en: "SnapCharm ",
    ja: "スナップチャーム",
    ko: "스냅참 "
  };

  const context = useContext(imageContext);
  if (!context) throw new Error("Must be used within ImageContextProvider");
  const { data } = context;
  if (!data) throw new Error("No image data");

  const canvasRef = useRef<HTMLCanvasElement>(null)/*  */;
  const [bgColor, setBgColor] = useState("#ffffff");
  const [fontColor, setFontColor] = useState("#333");
  const [filter] = useState("none");
  const imageSize = 160; // Fixed size
  const [padding] = useState(10); 

  const [stickers, setStickers] = useState<Sticker[]>([]);
  const [selectedStickerId, setSelectedStickerId] = useState<string | null>(null);
  const [resizeData, setResizeData] = useState<{
    id: string;
    pos: string;
    startX: number;
    startY: number;
    startWidth: number;
    startHeight: number;
  } | null>(null);
  const [isMoving, setIsMoving] = useState(false);
  const [activeSticker, setActiveSticker] = useState<{ id: string; offsetX: number; offsetY: number } | null>(null);
  const [resizeStickerId, setResizeStickerId] = useState<string | null>(null);
  console.log(resizeStickerId)
  // Optimize sticker movement with requestAnimationFrame
  const animationFrameRef = useRef<number | undefined>(undefined);
  const containerRef = useRef<HTMLDivElement>(null);
  const lastRenderTime = useRef<number>(0);
  const RENDER_THROTTLE_MS = 16; // ~60fps

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


  // Add a ref for the controls area to help with outside click detection
  const controlsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent | TouchEvent) => {
      // Ignore if clicking inside color pickers or controls
      const pickerElements = document.querySelectorAll('.chrome-picker');
      const clickedInsidePicker = Array.from(pickerElements).some(el => el.contains(e.target as Node));
      if (clickedInsidePicker) return;
      if (controlsRef.current && controlsRef.current.contains(e.target as Node)) return;
      // Ignore if clicking a sticker
      const stickerEls = document.querySelectorAll('.sticker-draggable');
      const clickedSticker = Array.from(stickerEls).some(el => el.contains(e.target as Node));
      if (clickedSticker) return;
      setSelectedStickerId(null);
      setResizeStickerId(null);
    };
    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('touchstart', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('touchstart', handleClickOutside);
    };
  }, []);

  // Render images + stickers on canvas
  useEffect(() => {
    if (!canvasRef.current || !data.length) return;
    renderCanvas();
  }, [data, selectedLayout, imageSize, padding, bgColor, filter, fontColor, stickers, selectedLanguage]);

  const renderCanvas = () => {
    if (!canvasRef.current || !data.length) return;
    
    const now = performance.now();
    if (now - lastRenderTime.current < RENDER_THROTTLE_MS) {
      return;
    }
    lastRenderTime.current = now;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d', { alpha: false });
    if (!ctx) return;

    const layout = selectedLayout.layout;
    const rows = layout.length;
    const maxCols = Math.max(...layout.map((row) => row.length));

    const canvasWidth = maxCols * imageSize + (maxCols + 1) * padding;
    const canvasHeight = rows * imageSize + (rows + 1) * padding + 40;

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

        // Draw stickers
        for (const sticker of stickers) {
          const stickerImg = await preloadImage(sticker.imgSrc);
          ctx.filter = "none";
          ctx.drawImage(stickerImg, sticker.x, sticker.y, sticker.width, sticker.height);
        } 
        // Draw caption with selected language
        ctx.font = "bold 16px sans-serif";
        ctx.fillStyle = fontColor;
        ctx.textAlign = "center";
        ctx.textBaseline = "bottom";
        ctx.fillText(captions[selectedLanguage], canvasWidth / 2, canvasHeight - 15);
      } catch (e) {
        console.error("Error loading images", e);
      }
    })();
  };

  // Optimize sticker movement
  useEffect(() => {
    if ((!isMoving && !resizeData) || !activeSticker) return;

    const handleMouseMove = (e: MouseEvent) => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }

      animationFrameRef.current = requestAnimationFrame(() => {
        const container = containerRef.current;
        if (!container) return;

        const canvasRect = canvasRef.current?.getBoundingClientRect();
        if (!canvasRect) return;

        // Calculate position relative to canvas
        let newX = e.clientX - canvasRect.left - activeSticker.offsetX;
        let newY = e.clientY - canvasRect.top - activeSticker.offsetY;

        // Clamp position to canvas bounds
        const currentSticker = stickers.find(s => s.id === activeSticker.id);
        if (!currentSticker) return;

        newX = Math.max(0, Math.min(newX, canvasRect.width - currentSticker.width));
        newY = Math.max(0, Math.min(newY, canvasRect.height - currentSticker.height));

        // Update sticker position directly
        setStickers(prev =>
          prev.map(s =>
            s.id === activeSticker.id
              ? { ...s, x: newX, y: newY }
              : s
          )
        );
      });
    };

    const handleMouseUp = () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
      setIsMoving(false);
      setActiveSticker(null);
      renderCanvas();
    };

    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [isMoving, activeSticker, stickers]);

  // Handle sticker resizing
  useEffect(() => {
    if (!resizeData) return;

    const handleMouseMove = (e: MouseEvent) => {
      const { id, pos, startX, startY, startWidth, startHeight } = resizeData;
      const deltaX = e.clientX - startX;
      const deltaY = e.clientY - startY;

      let newWidth = startWidth;
      let newHeight = startHeight;
      let newX = stickers.find(s => s.id === id)?.x || 0;
      let newY = stickers.find(s => s.id === id)?.y || 0;

      // Calculate new dimensions based on resize position
      if (pos.includes('right')) {
        newWidth = Math.max(50, startWidth + deltaX);
      }
      if (pos.includes('bottom')) {
        newHeight = Math.max(50, startHeight + deltaY);
      }
      if (pos.includes('left')) {
        newWidth = Math.max(50, startWidth - deltaX);
        newX = startX + deltaX;
      }
      if (pos.includes('top')) {
        newHeight = Math.max(50, startHeight - deltaY);
        newY = startY + deltaY;
      }

      setStickers(prev =>
        prev.map(s =>
          s.id === id
            ? { ...s, width: newWidth, height: newHeight, x: newX, y: newY }
            : s
        )
      );
    };

    const handleMouseUp = () => {
      setResizeData(null);
      renderCanvas();
    };

    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, [resizeData]);

    const handleDownload = async () => {
    try {
      if (!canvasRef.current) {
        throw new Error('Canvas not initialized');
      }

      // Create a temporary canvas for high-quality rendering
      const tempCanvas = document.createElement('canvas');
      const tempCtx = tempCanvas.getContext('2d');
      if (!tempCtx) {
        throw new Error('Failed to get canvas context');
      }

      const layout = selectedLayout.layout;
      const rows = layout.length;
      const maxCols = Math.max(...layout.map((row) => row.length));

      const canvasWidth = maxCols * imageSize + (maxCols + 1) * padding;
      const canvasHeight = rows * imageSize + (rows + 1) * padding + 40;

      // Set high DPI for better quality
      const dpr = 2;
      tempCanvas.width = canvasWidth * dpr;
      tempCanvas.height = canvasHeight * dpr;
      tempCanvas.style.width = `${canvasWidth}px`;
      tempCanvas.style.height = `${canvasHeight}px`;

      tempCtx.scale(dpr, dpr);
      tempCtx.fillStyle = bgColor;
      tempCtx.fillRect(0, 0, canvasWidth, canvasHeight);
      tempCtx.imageSmoothingEnabled = true;
      tempCtx.imageSmoothingQuality = "high";

      // Load and draw images
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

            tempCtx.filter = data[imgIndex].filter || filter || "none";
            tempCtx.drawImage(images[imgIndex], x, y, imageSize, imageSize);
            imgIndex++;
          }
        }
      }

      // Draw stickers
      for (const sticker of stickers) {
        try {
          const stickerImg = await preloadImage(sticker.imgSrc);
          tempCtx.filter = "none";
          tempCtx.drawImage(stickerImg, sticker.x, sticker.y, sticker.width, sticker.height);
        } catch (error) {
          console.warn('Failed to load sticker:', error);
        }
      }

      // Draw caption with selected language
      tempCtx.font = "bold 16px sans-serif";
      tempCtx.fillStyle = fontColor;
      tempCtx.textAlign = "center";
      tempCtx.textBaseline = "bottom";
      tempCtx.fillText(captions[selectedLanguage], canvasWidth / 2, canvasHeight - 15);

      // Convert to blob with error handling
      const blob = await new Promise<Blob>((resolve, reject) => {
        tempCanvas.toBlob((blob) => {
          if (blob) {
            resolve(blob);
          } else {
            reject(new Error('Failed to create blob'));
          }
        }, 'image/png', 1.0);
      });
      
      // Create and trigger download
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `snapcharm-${new Date().getTime()}.png`;
      
      // Ensure the link is added to the document
      document.body.appendChild(link);
      link.click();
      
      // Cleanup
      setTimeout(() => {
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
      }, 100);

    } catch (error) {
      console.error('Error downloading collage:', error);
      alert('Failed to download collage. Please try again.');
    }
  };

  // Improve sticker upload UI
  

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />
      <div className="max-w-7xl mx-auto p-4 flex flex-col lg:flex-row justify-center items-start mt-5 gap-8">
        {/* Canvas container with relative positioning to overlay stickers */}
        <div className="w-full lg:w-2/3 flex justify-center">
          <div ref={containerRef} className="relative border border-gray-300 rounded-xl shadow-lg bg-white overflow-hidden max-w-2xl">
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
                    onMouseDown={(e) => onStickerSelect(e, sticker.id)}
                    onTouchStart={(e) => onStickerSelect(e, sticker.id)}
                    style={{
                      position: "absolute",
                      top: sticker.y,
                      left: sticker.x,
                      width: sticker.width,
                      height: sticker.height,
                      cursor: isMoving && activeSticker?.id === sticker.id ? "grabbing" : "grab",
                      userSelect: "none",
                      zIndex: 10,
                      border: selectedStickerId === sticker.id ? "2px solid #ec4899" : "none",
                      borderRadius: 8,
                      willChange: "transform",
                      transform: "translateZ(0)",
                    }}
                  >
                    <img
                      src={sticker.imgSrc}
                      alt="sticker"
                      draggable={false}
                      style={{ width: "100%", height: "100%", objectFit: "contain" }}
                      onDragStart={(e) => e.preventDefault()}
                    />

                    {/* Resizing handles */}
                    {selectedStickerId === sticker.id && (
                      <>
                        {["top-left", "top-right", "bottom-left", "bottom-right"].map((pos) => (
                          <div
                            key={pos}
                            data-pos={pos}
                            className={`absolute w-3 h-3 bg-white border border-gray-500 rounded-full hover:scale-110 transition-transform`}
                            style={{
                              cursor: pos.includes("left")
                                ? pos.includes("top")
                                  ? "nwse-resize"
                                  : "nesw-resize"
                                : pos.includes("top")
                                ? "nesw-resize"
                                : "nwse-resize",
                              ...(pos === "top-left" && { top: -6, left: -6 }),
                              ...(pos === "top-right" && { top: -6, right: -6 }),
                              ...(pos === "bottom-left" && { bottom: -6, left: -6 }),
                              ...(pos === "bottom-right" && { bottom: -6, right: -6 }),
                              zIndex: 15,
                            }}
                            onMouseDown={(e) => onResizeHandleDown(e, sticker, pos)}
                            onTouchStart={(e) => onResizeHandleDown(e, sticker, pos)}
                          />
                        ))}
                      </>
                    )}
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
        </div>

        {/* Controls Section */}
        <div ref={controlsRef} className="w-full lg:w-1/3 space-y-6 bg-white p-6 rounded-xl shadow-lg">
          <h2 className="text-2xl font-bold text-gray-800 mb-6">Customize Your Photo</h2>
          
          {/* Language Selector */}
          <Caption selectedLanguage={selectedLanguage } setSelectedLanguage={setSelectedLanguage}/>
          

          {/* Color pickers */}
          <div className="space-y-6">
            <div>
              <h4 className="font-semibold text-gray-700 mb-3">Background Color</h4>
              <div className="flex flex-wrap gap-2 items-center">
                {predefinedColors.map((color) => (
                  <button
                    key={color}
                    className={`w-8 h-8 rounded-full border transition-all duration-200 hover:scale-110 ${
                      bgColor === color ? "ring-2 ring-pink-500 scale-110" : ""
                    }`}
                    style={{ backgroundColor: color }}
                    onClick={() => setBgColor(color)}
                    type="button"
                  />
                ))}
                <button
                  onClick={() => setShowPicker1(!showPicker1)}
                  className="w-8 h-8 rounded-full border bg-gradient-to-br from-pink-400 via-yellow-300 to-purple-400 hover:scale-110 transition-transform"
                  type="button"
                />
              </div>
              {showPicker1 && (
                <div className="absolute z-20 mt-2">
                  <ChromePicker color={bgColor} onChange={(c) => setBgColor(c.hex)} disableAlpha />
                </div>
              )}
            </div>

            <div>
              <h4 className="font-semibold text-gray-700 mb-3">Caption Color</h4>
              <div className="flex flex-wrap gap-2 items-center">
                {predefinedColors.map((color) => (
                  <button
                    key={color}
                    className={`w-8 h-8 rounded-full border transition-all duration-200 hover:scale-110 ${
                      fontColor === color ? "ring-2 ring-pink-500 scale-110" : ""
                    }`}
                    style={{ backgroundColor: color }}
                    onClick={() => setFontColor(color)}
                    type="button"
                  />
                ))}
                <button
                  onClick={() => setShowPicker(!showPicker)}
                  className="w-8 h-8 rounded-full border bg-gradient-to-br from-pink-400 via-yellow-300 to-purple-400 hover:scale-110 transition-transform"
                  type="button"
                />
              </div>
              {showPicker && (
                <div className="absolute z-20 mt-2">
                  <ChromePicker color={fontColor} onChange={(c) => setFontColor(c.hex)} disableAlpha />
                </div>
              )}
            </div>
          </div>

          {/* Sticker upload section with improved UI */}
          <StickerUpload handleStickerUpload={handleStickerUpload}/>
          

            {/* Sticker gallery with improved UI */}
            {stickers.length > 0 && (
              <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                <h4 className="font-semibold text-gray-700 mb-3">Your Stickers</h4>
                <div className="grid grid-cols-4 gap-3 max-h-48 overflow-y-auto p-2">
                  {stickers.map((sticker) => (
                    <div
                      key={sticker.id}
                      className={`relative group aspect-square border rounded-lg overflow-hidden bg-white shadow-sm hover:shadow-md transition-all ${
                        selectedStickerId === sticker.id ? 'ring-2 ring-pink-500' : ''
                      }`}
                    >
                      <img
                        src={sticker.imgSrc}
                        alt="sticker"
                        className="w-full h-full object-contain p-1"
                        onClick={() => setSelectedStickerId(sticker.id)}
                        draggable={false}
                      />
                      <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-opacity flex items-center justify-center opacity-0 group-hover:opacity-100">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setStickers((prev) => prev.filter((s) => s.id !== sticker.id));
                            if (selectedStickerId === sticker.id) setSelectedStickerId(null);
                          }}
                          className="p-1 bg-white rounded-full shadow-lg hover:bg-red-50 transition-colors"
                          type="button"
                        >
                          <svg className="w-4 h-4 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                          </svg>
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Action buttons */}
         <ActionButton handleDownload={handleDownload} ></ActionButton> 
        </div>
      </div>
    
  );
};

export default Result;
