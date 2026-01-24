# 📱 Mobile App Build Guide

Aapki React app ab mobile app ban sakti hai! Yahaan step-by-step instructions hain.

## ✅ Setup Complete!
Capacitor successfully install ho gaya hai. Ab aap Android APK bana sakte ho.

---

## 🚀 Android APK Kaise Banayein

### **Prerequisite (Ek baar install karo):**
1. **Android Studio** download karo: https://developer.android.com/studio
2. Install karte waqt "Android SDK" option select karna

### **APK Build Steps:**

#### Step 1: Project Build Karo
```bash
npm run build
```

#### Step 2: Android Project Sync Karo
```bash
npx cap sync android
```

#### Step 3: Android Studio Mein Kholo
```bash
npx cap open android
```
Ya directly command:
```bash
npm run android
```

#### Step 4: Android Studio Mein APK Banao
1. Android Studio khulega
2. Top menu → **Build** → **Build Bundle(s) / APK(s)** → **Build APK(s)**
3. APK ready hone ke baad "locate" par click karo
4. APK file `android/app/build/outputs/apk/debug/` folder mein milega

---

## 📦 Available Commands

| Command | Kaam |
|---------|------|
| `npm run build` | Web app build karega |
| `npm run android:build` | Build + Android sync karega |
| `npm run android` | Build + Sync + Android Studio khol dega |
| `npx cap sync` | Sab changes Android project mein copy karega |
| `npx cap open android` | Android Studio khol dega |

---

## 🔧 Important Files

- **capacitor.config.json** - Main configuration file
- **android/** - Android native project folder
- **dist/** - Built web files (ye Android mein jaata hai)

---

## 💡 Tips

1. **Har baar code change karo toh:**
   ```bash
   npm run build
   npx cap sync android
   ```

2. **Testing ke liye:**
   - Android Studio mein virtual device banao
   - Ya phone USB se connect karo (USB debugging ON)
   - Android Studio mein "Run" button dabao

3. **Release APK (Production) ke liye:**
   - Android Studio mein: Build → Generate Signed Bundle / APK
   - Keystore banani padegi (ek baar)

4. **Play Store pe upload karne ke liye:**
   - AAB (Android App Bundle) banao
   - Google Play Console account chahiye
   - Developer fee: $25 (one-time)

---

## 🎯 Quick Start

Abhi test karne ke liye:
```bash
npm run android
```

Yeh command automatically:
- ✅ App build karega
- ✅ Android sync karega  
- ✅ Android Studio khol dega

Android Studio mein green "Run" button dabao aur app emulator ya phone pe chalega! 🎉

---

## 🆘 Common Issues

**Error: "dist folder not found"**
- Solution: Pehle `npm run build` chala lo

**Error: "Android SDK not found"**
- Solution: Android Studio properly install karo with SDK

**App crash ho raha hai mobile pe:**
- Check console logs Android Studio ke Logcat mein
- API URLs check karo (localhost nahi chalega mobile pe)

---

## 📝 Notes

- Aapka server URL change karna padega production build ke liye
- `localhost` mobile pe nahi chalega - actual IP ya domain use karo
- Environment variables properly set karo

Happy Building! 🚀
