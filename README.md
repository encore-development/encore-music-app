# 🎵 Encore Music App - Complete Project

A comprehensive music social media platform with both mobile app and web components, featuring TikTok-style content sharing, music discovery, and social interactions.

## 🏗️ Project Structure

This is a monorepo containing multiple applications:

### 📱 Mobile Apps
- **`encore-mobile-v2/`** - Main React Native app (Expo)
- **`encore-mobile/`** - TypeScript version of the mobile app

### 🌐 Web Application  
- **`app/`** - Next.js web application
- **`components/`** - Shared React components
- **`context/`** - React context providers
- **`lib/`** - Utility libraries

## ✨ Features

### 📱 Mobile App Features
- **Social Feed** - TikTok-style vertical feed with music posts
- **Post Creation** - Camera integration for photo/video posts
- **User Profiles** - Personal profiles with post history
- **Music Integration** - Audio playback and music sharing
- **Real-time Updates** - Live feed updates using EventBus
- **Comment System** - Interactive commenting with real-time updates
- **Like/Share System** - Social engagement features

### 🌐 Web App Features
- **Community Feed** - Web-based social feed
- **Responsive Design** - Works on desktop and mobile browsers
- **Modern UI** - Built with Next.js and Tailwind CSS

### 🎨 UI/UX
- **Modern Design** - Clean, dark theme interface
- **TikTok-Style Layout** - 9:16 aspect ratio content
- **Smooth Animations** - Fluid user interactions
- **Cross-Platform** - Consistent experience across mobile and web

## 🚀 Getting Started

### Prerequisites
- Node.js (v16 or higher)
- npm or yarn
- Expo CLI (for mobile development)
- iOS Simulator or Android Emulator

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/encore-development/encore-music-app.git
   cd encore-music-app
   ```

2. **Install root dependencies**
   ```bash
   npm install
   ```

3. **For Mobile Development (encore-mobile-v2)**
   ```bash
   cd encore-mobile-v2
   npm install
   npm start
   ```

4. **For Web Development**
   ```bash
   npm run dev
   ```

## 📁 Detailed Project Structure

```
encore-music-app/
├── encore-mobile-v2/          # Main React Native app
│   ├── components/            # Mobile UI components
│   ├── screens/              # App screens
│   ├── services/             # Business logic & APIs
│   └── App.js               # Main mobile app
├── encore-mobile/            # TypeScript mobile version
│   └── src/                 # TypeScript source files
├── app/                     # Next.js web application
│   ├── community-feed/      # Community feed page
│   └── ...                  # Other web pages
├── components/              # Shared React components
├── context/                 # React context providers
├── lib/                     # Utility libraries
├── package.json            # Root package configuration
└── README.md              # This file
```

## 🛠️ Built With

### Mobile Stack
- **React Native** - Mobile app framework
- **Expo** - Development platform
- **AsyncStorage** - Local data persistence
- **Expo Image Picker** - Camera integration
- **Expo AV** - Audio/video playback

### Web Stack
- **Next.js** - React web framework
- **TypeScript** - Type-safe JavaScript
- **Tailwind CSS** - Utility-first CSS framework
- **React** - UI library

### Shared Technologies
- **React Navigation** - Navigation system
- **EventBus** - Real-time communication
- **Custom Feed Algorithm** - Content recommendation

## 🎯 Development Scripts

```bash
# Web development
npm run dev          # Start Next.js development server
npm run build        # Build for production
npm run start        # Start production server

# Mobile development
cd encore-mobile-v2
npm start           # Start Expo development server
npm run ios         # Run on iOS simulator
npm run android     # Run on Android emulator
```

## 📱 Screenshots

*Add screenshots of both mobile and web versions here*

## 🎯 Roadmap

### Phase 1 (Current)
- [x] Basic social feed functionality
- [x] Post creation and management
- [x] User profiles
- [x] Comment system
- [x] Cross-platform support

### Phase 2 (Upcoming)
- [ ] User authentication system
- [ ] Real backend integration
- [ ] Push notifications
- [ ] Music streaming integration
- [ ] Live streaming features

### Phase 3 (Future)
- [ ] Advanced feed algorithm with AI
- [ ] Monetization features
- [ ] Creator tools
- [ ] Analytics dashboard

## 🤝 Contributing

1. Fork the project
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- Inspired by TikTok and Instagram's social media features
- Built with love for music creators and enthusiasts
- Special thanks to the React Native, Next.js, and Expo communities

---

**Made with ❤️ and 🎵 by the Encore Development Team**