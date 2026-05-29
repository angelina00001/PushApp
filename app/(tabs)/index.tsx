import { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
  Platform,
} from 'react-native';
import { useNotifications } from '@/hooks/useNotifications';
import { useRegistration } from '@/hooks/useRegistration';
import { Bell, Copy, Check, Server, Mail, Lock, Smartphone, Send } from 'lucide-react-native';

export default function RegistrationScreen() {
  const { pushToken, permissionStatus, requestPermission } = useNotifications();
  const { registerDevice, isLoading, response, error, serverUrl, setServerUrl } = useRegistration();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [deviceName, setDeviceName] = useState('My Phone');
  const [tokenCopied, setTokenCopied] = useState(false);

  async function handleRegister() {
    await registerDevice({
      email,
      password,
      deviceName,
      fcmToken: pushToken,
    });
  }

  async function copyToken() {
    if (Platform.OS === 'web') {
      await navigator.clipboard.writeText(pushToken);
    } else {
      // For native, would need expo-clipboard or similar
      console.log('Token:', pushToken);
    }
    setTokenCopied(true);
    setTimeout(() => setTokenCopied(false), 2000);
  }

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
      <View style={styles.header}>
        <Bell size={48} color="#2E7D32" />
        <Text style={styles.title}>Push Notify App</Text>
        <Text style={styles.subtitle}>Register your device for push notifications</Text>
      </View>

      {/* Permission Status */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Notification Permission</Text>
        <View style={styles.permissionRow}>
          <View style={[styles.statusBadge, permissionStatus === 'granted' ? styles.granted : styles.pending]}>
            <Text style={styles.statusText}>
              {permissionStatus === 'granted' ? 'Granted' : permissionStatus === 'denied' ? 'Denied' : 'Pending'}
            </Text>
          </View>
          {permissionStatus !== 'granted' && (
            <TouchableOpacity style={styles.permissionButton} onPress={requestPermission}>
              <Text style={styles.permissionButtonText}>Grant Permission</Text>
            </TouchableOpacity>
          )}
        </View>
      </View>

      {/* Push Token */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>FCM Push Token</Text>
        <View style={styles.tokenContainer}>
          <ScrollView horizontal showsHorizontalScrollIndicator={true}>
            <Text style={styles.tokenText} selectable>
              {pushToken || 'Requesting token...'}
            </Text>
          </ScrollView>
          {pushToken && (
            <TouchableOpacity style={styles.copyButton} onPress={copyToken}>
              {tokenCopied ? <Check size={20} color="#2E7D32" /> : <Copy size={20} color="#666" />}
            </TouchableOpacity>
          )}
        </View>
      </View>

      {/* Server Configuration */}
      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Server size={20} color="#2E7D32" />
          <Text style={styles.sectionTitleWithIcon}>Server URL</Text>
        </View>
        <TextInput
          style={styles.input}
          value={serverUrl}
          onChangeText={setServerUrl}
          placeholder="http://192.168.x.x:8000/api/v1/auth/signup"
          autoCapitalize="none"
          autoCorrect={false}
          keyboardType="url"
        />
      </View>

      {/* Registration Form */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Device Registration</Text>

        <View style={styles.inputGroup}>
          <View style={styles.inputIcon}>
            <Mail size={20} color="#666" />
          </View>
          <TextInput
            style={styles.inputWithIcon}
            value={email}
            onChangeText={setEmail}
            placeholder="Enter email"
            autoCapitalize="none"
            autoCorrect={false}
            keyboardType="email-address"
          />
        </View>

        <View style={styles.inputGroup}>
          <View style={styles.inputIcon}>
            <Lock size={20} color="#666" />
          </View>
          <TextInput
            style={styles.inputWithIcon}
            value={password}
            onChangeText={setPassword}
            placeholder="Enter password"
            secureTextEntry
            autoCapitalize="none"
          />
        </View>

        <View style={styles.inputGroup}>
          <View style={styles.inputIcon}>
            <Smartphone size={20} color="#666" />
          </View>
          <TextInput
            style={styles.inputWithIcon}
            value={deviceName}
            onChangeText={setDeviceName}
            placeholder="Device name (e.g., iPhone 15)"
            autoCapitalize="words"
          />
        </View>

        <TouchableOpacity
          style={[styles.registerButton, (!pushToken || !email || !password || !deviceName) && styles.disabledButton]}
          onPress={handleRegister}
          disabled={isLoading || !pushToken || !email || !password || !deviceName}
        >
          {isLoading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <>
              <Send size={20} color="#fff" />
              <Text style={styles.registerButtonText}>Register Device</Text>
            </>
          )}
        </TouchableOpacity>
      </View>

      {/* Response Display */}
      {response && (
        <View style={[styles.responseSection, response.success ? styles.successResponse : styles.errorResponse]}>
          <Text style={styles.responseTitle}>{response.success ? 'Success' : 'Error'}</Text>
          <Text style={styles.responseMessage}>{response.message}</Text>
          {response.data && (
            <Text style={styles.responseData}>{JSON.stringify(response.data, null, 2)}</Text>
          )}
        </View>
      )}

      {error && !response && (
        <View style={styles.errorResponse}>
          <Text style={styles.responseTitle}>Error</Text>
          <Text style={styles.responseMessage}>{error}</Text>
        </View>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff5f8',
  },
  contentContainer: {
    padding: 20,
    paddingTop: 40,
  },
  header: {
    alignItems: 'center',
    marginBottom: 30,
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: '#ff66b2',
    marginTop: 12,
  },
  subtitle: {
    fontSize: 14,
    color: '#a0a0a0',
    marginTop: 6,
    textAlign: 'center',
  },
  section: {
    backgroundColor: '#ffffff',
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#ff9ec7',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 6,
    elevation: 2,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
    gap: 8,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#ff66b2',
    marginBottom: 12,
  },
  sectionTitleWithIcon: {
    fontSize: 16,
    fontWeight: '600',
    color: '#ff66b2',
  },
  permissionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  statusBadge: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
  },
  granted: {
    backgroundColor: '#ffd9e8',
  },
  pending: {
    backgroundColor: '#ffe5f0',
  },
  statusText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#ff66b2',
  },
  permissionButton: {
    backgroundColor: '#ff9ec7',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
  },
  permissionButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '500',
  },
  tokenContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff5f8',
    borderRadius: 12,
    padding: 12,
    borderWidth: 1,
    borderColor: '#ffd9e8',
  },
  tokenText: {
    flex: 1,
    fontSize: 12,
    fontFamily: 'monospace',
    color: '#4a4a4a',
  },
  copyButton: {
    marginLeft: 8,
    padding: 4,
  },
  input: {
    backgroundColor: '#fff5f8',
    borderRadius: 12,
    padding: 14,
    fontSize: 16,
    borderWidth: 1,
    borderColor: '#ffd9e8',
    color: '#4a4a4a',
  },
  inputGroup: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  inputIcon: {
    backgroundColor: '#fff5f8',
    padding: 14,
    borderRadius: 12,
    borderTopRightRadius: 0,
    borderBottomRightRadius: 0,
    borderWidth: 1,
    borderColor: '#ffd9e8',
    borderRightWidth: 0,
  },
  inputWithIcon: {
    flex: 1,
    backgroundColor: '#fff5f8',
    padding: 14,
    fontSize: 16,
    borderWidth: 1,
    borderColor: '#ffd9e8',
    borderRadius: 12,
    borderTopLeftRadius: 0,
    borderBottomLeftRadius: 0,
    color: '#4a4a4a',
  },
  registerButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#ff9ec7',
    padding: 16,
    borderRadius: 12,
    marginTop: 8,
    gap: 8,
  },
  disabledButton: {
    backgroundColor: '#ffcde3',
  },
  registerButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  responseSection: {
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
  },
  successResponse: {
    backgroundColor: '#ffd9e8',
    borderWidth: 1,
    borderColor: '#ffb6d9',
  },
  errorResponse: {
    backgroundColor: '#ffe5f0',
    borderWidth: 1,
    borderColor: '#ffc7d9',
  },
  responseTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#ff66b2',
    marginBottom: 8,
  },
  responseMessage: {
    fontSize: 14,
    color: '#6b6b6b',
    marginBottom: 8,
  },
  responseData: {
    fontSize: 12,
    fontFamily: 'monospace',
    color: '#4a4a4a',
    backgroundColor: '#fff5f8',
    padding: 8,
    borderRadius: 4,
  },
});
