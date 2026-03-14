import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, SafeAreaView, Pressable } from 'react-native';
import { Star, TrendingUp, AlertTriangle, PlayCircle } from 'lucide-react-native';
import Animated, { FadeInUp } from 'react-native-reanimated';

const getScoreColor = (score: number) => {
  if (score >= 4) return '#10B981'; // Green
  if (score === 3) return '#F59E0B'; // Yellow
  return '#EF4444'; // Red
};

export default function RatingScreen() {
  const [SCORE] = useState<number>(2); // For demonstration. Less than 4 is considered BAD in this app visually.
  const scoreColor = getScoreColor(SCORE);

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        
        {/* Header */}
        <Animated.View entering={FadeInUp.duration(500)} style={styles.header}>
          <Text style={styles.headerTitle}>Sizning reytingingiz</Text>
          <Text style={styles.headerSubtitle}>So'nggi 30 kunlik natijalar</Text>
        </Animated.View>

        {/* Score Card */}
        <Animated.View entering={FadeInUp.delay(200).duration(500)} style={[styles.scoreCard, { shadowColor: scoreColor }]}>
          <View style={[styles.scoreCircle, { borderColor: scoreColor }]}>
            <Text style={[styles.scoreText, { color: scoreColor }]}>{SCORE}.0</Text>
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
        {SCORE < 4 && (
          <Animated.View entering={FadeInUp.delay(400).duration(500)} style={styles.alertCard}>
            <View style={styles.alertHeader}>
              <AlertTriangle color="#F87171" size={24} />
              <Text style={styles.alertTitle}>Zudlik bilan darsni ko'ring!</Text>
            </View>
            <Text style={styles.alertBody}>
              AI sizning oxirgi 5 ta qo'ng'irog'ingizda "Narx qimmat" e'tiroziga noto'g'ri javob berganingizni aniqladi. Qat'iylik yetishmayapti.
            </Text>
            <Pressable style={styles.videoBtn}>
              <PlayCircle color="#FFF" size={20} />
              <Text style={styles.videoBtnText}>Qutqaruv darsi: "Narx qimmatiga javob"</Text>
            </Pressable>
          </Animated.View>
        )}

        {/* Recent Calls List */}
        <Animated.View entering={FadeInUp.delay(600).duration(500)} style={styles.callsSection}>
          <Text style={styles.sectionTitle}>Oxirgi baholangan suhbatlar</Text>
          
          {[1, 2, 3].map((item, index) => (
            <View key={index} style={styles.callRow}>
              <View style={styles.callIconBox}>
                <TrendingUp size={20} color="#94A3B8" />
              </View>
              <View style={styles.callInfo}>
                <Text style={styles.callName}>Mijoz +998 90 *** ** 4{item}</Text>
                <Text style={styles.callStatus}>Bugun, 14:0{item}</Text>
              </View>
              <View style={[styles.callBadge, { backgroundColor: index === 0 ? '#EF444433' : '#10B98133' }]}>
                <Text style={[{ fontSize: 14, fontWeight: '700' }, { color: index === 0 ? '#EF4444' : '#10B981' }]}>
                  {index === 0 ? '2.0' : '4.5'}
                </Text>
              </View>
            </View>
          ))}
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
    marginBottom: 32,
    alignItems: 'center',
  },
  headerTitle: {
    color: '#F8FAFC',
    fontSize: 28,
    fontWeight: '700',
    marginBottom: 8,
  },
  headerSubtitle: {
    color: '#94A3B8',
    fontSize: 14,
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
