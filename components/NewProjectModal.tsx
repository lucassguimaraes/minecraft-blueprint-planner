
import React, { useState, useEffect, FormEvent } from 'react';
import Modal from './Modal';
import { GRID_DEFAULT_ROWS, GRID_DEFAULT_COLS } from '../constants';

interface NewProjectModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (projectName: string, rows: number, cols: number) => void;
  defaultRows?: number;
  defaultCols?: number;
}

const NewProjectModal: React.FC<NewProjectModalProps> = ({ 
    isOpen, onClose, onConfirm,
    defaultRows = GRID_DEFAULT_ROWS,
    defaultCols = GRID_DEFAULT_COLS
}) => {
  const [projectName, setProjectName] = useState('');
  const [rows, setRows] = useState<string | number>(defaultRows);
  const [cols, setCols] = useState<string | number>(defaultCols);

  useEffect(() => {
    if (isOpen) {
      setProjectName(`My New Plan ${new Date().toLocaleDateString()}`);
      setRows(defaultRows);
      setCols(defaultCols);
    }
  }, [isOpen, defaultRows, defaultCols]);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    const numRows = parseInt(String(rows), 10);
    const numCols = parseInt(String(cols), 10);

    if (isNaN(numRows) || numRows <= 0 || numRows > 200) {
      alert('Please enter a valid number of rows (1-200).');
      return;
    }
    if (isNaN(numCols) || numCols <= 0 || numCols > 200) {
      alert('Please enter a valid number of columns (1-200).');
      return;
    }
    if (!projectName.trim()){
      alert('Please enter a project name.');
      return;
    }

    onConfirm(projectName.trim(), numRows, numCols);
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Create New Project">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="newProjectName" className="block mb-1 text-md">Project Name:</label>
          <input
            type="text"
            id="newProjectName"
            value={projectName}
            onChange={(e) => setProjectName(e.target.value)}
            className="w-full p-2 bg-slate-800 border-2 border-slate-600 text-white focus:border-yellow-400 outline-none"
            required
          />
        </div>
        <div className="flex gap-4">
          <div className="flex-1">
            <label htmlFor="newProjectRows" className="block mb-1 text-md">Rows (Height):</label>
            <input
              type="number"
              id="newProjectRows"
              value={rows}
              onChange={(e) => setRows(e.target.value)}
              className="w-full p-2 bg-slate-800 border-2 border-slate-600 text-white focus:border-yellow-400 outline-none"
              min="1"
              max="200"
              required
            />
          </div>
          <div className="flex-1">
            <label htmlFor="newProjectCols" className="block mb-1 text-md">Columns (Width):</label>
            <input
              type="number"
              id="newProjectCols"
              value={cols}
              onChange={(e) => setCols(e.target.value)}
              className="w-full p-2 bg-slate-800 border-2 border-slate-600 text-white focus:border-yellow-400 outline-none"
              min="1"
              max="200"
              required
            />
          </div>
        </div>
        <div className="flex justify-end gap-2 pt-2">
          <button type="button" onClick={onClose} className="minecraft-button !bg-gray-500 hover:!bg-gray-600">
            Cancel
          </button>
          <button type="submit" className="minecraft-button !bg-green-500 hover:!bg-green-600">
            Create Project
          </button>
        </div>
      </form>
    </Modal>
  );
};

export default NewProjectModal;
