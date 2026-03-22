import { Tabs } from 'expo-router';
import React, { useEffect, useRef } from 'react';
import { StyleSheet, View, Platform } from 'react-native';
import { Phone, Star } from 'lucide-react-native';
import * as Notifications from 'expo-notifications';
import * as SecureStore from 'expo-secure-store';
import axios from 'axios';

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
    shouldShowBanner: true,
    shouldShowList: true,
  }),
});

const API_URL = Platform.OS === 'web' 
  ? 'http://localhost:3000/api' 
  : 'http://10.160.103.193:3000/api'; 

export default function TabLayout() {
  const previousCallsRef = useRef<Record<string, string>>({}); // id -> status

  useEffect(() => {
    // Har 10 soniyada so'rov yuborib AI tahlil javobini tekshiramiz
    const interval = setInterval(async () => {
      try {
        const token = Platform.OS === 'web' 
          ? localStorage.getItem('auth_token')
          : await SecureStore.getItemAsync('auth_token');
          
        if (!token) return;

        const res = await axios.get(`${API_URL}/agent/dashboard`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        
        const newCalls = res.data.calls || [];
        const currentStates: Record<string, string> = {};
        
        for (const call of newCalls) {
          currentStates[call.id] = call.status;
          
          const oldStatus = previousCallsRef.current[call.id];
          if (oldStatus === 'ANALYZING' && call.status === 'COMPLETED' && call.analysis) {
            // QO'NG'IROQ TAHLIL QILINDI! (Push Notification jo'natamiz)
            await Notifications.scheduleNotificationAsync({
              content: {
                title: "🧠 AI Tahlil yakunlandi!",
                body: `Sizning oxirgi suhbatingiz ${call.analysis.score} ballga baholandi. Xulosa tayyor.`,
                sound: true,
              },
              trigger: null,
            });
          }
        }
        
        previousCallsRef.current = currentStates;
      } catch (err) {
        console.log("Polling error:", err);
      }
    }, 10000); 

    return () => clearInterval(interval);
  }, []);
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarStyle: styles.tabBar,
        tabBarActiveTintColor: '#38BDF8', // Light blue
        tabBarInactiveTintColor: '#64748B', // Muted slate
        tabBarShowLabel: true,
        tabBarLabelStyle: styles.tabBarLabel,
      }}>
      <Tabs.Screen
        name="index"
        options={{
          title: 'Dialer',
          tabBarIcon: ({ color, size }) => (
            <Phone size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="rating"
        options={{
          title: 'Reyting',
          tabBarIcon: ({ color, size }) => (
            <Star size={size} color={color} />
          ),
        }}
      />
    </Tabs>
  );
}

const styles = StyleSheet.create({
  tabBar: {
    backgroundColor: '#0F172A', // Slate 900
    borderTopWidth: 1,
    borderTopColor: '#1E293B', // Slate 800
    elevation: 0,
    shadowOpacity: 0,
    height: 60,
    paddingBottom: 8,
    paddingTop: 8,
  },
  tabBarLabel: {
    fontSize: 12,
    fontWeight: '500',
    fontFamily: 'sans-serif',
  },
});
