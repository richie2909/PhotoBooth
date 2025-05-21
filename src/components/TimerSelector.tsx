
import React from "react";

export const TimerSelector = ({ selected, onChange }: { selected: number; onChange: (value: number) => void }) => {
  return (
    <select 
      value={selected}
      onChange={(e) => onChange(parseInt(e.target.value))}
      className="border-1 pl-2 h-15  pr-3 p-1 rounded"
    >
      <option value={3}>3s</option>
      <option value={5}>5s</option>
      <option value={10}>10s</option>
    </select>
  );
};
