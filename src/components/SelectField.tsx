import { useRef } from "react";
import { FaChevronDown } from "react-icons/fa";

export interface Option<T> {
  label: string;
  value: T;
}

interface SelectFieldProps<T> {
  label?: string;
  options: Option<T>[];
  value: T | "";
  onChange: (value: T) => void;
  placeholder?: string;
  className?: string;
}

function SelectField<T extends string | number>({
  label,
  options,
  value,
  onChange,
  placeholder = "Select an option",
  className = "",
}: SelectFieldProps<T>) {
  const ref = useRef<HTMLSelectElement>(null);
  return (
    <div className={`flex flex-col gap-1 relative ${className}`}>
      {label && (
        <label className="text-sm font-medium text-gray-700">{label}</label>
      )}
      <select
        ref={ref}
        value={value}
        onChange={(e) => onChange(e.target.value as T)}
        className="
          border border-gray-200 rounded-lg pl-2 pr-6 p-1
          focus:outline-none focus:ring-2 focus:ring-violet-500
          bg-white text-gray-600 text-sm
          appearance-none
          cursor-pointer
        "
      >
        <option value="" disabled hidden>
          {placeholder}
        </option>
        {options.map((opt) => (
          <option key={String(opt.value)} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
      <FaChevronDown
        onClick={ref?.current?.click}
        className={`absolute right-2 top-1/2 -translate-y-1/2
            w-3 h-3 text-gray-500 pointer-events-none
        `}
      />
    </div>
  );
}

export default SelectField;
