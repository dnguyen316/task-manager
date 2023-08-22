import { Column } from './Column';

export interface Board {
  id: string;
  name: string;
  isActive: boolean;
  userUID: string;
  columns: Column[];
  isSelected: boolean;
}
