export interface Task {
    id: string;
    title: string;
    description: string;
    category: string;
    priority: 'low' | 'medium' | 'high';
    status: 'todo' | 'in-progress' | 'completed';
    dueDate: Date | null;
    createdAt: Date;
    updatedAt: Date;
    tags: string[];
  }
  
  export interface TaskStats {
    total: number;
    completed: number;
    pending: number;
    overdue: number;
  }
  
  export interface User {
    name: string;
    email: string;
    avatar?: string;
    preferences: {
      theme: 'light' | 'dark';
      notifications: boolean;
    };
  }
  
  export type FilterType = 'all' | 'todo' | 'in-progress' | 'completed';
  export type SortType = 'dueDate' | 'priority' | 'created' | 'alphabetical';