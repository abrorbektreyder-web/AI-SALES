import React, { useState, useRef } from 'react';
import { View, Text, StyleSheet, Pressable, SafeAreaView, Linking } from 'react-native';
import { Phone, Delete } from 'lucide-react-native';
import { useRouter } from 'expo-router';
import * as Haptics from 'expo-haptics';
import Animated, { useSharedValue, useAnimatedStyle, withSpring } from 'react-native-reanimated';

type AnimatedButtonProps = {
  onPress: () => void;
  children: React.ReactNode;
  style?: any;
  onLongPress?: () => void;
};

// Animated Pressable Button
const AnimatedButton = ({ onPress, children, style, onLongPress }: AnimatedButtonProps) => {
  const scale = useSharedValue(1);
  const longPressedRef = useRef(false);

  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{ scale: scale.value }],
    };
  });

  const handlePressIn = () => {
    scale.value = withSpring(0.92);
    longPressedRef.current = false;
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
  };

  const handlePressOut = () => {
    scale.value = withSpring(1);
  };

  const handlePress = () => {
    if (longPressedRef.current) {
      longPressedRef.current = false;
      return; // Long press allaqachon ishladi — onPress ni o'tkazib yuboramiz
    }
    onPress();
  };

  const handleLongPress = () => {
    if (onLongPress) {
      longPressedRef.current = true;
      onLongPress();
    }
  };

  return (
    <Animated.View style={[animatedStyle]}>
      <Pressable
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        onPress={handlePress}
        onLongPress={handleLongPress}
        delayLongPress={400}
        style={style}
      >
        {children}
      </Pressable>
    </Animated.View>
  );
};

export default function DialerScreen() {
  const [phoneNumber, setPhoneNumber] = useState('');
  const router = useRouter();

  const handlePressNumber = (num: string) => {
    if (phoneNumber.length < 15) {
      setPhoneNumber((prev) => prev + num);
    }
  };

  const handleDelete = () => {
    setPhoneNumber((prev) => prev.slice(0, -1));
  };

  const handleLongDelete = () => {
    setPhoneNumber('');
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
  };

  const handleCall = () => {
    if (!phoneNumber) return;
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    
    // Native oynaga (SIM) o'tkazish bekor qilindi.
    // Ilova ichidagi maxsus Call (Qong'iroq) oynasiga o'tamiz.
    router.push({
      pathname: "/call",
      params: { number: phoneNumber }
    });
  };

  const DialButton = ({ num, letters, onLongPress }: { num: string; letters: string; onLongPress?: () => void }) => (
    <AnimatedButton
      onPress={() => handlePressNumber(num)}
      onLongPress={onLongPress}
      style={styles.dialButton}
    >
      <Text style={styles.dialNumber}>{num}</Text>
      {letters && letters.trim() ? <Text style={styles.dialLetters}>{letters}</Text> : null}
    </AnimatedButton>
  );

  const handleLongPressZero = () => {
    // 0 ni bosib tursa — + yoziladi (onPress ishlamaydi, ref bilan bloklangan)
    if (phoneNumber.length < 15) {
      setPhoneNumber((prev) => prev + '+');
    }
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.displayContainer}>
        <Text
          style={[
            styles.displayText,
            { fontSize: phoneNumber.length > 10 ? 36 : 48 },
          ]}
          numberOfLines={1}
          adjustsFontSizeToFit
        >
          {phoneNumber || ''}
        </Text>
      </View>

      <View style={styles.keypadContainer}>
        <View style={styles.row}>
          <DialButton num="1" letters=" " />
          <DialButton num="2" letters="ABC" />
          <DialButton num="3" letters="DEF" />
        </View>
        <View style={styles.row}>
          <DialButton num="4" letters="GHI" />
          <DialButton num="5" letters="JKL" />
          <DialButton num="6" letters="MNO" />
        </View>
        <View style={styles.row}>
          <DialButton num="7" letters="PQRS" />
          <DialButton num="8" letters="TUV" />
          <DialButton num="9" letters="WXYZ" />
        </View>
        <View style={styles.row}>
          <DialButton num="*" letters=" " />
          <DialButton num="0" letters="+" onLongPress={handleLongPressZero} />
          <DialButton num="#" letters=" " />
        </View>

        <View style={[styles.row, { marginTop: 24, paddingHorizontal: 32 }]}>
          <View style={{ flex: 1 }} />
          
          <AnimatedButton
            onPress={handleCall}
            style={styles.callButton}
          >
            <Phone size={32} color="#FFFFFF" fill="#FFFFFF" />
          </AnimatedButton>

          <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
            {phoneNumber.length > 0 && (
              <AnimatedButton
                onPress={handleDelete}
                onLongPress={handleLongDelete}
                style={styles.deleteButton}
              >
                <Delete size={28} color="#94A3B8" />
              </AnimatedButton>
            )}
          </View>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0F172A', // Slate 900
    justifyContent: 'flex-end',
    paddingBottom: 40,
  },
  displayContainer: {
    flex: 1,
    justifyContent: 'flex-end',
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingBottom: 40,
  },
  displayText: {
    color: '#F8FAFC',
    fontWeight: '300',
    letterSpacing: 2,
    textAlign: 'center',
  },
  keypadContainer: {
    paddingHorizontal: 32,
    gap: 16,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  dialButton: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#1E293B', // Slate 800
    justifyContent: 'center',
    alignItems: 'center',
  },
  dialNumber: {
    color: '#F8FAFC', // Slate 50
    fontSize: 28,
    fontWeight: '400',
  },
  dialLetters: {
    color: '#64748B', // Slate 500
    fontSize: 10,
    fontWeight: '600',
    marginTop: 2,
  },
  callButton: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: '#10B981', // Emerald 500
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#10B981',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 16,
    elevation: 10,
  },
  deleteButton: {
    width: 48,
    height: 48,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
