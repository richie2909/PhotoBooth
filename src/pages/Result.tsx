import React, { useContext, useEffect, useRef, useState } from "react";
import { handleStickerUpload } from "../utils/stickerHelpFunction";
import { imageContext } from "../Context/ImageContext";
import { layoutInfos } from "../components/layoutInfos";
import type { Sticker } from "../hooks/useDownloadCollage";
import Navigation from "../components/Navigation";
import ActionButton from "../components/ActionButton";
import StickerUpload from "../components/StickerUpload";
import Caption from "../components/Caption";
import BackgroundColorSelector from "../components/BackgroundColorSelector";
import Canvas from "../components/Canvas";

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

      <div className="w-full lg:w-2/3 flex justify-center">
       <Canvas stickers={stickers}
       bgColor={bgColor}
       activeSticker={activeSticker}
        isMoving={isMoving}
       setIsMoving={setIsMoving} 
       setActiveSticker={setActiveSticker} 
       setResizeData={setResizeData}
        setResizeStickerId={setResizeStickerId}
        setSelectedStickerId={setResizeStickerId}
        selectedStickerId={selectedStickerId}
        canvasRef={canvasRef}
        containerRef={containerRef}
        
       />
      </div>
        
       {/* Controls Section */}
        <div ref={controlsRef} className="w-full lg:w-1/3 space-y-6 bg-white p-6 rounded-xl shadow-lg">
          <h2 className="text-2xl font-bold text-gray-800 mb-6">Customize Your Photo</h2>
          {/* Language Selector */}
          <Caption selectedLanguage={selectedLanguage } setSelectedLanguage={setSelectedLanguage}/>
          <div>
            <BackgroundColorSelector setBgColor={setBgColor}
             setShowPicker1={setShowPicker1}
              predefinedColors={predefinedColors}
               showPicker1={showPicker1}
                bgColor={bgColor}
               fontColor={fontColor} 
               setFontColor={setFontColor} 
              showPicker={showPicker}
               setShowPicker={setShowPicker} 
                
                />
            </div>
          <StickerUpload handleStickerUpload={(e) => {
            handleStickerUpload(e,setSelectedStickerId, setResizeStickerId,setStickers)
          }} setSelectedStickerId={setResizeStickerId} selectedStickerId={selectedStickerId} 
            setStickers={setStickers}
            stickers={stickers}
          />
         <ActionButton handleDownload={handleDownload} ></ActionButton> 
          </div>
        </div>
    
      </div>
  );
};

export default Result;
