import React, { useState } from "react";

type FilterPreset = {
  name: string;
  cssFilter: string;
};

const FilterPresets: FilterPreset[] = [
  { name: "None", cssFilter: "none" },
  { name: "Grayscale", cssFilter: "grayscale(100%)" },
  { name: "Sepia", cssFilter: "sepia(100%)" },
  { name: "Blur", cssFilter: "blur(2px)" },
  { name: "Invert", cssFilter: "invert(100%)" },
  { name: "Brightness", cssFilter: "brightness(150%)" },
  // add more presets as needed
];

export const FilterSelector: React.FC = () => {
  const [selectedFilter, setSelectedFilter] = useState<string>("none");

  return (
    <>
      {/* Custom scrollbar styles */}
      <style>
        {`
          /* WebKit */
          .custom-scrollbar::-webkit-scrollbar {
            height: 6px;
            background: transparent;
          }
          .custom-scrollbar::-webkit-scrollbar-thumb {
            background-color: #f472b6; /* pink-400 */
            border-radius: 3px;
          }
          /* Firefox */
          .custom-scrollbar {
            scrollbar-width: thin;
            scrollbar-color: #f472b6 transparent;
          }
        `}
      </style>

      <div className="mt-6 w-full max-w-xl overflow-x-auto whitespace-nowrap flex gap-4 border border-gray-300 p-2 rounded-md custom-scrollbar">
        {FilterPresets.map((preset, i) => (
          <button
            key={i}
            onClick={() => setSelectedFilter(preset.cssFilter)}
            className={`px-4 py-2 border rounded whitespace-nowrap text-sm shrink-0 cursor-pointer hover:bg-gray-100 transition ${
              selectedFilter === preset.cssFilter
                ? "bg-pink-100 border-pink-400 font-semibold"
                : "bg-white border-gray-300"
            }`}
          >
            {preset.name}
          </button>
        ))}
      </div>
    </>
  );
};
