
import React from 'react';
import { ToastMessage } from '../types';

interface ToastProps {
  toast: ToastMessage;
  onDismiss: (id: string) => void;
}

const Toast: React.FC<ToastProps> = ({ toast, onDismiss }) => {
  const baseStyle = "p-3 rounded-none shadow-lg mb-2 text-sm max-w-sm w-full minecraft-panel";
  let typeStyle = "";

  switch (toast.type) {
    case 'success':
      typeStyle = "!bg-green-600 border-green-700 text-white";
      break;
    case 'error':
      typeStyle = "!bg-red-600 border-red-700 text-white";
      break;
    case 'info':
      typeStyle = "!bg-sky-600 border-sky-700 text-white";
      break;
  }

  return (
    <div className={`${baseStyle} ${typeStyle} flex justify-between items-center animate-fadeIn`}>
      <span>{toast.message}</span>
      <button
        onClick={() => onDismiss(toast.id)}
        className="ml-4 px-2 py-0.5 border border-transparent rounded-none hover:bg-black/20 text-lg"
        aria-label="Dismiss notification"
      >
        &times;
      </button>
      <style>{`
        .animate-fadeIn {
          animation: fadeIn 0.3s ease-out;
        }
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(-10px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
};


interface ToastsContainerProps {
  toasts: ToastMessage[];
  removeToast: (id: string) => void;
}

const ToastsContainer: React.FC<ToastsContainerProps> = ({ toasts, removeToast }) => {
  if (toasts.length === 0) return null;

  return (
    <div className="fixed top-4 right-4 z-[100] w-auto max-w-sm">
      {toasts.map(toast => (
        <Toast key={toast.id} toast={toast} onDismiss={removeToast} />
      ))}
    </div>
  );
};

export default ToastsContainer;
