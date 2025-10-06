'use client';

import React, { useState, useRef, useEffect } from 'react';
import { ChevronDownIcon, CheckIcon } from '@heroicons/react/24/outline';

// --- Type Definitions ---
type PriorityFilter = 'all' | 'low' | 'medium' | 'high';

interface PriorityDropdownProps {
  priorityFilter: PriorityFilter;
  setPriorityFilter: (filter: PriorityFilter) => void;
}
// -----------------------

const priorities: PriorityFilter[] = ['all', 'low', 'medium', 'high'];

// Helper to determine styles based on priority, using a cleaner aesthetic.
const getPriorityStyles = (priority: PriorityFilter) => {
  switch (priority) {
    case 'all':
      return {
        text: 'text-indigo-600',
        dot: 'bg-[#6366f1]',
        border: 'border-indigo-300',
        hover: 'hover:bg-gray-50',
      };
    case 'high':
      return {
        text: 'text-red-600',
        dot: 'bg-red-500',
        border: 'border-red-300',
        hover: 'hover:bg-red-50',
      };
    case 'medium':
      // Using gray text for better contrast on the light yellow background/hover
      return {
        text: 'text-yellow-700',
        dot: 'bg-yellow-500',
        border: 'border-yellow-300',
        hover: 'hover:bg-yellow-50',
      };
    case 'low':
      return {
        text: 'text-green-600',
        dot: 'bg-green-500',
        border: 'border-green-green-300',
        hover: 'hover:bg-green-50',
      };
    default:
      return {
        text: 'text-gray-600',
        dot: 'bg-gray-400',
        border: 'border-gray-300',
        hover: 'hover:bg-gray-50',
      };
  }
};

const PriorityDropdown: React.FC<PriorityDropdownProps> = ({ priorityFilter, setPriorityFilter }) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Click-outside logic remains the same
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [dropdownRef]);

  const handleSelect = (filter: PriorityFilter) => {
    setPriorityFilter(filter);
    setIsOpen(false);
  };

  const selectedPriorityLabel = priorityFilter.charAt(0).toUpperCase() + priorityFilter.slice(1);
  const selectedStyles = getPriorityStyles(priorityFilter);

  return (
    <div className="relative inline-block text-left" ref={dropdownRef}>
      <div className="flex items-center space-x-3 pr-4">
       
        <span className="text-md font-medium text-bold text-gray-700">Filter by priority:</span>
        
       
        <button
          type="button"
         
          className={`
            inline-flex justify-center items-center px-4 py-2 border text-sm font-medium rounded-xl 
            shadow-sm bg-white 
            ${selectedStyles.text} ${selectedStyles.border}
            hover:bg-gray-50 
            focus:outline-none focus:ring-1 focus:ring-offset-2  
            transition-all duration-200
          `}
          onClick={() => setIsOpen(!isOpen)}
          aria-expanded={isOpen}
          aria-haspopup="true"
        >
          {selectedPriorityLabel}
          <ChevronDownIcon className={`-mr-1 ml-2 h-5 w-5`} aria-hidden="true" />
        </button>
      </div>

      
      {isOpen && (
        <div
          className="origin-top-right absolute right-0 mt-2 w-48 rounded-2xl shadow-xl bg-white ring-1 ring-gray- ring-opacity-5 focus:outline-none z-40"
          role="menu"
        >
          <div className="py-1" role="none">
            {priorities.map((priority) => {
              const label = priority.charAt(0).toUpperCase() + priority.slice(1);
              const isSelected = priority === priorityFilter;
              const styles = getPriorityStyles(priority);

              return (
                <button
                  key={priority}
                  onClick={() => handleSelect(priority)}
                 
                  className={`
                    flex items-center w-full px-4 py-2 text-sm text-left group rounded-xl
                    ${styles.text} 
                    ${isSelected ? styles.hover : 'hover:bg-gray-50'}
                  `}
                  role="menuitem"
                >

                  <span className={`w-2.5 h-2.5 rounded-full ${styles.dot} mr-3`} aria-hidden="true"></span>
                  
                  <span className="flex-1 font-medium">{label}</span>
                  
                  {/* Checkmark for Selected Item */}
                  {isSelected && <CheckIcon className="h-5 w-5 ml-2 text-gray-700" />}
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};

export default PriorityDropdown;
