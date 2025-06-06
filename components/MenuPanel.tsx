
import React from 'react';
import { BlockCount, SelectionArea, Tool } from '../types';
import { ALL_BLOCKS_MAP, EraserBlock } from '../constants';
import BlockDisplay from './BlockDisplay';

interface ToolbarProps { // Renamed from MenuPanelProps
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
  onClearGrid: () => void;
  onImportJSON: () => void;
  onExportJSON: () => void;
  currentTool: Tool; 
  selectionArea: SelectionArea | null; 
  onFillSelection: () => void; 
  onClearSelection: () => void;
}

const Toolbar: React.FC<ToolbarProps> = ({ // Renamed from MenuPanel
  onNew, onSave, onLoad, onExportPNG,
  onUndo, onRedo, canUndo, canRedo,
  totalArea, blockCounts, currentProjectName, selectedBlockId,
  gridRows, gridCols,
  onClearGrid, onImportJSON, onExportJSON,
  currentTool, selectionArea, onFillSelection, onClearSelection,
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
    <div className="minecraft-panel p-2 flex flex-wrap items-center justify-between gap-x-4 gap-y-2 text-sm">
      {/* Title and Main Project Actions */}
      <div className="flex items-center gap-2">
        <h1 className="text-2xl text-yellow-400 mr-4">Blueprint Planner</h1>
        <button onClick={onNew} className="minecraft-button">New</button>
        <button onClick={onSave} className="minecraft-button">Save</button>
        <button onClick={onLoad} className="minecraft-button">Load</button>
      </div>

      {/* History and Grid/Selection Actions */}
      <div className="flex items-center gap-2">
        <button onClick={onUndo} disabled={!canUndo} className="minecraft-button disabled:opacity-50 disabled:cursor-not-allowed">Undo</button>
        <button onClick={onRedo} disabled={!canRedo} className="minecraft-button disabled:opacity-50 disabled:cursor-not-allowed">Redo</button>
        <button onClick={onClearGrid} className="minecraft-button !bg-orange-500 hover:!bg-orange-600">Clear Grid</button>
        
        {selectionArea && (
          <>
            <button 
              onClick={onFillSelection} 
              disabled={!selectedBlockId || selectedBlockId === EraserBlock.id}
              className="minecraft-button !bg-blue-500 hover:!bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed"
              title={!selectedBlockId || selectedBlockId === EraserBlock.id ? "Select a block to fill" : "Fill selected area"}
            >
              Fill Sel.
            </button>
            <button 
              onClick={onClearSelection} 
              className="minecraft-button !bg-yellow-500 hover:!bg-yellow-600"
              title="Clear selection outline"
            >
              Clear Sel.
            </button>
          </>
        )}
      </div>
      
      {/* Import/Export */}
      <div className="flex items-center gap-2">
        <span className="text-sky-300">Manage:</span>
        <button onClick={onExportPNG} className="minecraft-button">Export PNG</button>
        <button onClick={onExportJSON} className="minecraft-button">Export JSON</button>
        <button onClick={onImportJSON} className="minecraft-button">Import JSON</button>
      </div>

      {/* Project Info */}
      <div className="flex items-center gap-x-3 gap-y-1 flex-wrap">
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

      {/* Material Quantities - could be a dropdown or modal if too long for toolbar */}
      {sortedBlockCounts.length > 0 && (
        <details className="minecraft-panel !bg-slate-700 !p-1.5 !border-2 relative group">
            <summary className="text-sky-300 text-xs cursor-pointer select-none">
                Materials ({sortedBlockCounts.reduce((acc, curr) => acc + curr.count, 0)})
                 <span className="group-open:hidden"> ▼</span>
                 <span className="hidden group-open:inline"> ▲</span>
            </summary>
            <div className="absolute top-full right-0 mt-1 p-2 bg-slate-800 border-2 border-slate-600 shadow-lg z-20 max-h-48 w-60 overflow-y-auto">
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
      )}
    </div>
  );
};

export default Toolbar;
