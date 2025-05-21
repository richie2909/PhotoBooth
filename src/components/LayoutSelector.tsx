import React, { useState, useRef, useEffect } from "react";
import { layoutInfos } from "./layoutInfos";
import { LayoutPreview } from "./LayoutPreview";

export const LayoutSelector = ({ selectedCount, onChange }: { selectedCount: number; onChange: (count: number) => void }) => {
  const [showDropdown, setShowDropdown] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setShowDropdown(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="relative " ref={dropdownRef}>
      <button
        onClick={() => setShowDropdown(!showDropdown)}
        className="border p-2 rounded flex items-center gap-2 min-w-10 w-40 h-15"
        type="button"
      >
        {(() => {
          const selectedLayout = layoutInfos.find((info) => info.count === selectedCount);
          return selectedLayout ? (
            <LayoutPreview layout={selectedLayout.layout} type={selectedLayout.type} />
          ) : null;
        })()}
        <span>{selectedCount} Photo{selectedCount > 1 ? "s" : ""}</span>
      </button>
      

      {showDropdown && (
        <ul className="absolute z-50 mt-1 w-[280px] overflow-auto rounded border bg-white shadow-lg">
          {layoutInfos.map(({ count, description, layout, type }) => (
            <li
              key={`${count}-${type}`}
              tabIndex={0}
              className={`flex items-center gap-3 px-3 py-2 cursor-pointer hover:bg-pink-100 ${
                selectedCount === count ? "bg-pink-200 font-semibold" : ""
              }`}
              onClick={() => {
                onChange(count);
                setShowDropdown(false);
              }}
            >
              <LayoutPreview layout={layout} type={type} />
              <span>{description}</span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};