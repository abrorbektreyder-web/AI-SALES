import { Redirect, router } from 'expo-router';
import { useEffect, useState } from 'react';
import { Platform, View, ActivityIndicator, StyleSheet } from 'react-native';
import * as SecureStore from 'expo-secure-store';

export default function Index() {
  const [isReady, setIsReady] = useState(false);
  const [hasToken, setHasToken] = useState(false);

  useEffect(() => {
    async function checkToken() {
      try {
        let token = null;
        if (Platform.OS === 'web') {
          token = localStorage.getItem('auth_token');
        } else {
          token = await SecureStore.getItemAsync('auth_token');
        }
        
        if (token) {
          setHasToken(true);
        }
      } catch (e) {
        console.error("Token tekshirishda xato:", e);
      } finally {
        setIsReady(true);
      }
    }
    
    checkToken();
  }, []);

  if (!isReady) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#10B981" />
      </View>
    );
  }

  // Agar tokeni bo'lsa tabga (dialerga), bo'lmasa login sahifasiga 
  if (hasToken) {
    return <Redirect href="/(tabs)" />;
  } else {
    return <Redirect href="/(auth)/login" />;
  }
}

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    backgroundColor: '#0F172A', 
    justifyContent: 'center',
    alignItems: 'center'
  }
});
