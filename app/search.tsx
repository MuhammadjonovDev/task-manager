import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, ScrollView, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ArrowLeft, Search as SearchIcon, Filter, X } from 'lucide-react-native';
import { useRouter } from 'expo-router';
import { useTask } from '../context/TaskContext';
import { useTheme } from '../context/ThemeContext';
import { TaskCard } from '../components/TaskCard';
import { TaskForm } from '../components/TaskForm';
import { Task, FilterType } from '../types';
import Modal from 'react-native-modal';

export default function Search() {
  const router = useRouter();
  const { tasks, searchQuery, setSearchQuery } = useTask();
  const { isDark } = useTheme();
  
  const [localQuery, setLocalQuery] = useState(searchQuery);
  const [showFilters, setShowFilters] = useState(false);
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [priorityFilter, setPriorityFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all' as FilterType);
  const [showTaskForm, setShowTaskForm] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);

  useEffect(() => {
    const delayedSearch = setTimeout(() => {
      setSearchQuery(localQuery);
    }, 300);

    return () => clearTimeout(delayedSearch);
  }, [localQuery, setSearchQuery]);

  const getFilteredResults = () => {
    let filtered = tasks;

    // Apply search query
    if (localQuery.trim()) {
      const query = localQuery.toLowerCase();
      filtered = filtered.filter(task =>
        task.title.toLowerCase().includes(query) ||
        task.description.toLowerCase().includes(query) ||
        task.category.toLowerCase().includes(query) ||
        task.tags.some(tag => tag.toLowerCase().includes(query))
      );
    }

    // Apply category filter
    if (categoryFilter !== 'all') {
      filtered = filtered.filter(task => task.category === categoryFilter);
    }

    // Apply priority filter
    if (priorityFilter !== 'all') {
      filtered = filtered.filter(task => task.priority === priorityFilter);
    }

    // Apply status filter
    if (statusFilter !== 'all') {
      filtered = filtered.filter(task => task.status === statusFilter);
    }

    return filtered;
  };

  const filteredTasks = getFilteredResults();
  const categories = Array.from(new Set(tasks.map(task => task.category)));

  const clearFilters = () => {
    setCategoryFilter('all');
    setPriorityFilter('all');
    setStatusFilter('all');
  };

  const handleEditTask = (task: Task) => {
    setEditingTask(task);
    setShowTaskForm(true);
  };

  const handleCloseForm = () => {
    setEditingTask(null);
    setShowTaskForm(false);
  };

  const FilterChip = ({ 
    label, 
    isActive, 
    onPress, 
    onRemove 
  }: { 
    label: string; 
    isActive: boolean; 
    onPress: () => void;
    onRemove?: () => void;
  }) => (
    <TouchableOpacity
      onPress={onPress}
      className={`
        flex-row items-center px-3 py-2 rounded-full mr-2 mb-2
        ${isActive 
          ? 'bg-primary-500'
          : isDark ? 'bg-gray-700 border border-gray-600' : 'bg-gray-200 border border-gray-300'
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
      {isActive && onRemove && (
        <TouchableOpacity onPress={onRemove} className="ml-1">
          <X size={14} color="#FFFFFF" />
        </TouchableOpacity>
      )}
    </TouchableOpacity>
  );

  return (
    <SafeAreaView className={`flex-1 ${isDark ? 'bg-gray-900' : 'bg-gray-50'}`}>
      {/* Header */}
      <View className="flex-row items-center p-4">
        <TouchableOpacity
          onPress={() => router.back()}
          className="mr-3 p-1"
        >
          <ArrowLeft size={24} color={isDark ? '#9CA3AF' : '#6B7280'} />
        </TouchableOpacity>
        
        <View className={`
          flex-1 flex-row items-center px-4 py-3 rounded-xl
          ${isDark ? 'bg-gray-800' : 'bg-white'}
          shadow-sm
        `}>
          <SearchIcon size={20} color={isDark ? '#9CA3AF' : '#6B7280'} />
          <TextInput
            value={localQuery}
            onChangeText={setLocalQuery}
            placeholder="Search tasks, tags, or categories..."
            placeholderTextColor={isDark ? '#6B7280' : '#9CA3AF'}
            className={`
              flex-1 ml-3 text-base
              ${isDark ? 'text-white' : 'text-gray-900'}
            `}
            autoFocus
          />
          {localQuery.length > 0 && (
            <TouchableOpacity onPress={() => setLocalQuery('')}>
              <X size={20} color={isDark ? '#9CA3AF' : '#6B7280'} />
            </TouchableOpacity>
          )}
        </View>

        <TouchableOpacity
          onPress={() => setShowFilters(true)}
          className="ml-3 p-3"
        >
          <Filter size={20} color={isDark ? '#9CA3AF' : '#6B7280'} />
        </TouchableOpacity>
      </View>

      {/* Active Filters */}
      {(categoryFilter !== 'all' || priorityFilter !== 'all' || statusFilter !== 'all') && (
        <View className="px-4 pb-2">
          <View className="flex-row flex-wrap items-center">
            <Text className={`text-sm font-medium mr-3 ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
              Filters:
            </Text>
            {categoryFilter !== 'all' && (
              <FilterChip
                label={`Category: ${categoryFilter}`}
                isActive={true}
                onPress={() => {}}
                onRemove={() => setCategoryFilter('all')}
              />
            )}
            {priorityFilter !== 'all' && (
              <FilterChip
                label={`Priority: ${priorityFilter}`}
                isActive={true}
                onPress={() => {}}
                onRemove={() => setPriorityFilter('all')}
              />
            )}
            {statusFilter !== 'all' && (
              <FilterChip
                label={`Status: ${statusFilter}`}
                isActive={true}
                onPress={() => {}}
                onRemove={() => setStatusFilter('all')}
              />
            )}
            <TouchableOpacity onPress={clearFilters}>
              <Text className="text-primary-500 text-sm font-medium">Clear All</Text>
            </TouchableOpacity>
          </View>
        </View>
      )}

      {/* Results */}
      <View className="flex-1 px-4">
        <Text className={`text-sm font-medium mb-3 ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
          {filteredTasks.length} {filteredTasks.length === 1 ? 'result' : 'results'} found
        </Text>

        <ScrollView showsVerticalScrollIndicator={false}>
          {filteredTasks.map(task => (
            <TaskCard 
              key={task.id} 
              task={task} 
              onEdit={handleEditTask}
            />
          ))}

          {filteredTasks.length === 0 && localQuery.trim() && (
            <View className="items-center justify-center py-20">
              <SearchIcon size={64} color={isDark ? '#4B5563' : '#D1D5DB'} />
              <Text className={`text-xl font-semibold mt-4 mb-2 ${isDark ? 'text-white' : 'text-gray-900'}`}>
                No Results Found
              </Text>
              <Text className={`text-center ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                Try searching with different keywords or adjust your filters
              </Text>
            </View>
          )}

          {filteredTasks.length === 0 && !localQuery.trim() && (
            <View className="items-center justify-center py-20">
              <Text className={`text-lg font-medium mb-2 ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                Start searching
              </Text>
              <Text className={`text-center ${isDark ? 'text-gray-500' : 'text-gray-400'}`}>
                Enter keywords to find your tasks
              </Text>
            </View>
          )}
        </ScrollView>
      </View>

      {/* Filters Modal */}
      <Modal
        isVisible={showFilters}
        onBackdropPress={() => setShowFilters(false)}
        className="justify-end m-0"
      >
        <View className={`
          ${isDark ? 'bg-gray-800' : 'bg-white'}
          rounded-t-3xl p-6 max-h-96
        `}>
          <View className="flex-row items-center justify-between mb-6">
            <Text className={`text-xl font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>
              Filters
            </Text>
            <TouchableOpacity onPress={() => setShowFilters(false)}>
              <Text className="text-primary-500 font-medium">Done</Text>
            </TouchableOpacity>
          </View>

          <ScrollView showsVerticalScrollIndicator={false}>
            {/* Category Filter */}
            <View className="mb-6">
              <Text className={`text-lg font-semibold mb-3 ${isDark ? 'text-white' : 'text-gray-900'}`}>
                Category
              </Text>
              <View className="flex-row flex-wrap">
                <FilterChip
                  label="All"
                  isActive={categoryFilter === 'all'}
                  onPress={() => setCategoryFilter('all')}
                />
                {categories.map(category => (
                  <FilterChip
                    key={category}
                    label={category}
                    isActive={categoryFilter === category}
                    onPress={() => setCategoryFilter(category)}
                  />
                ))}
              </View>
            </View>

            {/* Priority Filter */}
            <View className="mb-6">
              <Text className={`text-lg font-semibold mb-3 ${isDark ? 'text-white' : 'text-gray-900'}`}>
                Priority
              </Text>
              <View className="flex-row flex-wrap">
                <FilterChip
                  label="All"
                  isActive={priorityFilter === 'all'}
                  onPress={() => setPriorityFilter('all')}
                />
                {['low', 'medium', 'high'].map(priority => (
                  <FilterChip
                    key={priority}
                    label={priority.charAt(0).toUpperCase() + priority.slice(1)}
                    isActive={priorityFilter === priority}
                    onPress={() => setPriorityFilter(priority)}
                  />
                ))}
              </View>
            </View>

            {/* Status Filter */}
            <View className="mb-4">
              <Text className={`text-lg font-semibold mb-3 ${isDark ? 'text-white' : 'text-gray-900'}`}>
                Status
              </Text>
              <View className="flex-row flex-wrap">
                <FilterChip
                  label="All"
                  isActive={statusFilter === 'all'}
                  onPress={() => setStatusFilter('all')}
                />
                {[
                  { key: 'todo', label: 'To Do' },
                  { key: 'in-progress', label: 'In Progress' },
                  { key: 'completed', label: 'Completed' }
                ].map(status => (
                  <FilterChip
                    key={status.key}
                    label={status.label}
                    isActive={statusFilter === status.key}
                    onPress={() => setStatusFilter(status.key as FilterType)}
                  />
                ))}
              </View>
            </View>
          </ScrollView>
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