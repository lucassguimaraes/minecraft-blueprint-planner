
import React, { useState, useEffect } from 'react';
import Modal from './Modal';

interface SaveProjectModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (projectName: string) => void;
  currentName?: string;
}

const SaveProjectModal: React.FC<SaveProjectModalProps> = ({ isOpen, onClose, onSave, currentName }) => {
  const [projectName, setProjectName] = useState(currentName || '');

  useEffect(() => {
    if (isOpen) {
      setProjectName(currentName || `My Build ${new Date().toLocaleDateString()}`);
    }
  }, [isOpen, currentName]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (projectName.trim()) {
      onSave(projectName.trim());
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Save Project">
      <form onSubmit={handleSubmit}>
        <label htmlFor="projectName" className="block mb-2 text-lg">Project Name:</label>
        <input
          type="text"
          id="projectName"
          value={projectName}
          onChange={(e) => setProjectName(e.target.value)}
          className="w-full p-2 mb-4 bg-slate-800 border-2 border-slate-600 text-white focus:border-yellow-400 outline-none"
          required
        />
        <div className="flex justify-end gap-2">
          <button type="button" onClick={onClose} className="minecraft-button !bg-gray-500 hover:!bg-gray-600">
            Cancel
          </button>
          <button type="submit" className="minecraft-button !bg-green-500 hover:!bg-green-600">
            Save
          </button>
        </div>
      </form>
    </Modal>
  );
};

export default SaveProjectModal;
