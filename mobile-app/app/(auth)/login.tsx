import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, Pressable, SafeAreaView, KeyboardAvoidingView, Platform, StatusBar, Modal, ActivityIndicator } from 'react-native';
import { Lock, User, Eye, EyeOff, ShieldCheck, ArrowRight, QrCode, X } from 'lucide-react-native';
import Animated, { FadeInDown, FadeInUp } from 'react-native-reanimated';
import { router } from 'expo-router';
import { CameraView, useCameraPermissions } from 'expo-camera';

import axios from 'axios';
import * as SecureStore from 'expo-secure-store';

const API_URL = 'https://ai-sales-roan-three.vercel.app/api'; 

export default function LoginScreen() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isQRScannerVisible, setIsQRScannerVisible] = useState(false);
  const [permission, requestPermission] = useCameraPermissions();

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
      await saveAuthSession(token, user);
      router.replace('/(tabs)');
    } catch (error: any) {
      const errorMsg = error.response?.data?.error || "Login xatosi. Ma'lumotlarni tekshiring.";
      alert(errorMsg);
    } finally {
      setIsLoading(false);
    }
  };

  const handleQRCodeScanned = async ({ data }: { data: string }) => {
    setIsQRScannerVisible(false);
    setIsLoading(true);
    
    try {
      const response = await axios.post(`${API_URL}/auth/qr-login`, {
        token: data,
      });

      const { token, user } = response.data;
      await saveAuthSession(token, user);
      router.replace('/(tabs)');
    } catch (error: any) {
      const errorMsg = error.response?.data?.error || "QR-kod haqiqiy emas yoki muddati o'tgan.";
      alert(errorMsg);
    } finally {
      setIsLoading(false);
    }
  };

  const saveAuthSession = async (token: string, user: any) => {
    if (Platform.OS === 'web') {
      localStorage.setItem('auth_token', token);
      localStorage.setItem('user_data', JSON.stringify(user));
    } else {
      await SecureStore.setItemAsync('auth_token', token);
      await SecureStore.setItemAsync('user_data', JSON.stringify(user));
    }
  };

  const openQRScanner = async () => {
    if (!permission?.granted) {
      const { granted } = await requestPermission();
      if (!granted) {
        alert("Kameraga ruxsat berilmagan. QR-kodni skanerlash uchun ruxsat kerak.");
        return;
      }
    }
    setIsQRScannerVisible(true);
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
          
          <Pressable 
            style={styles.qrBtn}
            onPress={openQRScanner}
          >
            <View style={styles.qrInner}>
              <QrCode color="#10B981" size={24} />
              <Text style={styles.qrText}>QR-kod orqali kirish</Text>
            </div>
            <ArrowRight color="#334155" size={16} />
          </Pressable>

          <View style={styles.divider}>
            <View style={styles.dividerLine} />
            <Text style={styles.dividerText}>YOKI</Text>
            <View style={styles.dividerLine} />
          </View>

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

        {/* LOADING OVERLAY */}
        {isLoading && (
          <View style={styles.loadingOverlay}>
            <ActivityIndicator size="large" color="#10B981" />
          </View>
        )}

        {/* QR SCANNER MODAL */}
        <Modal
          visible={isQRScannerVisible}
          animationType="slide"
          onRequestClose={() => setIsQRScannerVisible(false)}
        >
          <View style={styles.scannerContainer}>
            <CameraView
              style={StyleSheet.absoluteFillObject}
              onBarcodeScanned={handleQRCodeScanned}
              barcodeScannerSettings={{
                barcodeTypes: ["qr"],
              }}
            />
            <View style={styles.scannerOverlay}>
              <View style={styles.scannerHeader}>
                <Text style={styles.scannerTitle}>Skanerlash</Text>
                <Pressable onPress={() => setIsQRScannerVisible(false)} style={styles.closeBtn}>
                  <X color="#FFFFFF" size={24} />
                </Pressable>
              </View>
              <View style={styles.scannerFrame}>
                <View style={styles.scannerCornerTL} />
                <View style={styles.scannerCornerTR} />
                <View style={styles.scannerCornerBL} />
                <View style={styles.scannerCornerBR} />
              </View>
              <Text style={styles.scannerHint}>Dashboard-dagi QR-kodni ko'rsating</Text>
            </View>
          </View>
        </Modal>

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
  qrBtn: {
    backgroundColor: '#0F172A',
    borderRadius: 20,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderWidth: 1,
    borderColor: '#1E293B',
    marginBottom: 24,
  },
  qrInner: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  qrText: {
    color: '#F8FAFC',
    fontSize: 16,
    fontWeight: '600',
  },
  divider: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 24,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: '#1E293B',
  },
  dividerText: {
    color: '#475569',
    fontSize: 12,
    fontWeight: '700',
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
  loadingOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(2, 6, 23, 0.8)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1000,
  },
  scannerContainer: {
    flex: 1,
    backgroundColor: '#000',
  },
  scannerOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  scannerHeader: {
    position: 'absolute',
    top: 60,
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 24,
  },
  scannerTitle: {
    color: '#FFF',
    fontSize: 20,
    fontWeight: '900',
    letterSpacing: 1,
  },
  closeBtn: {
    position: 'absolute',
    right: 24,
    padding: 8,
    backgroundColor: 'rgba(255,255,255,0.1)',
    borderRadius: 12,
  },
  scannerFrame: {
    width: 250,
    height: 250,
    position: 'relative',
  },
  scannerCornerTL: { position: 'absolute', top: 0, left: 0, width: 40, height: 40, borderTopWidth: 4, borderLeftWidth: 4, borderColor: '#10B981', borderTopLeftRadius: 20 },
  scannerCornerTR: { position: 'absolute', top: 0, right: 0, width: 40, height: 40, borderTopWidth: 4, borderRightWidth: 4, borderColor: '#10B981', borderTopRightRadius: 20 },
  scannerCornerBL: { position: 'absolute', bottom: 0, left: 0, width: 40, height: 40, borderBottomWidth: 4, borderLeftWidth: 4, borderColor: '#10B981', borderBottomLeftRadius: 20 },
  scannerCornerBR: { position: 'absolute', bottom: 0, right: 0, width: 40, height: 40, borderBottomWidth: 4, borderRightWidth: 4, borderColor: '#10B981', borderBottomRightRadius: 20 },
  scannerHint: {
    color: '#94A3B8',
    marginTop: 40,
    fontSize: 14,
    fontWeight: '500',
  },
});
