import { BlockDefinition, BlockCategory } from './types';

export const GRID_DEFAULT_ROWS = 32;
export const GRID_DEFAULT_COLS = 48;
export const CELL_SIZE_DEFAULT = 20; // in pixels
export const MAX_RECENT_BLOCKS = 5;

export const EraserBlock: BlockDefinition = {
  id: 'eraser',
  name: 'Eraser / Air',
  color: 'bg-slate-300',
  hexColor: '#CBD5E1', // slate-300
  borderColor: 'border-slate-400',
  textColor: 'text-slate-700',
  iconSymbol: 'X',
  category: BlockCategory.UTILITY,
};

// Added hexColor to all definitions
export const BLOCK_DEFINITIONS: BlockDefinition[] = [
  // Terrain
  { id: 'grass', name: 'Grass Block', color: 'bg-green-600', hexColor: '#16A34A', borderColor: 'border-green-800', textColor: 'text-green-100', category: BlockCategory.TERRAIN, iconSymbol: 'G'},
  { id: 'dirt', name: 'Dirt', color: 'bg-yellow-800', hexColor: '#854D0E', borderColor: 'border-yellow-900', textColor: 'text-yellow-200', category: BlockCategory.TERRAIN, iconSymbol: 'D'},
  { id: 'sand', name: 'Sand', color: 'bg-yellow-300', hexColor: '#FDE047', borderColor: 'border-yellow-500', textColor: 'text-yellow-700', category: BlockCategory.TERRAIN, iconSymbol: 'S'},
  { id: 'gravel', name: 'Gravel', color: 'bg-gray-400', hexColor: '#9CA3AF', borderColor: 'border-gray-600', textColor: 'text-gray-800', category: BlockCategory.TERRAIN, iconSymbol: 'Gr'},
  // Wood
  { id: 'oak_log', name: 'Oak Log', color: 'bg-yellow-700', hexColor: '#B45309', borderColor: 'border-yellow-900', textColor: 'text-yellow-100', category: BlockCategory.WOOD, iconSymbol: 'OL'}, // Darker yellow, more brown
  { id: 'oak_planks', name: 'Oak Planks', color: 'bg-amber-500', hexColor: '#F59E0B', borderColor: 'border-amber-700', textColor: 'text-amber-900', category: BlockCategory.WOOD, iconSymbol: 'OP'},
  { id: 'spruce_planks', name: 'Spruce Planks', color: 'bg-orange-700', hexColor: '#C2410C', borderColor: 'border-orange-900', textColor: 'text-orange-100', category: BlockCategory.WOOD, iconSymbol: 'SP'}, // More like a dark brown
  { id: 'birch_planks', name: 'Birch Planks', color: 'bg-yellow-200', hexColor: '#FEF08A', borderColor: 'border-yellow-400', textColor: 'text-yellow-700', category: BlockCategory.WOOD, iconSymbol: 'BP'},
  { id: 'leaves', name: 'Leaves', color: 'bg-green-500 opacity-70', hexColor: '#22C55E', borderColor: 'border-green-700', textColor: 'text-green-900', category: BlockCategory.WOOD, iconSymbol: 'Lf'},
  // Stone
  { id: 'stone', name: 'Stone', color: 'bg-gray-500', hexColor: '#6B7280', borderColor: 'border-gray-700', textColor: 'text-gray-100', category: BlockCategory.STONE, iconSymbol: 'St'},
  { id: 'cobblestone', name: 'Cobblestone', color: 'bg-neutral-500', hexColor: '#737373', borderColor: 'border-neutral-700', textColor: 'text-neutral-100', category: BlockCategory.STONE, iconSymbol: 'Cb'},
  { id: 'stone_bricks', name: 'Stone Bricks', color: 'bg-slate-500', hexColor: '#64748B', borderColor: 'border-slate-700', textColor: 'text-slate-100', category: BlockCategory.STONE, iconSymbol: 'SB'},
  { id: 'mossy_stone_bricks', name: 'Mossy Stone Bricks', color: 'bg-emerald-700', hexColor: '#047857', borderColor: 'border-emerald-900', textColor: 'text-emerald-100', category: BlockCategory.STONE, iconSymbol: 'MS'},
  // Mineral & Metal
  { id: 'coal_ore', name: 'Coal Ore', color: 'bg-stone-600', hexColor: '#57534E', borderColor: 'border-black', textColor: 'text-stone-200', category: BlockCategory.MINERAL, iconSymbol: 'CO'}, // Stone with black spots
  { id: 'iron_ore', name: 'Iron Ore', color: 'bg-stone-500', hexColor: '#78716C', borderColor: 'border-orange-300', textColor: 'text-stone-100', category: BlockCategory.MINERAL, iconSymbol: 'IO'}, // Stone with orange/brown spots
  { id: 'gold_ore', name: 'Gold Ore', color: 'bg-stone-500', hexColor: '#78716C', borderColor: 'border-yellow-400', textColor: 'text-stone-100', category: BlockCategory.MINERAL, iconSymbol: 'GO'}, // Stone with gold spots
  { id: 'diamond_ore', name: 'Diamond Ore', color: 'bg-stone-500', hexColor: '#78716C', borderColor: 'border-cyan-400', textColor: 'text-stone-100', category: BlockCategory.MINERAL, iconSymbol: 'DO'}, // Stone with cyan spots
  { id: 'iron_block', name: 'Iron Block', color: 'bg-slate-300', hexColor: '#CBD5E1', borderColor: 'border-slate-500', textColor: 'text-slate-700', category: BlockCategory.MINERAL, iconSymbol: 'Fe'},
  { id: 'gold_block', name: 'Gold Block', color: 'bg-yellow-400', hexColor: '#FACC15', borderColor: 'border-yellow-600', textColor: 'text-yellow-800', category: BlockCategory.MINERAL, iconSymbol: 'Au'},
  { id: 'diamond_block', name: 'Diamond Block', color: 'bg-cyan-400', hexColor: '#22D3EE', borderColor: 'border-cyan-600', textColor: 'text-cyan-800', category: BlockCategory.MINERAL, iconSymbol: 'Dm'},
  { id: 'copper_block', name: 'Copper Block', color: 'bg-orange-500', hexColor: '#F97316', borderColor: 'border-orange-700', textColor: 'text-orange-900', category: BlockCategory.MINERAL, iconSymbol: 'Cu'},
  // Decoration
  { id: 'glass_block', name: 'Glass Block', color: 'bg-sky-200 opacity-40', hexColor: '#BAE6FD', borderColor: 'border-sky-300', textColor: 'text-sky-700', category: BlockCategory.DECORATION, iconSymbol: 'Gb'},
  { id: 'glass_pane', name: 'Glass Pane', color: 'bg-sky-100 opacity-30', hexColor: '#E0F2FE', borderColor: 'border-sky-200', textColor: 'text-sky-600', category: BlockCategory.DECORATION, iconSymbol: 'Gp'},
  { id: 'bookshelf', name: 'Bookshelf', color: 'bg-amber-600', hexColor: '#D97706', borderColor: 'border-red-700', textColor: 'text-amber-100', category: BlockCategory.DECORATION, iconSymbol: 'Bk'},
  { id: 'wool_white', name: 'White Wool', color: 'bg-gray-100', hexColor: '#F3F4F6', borderColor: 'border-gray-300', textColor: 'text-gray-700', category: BlockCategory.DECORATION, iconSymbol: 'WW'},
  // Utility & Light
  { id: 'torch', name: 'Torch', color: 'bg-yellow-400', hexColor: '#FACC15', borderColor: 'border-yellow-600', textColor: 'text-black', category: BlockCategory.UTILITY, iconSymbol: 'T'},
  { id: 'lantern', name: 'Lantern', color: 'bg-yellow-500', hexColor: '#EAB308', borderColor: 'border-gray-700', textColor: 'text-black', category: BlockCategory.UTILITY, iconSymbol: 'L'},
  { id: 'glowstone', name: 'Glowstone', color: 'bg-yellow-300', hexColor: '#FDE047', borderColor: 'border-yellow-500', textColor: 'text-yellow-700', category: BlockCategory.UTILITY, iconSymbol: 'Gs'},
  // Fluid
  { id: 'water', name: 'Water', color: 'bg-blue-500 opacity-70', hexColor: '#3B82F6', borderColor: 'border-blue-700', textColor: 'text-blue-100', category: BlockCategory.FLUID, iconSymbol: '~'},
  { id: 'lava', name: 'Lava', color: 'bg-orange-600 opacity-90', hexColor: '#EA580C', borderColor: 'border-red-800', textColor: 'text-red-100', category: BlockCategory.FLUID, iconSymbol: '!'},
  // Special Markers
  { id: 'door_wood', name: 'Wooden Door', color: 'bg-amber-700', hexColor: '#B45309', borderColor: 'border-amber-900', textColor: 'text-amber-100', category: BlockCategory.SPECIAL, iconSymbol: 'D'},
  { id: 'door_iron', name: 'Iron Door', color: 'bg-slate-400', hexColor: '#94A3B8', borderColor: 'border-slate-600', textColor: 'text-slate-800', category: BlockCategory.SPECIAL, iconSymbol: 'ID'},
  { id: 'window_marker', name: 'Window Area', color: 'bg-sky-400 opacity-50', hexColor: '#38BDF8', borderColor: 'border-sky-600', textColor: 'text-sky-900', category: BlockCategory.SPECIAL, iconSymbol: 'W'},
  EraserBlock // EraserBlock already has hexColor defined
];

export const ALL_BLOCKS_MAP = new Map<string, BlockDefinition>(
  BLOCK_DEFINITIONS.map(block => [block.id, block])
);
ALL_BLOCKS_MAP.set(EraserBlock.id, EraserBlock); // Ensure eraser is in map

export const LOCAL_STORAGE_PROJECTS_KEY = 'minecraftPlannerProjects_v1';
export const LOCAL_STORAGE_RECENT_BLOCKS_KEY = 'minecraftPlannerRecentBlocks_v1';
