
import React, { useState, useEffect, useCallback, useMemo, createContext, useContext } from 'react';
import { BlockDefinition, Project, BlockCount, GridCellData, ToastMessage, Tool, SelectionArea } from './types';
import { 
  GRID_DEFAULT_ROWS, GRID_DEFAULT_COLS, EraserBlock, ALL_BLOCKS_MAP, BLOCK_DEFINITIONS,
  LOCAL_STORAGE_PROJECTS_KEY, LOCAL_STORAGE_RECENT_BLOCKS_KEY, MAX_RECENT_BLOCKS 
} from './constants';
import useLocalStorage from './hooks/useLocalStorage';
import Toolbar from './components/Toolbar';
import Palette from './components/Palette';
import Grid from './components/Grid';
import LoadProjectModal from './components/LoadProjectModal';
import SaveProjectModal from './components/SaveProjectModal';
import NewProjectModal from './components/NewProjectModal';
import ToastsContainer from './components/ToastsContainer';
import GridControls from './components/GridControls';
import ConfirmModal from './components/ConfirmModal'; 
import { exportToPNG } from './services/exportService';

export const GRID_CONTAINER_ID = 'blueprintGridItself';

type ToastContextType = { addToast: (toast: Omit<ToastMessage, 'id'>) => void };
const ToastContext = createContext<ToastContextType | undefined>(undefined);
export const useToasts = () => {
  const context = useContext(ToastContext);
  if (!context) throw new Error('useToasts must be used within a ToastProvider');
  return context;
};

const initNewGrid = (rows: number, cols: number): (string | null)[][] => {
  return Array(rows).fill(null).map(() => Array(cols).fill(null));
};

const App: React.FC = () => {
  const [gridRows, setGridRows] = useState(GRID_DEFAULT_ROWS);
  const [gridCols, setGridCols] = useState(GRID_DEFAULT_COLS);
  const [gridData, setGridData] = useState<(string | null)[][]>(() => initNewGrid(gridRows, gridCols));

  const [selectedBlockId, setSelectedBlockId] = useState<string | null>(null);
  const [currentTool, setCurrentTool] = useState<Tool>(Tool.DRAW);
  
  const [projects, setProjects] = useLocalStorage<Project[]>(LOCAL_STORAGE_PROJECTS_KEY, []);
  const [recentlyUsedBlockIds, setRecentlyUsedBlockIds] = useLocalStorage<string[]>(LOCAL_STORAGE_RECENT_BLOCKS_KEY, []);
  
  const [currentProjectId, setCurrentProjectId] = useState<string | null>(null);
  const [currentProjectName, setCurrentProjectName] = useState<string>('Untitled Project');

  const [showLoadModal, setShowLoadModal] = useState(false);
  const [showSaveModal, setShowSaveModal] = useState(false);
  const [showNewProjectModal, setShowNewProjectModal] = useState(false);
  const [showClearConfirmModal, setShowClearConfirmModal] = useState(false);
  const [showUnsavedChangesModal, setShowUnsavedChangesModal] = useState(false);
  const [actionToConfirm, setActionToConfirm] = useState<(() => void) | null>(null);

  const [history, setHistory] = useState<(string | null)[][][]>([gridData]);
  const [historyPointer, setHistoryPointer] = useState(0);
  const [isInternalHistoryUpdate, setIsInternalHistoryUpdate] = useState(false);

  const [toasts, setToasts] = useState<ToastMessage[]>([]);
  const [zoomLevel, setZoomLevel] = useState(1);
  const [resetPanSignal, setResetPanSignal] = useState(0); 

  const [selectionArea, setSelectionArea] = useState<SelectionArea | null>(null);
  const [isSelectingArea, setIsSelectingArea] = useState<boolean>(false);
  const [selectionStartCoords, setSelectionStartCoords] = useState<{row: number, col: number} | null>(null);

  const [isToolbarCollapsed, setIsToolbarCollapsed] = useState(true); // Toolbar starts collapsed


  const removeToast = useCallback((id: string) => {
    setToasts(prevToasts => prevToasts.filter(toast => toast.id !== id));
  }, []);

  const addToast = useCallback((toast: Omit<ToastMessage, 'id'>) => {
    const id = Math.random().toString(36).substring(2, 9);
    const currentToast = { ...toast, id };
    setToasts(prevToasts => [currentToast, ...prevToasts.slice(0, 4)]); 
    const duration = toast.duration === 0 ? 0 : (toast.duration || 4000);
    if (duration > 0) {
      setTimeout(() => removeToast(id), duration);
    }
  }, [removeToast]);

  useEffect(() => {
    (window as any).addToast = addToast;
    return () => { delete (window as any).addToast; };
  }, [addToast]);
  
  useEffect(() => {
    if (BLOCK_DEFINITIONS.length > 0 && !selectedBlockId) {
      setSelectedBlockId(BLOCK_DEFINITIONS[0].id);
    }
  }, [selectedBlockId]);

  const updateHistory = useCallback((newGridData: (string | null)[][]) => {
    const newHistory = history.slice(0, historyPointer + 1);
    newHistory.push(newGridData);
    setHistory(newHistory);
    setHistoryPointer(newHistory.length - 1);
  }, [history, historyPointer]);
  
  useEffect(() => {
    if (!isInternalHistoryUpdate && history[historyPointer] !== gridData) {
       updateHistory(gridData);
    }
    setIsInternalHistoryUpdate(false);
  }, [gridData, history, historyPointer, updateHistory, isInternalHistoryUpdate]);

  const totalArea = useMemo(() => {
    return gridData.reduce((sum, row) => sum + row.filter(cell => cell !== null).length, 0);
  }, [gridData]);

  const hasUnsavedChanges = useMemo(() => {
    if (historyPointer > 0 && totalArea > 0) return true;
    if (currentProjectId) {
        const savedProject = projects.find(p => p.id === currentProjectId);
        if (savedProject && JSON.stringify(savedProject.grid) !== JSON.stringify(gridData)) {
            return true;
        }
    } else if (totalArea > 0) { 
        return true;
    }
    return false;
  }, [gridData, historyPointer, totalArea, currentProjectId, projects]);


  const handleUndo = useCallback(() => {
    if (historyPointer > 0) {
      setIsInternalHistoryUpdate(true);
      setHistoryPointer(prev => prev - 1);
      setGridData(history[historyPointer - 1]);
      setSelectionArea(null);
      setIsSelectingArea(false);
    }
  }, [history, historyPointer]);

  const handleRedo = useCallback(() => {
    if (historyPointer < history.length - 1) {
      setIsInternalHistoryUpdate(true);
      setHistoryPointer(prev => prev + 1);
      setGridData(history[historyPointer + 1]);
      setSelectionArea(null); 
      setIsSelectingArea(false);
    }
  }, [history, historyPointer]);

  const proceedWithNewProject = useCallback(() => {
    setShowNewProjectModal(true);
  }, []);
  
  const handleNewProject = useCallback(() => {
    if (hasUnsavedChanges) {
        setActionToConfirm(() => proceedWithNewProject);
        setShowUnsavedChangesModal(true);
    } else {
        proceedWithNewProject();
    }
  }, [hasUnsavedChanges, proceedWithNewProject]);

  const confirmNewProject = useCallback((name: string, rows: number, cols: number) => {
    setGridRows(rows);
    setGridCols(cols);
    const newGrid = initNewGrid(rows, cols);
    setGridData(newGrid);
    setCurrentProjectName(name || 'Untitled Project');
    setCurrentProjectId(null);
    setHistory([newGrid]);
    setHistoryPointer(0);
    setShowNewProjectModal(false);
    setZoomLevel(1); 
    setResetPanSignal(prev => prev + 1);
    setSelectionArea(null);
    setIsSelectingArea(false);
    addToast({ message: `New project "${name || 'Untitled Project'}" created.`, type: 'success' });
  }, [addToast]);

  const handleSaveProject = useCallback(() => {
    setShowSaveModal(true);
  }, []);

  const confirmSaveProject = useCallback((projectName: string) => {
    const newProjectName = projectName.trim() || 'Untitled Project';
    let projectToSave: Project;
    const existingProjectIndex = projects.findIndex(p => p.id === currentProjectId);

    if (currentProjectId && existingProjectIndex !== -1) {
      projectToSave = {
        ...projects[existingProjectIndex],
        name: newProjectName,
        grid: gridData,
        rows: gridRows,
        cols: gridCols,
        updatedAt: new Date().toISOString(),
      };
      const updatedProjects = [...projects];
      updatedProjects[existingProjectIndex] = projectToSave;
      setProjects(updatedProjects);
    } else {
      projectToSave = {
        id: `proj_${new Date().getTime()}_${Math.random().toString(16).slice(2)}`,
        name: newProjectName,
        grid: gridData,
        rows: gridRows,
        cols: gridCols,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      setProjects(prev => [...prev, projectToSave]);
      setCurrentProjectId(projectToSave.id);
    }
    setCurrentProjectName(newProjectName);
    setShowSaveModal(false);
    addToast({ message: `Project "${newProjectName}" saved!`, type: 'success' });
  }, [gridData, gridRows, gridCols, currentProjectId, projects, setProjects, addToast]);

  const handleLoadProject = useCallback(() => {
    const loadAction = () => setShowLoadModal(true);
    if (hasUnsavedChanges) {
        setActionToConfirm(() => loadAction);
        setShowUnsavedChangesModal(true);
    } else {
        loadAction();
    }
  }, [hasUnsavedChanges]);

  const confirmLoadProject = useCallback((projectId: string) => {
    const projectToLoad = projects.find(p => p.id === projectId);
    if (projectToLoad) {
      setGridRows(projectToLoad.rows);
      setGridCols(projectToLoad.cols);
      setGridData(projectToLoad.grid);
      setCurrentProjectName(projectToLoad.name);
      setCurrentProjectId(projectToLoad.id);
      setHistory([projectToLoad.grid]); 
      setHistoryPointer(0);
      setShowLoadModal(false);
      setZoomLevel(1);
      setResetPanSignal(prev => prev + 1);
      setSelectionArea(null);
      setIsSelectingArea(false);
      addToast({ message: `Project "${projectToLoad.name}" loaded.`, type: 'success' });
    } else {
      addToast({ message: 'Error: Could not find project to load.', type: 'error' });
    }
  }, [projects, addToast]);

  const handleDeleteProject = useCallback((projectId: string) => {
    const projectToDelete = projects.find(p => p.id === projectId);
    setProjects(prev => prev.filter(p => p.id !== projectId));
    if (currentProjectId === projectId) {
        confirmNewProject('Untitled Project', GRID_DEFAULT_ROWS, GRID_DEFAULT_COLS);
    }
    addToast({ message: `Project "${projectToDelete?.name || ''}" deleted.`, type: 'info' });
  }, [projects, setProjects, currentProjectId, addToast, confirmNewProject]);

  const handleRequestClearGrid = useCallback(() => {
    if (totalArea > 0) { 
        setShowClearConfirmModal(true);
    } else {
        addToast({ message: "Grid is already empty.", type: "info"});
    }
  }, [totalArea, addToast]);

  const confirmClearGrid = useCallback(() => {
    const newGrid = initNewGrid(gridRows, gridCols);
    setGridData(newGrid);
    addToast({ message: "Grid cleared.", type: "info"});
    setShowClearConfirmModal(false);
    setSelectionArea(null);
    setIsSelectingArea(false);
  }, [gridRows, gridCols, addToast]);


  const handleCellAction = useCallback((row: number, col: number) => {
    if (row < 0 || row >= gridRows || col < 0 || col >= gridCols) return;
    if (currentTool === Tool.SELECT_AREA) return;

    const newGridData = gridData.map(r => [...r]);
    const currentBlockIdOnCell = newGridData[row][col];
    
    let blockToPlace: string | null = null;
    if (currentTool === Tool.ERASE || selectedBlockId === EraserBlock.id) {
        blockToPlace = null; 
    } else {
        blockToPlace = selectedBlockId;
    }

    if (currentTool === Tool.FILL) {
      if (!selectedBlockId || selectedBlockId === EraserBlock.id) {
          addToast({ message: "Cannot use fill tool with Eraser. Select a block.", type: 'error'});
          return;
      }
      if (blockToPlace === currentBlockIdOnCell) return; 

      const targetBlockId = newGridData[row][col];
      const q: [number, number][] = [[row, col]];
      const visited = new Set<string>();
      visited.add(`${row},${col}`);
      let filledCount = 0;

      while (q.length > 0) {
        const [r, c] = q.shift()!;
        if (newGridData[r][c] !== targetBlockId) continue;
        newGridData[r][c] = blockToPlace;
        filledCount++;
        [[0,1], [0,-1], [1,0], [-1,0]].forEach(([dr, dc]) => {
          const nr = r + dr;
          const nc = c + dc;
          if (nr >= 0 && nr < gridRows && nc >= 0 && nc < gridCols &&
              newGridData[nr][nc] === targetBlockId && !visited.has(`${nr},${nc}`)) {
            visited.add(`${nr},${nc}`);
            q.push([nr, nc]);
          }
        });
      }
      if (filledCount > 0) setGridData(newGridData);
    } else { 
      if (newGridData[row][col] === blockToPlace) return; 
      newGridData[row][col] = blockToPlace;
      setGridData(newGridData);
    }
  }, [gridData, gridRows, gridCols, selectedBlockId, currentTool, addToast]);

  const handleSelectionStart = useCallback((row: number, col: number) => {
    if (currentTool !== Tool.SELECT_AREA) return;
    setIsSelectingArea(true);
    setSelectionStartCoords({ row, col });
    setSelectionArea({ startRow: row, startCol: col, endRow: row, endCol: col });
  }, [currentTool]);

  const handleSelectionUpdate = useCallback((row: number, col: number) => {
    if (!isSelectingArea || !selectionStartCoords || currentTool !== Tool.SELECT_AREA) return;
    setSelectionArea({ 
        startRow: selectionStartCoords.row, 
        startCol: selectionStartCoords.col, 
        endRow: row, 
        endCol: col 
    });
  }, [isSelectingArea, selectionStartCoords, currentTool]);

  const handleSelectionEnd = useCallback(() => {
    if (!isSelectingArea || currentTool !== Tool.SELECT_AREA) return;
    setIsSelectingArea(false);
    setSelectionStartCoords(null);
    if (selectionArea) {
        const normalized = {
            startRow: Math.min(selectionArea.startRow, selectionArea.endRow),
            startCol: Math.min(selectionArea.startCol, selectionArea.endCol),
            endRow: Math.max(selectionArea.startRow, selectionArea.endRow),
            endCol: Math.max(selectionArea.startCol, selectionArea.endCol),
        };
        setSelectionArea(normalized);
    }
  }, [isSelectingArea, currentTool, selectionArea]);

  const handleFillSelection = useCallback(() => {
    if (!selectionArea || !selectedBlockId || selectedBlockId === EraserBlock.id) {
        addToast({message: "No area selected or no block chosen for fill.", type: "error"});
        return;
    }
    const newGridData = gridData.map(r => [...r]);
    for (let r = selectionArea.startRow; r <= selectionArea.endRow; r++) {
        for (let c = selectionArea.startCol; c <= selectionArea.endCol; c++) {
            if (r >= 0 && r < gridRows && c >= 0 && c < gridCols) {
                newGridData[r][c] = selectedBlockId;
            }
        }
    }
    setGridData(newGridData);
    addToast({message: "Selected area filled.", type: "success"});
  }, [selectionArea, selectedBlockId, gridData, gridRows, gridCols, addToast]);

  const handleClearSelection = useCallback(() => {
    setSelectionArea(null);
    setIsSelectingArea(false);
    setSelectionStartCoords(null);
  }, []);
  
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        if (selectionArea || isSelectingArea) {
          handleClearSelection();
        }
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [selectionArea, isSelectingArea, handleClearSelection]);


  const handleSelectBlock = useCallback((blockId: string) => {
    setSelectedBlockId(blockId);
    if (currentTool !== Tool.SELECT_AREA) { 
        if (blockId === EraserBlock.id) {
          setCurrentTool(Tool.ERASE);
        } else if ((currentTool as Tool) === Tool.ERASE) { 
          setCurrentTool(Tool.DRAW);
        }
    }

    if (blockId !== EraserBlock.id) {
        setRecentlyUsedBlockIds(prev => {
            const newRecent = [blockId, ...prev.filter(id => id !== blockId)];
            return newRecent.slice(0, MAX_RECENT_BLOCKS);
        });
    }
  }, [currentTool, setRecentlyUsedBlockIds, setSelectedBlockId, setCurrentTool]); 
  
  const handleSetTool = useCallback((tool: Tool) => {
      setCurrentTool(tool);
      if (tool === Tool.ERASE) {
          setSelectedBlockId(EraserBlock.id); 
          handleClearSelection(); 
      } else if (selectedBlockId === EraserBlock.id && tool !== Tool.SELECT_AREA) {
          const firstNonEraser = BLOCK_DEFINITIONS.find(b => b.id !== EraserBlock.id);
          setSelectedBlockId(firstNonEraser?.id || null);
      }
      if (tool !== Tool.SELECT_AREA) {
          handleClearSelection(); 
      }
  }, [selectedBlockId, setSelectedBlockId, setCurrentTool, handleClearSelection]); 

  const blockCounts = useMemo(() => {
    const counts: { [blockId: string]: number } = {};
    gridData.forEach(row => {
      row.forEach(cell => {
        if (cell !== null && cell !== EraserBlock.id) {
          counts[cell] = (counts[cell] || 0) + 1;
        }
      });
    });
    return counts;
  }, [gridData]);

  const handleExportPNG = useCallback(() => {
    exportToPNG(GRID_CONTAINER_ID, currentProjectName || 'minecraft_blueprint')
      .then(() => addToast({ message: 'PNG exported successfully!', type: 'success' }))
      .catch(() => {});
  }, [currentProjectName, addToast]);
  
  const handleZoomChange = useCallback((newZoom: number) => {
      setZoomLevel(Math.max(0.1, Math.min(newZoom, 10)));
  }, []);

  const handlePanReset = useCallback(() => {
      setResetPanSignal(prev => prev + 1);
  }, []);

  const handleExportProjectJSON = useCallback(() => {
    const projectData: Project = {
      id: currentProjectId || `export_${Date.now()}`,
      name: currentProjectName,
      grid: gridData,
      rows: gridRows,
      cols: gridCols,
      createdAt: projects.find(p=>p.id === currentProjectId)?.createdAt || new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    const jsonString = JSON.stringify(projectData, null, 2);
    const blob = new Blob([jsonString], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${currentProjectName.replace(/\s+/g, '_') || 'minecraft_project'}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    addToast({ message: "Project exported as JSON.", type: "success" });
  }, [currentProjectId, currentProjectName, gridData, gridRows, gridCols, projects, addToast]);

  const handleImportProjectJSON = useCallback(() => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.json,application/json';
    input.onchange = (event) => {
      const file = (event.target as HTMLInputElement)?.files?.[0];
      if (!file) return;

      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const jsonString = e.target?.result as string;
          const importedProject: Partial<Project> = JSON.parse(jsonString);

          if (!importedProject.name || !importedProject.grid || 
              typeof importedProject.rows !== 'number' || typeof importedProject.cols !== 'number') {
            throw new Error("Invalid project file format.");
          }
          
          if (!Array.isArray(importedProject.grid) || 
              !importedProject.grid.every(row => Array.isArray(row) && row.every(cell => typeof cell === 'string' || cell === null))) {
             throw new Error("Invalid grid data in project file.");
          }

          setGridRows(importedProject.rows);
          setGridCols(importedProject.cols);
          setGridData(importedProject.grid as (string | null)[][]);
          setCurrentProjectName(importedProject.name);
          setCurrentProjectId(null); 
          setHistory([importedProject.grid as (string | null)[][]]);
          setHistoryPointer(0);
          setZoomLevel(1);
          setResetPanSignal(prev => prev + 1);
          setSelectionArea(null);
          setIsSelectingArea(false);

          addToast({ message: `Project "${importedProject.name}" imported successfully.`, type: 'success' });
        } catch (error) {
          console.error("Error importing JSON:", error);
          const message = error instanceof Error ? error.message : "Unknown error during import.";
          addToast({ message: `Failed to import project: ${message}`, type: 'error' });
        }
      };
      reader.readAsText(file);
    };
    input.click();
  }, [addToast]);

  const toggleToolbarCollapse = useCallback(() => {
    setIsToolbarCollapsed(prev => !prev);
  }, []);

  return (
    <ToastContext.Provider value={{ addToast }}>
      <div className="flex flex-col h-screen bg-gray-700 text-white">
        <Toolbar
            onNew={handleNewProject}
            onSave={handleSaveProject}
            onLoad={handleLoadProject}
            onExportPNG={handleExportPNG}
            onUndo={handleUndo}
            onRedo={handleRedo}
            canUndo={historyPointer > 0}
            canRedo={historyPointer < history.length - 1}
            totalArea={totalArea}
            blockCounts={blockCounts}
            currentProjectName={currentProjectName}
            selectedBlockId={selectedBlockId}
            gridRows={gridRows}
            gridCols={gridCols}
            onImportJSON={handleImportProjectJSON}
            onExportJSON={handleExportProjectJSON}
            isCollapsed={isToolbarCollapsed}
            onToggleCollapse={toggleToolbarCollapse}
        />
        <div className="flex flex-row flex-grow overflow-hidden p-2 gap-2">
          <Palette
            className="w-[280px] flex-shrink-0 h-full" 
            selectedBlockId={selectedBlockId}
            onSelectBlock={handleSelectBlock}
            recentlyUsedBlockIds={recentlyUsedBlockIds}
            currentTool={currentTool}
            onSetTool={handleSetTool}
            onClearGrid={handleRequestClearGrid} // Added prop
            selectionArea={selectionArea} // Added prop
            onFillSelection={handleFillSelection} // Added prop
            onClearSelection={handleClearSelection} // Added prop
          />
          <div className="flex-grow h-full relative flex flex-col"> 
             <Grid
                gridData={gridData}
                onCellAction={handleCellAction}
                rows={gridRows}
                cols={gridCols}
                currentTool={currentTool}
                selectedBlockId={selectedBlockId}
                zoomLevel={zoomLevel}
                onZoomChange={handleZoomChange}
                resetPanSignal={resetPanSignal}
                selectionArea={selectionArea}
                isSelectingArea={isSelectingArea}
                onSelectionStart={handleSelectionStart}
                onSelectionUpdate={handleSelectionUpdate}
                onSelectionEnd={handleSelectionEnd}
             />
             <GridControls 
                zoomLevel={zoomLevel}
                onZoomChange={handleZoomChange}
                onPanReset={handlePanReset}
             />
          </div>
        </div>

        <LoadProjectModal
          isOpen={showLoadModal}
          onClose={() => setShowLoadModal(false)}
          projects={projects}
          onLoadProject={confirmLoadProject}
          onDeleteProject={handleDeleteProject}
        />
        <SaveProjectModal
          isOpen={showSaveModal}
          onClose={() => setShowSaveModal(false)}
          onSave={confirmSaveProject}
          currentName={currentProjectName}
        />
        <NewProjectModal
            isOpen={showNewProjectModal}
            onClose={() => setShowNewProjectModal(false)}
            onConfirm={confirmNewProject}
            defaultRows={GRID_DEFAULT_ROWS}
            defaultCols={GRID_DEFAULT_COLS}
        />
        <ConfirmModal
            isOpen={showClearConfirmModal}
            title="Clear Grid"
            message="Are you sure you want to clear the entire grid? This action can be undone."
            onConfirm={confirmClearGrid}
            onCancel={() => setShowClearConfirmModal(false)}
            confirmText="Clear Grid"
        />
        <ConfirmModal
            isOpen={showUnsavedChangesModal}
            title="Unsaved Changes"
            message="You have unsaved changes. Are you sure you want to proceed without saving?"
            onConfirm={() => {
                if (actionToConfirm) actionToConfirm();
                setShowUnsavedChangesModal(false);
                setActionToConfirm(null);
            }}
            onCancel={() => {
                setShowUnsavedChangesModal(false);
                setActionToConfirm(null);
            }}
            confirmText="Proceed"
        />
        <ToastsContainer toasts={toasts} removeToast={removeToast} />
      </div>
    </ToastContext.Provider>
  );
};

export default App;