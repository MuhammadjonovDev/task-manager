import AsyncStorage from '@react-native-async-storage/async-storage';
import { Task, User } from '../types';

const getTasksKey = (userId: string) => `@tasks_${userId}`;
const USER_KEY = '@user';
const THEME_KEY = '@theme';

export const StorageService = {
  // Task operations
  async getTasks(userId: string): Promise<Task[]> {
    try {
      const tasksJson = await AsyncStorage.getItem(getTasksKey(userId));
      if (tasksJson) {
        const tasks = JSON.parse(tasksJson);
        return tasks.map((task: any) => ({
          ...task,
          dueDate: task.dueDate ? new Date(task.dueDate) : null,
          createdAt: new Date(task.createdAt),
          updatedAt: new Date(task.updatedAt),
        }));
      }
      return [];
    } catch (error) {
      console.error('Error loading tasks:', error);
      return [];
    }
  },

  async saveTasks(tasks: Task[], userId: string): Promise<void> {
    try {
      await AsyncStorage.setItem(getTasksKey(userId), JSON.stringify(tasks));
    } catch (error) {
      console.error('Error saving tasks:', error);
    }
  },

  // User operations
  async getUser(): Promise<User | null> {
    try {
      const userJson = await AsyncStorage.getItem(USER_KEY);
      return userJson ? JSON.parse(userJson) : null;
    } catch (error) {
      console.error('Error loading user:', error);
      return null;
    }
  },

  async saveUser(user: User): Promise<void> {
    try {
      await AsyncStorage.setItem(USER_KEY, JSON.stringify(user));
    } catch (error) {
      console.error('Error saving user:', error);
    }
  },

  // Theme operations
  async getTheme(): Promise<'light' | 'dark'> {
    try {
      const theme = await AsyncStorage.getItem(THEME_KEY);
      return theme === 'dark' ? 'dark' : 'light';
    } catch (error) {
      return 'light';
    }
  },

  async saveTheme(theme: 'light' | 'dark'): Promise<void> {
    try {
      await AsyncStorage.setItem(THEME_KEY, theme);
    } catch (error) {
      console.error('Error saving theme:', error);
    }
  },
};