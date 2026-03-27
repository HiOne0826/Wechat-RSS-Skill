import React, { useState } from 'react';
import { statusMap } from '@web/constants';

export function StatusDropdown({
  value = 1,
  onChange,
}: {
  value: number;
  onChange: (value: number) => void;
}) {
  const [isOpen, setIsOpen] = useState(false);

  const toggleDropdown = () => {
    setIsOpen(!isOpen);
  };

  const handleSelect = (newValue: number) => {
    onChange(newValue);
    setIsOpen(false);
  };

  return (
    <div className="relative">
      <button
        className="btn-brutal btn-brutal-secondary px-4 py-2 text-sm font-mono"
        onClick={toggleDropdown}
      >
        {statusMap[value].label}
      </button>
      {isOpen && (
        <div className="absolute top-full left-0 mt-2 w-48 bg-white border-2 border-gray-900 shadow-[4px_4px_0px_#1A1A1A] z-10">
          {Object.entries(statusMap).map(([key, status]) => {
            return (
              <button
                key={key}
                className={`block w-full text-left px-4 py-2 font-mono text-sm hover:bg-gray-100 ${parseInt(key) === value ? 'bg-blue-600 text-white' : ''}`}
                onClick={() => handleSelect(parseInt(key))}
              >
                {status.label}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}