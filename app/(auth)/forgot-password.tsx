import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, KeyboardAvoidingView, Platform } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Mail, ArrowLeft, ArrowRight } from 'lucide-react-native';
import { useRouter } from 'expo-router';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';

export default function ForgotPassword() {
  const router = useRouter();
  const { resetPassword, loading } = useAuth();
  const { isDark } = useTheme();
  
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');

  const validateEmail = () => {
    if (!email.trim()) {
      setError('Email is required');
      return false;
    }
    if (!/\S+@\S+\.\S+/.test(email)) {
      setError('Please enter a valid email');
      return false;
    }
    setError('');
    return true;
  };

  const handleResetPassword = async () => {
    if (!validateEmail()) return;

    const success = await resetPassword(email);
    if (success) {
      router.back();
    }
  };

  return (
    <SafeAreaView className={`flex-1 ${isDark ? 'bg-gray-900' : 'bg-gray-50'}`}>
      <KeyboardAvoidingView 
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        className="flex-1"
      >
        {/* Header */}
        <View className="flex-row items-center p-4">
          <TouchableOpacity onPress={() => router.back()}>
            <ArrowLeft size={24} color={isDark ? '#9CA3AF' : '#6B7280'} />
          </TouchableOpacity>
        </View>

        <View className="flex-1 justify-center px-6">
          {/* Title */}
          <View className="items-center mb-8">
            <View className="w-20 h-20 bg-primary-500 rounded-full items-center justify-center mb-4">
              <Mail size={32} color="#FFFFFF" />
            </View>
            <Text className={`text-3xl font-bold mb-2 ${isDark ? 'text-white' : 'text-gray-900'}`}>
              Reset Password
            </Text>
            <Text className={`text-center ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
              Enter your email address and we'll send you instructions to reset your password
            </Text>
          </View>

          {/* Form */}
          <View>
            <Text className={`text-sm font-medium mb-2 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
              Email Address
            </Text>
            <View className={`
              flex-row items-center border rounded-xl px-4 py-3
              ${error 
                ? 'border-danger-500' 
                : isDark ? 'border-gray-600 bg-gray-800' : 'border-gray-300 bg-white'
              }
            `}>
              <Mail size={20} color={isDark ? '#9CA3AF' : '#6B7280'} />
              <TextInput
                value={email}
                onChangeText={(text) => {
                  setEmail(text);
                  if (error) setError('');
                }}
                placeholder="Enter your email"
                placeholderTextColor={isDark ? '#6B7280' : '#9CA3AF'}
                keyboardType="email-address"
                autoCapitalize="none"
                autoComplete="email"
                className={`flex-1 ml-3 text-base ${isDark ? 'text-white' : 'text-gray-900'}`}
              />
            </View>
            {error && (
              <Text className="text-danger-500 text-sm mt-1">{error}</Text>
            )}
          </View>

          {/* Reset Button */}
          <TouchableOpacity
            onPress={handleResetPassword}
            disabled={loading}
            className={`
              flex-row items-center justify-center py-4 rounded-xl mt-8
              ${loading ? 'bg-gray-400' : 'bg-primary-500'}
            `}
          >
            <Text className="text-white text-lg font-semibold mr-2">
              {loading ? 'Sending...' : 'Send Reset Link'}
            </Text>
            {!loading && <ArrowRight size={20} color="#FFFFFF" />}
          </TouchableOpacity>

          {/* Back to Sign In */}
          <View className="flex-row items-center justify-center mt-6">
            <Text className={`${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
              Remember your password?{' '}
            </Text>
            <TouchableOpacity onPress={() => router.push('/(auth)/sign-in')}>
              <Text className="text-primary-500 font-semibold">Sign In</Text>
            </TouchableOpacity>
          </View>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}