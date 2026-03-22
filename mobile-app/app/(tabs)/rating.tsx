import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, SafeAreaView, Pressable, Platform } from 'react-native';
import { Star, TrendingUp, AlertTriangle, PlayCircle, LogOut } from 'lucide-react-native';
import Animated, { FadeInUp } from 'react-native-reanimated';
import { router } from 'expo-router';
import * as SecureStore from 'expo-secure-store';
import axios from 'axios';
import { useEffect } from 'react';
import * as Linking from 'expo-linking';

const getScoreColor = (score: number) => {
  if (score >= 4) return '#10B981'; // Green
  if (score === 3) return '#F59E0B'; // Yellow
  return '#EF4444'; // Red
};

export default function RatingScreen() {
  const [SCORE, setScore] = useState<number>(0);
  const [calls, setCalls] = useState<any[]>([]);
  const [lesson, setLesson] = useState<any>(null);
  const [reason, setReason] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const API_URL = Platform.OS === 'web' 
    ? 'http://localhost:3000/api' 
    : 'http://10.160.103.193:3000/api'; 

  const scoreColor = getScoreColor(SCORE);

  useEffect(() => {
    fetchDashboard();
  }, []);

  const fetchDashboard = async () => {
    try {
      const token = Platform.OS === 'web' 
        ? localStorage.getItem('auth_token')
        : await SecureStore.getItemAsync('auth_token');

      const res = await axios.get(`${API_URL}/agent/dashboard`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      setScore(res.data.averageScore || 0);
      setCalls(res.data.calls || []);
      setLesson(res.data.recommendedLesson || null);
      setReason(res.data.recentBadCallReason || null);
    } catch (e) {
      console.error("Dashboard datasi xatosi:", e);
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogout = async () => {
    try {
      if (Platform.OS === 'web') {
        localStorage.removeItem('auth_token');
        localStorage.removeItem('user_data');
      } else {
        await SecureStore.deleteItemAsync('auth_token');
        await SecureStore.deleteItemAsync('user_data');
      }
      router.replace('/(auth)/login');
    } catch (error) {
      console.error("Logout error", error);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        
        {/* Header */}
        <Animated.View entering={FadeInUp.duration(500)} style={styles.header}>
          <View>
            <Text style={styles.headerTitle}>Sizning reytingingiz</Text>
            <Text style={styles.headerSubtitle}>So'nggi 30 kunlik natijalar</Text>
          </View>
          <Pressable onPress={handleLogout} style={styles.logoutBtn}>
            <LogOut color="#EF4444" size={24} />
          </Pressable>
        </Animated.View>

        {/* Score Card */}
        <Animated.View entering={FadeInUp.delay(200).duration(500)} style={[styles.scoreCard, { shadowColor: scoreColor }]}>
          <View style={[styles.scoreCircle, { borderColor: scoreColor }]}>
            <Text style={[styles.scoreText, { color: scoreColor }]}>{SCORE}</Text>
            <Text style={styles.scoreMax}>/ 5</Text>
          </View>
          
          <Text style={styles.scoreVerdict}>
            {SCORE >= 4 ? 'Ajoyib natija!' : SCORE === 3 ? "O'rtacha, o'sishingiz kerak." : 'Qoniqarsiz suhbatlar!'}
          </Text>
          <Text style={styles.scoreDesc}>
            {SCORE >= 4 
              ? 'Siz aksariyat savdolarni muvaffaqiyatli yopmoqdasiz.' 
              : 'Skriptga rioya etilmayapti yoki e\'tirozlarga to\'g\'ri javob berilmadi.'}
          </Text>
        </Animated.View>

        {/* Actions / Skill Up if Score is Low */}
        {SCORE < 4 && lesson && (
          <Animated.View entering={FadeInUp.delay(400).duration(500)} style={styles.alertCard}>
            <View style={styles.alertHeader}>
              <AlertTriangle color="#F87171" size={24} />
              <Text style={styles.alertTitle}>Zudlik bilan darsni ko'ring!</Text>
            </View>
            <Text style={styles.alertBody}>
              AI xulosasi: {reason}
            </Text>
            <Pressable 
              style={styles.videoBtn}
              onPress={() => Linking.openURL(lesson.url)}
            >
              <PlayCircle color="#FFF" size={20} />
              <Text style={styles.videoBtnText}>Qutqaruv darsi: "{lesson.title}"</Text>
            </Pressable>
          </Animated.View>
        )}

        {/* Recent Calls List */}
        <Animated.View entering={FadeInUp.delay(600).duration(500)} style={styles.callsSection}>
          <Text style={styles.sectionTitle}>Oxirgi baholangan suhbatlar</Text>
          
          {calls.length > 0 ? calls.map((item, index) => (
            <View key={item.id || index} style={styles.callRow}>
              <View style={styles.callIconBox}>
                <TrendingUp size={20} color="#94A3B8" />
              </View>
              <View style={styles.callInfo}>
                <Text style={styles.callName}>Mijoz {item.customerPhone}</Text>
                <Text style={styles.callStatus}>{new Date(item.createdAt).toLocaleString()}</Text>
              </View>
              <View style={[styles.callBadge, { backgroundColor: item.analysis?.score >= 4 ? '#10B98133' : '#EF444433' }]}>
                <Text style={[{ fontSize: 14, fontWeight: '700' }, { color: item.analysis?.score >= 4 ? '#10B981' : '#EF4444' }]}>
                  {item.analysis?.score || '?'}
                </Text>
              </View>
            </View>
          )) : <Text style={{ color: '#94A3B8' }}>Hozircha suhbatlar yo'q</Text>}
        </Animated.View>

      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0F172A', // Slate 900
  },
  scrollContent: {
    padding: 24,
    paddingTop: 40,
    paddingBottom: 80,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 32,
  },
  headerTitle: {
    color: '#F8FAFC',
    fontSize: 28,
    fontWeight: '700',
    marginBottom: 4,
  },
  headerSubtitle: {
    color: '#94A3B8',
    fontSize: 14,
  },
  logoutBtn: {
    padding: 10,
    backgroundColor: '#EF444420',
    borderRadius: 12,
  },
  scoreCard: {
    backgroundColor: '#1E293B',
    borderRadius: 24,
    padding: 32,
    alignItems: 'center',
    marginBottom: 24,
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.15,
    shadowRadius: 20,
    elevation: 5,
  },
  scoreCircle: {
    width: 140,
    height: 140,
    borderRadius: 70,
    borderWidth: 6,
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
    marginBottom: 20,
    backgroundColor: '#0F172A',
  },
  scoreText: {
    fontSize: 48,
    fontWeight: '800',
  },
  scoreMax: {
    fontSize: 18,
    color: '#64748B',
    marginTop: 20,
    marginLeft: 4,
  },
  scoreVerdict: {
    color: '#F8FAFC',
    fontSize: 20,
    fontWeight: '600',
    marginBottom: 8,
  },
  scoreDesc: {
    color: '#94A3B8',
    textAlign: 'center',
    fontSize: 14,
    lineHeight: 20,
  },
  alertCard: {
    backgroundColor: '#3F1A1F', // Dark Red tint
    borderRadius: 16,
    padding: 20,
    marginBottom: 24,
    borderWidth: 1,
    borderColor: '#EF444455',
  },
  alertHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  alertTitle: {
    color: '#FCA5A5',
    fontWeight: '700',
    fontSize: 18,
    marginLeft: 8,
  },
  alertBody: {
    color: '#FECACA',
    lineHeight: 22,
    marginBottom: 16,
  },
  videoBtn: {
    backgroundColor: '#EF4444',
    borderRadius: 12,
    padding: 14,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  videoBtnText: {
    color: '#FFF',
    fontWeight: '600',
    marginLeft: 8,
    fontSize: 14,
  },
  callsSection: {
    marginTop: 16,
  },
  sectionTitle: {
    color: '#F8FAFC',
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 16,
  },
  callRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1E293B',
    padding: 16,
    borderRadius: 16,
    marginBottom: 12,
  },
  callIconBox: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#0F172A',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  callInfo: {
    flex: 1,
  },
  callName: {
    color: '#E2E8F0',
    fontWeight: '600',
    fontSize: 15,
    marginBottom: 4,
  },
  callStatus: {
    color: '#64748B',
    fontSize: 13,
  },
  callBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
  },
});
