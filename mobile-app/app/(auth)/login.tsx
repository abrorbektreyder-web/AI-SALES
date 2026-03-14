import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, Pressable, SafeAreaView, KeyboardAvoidingView, Platform } from 'react-native';
import { Lock, User } from 'lucide-react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { router } from 'expo-router';

export default function LoginScreen() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = () => {
    setIsLoading(true);
    // Fake login timeout
    setTimeout(() => {
      setIsLoading(false);
      router.replace('/(tabs)');
    }, 1000);
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView 
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'} 
        style={styles.keyboardView}
      >
        <Animated.View entering={FadeInDown.duration(600).delay(100)} style={styles.header}>
          <Text style={styles.title}>AI SALES PILOT</Text>
          <Text style={styles.subtitle}>Sotuvchilar uchun portal</Text>
        </Animated.View>

        <Animated.View entering={FadeInDown.duration(600).delay(300)} style={styles.form}>
          
          <View style={styles.inputContainer}>
            <User color="#64748B" size={20} style={styles.icon} />
            <TextInput
              style={styles.input}
              placeholder="Login yoki telefon raqam"
              placeholderTextColor="#64748B"
              value={username}
              onChangeText={setUsername}
              autoCapitalize="none"
            />
          </View>

          <View style={styles.inputContainer}>
            <Lock color="#64748B" size={20} style={styles.icon} />
            <TextInput
              style={styles.input}
              placeholder="Parol"
              placeholderTextColor="#64748B"
              secureTextEntry
              value={password}
              onChangeText={setPassword}
            />
          </View>

          <Pressable 
            style={({ pressed }) => [
              styles.loginBtn,
              pressed && { opacity: 0.8 },
              isLoading && { opacity: 0.5 }
            ]} 
            onPress={handleLogin}
            disabled={isLoading}
          >
            <Text style={styles.loginBtnText}>
              {isLoading ? "Kirish jarayoni..." : "Tizimga kirish"}
            </Text>
          </Pressable>

          <Pressable style={styles.forgotBtn}>
            <Text style={styles.forgotText}>Parolni unutdingizmi?</Text>
          </Pressable>

        </Animated.View>

      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0F172A', // Slate 900
  },
  keyboardView: {
    flex: 1,
    justifyContent: 'center',
    padding: 24,
  },
  header: {
    alignItems: 'center',
    marginBottom: 48,
  },
  title: {
    fontSize: 32,
    fontWeight: '800',
    color: '#F8FAFC',
    letterSpacing: 1,
    marginBottom: 8,
  },
  subtitle: {
    color: '#94A3B8', // Slate 400
    fontSize: 16,
    letterSpacing: 0.5,
  },
  form: {
    width: '100%',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1E293B', // Slate 800
    borderRadius: 16,
    marginBottom: 16,
    paddingHorizontal: 16,
    height: 56,
    borderWidth: 1,
    borderColor: '#334155',
  },
  icon: {
    marginRight: 12,
  },
  input: {
    flex: 1,
    color: '#F8FAFC',
    fontSize: 16,
    height: '100%',
  },
  loginBtn: {
    backgroundColor: '#10B981', // Emerald 500
    height: 56,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 16,
    shadowColor: '#10B981',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 12,
    elevation: 5,
  },
  loginBtnText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '700',
  },
  forgotBtn: {
    marginTop: 24,
    alignItems: 'center',
  },
  forgotText: {
    color: '#38BDF8', // Light blue
    fontSize: 14,
    fontWeight: '600',
  },
});
