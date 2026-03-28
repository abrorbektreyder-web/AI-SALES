import React, { useState, useEffect, useRef } from 'react';

import { View, Text, StyleSheet, SafeAreaView, Alert } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import Animated, { useSharedValue, useAnimatedStyle, withSpring, withRepeat, withTiming, withSequence } from 'react-native-reanimated';
import { Audio } from 'expo-av';
import * as SecureStore from 'expo-secure-store';
import { sipClient } from '../lib/sipClient';

export default function CallScreen() {
  const router = useRouter();
  const { number } = useLocalSearchParams();
  
  const [callDuration, setCallDuration] = useState(0);
  const [isRecording, setIsRecording] = useState(false);
  const [callStatus, setCallStatus] = useState('SOZLANMOQDA...'); 
  
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const recordingRef = useRef<Audio.Recording | null>(null);
  const durationRef = useRef(0);



  // Animatsiyalar uchun qadriyatlar
  const pulseScale = useSharedValue(1);
  const avatarScale = useSharedValue(0.5);
  const avatarOpacity = useSharedValue(0);

  useEffect(() => {
    // Ekran ochilganda "Gudok" animatsiyasini boshlash
    avatarScale.value = withSpring(1);
    avatarOpacity.value = withTiming(1, { duration: 500 });
    pulseScale.value = withRepeat(
      withSequence(withTiming(1.2, { duration: 1000 }), withTiming(1, { duration: 1000 })),
      -1, true
    );

    const initCall = async () => {
      // 1. Mikrofon ruxsatini oldindan so'rash (WebRTC session uchun muhim)
      const permission = await Audio.requestPermissionsAsync();
      if (permission.status !== 'granted') {
          Alert.alert("Ruxsat yo'q", "Qo'ng'iroq qilish uchun mikrofon kerak!", [
              { text: "OK", onPress: () => router.back() }
          ]);
          return;
      }

      // Audio-ni VOIP rejimiga o'tkazish
      await Audio.setAudioModeAsync({
        allowsRecordingIOS: true,
        playsInSilentModeIOS: true,
        shouldDuckAndroid: true,
        playThroughEarpieceAndroid: false, // Dinamikda gaplashish uchun
      });

      // 2. SIP-ni ishga tushirish
      console.log("[CALL] Initializing SIP...");

      await sipClient.initialize(
        () => {
          // Disconnect callback
          console.log("[CALL] Disconnected");
          stopRecordingAndUpload(true);
          router.back();
        },
        () => {
          // General Answered callback (already handled in makeCall, but good to have)
        }
      );

      // 3. Register bo'lishini kutish (Zadarma qo'ng'iroqdan oldin ro'yxatdan o'tishni talab qiladi)
      setCallStatus('RO\'YXATDAN O\'TILMOQDA...');
      let attempts = 0;
      while (attempts < 10 && !(await sipClient.isRegistered())) {
          console.log("[CALL] Waiting for registration... attempt", attempts);
          await new Promise(r => setTimeout(r, 1000));
          attempts++;
      }

      if (!(await sipClient.isRegistered())) {
          Alert.alert(
            "Xato: SIP ulanmadi", 
            "Internetni uzib-yoqing yoki Zadarma akkauntini tekshiring.",
            [{ text: "OK", onPress: () => router.back() }]
          );
          return;
      }

      // 4. Qo'ng'iroqni boshlash
      console.log("[CALL] Making call...");
      setCallStatus('RAQAM TERILMOQDA...');

      sipClient.makeCall(
        (number as string), 
        () => {
          // Answered callback
          console.log("[CALL] Answered!");
          setCallStatus('CONNECTED');
          Alert.alert("BOG'LANDI!", "Suhbat boshlandi, ovozingiz yozilyapti.");
          startRecording(); 
          timerRef.current = setInterval(() => {
            setCallDuration((prev) => {
              const next = prev + 1;
              durationRef.current = next;
              return next;
            });
          }, 1000);

        },

        () => {
          // Ended callback
          console.log("[CALL] Ended");
          handleHangUp();
        }
      );
    };

    initCall();

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
      sipClient.dispose();
      // Cleanup: Agar recording qolib ketgan bo'lsa to'xtatamiz
      if (recordingRef.current) {
         recordingRef.current.stopAndUnloadAsync().catch(console.error);
         recordingRef.current = null;
      }
    };

  }, []);


  // Format Timer (MM:SS)
  const formatTime = (seconds: number) => {
    const min = Math.floor(seconds / 60).toString().padStart(2, '0');
    const sec = (seconds % 60).toString().padStart(2, '0');
    return `${min}:${sec}`;
  };

  const startRecording = async () => {
    try {
      const permission = await Audio.requestPermissionsAsync();
      if (permission.status !== 'granted') {
        Alert.alert("Ruxsat yo'q", "Ovoz yozayotgan ilovaga mikrofon kerak!");
        return;
      }
      
      await Audio.setAudioModeAsync({
        allowsRecordingIOS: true,
        playsInSilentModeIOS: true,
      });

      const { recording } = await Audio.Recording.createAsync(
        Audio.RecordingOptionsPresets.HIGH_QUALITY
      );
      
      recordingRef.current = recording;
      setIsRecording(true);
      console.log('Recording started');

    } catch (err) {
      console.error('Failed to start recording', err);
    }
  };

  const stopRecordingAndUpload = async (shouldUpload = true) => {
    if (!recordingRef.current) return;

    try {
      setIsRecording(false);
      const rec = recordingRef.current;
      recordingRef.current = null;
      
      await rec.stopAndUnloadAsync();
      const uri = rec.getURI();
      console.log('Recording stopped and saved at', uri);

      if (shouldUpload && uri) {
        // Hamma qo'ng'iroqlarni yuklash (testing uchun)
        if (durationRef.current >= 0) {
            console.log("[CALL] Uploading recording...");
            uploadAudio(uri);
        }
      }

    } catch (err) {
      console.error('Failed to stop recording', err);
    }
  };

  const uploadAudio = async (uri: string) => {
    try {
      // 1. Tokenni SecureStore dan olib kelamiz (login.tsx da 'auth_token' nomi bilan saqlanadi)
      const token = await SecureStore.getItemAsync('auth_token');
      if (!token) {
         console.warn("Foydalanuvchi tokeni topilmadi! Qayta login qiling.");
         return;
      }

      // Production API (Login va Upload bir xil serverda bo'lishi shart!)
      const API_URL = 'https://ai-sales-roan-three.vercel.app'; 
      
      let formData = new FormData();
      formData.append('audio', {
        uri: uri,
        name: 'test_call_recording.m4a',
        type: 'audio/m4a'
      } as any);
      formData.append('customerPhone', (number as string) || '+998900000000');
      formData.append('durationSec', durationRef.current.toString());


      console.log("Yuklanmoqda...", API_URL + '/api/upload/audio');
      
      const response = await fetch(`${API_URL}/api/upload/audio`, {
        method: 'POST',
        body: formData,
        headers: {
          'Authorization': `Bearer ${token}`,
          'Accept': 'application/json',
          'Content-Type': 'multipart/form-data',
        },
      });

      const result = await response.json();
      console.log("Upload natijasi:", result);
      
      if (response.ok) {
         Alert.alert("Ajoyib!", "Audio AI ga jo'natildi. Dashboard orqali tekshiring!");
      } else {
         console.error("Upload Error Info: ", result);
         Alert.alert("Xato", result.error || "Audio yuklashda xatolik yuz berdi. IP manzilni tekshiring.");
      }
    } catch (error) {
      console.error("Upload xatosi:", error);
      Alert.alert("Xatolik", "Serverga ulanib bo'lmadi! Tarmoqni yoki IP-ni tekshiring.");
    }
  };

  const handleHangUp = async () => {
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
    sipClient.hangUp();
    // Muhim: Navigatsiyadan OLDIN stopRecordingandUpload chaqiramiz (kutib kutmasligimiz ixtiyoriy lekin yozish to'xtashi shart)
    await stopRecordingAndUpload(true); 
    router.back();
  };


  const animatedPulseStyle = useAnimatedStyle(() => {
    return {
      transform: [{ scale: pulseScale.value }],
      opacity: 1 - (pulseScale.value - 1) * 2, // Kattalashganda shaffoflashadi
    };
  });

  const animatedAvatarStyle = useAnimatedStyle(() => {
    return {
      transform: [{ scale: avatarScale.value }],
      opacity: avatarOpacity.value,
    };
  });

  return (
    <SafeAreaView style={styles.container}>
      {/* Yuqori qism - Foydalanuvchi info */}
      <View style={styles.topSection}>
        <Text style={{ color: '#fff', fontSize: 16, marginBottom: 10 }}>{callStatus}</Text>
        <View style={styles.avatarWrapper}>

          <Animated.View style={[styles.pulseCircle, animatedPulseStyle]} />
          <Animated.View style={[styles.avatar, animatedAvatarStyle]}>
             <Text style={styles.avatarText}>{((number as string) || "Unknown").charAt(0) || "U"}</Text>
          </Animated.View>
        </View>

        <Text style={styles.nameText}>Mijoz bilan suhbat</Text>
        <Text style={styles.numberText}>{number}</Text>
        
        <View style={styles.statusContainer}>
           {isRecording && <Ionicons name="mic" size={16} color="#EF4444" style={{marginRight: 6}}/>}
          <Text style={styles.timeText}>{formatTime(callDuration)}</Text>
        </View>
        <Text style={styles.recordingText}>
            {isRecording ? "Ovoz yozilmoqda (AI uchun)..." : ""}
        </Text>
      </View>

      {/* Pastki qism - Boshqaruv elementlari */}
      <View style={styles.bottomSection}>
        <Animated.View style={styles.hangupWrapper}>
          <View onTouchEnd={handleHangUp} style={styles.hangupButton}>
             <Ionicons name="call-outline" size={36} color="#FFFFFF" style={{ transform: [{ rotate: '135deg' }] }} />
          </View>
          <Text style={styles.hangupText}>Tugatish</Text>
        </Animated.View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0F172A', // Slate 900
    justifyContent: 'space-between',
  },
  topSection: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 60,
  },
  avatarWrapper: {
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 40,
    width: 150,
    height: 150,
  },
  pulseCircle: {
    position: 'absolute',
    width: 140,
    height: 140,
    borderRadius: 70,
    backgroundColor: 'rgba(56, 189, 248, 0.2)', // Sky blue shaffof
  },
  avatar: {
    width: 110,
    height: 110,
    borderRadius: 55,
    backgroundColor: '#1E293B',
    borderWidth: 2,
    borderColor: '#38BDF8',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#38BDF8',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.3,
    shadowRadius: 20,
    elevation: 10,
  },
  avatarText: {
    fontSize: 42,
    color: '#38BDF8',
    fontWeight: '600',
  },
  nameText: {
    fontSize: 28,
    color: '#F8FAFC',
    fontWeight: '600',
    marginBottom: 8,
  },
  numberText: {
    fontSize: 20,
    color: '#94A3B8',
    letterSpacing: 1,
    marginBottom: 16,
  },
  statusContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 10,
  },
  timeText: {
    fontSize: 22,
    color: '#10B981', // Emerald 500
    fontWeight: '500',
    fontVariant: ['tabular-nums'],
  },
  recordingText: {
      fontSize: 12,
      color: '#EF4444',
      marginTop: 8,
      fontWeight: '500'
  },
  bottomSection: {
    paddingBottom: 60,
    alignItems: 'center',
  },
  hangupWrapper: {
    alignItems: 'center',
  },
  hangupButton: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#EF4444', // Red 500
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#EF4444',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.4,
    shadowRadius: 20,
    elevation: 8,
    marginBottom: 12,
  },
  hangupText: {
    color: '#F8FAFC',
    fontSize: 16,
    fontWeight: '500',
  },
});
