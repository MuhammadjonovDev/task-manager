import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, RefreshControl } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Plus, Filter, Search, ArrowUpDown } from 'lucide-react-native';
import { useRouter } from 'expo-router';
import { useTask } from '../../context/TaskContext';
import { useTheme } from '../../context/ThemeContext';
import { TaskCard } from '../../components/TaskCard';
import { TaskForm } from '../../components/TaskForm';
import { FilterType, SortType, Task } from '../../types';
import Modal from 'react-native-modal';

export default function Tasks() {
  const router = useRouter();
  const { 
    getFilteredTasks, 
    filter, 
    sort, 
    setFilter, 
    setSort, 
    loading, 
    loadTasks 
  } = useTask();
  const { isDark } = useTheme();
  
  const [refreshing, setRefreshing] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  const [showTaskForm, setShowTaskForm] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);

  const tasks = getFilteredTasks();

  const onRefresh = async () => {
    setRefreshing(true);
    await loadTasks();
    setRefreshing(false);
  };

  const handleEditTask = (task: Task) => {
    setEditingTask(task);
    setShowTaskForm(true);
  };

  const handleCloseForm = () => {
    setEditingTask(null);
    setShowTaskForm(false);
  };

  const FilterButton = ({ value, label, isActive }: { value: FilterType, label: string, isActive: boolean }) => (
    <TouchableOpacity
      onPress={() => setFilter(value)}
      className={`
        px-4 py-2 rounded-full mr-2 mb-2
        ${isActive 
          ? 'bg-primary-500'
          : isDark ? 'bg-gray-700' : 'bg-gray-200'
        }
      `}
    >
      <Text className={`
        text-sm font-medium
        ${isActive 
          ? 'text-white'
          : isDark ? 'text-gray-300' : 'text-gray-700'
        }
      `}>
        {label}
      </Text>
    </TouchableOpacity>
  );

  const SortButton = ({ value, label, isActive }: { value: SortType, label: string, isActive: boolean }) => (
    <TouchableOpacity
      onPress={() => setSort(value)}
      className={`
        flex-1 py-3 rounded-lg mr-2
        ${isActive 
          ? 'bg-primary-500'
          : isDark ? 'bg-gray-700' : 'bg-gray-200'
        }
      `}
    >
      <Text className={`
        text-sm font-medium text-center
        ${isActive 
          ? 'text-white'
          : isDark ? 'text-gray-300' : 'text-gray-700'
        }
      `}>
        {label}
      </Text>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView className={`flex-1 ${isDark ? 'bg-gray-900' : 'bg-gray-50'}`}>
      {/* Header */}
      <View className="flex-row items-center justify-between p-4">
        <View>
          <Text className={`text-2xl font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>
            Tasks
          </Text>
          <Text className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
            {tasks.length} {tasks.length === 1 ? 'task' : 'tasks'} found
          </Text>
        </View>
        <View className="flex-row space-x-2">
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
          <TouchableOpacity
            onPress={() => setShowFilters(true)}
            className={`
              p-3 rounded-xl
              ${isDark ? 'bg-gray-800' : 'bg-white'}
              shadow-sm
            `}
          >
            <Filter size={20} color={isDark ? '#9CA3AF' : '#6B7280'} />
          </TouchableOpacity>
        </View>
      </View>

      {/* Quick Filters */}
      <View className="px-4 mb-4">
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          <View className="flex-row">
            <FilterButton value="all" label="All" isActive={filter === 'all'} />
            <FilterButton value="todo" label="To Do" isActive={filter === 'todo'} />
            <FilterButton value="in-progress" label="In Progress" isActive={filter === 'in-progress'} />
            <FilterButton value="completed" label="Completed" isActive={filter === 'completed'} />
          </View>
        </ScrollView>
      </View>

      {/* Task List */}
      <ScrollView 
        className="flex-1 px-4"
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        {tasks.map(task => (
          <TaskCard 
            key={task.id} 
            task={task} 
            onEdit={handleEditTask}
          />
        ))}

        {tasks.length === 0 && (
          <View className="items-center justify-center py-20">
            <Text className={`text-lg font-medium mb-2 ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
              No tasks found
            </Text>
            <Text className={`text-center ${isDark ? 'text-gray-500' : 'text-gray-400'}`}>
              {filter === 'all' 
                ? 'Create your first task to get started' 
                : `No ${filter} tasks available`
              }
            </Text>
          </View>
        )}
      </ScrollView>

      {/* Floating Action Button */}
      <TouchableOpacity
        onPress={() => setShowTaskForm(true)}
        className="absolute bottom-6 right-6 w-14 h-14 bg-primary-500 rounded-full items-center justify-center shadow-lg"
      >
        <Plus size={24} color="#FFFFFF" />
      </TouchableOpacity>

      {/* Filters Modal */}
      <Modal
        isVisible={showFilters}
        onBackdropPress={() => setShowFilters(false)}
        className="justify-end m-0"
      >
        <View className={`
          ${isDark ? 'bg-gray-800' : 'bg-white'}
          rounded-t-3xl p-6
        `}>
          <View className="flex-row items-center justify-between mb-6">
            <Text className={`text-xl font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>
              Sort & Filter
            </Text>
            <TouchableOpacity onPress={() => setShowFilters(false)}>
              <Text className="text-primary-500 font-medium">Done</Text>
            </TouchableOpacity>
          </View>

          <View className="mb-6">
            <Text className={`text-lg font-semibold mb-3 ${isDark ? 'text-white' : 'text-gray-900'}`}>
              Sort By
            </Text>
            <View className="flex-row flex-wrap">
              <SortButton value="dueDate" label="Due Date" isActive={sort === 'dueDate'} />
              <SortButton value="priority" label="Priority" isActive={sort === 'priority'} />
              <SortButton value="created" label="Created" isActive={sort === 'created'} />
              <SortButton value="alphabetical" label="A-Z" isActive={sort === 'alphabetical'} />
            </View>
          </View>
        </View>
      </Modal>

      {/* Task Form Modal */}
      <Modal
        isVisible={showTaskForm}
        onBackdropPress={() => {}}
        className="m-0"
        animationIn="slideInUp"
        animationOut="slideOutDown"
      >
        <TaskForm 
          task={editingTask || undefined}
          onClose={handleCloseForm}
        />
      </Modal>
    </SafeAreaView>
  );
}