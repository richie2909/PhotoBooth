import { useRef } from "react";
import type { ImageContext } from "../Context/ImageContext";

type Sticker = {
  id: string;
  imgSrc: string;
  x: number;
  y: number;
  width: number;
  height: number;
};

export const useDownloadCollage = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  const download = (
    img: ImageContext[] | null,
    col: number,
    size: number,
    padding: number,
    color: string,
    filter: string,
    stickers: Sticker[] = [],
    text: string = ""
  ) => {
    const canvas = canvasRef.current;
    if (!canvas) throw new Error("Canvas not available");

    const ctx = canvas.getContext("2d");
    if (!ctx) throw new Error("2D context not available");

    if (!img || img.length === 0) {
      throw new Error("No images");
    }

    const rows = Math.ceil(img.length / col);
    const canvasWidth = col * size + (col + 1) * padding;
    const canvasHeight = rows * size + (rows + 1) * padding;

    canvas.width = canvasWidth;
    canvas.height = canvasHeight;

    // Clear canvas and fill background
    ctx.clearRect(0, 0, canvasWidth, canvasHeight);
    ctx.fillStyle = color;
    ctx.fillRect(0, 0, canvasWidth, canvasHeight);

    ctx.filter = filter || "none";

    // Helper to load an image from src and return a Promise<Image>
    const loadImage = (src: string): Promise<HTMLImageElement> =>
      new Promise((resolve, reject) => {
        const image = new Image();
        image.crossOrigin = "anonymous"; // if you use remote images and want to avoid CORS issues
        image.onload = () => resolve(image);
        image.onerror = reject;
        image.src = src;
      });

    // Load all photos + stickers before drawing
    Promise.all(
      img.map((photo) => loadImage(photo.imgSrc))
    )
      .then((loadedPhotos) => {
        // Draw photos on canvas
        loadedPhotos.forEach((image, i) => {
          const column = i % col;
          const row = Math.floor(i / col);
          const x = padding + column * (size + padding);
          const y = padding + row * (size + padding);
          ctx.drawImage(image, x, y, size, size);
        });

        // Now load stickers
        return Promise.all(stickers.map((st) => loadImage(st.imgSrc)));
      })
      .then((loadedStickers) => {
        // Draw stickers
        loadedStickers.forEach((stickerImage, i) => {
          const st = stickers[i];
          ctx.drawImage(stickerImage, st.x, st.y, st.width, st.height);
        });

        // Draw text below the collage (adjust as needed)
        ctx.fillStyle = "#000"; // text color
        ctx.font = "24px sans-serif";
        ctx.textAlign = "center";
        ctx.fillText(
          text,
          canvas.width / 2,
          canvas.height - 20 // 20px from bottom, adjust as you want
        );

        // Finally trigger download
        const link = document.createElement("a");
        link.download = "collage.png";
        link.href = canvas.toDataURL("image/png");
        link.click();
      })
      .catch((err) => {
        console.error("Error loading images:", err);
      });
  };

  return { canvasRef, download };
};
