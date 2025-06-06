
import React from 'react';
import { BlockDefinition } from '../types';

interface BlockDisplayProps {
  block: BlockDefinition | null;
  size?: number; // size in pixels
  isSelected?: boolean;
  onClick?: () => void;
  className?: string;
}

const BlockDisplay: React.FC<BlockDisplayProps> = ({ block, size = 20, isSelected = false, onClick, className = '' }) => {
  if (!block) {
    // Render an empty cell (air)
    return (
      <div
        style={{ width: `${size}px`, height: `${size}px` }}
        className={`border border-slate-700 bg-slate-800 hover:bg-slate-700 transition-colors duration-100 ${className}`}
        onClick={onClick}
        role={onClick ? "button" : undefined}
        tabIndex={onClick ? 0 : undefined}
        onKeyDown={onClick ? (e) => { if (e.key === 'Enter' || e.key === ' ') onClick(); } : undefined}
      ></div>
    );
  }

  const baseStyle = `flex items-center justify-center font-bold transition-all duration-150`;
  const selectedStyle = isSelected ? `ring-4 ring-offset-2 ring-yellow-400 ring-offset-gray-800` : '';
  const blockTextColor = block.textColor || 'text-white';

  return (
    <div
      style={{ width: `${size}px`, height: `${size}px` }}
      className={`${baseStyle} ${block.color} ${block.borderColor || 'border-black'} border-2 ${selectedStyle} ${className} overflow-hidden`}
      title={block.name}
      onClick={onClick}
      role={onClick ? "button" : undefined}
      tabIndex={onClick ? 0 : undefined}
      onKeyDown={onClick ? (e) => { if (e.key === 'Enter' || e.key === ' ') onClick(); } : undefined}
    >
      {block.iconSymbol && (
        <span className={`${blockTextColor} text-xs leading-none select-none`} style={{ fontSize: `${Math.max(8, size * 0.5)}px` }}>
          {block.iconSymbol}
        </span>
      )}
    </div>
  );
};

export default BlockDisplay;
