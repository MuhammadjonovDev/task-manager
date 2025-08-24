import React from 'react';
import { View, Text, TouchableOpacity, ScrollView } from 'react-native';
import { ChevronLeft, ChevronRight } from 'lucide-react-native';
import { Task } from '../types';
import { useTheme } from '../context/ThemeContext';
import { DateUtils } from '@/utils/dateUtils';

interface CalendarGridProps {
  currentDate: Date;
  tasks: Task[];
  selectedDate: Date | null;
  onDateSelect: (date: Date) => void;
  onMonthChange: (date: Date) => void;
}

export const CalendarGrid: React.FC<CalendarGridProps> = ({
  currentDate,
  tasks,
  selectedDate,
  onDateSelect,
  onMonthChange,
}) => {
  const { isDark } = useTheme();
  
  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();
  const daysInMonth = DateUtils.getDaysInMonth(year, month);
  const firstDayOfMonth = DateUtils.getFirstDayOfMonth(year, month);
  const today = new Date();

  const getTasksForDate = (date: Date) => {
    return tasks.filter(task => 
      task.dueDate && DateUtils.isSameDay(task.dueDate, date)
    );
  };

  const navigateMonth = (direction: 'prev' | 'next') => {
    const newDate = new Date(currentDate);
    newDate.setMonth(month + (direction === 'next' ? 1 : -1));
    onMonthChange(newDate);
  };

  const renderCalendarDays = () => {
    const days = [];
    
    // Empty cells for days before the first day of the month
    for (let i = 0; i < firstDayOfMonth; i++) {
      days.push(<View key={`empty-${i}`} className="flex-1 aspect-square" />);
    }
    
    // Days of the month
    for (let day = 1; day <= daysInMonth; day++) {
      const date = new Date(year, month, day);
      const isToday = DateUtils.isSameDay(date, today);
      const isSelected = selectedDate && DateUtils.isSameDay(date, selectedDate);
      const dayTasks = getTasksForDate(date);
      const hasCompletedTasks = dayTasks.some(task => task.status === 'completed');
      const hasPendingTasks = dayTasks.some(task => task.status !== 'completed');
      
      days.push(
        <TouchableOpacity
          key={day}
          onPress={() => onDateSelect(date)}
          className={`
            flex-1 aspect-square p-1 rounded-lg m-0.5 justify-center items-center
            ${isSelected 
              ? 'bg-primary-500'
              : isToday 
                ? isDark ? 'bg-primary-900' : 'bg-primary-50'
                : ''
            }
          `}
        >
          <Text className={`
            text-sm font-medium
            ${isSelected 
              ? 'text-white'
              : isToday 
                ? 'text-primary-600'
                : isDark ? 'text-white' : 'text-gray-900'
            }
          `}>
            {day}
          </Text>
          
          {/* Task indicators */}
          <View className="flex-row space-x-0.5 mt-0.5">
            {hasCompletedTasks && (
              <View className="w-1.5 h-1.5 bg-accent-500 rounded-full" />
            )}
            {hasPendingTasks && (
              <View className="w-1.5 h-1.5 bg-warning-500 rounded-full" />
            )}
          </View>
        </TouchableOpacity>
      );
    }
    
    return days;
  };

  return (
    <View className={`
      ${isDark ? 'bg-gray-800' : 'bg-white'}
      rounded-xl p-4 mb-4 shadow-sm
    `}>
      {/* Header */}
      <View className="flex-row items-center justify-between mb-4">
        <TouchableOpacity 
          onPress={() => navigateMonth('prev')}
          className="p-2"
        >
          <ChevronLeft size={20} color={isDark ? '#9CA3AF' : '#6B7280'} />
        </TouchableOpacity>
        
        <Text className={`text-lg font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>
          {DateUtils.getMonthName(month)} {year}
        </Text>
        
        <TouchableOpacity 
          onPress={() => navigateMonth('next')}
          className="p-2"
        >
          <ChevronRight size={20} color={isDark ? '#9CA3AF' : '#6B7280'} />
        </TouchableOpacity>
      </View>

      {/* Week days */}
      <View className="flex-row mb-2">
        {DateUtils.getWeekDays().map(day => (
          <View key={day} className="flex-1 items-center">
            <Text className={`
              text-xs font-medium
              ${isDark ? 'text-gray-400' : 'text-gray-500'}
            `}>
              {day}
            </Text>
          </View>
        ))}
      </View>

      {/* Calendar grid */}
      <View className="flex-row flex-wrap">
        {renderCalendarDays()}
      </View>

      {/* Legend */}
      <View className="flex-row items-center justify-center space-x-4 mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
        <View className="flex-row items-center">
          <View className="w-2 h-2 bg-accent-500 rounded-full mr-1" />
          <Text className={`text-xs ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
            Completed
          </Text>
        </View>
        <View className="flex-row items-center">
          <View className="w-2 h-2 bg-warning-500 rounded-full mr-1" />
          <Text className={`text-xs ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
            Pending
          </Text>
        </View>
      </View>
    </View>
  );
};