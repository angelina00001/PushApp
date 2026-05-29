import { useState, useEffect, useRef } from 'react';
import { Platform, Alert } from 'react-native';
import Constants from 'expo-constants';

export interface NotificationData {
  id: string;
  title: string;
  body: string;
  receivedAt: Date;
  data?: Record<string, any>;
}

export function useNotifications() {
  const [pushToken, setPushToken] = useState<string>('');
  const [notifications, setNotifications] = useState<NotificationData[]>([]);
  const [permissionStatus, setPermissionStatus] = useState<'undetermined' | 'granted' | 'denied'>('undetermined');

  useEffect(() => {
    // Only register for push notifications on native platforms
    if (Platform.OS !== 'web') {
      registerForPushNotificationsAsync();
    } else {
      // On web, just show placeholder
      setPushToken('Web platform - use mobile device for push notifications');
      setPermissionStatus('undetermined');
    }
  }, []);

  async function registerForPushNotificationsAsync() {
    if (Platform.OS === 'web') {
      return;
    }

    // Dynamically import expo-notifications only on native platforms
    const Notifications = await import('expo-notifications');

    let token = '';

    // Set notification handler
    Notifications.setNotificationHandler({
      handleNotification: async () => ({
        shouldShowAlert: true,
        shouldPlaySound: true,
        shouldSetBadge: false,
      }),
    });

    if (Platform.OS === 'android') {
      await Notifications.setNotificationChannelAsync('default', {
        name: 'default',
        importance: Notifications.AndroidImportance.MAX,
        vibrationPattern: [0, 250, 250, 250],
        lightColor: '#2E7D32',
      });
    }

    const { status: existingStatus } = await Notifications.getPermissionsAsync();
    let finalStatus = existingStatus;

    if (existingStatus !== 'granted') {
      const { status } = await Notifications.requestPermissionsAsync();
      finalStatus = status;
    }

    setPermissionStatus(finalStatus as 'undetermined' | 'granted' | 'denied');

    if (finalStatus !== 'granted') {
      Alert.alert(
        'Permission Required',
        'Push notification permission is required for this app to function properly.',
        [{ text: 'OK' }]
      );
      return;
    }

    if (Constants.isDevice) {
      try {
        const projectId = Constants.expoConfig?.extra?.eas?.projectId;

        const tokenData = await Notifications.getExpoPushTokenAsync({
          projectId: projectId || 'your-project-id',
        });

        token = tokenData.data;
        setPushToken(token);
        console.log('Push token:', token);
      } catch (e) {
        console.error('Error getting push token:', e);
      }
    } else {
      Alert.alert('Warning', 'Must use physical device for Push Notifications');
    }
  }

  async function requestPermission() {
    await registerForPushNotificationsAsync();
  }

  function clearNotifications() {
    setNotifications([]);
  }

  return {
    pushToken,
    notifications,
    permissionStatus,
    requestPermission,
    clearNotifications,
  };
}
