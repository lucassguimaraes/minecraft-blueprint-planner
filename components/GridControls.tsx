
import React from 'react';

interface GridControlsProps {
  zoomLevel: number;
  onZoomChange: (newZoomLevel: number) => void;
  onPanReset?: () => void;
}

const GridControls: React.FC<GridControlsProps> = ({ zoomLevel, onZoomChange, onPanReset }) => {
  const zoomSpeed = 0.2; 

  const handleZoomIn = () => {
    onZoomChange(zoomLevel * (1 + zoomSpeed));
  };

  const handleZoomOut = () => {
    onZoomChange(zoomLevel * (1 - zoomSpeed));
  };

  const handleZoomReset = () => {
    onZoomChange(1);
  };

  return (
    <div className="absolute bottom-2 right-2 flex gap-1 p-1 bg-slate-700/80 rounded-none border-2 border-slate-600/80 shadow-md">
      <button
        title="Zoom In (Ctrl + Mouse Wheel Up)"
        onClick={handleZoomIn}
        className="minecraft-button !p-2 !m-0"
        aria-label="Zoom In"
      >
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
          <path d="M8 4a.5.5 0 0 1 .5.5v3h3a.5.5 0 0 1 0 1h-3v3a.5.5 0 0 1-1 0v-3h-3a.5.5 0 0 1 0-1h3v-3A.5.5 0 0 1 8 4z"/>
        </svg>
      </button>
      <button
        title="Zoom Out (Ctrl + Mouse Wheel Down)"
        onClick={handleZoomOut}
        className="minecraft-button !p-2 !m-0"
        aria-label="Zoom Out"
      >
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
          <path d="M4 8a.5.5 0 0 1 .5-.5h7a.5.5 0 0 1 0 1h-7A.5.5 0 0 1 4 8z"/>
        </svg>
      </button>
      <button
        title="Reset Zoom"
        onClick={handleZoomReset}
        disabled={zoomLevel === 1}
        className="minecraft-button !p-2 !m-0 disabled:opacity-50"
        aria-label="Reset Zoom"
      >
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
         <path fillRule="evenodd" d="M8 3a5 5 0 1 0 4.546 2.914.5.5 0 0 1 .908-.417A6 6 0 1 1 8 2v1z"/>
         <path d="M8 4.466V.534a.25.25 0 0 1 .41-.192l2.36 1.966c.12.1.12.284 0 .384L8.41 4.658A.25.25 0 0 1 8 4.466z"/>
        </svg>
      </button>
      
      {onPanReset && (
        <button 
          title="Reset Pan"
          onClick={onPanReset}
          className="minecraft-button !p-2 !m-0"
          aria-label="Reset Pan"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
            <path fillRule="evenodd" d="M0 8a8 8 0 1 1 16 0A8 8 0 0 1 0 8zm8-5a.5.5 0 0 1 .5.5v2.036a2.5 2.5 0 0 1 0 4.928V12.5a.5.5 0 0 1-1 0V9.964a2.5 2.5 0 0 1 0-4.928V3.5A.5.5 0 0 1 8 3zm0 3a1.5 1.5 0 1 0 0 3 1.5 1.5 0 0 0 0-3z"/>
          </svg>
        </button>
      )}
    </div>
  );
};

export default GridControls;