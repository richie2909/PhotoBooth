import  { useState, useRef, useEffect } from "react";
import { layoutInfos } from "./layoutInfos";
import { LayoutPreview } from "./LayoutPreview";

export const LayoutSelector = ({
  selectedCount,
  onChange,
}: {
  selectedCount: number;
  onChange: (count: number) => void;
}) => {
  const [showDropdown, setShowDropdown] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setShowDropdown(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const selectedLayout = layoutInfos.find((info) => info.count === selectedCount);

  return (
    <div
      className="relative w-full max-w-full sm:max-w-[300px] h-[40px]"
      ref={dropdownRef}
    >
      <button
        onClick={() => setShowDropdown((prev) => !prev)}
        type="button"
        className="w-full h-full flex items-center justify-between px-3 border border-gray-300 rounded-md bg-white shadow-sm hover:bg-gray-50 transition duration-150 focus:outline-none focus:ring-2 focus:ring-blue-500"
      >
        <div className="flex items-center gap-2 min-w-0">
          {selectedLayout && (
            <div className="scale-[0.85] origin-left shrink-0">
              <LayoutPreview layout={selectedLayout.layout} type={selectedLayout.type} />
            </div>
          )}
          <span className="text-sm font-medium truncate">
            {selectedCount} Photo{selectedCount > 1 ? "s" : ""}
          </span>
        </div>
        <svg
          className="w-4 h-4 text-gray-500 flex-shrink-0"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {showDropdown && (
        <ul
          className="absolute z-50 mt-2 w-full max-w-md max-h-[280px] overflow-auto rounded-md border border-gray-200 bg-white shadow-lg sm:max-w-[300px]"
          role="listbox"
        >
          {layoutInfos.map(({ count, description, layout, type }) => (
              <li
      key={`${count}-${type}`}
      tabIndex={0}
      role="option"
      aria-selected={selectedCount === count}
      className={`flex items-center gap-3 px-4 py-3 mb-2 cursor-pointer transition-colors duration-100
        ${selectedCount === count ? "bg-blue-100 font-semibold" : "hover:bg-gray-100"}
      `}
      onClick={() => {
        onChange(count);
        setShowDropdown(false);
      }}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          onChange(count);
          setShowDropdown(false);
        }
      }}
    >
      <div className="shrink-0 w-12 h-12 sm:w-10 sm:h-10 flex items-center justify-center">
        <div className="scale-[0.85] origin-center w-full h-full flex items-center justify-center">
          <LayoutPreview layout={layout} type={type} />
        </div>
      </div>
      <div className="flex-1 min-w-0">
        <span className="text-sm truncate leading-tight">{description}</span>
      </div>
    </li>


          ))}
        </ul>
      )}
    </div>
  );
};
