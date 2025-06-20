import React from "react";

export default function CompareCheckbox({ checked, onChange, id }) {
  return (
    <div className="flex items-center gap-2 mt-1">
      <span className="relative">
        <input
          type="checkbox"
          id={`compare-${id}`}
          checked={checked}
          onChange={onChange}
          className={`
            w-[13px] h-[13px] cursor-pointer appearance-none border border-gray-500 rounded-[3px] bg-white
            checked:bg-[#1976d2] checked:border-[#1976d2]
            flex items-center justify-center transition-all
          `}
        />
        {/* SVG Tickmark overlay, absolutely centered */}
        {checked && (
          <svg
            className="pointer-events-none absolute left-0 top-0 w-[13px] h-[13px]"
            viewBox="0 0 16 16"
            fill="none"
          >
            <path
              d="M4 8.5L7 11.5L12 5.5"
              stroke="#fff"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        )}
      </span>
      <label
        htmlFor={`compare-${id}`}
        className="text-xs md:text-sm cursor-pointer select-none"
      >
        COMPARE
      </label>
    </div>
  );
}
