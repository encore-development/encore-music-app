# 🎵 Encore Music App

A modern social media platform for music lovers, built with React Native and Expo.

## 📱 Features

- **TikTok-Style Feed** with personalized, trending, and chronological views
- **Camera Integration** for photo and video posts
- **Real-time Updates** with EventBus system
- **Smart Feed Algorithm** with engagement scoring
- **Load More Pagination** with unique posts
- **Professional UI/UX** with modern design

## 🚀 Quick Start

### Prerequisites
- Node.js installed
- Expo CLI: `npm install -g @expo/cli`
- Expo Go app on your phone

### Installation

1. **Clone the repository:**
```bash
git clone https://github.com/encore-development/encore-music-app.git
cd encore-music-app
```

2. **Navigate to the app directory:**
```bash
cd encore-mobile-v2
```

3. **Install dependencies:**
```bash
npm install
```

4. **Start the development server:**
```bash
npx expo start
```

5. **Run on your device:**
   - **iPhone:** Open Camera app → Scan QR code
   - **Android:** Open Expo Go app → Scan QR code

## 📁 Project Structure

```
encore-mobile-v2/
├── screens/           # App screens (Home, Profile, Camera, etc.)
├── components/        # Reusable components (PostCard, etc.)
├── services/          # Business logic (FeedService, PostService, etc.)
├── App.js            # Main app entry point
└── package.json      # Dependencies and scripts
```

## 🎯 Key Components

- **HomeScreen** - Main feed with posts and stories
- **ProfileScreen** - TikTok-style user profiles
- **CameraScreen** - Photo/video capture
- **PostCard** - Individual post component
- **FeedService** - Feed management and caching
- **FeedAlgorithm** - Smart content scoring

## 🛠️ Technologies

- **React Native** - Mobile app framework
- **Expo** - Development platform
- **JavaScript** - Programming language
- **AsyncStorage** - Local data persistence
- **Expo Camera** - Camera functionality

## 📱 Supported Platforms

- iOS (iPhone/iPad)
- Android

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch
3. Commit your changes
4. Push to the branch
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License.

---

**Built with ❤️ by the Encore Development Team**