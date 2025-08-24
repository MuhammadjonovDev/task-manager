import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, ScrollView, Alert } from 'react-native';
import { X, Calendar, Tag, Flag } from 'lucide-react-native';
import { Task } from '../types';
import { useTask } from '../context/TaskContext';
import { useTheme } from '../context/ThemeContext';

interface TaskFormProps {
  task?: Task;
  onClose: () => void;
}

export const TaskForm: React.FC<TaskFormProps> = ({ task, onClose }) => {
  const { addTask, updateTask } = useTask();
  const { isDark } = useTheme();
  const isEditing = Boolean(task);

  const [formData, setFormData] = useState({
    title: task?.title || '',
    description: task?.description || '',
    category: task?.category || 'General',
    priority: task?.priority || 'medium' as Task['priority'],
    status: task?.status || 'todo' as Task['status'],
    dueDate: task?.dueDate || null,
    tags: task?.tags || [],
  });

  const [newTag, setNewTag] = useState('');

  const categories = ['General', 'Work', 'Personal', 'Health', 'Learning', 'Shopping'];
  const priorities: Task['priority'][] = ['low', 'medium', 'high'];
  const statuses: Task['status'][] = ['todo', 'in-progress', 'completed'];

  const handleSubmit = async () => {
    if (!formData.title.trim()) {
      Alert.alert('Error', 'Please enter a task title');
      return;
    }

    try {
      if (isEditing && task) {
        await updateTask({ ...task, ...formData });
      } else {
        await addTask(formData);
      }
      onClose();
    } catch (error) {
      Alert.alert('Error', 'Failed to save task');
    }
  };

  const addTag = () => {
    if (newTag.trim() && !formData.tags.includes(newTag.trim())) {
      setFormData(prev => ({
        ...prev,
        tags: [...prev.tags, newTag.trim()]
      }));
      setNewTag('');
    }
  };

  const removeTag = (tagToRemove: string) => {
    setFormData(prev => ({
      ...prev,
      tags: prev.tags.filter(tag => tag !== tagToRemove)
    }));
  };

  return (
    <View className={`
      flex-1 
      ${isDark ? 'bg-gray-900' : 'bg-white'}
    `}>
      {/* Header */}
      <View className={`
        flex-row items-center justify-between p-4 border-b
        ${isDark ? 'border-gray-700' : 'border-gray-200'}
      `}>
        <Text className={`text-xl font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>
          {isEditing ? 'Edit Task' : 'New Task'}
        </Text>
        <TouchableOpacity onPress={onClose}>
          <X size={24} color={isDark ? '#9CA3AF' : '#6B7280'} />
        </TouchableOpacity>
      </View>

      <ScrollView className="flex-1 p-4">
        {/* Title */}
        <View className="mb-4">
          <Text className={`text-sm font-medium mb-2 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
            Title *
          </Text>
          <TextInput
            value={formData.title}
            onChangeText={(text) => setFormData(prev => ({ ...prev, title: text }))}
            placeholder="Enter task title..."
            placeholderTextColor={isDark ? '#6B7280' : '#9CA3AF'}
            className={`
              border rounded-lg p-3 text-base
              ${isDark 
                ? 'bg-gray-800 border-gray-700 text-white' 
                : 'bg-gray-50 border-gray-300 text-gray-900'
              }
            `}
          />
        </View>

        {/* Description */}
        <View className="mb-4">
          <Text className={`text-sm font-medium mb-2 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
            Description
          </Text>
          <TextInput
            value={formData.description}
            onChangeText={(text) => setFormData(prev => ({ ...prev, description: text }))}
            placeholder="Enter task description..."
            placeholderTextColor={isDark ? '#6B7280' : '#9CA3AF'}
            multiline
            numberOfLines={4}
            className={`
              border rounded-lg p-3 text-base
              ${isDark 
                ? 'bg-gray-800 border-gray-700 text-white' 
                : 'bg-gray-50 border-gray-300 text-gray-900'
              }
            `}
            style={{ textAlignVertical: 'top' }}
          />
        </View>

        {/* Category */}
        <View className="mb-4">
          <Text className={`text-sm font-medium mb-2 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
            Category
          </Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} className="mb-2">
            <View className="flex-row space-x-2">
              {categories.map(category => (
                <TouchableOpacity
                  key={category}
                  onPress={() => setFormData(prev => ({ ...prev, category }))}
                  className={`
                    px-4 py-2 rounded-full border
                    ${formData.category === category
                      ? 'bg-primary-500 border-primary-500'
                      : isDark 
                        ? 'bg-gray-800 border-gray-600'
                        : 'bg-gray-100 border-gray-300'
                    }
                  `}
                >
                  <Text className={`
                    text-sm font-medium
                    ${formData.category === category
                      ? 'text-white'
                      : isDark ? 'text-gray-300' : 'text-gray-700'
                    }
                  `}>
                    {category}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </ScrollView>
        </View>

        {/* Priority */}
        <View className="mb-4">
          <Text className={`text-sm font-medium mb-2 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
            Priority
          </Text>
          <View className="flex-row space-x-2">
            {priorities.map(priority => (
              <TouchableOpacity
                key={priority}
                onPress={() => setFormData(prev => ({ ...prev, priority }))}
                className={`
                  flex-1 flex-row items-center justify-center px-4 py-3 rounded-lg border
                  ${formData.priority === priority
                    ? 'bg-primary-500 border-primary-500'
                    : isDark 
                      ? 'bg-gray-800 border-gray-600'
                      : 'bg-gray-100 border-gray-300'
                  }
                `}
              >
                <Flag 
                  size={16} 
                  color={formData.priority === priority ? '#FFFFFF' : (isDark ? '#9CA3AF' : '#6B7280')} 
                />
                <Text className={`
                  text-sm font-medium ml-2 capitalize
                  ${formData.priority === priority
                    ? 'text-white'
                    : isDark ? 'text-gray-300' : 'text-gray-700'
                  }
                `}>
                  {priority}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Status (only when editing) */}
        {isEditing && (
          <View className="mb-4">
            <Text className={`text-sm font-medium mb-2 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
              Status
            </Text>
            <View className="flex-row space-x-2">
              {statuses.map(status => (
                <TouchableOpacity
                  key={status}
                  onPress={() => setFormData(prev => ({ ...prev, status }))}
                  className={`
                    flex-1 px-4 py-3 rounded-lg border
                    ${formData.status === status
                      ? 'bg-primary-500 border-primary-500'
                      : isDark 
                        ? 'bg-gray-800 border-gray-600'
                        : 'bg-gray-100 border-gray-300'
                    }
                  `}
                >
                  <Text className={`
                    text-sm font-medium text-center capitalize
                    ${formData.status === status
                      ? 'text-white'
                      : isDark ? 'text-gray-300' : 'text-gray-700'
                    }
                  `}>
                    {status === 'todo' ? 'To Do' : status === 'in-progress' ? 'In Progress' : 'Completed'}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        )}

        {/* Tags */}
        <View className="mb-6">
          <Text className={`text-sm font-medium mb-2 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
            Tags
          </Text>
          
          {/* Add tag input */}
          <View className="flex-row mb-3">
            <TextInput
              value={newTag}
              onChangeText={setNewTag}
              placeholder="Add a tag..."
              placeholderTextColor={isDark ? '#6B7280' : '#9CA3AF'}
              className={`
                flex-1 border rounded-l-lg p-3 text-base
                ${isDark 
                  ? 'bg-gray-800 border-gray-700 text-white' 
                  : 'bg-gray-50 border-gray-300 text-gray-900'
                }
              `}
              onSubmitEditing={addTag}
            />
            <TouchableOpacity
              onPress={addTag}
              className="bg-primary-500 px-4 rounded-r-lg justify-center"
            >
              <Tag size={20} color="#FFFFFF" />
            </TouchableOpacity>
          </View>

          {/* Existing tags */}
          <View className="flex-row flex-wrap">
            {formData.tags.map((tag, index) => (
              <TouchableOpacity
                key={index}
                onPress={() => removeTag(tag)}
                className={`
                  flex-row items-center px-3 py-1 rounded-full mr-2 mb-2
                  ${isDark ? 'bg-gray-700' : 'bg-gray-200'}
                `}
              >
                <Text className={`text-sm mr-1 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                  {tag}
                </Text>
                <X size={14} color={isDark ? '#9CA3AF' : '#6B7280'} />
              </TouchableOpacity>
            ))}
          </View>
        </View>
      </ScrollView>

      {/* Footer */}
      <View className={`
        p-4 border-t
        ${isDark ? 'border-gray-700' : 'border-gray-200'}
      `}>
        <View className="flex-row space-x-3">
          <TouchableOpacity
            onPress={onClose}
            className={`
              flex-1 py-3 rounded-lg border
              ${isDark ? 'border-gray-600' : 'border-gray-300'}
            `}
          >
            <Text className={`
              text-center font-semibold
              ${isDark ? 'text-gray-300' : 'text-gray-700'}
            `}>
              Cancel
            </Text>
          </TouchableOpacity>
          
          <TouchableOpacity
            onPress={handleSubmit}
            className="flex-1 py-3 bg-primary-500 rounded-lg"
          >
            <Text className="text-center font-semibold text-white">
              {isEditing ? 'Update' : 'Create'} Task
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};