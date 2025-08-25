import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Alert, KeyboardAvoidingView, Platform } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Eye, EyeOff, Mail, Lock, ArrowRight } from 'lucide-react-native';
import { useRouter } from 'expo-router';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';

export default function SignIn() {
  const router = useRouter();
  const { signIn, loading } = useAuth();
  const { isDark } = useTheme();
  
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  const validateForm = () => {
    const newErrors: { [key: string]: string } = {};

    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email';
    }

    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSignIn = async () => {
    if (!validateForm()) return;

    const success = await signIn(formData.email, formData.password);
    if (success) {
      router.replace('/(tabs)');
    }
  };

  const handleForgotPassword = () => {
    router.push('/(auth)/forgot-password');
  };

  return (
    <SafeAreaView className={`flex-1 ${isDark ? 'bg-gray-900' : 'bg-gray-50'}`}>
      <KeyboardAvoidingView 
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        className="flex-1"
      >
        <View className="flex-1 justify-center px-6">
          {/* Header */}
          <View className="items-center mb-8">
            <View className="w-20 h-20 bg-primary-500 rounded-full items-center justify-center mb-4">
              <Lock size={32} color="#FFFFFF" />
            </View>
            <Text className={`text-3xl font-bold mb-2 ${isDark ? 'text-white' : 'text-gray-900'}`}>
              Welcome Back
            </Text>
            <Text className={`text-center ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
              Sign in to continue managing your tasks
            </Text>
          </View>

          {/* Form */}
          <View className="space-y-4">
            {/* Email Input */}
            <View>
              <Text className={`text-sm font-medium mb-2 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                Email Address
              </Text>
              <View className={`
                flex-row items-center border rounded-xl px-4 py-3
                ${errors.email 
                  ? 'border-danger-500' 
                  : isDark ? 'border-gray-600 bg-gray-800' : 'border-gray-300 bg-white'
                }
              `}>
                <Mail size={20} color={isDark ? '#9CA3AF' : '#6B7280'} />
                <TextInput
                  value={formData.email}
                  onChangeText={(text) => {
                    setFormData(prev => ({ ...prev, email: text }));
                    if (errors.email) setErrors(prev => ({ ...prev, email: '' }));
                  }}
                  placeholder="Enter your email"
                  placeholderTextColor={isDark ? '#6B7280' : '#9CA3AF'}
                  keyboardType="email-address"
                  autoCapitalize="none"
                  autoComplete="email"
                  className={`flex-1 ml-3 text-base ${isDark ? 'text-white' : 'text-gray-900'}`}
                />
              </View>
              {errors.email && (
                <Text className="text-danger-500 text-sm mt-1">{errors.email}</Text>
              )}
            </View>

            {/* Password Input */}
            <View>
              <Text className={`text-sm font-medium mb-2 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                Password
              </Text>
              <View className={`
                flex-row items-center border rounded-xl px-4 py-3
                ${errors.password 
                  ? 'border-danger-500' 
                  : isDark ? 'border-gray-600 bg-gray-800' : 'border-gray-300 bg-white'
                }
              `}>
                <Lock size={20} color={isDark ? '#9CA3AF' : '#6B7280'} />
                <TextInput
                  value={formData.password}
                  onChangeText={(text) => {
                    setFormData(prev => ({ ...prev, password: text }));
                    if (errors.password) setErrors(prev => ({ ...prev, password: '' }));
                  }}
                  placeholder="Enter your password"
                  placeholderTextColor={isDark ? '#6B7280' : '#9CA3AF'}
                  secureTextEntry={!showPassword}
                  autoComplete="password"
                  className={`flex-1 ml-3 text-base ${isDark ? 'text-white' : 'text-gray-900'}`}
                />
                <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
                  {showPassword ? (
                    <EyeOff size={20} color={isDark ? '#9CA3AF' : '#6B7280'} />
                  ) : (
                    <Eye size={20} color={isDark ? '#9CA3AF' : '#6B7280'} />
                  )}
                </TouchableOpacity>
              </View>
              {errors.password && (
                <Text className="text-danger-500 text-sm mt-1">{errors.password}</Text>
              )}
            </View>

            {/* Forgot Password */}
            <TouchableOpacity onPress={handleForgotPassword} className="self-end">
              <Text className="text-primary-500 font-medium">Forgot Password?</Text>
            </TouchableOpacity>
          </View>

          {/* Sign In Button */}
          <TouchableOpacity
            onPress={handleSignIn}
            disabled={loading}
            className={`
              flex-row items-center justify-center py-4 rounded-xl mt-8
              ${loading ? 'bg-gray-400' : 'bg-primary-500'}
            `}
          >
            <Text className="text-white text-lg font-semibold mr-2">
              {loading ? 'Signing In...' : 'Sign In'}
            </Text>
            {!loading && <ArrowRight size={20} color="#FFFFFF" />}
          </TouchableOpacity>

          {/* Sign Up Link */}
          <View className="flex-row items-center justify-center mt-6">
            <Text className={`${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
              Don't have an account?{' '}
            </Text>
            <TouchableOpacity onPress={() => router.push('/(auth)/sign-up')}>
              <Text className="text-primary-500 font-semibold">Sign Up</Text>
            </TouchableOpacity>
          </View>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}