export enum BlockCategory {
  TERRAIN = 'Terrain & Natural',
  WOOD = 'Wood & Organics',
  STONE = 'Stone & Bricks',
  MINERAL = 'Minerals & Metals',
  DECORATION = 'Decoration & Glass',
  UTILITY = 'Utility & Lighting',
  FLUID = 'Fluids',
  SPECIAL = 'Markers & Structures',
  RECENT = 'Recently Used' // New category for recently used blocks
}

export interface BlockDefinition {
  id: string;
  name: string;
  color: string; // Tailwind bg color class e.g., 'bg-green-500'
  hexColor: string; // Actual hex color, e.g., '#16A34A'
  borderColor?: string; // Tailwind border color class e.g., 'border-green-700'
  textColor?: string; // Tailwind text color for icon/symbol
  iconSymbol?: string; // A simple character or short string for the block
  category: BlockCategory;
}

export type GridCellData = BlockDefinition | null;

export interface Project {
  id:string;
  name: string;
  grid: (string | null)[][]; // Store block IDs in the grid for saving
  rows: number;
  cols: number;
  createdAt: string;
  updatedAt: string;
}

export interface BlockCount {
  id: string;
  name: string;
  count: number;
  color: string; // The primary Tailwind color class of the block for the legend
  hexColor: string; // The primary hex color for PDF legend
  iconSymbol?: string;
}

export type ToastMessage = {
  id: string;
  message: string;
  type: 'success' | 'error' | 'info';
  duration?: number;
};

export enum Tool {
  DRAW = 'draw',
  FILL = 'fill',
  ERASE = 'erase',
  SELECT_AREA = 'select_area' // Added for future area selection tool
}

export interface SelectionArea {
  startRow: number;
  startCol: number;
  endRow: number;
  endCol: number;
}
