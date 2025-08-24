import React from 'react';
import { View, Text, TouchableOpacity, Alert } from 'react-native';
import { CircleCheck as CheckCircle, Circle, Clock, TriangleAlert as AlertTriangle, Trash2, CreditCard as Edit } from 'lucide-react-native';
import { Task } from '../types';
import { useTask } from '../context/TaskContext';
import { useTheme } from '../context/ThemeContext';
import { DateUtils } from '@/utils/dateUtils';

interface TaskCardProps {
  task: Task;
  onEdit?: (task: Task) => void;
  compact?: boolean;
}

export const TaskCard: React.FC<TaskCardProps> = ({ task, onEdit, compact = false }) => {
  const { deleteTask, toggleTaskStatus } = useTask();
  const { isDark } = useTheme();

  const handleDelete = () => {
    Alert.alert(
      'Delete Task',
      'Are you sure you want to delete this task?',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Delete', style: 'destructive', onPress: () => deleteTask(task.id) },
      ]
    );
  };

  const getPriorityColor = (priority: Task['priority']) => {
    switch (priority) {
      case 'high': return 'text-danger-600';
      case 'medium': return 'text-warning-600';
      case 'low': return 'text-accent-600';
    }
  };

  const getPriorityBg = (priority: Task['priority']) => {
    switch (priority) {
      case 'high': return 'bg-danger-50';
      case 'medium': return 'bg-warning-50';
      case 'low': return 'bg-accent-50';
    }
  };

  const isOverdue = task.dueDate && task.status !== 'completed' && DateUtils.isOverdue(task.dueDate);
  
  return (
    <View className={`
      ${isDark ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'}
      border rounded-xl p-4 mb-3 shadow-sm
    `}>
      {/* Header */}
      <View className="flex-row items-start justify-between mb-2">
        <TouchableOpacity 
          onPress={() => toggleTaskStatus(task.id)}
          className="mr-3 mt-1"
        >
          {task.status === 'completed' ? (
            <CheckCircle size={20} color="#10B981" />
          ) : (
            <Circle size={20} color={isDark ? '#9CA3AF' : '#6B7280'} />
          )}
        </TouchableOpacity>
        
        <View className="flex-1">
          <Text className={`
            text-lg font-semibold
            ${task.status === 'completed' ? 'line-through opacity-60' : ''}
            ${isDark ? 'text-white' : 'text-gray-900'}
          `}>
            {task.title}
          </Text>
          
          {!compact && task.description && (
            <Text className={`
              text-sm mt-1
              ${isDark ? 'text-gray-300' : 'text-gray-600'}
            `}>
              {task.description}
            </Text>
          )}
        </View>

        <View className="flex-row space-x-2 ml-2">
          {onEdit && (
            <TouchableOpacity onPress={() => onEdit(task)}>
              <Edit size={18} color={isDark ? '#9CA3AF' : '#6B7280'} />
            </TouchableOpacity>
          )}
          <TouchableOpacity onPress={handleDelete}>
            <Trash2 size={18} color="#EF4444" />
          </TouchableOpacity>
        </View>
      </View>

      {/* Tags and Category */}
      {!compact && (
        <View className="flex-row flex-wrap mb-2">
          <View className={`
            px-2 py-1 rounded-full mr-2 mb-1
            ${isDark ? 'bg-primary-900' : 'bg-primary-50'}
          `}>
            <Text className={`text-xs font-medium ${isDark ? 'text-primary-300' : 'text-primary-700'}`}>
              {task.category}
            </Text>
          </View>
          
          {task.tags.map((tag, index) => (
            <View 
              key={index}
              className={`
                px-2 py-1 rounded-full mr-1 mb-1
                ${isDark ? 'bg-gray-700' : 'bg-gray-100'}
              `}
            >
              <Text className={`text-xs ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
                {tag}
              </Text>
            </View>
          ))}
        </View>
      )}

      {/* Footer */}
      <View className="flex-row items-center justify-between">
        <View className={`
          px-2 py-1 rounded-full
          ${getPriorityBg(task.priority)}
        `}>
          <Text className={`text-xs font-medium ${getPriorityColor(task.priority)}`}>
            {task.priority.toUpperCase()}
          </Text>
        </View>

        {task.dueDate && (
          <View className="flex-row items-center">
            {isOverdue ? (
              <AlertTriangle size={14} color="#EF4444" />
            ) : (
              <Clock size={14} color={isDark ? '#9CA3AF' : '#6B7280'} />
            )}
            <Text className={`
              text-xs ml-1
              ${isOverdue ? 'text-danger-600' : isDark ? 'text-gray-400' : 'text-gray-500'}
            `}>
              {DateUtils.formatDate(task.dueDate)}
            </Text>
          </View>
        )}
      </View>
    </View>
  );
};