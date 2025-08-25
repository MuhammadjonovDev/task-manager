import React, { useEffect } from 'react';
import { View, Text } from 'react-native';
import { useRouter } from 'expo-router';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';

export default function Index() {
  const router = useRouter();
  const { user, loading } = useAuth();
  const { isDark } = useTheme();

  useEffect(() => {
    if (!loading) {
      if (user) {
        router.replace('/(tabs)');
      } else {
        router.replace('/(auth)/sign-in');
      }
    }
  }, [user, loading]);

  return (
    <View className={`flex-1 items-center justify-center ${isDark ? 'bg-gray-900' : 'bg-gray-50'}`}>
      <Text className={`text-lg ${isDark ? 'text-white' : 'text-gray-900'}`}>
        Loading...
      </Text>
    </View>
  );
}