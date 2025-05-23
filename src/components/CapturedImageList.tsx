import React from "react";

type CapturedImage = {
  imgSrc: string;
  dateCreated: Date;
  filter?: string | null;
};

type CapturedImageListProps = {
  data: CapturedImage[] | null;
  onRetake: (index: number) => void;
};

export const CapturedImageList: React.FC<CapturedImageListProps> = ({ data, onRetake }) => {
  const count = data ? Math.min(data.length, 9) : 0;
  const maxVisible = 5; // max images before scrolling
  const visibleCount = Math.min(count, maxVisible);

  // Detect screen width to decide flexBasis dynamically
  // Could be improved with ResizeObserver or a custom hook, but for demo we use window.innerWidth safely here
  const isLargeScreen = typeof window !== "undefined" && window.innerWidth >= 1024;

  return (
    <>
      {/* Custom scrollbar styles */}
      <style>
        {`
          /* Scrollbar for WebKit browsers */
          .custom-scrollbar::-webkit-scrollbar {
            height: 6px;
            background: transparent;
          }
          .custom-scrollbar::-webkit-scrollbar-thumb {
            background-color: #f472b6; /* Tailwind pink-400 */
            border-radius: 3px;
          }

          /* Scrollbar for Firefox */
          .custom-scrollbar {
            scrollbar-width: thin;
            scrollbar-color: #f472b6 transparent;
          }
        `}
      </style>

      <div className="w-full mx-auto lg:w-1/3 flex flex-row lg:flex-col lg:items-center mt-1 lg:mt-0">
        <div
          className={`flex items-center justify-start gap-3 w-full lg:max-w-[120px] ${
            count > maxVisible ? "overflow-x-auto custom-scrollbar" : "overflow-x-hidden"
          } flex-nowrap lg:flex-col`}
          style={{
            maxHeight: "450px",
            // On small screens if scroll, limit height to keep UI tidy (image height + gap)
            height: isLargeScreen ? "auto" : "120px",
          }}
        >
          {data?.slice(0, 9).map((img, index) => (
            <button
              key={index}
              className="aspect-square rounded-md border border-gray-300 overflow-hidden hover:ring-2 hover:ring-pink-400 transition flex-shrink-0"
              style={{
                flexBasis: isLargeScreen ? "100px" : `${100 / visibleCount}%`,
                maxWidth: "120px",
                minWidth: 0,
              }}
              onClick={() => onRetake(index)}
            >
              <img
                src={img.imgSrc}
                alt={`Captured ${index}`}
                style={{ filter: img.filter ?? "none" }}
                className="w-full h-full object-cover scale-x-[-1]"
              />
            </button>
          ))}
        </div>
      </div>
    </>
  );
};
