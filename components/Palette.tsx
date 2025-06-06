import React, { useState, useMemo } from 'react';
import { BlockDefinition, BlockCategory, Tool, SelectionArea } from '../types';
import { BLOCK_DEFINITIONS, EraserBlock, ALL_BLOCKS_MAP } from '../constants';
import BlockDisplay from './BlockDisplay';

interface PaletteProps {
  selectedBlockId: string | null;
  onSelectBlock: (blockId: string) => void;
  recentlyUsedBlockIds: string[];
  currentTool: Tool;
  onSetTool: (tool: Tool) => void;
  className?: string;
  // New props for moved tools
  onClearGrid: () => void;
  selectionArea: SelectionArea | null;
  onFillSelection: () => void;
  onClearSelection: () => void;
}

const Palette: React.FC<PaletteProps> = ({
  selectedBlockId,
  onSelectBlock,
  recentlyUsedBlockIds,
  currentTool,
  onSetTool,
  className = '',
  onClearGrid,
  selectionArea,
  onFillSelection,
  onClearSelection,
}) => {
  const [searchTerm, setSearchTerm] = useState('');

  const handleBlockClick = (blockId: string) => {
    onSelectBlock(blockId); 
    if (blockId === EraserBlock.id) {
        onSetTool(Tool.ERASE);
    } 
    else if (currentTool === Tool.ERASE && blockId !== EraserBlock.id) {
        onSetTool(Tool.DRAW);
    }
  };

  const recentlyUsedBlocks = useMemo(() => {
    return recentlyUsedBlockIds
      .map(id => ALL_BLOCKS_MAP.get(id))
      .filter(Boolean) as BlockDefinition[];
  }, [recentlyUsedBlockIds]);

  const filteredBlockDefinitions = useMemo(() => {
    if (!searchTerm) return BLOCK_DEFINITIONS.filter(b => b.id !== EraserBlock.id);
    return BLOCK_DEFINITIONS.filter(block =>
      block.id !== EraserBlock.id && block.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [searchTerm]);

  const blocksByCategory: { [key in BlockCategory]?: BlockDefinition[] } = {};
  filteredBlockDefinitions.forEach(block => {
    if (!blocksByCategory[block.category]) {
      blocksByCategory[block.category] = [];
    }
    blocksByCategory[block.category]?.push(block);
  });

  const categoriesOrder = [
    BlockCategory.RECENT, 
    ...Object.values(BlockCategory).filter(c => c !== BlockCategory.RECENT && c !== BlockCategory.UTILITY),
    BlockCategory.UTILITY
  ];


  return (
    <div className={`minecraft-panel p-3 h-full overflow-y-auto flex flex-col ${className}`}>
      <h2 className="text-xl mb-3 text-yellow-300 border-b-2 border-gray-500 pb-1">Block Palette</h2>
      
      <input
        type="text"
        placeholder="Search blocks..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="w-full p-2 mb-3 bg-slate-800 border-2 border-slate-600 text-white focus:border-yellow-400 outline-none"
      />

      <div className="mb-3">
        <h3 className="text-lg mb-1 text-sky-300">Tools</h3>
        <div className="grid grid-cols-3 gap-1 mb-2">
            <button 
                onClick={() => onSetTool(Tool.DRAW)} 
                title="Draw Tool (D)"
                className={`minecraft-button flex-1 ${currentTool === Tool.DRAW && selectedBlockId !== EraserBlock.id ? '!bg-green-600' : ''}`}
                disabled={selectedBlockId === EraserBlock.id && currentTool !== Tool.ERASE}
                aria-pressed={currentTool === Tool.DRAW && selectedBlockId !== EraserBlock.id}
            >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mx-auto" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                  <path d="M17.414 2.586a2 2 0 00-2.828 0L7 10.172V13h2.828l7.586-7.586a2 2 0 000-2.828z" />
                  <path fillRule="evenodd" d="M2 6a2 2 0 012-2h4a1 1 0 010 2H4v10h10v-4a1 1 0 112 0v4a2 2 0 01-2 2H4a2 2 0 01-2-2V6z" clipRule="evenodd" />
                </svg>
            </button>
            <button 
                onClick={() => onSetTool(Tool.FILL)} 
                title="Fill Tool (F)"
                className={`minecraft-button flex-1 ${currentTool === Tool.FILL && selectedBlockId !== EraserBlock.id ? '!bg-green-600' : ''}`}
                disabled={selectedBlockId === EraserBlock.id && currentTool !== Tool.ERASE}
                aria-pressed={currentTool === Tool.FILL && selectedBlockId !== EraserBlock.id}
            >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mx-auto" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                  <path d="M5.5 2.5a2.5 2.5 0 013.383-2.149 1.5 1.5 0 011.234 2.296A2.492 2.492 0 0110.5 5a2.5 2.5 0 01-2.5 2.5H2a1 1 0 01-1-1v-2.5a2.5 2.5 0 012.5-2.5h3zm4.053 6.138A3.502 3.502 0 0010.5 5 3.5 3.5 0 007 8.5V11h3.5A3.5 3.5 0 0014 7.638v-1z" />
                  <path d="M3.5 12A2.5 2.5 0 001 14.5V17a1 1 0 001 1h14a1 1 0 001-1v-2.5a2.5 2.5 0 00-2.5-2.5h-11z" />
                </svg>
            </button>
            <button
                onClick={() => onSetTool(Tool.SELECT_AREA)}
                title="Select Area Tool (S)"
                className={`minecraft-button flex-1 ${currentTool === Tool.SELECT_AREA ? '!bg-green-600' : ''}`}
                aria-pressed={currentTool === Tool.SELECT_AREA}
            >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mx-auto" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                  <path fillRule="evenodd" d="M3 3h2v2H3V3zm4 0h2v2H7V3zm4 0h2v2h-2V3zm4 0h2v2h-2V3zM3 7h2v2H3V7zm12 0h2v2h-2V7zM3 11h2v2H3v-2zm12 0h2v2h-2v-2zM3 15h2v2H3v-2zm4 0h2v2H7v-2zm4 0h2v2h-2v-2zm4 0h2v2h-2v-2z" clipRule="evenodd" />
                </svg>
            </button>
        </div>
        <div className="grid grid-cols-1 gap-1 mb-2">
          <BlockDisplay
              key={EraserBlock.id}
              block={EraserBlock}
              size={40}
              isSelected={selectedBlockId === EraserBlock.id}
              onClick={() => handleBlockClick(EraserBlock.id)}
              className="cursor-pointer hover:opacity-80 w-full"
          />
        </div>
        <div className="flex flex-col gap-1">
            <button onClick={onClearGrid} className="minecraft-button !bg-orange-500 hover:!bg-orange-600 w-full text-xs">Clear Grid</button>
            {selectionArea && (
            <>
                <button 
                onClick={onFillSelection} 
                disabled={!selectedBlockId || selectedBlockId === EraserBlock.id}
                className="minecraft-button !bg-blue-500 hover:!bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed w-full text-xs"
                title={!selectedBlockId || selectedBlockId === EraserBlock.id ? "Select a block to fill" : "Fill selected area"}
                >
                Fill Selection
                </button>
                <button 
                onClick={onClearSelection} 
                className="minecraft-button !bg-yellow-500 hover:!bg-yellow-600 w-full text-xs"
                title="Clear selection outline"
                >
                Clear Selection
                </button>
            </>
            )}
        </div>
      </div>
      
      <div className="flex-grow overflow-y-auto pt-2 mt-2 border-t border-gray-600">
        {categoriesOrder.map(category => {
          let blocksToDisplay: BlockDefinition[] = [];
          if (category === BlockCategory.RECENT) {
            if (recentlyUsedBlocks.length === 0 && !searchTerm) return null; 
            blocksToDisplay = searchTerm ? recentlyUsedBlocks.filter(b => b.name.toLowerCase().includes(searchTerm.toLowerCase())) : recentlyUsedBlocks;
            if (blocksToDisplay.length === 0) return null;
          } else if (category === BlockCategory.UTILITY) {
             blocksToDisplay = blocksByCategory[category]?.filter(b => b.id !== EraserBlock.id) || [];
          } 
          else {
            blocksToDisplay = blocksByCategory[category] || [];
          }

          if (blocksToDisplay.length === 0) return null;

          return (
            <div key={category} className="mb-4">
              <h3 className="text-lg mb-2 text-sky-300">{category}</h3>
              <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-3 lg:grid-cols-4 gap-2">
                {blocksToDisplay.map(block => (
                  <BlockDisplay
                    key={block.id}
                    block={block}
                    size={40}
                    isSelected={selectedBlockId === block.id && currentTool !== Tool.ERASE }
                    onClick={() => handleBlockClick(block.id)}
                    className="cursor-pointer hover:opacity-80"
                  />
                ))}
              </div>
            </div>
          );
        })}
        {searchTerm && filteredBlockDefinitions.length === 0 && recentlyUsedBlocks.filter(b => b.name.toLowerCase().includes(searchTerm.toLowerCase())).length === 0 && (
          <p className="text-gray-400">No blocks match your search.</p>
        )}
      </div>
    </div>
  );
};

export default Palette;