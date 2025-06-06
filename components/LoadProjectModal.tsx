
import React from 'react';
import { Project } from '../types';
import Modal from './Modal';

interface LoadProjectModalProps {
  isOpen: boolean;
  onClose: () => void;
  projects: Project[];
  onLoadProject: (projectId: string) => void;
  onDeleteProject: (projectId: string) => void;
}

const LoadProjectModal: React.FC<LoadProjectModalProps> = ({ isOpen, onClose, projects, onLoadProject, onDeleteProject }) => {
  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Load Project">
      {projects.length === 0 ? (
        <p>No saved projects found.</p>
      ) : (
        <ul className="space-y-2 max-h-96 overflow-y-auto">
          {projects.sort((a,b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()).map(project => (
            <li key={project.id} className="flex justify-between items-center p-2 minecraft-panel !bg-slate-600 hover:!bg-slate-500">
              <div>
                <p className="font-semibold text-lg">{project.name}</p>
                <p className="text-xs text-gray-300">
                  Last saved: {new Date(project.updatedAt).toLocaleString()}
                </p>
                <p className="text-xs text-gray-300">
                  Dimensions: {project.rows}x{project.cols}
                </p>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => onLoadProject(project.id)}
                  className="minecraft-button !bg-green-500 hover:!bg-green-600"
                >
                  Load
                </button>
                <button
                  onClick={() => onDeleteProject(project.id)}
                  className="minecraft-button !bg-red-600 hover:!bg-red-700"
                >
                  Delete
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </Modal>
  );
};

export default LoadProjectModal;
