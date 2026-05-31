# Push Notify App

A React Native (Expo) mobile application for Android that handles push notifications and device registration.

**APK:** https://drive.google.com/file/d/1korj_nriEAgKKwmNzn77RRYgEcDq1g5I/view?usp=sharing

## Features

- Request push notification permissions on startup
- Generate and display FCM push token
- Register device with custom backend server
- View received push notifications in a dedicated list
- Clean, production-ready UI with two main screens

## Setup Instructions

### 1. Firebase Configuration

Before building the APK, you need to configure Firebase:

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Create a new project or use an existing one
3. Add an Android app with package name: `com.pushnotify.app`
4. Download `google-services.json`
5. Replace the placeholder file in the project root with your actual file

### 2. Install Dependencies

```bash
npm install
```

Dependencies are already installed, but if you're setting up fresh:

```bash
npm install expo-notifications
```

### 3. Configure Server URL

Edit `app/(tabs)/index.tsx` and update the `serverUrl` in `useRegistration` hook:

```typescript
const [serverUrl, setServerUrl] = useState('http://YOUR_IP:8000/api/v1/auth/signup');
```

Or change it directly in the app UI.

## Building APK

### Option 1: Build with EAS (Recommended)

1. Install EAS CLI globally:

```bash
npm install -g eas-cli
```

2. Login to your Expo account (or create one):

```bash
eas login
```

3. Configure the project:

```bash
eas build:configure
```

4. Build the APK:

```bash
eas build --platform android --profile preview
```

This will create an APK (not an AAB) that you can install directly on your device.

**Note:** EAS provides free build minutes (30 minutes/month for free tier). A typical Android build uses ~15-20 minutes.

### Option 2: Local Build (Advanced)

If you want to build locally without EAS:

1. Generate native Android project:

```bash
npx expo prebuild --platform android
```

2. Build APK with Gradle:

```bash
cd android
./gradlew assembleRelease
```

The APK will be in: `android/app/build/outputs/apk/release/app-release.apk`

**Note:** Local builds require:
- Android Studio installed
- Java JDK 11 or higher
- Android SDK configured
- `ANDROID_HOME` environment variable set

## App Structure

```
app/
├── _layout.tsx          # Root layout (Stack navigator)
├── (tabs)/
│   ├── _layout.tsx      # Tab bar layout
│   ├── index.tsx        # Registration screen (main)
│   └── notifications.tsx # Notifications list screen
hooks/
├── useNotifications.ts  # Push notification handling
├── useRegistration.ts   # Server registration logic
└── useFrameworkReady.ts # Framework initialization
```

## Usage

### Screen 1: Registration

1. Grant notification permission on startup
2. View your FCM push token
3. Configure server URL (your local IP + port 8000)
4. Enter email and password (any test values)
5. Click "Register Device" to send data to server

### Screen 2: Notifications

- View all received push notifications
- See notification title, body, and timestamp
- Clear all notifications
- View additional notification data

## Server Requirements

Your backend server should accept:

```http
POST http://YOUR_IP:8000/api/v1/auth/signup
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "password123",
  "fcm_token": "ExponentPushToken[xxxxxx]"
}
```

Expected response format:

```json
{
  "success": true,
  "message": "Device registered successfully",
  "data": {
    "id": 1,
    "email": "user@example.com"
  }
}
```

## Development

### Run Dev Server

```bash
npm run dev
```

### Build for Web

```bash
npm run build:web
```

### Type Check

```bash
npm run typecheck
```

## Technical Details

### Push Notifications

- Uses `expo-notifications` for cross-platform push notification handling
- Generates Expo Push Token (compatible with FCM)
- Automatically handles notification reception and display
- Supports both foreground and background notifications

### Permissions

Required Android permissions:
- `android.permission.RECEIVE_BOOT_COMPLETED` - Restart on boot
- `android.permission.VIBRATE` - Notification vibrations
- `android.permission.POST_NOTIFICATIONS` - Post notifications (Android 13+)

### Styling

- Clean Material Design-inspired UI
- Green color scheme (#2E7D32 primary)
- Card-based layout with shadows and elevation
- Responsive design with proper spacing

## Troubleshooting

### No Push Token

- Verify notification permission is granted
- Check if Firebase is configured correctly
- Ensure google-services.json is valid

### Registration Fails

- Verify server URL is correct (use your local IP, not localhost)
- Ensure backend server is running
- Check network connectivity
- Review server logs for errors

### Notifications Not Received

- Verify push token is valid
- Ensure app has notification permissions
- Check if notification channel is created (Android)
- Test with Expo's push notification tool: https://expo.dev/notifications

## License

MIT License - Use freely for your projects.

## Next Steps

1. Replace `google-services.json` with your Firebase config
2. Update server URL to your actual backend
3. Build APK using EAS or local build
4. Install on your Android device
5. Test push notifications with your backend
