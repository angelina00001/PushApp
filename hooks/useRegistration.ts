import { useState } from 'react';
import { Alert } from 'react-native';

interface RegistrationData {
  email: string;
  password: string;
  deviceName: string;
  fcmToken: string;
}

interface RegistrationResponse {
  success: boolean;
  message: string;
  data?: any;
}

export function useRegistration() {
  const [isLoading, setIsLoading] = useState(false);
  const [response, setResponse] = useState<RegistrationResponse | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Default server URL - user can change this
  const [serverUrl, setServerUrl] = useState('http://192.168.0.171:8000/api/v1/auth/signup');

  async function registerDevice(data: RegistrationData): Promise<boolean> {
    if (!data.email || !data.password) {
      Alert.alert('Validation Error', 'Please enter both email and password');
      return false;
    }

    if (!data.fcmToken) {
      Alert.alert('Error', 'Push token not available. Please grant notification permission first.');
      return false;
    }

    setIsLoading(true);
    setError(null);
    setResponse(null);

    try {
      const res = await fetch(serverUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: data.email,
          password: data.password,
          full_name: 'Mobile User',
          tfa_enabled: true,
          device_type: 'push',
          device_name: data.deviceName || 'My Phone',
          fcm_token: data.fcmToken,
        }),
      });

      const responseData = await res.json();

      if (res.ok) {
        setResponse({
          success: true,
          message: 'Device registered successfully!',
          data: responseData,
        });
        Alert.alert('Success', 'Device registered successfully!');
        return true;
      } else {
        const errorMsg = responseData.message || responseData.error || 'Registration failed';
        setError(errorMsg);
        setResponse({
          success: false,
          message: errorMsg,
          data: responseData,
        });
        Alert.alert('Registration Failed', errorMsg);
        return false;
      }
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : 'Network error. Check if server is running.';
      setError(errorMsg);
      setResponse({
        success: false,
        message: errorMsg,
      });
      Alert.alert('Network Error', errorMsg);
      return false;
    } finally {
      setIsLoading(false);
    }
  }

  function clearResponse() {
    setResponse(null);
    setError(null);
  }

  return {
    registerDevice,
    isLoading,
    response,
    error,
    serverUrl,
    setServerUrl,
    clearResponse,
  };
}
