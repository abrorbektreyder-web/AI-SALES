import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, Pressable, SafeAreaView, KeyboardAvoidingView, Platform, StatusBar } from 'react-native';
import { Lock, User, Eye, EyeOff, ShieldCheck, ArrowRight } from 'lucide-react-native';
import Animated, { FadeInDown, FadeInUp } from 'react-native-reanimated';
import { router } from 'expo-router';

import axios from 'axios';
import * as SecureStore from 'expo-secure-store';

// DEV MUHITI UCHUN: 
// Expo Go orqali telefonda kirishingiz uchun IP manzil to'g'ri bo'lishi shart.
const API_URL = Platform.OS === 'web' 
  ? 'http://localhost:3000/api' 
  : 'http://10.174.143.193:3000/api'; 

export default function LoginScreen() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async () => {
    if (!username || !password) {
      alert("Iltimos, login va parolni kiriting.");
      return;
    }

    setIsLoading(true);
    try {
      const response = await axios.post(`${API_URL}/auth/login`, {
        phone: username,
        password: password,
      });

      const { token, user } = response.data;
      
      // Faqat AGENT roli bormi tekshirish (ixtiyoriy, lekin xavfsizlik uchun yaxshi)
      if (user.role !== 'AGENT') {
        alert("Ushbu ilova faqat sotuvchilar uchun mo'ljallangan.");
        setIsLoading(false);
        return;
      }

      if (Platform.OS === 'web') {
        localStorage.setItem('auth_token', token);
        localStorage.setItem('user_data', JSON.stringify(user));
      } else {
        await SecureStore.setItemAsync('auth_token', token);
        await SecureStore.setItemAsync('user_data', JSON.stringify(user));
      }

      router.replace('/(tabs)');
    } catch (error: any) {
      console.error("Login xatosi:", error);
      const errorMsg = error.response?.data?.error || "Server bilan bog'lanishda xato. IP manzilni tekshiring.";
      alert(errorMsg);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" />
      <KeyboardAvoidingView 
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'} 
        style={styles.keyboardView}
      >
        <Animated.View entering={FadeInUp.duration(800).delay(100)} style={styles.header}>
          <View style={styles.logoContainer}>
            <View style={styles.logoBadge}>
               <ShieldCheck color="#FFFFFF" size={32} />
            </View>
          </View>
          <Text style={styles.title}>AI SALES PILOT</Text>
          <Text style={styles.subtitle}>Sotuvchilar premium portali</Text>
        </Animated.View>

        <Animated.View entering={FadeInDown.duration(800).delay(300)} style={styles.form}>
          
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Telefon raqam (Login)</Text>
            <View style={styles.inputContainer}>
              <User color="#94A3B8" size={18} style={styles.icon} />
              <TextInput
                style={styles.input}
                placeholder="+998901234567"
                placeholderTextColor="#475569"
                value={username}
                onChangeText={setUsername}
                autoCapitalize="none"
                keyboardType="phone-pad"
              />
            </View>
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Maxfiy parol</Text>
            <View style={styles.inputContainer}>
              <Lock color="#94A3B8" size={18} style={styles.icon} />
              <TextInput
                style={styles.input}
                placeholder="••••••••"
                placeholderTextColor="#475569"
                secureTextEntry={!showPassword}
                value={password}
                onChangeText={setPassword}
              />
              <Pressable 
                onPress={() => setShowPassword(!showPassword)}
                style={styles.eyeIcon}
              >
                {showPassword ? <EyeOff color="#94A3B8" size={20} /> : <Eye color="#94A3B8" size={20} />}
              </Pressable>
            </View>
          </View>

          <Pressable 
            style={({ pressed }) => [
              styles.loginBtn,
              pressed && { scale: 0.98, opacity: 0.9 },
              isLoading && { opacity: 0.7 }
            ]} 
            onPress={handleLogin}
            disabled={isLoading}
          >
            <Text style={styles.loginBtnText}>
              {isLoading ? "Kirilmoqda..." : "Tizimga kirish"}
            </Text>
            {!isLoading && <ArrowRight color="#FFFFFF" size={20} style={{ marginLeft: 8 }} />}
          </Pressable>

          <View style={styles.footer}>
            <Text style={styles.footerText}>Xatolik yuz berdimi? </Text>
            <Pressable>
              <Text style={styles.supportLink}>Admin bilan bog'laning</Text>
            </Pressable>
          </View>

        </Animated.View>

      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#020617', // Juda to'q ko'k (Premium)
  },
  keyboardView: {
    flex: 1,
    justifyContent: 'center',
    padding: 28,
  },
  header: {
    alignItems: 'center',
    marginBottom: 40,
  },
  logoContainer: {
    marginBottom: 20,
    shadowColor: '#10B981',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.3,
    shadowRadius: 20,
    elevation: 10,
  },
  logoBadge: {
    width: 64,
    height: 64,
    borderRadius: 20,
    backgroundColor: '#10B981',
    justifyContent: 'center',
    alignItems: 'center',
    transform: [{ rotate: '45deg' }],
  },
  title: {
    fontSize: 28,
    fontWeight: '900',
    color: '#F8FAFC',
    letterSpacing: 2,
    marginBottom: 4,
  },
  subtitle: {
    color: '#64748B', 
    fontSize: 14,
    fontWeight: '500',
    letterSpacing: 0.5,
  },
  form: {
    width: '100%',
  },
  inputGroup: {
    marginBottom: 20,
  },
  label: {
    color: '#94A3B8',
    fontSize: 12,
    fontWeight: '600',
    marginBottom: 8,
    marginLeft: 4,
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#0F172A',
    borderRadius: 18,
    paddingHorizontal: 16,
    height: 60,
    borderWidth: 1,
    borderColor: '#1E293B',
  },
  icon: {
    marginRight: 12,
  },
  eyeIcon: {
    padding: 8,
  },
  input: {
    flex: 1,
    color: '#F8FAFC',
    fontSize: 16,
    height: '100%',
    fontWeight: '500',
  },
  loginBtn: {
    backgroundColor: '#10B981',
    height: 60,
    borderRadius: 18,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 10,
    shadowColor: '#10B981',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.25,
    shadowRadius: 15,
    elevation: 8,
  },
  loginBtnText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '800',
    letterSpacing: 0.5,
  },
  footer: {
    marginTop: 32,
    flexDirection: 'row',
    justifyContent: 'center',
    paddingBottom: 20,
  },
  footerText: {
    color: '#475569',
    fontSize: 13,
  },
  supportLink: {
    color: '#10B981',
    fontSize: 13,
    fontWeight: '700',
  },
});
