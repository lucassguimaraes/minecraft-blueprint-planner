import React from 'react';
import Modal from './Modal';

interface ConfirmModalProps {
  isOpen: boolean;
  title: string;
  message: React.ReactNode; // Allow more complex messages, e.g. with JSX
  onConfirm: () => void;
  onCancel: () => void;
  confirmText?: string;
  cancelText?: string;
  confirmButtonClass?: string;
  cancelButtonClass?: string;
}

const ConfirmModal: React.FC<ConfirmModalProps> = ({
  isOpen,
  title,
  message,
  onConfirm,
  onCancel,
  confirmText = 'Confirm',
  cancelText = 'Cancel',
  confirmButtonClass = '!bg-red-500 hover:!bg-red-600', // Default to a "dangerous" action style
  cancelButtonClass = '!bg-gray-500 hover:!bg-gray-600',
}) => {
  if (!isOpen) {
    return null;
  }

  return (
    <Modal isOpen={isOpen} onClose={onCancel} title={title}>
      <div className="mb-6 text-slate-100">{message}</div>
      <div className="flex justify-end gap-3">
        <button
          onClick={onCancel}
          className={`minecraft-button ${cancelButtonClass}`}
        >
          {cancelText}
        </button>
        <button
          onClick={onConfirm}
          className={`minecraft-button ${confirmButtonClass}`}
        >
          {confirmText}
        </button>
      </div>
    </Modal>
  );
};

export default ConfirmModal;