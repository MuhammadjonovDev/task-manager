import '../global.css';
import { useEffect } from 'react';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useFrameworkReady } from '@/hooks/useFrameworkReady';
import { AuthProvider } from '../context/AuthContext';
import { TaskProvider } from '../context/TaskContext';
import { ThemeProvider } from '../context/ThemeContext';

export default function RootLayout() {
  useFrameworkReady();

  return (
    <AuthProvider>
      <ThemeProvider>
        <TaskProvider>
          <Stack screenOptions={{ headerShown: false }}>
            <Stack.Screen name="index" options={{ headerShown: false }} />
            <Stack.Screen name="(auth)" options={{ headerShown: false }} />
            <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
            <Stack.Screen name="search" options={{ headerShown: false }} />
            <Stack.Screen name="task/new" options={{ headerShown: false }} />
            <Stack.Screen name="task/[id]" options={{ headerShown: false }} />
            <Stack.Screen name="+not-found" />
          </Stack>
          <StatusBar style="auto" />
        </TaskProvider>
      </ThemeProvider>
    </AuthProvider>
  );
}