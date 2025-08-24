import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Plus } from 'lucide-react-native';
import { useTask } from '../../context/TaskContext';
import { useTheme } from '../../context/ThemeContext';
import { CalendarGrid } from '../../components/CalendarGrid';
import { TaskCard } from '../../components/TaskCard';
import { TaskForm } from '../../components/TaskForm';
import { Task } from '../../types';
import { DateUtils } from '../../utils/dateUtils';
import Modal from 'react-native-modal';

export default function Calendar() {
  const { tasks } = useTask();
  const { isDark } = useTheme();
  
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [showTaskForm, setShowTaskForm] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);

  const selectedDateTasks = selectedDate 
    ? tasks.filter(task => 
        task.dueDate && DateUtils.isSameDay(task.dueDate, selectedDate)
      )
    : [];

  const handleDateSelect = (date: Date) => {
    setSelectedDate(date);
  };

  const handleAddTask = () => {
    setEditingTask(null);
    setShowTaskForm(true);
  };

  const handleEditTask = (task: Task) => {
    setEditingTask(task);
    setShowTaskForm(true);
  };

  const handleCloseForm = () => {
    setEditingTask(null);
    setShowTaskForm(false);
  };

  return (
    <SafeAreaView className={`flex-1 ${isDark ? 'bg-gray-900' : 'bg-gray-50'}`}>
      {/* Header */}
      <View className="flex-row items-center justify-between p-4">
        <View>
          <Text className={`text-2xl font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>
            Calendar
          </Text>
          <Text className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
            {selectedDate 
              ? `${selectedDateTasks.length} tasks on ${DateUtils.formatDate(selectedDate)}`
              : 'Select a date to view tasks'
            }
          </Text>
        </View>
        {selectedDate && (
          <TouchableOpacity
            onPress={handleAddTask}
            className={`
              p-3 rounded-xl
              ${isDark ? 'bg-gray-800' : 'bg-white'}
              shadow-sm
            `}
          >
            <Plus size={20} color="#3B82F6" />
          </TouchableOpacity>
        )}
      </View>

      <ScrollView className="flex-1 px-4">
        {/* Calendar Grid */}
        <CalendarGrid
          currentDate={currentDate}
          tasks={tasks}
          selectedDate={selectedDate}
          onDateSelect={handleDateSelect}
          onMonthChange={setCurrentDate}
        />

        {/* Selected Date Tasks */}
        {selectedDate && (
          <View className="mb-6">
            <View className="flex-row items-center justify-between mb-4">
              <Text className={`text-lg font-semibold ${isDark ? 'text-white' : 'text-gray-900'}`}>
                Tasks for {DateUtils.formatDate(selectedDate)}
              </Text>
              {DateUtils.isToday(selectedDate) && (
                <View className="px-2 py-1 bg-primary-50 rounded-full">
                  <Text className="text-primary-600 text-xs font-medium">Today</Text>
                </View>
              )}
            </View>

            {selectedDateTasks.length > 0 ? (
              selectedDateTasks.map(task => (
                <TaskCard 
                  key={task.id} 
                  task={task} 
                  onEdit={handleEditTask}
                />
              ))
            ) : (
              <View className={`
                p-6 rounded-xl items-center
                ${isDark ? 'bg-gray-800' : 'bg-white'}
                shadow-sm
              `}>
                <Text className={`text-lg font-medium mb-2 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                  No tasks scheduled
                </Text>
                <Text className={`text-center mb-4 ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                  Add a task for this date to get started
                </Text>
                <TouchableOpacity
                  onPress={handleAddTask}
                  className="flex-row items-center px-4 py-2 bg-primary-500 rounded-lg"
                >
                  <Plus size={16} color="#FFFFFF" />
                  <Text className="text-white font-medium ml-2">Add Task</Text>
                </TouchableOpacity>
              </View>
            )}
          </View>
        )}

        {/* Monthly Overview */}
        {!selectedDate && (
          <View className={`
            p-4 rounded-xl mb-6
            ${isDark ? 'bg-gray-800' : 'bg-white'}
            shadow-sm
          `}>
            <Text className={`text-lg font-semibold mb-3 ${isDark ? 'text-white' : 'text-gray-900'}`}>
              {DateUtils.getMonthName(currentDate.getMonth())} Overview
            </Text>
            
            <View className="flex-row justify-between">
              <View className="items-center">
                <Text className={`text-2xl font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>
                  {tasks.filter(task => 
                    task.dueDate && 
                    task.dueDate.getMonth() === currentDate.getMonth() &&
                    task.dueDate.getFullYear() === currentDate.getFullYear()
                  ).length}
                </Text>
                <Text className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                  Total Tasks
                </Text>
              </View>
              
              <View className="items-center">
                <Text className="text-2xl font-bold text-accent-500">
                  {tasks.filter(task => 
                    task.dueDate && 
                    task.dueDate.getMonth() === currentDate.getMonth() &&
                    task.dueDate.getFullYear() === currentDate.getFullYear() &&
                    task.status === 'completed'
                  ).length}
                </Text>
                <Text className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                  Completed
                </Text>
              </View>
              
              <View className="items-center">
                <Text className="text-2xl font-bold text-warning-500">
                  {tasks.filter(task => 
                    task.dueDate && 
                    task.dueDate.getMonth() === currentDate.getMonth() &&
                    task.dueDate.getFullYear() === currentDate.getFullYear() &&
                    task.status !== 'completed'
                  ).length}
                </Text>
                <Text className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                  Pending
                </Text>
              </View>
            </View>
          </View>
        )}
      </ScrollView>

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