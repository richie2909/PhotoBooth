import React from "react";

const stickerFilenames = [
  "collage (1).png",
  "collage (3).png",
  "collage (5).png",
  "collage (8).png",
  "collage.png",
  "Screenshot_2025-05-22_21-59-50.png",
  "vite.svg",
];

type StickerPickerProps = {
  onSelect: (imgSrc: string) => void;
};

const Sticker: React.FC<StickerPickerProps> = ({ onSelect }) => {
  return (
    <div className="flex flex-wrap gap-3 p-3 bg-gray-100 rounded-md max-w-md">
      {stickerFilenames.map((filename) => {
        // Use import.meta.env.BASE_URL for Vite to access public folder
        const src = import.meta.env.BASE_URL + filename;
        return (
          <button
            key={filename}
            className="w-16 h-16 rounded-md overflow-hidden border border-gray-300 hover:border-pink-500 focus:outline-none"
            onClick={() => onSelect(src)}
            title={filename}
            type="button"
          >
            <img
              src={src}
              alt={filename}
              className="object-contain w-full h-full"
              draggable={false}
            />
          </button>
        );
      })}
    </div>
  );
};

export default Sticker;
