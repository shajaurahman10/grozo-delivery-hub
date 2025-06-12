
# Convert Grozo PWA to Android APK

This guide explains how to convert the Grozo Progressive Web App (PWA) into a native Android APK using Google's Bubblewrap tool.

## Prerequisites

- Node.js (version 14 or higher)
- Android SDK (Android Studio recommended)
- Java Development Kit (JDK 8 or higher)

## Step-by-Step Instructions

### 1. Install Bubblewrap

```bash
npm install -g @bubblewrap/cli
```

### 2. Initialize Your Project

Navigate to your project directory and run:

```bash
bubblewrap init --manifest=https://grozo.vercel.app/manifest.json
```

This will create a new Android project based on your PWA manifest.

### 3. Configure the Project

During initialization, you'll be prompted for:
- **Package Name**: `com.grozo.app` (or your preferred package name)
- **App Name**: `Grozo`
- **Launcher Name**: `Grozo`
- **Display Mode**: `standalone`
- **Orientation**: `portrait`
- **Theme Color**: `#00b894`
- **Background Color**: `#0a0f1c`
- **Start URL**: `https://grozo.vercel.app/`

### 4. Add Required Icons

Place your app icons in the project:
- Copy `icon-192.png` to `app/src/main/res/mipmap-xxxhdpi/ic_launcher.png`
- Copy `icon-512.png` to `app/src/main/res/mipmap-xxxhdpi/ic_launcher_round.png`

### 5. Build the APK

```bash
bubblewrap build
```

This will generate an APK file in the `app/build/outputs/apk/release/` directory.

### 6. Test the APK

#### Install on Android Device (via ADB)
```bash
adb install app/build/outputs/apk/release/app-release.apk
```

#### Install on Android Emulator
- Open Android Studio
- Start an Android emulator
- Drag and drop the APK file onto the emulator

### 7. Publish to Google Play Store (Optional)

1. Sign up for a Google Play Developer account
2. Create a new application
3. Upload your APK
4. Fill in the required store listing information
5. Submit for review

## Additional Commands

### Update the PWA
```bash
bubblewrap update
```

### Clean build
```bash
bubblewrap build --clean
```

### Generate signed APK for production
```bash
bubblewrap build --release
```

## Troubleshooting

### Common Issues:

1. **Build Errors**: Ensure Android SDK and JDK are properly installed
2. **Icon Issues**: Verify icon dimensions (192x192 and 512x512 pixels)
3. **Manifest Errors**: Check that your manifest.json is valid and accessible

### Verification

Your APK should:
- ✅ Install successfully on Android devices
- ✅ Show the Grozo logo and branding
- ✅ Load the website content
- ✅ Work offline (basic functionality)
- ✅ Display install prompts appropriately
- ✅ Maintain all original website features

## Notes

- The APK will be approximately 10-15MB in size
- The app will essentially be a wrapper around your web app
- All website functionality will be preserved
- Users can install directly from the APK without needing the Play Store

## Support

For technical issues:
- Check the [Bubblewrap documentation](https://github.com/GoogleChromeLabs/bubblewrap)
- Verify your PWA meets [Google's PWA criteria](https://web.dev/pwa-checklist/)

---

**Created for Grozo Delivery Hub**  
Contact: grozo.in@gmail.com
