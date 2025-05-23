import { useCallback } from "react";

export type Sticker = {
  id: string;
  imgSrc: string;
  x: number;
  y: number;
  width: number;
  height: number;
};

const LOCAL_STORAGE_KEY = "photoBoothImages";

// Local storage helpers
export const saveImagesToLocalStorage = (images: any[]) => {
  try {
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(images));
  } catch (e) {
    console.warn("Failed to save images to localStorage", e);
  }
};

export const getImagesFromLocalStorage = (): any[] => {
  try {
    const data = localStorage.getItem(LOCAL_STORAGE_KEY);
    return data ? JSON.parse(data) : [];
  } catch (e) {
    console.warn("Failed to get images from localStorage", e);
    return [];
  }
};

export const clearStoredImages = () => {
  try {
    localStorage.removeItem(LOCAL_STORAGE_KEY);
  } catch (e) {
    console.warn("Failed to clear images from localStorage", e);
  }
};

export const useDownloadCollage = () => {
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
      fontColor: string,
      saveToStorage: boolean = false // New flag to optionally save to localStorage after download
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
        // Calculate total images needed from layout (sum of 1's)
        const totalImagesNeeded = layout.flat().reduce((a, b) => a + b, 0);

        const images = await Promise.all(
          data.slice(0, totalImagesNeeded).map((d) => preloadImage(d.imgSrc))
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

        // Draw caption text
        ctx.font = "16px sans-serif";
        ctx.fillStyle = fontColor;
        ctx.textAlign = "center";
        ctx.fillText(caption, canvasWidth / 2, canvasHeight - 10);

        // Convert canvas to image URL and trigger download
        const url = canvas.toDataURL("image/png");
        const link = document.createElement("a");
        link.href = url;
        link.download = "collage.png";
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);

        // Optionally save images to localStorage if flagged
        if (saveToStorage) {
          saveImagesToLocalStorage(data);
        }
      } catch (e) {
        console.error("Error downloading collage", e);
      }
    },
    []
  );

  return { download, saveImagesToLocalStorage, getImagesFromLocalStorage, clearStoredImages };
};
