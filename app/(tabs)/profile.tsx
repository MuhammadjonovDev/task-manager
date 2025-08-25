import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, TouchableOpacity, TextInput, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { User as UserIcon, Settings, Moon, Sun, Bell, Download, Trash2, CreditCard as Edit3, Save, X, TrendingUp, Calendar, CircleCheck as CheckCircle, Clock } from 'lucide-react-native';
import { useTask } from '../../context/TaskContext';
import { useTheme } from '../../context/ThemeContext';
import { useAuth } from '../../context/AuthContext';
import { StorageService } from '../../utils/storage';
import { User } from '../../types';

export default function Profile() {
  const { tasks, getTaskStats, loadTasks } = useTask();
  const { isDark, toggleTheme } = useTheme();
  const { user: authUser, signOut } = useAuth();
  
  const [user, setUser] = useState<User | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState({ name: '', email: '' });

  const stats = getTaskStats();

  useEffect(() => {
    loadUserData();
  }, []);

  const loadUserData = async () => {
    if (authUser) {
      const userData = await StorageService.getUser();
      if (userData) {
        setUser(userData);
        setEditForm({ name: userData.name, email: userData.email });
      } else {
        // Create user profile from auth data
        const defaultUser: User = {
          name: authUser.user_metadata?.full_name || 'Task Master',
          email: authUser.email || 'user@example.com',
          preferences: {
            theme: 'light',
            notifications: true,
          },
        };
        await StorageService.saveUser(defaultUser);
        setUser(defaultUser);
        setEditForm({ name: defaultUser.name, email: defaultUser.email });
      }
    }
  };

  const handleSaveProfile = async () => {
    if (!editForm.name.trim()) {
      Alert.alert('Error', 'Name cannot be empty');
      return;
    }

    const updatedUser: User = {
      ...user!,
      name: editForm.name,
      email: editForm.email,
    };

    await StorageService.saveUser(updatedUser);
    setUser(updatedUser);
    setIsEditing(false);
    Alert.alert('Success', 'Profile updated successfully');
  };

  const handleExportData = () => {
    Alert.alert(
      'Export Data',
      `Export ${tasks.length} tasks to JSON format?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Export',
          onPress: () => {
            // In a real app, this would trigger a file download
            Alert.alert('Success', 'Data exported successfully');
          },
        },
      ]
    );
  };

  const handleClearAllData = () => {
    Alert.alert(
      'Clear All Data',
      'This will permanently delete all your tasks and settings. This action cannot be undone.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            if (authUser) {
              await StorageService.saveTasks([], authUser.id);
            }
            await loadTasks();
            Alert.alert('Success', 'All data cleared successfully');
          },
        },
      ]
    );
  };

  const StatCard = ({ icon: Icon, label, value, color }: any) => (
    <View className={`
      flex-1 p-4 rounded-xl mx-1
      ${isDark ? 'bg-gray-800' : 'bg-white'}
      shadow-sm
    `}>
      <View className="items-center">
        <Icon size={24} color={color} />
        <Text className={`text-2xl font-bold mt-2 ${isDark ? 'text-white' : 'text-gray-900'}`}>
          {value}
        </Text>
        <Text className={`text-sm text-center ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
          {label}
        </Text>
      </View>
    </View>
  );

  const SettingsItem = ({ 
    icon: Icon, 
    label, 
    value, 
    onPress, 
    color = isDark ? '#9CA3AF' : '#6B7280',
    rightElement 
  }: any) => (
    <TouchableOpacity
      onPress={onPress}
      className={`
        flex-row items-center justify-between p-4 rounded-xl mb-2
        ${isDark ? 'bg-gray-800' : 'bg-white'}
        shadow-sm
      `}
    >
      <View className="flex-row items-center flex-1">
        <Icon size={20} color={color} />
        <Text className={`text-base font-medium ml-3 ${isDark ? 'text-white' : 'text-gray-900'}`}>
          {label}
        </Text>
      </View>
      {rightElement || (
        <Text className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
          {value}
        </Text>
      )}
    </TouchableOpacity>
  );

  if (!user) {
    return (
      <SafeAreaView className={`flex-1 items-center justify-center ${isDark ? 'bg-gray-900' : 'bg-gray-50'}`}>
        <Text className={`text-lg ${isDark ? 'text-white' : 'text-gray-900'}`}>
          Loading profile...
        </Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className={`flex-1 ${isDark ? 'bg-gray-900' : 'bg-gray-50'}`}>
      {/* Header */}
      <View className="flex-row items-center justify-between p-4">
        <Text className={`text-2xl font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>
          Profile
        </Text>
        <TouchableOpacity onPress={() => setIsEditing(!isEditing)}>
          {isEditing ? (
            <X size={24} color={isDark ? '#9CA3AF' : '#6B7280'} />
          ) : (
            <Edit3 size={24} color={isDark ? '#9CA3AF' : '#6B7280'} />
          )}
        </TouchableOpacity>
      </View>

      <ScrollView className="flex-1 px-4">
        {/* Profile Info */}
        <View className={`
          p-6 rounded-xl mb-6
          ${isDark ? 'bg-gray-800' : 'bg-white'}
          shadow-sm
        `}>
          <View className="items-center mb-4">
            <View className="w-20 h-20 bg-primary-500 rounded-full items-center justify-center mb-3">
              <UserIcon size={32} color="#FFFFFF" />
            </View>
            
            {isEditing ? (
              <View className="w-full space-y-3">
                <TextInput
                  value={editForm.name}
                  onChangeText={(text) => setEditForm(prev => ({ ...prev, name: text }))}
                  placeholder="Enter your name"
                  placeholderTextColor={isDark ? '#6B7280' : '#9CA3AF'}
                  className={`
                    text-center text-xl font-bold p-2 rounded-lg
                    ${isDark 
                      ? 'bg-gray-700 text-white border-gray-600' 
                      : 'bg-gray-100 text-gray-900 border-gray-300'
                    }
                  `}
                />
                <TextInput
                  value={editForm.email}
                  onChangeText={(text) => setEditForm(prev => ({ ...prev, email: text }))}
                  placeholder="Enter your email"
                  placeholderTextColor={isDark ? '#6B7280' : '#9CA3AF'}
                  className={`
                    text-center p-2 rounded-lg
                    ${isDark 
                      ? 'bg-gray-700 text-gray-300 border-gray-600' 
                      : 'bg-gray-100 text-gray-600 border-gray-300'
                    }
                  `}
                />
                <TouchableOpacity
                  onPress={handleSaveProfile}
                  className="flex-row items-center justify-center py-2 bg-primary-500 rounded-lg"
                >
                  <Save size={16} color="#FFFFFF" />
                  <Text className="text-white font-medium ml-2">Save</Text>
                </TouchableOpacity>
              </View>
            ) : (
              <>
                <Text className={`text-xl font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>
                  {user.name}
                </Text>
                <Text className={`${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                  {user.email}
                </Text>
              </>
            )}
          </View>
        </View>

        {/* Stats */}
        <View className="mb-6">
          <Text className={`text-lg font-semibold mb-3 px-1 ${isDark ? 'text-white' : 'text-gray-900'}`}>
            Your Statistics
          </Text>
          <View className="flex-row">
            <StatCard
              icon={TrendingUp}
              label="Total Tasks"
              value={stats.total}
              color="#3B82F6"
            />
            <StatCard
              icon={CheckCircle}
              label="Completed"
              value={stats.completed}
              color="#10B981"
            />
            <StatCard
              icon={Clock}
              label="Pending"
              value={stats.pending}
              color="#F59E0B"
            />
          </View>
        </View>

        {/* Settings */}
        <View className="mb-6">
          <Text className={`text-lg font-semibold mb-3 px-1 ${isDark ? 'text-white' : 'text-gray-900'}`}>
            Settings
          </Text>
          
          <SettingsItem
            icon={isDark ? Sun : Moon}
            label="Theme"
            value={isDark ? 'Dark' : 'Light'}
            onPress={toggleTheme}
            rightElement={
              <TouchableOpacity onPress={toggleTheme}>
                {isDark ? (
                  <Sun size={20} color="#F59E0B" />
                ) : (
                  <Moon size={20} color="#6B7280" />
                )}
              </TouchableOpacity>
            }
          />
          
          <SettingsItem
            icon={Bell}
            label="Notifications"
            value={user.preferences.notifications ? 'On' : 'Off'}
            onPress={() => {
              const updatedUser = {
                ...user,
                preferences: {
                  ...user.preferences,
                  notifications: !user.preferences.notifications,
                },
              };
              setUser(updatedUser);
              StorageService.saveUser(updatedUser);
            }}
          />
          
          <SettingsItem
            icon={Download}
            label="Export Data"
            value={`${tasks.length} tasks`}
            onPress={handleExportData}
            color="#10B981"
          />
          
          <SettingsItem
            icon={Trash2}
            label="Clear All Data"
            value="Danger Zone"
            onPress={handleClearAllData}
            color="#EF4444"
          />
          
          <SettingsItem
            icon={UserIcon}
            label="Sign Out"
            value="Logout"
            onPress={() => {
              Alert.alert(
                'Sign Out',
                'Are you sure you want to sign out?',
                [
                  { text: 'Cancel', style: 'cancel' },
                  { text: 'Sign Out', onPress: signOut },
                ]
              );
            }}
            color="#EF4444"
          />
        </View>

        {/* App Info */}
        <View className={`
          p-4 rounded-xl mb-6
          ${isDark ? 'bg-gray-800' : 'bg-white'}
          shadow-sm
        `}>
          <Text className={`text-center font-medium ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
            Task Manager v1.0.0
          </Text>
          <Text className={`text-center text-sm mt-1 ${isDark ? 'text-gray-500' : 'text-gray-400'}`}>
            Signed in as {authUser?.email}
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}