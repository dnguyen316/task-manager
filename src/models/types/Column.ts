import { Task } from './Task';

export interface Column {
  name: string;
  id: string;
  tasks: Task[];
}
