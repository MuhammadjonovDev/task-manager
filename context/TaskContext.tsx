import React, { createContext, useContext, useReducer, useEffect, ReactNode } from 'react';
import { Task, TaskStats, FilterType, SortType } from '../types';
import { StorageService } from '../utils/storage';

interface TaskState {
  tasks: Task[];
  loading: boolean;
  error: string | null;
  filter: FilterType;
  sort: SortType;
  searchQuery: string;
}

type TaskAction = 
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'SET_ERROR'; payload: string | null }
  | { type: 'SET_TASKS'; payload: Task[] }
  | { type: 'ADD_TASK'; payload: Task }
  | { type: 'UPDATE_TASK'; payload: Task }
  | { type: 'DELETE_TASK'; payload: string }
  | { type: 'SET_FILTER'; payload: FilterType }
  | { type: 'SET_SORT'; payload: SortType }
  | { type: 'SET_SEARCH'; payload: string };

const initialState: TaskState = {
  tasks: [],
  loading: false,
  error: null,
  filter: 'all',
  sort: 'dueDate',
  searchQuery: '',
};

const taskReducer = (state: TaskState, action: TaskAction): TaskState => {
  switch (action.type) {
    case 'SET_LOADING':
      return { ...state, loading: action.payload };
    case 'SET_ERROR':
      return { ...state, error: action.payload };
    case 'SET_TASKS':
      return { ...state, tasks: action.payload, loading: false };
    case 'ADD_TASK':
      return { ...state, tasks: [...state.tasks, action.payload] };
    case 'UPDATE_TASK':
      return {
        ...state,
        tasks: state.tasks.map(task =>
          task.id === action.payload.id ? action.payload : task
        ),
      };
    case 'DELETE_TASK':
      return {
        ...state,
        tasks: state.tasks.filter(task => task.id !== action.payload),
      };
    case 'SET_FILTER':
      return { ...state, filter: action.payload };
    case 'SET_SORT':
      return { ...state, sort: action.payload };
    case 'SET_SEARCH':
      return { ...state, searchQuery: action.payload };
    default:
      return state;
  }
};

interface TaskContextType extends TaskState {
  addTask: (task: Omit<Task, 'id' | 'createdAt' | 'updatedAt'>) => Promise<void>;
  updateTask: (task: Task) => Promise<void>;
  deleteTask: (id: string) => Promise<void>;
  toggleTaskStatus: (id: string) => Promise<void>;
  getFilteredTasks: () => Task[];
  getTaskStats: () => TaskStats;
  setFilter: (filter: FilterType) => void;
  setSort: (sort: SortType) => void;
  setSearchQuery: (query: string) => void;
  loadTasks: () => Promise<void>;
}

const TaskContext = createContext<TaskContextType | undefined>(undefined);

export const useTask = () => {
  const context = useContext(TaskContext);
  if (!context) {
    throw new Error('useTask must be used within a TaskProvider');
  }
  return context;
};

export const TaskProvider = ({ children }: { children: ReactNode }) => {
  const [state, dispatch] = useReducer(taskReducer, initialState);

  const loadTasks = async () => {
    dispatch({ type: 'SET_LOADING', payload: true });
    try {
      const tasks = await StorageService.getTasks();
      dispatch({ type: 'SET_TASKS', payload: tasks });
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: 'Failed to load tasks' });
    }
  };

  const addTask = async (taskData: Omit<Task, 'id' | 'createdAt' | 'updatedAt'>) => {
    const newTask: Task = {
      ...taskData,
      id: Date.now().toString(),
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    dispatch({ type: 'ADD_TASK', payload: newTask });
    
    const updatedTasks = [...state.tasks, newTask];
    await StorageService.saveTasks(updatedTasks);
  };

  const updateTask = async (updatedTask: Task) => {
    const task = { ...updatedTask, updatedAt: new Date() };
    dispatch({ type: 'UPDATE_TASK', payload: task });
    
    const updatedTasks = state.tasks.map(t => t.id === task.id ? task : t);
    await StorageService.saveTasks(updatedTasks);
  };

  const deleteTask = async (id: string) => {
    dispatch({ type: 'DELETE_TASK', payload: id });
    
    const updatedTasks = state.tasks.filter(task => task.id !== id);
    await StorageService.saveTasks(updatedTasks);
  };

  const toggleTaskStatus = async (id: string) => {
    const task = state.tasks.find(t => t.id === id);
    if (task) {
      const updatedTask = {
        ...task,
        status: task.status === 'completed' ? 'todo' as const : 'completed' as const,
        updatedAt: new Date(),
      };
      await updateTask(updatedTask);
    }
  };

  const getFilteredTasks = (): Task[] => {
    let filtered = state.tasks;

    // Apply search filter
    if (state.searchQuery) {
      const query = state.searchQuery.toLowerCase();
      filtered = filtered.filter(task =>
        task.title.toLowerCase().includes(query) ||
        task.description.toLowerCase().includes(query) ||
        task.category.toLowerCase().includes(query) ||
        task.tags.some(tag => tag.toLowerCase().includes(query))
      );
    }

    // Apply status filter
    if (state.filter !== 'all') {
      filtered = filtered.filter(task => task.status === state.filter);
    }

    // Apply sorting
    filtered.sort((a, b) => {
      switch (state.sort) {
        case 'dueDate':
          if (!a.dueDate) return 1;
          if (!b.dueDate) return -1;
          return a.dueDate.getTime() - b.dueDate.getTime();
        case 'priority':
          const priorityOrder = { high: 3, medium: 2, low: 1 };
          return priorityOrder[b.priority] - priorityOrder[a.priority];
        case 'created':
          return b.createdAt.getTime() - a.createdAt.getTime();
        case 'alphabetical':
          return a.title.localeCompare(b.title);
        default:
          return 0;
      }
    });

    return filtered;
  };

  const getTaskStats = (): TaskStats => {
    const total = state.tasks.length;
    const completed = state.tasks.filter(task => task.status === 'completed').length;
    const pending = state.tasks.filter(task => task.status !== 'completed').length;
    const overdue = state.tasks.filter(task => 
      task.dueDate && task.status !== 'completed' && task.dueDate < new Date()
    ).length;

    return { total, completed, pending, overdue };
  };

  const setFilter = (filter: FilterType) => {
    dispatch({ type: 'SET_FILTER', payload: filter });
  };

  const setSort = (sort: SortType) => {
    dispatch({ type: 'SET_SORT', payload: sort });
  };

  const setSearchQuery = (query: string) => {
    dispatch({ type: 'SET_SEARCH', payload: query });
  };

  useEffect(() => {
    loadTasks();
  }, []);

  const value: TaskContextType = {
    ...state,
    addTask,
    updateTask,
    deleteTask,
    toggleTaskStatus,
    getFilteredTasks,
    getTaskStats,
    setFilter,
    setSort,
    setSearchQuery,
    loadTasks,
  };

  return <TaskContext.Provider value={value}>{children}</TaskContext.Provider>;
};