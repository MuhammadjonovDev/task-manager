import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, ScrollView, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ArrowLeft, Search, Trash2 } from 'lucide-react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { useTask } from '../../context/TaskContext';
import { useTheme } from '../../context/ThemeContext';
import { Task } from '../../types';
import DateTimePicker from '@react-native-community/datetimepicker';
import { Platform } from 'react-native';

export default function EditTask() {
  const router = useRouter();
  const { id } = useLocalSearchParams();
  const { tasks, updateTask, deleteTask } = useTask();
  const { isDark } = useTheme();
  
  const [task, setTask] = useState<Task | null>(null);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: 'Design',
    priority: 'medium' as 'low' | 'medium' | 'high',
    status: 'todo' as 'todo' | 'in-progress' | 'completed',
    dueDate: new Date(),
    startTime: new Date(),
    endTime: new Date(Date.now() + 2 * 60 * 60 * 1000),
    tags: [] as string[],
  });

  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showStartTimePicker, setShowStartTimePicker] = useState(false);
  const [showEndTimePicker, setShowEndTimePicker] = useState(false);

  const categories = ['Design', 'Meeting', 'Coding', 'BDE', 'Testing', 'Quick call'];
  const statuses = [
    { key: 'todo', label: 'To Do' },
    { key: 'in-progress', label: 'In Progress' },
    { key: 'completed', label: 'Completed' }
  ];

  useEffect(() => {
    const foundTask = tasks.find(t => t.id === id);
    if (foundTask) {
      setTask(foundTask);
      setFormData({
        title: foundTask.title,
        description: foundTask.description,
        category: foundTask.category,
        priority: foundTask.priority,
        status: foundTask.status,
        dueDate: foundTask.dueDate || new Date(),
        startTime: foundTask.dueDate || new Date(),
        endTime: new Date((foundTask.dueDate?.getTime() || Date.now()) + 2 * 60 * 60 * 1000),
        tags: foundTask.tags,
      });
    } else {
      Alert.alert('Error', 'Task not found', [
        { text: 'OK', onPress: () => router.back() }
      ]);
    }
  }, [id, tasks]);

  const handleSubmit = async () => {
    if (!formData.title.trim()) {
      Alert.alert('Error', 'Please enter a task name');
      return;
    }

    if (!task) return;

    try {
      await updateTask({
        ...task,
        title: formData.title,
        description: formData.description,
        category: formData.category,
        priority: formData.priority,
        status: formData.status,
        dueDate: formData.dueDate,
        tags: formData.tags,
      });
      
      Alert.alert('Success', 'Task updated successfully', [
        { text: 'OK', onPress: () => router.back() }
      ]);
    } catch (error) {
      Alert.alert('Error', 'Failed to update task');
    }
  };

  const handleDelete = () => {
    Alert.alert(
      'Delete Task',
      'Are you sure you want to delete this task?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            if (task) {
              await deleteTask(task.id);
              router.back();
            }
          },
        },
      ]
    );
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: true
    });
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  if (!task) {
    return (
      <SafeAreaView className="flex-1 bg-gray-100 items-center justify-center">
        <Text className="text-lg text-gray-600">Loading task...</Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-gray-100">
      {/* Purple Header Section */}
      <View className="bg-gradient-to-br from-purple-600 to-blue-600 px-4 pt-4 pb-8">
        {/* Top Navigation */}
        <View className="flex-row items-center justify-between mb-8">
          <TouchableOpacity onPress={() => router.back()}>
            <ArrowLeft size={24} color="#FFFFFF" />
          </TouchableOpacity>
          <Text className="text-white text-lg font-semibold">Edit Task</Text>
          <TouchableOpacity onPress={handleDelete}>
            <Trash2 size={24} color="#FFFFFF" />
          </TouchableOpacity>
        </View>

        {/* Task Name */}
        <View className="mb-6">
          <Text className="text-white text-sm font-medium mb-2 opacity-90">Name</Text>
          <TextInput
            value={formData.title}
            onChangeText={(text) => setFormData(prev => ({ ...prev, title: text }))}
            placeholder="Enter task name..."
            placeholderTextColor="rgba(255,255,255,0.7)"
            className="text-white text-2xl font-bold"
            style={{ fontSize: 28, lineHeight: 34 }}
          />
          <View className="h-0.5 bg-white opacity-30 mt-2" />
        </View>

        {/* Date */}
        <View>
          <Text className="text-white text-sm font-medium mb-2 opacity-90">Date</Text>
          <TouchableOpacity onPress={() => setShowDatePicker(true)}>
            <Text className="text-white text-2xl font-bold">
              {formatDate(formData.dueDate)}
            </Text>
          </TouchableOpacity>
          <View className="h-0.5 bg-white opacity-30 mt-2" />
        </View>
      </View>

      {/* White Content Section */}
      <ScrollView className="flex-1 bg-white px-4 pt-6">
        {/* Time Section */}
        <View className="flex-row mb-8">
          <View className="flex-1 mr-4">
            <Text className="text-gray-400 text-sm font-medium mb-2">Start Time</Text>
            <TouchableOpacity onPress={() => setShowStartTimePicker(true)}>
              <Text className="text-gray-900 text-xl font-bold">
                {formatTime(formData.startTime)}
              </Text>
            </TouchableOpacity>
          </View>
          <View className="flex-1">
            <Text className="text-gray-400 text-sm font-medium mb-2">End Time</Text>
            <TouchableOpacity onPress={() => setShowEndTimePicker(true)}>
              <Text className="text-gray-900 text-xl font-bold">
                {formatTime(formData.endTime)}
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Description */}
        <View className="mb-8">
          <Text className="text-gray-400 text-sm font-medium mb-3">Description</Text>
          <TextInput
            value={formData.description}
            onChangeText={(text) => setFormData(prev => ({ ...prev, description: text }))}
            placeholder="Lorem ipsum dolor sit amet, er adipiscing elit, sed dianummy nibh euismod dolor sit amet, er adipiscing elit, sed dianummy nibh euismod."
            placeholderTextColor="#9CA3AF"
            multiline
            numberOfLines={4}
            className="text-gray-700 text-base leading-6"
            style={{ textAlignVertical: 'top', minHeight: 100 }}
          />
        </View>

        {/* Status (for editing) */}
        <View className="mb-8">
          <Text className="text-gray-400 text-sm font-medium mb-4">Status</Text>
          <View className="flex-row flex-wrap">
            {statuses.map((status) => (
              <TouchableOpacity
                key={status.key}
                onPress={() => setFormData(prev => ({ ...prev, status: status.key as any }))}
                className={`
                  px-6 py-3 rounded-full mr-3 mb-3
                  ${formData.status === status.key
                    ? 'bg-gradient-to-r from-purple-600 to-blue-600'
                    : 'bg-gray-100'
                  }
                `}
              >
                <Text className={`
                  font-medium
                  ${formData.status === status.key ? 'text-white' : 'text-gray-600'}
                `}>
                  {status.label}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Category */}
        <View className="mb-8">
          <Text className="text-gray-400 text-sm font-medium mb-4">Category</Text>
          <View className="flex-row flex-wrap">
            {categories.map((category, index) => (
              <TouchableOpacity
                key={category}
                onPress={() => setFormData(prev => ({ ...prev, category }))}
                className={`
                  px-6 py-3 rounded-full mr-3 mb-3
                  ${formData.category === category
                    ? 'bg-gradient-to-r from-purple-600 to-blue-600'
                    : 'bg-gray-100'
                  }
                `}
              >
                <Text className={`
                  font-medium
                  ${formData.category === category ? 'text-white' : 'text-gray-600'}
                `}>
                  {category}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Update Task Button */}
        <TouchableOpacity
          onPress={handleSubmit}
          className="bg-gradient-to-r from-purple-600 to-blue-600 py-4 rounded-2xl mb-8"
        >
          <Text className="text-white text-lg font-semibold text-center">
            Update Task
          </Text>
        </TouchableOpacity>
      </ScrollView>

      {/* Date Picker */}
      {showDatePicker && (
        <DateTimePicker
          value={formData.dueDate}
          mode="date"
          display={Platform.OS === 'ios' ? 'spinner' : 'default'}
          onChange={(event, selectedDate) => {
            setShowDatePicker(false);
            if (selectedDate) {
              setFormData(prev => ({ ...prev, dueDate: selectedDate }));
            }
          }}
        />
      )}

      {/* Start Time Picker */}
      {showStartTimePicker && (
        <DateTimePicker
          value={formData.startTime}
          mode="time"
          display={Platform.OS === 'ios' ? 'spinner' : 'default'}
          onChange={(event, selectedTime) => {
            setShowStartTimePicker(false);
            if (selectedTime) {
              setFormData(prev => ({ ...prev, startTime: selectedTime }));
            }
          }}
        />
      )}

      {/* End Time Picker */}
      {showEndTimePicker && (
        <DateTimePicker
          value={formData.endTime}
          mode="time"
          display={Platform.OS === 'ios' ? 'spinner' : 'default'}
          onChange={(event, selectedTime) => {
            setShowEndTimePicker(false);
            if (selectedTime) {
              setFormData(prev => ({ ...prev, endTime: selectedTime }));
            }
          }}
        />
      )}
    </SafeAreaView>
  );
}