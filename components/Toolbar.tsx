import React from 'react';
import { BlockCount, SelectionArea, Tool } from '../types';
import { ALL_BLOCKS_MAP, EraserBlock } from '../constants';
import BlockDisplay from './BlockDisplay';

interface ToolbarProps {
  onNew: () => void;
  onSave: () => void;
  onLoad: () => void;
  onExportPNG: () => void;
  onUndo: () => void;
  onRedo: () => void;
  canUndo: boolean;
  canRedo: boolean;
  totalArea: number;
  blockCounts: { [blockId: string]: number };
  currentProjectName: string;
  selectedBlockId: string | null;
  gridRows: number;
  gridCols: number;
  // onClearGrid: () => void; // Removed
  onImportJSON: () => void;
  onExportJSON: () => void;
  // currentTool: Tool; // Potentially removable if not used for other logic
  // selectionArea: SelectionArea | null; // Removed
  // onFillSelection: () => void; // Removed
  // onClearSelection: () => void; // Removed
  isCollapsed: boolean;
  onToggleCollapse: () => void;
}

const Toolbar: React.FC<ToolbarProps> = ({
  onNew, onSave, onLoad, onExportPNG,
  onUndo, onRedo, canUndo, canRedo,
  totalArea, blockCounts, currentProjectName, selectedBlockId,
  gridRows, gridCols,
  onImportJSON, onExportJSON,
  isCollapsed, onToggleCollapse
}) => {
  const selectedBlockDef = selectedBlockId ? ALL_BLOCKS_MAP.get(selectedBlockId) : null;

  const sortedBlockCounts: BlockCount[] = Object.entries(blockCounts)
    .map(([id, count]) => {
      const def = ALL_BLOCKS_MAP.get(id);
      return {
        id: id,
        name: def?.name || 'Unknown',
        count,
        color: def?.color || 'bg-gray-500', 
        hexColor: def?.hexColor || '#808080', 
        iconSymbol: def?.iconSymbol
      };
    })
    .filter(bc => bc.count > 0 && bc.id !== EraserBlock.id) 
    .sort((a, b) => b.count - a.count);

  return (
    <div className="minecraft-panel p-2 flex flex-col gap-y-2 text-sm">
      {/* Always Visible Section */}
      <div className="flex flex-wrap items-center justify-between gap-x-4 gap-y-2">
        <div className="flex items-center gap-2">
          <h1 className="text-2xl text-yellow-400 mr-4">Blueprint Planner</h1>
          <button onClick={onNew} className="minecraft-button">New</button>
          <button onClick={onSave} className="minecraft-button">Save</button>
          <button onClick={onLoad} className="minecraft-button">Load</button>
        </div>

        <div className="flex items-center gap-2">
          <button onClick={onUndo} disabled={!canUndo} className="minecraft-button disabled:opacity-50 disabled:cursor-not-allowed">Undo</button>
          <button onClick={onRedo} disabled={!canRedo} className="minecraft-button disabled:opacity-50 disabled:cursor-not-allowed">Redo</button>
          <button 
            onClick={onToggleCollapse} 
            className="minecraft-button !bg-sky-600 hover:!bg-sky-700"
            aria-expanded={!isCollapsed}
            aria-controls="collapsible-toolbar-section"
          >
            {isCollapsed ? 'More Options ▼' : 'Less Options ▲'}
          </button>
        </div>
      </div>

      {/* Collapsible Section */}
      {!isCollapsed && (
        <div id="collapsible-toolbar-section" className="flex flex-col gap-y-2 pt-2 border-t-2 border-gray-600">
          <div className="flex flex-wrap items-center gap-x-4 gap-y-2">
            {/* Grid/Selection Actions - MOVED TO PALETTE */}
            
            {/* Import/Export */}
            <div className="flex items-center gap-2">
              <span className="text-sky-300">Manage:</span>
              <button onClick={onExportPNG} className="minecraft-button">Export PNG</button>
              <button onClick={onExportJSON} className="minecraft-button">Export JSON</button>
              <button onClick={onImportJSON} className="minecraft-button">Import JSON</button>
            </div>
          </div>

          {/* Project Info */}
          <div className="flex items-center gap-x-3 gap-y-1 flex-wrap pt-2 border-t-2 border-gray-600">
            <div className="minecraft-panel !bg-slate-700 !p-1.5 !border-2">
              <span className="text-sky-300 text-xs">Project: </span>
              <span className="truncate font-semibold" title={currentProjectName}>{currentProjectName || "Untitled"}</span>
            </div>
            <div className="minecraft-panel !bg-slate-700 !p-1.5 !border-2">
              <span className="text-sky-300 text-xs">Size: </span>
              <span className="font-semibold">{gridRows}x{gridCols}</span>
            </div>
            <div className="minecraft-panel !bg-slate-700 !p-1.5 !border-2">
              <span className="text-sky-300 text-xs">Blocks: </span>
              <span className="font-semibold">{totalArea}</span>
            </div>
            <div className="minecraft-panel !bg-slate-700 !p-1.5 !border-2 flex items-center gap-1">
              <span className="text-sky-300 text-xs">Selected: </span>
              {selectedBlockDef ? (
                <>
                  <BlockDisplay block={selectedBlockDef} size={16} />
                  <span className="truncate font-semibold text-xs">{selectedBlockDef.name}</span>
                </>
              ) : (
                <span className="text-xs">None</span>
              )}
            </div>
          </div>

          {/* Material Quantities */}
          {sortedBlockCounts.length > 0 && (
             <div className="pt-2 border-t-2 border-gray-600">
                <details className="minecraft-panel !bg-slate-700 !p-1.5 !border-2 relative group w-fit">
                    <summary className="text-sky-300 text-xs cursor-pointer select-none">
                        Materials ({sortedBlockCounts.reduce((acc, curr) => acc + curr.count, 0)})
                        <span className="group-open:hidden"> ▼</span>
                        <span className="hidden group-open:inline"> ▲</span>
                    </summary>
                    <div className="absolute top-full left-0 mt-1 p-2 bg-slate-800 border-2 border-slate-600 shadow-lg z-20 max-h-48 w-60 overflow-y-auto">
                        {sortedBlockCounts.map(bc => (
                        <div key={bc.id} className="flex items-center justify-between gap-2 py-0.5 text-xs" title={`${bc.name}: ${bc.count}`}>
                            <div className="flex items-center gap-1 truncate">
                                <BlockDisplay
                                block={ALL_BLOCKS_MAP.get(bc.id) || null} 
                                size={14}
                                />
                                <span className="truncate flex-grow">{bc.name}</span>
                            </div>
                            <span className="font-bold">{bc.count}</span>
                        </div>
                        ))}
                    </div>
                </details>
             </div>
          )}
        </div>
      )}
    </div>
  );
};

export default Toolbar;