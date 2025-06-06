
import React, { useRef, useState, useCallback, WheelEvent, MouseEvent as ReactMouseEvent, useEffect, useMemo } from 'react';
import { BlockDefinition, Tool, SelectionArea } from '../types';
import { ALL_BLOCKS_MAP, CELL_SIZE_DEFAULT, EraserBlock } from '../constants';
import BlockDisplay from './BlockDisplay';
import { GRID_CONTAINER_ID } from '../App'; 

interface GridProps {
  gridData: (string | null)[][];
  onCellAction: (row: number, col: number, isSelectionDrag?: boolean) => void; // Added isSelectionDrag
  rows: number;
  cols: number;
  currentTool: Tool;
  selectedBlockId: string | null;
  zoomLevel: number;
  onZoomChange: (newZoomLevel: number) => void;
  resetPanSignal?: number;
  selectionArea: SelectionArea | null; // Current selection area from App
  isSelectingArea: boolean; // Is user currently dragging to select
  onSelectionStart: (row: number, col: number) => void;
  onSelectionUpdate: (row: number, col: number) => void;
  onSelectionEnd: () => void;
}

const Grid: React.FC<GridProps> = ({ 
  gridData, onCellAction, rows, cols, 
  currentTool, selectedBlockId,
  zoomLevel, onZoomChange, resetPanSignal,
  selectionArea, isSelectingArea, 
  onSelectionStart, onSelectionUpdate, onSelectionEnd
}) => {
  const [isMouseDown, setIsMouseDown] = useState(false);
  const [isMiddleMouseDown, setIsMiddleMouseDown] = useState(false);
  const gridContainerRef = useRef<HTMLDivElement>(null);
  const gridItselfRef = useRef<HTMLDivElement>(null);

  const [panState, setPanState] = useState<{startX: number, startY: number, panX: number, panY: number, isPanning: boolean}>({
    startX: 0, startY: 0, panX: 0, panY: 0, isPanning: false
  });

  const baseCellSize = CELL_SIZE_DEFAULT;

  useEffect(() => {
    if (resetPanSignal !== undefined) {
        setPanState(prev => ({ ...prev, panX: 0, panY: 0 }));
    }
  }, [resetPanSignal]);


  const getCursor = () => {
    if (panState.isPanning || isMiddleMouseDown) return 'grabbing';
    if (currentTool === Tool.SELECT_AREA) return 'cell'; // Or a more specific selection cursor
    if (selectedBlockId === EraserBlock.id || currentTool === Tool.ERASE) return 'url("data:image/svg+xml;utf8,<svg xmlns=\\"http://www.w3.org/2000/svg\\" width=\\"24\\" height=\\"24\\" viewBox=\\"0 0 24 24\\" fill=\\"none\\" stroke=\\"%23FF6B6B\\" stroke-width=\\"2\\" stroke-linecap=\\"round\\" stroke-linejoin=\\"round\\"><path d=\\"M12 22h6a2 2 0 0 0 2-2V7l-5-5H6a2 2 0 0 0-2 2v10\\"/><path d=\\"M14 2v4a2 2 0 0 0 2 2h4\\"/><line x1=\\"10.5\\" y1=\\"12.5\\" x2=\\"15.5\\" y2=\\"17.5\\"/><line x1=\\"15.5\\" y1=\\"12.5\\" x2=\\"10.5\\" y2=\\"17.5\\"/></svg>") 12 12, auto';
    if (currentTool === Tool.FILL) return 'url("data:image/svg+xml;utf8,<svg xmlns=\\"http://www.w3.org/2000/svg\\" width=\\"24\\" height=\\"24\\" viewBox=\\"0 0 24 24\\" fill=\\"%237DD3FC\\" stroke=\\"%230C4A6E\\" stroke-width=\\"1.5\\"><path d=\\"M19 11.05V19a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2v-7.95c0-.86.69-1.55 1.55-1.55h10.9c.86 0 1.55.69 1.55 1.55ZM5.65 8.5l6.35-6.35a.5.5 0 0 1 .7 0l6.35 6.35H5.65Z\\"/></svg>") 12 12, pointer';
    return 'crosshair';
  };

  const handleCellMouseDown = (row: number, col: number, event: ReactMouseEvent) => {
    if (event.button === 0) { // Left click
      if (currentTool === Tool.SELECT_AREA) {
        onSelectionStart(row, col);
        event.preventDefault(); // Prevent text selection if any
        return;
      }
      if (event.ctrlKey || event.metaKey) {
        setPanState(prev => ({ ...prev, startX: event.clientX, startY: event.clientY, isPanning: true }));
        event.preventDefault();
        return;
      }
      setIsMouseDown(true);
      onCellAction(row, col);
    } else if (event.button === 1) { // Middle click
      event.preventDefault(); 
      setIsMiddleMouseDown(true);
      setPanState(prev => ({ ...prev, startX: event.clientX, startY: event.clientY, isPanning: false })); 
    }
  };

  const handleMouseEnter = (row: number, col: number) => {
    if (isSelectingArea && currentTool === Tool.SELECT_AREA) {
        onSelectionUpdate(row, col);
    } else if (isMouseDown && !panState.isPanning && !isMiddleMouseDown && currentTool !== Tool.SELECT_AREA) {
      if (currentTool === Tool.DRAW || currentTool === Tool.ERASE) {
         onCellAction(row, col);
      }
    }
  };
  
  const handleContainerMouseMove = useCallback((event: ReactMouseEvent<HTMLDivElement>) => {
    if (isSelectingArea && currentTool === Tool.SELECT_AREA && gridItselfRef.current) {
        const rect = gridItselfRef.current.getBoundingClientRect();
        // Calculate row/col based on mouse position relative to the scaled and panned grid
        const x = event.clientX - rect.left;
        const y = event.clientY - rect.top;
        const col = Math.floor(x / (baseCellSize * zoomLevel));
        const row = Math.floor(y / (baseCellSize * zoomLevel));
        onSelectionUpdate(Math.max(0, Math.min(rows - 1, row)), Math.max(0, Math.min(cols - 1, col)));
    } else if (gridItselfRef.current) {
        if (panState.isPanning) { 
            const dx = event.clientX - panState.startX;
            const dy = event.clientY - panState.startY;
            gridItselfRef.current.style.transform = `translate(${panState.panX + dx}px, ${panState.panY + dy}px) scale(${zoomLevel})`;
        } else if (isMiddleMouseDown) { 
            const dx = event.clientX - panState.startX;
            const dy = event.clientY - panState.startY;
            gridItselfRef.current.style.transform = `translate(${panState.panX + dx}px, ${panState.panY + dy}px) scale(${zoomLevel})`;
        }
    }
  }, [isSelectingArea, currentTool, onSelectionUpdate, panState.isPanning, panState.startX, panState.startY, panState.panX, panState.panY, zoomLevel, isMiddleMouseDown, rows, cols, baseCellSize]);

  const handleGlobalMouseUp = useCallback((event: globalThis.MouseEvent) => {
    if (isSelectingArea && currentTool === Tool.SELECT_AREA) {
      onSelectionEnd();
    }
    if (panState.isPanning) { 
        const dx = event.clientX - panState.startX;
        const dy = event.clientY - panState.startY;
        setPanState(prev => ({ ...prev, panX: prev.panX + dx, panY: prev.panY + dy, isPanning: false }));
    }
    if (isMiddleMouseDown && event.button === 1) { 
        const dx = event.clientX - panState.startX;
        const dy = event.clientY - panState.startY;
        setPanState(prev => ({ ...prev, panX: prev.panX + dx, panY: prev.panY + dy, isPanning: false }));
        setIsMiddleMouseDown(false);
    }
    setIsMouseDown(false);
  }, [isSelectingArea, currentTool, onSelectionEnd, panState.isPanning, panState.startX, panState.startY, isMiddleMouseDown, setIsMouseDown, setPanState, setIsMiddleMouseDown]); 

  useEffect(() => {
    const shouldListen = panState.isPanning || isMiddleMouseDown || (isSelectingArea && currentTool === Tool.SELECT_AREA);
    if (shouldListen) {
      const moveHandler = (e: globalThis.MouseEvent) => {
         if (isSelectingArea && currentTool === Tool.SELECT_AREA && gridItselfRef.current) {
            const rect = gridItselfRef.current.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            const col = Math.floor(x / (baseCellSize * zoomLevel));
            const row = Math.floor(y / (baseCellSize * zoomLevel));
             onSelectionUpdate(Math.max(0, Math.min(rows - 1, row)), Math.max(0, Math.min(cols - 1, col)));
         } else if (gridItselfRef.current) {
            if (panState.isPanning) {
                const dx = e.clientX - panState.startX;
                const dy = e.clientY - panState.startY;
                gridItselfRef.current.style.transform = `translate(${panState.panX + dx}px, ${panState.panY + dy}px) scale(${zoomLevel})`;
            } else if (isMiddleMouseDown) {
                const dx = e.clientX - panState.startX;
                const dy = e.clientY - panState.startY;
                gridItselfRef.current.style.transform = `translate(${panState.panX + dx}px, ${panState.panY + dy}px) scale(${zoomLevel})`;
            }
        }
      };
      document.addEventListener('mousemove', moveHandler);
      document.addEventListener('mouseup', handleGlobalMouseUp);

      return () => {
        document.removeEventListener('mousemove', moveHandler);
        document.removeEventListener('mouseup', handleGlobalMouseUp);
      };
    }
  }, [panState.isPanning, isMiddleMouseDown, handleGlobalMouseUp, panState.startX, panState.startY, panState.panX, panState.panY, zoomLevel, isSelectingArea, currentTool, onSelectionUpdate, rows, cols, baseCellSize]);
  
  useEffect(() => {
    if (gridItselfRef.current) {
        gridItselfRef.current.style.transform = `translate(${panState.panX}px, ${panState.panY}px) scale(${zoomLevel})`;
    }
  }, [zoomLevel, panState.panX, panState.panY]);

  const handleWheel = useCallback((event: WheelEvent<HTMLDivElement>) => {
    if (event.ctrlKey || event.metaKey) { 
      event.preventDefault();
      const zoomSpeed = 0.1;
      const newZoomLevel = event.deltaY > 0 ? zoomLevel * (1 - zoomSpeed) : zoomLevel * (1 + zoomSpeed);
      onZoomChange(newZoomLevel);
    }
  }, [zoomLevel, onZoomChange]);

  const normalizedSelectionArea = useMemo(() => {
    if (!selectionArea) return null;
    return {
      startRow: Math.min(selectionArea.startRow, selectionArea.endRow),
      startCol: Math.min(selectionArea.startCol, selectionArea.endCol),
      endRow: Math.max(selectionArea.startRow, selectionArea.endRow),
      endCol: Math.max(selectionArea.startCol, selectionArea.endCol),
    };
  }, [selectionArea]);

  return (
    <div 
      ref={gridContainerRef}
      className="minecraft-panel p-0 overflow-hidden flex-grow select-none relative bg-slate-800 h-full w-full"
      onWheel={handleWheel}
      onMouseMove={handleContainerMouseMove}
      onMouseUp={(e) => {
        if (e.button === 0 && (isSelectingArea || isMouseDown)) handleGlobalMouseUp(e.nativeEvent);
        if (e.button === 1 && isMiddleMouseDown) handleGlobalMouseUp(e.nativeEvent); 
      }}
      onMouseLeave={() => { 
        if (!isMiddleMouseDown && !isSelectingArea) setIsMouseDown(false); 
      }}
      style={{ cursor: getCursor(), touchAction: 'none' }} 
      onContextMenu={(e) => e.preventDefault()}
    >
      <div
        ref={gridItselfRef}
        id={GRID_CONTAINER_ID} 
        className="inline-block border-2 border-black origin-top-left relative" // Added relative for selection overlay
        style={{
          display: 'grid',
          gridTemplateColumns: `repeat(${cols}, ${baseCellSize}px)`,
          gridTemplateRows: `repeat(${rows}, ${baseCellSize}px)`,
          width: `${cols * baseCellSize}px`,
          height: `${rows * baseCellSize}px`,
        }}
      >
        {gridData.map((rowArr, rowIndex) =>
          rowArr.map((blockId, colIndex) => {
            const blockDef = blockId ? ALL_BLOCKS_MAP.get(blockId) || null : null;
            return (
              <div
                key={`${rowIndex}-${colIndex}`}
                onMouseDown={(e) => handleCellMouseDown(rowIndex, colIndex, e)}
                onMouseEnter={() => handleMouseEnter(rowIndex, colIndex)}
                className="hover:ring-1 hover:ring-yellow-400 hover:ring-inset z-0 hover:z-10 transition-shadow" 
              >
                <BlockDisplay block={blockDef} size={baseCellSize} />
              </div>
            );
          })
        )}
         {normalizedSelectionArea && (
          <div
            className="absolute border-2 border-yellow-400 bg-yellow-400 bg-opacity-30 pointer-events-none z-20"
            style={{
              left: `${normalizedSelectionArea.startCol * baseCellSize}px`,
              top: `${normalizedSelectionArea.startRow * baseCellSize}px`,
              width: `${(normalizedSelectionArea.endCol - normalizedSelectionArea.startCol + 1) * baseCellSize}px`,
              height: `${(normalizedSelectionArea.endRow - normalizedSelectionArea.startRow + 1) * baseCellSize}px`,
            }}
          />
        )}
      </div>
    </div>
  );
};

export default Grid;
