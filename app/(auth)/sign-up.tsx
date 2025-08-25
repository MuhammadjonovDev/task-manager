import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Alert, KeyboardAvoidingView, Platform, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Eye, EyeOff, Mail, Lock, User, ArrowRight, ArrowLeft } from 'lucide-react-native';
import { useRouter } from 'expo-router';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';

export default function SignUp() {
  const router = useRouter();
  const { signUp, loading } = useAuth();
  const { isDark } = useTheme();
  
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  const validateForm = () => {
    const newErrors: { [key: string]: string } = {};

    if (!formData.fullName.trim()) {
      newErrors.fullName = 'Full name is required';
    } else if (formData.fullName.trim().length < 2) {
      newErrors.fullName = 'Full name must be at least 2 characters';
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email';
    }

    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    } else if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(formData.password)) {
      newErrors.password = 'Password must contain uppercase, lowercase, and number';
    }

    if (!formData.confirmPassword) {
      newErrors.confirmPassword = 'Please confirm your password';
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSignUp = async () => {
    if (!validateForm()) return;

    const success = await signUp(formData.email, formData.password, formData.fullName);
    if (success) {
      router.replace('/(auth)/sign-in');
    }
  };

  return (
    <SafeAreaView className={`flex-1 ${isDark ? 'bg-gray-900' : 'bg-gray-50'}`}>
      <KeyboardAvoidingView 
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        className="flex-1"
      >
        <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
          {/* Header */}
          <View className="flex-row items-center p-4">
            <TouchableOpacity onPress={() => router.back()}>
              <ArrowLeft size={24} color={isDark ? '#9CA3AF' : '#6B7280'} />
            </TouchableOpacity>
          </View>

          <View className="flex-1 justify-center px-6 pb-8">
            {/* Title */}
            <View className="items-center mb-8">
              <View className="w-20 h-20 bg-primary-500 rounded-full items-center justify-center mb-4">
                <User size={32} color="#FFFFFF" />
              </View>
              <Text className={`text-3xl font-bold mb-2 ${isDark ? 'text-white' : 'text-gray-900'}`}>
                Create Account
              </Text>
              <Text className={`text-center ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                Join us to start managing your tasks efficiently
              </Text>
            </View>

            {/* Form */}
            <View className="space-y-4">
              {/* Full Name Input */}
              <View>
                <Text className={`text-sm font-medium mb-2 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                  Full Name
                </Text>
                <View className={`
                  flex-row items-center border rounded-xl px-4 py-3
                  ${errors.fullName 
                    ? 'border-danger-500' 
                    : isDark ? 'border-gray-600 bg-gray-800' : 'border-gray-300 bg-white'
                  }
                `}>
                  <User size={20} color={isDark ? '#9CA3AF' : '#6B7280'} />
                  <TextInput
                    value={formData.fullName}
                    onChangeText={(text) => {
                      setFormData(prev => ({ ...prev, fullName: text }));
                      if (errors.fullName) setErrors(prev => ({ ...prev, fullName: '' }));
                    }}
                    placeholder="Enter your full name"
                    placeholderTextColor={isDark ? '#6B7280' : '#9CA3AF'}
                    autoCapitalize="words"
                    autoComplete="name"
                    className={`flex-1 ml-3 text-base ${isDark ? 'text-white' : 'text-gray-900'}`}
                  />
                </View>
                {errors.fullName && (
                  <Text className="text-danger-500 text-sm mt-1">{errors.fullName}</Text>
                )}
              </View>

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
                    placeholder="Create a password"
                    placeholderTextColor={isDark ? '#6B7280' : '#9CA3AF'}
                    secureTextEntry={!showPassword}
                    autoComplete="new-password"
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

              {/* Confirm Password Input */}
              <View>
                <Text className={`text-sm font-medium mb-2 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                  Confirm Password
                </Text>
                <View className={`
                  flex-row items-center border rounded-xl px-4 py-3
                  ${errors.confirmPassword 
                    ? 'border-danger-500' 
                    : isDark ? 'border-gray-600 bg-gray-800' : 'border-gray-300 bg-white'
                  }
                `}>
                  <Lock size={20} color={isDark ? '#9CA3AF' : '#6B7280'} />
                  <TextInput
                    value={formData.confirmPassword}
                    onChangeText={(text) => {
                      setFormData(prev => ({ ...prev, confirmPassword: text }));
                      if (errors.confirmPassword) setErrors(prev => ({ ...prev, confirmPassword: '' }));
                    }}
                    placeholder="Confirm your password"
                    placeholderTextColor={isDark ? '#6B7280' : '#9CA3AF'}
                    secureTextEntry={!showConfirmPassword}
                    autoComplete="new-password"
                    className={`flex-1 ml-3 text-base ${isDark ? 'text-white' : 'text-gray-900'}`}
                  />
                  <TouchableOpacity onPress={() => setShowConfirmPassword(!showConfirmPassword)}>
                    {showConfirmPassword ? (
                      <EyeOff size={20} color={isDark ? '#9CA3AF' : '#6B7280'} />
                    ) : (
                      <Eye size={20} color={isDark ? '#9CA3AF' : '#6B7280'} />
                    )}
                  </TouchableOpacity>
                </View>
                {errors.confirmPassword && (
                  <Text className="text-danger-500 text-sm mt-1">{errors.confirmPassword}</Text>
                )}
              </View>
            </View>

            {/* Sign Up Button */}
            <TouchableOpacity
              onPress={handleSignUp}
              disabled={loading}
              className={`
                flex-row items-center justify-center py-4 rounded-xl mt-8
                ${loading ? 'bg-gray-400' : 'bg-primary-500'}
              `}
            >
              <Text className="text-white text-lg font-semibold mr-2">
                {loading ? 'Creating Account...' : 'Create Account'}
              </Text>
              {!loading && <ArrowRight size={20} color="#FFFFFF" />}
            </TouchableOpacity>

            {/* Sign In Link */}
            <View className="flex-row items-center justify-center mt-6">
              <Text className={`${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                Already have an account?{' '}
              </Text>
              <TouchableOpacity onPress={() => router.push('/(auth)/sign-in')}>
                <Text className="text-primary-500 font-semibold">Sign In</Text>
              </TouchableOpacity>
            </View>

            {/* Password Requirements */}
            <View className={`
              p-4 rounded-xl mt-4
              ${isDark ? 'bg-gray-800' : 'bg-gray-100'}
            `}>
              <Text className={`text-sm font-medium mb-2 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                Password Requirements:
              </Text>
              <Text className={`text-xs ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                • At least 6 characters long{'\n'}
                • Contains uppercase and lowercase letters{'\n'}
                • Contains at least one number
              </Text>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}