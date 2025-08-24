import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, RefreshControl } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Plus, Search, TrendingUp, Clock, CircleCheck as CheckCircle, TriangleAlert as AlertTriangle  } from 'lucide-react-native';
import { CheckSquare } from "lucide-react-native";
import { useRouter } from 'expo-router';
import { useTask } from '../../context/TaskContext';
import { useTheme } from '../../context/ThemeContext';
import { TaskCard } from '../../components/TaskCard';
import { DateUtils } from '../../utils/dateUtils';

export default function Home() {
  const router = useRouter();
  const { tasks, getTaskStats, loading, loadTasks } = useTask();
  const { isDark } = useTheme();
  const [refreshing, setRefreshing] = useState(false);

  const stats = getTaskStats();
  const todayTasks = tasks.filter(task => 
    task.dueDate && DateUtils.isToday(task.dueDate)
  );
  const recentTasks = tasks
    .filter(task => task.status !== 'completed')
    .sort((a, b) => {
      if (!a.dueDate) return 1;
      if (!b.dueDate) return -1;
      return a.dueDate.getTime() - b.dueDate.getTime();
    })
    .slice(0, 5);

  const onRefresh = async () => {
    setRefreshing(true);
    await loadTasks();
    setRefreshing(false);
  };

  const StatCard = ({ icon: Icon, label, value, color }: any) => (
    <View className={`
      flex-1 p-4 rounded-xl mr-3
      ${isDark ? 'bg-gray-800' : 'bg-white'}
      shadow-sm
    `}>
      <View className="flex-row items-center justify-between mb-2">
        <Icon size={20} color={color} />
        <Text className={`text-2xl font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>
          {value}
        </Text>
      </View>
      <Text className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
        {label}
      </Text>
    </View>
  );

  return (
    <SafeAreaView className={`flex-1 ${isDark ? 'bg-gray-900' : 'bg-gray-50'}`}>
      {/* Header */}
      <View className="flex-row items-center justify-between p-4 pb-2">
        <View>
          <Text className={`text-2xl font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>
            Good {new Date().getHours() < 12 ? 'Morning' : new Date().getHours() < 17 ? 'Afternoon' : 'Evening'}!
          </Text>
          <Text className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
            {new Date().toLocaleDateString('en-US', { 
              weekday: 'long', 
              month: 'long', 
              day: 'numeric' 
            })}
          </Text>
        </View>
        <TouchableOpacity
          onPress={() => router.push('/search')}
          className={`
            p-3 rounded-xl
            ${isDark ? 'bg-gray-800' : 'bg-white'}
            shadow-sm
          `}
        >
          <Search size={20} color={isDark ? '#9CA3AF' : '#6B7280'} />
        </TouchableOpacity>
      </View>

      <ScrollView 
        className="flex-1"
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        {/* Stats */}
        <View className="px-4 mb-6">
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
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
              <StatCard
                icon={AlertTriangle}
                label="Overdue"
                value={stats.overdue}
                color="#EF4444"
              />
            </View>
          </ScrollView>
        </View>

        {/* Quick Actions */}
        <View className="px-4 mb-6">
          <Text className={`text-lg font-semibold mb-3 ${isDark ? 'text-white' : 'text-gray-900'}`}>
            Quick Actions
          </Text>
          <View className="flex-row space-x-3">
            <TouchableOpacity
              onPress={() => router.push('/task/new')}
              className="flex-1 flex-row items-center justify-center p-4 bg-primary-500 rounded-xl"
            >
              <Plus size={20} color="#FFFFFF" />
              <Text className="text-white font-semibold ml-2">New Task</Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => router.push('/tasks')}
              className={`
                flex-1 flex-row items-center justify-center p-4 rounded-xl border
                ${isDark 
                  ? 'bg-gray-800 border-gray-600' 
                  : 'bg-white border-gray-300'
                }
              `}
            >
              <CheckSquare size={20} color={isDark ? '#9CA3AF' : '#6B7280'} />
              <Text className={`font-semibold ml-2 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                View All
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Today's Tasks */}
        {todayTasks.length > 0 && (
          <View className="px-4 mb-6">
            <Text className={`text-lg font-semibold mb-3 ${isDark ? 'text-white' : 'text-gray-900'}`}>
              Today's Tasks ({todayTasks.length})
            </Text>
            {todayTasks.map(task => (
              <TaskCard key={task.id} task={task} compact />
            ))}
          </View>
        )}

        {/* Upcoming Tasks */}
        {recentTasks.length > 0 && (
          <View className="px-4 mb-6">
            <View className="flex-row items-center justify-between mb-3">
              <Text className={`text-lg font-semibold ${isDark ? 'text-white' : 'text-gray-900'}`}>
                Upcoming Tasks
              </Text>
              <TouchableOpacity onPress={() => router.push('/tasks')}>
                <Text className="text-primary-500 font-medium">See All</Text>
              </TouchableOpacity>
            </View>
            {recentTasks.map(task => (
              <TaskCard key={task.id} task={task} compact />
            ))}
          </View>
        )}

        {/* Empty State */}
        {stats.total === 0 && (
          <View className="flex-1 items-center justify-center p-8 mt-20">
            <CheckSquare size={64} color={isDark ? '#4B5563' : '#D1D5DB'} />
            <Text className={`text-xl font-semibold mt-4 mb-2 ${isDark ? 'text-white' : 'text-gray-900'}`}>
              No Tasks Yet
            </Text>
            <Text className={`text-center mb-6 ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
              Create your first task to get started with organizing your day
            </Text>
            <TouchableOpacity
              onPress={() => router.push('/task/new')}
              className="flex-row items-center px-6 py-3 bg-primary-500 rounded-xl"
            >
              <Plus size={20} color="#FFFFFF" />
              <Text className="text-white font-semibold ml-2">Create Task</Text>
            </TouchableOpacity>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}