export type FilterStatus = 'all' | 'active' | 'completed';

export interface Task {
  id: string;
  title: string;
  completed: boolean;
  createdAt: number;
}
