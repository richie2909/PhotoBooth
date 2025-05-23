

export const TimerSelector = ({
  selected,
  onChange,
}: {
  selected: number;
  onChange: (value: number) => void;
}) => {
  return (
    <select
      value={selected}
      onChange={(e) => onChange(parseInt(e.target.value))}
      className="w-full max-w-[120px] px-3 py-2 border border-gray-300 rounded-lg shadow-sm text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-150"
    >
      <option value={3}>3s</option>
      <option value={5}>5s</option>
      <option value={10}>10s</option>
    </select>
  );
};
