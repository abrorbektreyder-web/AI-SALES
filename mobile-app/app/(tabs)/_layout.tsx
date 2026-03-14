import { Tabs } from 'expo-router';
import React from 'react';
import { StyleSheet, View } from 'react-native';
import { Phone, Star } from 'lucide-react-native';

export default function TabLayout() {
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
