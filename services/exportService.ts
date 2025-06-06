
import { BlockCount } from '../types';

// Ensure html2canvas is loaded from CDN (globally available)
declare global {
  interface Window {
    html2canvas: any;
    // Removed jspdf declaration
  }
}

export const exportToPNG = async (elementId: string, filename: string): Promise<void> => {
  const element = document.getElementById(elementId);
  if (!element || !window.html2canvas) {
    console.error('Element not found or html2canvas not loaded.');
    // Use a more user-friendly notification if available, otherwise fallback to alert
    (window as any).addToast?.({ message: 'Error exporting to PNG: Resources not found.', type: 'error' }) || alert('Error exporting to PNG: Required resources not found.');
    return;
  }

  try {
    const canvas = await window.html2canvas(element, {
      useCORS: true,
      backgroundColor: '#37474F', // Match page background or grid background
      imageTimeout: 15000,
      scale: 2, // Increase resolution for better quality
      logging: false, // Suppress html2canvas console logs
    });
    const dataUrl = canvas.toDataURL('image/png');
    const link = document.createElement('a');
    link.download = `${filename}.png`;
    link.href = dataUrl;
    link.click();
  } catch (error) {
    console.error('Error exporting to PNG:', error);
    const errorMessage = error instanceof Error ? error.message : String(error);
    (window as any).addToast?.({ message: `Error exporting to PNG: ${errorMessage}`, type: 'error' }) || alert(`Error exporting to PNG: ${errorMessage}`);
  }
};

// exportToPDF function has been removed.
