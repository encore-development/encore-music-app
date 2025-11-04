import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert, ScrollView, Image, TextInput, RefreshControl, SafeAreaView, Modal } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import PostCard from './components/PostCard';
import ProfileScreen from './screens/ProfileScreen';
import CameraScreen from './screens/CameraScreen';
import PostCreationScreen from './screens/PostCreationScreen';
import HomeScreen from './screens/HomeScreen';
import PostService from './services/PostService';

// Simple Storage System
class EncoreStorage {
  static data = {
    userProfile: null,
    feedPosts: [],
    likedPosts: new Set(),
    bookmarkedPosts: new Set(),
    walletBalance: 2450,
    notifications: [],
    chats: [],
    chatMessages: {}
  };

  static async get(key) {
    return this.data[key];
  }

  static async set(key, value) {
    this.data[key] = value;
    return true;
  }

  static async update(key, updater) {
    this.data[key] = updater(this.data[key]);
    return this.data[key];
  }
}

// Backend API Simulation
class EncoreAPI {
  static async delay(ms = 1000) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  // User Management
  static async getUserProfile(userId = 'current_user') {
    await this.delay(500);
    return {
      id: userId,
      username: 'your_username',
      displayName: 'Your Display Name',
      bio: '🎵 Music lover • Artist • Dreamer ✨',
      avatarColor: ['#10b981', '#059669'],
      profilePicture: null,
      posts: 1200,
      followers: 45600,
      following: 892,
      verified: false,
      joinDate: '2023-01-15',
      location: 'Los Angeles, CA',
      website: 'yourmusic.com'
    };
  }

  static async updateUserProfile(profileData) {
    await this.delay(800);
    return { success: true, data: profileData };
  }

  // Posts Management
  static async getFeedPosts(page = 1, limit = 10) {
    await this.delay(1000);
    const posts = [
      {
        id: 1,
        user: { username: 'dj_luna', displayName: 'DJ Luna', verified: true, avatar: '🌙' },
        content: 'Just dropped my latest electronic set! What do you think? 🎛️✨',
        image: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=400&h=400&fit=crop',
        audio: { title: 'Midnight Vibes', duration: '3:45', waveform: true },
        timestamp: new Date(Date.now() - 2 * 60 * 1000),
        likes: 234,
        comments: 45,
        shares: 12,
        isLiked: false,
        isBookmarked: false,
        tags: ['electronic', 'house', 'techno']
      },
      {
        id: 2,
        user: { username: 'synth_wave', displayName: 'Synth Wave', verified: false, avatar: '⚡' },
        content: 'Working on some retro synthwave vibes. Here\'s a preview! 🌆',
        image: 'https://images.unsplash.com/photo-1571974599782-87624638275c?w=400&h=400&fit=crop',
        audio: { title: 'Electric Dreams', duration: '4:12', waveform: true },
        timestamp: new Date(Date.now() - 15 * 60 * 1000),
        likes: 189,
        comments: 23,
        shares: 8,
        isLiked: true,
        isBookmarked: false,
        tags: ['synthwave', 'retro', '80s']
      },
      {
        id: 3,
        user: { username: 'chill_master', displayName: 'Chill Master', verified: true, avatar: '🌊' },
        content: 'Perfect study music for those late night sessions 📚🎵',
        image: 'https://images.unsplash.com/photo-1511379938547-c1f69419868d?w=400&h=400&fit=crop',
        audio: { title: 'Ocean Breeze', duration: '5:28', waveform: true },
        timestamp: new Date(Date.now() - 45 * 60 * 1000),
        likes: 156,
        comments: 31,
        shares: 15,
        isLiked: false,
        isBookmarked: true,
        tags: ['chill', 'lofi', 'study']
      }
    ];
    return { posts, hasMore: page < 3 };
  }

  static async likePost(postId) {
    await this.delay(300);
    const likedPosts = await EncoreStorage.get('likedPosts');
    likedPosts.add(postId);
    await EncoreStorage.set('likedPosts', likedPosts);
    return { success: true, liked: true };
  }

  static async unlikePost(postId) {
    await this.delay(300);
    const likedPosts = await EncoreStorage.get('likedPosts');
    likedPosts.delete(postId);
    await EncoreStorage.set('likedPosts', likedPosts);
    return { success: true, liked: false };
  }

  static async bookmarkPost(postId) {
    await this.delay(300);
    return { success: true, bookmarked: true };
  }

  static async sharePost(postId) {
    await this.delay(500);
    return { success: true, shared: true };
  }

  // Comments Management
  static async getPostComments(postId) {
    await this.delay(600);
    return [
      {
        id: 1,
        user: { username: 'music_lover', displayName: 'Music Lover', avatar: '🎵' },
        text: 'This is absolutely fire! 🔥 Can\'t stop listening!',
        timestamp: new Date(Date.now() - 10 * 60 * 1000),
        likes: 23,
        isLiked: false
      },
      {
        id: 2,
        user: { username: 'beat_maker', displayName: 'Beat Maker', avatar: '🥁' },
        text: 'Amazing vibes as always! When\'s the full album dropping?',
        timestamp: new Date(Date.now() - 25 * 60 * 1000),
        likes: 12,
        isLiked: true
      }
    ];
  }

  static async addComment(postId, text) {
    await this.delay(800);
    return {
      id: Date.now(),
      user: { username: 'your_username', displayName: 'Your Display Name', avatar: '🎤' },
      text,
      timestamp: new Date(),
      likes: 0,
      isLiked: false
    };
  }

  // Discovery & Search
  static async searchContent(query, type = 'all') {
    await this.delay(800);
    const results = {
      tracks: [
        { id: 1, title: 'Midnight Vibes', artist: 'DJ Luna', plays: '2.3M', duration: '3:45', emoji: '🌙' },
        { id: 2, title: 'Electric Dreams', artist: 'Synth Wave', plays: '1.8M', duration: '4:12', emoji: '⚡' }
      ],
      artists: [
        { id: 1, name: 'Nova Sound', followers: '12.5K', genre: 'Electronic', verified: true, growth: '+2.1K' },
        { id: 2, name: 'Echo Valley', followers: '8.2K', genre: 'Indie', verified: false, growth: '+1.8K' }
      ],
      playlists: [
        { id: 1, name: 'Chill Vibes', tracks: 24, emoji: '🌙', curator: 'Encore' },
        { id: 2, name: 'Workout Beats', tracks: 18, emoji: '💪', curator: 'FitMusic' }
      ]
    };
    return query ? results : { tracks: [], artists: [], playlists: [] };
  }

  static async getTrendingContent() {
    await this.delay(600);
    return {
      tracks: [
        { id: 1, title: 'Midnight Vibes', artist: 'DJ Luna', plays: '2.3M', emoji: '🌙', trending: true },
        { id: 2, title: 'Electric Dreams', artist: 'Synth Wave', plays: '1.8M', emoji: '⚡', trending: true },
        { id: 3, title: 'Ocean Breeze', artist: 'Chill Master', plays: '1.2M', emoji: '🌊', trending: false }
      ],
      genres: [
        { name: 'Electronic', color: '#8b5cf6', emoji: '🎛️', tracks: 1234 },
        { name: 'Hip Hop', color: '#ef4444', emoji: '🎤', tracks: 987 },
        { name: 'Jazz', color: '#f59e0b', emoji: '🎺', tracks: 654 }
      ]
    };
  }

  // Community Management
  static async getCommunityData() {
    await this.delay(700);
    return {
      stats: { members: 2400, events: 156, liveNow: 89, newPosts: 234 },
      liveSession: {
        id: 1,
        title: 'Late Night Electronic Vibes',
        host: 'DJ Luna',
        viewers: 1200,
        isLive: true,
        startTime: new Date(Date.now() - 45 * 60 * 1000)
      },
      spaces: [
        { id: 1, name: 'Producers Hub', members: '1.2K', color: '#8b5cf6', emoji: '🎛️', active: true },
        { id: 2, name: 'Vocalists Corner', members: '890', color: '#ec4899', emoji: '🎤', active: false },
        { id: 3, name: 'Beat Makers', members: '2.1K', color: '#f59e0b', emoji: '🥁', active: true }
      ],
      trendingTopics: [
        { topic: 'AI in Music Production', posts: 156, trend: '+45%', color: '#8b5cf6', participants: ['🎹', '🎛️', '🎵'] },
        { topic: 'Bedroom Pop Revival', posts: 89, trend: '+32%', color: '#ec4899', participants: ['🌸', '🎸', '🌙'] }
      ],
      recentActivity: [
        {
          id: 1,
          type: 'track_share',
          user: 'beat_maker_pro',
          action: 'shared a new track',
          content: 'Midnight Synthwave',
          time: new Date(Date.now() - 2 * 60 * 1000),
          avatar: '🎵',
          engagement: { likes: 23, comments: 5 }
        }
      ]
    };
  }

  // Events Management
  static async getEvents() {
    await this.delay(500);
    return [
      {
        id: 1,
        title: 'Electronic Music Festival',
        date: '2025-11-15',
        time: '20:00',
        host: 'DJ Luna',
        attendees: 234,
        type: 'Live Performance',
        location: 'Virtual Stage',
        description: 'Join us for an amazing night of electronic music!'
      },
      {
        id: 2,
        title: 'Beat Making Workshop',
        date: '2025-11-18',
        time: '15:00',
        host: 'Producer Mike',
        attendees: 45,
        type: 'Workshop',
        location: 'Community Room',
        description: 'Learn the basics of beat making with industry professionals.'
      }
    ];
  }

  static async joinEvent(eventId) {
    await this.delay(600);
    return { success: true, joined: true };
  }

  // Wallet & Points Management
  static async getWalletData() {
    await this.delay(400);
    return {
      balance: 2450,
      transactions: [
        { id: 1, type: 'purchased', amount: 1000, description: 'Points package ($9.99)', date: 'Nov 1, 2025' },
        { id: 2, type: 'earned', amount: 50, description: 'Daily login bonus', date: 'Nov 1, 2025' },
        { id: 3, type: 'spent', amount: 25, description: 'Tip to DJ Luna', date: 'Oct 31, 2025' }
      ],
      supportedArtists: [
        { name: 'DJ Luna', avatar: '🌙', lastSupported: '2 days ago', amount: '$5.00' },
        { name: 'Synth Wave', avatar: '⚡', lastSupported: '1 week ago', amount: '$10.00' }
      ]
    };
  }

  static async purchasePoints(packageId, amount) {
    await this.delay(2000);
    return { success: true, points: amount, transactionId: Date.now() };
  }

  static async tipArtist(artistId, amount) {
    await this.delay(1000);
    return { success: true, tipped: true };
  }

  // Notifications Management
  static async getNotifications() {
    await this.delay(400);
    return [
      { id: 1, type: 'like', user: 'music_lover', post: 'Vibe check 🎶✨', time: '2m ago', read: false },
      { id: 2, type: 'comment', user: 'dj_wave', post: 'Night at the decks 🔥', time: '5m ago', read: false },
      { id: 3, type: 'follow', user: 'synth_master', time: '10m ago', read: true }
    ];
  }

  static async markNotificationRead(notificationId) {
    await this.delay(200);
    return { success: true };
  }

  // Chat Management
  static async getChats() {
    await this.delay(500);
    return [
      { id: 1, user: 'music_lover', lastMessage: 'Love your latest track! 🔥', time: '2m ago', unread: 2 },
      { id: 2, user: 'dj_wave', lastMessage: 'Want to collab on something?', time: '1h ago', unread: 0 },
      { id: 3, user: 'synth_master', lastMessage: 'Thanks for the follow!', time: '3h ago', unread: 1 }
    ];
  }

  static async getChatMessages(chatId) {
    await this.delay(600);
    const messages = {
      1: [
        { id: 1, sender: 'music_lover', text: 'Hey! Love your music!', time: '2:30 PM', isMe: false },
        { id: 2, sender: 'me', text: 'Thank you so much! 🎵', time: '2:32 PM', isMe: true },
        { id: 3, sender: 'music_lover', text: 'Love your latest track! 🔥', time: '2:35 PM', isMe: false }
      ]
    };
    return messages[chatId] || [];
  }

  static async sendMessage(chatId, message) {
    await this.delay(800);
    return {
      id: Date.now(),
      sender: 'me',
      text: message,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      isMe: true
    };
  }
}

// Helper functions
const formatCount = (count) => {
  if (count >= 1000000) {
    return (count / 1000000).toFixed(1) + 'M';
  } else if (count >= 1000) {
    return (count / 1000).toFixed(1) + 'K';
  }
  return count.toString();
};

export default function App() {
  // Navigation & UI State
  const [currentTab, setCurrentTab] = React.useState('Home');
  const [refreshing, setRefreshing] = React.useState(false);
  const [searchQuery, setSearchQuery] = React.useState('');
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState(null);
  const [appReady, setAppReady] = React.useState(false);

  // Data State
  const [feedPosts, setFeedPosts] = React.useState([]);
  const [feedPage, setFeedPage] = React.useState(1);
  const [hasMorePosts, setHasMorePosts] = React.useState(true);
  const [searchResults, setSearchResults] = React.useState({ tracks: [], artists: [], playlists: [] });
  const [trendingContent, setTrendingContent] = React.useState({ tracks: [], genres: [] });
  const [communityData, setCommunityData] = React.useState(null);
  const [events, setEvents] = React.useState([]);
  const [walletData, setWalletData] = React.useState(null);
  const [notifications, setNotifications] = React.useState([]);
  const [chats, setChats] = React.useState([]);
  const [chatMessages, setChatMessages] = React.useState({});
  
  // Profile state
  const [profileData, setProfileData] = React.useState({
    username: 'your_username',
    displayName: 'Your Display Name',
    bio: '🎵 Music lover • Artist • Dreamer ✨',
    avatarColor: ['#10b981', '#059669'],
    profilePicture: null,
    posts: 1200,
    followers: 45600,
    following: 892,
  });
  
  const [showEditModal, setShowEditModal] = React.useState(false);
  const [showPostModal, setShowPostModal] = React.useState(false);
  const [showVideoPlayer, setShowVideoPlayer] = React.useState(false);
  const [showSettingsModal, setShowSettingsModal] = React.useState(false);
  const [selectedPost, setSelectedPost] = React.useState(null);
  
  // Home page interaction states
  const [showCommentsModal, setShowCommentsModal] = React.useState(false);
  const [showUserProfile, setShowUserProfile] = React.useState(false);
  const [selectedUser, setSelectedUser] = React.useState(null);
  const [selectedPostForComments, setSelectedPostForComments] = React.useState(null);
  const [newComment, setNewComment] = React.useState('');
  const [editForm, setEditForm] = React.useState({
    username: '',
    displayName: '',
    bio: '',
  });

  // Data Loading Functions
  const loadFeedPosts = async (page = 1, refresh = false) => {
    try {
      setLoading(true);
      setError(null);
      const response = await EncoreAPI.getFeedPosts(page);
      
      if (refresh || page === 1) {
        setFeedPosts(response.posts);
      } else {
        setFeedPosts(prev => [...prev, ...response.posts]);
      }
      
      setHasMorePosts(response.hasMore);
      setFeedPage(page);
    } catch (err) {
      setError('Failed to load posts');
      console.error('Error loading feed:', err);
    } finally {
      setLoading(false);
    }
  };

  const loadUserProfile = async () => {
    try {
      const profile = await EncoreAPI.getUserProfile();
      setProfileData(profile);
    } catch (err) {
      console.error('Error loading profile:', err);
    }
  };

  const loadSearchResults = async (query) => {
    if (!query.trim()) {
      setSearchResults({ tracks: [], artists: [], playlists: [] });
      return;
    }
    
    try {
      setLoading(true);
      const results = await EncoreAPI.searchContent(query);
      setSearchResults(results);
    } catch (err) {
      console.error('Error searching:', err);
    } finally {
      setLoading(false);
    }
  };

  const loadTrendingContent = async () => {
    try {
      const trending = await EncoreAPI.getTrendingContent();
      setTrendingContent(trending);
    } catch (err) {
      console.error('Error loading trending:', err);
    }
  };

  const loadCommunityData = async () => {
    try {
      const community = await EncoreAPI.getCommunityData();
      setCommunityData(community);
    } catch (err) {
      console.error('Error loading community:', err);
    }
  };

  const loadEvents = async () => {
    try {
      const eventsData = await EncoreAPI.getEvents();
      setEvents(eventsData);
    } catch (err) {
      console.error('Error loading events:', err);
    }
  };

  const loadWalletData = async () => {
    try {
      const wallet = await EncoreAPI.getWalletData();
      setWalletData(wallet);
    } catch (err) {
      console.error('Error loading wallet:', err);
    }
  };

  const loadNotifications = async () => {
    try {
      const notifs = await EncoreAPI.getNotifications();
      setNotifications(notifs);
    } catch (err) {
      console.error('Error loading notifications:', err);
    }
  };

  const loadChats = async () => {
    try {
      const chatsData = await EncoreAPI.getChats();
      setChats(chatsData);
    } catch (err) {
      console.error('Error loading chats:', err);
    }
  };

  const loadChatMessages = async (chatId) => {
    try {
      const messages = await EncoreAPI.getChatMessages(chatId);
      setChatMessages(prev => ({ ...prev, [chatId]: messages }));
    } catch (err) {
      console.error('Error loading messages:', err);
    }
  };

  // Initialize Demo Data
  const initializeDemoData = async () => {
    try {
      // Initialize storage with demo data
      await EncoreStorage.set('likedPosts', new Set([1, 2]));
      await EncoreStorage.set('bookmarkedPosts', new Set([3]));
      await EncoreStorage.set('walletBalance', 2450);
      
      console.log('✅ Demo data initialized successfully');
    } catch (err) {
      console.error('Error initializing demo data:', err);
    }
  };

  // Initial Data Loading
  React.useEffect(() => {
    const initializeApp = async () => {
      await initializeDemoData();
      
      // Load all data
      await Promise.all([
        loadFeedPosts(1, true),
        refreshHomeFeed(), // Load real posts on app start
        loadUserProfile(),
        loadTrendingContent(),
        loadCommunityData(),
        loadEvents(),
        loadWalletData(),
        loadNotifications(),
        loadChats()
      ]);
      
      console.log('✅ App initialized and ready for demo');
      setAppReady(true);
      
      // App is ready - no popup needed
    };
    
    initializeApp();
  }, []);

  // Search Effect
  React.useEffect(() => {
    const timeoutId = setTimeout(() => {
      loadSearchResults(searchQuery);
    }, 500);
    
    return () => clearTimeout(timeoutId);
  }, [searchQuery]);

  // Encore Points state
  const [encorePoints, setEncorePoints] = React.useState(2450);
  const [showPurchaseModal, setShowPurchaseModal] = React.useState(false);
  const [selectedPackage, setSelectedPackage] = React.useState(null);
  const [showCreatePostModal, setShowCreatePostModal] = React.useState(false);
  const [showVideoUploadModal, setShowVideoUploadModal] = React.useState(false);
  const [showCameraScreen, setShowCameraScreen] = React.useState(false);
  const [showPostCreation, setShowPostCreation] = React.useState(false);
  const [capturedMedia, setCapturedMedia] = React.useState(null);
  const [homeRefreshTrigger, setHomeRefreshTrigger] = React.useState(0);
  const [transactionHistory, setTransactionHistory] = React.useState([
    { id: 1, type: 'earned', amount: 50, description: 'Daily login bonus', date: '2 hours ago' },
    { id: 2, type: 'spent', amount: 100, description: 'Tipped @music_artist', date: '1 day ago' },
    { id: 3, type: 'earned', amount: 25, description: 'Post liked 100 times', date: '2 days ago' },
    { id: 4, type: 'purchased', amount: 500, description: 'Points package', date: '1 week ago' },
  ]);





  // UI State
  const [showNotifications, setShowNotifications] = React.useState(false);
  const [showChats, setShowChats] = React.useState(false);
  const [selectedChat, setSelectedChat] = React.useState(null);
  const [newMessage, setNewMessage] = React.useState('');

  // Interactive Functions
  const handleLikePost = async (postId) => {
    try {
      const post = feedPosts.find(p => p.id === postId);
      if (!post) return;

      // Optimistic update
      setFeedPosts(prev => prev.map(p => 
        p.id === postId 
          ? { 
              ...p, 
              isLiked: !p.isLiked, 
              likes: p.isLiked ? p.likes - 1 : p.likes + 1 
            }
          : p
      ));

      // API call
      if (post.isLiked) {
        await EncoreAPI.unlikePost(postId);
      } else {
        await EncoreAPI.likePost(postId);
        

      }
    } catch (err) {
      console.error('Error liking post:', err);
      // Revert optimistic update on error
      loadFeedPosts(1, true);
    }
  };

  const handleBookmarkPost = async (postId) => {
    try {
      setFeedPosts(prev => prev.map(p => 
        p.id === postId 
          ? { ...p, isBookmarked: !p.isBookmarked }
          : p
      ));

      await EncoreAPI.bookmarkPost(postId);
    } catch (err) {
      console.error('Error bookmarking post:', err);
    }
  };

  const handleSharePost = async (postId) => {
    try {
      await EncoreAPI.sharePost(postId);
      // Post shared silently
    } catch (err) {
      console.error('Error sharing post:', err);
      Alert.alert('Error', 'Failed to share post');
    }
  };

  const openComments = async (post) => {
    // Initialize post with empty comments array to prevent render error
    setSelectedPostForComments({ ...post, comments: [] });
    setShowCommentsModal(true);
    
    try {
      const comments = await PostService.getComments(post.id);
      setSelectedPostForComments(prev => ({ ...prev, comments }));
    } catch (err) {
      console.error('Error loading comments:', err);
      Alert.alert('Error', 'Failed to load comments');
      // Set empty array on error too
      setSelectedPostForComments(prev => ({ ...prev, comments: [] }));
    }
  };

  const handleAddComment = async () => {
    if (!newComment.trim() || !selectedPostForComments) return;

    try {
      const result = await PostService.addComment(selectedPostForComments.id, 'current_user', newComment.trim());
      const comment = result.comment;
      
      setSelectedPostForComments(prev => ({
        ...prev,
        comments: [...(prev.comments || []), comment]
      }));

      // Update the post in feed
      setFeedPosts(prev => prev.map(p => 
        p.id === selectedPostForComments.id 
          ? { ...p, comments: p.comments + 1 }
          : p
      ));

      setNewComment('');
      

    } catch (err) {
      console.error('Error adding comment:', err);
      Alert.alert('Error', 'Failed to add comment');
    }
  };

  const handleFollowArtist = async (artistId) => {
    try {
      // Simulate follow action
      // Following artist silently
    } catch (err) {
      console.error('Error following artist:', err);
    }
  };

  const handleJoinEvent = async (eventId) => {
    try {
      await EncoreAPI.joinEvent(eventId);
      
      setEvents(prev => prev.map(event => 
        event.id === eventId 
          ? { ...event, attendees: event.attendees + 1, isJoined: true }
          : event
      ));

      // Joined event silently
    } catch (err) {
      console.error('Error joining event:', err);
      Alert.alert('Error', 'Failed to join event');
    }
  };

  const handleJoinSpace = async (spaceId) => {
    try {
      // Joined community space silently
    } catch (err) {
      console.error('Error joining space:', err);
    }
  };

  const handleTipArtist = async (artistId, amount) => {
    try {
      await EncoreAPI.tipArtist(artistId, amount);
      
      // Update wallet balance
      setWalletData(prev => ({
        ...prev,
        balance: prev.balance - amount,
        transactions: [
          {
            id: Date.now(),
            type: 'spent',
            amount,
            description: `Tip to artist`,
            date: new Date().toLocaleDateString()
          },
          ...prev.transactions
        ]
      }));

      // Tipped artist silently
    } catch (err) {
      console.error('Error tipping artist:', err);
      Alert.alert('Error', 'Failed to send tip');
    }
  };

  const openUserProfile = (user) => {
    setSelectedUser(user);
    setShowUserProfile(true);
  };



  // Notification functions
  const openNotifications = () => {
    setShowNotifications(true);
    // Mark all notifications as read when opened
    setNotifications(prev => prev.map(notif => ({ ...notif, read: true })));
  };

  const getUnreadNotificationCount = () => {
    return notifications.filter(notif => !notif.read).length;
  };

  const markNotificationAsRead = async (notificationId) => {
    try {
      await EncoreAPI.markNotificationRead(notificationId);
      
      setNotifications(prev => prev.map(notif => 
        notif.id === notificationId 
          ? { ...notif, read: true }
          : notif
      ));
    } catch (err) {
      console.error('Error marking notification as read:', err);
    }
  };

  // Chat functions
  const openChats = () => {
    setShowChats(true);
  };

  const sendMessage = async () => {
    if (!newMessage.trim() || !selectedChat) return;

    try {
      const message = await EncoreAPI.sendMessage(selectedChat.id, newMessage.trim());
      
      setChatMessages(prev => ({
        ...prev,
        [selectedChat.id]: [...(prev[selectedChat.id] || []), message]
      }));
      
      // Update last message in chats list
      setChats(prev => prev.map(chat => 
        chat.id === selectedChat.id 
          ? { ...chat, lastMessage: newMessage.trim(), time: 'now', unread: 0 }
          : chat
      ));
      
      setNewMessage('');
    } catch (err) {
      console.error('Error sending message:', err);
      Alert.alert('Error', 'Failed to send message');
    }
  };

  const openChat = async (chat) => {
    setSelectedChat(chat);
    setShowChats(false);
    
    // Mark chat as read
    setChats(prev => prev.map(c => 
      c.id === chat.id ? { ...c, unread: 0 } : c
    ));

    // Load messages if not already loaded
    if (!chatMessages[chat.id]) {
      await loadChatMessages(chat.id);
    }
  };

  const getTotalUnreadMessages = () => {
    return chats.reduce((total, chat) => total + chat.unread, 0);
  };

  const onRefresh = React.useCallback(async () => {
    setRefreshing(true);
    try {
      await Promise.all([
        loadFeedPosts(1, true),
        refreshHomeFeed(), // Add real posts to feed
        loadUserProfile(),
        loadTrendingContent(),
        loadCommunityData(),
        loadEvents(),
        loadWalletData(),
        loadNotifications(),
        loadChats()
      ]);
    } catch (err) {
      console.error('Error refreshing data:', err);
    } finally {
      setRefreshing(false);
    }
  }, []);

  const loadMorePosts = async () => {
    if (!hasMorePosts || loading) return;
    await loadFeedPosts(feedPage + 1, false);
  };

  const handleTabChange = (tabName) => {
    setCurrentTab(tabName);
    
    // Load tab-specific data
    switch (tabName) {
      case 'Discover':
        if (trendingContent.tracks.length === 0) {
          loadTrendingContent();
        }
        break;
      case 'Community':
        if (!communityData) {
          loadCommunityData();
        }
        break;
      case 'Encore Points':
        if (!walletData) {
          loadWalletData();
        }
        break;
    }
  };

  const handleCreatePost = () => {
    setShowCreatePostModal(true);
  };

  const handleCreatePostOption = (type) => {
    setShowCreatePostModal(false);
    
    switch(type) {
      case 'photo':
        setShowCameraScreen(true);
        break;
      case 'reel':
        setShowCameraScreen(true);
        break;
      case 'friend':
        Alert.alert('👥 Friend Zone', 'Friend zone feature coming soon!');
        break;
      case 'community':
        Alert.alert('👥 Community', 'Community post feature coming soon!');
        break;
    }
  };

  const handleCameraCapture = (media) => {
    setShowCameraScreen(false);
    // Handle the captured media here
    console.log('Media captured:', media);
  };

  const handleMediaCaptured = (media) => {
    setCapturedMedia(media);
    setShowCameraScreen(false);
    setShowPostCreation(true);
  };

  const refreshHomeFeed = async () => {
    try {
      const allPosts = await PostService.getAllPosts();
      console.log('Refreshing home feed with posts:', allPosts.length);
      console.log('First post media:', allPosts[0]?.media);
      
      // Convert to the format expected by the home feed
      const formattedPosts = allPosts.map(post => ({
        id: post.id,
        username: post.username || 'alexmusic',
        displayName: post.displayName || 'Alex Rodriguez',
        imageUrl: post.media?.uri || "https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=600&h=600&fit=crop",
        media: post.media, // Pass the full media object
        content: post.content || 'New post',
        description: post.content || 'New post', // For backward compatibility
        tags: post.tags || [],
        hashtags: post.tags || [], // For backward compatibility
        userType: post.verified ? "artist" : "fan",
        postedTime: getTimeAgo(post.timestamp),
        timestamp: post.timestamp, // Keep original timestamp
        audioSrc: post.musicTrack?.url,
        likes: post.likes || 0,
        comments: post.comments || 0,
        shares: post.shares || 0,
        verified: post.verified || false,
      }));

      // Add to existing feed posts
      setFeedPosts(prevPosts => {
        // Remove duplicates and add new posts at the beginning
        const existingIds = prevPosts.map(p => p.id);
        const newPosts = formattedPosts.filter(p => !existingIds.includes(p.id));
        return [...newPosts, ...prevPosts];
      });
    } catch (error) {
      console.error('Error refreshing home feed:', error);
    }
  };

  const getTimeAgo = (timestamp) => {
    const now = new Date();
    const postTime = new Date(timestamp);
    const diffHours = Math.floor((now - postTime) / (1000 * 60 * 60));
    
    if (diffHours < 1) return 'now';
    if (diffHours < 24) return `${diffHours}h`;
    const diffDays = Math.floor(diffHours / 24);
    return `${diffDays}d`;
  };

  const handlePostCreated = (post) => {
    setShowPostCreation(false);
    setCapturedMedia(null);
    
    // Refresh the home feed immediately
    refreshHomeFeed();
    
    // Switch to home tab to show the new post
    setCurrentTab('Home');
    
    // Show success message
    Alert.alert('🎉 Success!', 'Your post has been shared! Check your home feed to see it.');
  };

  const handleVideoUpload = () => {
    Alert.alert('🎬 Video Upload', 'Video would be uploaded here!');
    setShowVideoUploadModal(false);
  };

  const handleWithdraw = () => {
    Alert.alert(
      '💰 Withdraw Funds',
      `Available balance: $${walletBalance}\n\nChoose withdrawal method:`,
      [
        { text: 'Cancel', style: 'cancel' },
        { text: '🏦 Bank Transfer', onPress: () => Alert.alert('🏦 Bank Transfer', 'Bank transfer feature coming soon!') },
        { text: '💳 PayPal', onPress: () => Alert.alert('💳 PayPal', 'PayPal withdrawal feature coming soon!') },
        { text: '₿ Crypto', onPress: () => Alert.alert('₿ Crypto', 'Crypto withdrawal feature coming soon!') },
      ]
    );
  };

  // Wallet Functions
  const purchasePoints = async (packageData) => {
    Alert.alert(
      'Purchase Confirmation',
      `Buy ${packageData.points.toLocaleString()} Encore Points for ${packageData.price}?`,
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Purchase', 
          onPress: async () => {
            try {
              Alert.alert('Processing...', 'Processing your payment...');
              
              const result = await EncoreAPI.purchasePoints(packageData.id, packageData.points);
              
              if (result.success) {
                // Update wallet data
                setWalletData(prev => ({
                  ...prev,
                  balance: prev.balance + packageData.points,
                  transactions: [
                    {
                      id: result.transactionId,
                      type: 'purchased',
                      amount: packageData.points,
                      description: `Points package (${packageData.price})`,
                      date: new Date().toLocaleDateString()
                    },
                    ...prev.transactions
                  ]
                }));

                setShowPurchaseModal(false);
                Alert.alert('Success!', `${packageData.points.toLocaleString()} Encore Points added to your wallet! 🎉`);
              }
            } catch (err) {
              console.error('Error purchasing points:', err);
              Alert.alert('Error', 'Failed to purchase points. Please try again.');
            }
          }
        }
      ]
    );
  };

  const renderHomeScreen = () => (
    <View style={styles.container}>
      {/* Header */}
      <SafeAreaView style={styles.header}>
        <LinearGradient
          colors={['rgba(0,0,0,0.95)', 'rgba(0,0,0,0.8)']}
          style={styles.headerGradient}
        >
          <View style={styles.headerContent}>
            <Text style={styles.headerTitle}>Encore</Text>
            <View style={styles.headerActions}>
              <TouchableOpacity style={styles.headerButton} onPress={openNotifications}>
                <Ionicons name="notifications-outline" size={24} color="#fff" />
                {getUnreadNotificationCount() > 0 && (
                  <View style={styles.badge}>
                    <Text style={styles.badgeCount}>{getUnreadNotificationCount()}</Text>
                  </View>
                )}
              </TouchableOpacity>
              <TouchableOpacity style={styles.headerButton} onPress={openChats}>
                <Ionicons name="chatbubble-outline" size={24} color="#fff" />
                {getTotalUnreadMessages() > 0 && (
                  <View style={styles.badge}>
                    <Text style={styles.badgeCount}>{getTotalUnreadMessages()}</Text>
                  </View>
                )}
              </TouchableOpacity>
            </View>
          </View>
        </LinearGradient>
      </SafeAreaView>

      {/* Feed */}
      <View style={styles.feedContainer}>
        <ScrollView
          style={styles.feed}
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={onRefresh}
              tintColor="#10b981"
              colors={['#10b981']}
            />
          }
        >
          {feedPosts.map((post, index) => (
            <PostCard
              key={post.id || `feed-post-${index}-${post.username || 'unknown'}-${Date.now()}`}
              post={post}
              onLike={() => handleLikePost(post.id)}
              onComment={() => openComments(post)}
              onShare={() => handleSharePost(post.id)}
              onBookmark={() => handleBookmarkPost(post.id)}
              onUserPress={() => {}}
            />
          ))}
          
          {/* Load More Button */}
          {hasMorePosts && !loading && (
            <View style={styles.loadMoreContainer}>
              <TouchableOpacity style={styles.loadMoreButton} onPress={loadMorePosts}>
                <Text style={styles.loadMoreText}>Load More Posts</Text>
                <Ionicons name="chevron-down" size={16} color="#10b981" />
              </TouchableOpacity>
            </View>
          )}
          
          {loading && (
            <View style={styles.loadingContainer}>
              <Text style={styles.loadingText}>Loading...</Text>
            </View>
          )}
        </ScrollView>
      </View>


    </View>
  );

  const renderDiscoverScreen = () => (
    <View style={styles.container}>
      <SafeAreaView style={styles.discoverHeaderPro}>
        <View style={styles.headerTopRowPro}>
          <View>
            <Text style={styles.discoverTitlePro}>Discover</Text>
            <Text style={styles.discoverSubtitlePro}>Find your next favorite song</Text>
          </View>
          <TouchableOpacity style={styles.filterButtonPro}>
            <Ionicons name="options-outline" size={22} color="#10b981" />
          </TouchableOpacity>
        </View>
        
        {/* Professional Search Bar */}
        <View style={styles.searchBarPro}>
          <Ionicons name="search" size={18} color="#888" />
          <TextInput
            style={styles.searchInputPro}
            placeholder="Search for artists, songs, albums..."
            placeholderTextColor="#888"
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
          <TouchableOpacity style={styles.micButtonPro}>
            <Ionicons name="mic-outline" size={18} color="#10b981" />
          </TouchableOpacity>
        </View>
      </SafeAreaView>

      <ScrollView style={styles.discoverContentPro} showsVerticalScrollIndicator={false}>


        {/* Featured Content */}
        <View style={styles.featuredSectionPro}>
          <View style={styles.sectionHeaderPro}>
            <Text style={styles.sectionTitlePro}>Featured Today</Text>
            <TouchableOpacity>
              <Text style={styles.viewAllTextPro}>View all</Text>
            </TouchableOpacity>
          </View>
          
          <TouchableOpacity style={styles.featuredCardPro} activeOpacity={0.8}>
            <LinearGradient
              colors={['#1a1a2e', '#16213e', '#0f3460']}
              style={styles.featuredGradientPro}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
            >
              <View style={styles.featuredContentPro}>
                <View style={styles.featuredTextPro}>
                  <Text style={styles.featuredTitlePro}>Today's Top Hits</Text>
                  <Text style={styles.featuredSubtitlePro}>The most played songs right now</Text>
                  <View style={styles.featuredStatsPro}>
                    <Text style={styles.featuredStatsTextPro}>2.1M plays</Text>
                    <Text style={styles.featuredStatsTextPro}>•</Text>
                    <Text style={styles.featuredStatsTextPro}>50 songs</Text>
                  </View>
                </View>
                <TouchableOpacity style={styles.playButtonPro}>
                  <Ionicons name="play" size={20} color="#fff" />
                </TouchableOpacity>
              </View>
              <View style={styles.featuredArtPro}>
                <LinearGradient
                  colors={['#10b981', '#059669']}
                  style={styles.featuredArtGradient}
                >
                  <Ionicons name="musical-notes" size={24} color="#fff" />
                </LinearGradient>
              </View>
            </LinearGradient>
          </TouchableOpacity>
        </View>

        {/* Browse by Genre */}
        <View style={styles.genreSectionPro}>
          <View style={styles.sectionHeaderPro}>
            <Text style={styles.sectionTitlePro}>Browse by Genre</Text>
            <TouchableOpacity>
              <Text style={styles.viewAllTextPro}>View all</Text>
            </TouchableOpacity>
          </View>
          <View style={styles.genreGridPro}>
            {[
              { name: "Pop", color: "#ff6b6b", tracks: "12.5K", icon: "musical-notes" },
              { name: "Hip Hop", color: "#4ecdc4", tracks: "8.9K", icon: "mic" },
              { name: "Rock", color: "#45b7d1", tracks: "6.2K", icon: "radio" },
              { name: "Electronic", color: "#96ceb4", tracks: "4.8K", icon: "pulse" },
              { name: "Jazz", color: "#feca57", tracks: "3.1K", icon: "musical-note" },
              { name: "Classical", color: "#ff9ff3", tracks: "2.4K", icon: "library" },
            ].map((genre, index) => (
              <TouchableOpacity key={index} style={styles.genreCardPro} activeOpacity={0.8}>
                <LinearGradient
                  colors={[genre.color + '20', genre.color + '10']}
                  style={styles.genreGradientPro}
                >
                  <View style={[styles.genreIconPro, { backgroundColor: genre.color }]}>
                    <Ionicons name={genre.icon} size={18} color="#fff" />
                  </View>
                  <Text style={styles.genreNamePro}>{genre.name}</Text>
                  <Text style={styles.genreTracksPro}>{genre.tracks} songs</Text>
                </LinearGradient>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Trending Artists */}
        <View style={styles.artistsSectionPro}>
          <View style={styles.sectionHeaderPro}>
            <Text style={styles.sectionTitlePro}>Trending Artists</Text>
            <TouchableOpacity>
              <Text style={styles.viewAllTextPro}>View all</Text>
            </TouchableOpacity>
          </View>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.artistsScrollPro}>
            {[
              { name: "Olivia Chen", followers: "2.1M", verified: true, genre: "Pop" },
              { name: "Marcus Rivera", followers: "1.8M", verified: true, genre: "Hip Hop" },
              { name: "Luna Park", followers: "1.5M", verified: false, genre: "Indie" },
              { name: "Alex Thompson", followers: "1.2M", verified: true, genre: "Electronic" },
              { name: "Sofia Martinez", followers: "980K", verified: false, genre: "R&B" },
            ].map((artist, index) => (
              <TouchableOpacity key={index} style={styles.artistCardPro} activeOpacity={0.8}>
                <View style={styles.artistAvatarPro}>
                  <LinearGradient
                    colors={['#10b981', '#059669']}
                    style={styles.artistAvatarGradient}
                  >
                    <Text style={styles.artistInitialPro}>{artist.name.split(' ').map(n => n[0]).join('')}</Text>
                  </LinearGradient>
                  {artist.verified && (
                    <View style={styles.verifiedBadgePro}>
                      <Ionicons name="checkmark-circle" size={16} color="#10b981" />
                    </View>
                  )}
                </View>
                <View style={styles.artistInfoPro}>
                  <Text style={styles.artistNamePro}>{artist.name}</Text>
                  <Text style={styles.artistGenrePro}>{artist.genre}</Text>
                  <Text style={styles.artistFollowersPro}>{artist.followers} followers</Text>
                </View>
                <TouchableOpacity style={styles.followBtnPro}>
                  <Text style={styles.followBtnTextPro}>Follow</Text>
                </TouchableOpacity>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        {/* Recent Searches */}
        <View style={styles.recentSection}>
          <Text style={styles.sectionTitleNew}>Recent Searches</Text>
          <View style={styles.recentList}>
            {[
              { query: "lo-fi hip hop", type: "Genre" },
              { query: "study music", type: "Playlist" },
              { query: "acoustic covers", type: "Genre" },
            ].map((item, index) => (
              <TouchableOpacity key={index} style={styles.recentItem}>
                <View style={styles.recentIcon}>
                  <Ionicons name="time-outline" size={20} color="#666" />
                </View>
                <View style={styles.recentInfo}>
                  <Text style={styles.recentQuery}>{item.query}</Text>
                  <Text style={styles.recentType}>{item.type}</Text>
                </View>
                <TouchableOpacity style={styles.recentClose}>
                  <Ionicons name="close" size={16} color="#666" />
                </TouchableOpacity>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      </ScrollView>
    </View>
  );

  const renderCommunityScreen = () => (
    <View style={styles.container}>
      {/* Clean Header */}
      <View style={styles.communityHeaderClean}>
        <Text style={styles.communityTitleClean}>Community</Text>
      </View>

      <ScrollView style={styles.discoverContent} showsVerticalScrollIndicator={false}>
        {/* Live Now Section */}
        <View style={styles.section}>
          <View style={styles.liveNowCard}>
            <View style={styles.liveIndicatorClean}>
              <View style={styles.liveDotClean} />
              <Text style={styles.liveTextClean}>LIVE</Text>
            </View>
            <View style={styles.liveContentClean}>
              <Text style={styles.liveTitle}>Electronic Music Session</Text>
              <Text style={styles.liveHost}>DJ Luna • 1.2K listening</Text>
            </View>
            <TouchableOpacity style={styles.joinLiveClean} onPress={() => Alert.alert('🎵 Joining Live Session', 'Connecting to DJ Luna\'s live session...')}>
              <Text style={styles.joinLiveTextClean}>Join</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Community Spaces */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Spaces</Text>
          <View style={styles.spacesGrid}>
            {[
              { name: "Producers", members: "1.2K", emoji: "🎛️" },
              { name: "Vocalists", members: "890", emoji: "🎤" },
              { name: "Beat Makers", members: "2.1K", emoji: "🥁" },
              { name: "Indie Artists", members: "756", emoji: "🎸" },
            ].map((space, index) => (
              <TouchableOpacity key={index} style={styles.spaceCardClean} onPress={() => handleJoinSpace(space.id)}>
                <Text style={styles.spaceEmojiClean}>{space.emoji}</Text>
                <Text style={styles.spaceNameClean}>{space.name}</Text>
                <Text style={styles.spaceMembersClean}>{space.members}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Trending Topics */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Trending</Text>
            <TouchableOpacity onPress={() => Alert.alert('🔥 Trending Topics', 'Showing more trending topics!')}>
              <Text style={styles.viewAllText}>View All</Text>
            </TouchableOpacity>
          </View>
          
          {[
            { topic: "AI in Music Production", posts: 156 },
            { topic: "Bedroom Pop Revival", posts: 89 },
            { topic: "Lo-Fi Hip Hop Techniques", posts: 234 },
          ].map((topic, index) => (
            <TouchableOpacity key={index} style={styles.topicCardClean} onPress={() => Alert.alert(`🔥 ${topic.topic}`, `${topic.posts} posts`)}>
              <Text style={styles.topicTitleClean}>{topic.topic}</Text>
              <Text style={styles.topicStatsClean}>{topic.posts} posts</Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Recent Activity */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Recent Activity</Text>
          {[
            { user: "beat_maker_pro", action: "shared a track", content: "Midnight Synthwave", time: "2m", avatar: "🎵" },
            { user: "vocal_artist", action: "looking for collab", content: "R&B project", time: "15m", avatar: "🎤" },
            { user: "dj_luna", action: "created event", content: "Electronic Workshop", time: "1h", avatar: "🎛️" },
          ].map((activity, index) => (
            <TouchableOpacity key={index} style={styles.activityCardClean} onPress={() => Alert.alert(`${activity.avatar} ${activity.user}`, `${activity.action}: ${activity.content}`)}>
              <View style={styles.activityAvatarClean}>
                <Text style={styles.activityEmojiClean}>{activity.avatar}</Text>
              </View>
              <View style={styles.activityContentClean}>
                <Text style={styles.activityUserClean}>{activity.user}</Text>
                <Text style={styles.activityTextClean}>{activity.action}: {activity.content}</Text>
                <Text style={styles.activityTimeClean}>{activity.time} ago</Text>
              </View>
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>
    </View>
  );

  const renderEncorePointsScreen = () => (
    <View style={styles.walletContainer}>
      {/* Starry Background */}
      <View style={styles.starryBackground}>
        {Array.from({ length: 50 }).map((_, index) => (
          <View
            key={index}
            style={[
              styles.star,
              {
                top: Math.random() * 100 + '%',
                left: Math.random() * 100 + '%',
                animationDelay: Math.random() * 3 + 's',
              }
            ]}
          />
        ))}
      </View>

      <ScrollView style={styles.walletContent} showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.walletHeaderNew}>
          <Text style={styles.walletTitleNew}>Manage your funds and support artists</Text>
        </View>

        {/* Available Balance */}
        <View style={styles.balanceSection}>
          <Text style={styles.balanceLabelNew}>Available Balance</Text>
          <Text style={styles.balanceAmountNew}>${walletData ? (walletData.balance * 0.01).toFixed(2) : '0.00'}</Text>
          <Text style={styles.balancePointsNew}>{walletData ? walletData.balance.toLocaleString() : '0'} Encore Points</Text>
        </View>

        {/* Action Buttons */}
        <View style={styles.actionButtons}>
          <TouchableOpacity 
            style={styles.addFundsButton}
            onPress={() => setShowPurchaseModal(true)}
          >
            <Ionicons name="add" size={24} color="#000" />
            <Text style={styles.addFundsText}>Add Funds</Text>
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.withdrawButton} onPress={handleWithdraw}>
            <Ionicons name="arrow-down" size={24} color="#fff" />
            <Text style={styles.withdrawText}>Withdraw</Text>
          </TouchableOpacity>
        </View>

        {/* Bonus Tiers */}
        <View style={styles.bonusSection}>
          <View style={styles.bonusTitleRow}>
            <Ionicons name="gift" size={24} color="#10b981" />
            <Text style={styles.bonusTitle}>Bonus Tiers</Text>
          </View>
          
          <View style={styles.tiersList}>
            {[
              { tier: 'Bronze', requirement: '1,000 EP', bonus: '5%', current: encorePoints >= 1000 },
              { tier: 'Silver', requirement: '5,000 EP', bonus: '10%', current: encorePoints >= 5000 },
              { tier: 'Gold', requirement: '15,000 EP', bonus: '15%', current: encorePoints >= 15000 },
              { tier: 'Platinum', requirement: '50,000 EP', bonus: '25%', current: encorePoints >= 50000 },
            ].map((tier, index) => (
              <View key={index} style={[styles.tierCard, tier.current && styles.tierCardActive]}>
                <View style={styles.tierInfo}>
                  <Text style={[styles.tierName, tier.current && styles.tierNameActive]}>{tier.tier}</Text>
                  <Text style={styles.tierRequirement}>{tier.requirement}</Text>
                </View>
                <View style={styles.tierBonus}>
                  <Text style={[styles.tierBonusText, tier.current && styles.tierBonusActive]}>+{tier.bonus}</Text>
                  <Text style={styles.tierBonusLabel}>bonus</Text>
                </View>
                {tier.current && (
                  <View style={styles.tierBadge}>
                    <Ionicons name="checkmark-circle" size={20} color="#10b981" />
                  </View>
                )}
              </View>
            ))}
          </View>
        </View>

        {/* Support Artists */}
        <View style={styles.supportSection}>
          <Text style={styles.supportTitle}>💝 Support Your Favorite Artists</Text>
          <Text style={styles.supportSubtitle}>Send tips and support to artists you love</Text>
          
          <View style={styles.artistSupportList}>
            {[
              { name: 'DJ Luna', avatar: '🌙', lastSupported: '2 days ago', amount: '$5.00' },
              { name: 'Synth Wave', avatar: '⚡', lastSupported: '1 week ago', amount: '$10.00' },
              { name: 'Chill Master', avatar: '🌊', lastSupported: '2 weeks ago', amount: '$3.00' },
            ].map((artist, index) => (
              <View key={index} style={styles.artistSupportCard}>
                <View style={styles.artistSupportAvatar}>
                  <Text style={styles.artistSupportEmoji}>{artist.avatar}</Text>
                </View>
                <View style={styles.artistSupportInfo}>
                  <Text style={styles.artistSupportName}>{artist.name}</Text>
                  <Text style={styles.artistSupportTime}>Last supported {artist.lastSupported}</Text>
                </View>
                <View style={styles.artistSupportAmount}>
                  <Text style={styles.artistSupportAmountText}>{artist.amount}</Text>
                </View>
              </View>
            ))}
          </View>
        </View>

        {/* Recent Transactions */}
        <View style={styles.transactionsSection}>
          <Text style={styles.transactionsTitle}>📊 Recent Activity</Text>
          {transactionHistory.slice(0, 5).map((transaction, index) => (
            <View key={transaction.id} style={styles.transactionItem}>
              <View style={styles.transactionIcon}>
                <Ionicons 
                  name={transaction.type === 'purchased' ? 'add-circle' : transaction.type === 'earned' ? 'trophy' : 'remove-circle'} 
                  size={20} 
                  color={transaction.type === 'purchased' ? '#10b981' : transaction.type === 'earned' ? '#f59e0b' : '#ef4444'} 
                />
              </View>
              <View style={styles.transactionDetails}>
                <Text style={styles.transactionDescription}>{transaction.description}</Text>
                <Text style={styles.transactionDate}>{transaction.date}</Text>
              </View>
              <Text style={[
                styles.transactionAmount,
                { color: transaction.type === 'spent' ? '#ef4444' : '#10b981' }
              ]}>
                {transaction.type === 'spent' ? '-' : '+'}{transaction.amount.toLocaleString()} EP
              </Text>
            </View>
          ))}
        </View>

        <View style={styles.walletFooter}>
          <Text style={styles.walletFooterText}>Encore Points never expire</Text>
          <Text style={styles.walletFooterSubtext}>Support artists and earn rewards</Text>
        </View>
      </ScrollView>
    </View>
  );

  const renderProfileScreen = () => {
    return <ProfileScreen onNavigate={(screen) => setCurrentTab(screen)} />;
  };

  const renderCurrentScreen = () => {
    switch (currentTab) {
      case 'Home': return renderHomeScreen();
      case 'Discover': return renderDiscoverScreen();
      case 'Community': return renderCommunityScreen();
      case 'Encore Points': return renderEncorePointsScreen();
      case 'Profile': return renderProfileScreen();
      default: return renderHomeScreen();
    }
  };

  // Show loading screen while app initializes
  if (!appReady) {
    return (
      <View style={styles.loadingScreen}>
        <StatusBar style="light" />
        <LinearGradient
          colors={['#000', '#111']}
          style={styles.loadingGradient}
        >
          <View style={styles.loadingContent}>
            <Text style={styles.loadingLogo}>🎵</Text>
            <Text style={styles.loadingTitle}>Encore</Text>
            <Text style={styles.loadingSubtitle}>Initializing your music experience...</Text>
            <View style={styles.loadingIndicator}>
              <View style={styles.loadingDot} />
              <View style={[styles.loadingDot, { animationDelay: '0.2s' }]} />
              <View style={[styles.loadingDot, { animationDelay: '0.4s' }]} />
            </View>
          </View>
        </LinearGradient>
      </View>
    );
  }

  return (
    <SafeAreaProvider>
      <View style={styles.app}>
        <StatusBar style="light" />
      
      {renderCurrentScreen()}

      {/* Comments Modal */}
      {showCommentsModal && selectedPostForComments && (
        <View style={styles.modalOverlay}>
          <View style={styles.commentsModal}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Comments ({(selectedPostForComments?.comments || []).length})</Text>
              <TouchableOpacity onPress={() => setShowCommentsModal(false)}>
                <Text style={styles.closeButton}>✕</Text>
              </TouchableOpacity>
            </View>
            
            <ScrollView style={styles.commentsList}>
              {(selectedPostForComments?.comments || []).map((comment) => (
                <View key={comment.id} style={styles.commentItem}>
                  <View style={styles.commentHeader}>
                    <View style={styles.commentAvatar}>
                      <Text style={styles.commentAvatarText}>
                        {comment.displayName ? comment.displayName.split(' ').map(n => n[0]).join('') : 'AR'}
                      </Text>
                    </View>
                    <View style={styles.commentContent}>
                      <Text style={styles.commentUsername}>{comment.displayName || comment.username}</Text>
                      <Text style={styles.commentText}>{comment.text}</Text>
                      <View style={styles.commentMeta}>
                        <Text style={styles.commentTime}>{new Date(comment.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</Text>
                        <TouchableOpacity style={styles.commentLikeButton}>
                          <Text style={styles.commentLikes}>{comment.likes} likes</Text>
                        </TouchableOpacity>
                      </View>
                    </View>
                  </View>
                </View>
              ))}
              
              {(!selectedPostForComments?.comments || selectedPostForComments.comments.length === 0) && (
                <View style={styles.noCommentsContainer}>
                  <Text style={styles.noCommentsText}>No comments yet. Be the first to comment!</Text>
                </View>
              )}
            </ScrollView>
            
            <View style={styles.commentInput}>
              <TextInput
                style={styles.commentTextInput}
                placeholder="Add a comment..."
                placeholderTextColor="#666"
                value={newComment}
                onChangeText={setNewComment}
                multiline
              />
              <TouchableOpacity 
                style={styles.sendButton}
                onPress={handleAddComment}
              >
                <Text style={styles.sendButtonText}>Send</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      )}

      {/* User Profile Modal */}
      {showUserProfile && selectedUser && (
        <View style={styles.modalOverlay}>
          <View style={styles.userProfileModal}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Profile</Text>
              <TouchableOpacity onPress={() => setShowUserProfile(false)}>
                <Text style={styles.closeButton}>✕</Text>
              </TouchableOpacity>
            </View>
            
            <View style={styles.userProfileContent}>
              <LinearGradient
                colors={['#10b981', '#059669']}
                style={styles.modalAvatar}
              >
                <Text style={styles.avatarText}>
                  {selectedUser.username.charAt(0).toUpperCase()}
                </Text>
              </LinearGradient>
              <Text style={styles.modalDisplayName}>{selectedUser.displayName}</Text>
              <Text style={styles.modalUsername}>@{selectedUser.username}</Text>
              {selectedUser.userProfile?.bio && (
                <Text style={styles.modalBio}>{selectedUser.userProfile.bio}</Text>
              )}
              
              <View style={styles.modalStats}>
                <View style={styles.modalStatItem}>
                  <Text style={styles.modalStatNumber}>{formatCount(selectedUser.userProfile?.posts || 0)}</Text>
                  <Text style={styles.modalStatLabel}>Posts</Text>
                </View>
                <View style={styles.modalStatItem}>
                  <Text style={styles.modalStatNumber}>{formatCount(selectedUser.userProfile?.followers || 0)}</Text>
                  <Text style={styles.modalStatLabel}>Followers</Text>
                </View>
                <View style={styles.modalStatItem}>
                  <Text style={styles.modalStatNumber}>{formatCount(selectedUser.userProfile?.following || 0)}</Text>
                  <Text style={styles.modalStatLabel}>Following</Text>
                </View>
              </View>
              
              <TouchableOpacity style={styles.followButton}>
                <Text style={styles.followButtonText}>Follow</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      )}

      {/* Purchase Points Modal */}
      {showPurchaseModal && (
        <View style={styles.modalOverlay}>
          <View style={styles.purchaseModal}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Buy Encore Points</Text>
              <TouchableOpacity onPress={() => setShowPurchaseModal(false)}>
                <Text style={styles.closeButton}>✕</Text>
              </TouchableOpacity>
            </View>
            
            <View style={styles.packagesList}>
              {[
                { points: 500, price: '$4.99', bonus: '0%', popular: false },
                { points: 1200, price: '$9.99', bonus: '20%', popular: true },
                { points: 2500, price: '$19.99', bonus: '25%', popular: false },
                { points: 5500, price: '$39.99', bonus: '37%', popular: false },
              ].map((pkg, index) => (
                <TouchableOpacity 
                  key={index} 
                  style={[styles.packageCard, pkg.popular && styles.popularPackage]}
                  onPress={() => purchasePoints(pkg)}
                >
                  {pkg.popular && (
                    <View style={styles.popularBadge}>
                      <Text style={styles.popularText}>MOST POPULAR</Text>
                    </View>
                  )}
                  <Text style={styles.packagePoints}>{pkg.points.toLocaleString()}</Text>
                  <Text style={styles.packagePrice}>{pkg.price}</Text>
                  {pkg.bonus !== '0%' && (
                    <Text style={styles.packageBonus}>+{pkg.bonus} Bonus</Text>
                  )}
                </TouchableOpacity>
              ))}
            </View>
          </View>
        </View>
      )}

      {/* Notifications Modal */}
      {showNotifications && (
        <View style={styles.modalOverlay}>
          <View style={styles.notificationsModal}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Notifications</Text>
              <TouchableOpacity onPress={() => setShowNotifications(false)}>
                <Text style={styles.closeButton}>✕</Text>
              </TouchableOpacity>
            </View>
            
            <ScrollView style={styles.notificationsList}>
              {notifications.map((notification) => (
                <TouchableOpacity key={notification.id} style={styles.notificationItem} onPress={() => {
                  markNotificationAsRead(notification.id);
                  let message = '';
                  if (notification.type === 'like') message = `${notification.user} liked your post: "${notification.post}"`;
                  else if (notification.type === 'comment') message = `${notification.user} commented on your post: "${notification.post}"`;
                  else if (notification.type === 'follow') message = `${notification.user} started following you!`;
                  Alert.alert('📱 Notification', message);
                }}>
                  <LinearGradient
                    colors={['#10b981', '#059669']}
                    style={styles.notificationAvatar}
                  >
                    <Text style={styles.avatarText}>
                      {notification.user.charAt(0).toUpperCase()}
                    </Text>
                  </LinearGradient>
                  <View style={styles.notificationContent}>
                    <Text style={styles.notificationText}>
                      <Text style={styles.notificationUser}>{notification.user}</Text>
                      {notification.type === 'like' && ' liked your post'}
                      {notification.type === 'comment' && ' commented on your post'}
                      {notification.type === 'follow' && ' started following you'}
                      {notification.post && `: "${notification.post}"`}
                    </Text>
                    <Text style={styles.notificationTime}>{notification.time}</Text>
                  </View>
                  {!notification.read && <View style={styles.unreadDot} />}
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>
        </View>
      )}

      {/* Chats Modal */}
      {showChats && (
        <View style={styles.fullScreenOverlay}>
          <View style={styles.chatsModal}>
            <View style={styles.fullScreenHeader}>
              <TouchableOpacity onPress={() => setShowChats(false)} style={styles.backButton}>
                <Ionicons name="arrow-back" size={24} color="#fff" />
              </TouchableOpacity>
              <Text style={styles.fullScreenTitle}>Messages</Text>
              <View style={styles.headerSpacer} />
            </View>
            
            <ScrollView style={styles.chatsList}>
              {chats.map((chat) => (
                <TouchableOpacity 
                  key={chat.id} 
                  style={styles.chatItem}
                  onPress={() => openChat(chat)}
                >
                  <LinearGradient
                    colors={['#10b981', '#059669']}
                    style={styles.chatAvatar}
                  >
                    <Text style={styles.avatarText}>
                      {chat.user.charAt(0).toUpperCase()}
                    </Text>
                  </LinearGradient>
                  <View style={styles.chatContent}>
                    <View style={styles.chatHeader}>
                      <Text style={styles.chatUser}>{chat.user}</Text>
                      <Text style={styles.chatTime}>{chat.time}</Text>
                    </View>
                    <Text style={styles.chatMessage} numberOfLines={1}>
                      {chat.lastMessage}
                    </Text>
                  </View>
                  {chat.unread > 0 && (
                    <View style={styles.unreadBadge}>
                      <Text style={styles.unreadCount}>{chat.unread}</Text>
                    </View>
                  )}
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>
        </View>
      )}

      {/* Individual Chat Modal */}
      {selectedChat && (
        <View style={styles.fullScreenOverlay}>
          <View style={styles.chatModal}>
            <View style={styles.fullScreenHeader}>
              <TouchableOpacity onPress={() => {
                setSelectedChat(null);
                setShowChats(true);
              }} style={styles.backButton}>
                <Ionicons name="arrow-back" size={24} color="#fff" />
              </TouchableOpacity>
              <Text style={styles.fullScreenTitle}>{selectedChat.user}</Text>
              <TouchableOpacity style={styles.headerAction}>
                <Ionicons name="videocam-outline" size={24} color="#fff" />
              </TouchableOpacity>
            </View>
            
            <ScrollView style={styles.messagesList}>
              {(chatMessages[selectedChat.id] || []).map((message) => (
                <View 
                  key={message.id} 
                  style={[
                    styles.messageItem,
                    message.isMe ? styles.myMessage : styles.theirMessage
                  ]}
                >
                  <Text style={[
                    styles.messageText,
                    message.isMe ? styles.myMessageText : styles.theirMessageText
                  ]}>
                    {message.text}
                  </Text>
                  <Text style={styles.messageTime}>{message.time}</Text>
                </View>
              ))}
            </ScrollView>
            
            <View style={styles.messageInput}>
              <TextInput
                style={styles.messageTextInput}
                placeholder="Type a message..."
                placeholderTextColor="#666"
                value={newMessage}
                onChangeText={setNewMessage}
                multiline
              />
              <TouchableOpacity 
                style={styles.sendMessageButton}
                onPress={sendMessage}
              >
                <Ionicons name="send" size={20} color="#fff" />
              </TouchableOpacity>
            </View>
          </View>
        </View>
      )}

      {/* Settings Modal */}
      {showSettingsModal && (
        <View style={styles.fullScreenOverlay}>
          <View style={styles.settingsModal}>
            <View style={styles.fullScreenHeader}>
              <TouchableOpacity onPress={() => setShowSettingsModal(false)} style={styles.backButton}>
                <Ionicons name="arrow-back" size={24} color="#fff" />
              </TouchableOpacity>
              <Text style={styles.fullScreenTitle}>Settings</Text>
              <View style={styles.headerSpacer} />
            </View>
            
            <ScrollView style={styles.settingsContent}>
              {/* Account Section */}
              <View style={styles.settingsSection}>
                <Text style={styles.settingsSectionTitle}>Account</Text>
                {[
                  { title: 'Edit Profile', icon: 'person-outline', subtitle: 'Update your profile information' },
                  { title: 'Privacy Settings', icon: 'shield-outline', subtitle: 'Manage your privacy' },
                  { title: 'Account Settings', icon: 'settings-outline', subtitle: 'Update your account' },
                  { title: 'Blocked Users', icon: 'ban-outline', subtitle: 'Manage blocked accounts' },
                ].map((setting, index) => (
                  <TouchableOpacity key={index} style={styles.settingItem} onPress={() => Alert.alert(setting.title, setting.subtitle)}>
                    <View style={styles.settingIcon}>
                      <Ionicons name={setting.icon} size={20} color="#10b981" />
                    </View>
                    <View style={styles.settingContent}>
                      <Text style={styles.settingTitle}>{setting.title}</Text>
                      <Text style={styles.settingSubtitle}>{setting.subtitle}</Text>
                    </View>
                    <Ionicons name="chevron-forward" size={16} color="#666" />
                  </TouchableOpacity>
                ))}
              </View>

              {/* Notifications Section */}
              <View style={styles.settingsSection}>
                <Text style={styles.settingsSectionTitle}>Notifications</Text>
                {[
                  { title: 'Push Notifications', icon: 'notifications-outline', subtitle: 'Manage push notifications', toggle: true },
                  { title: 'Email Notifications', icon: 'mail-outline', subtitle: 'Manage email alerts', toggle: true },
                  { title: 'SMS Notifications', icon: 'chatbubble-outline', subtitle: 'Manage SMS alerts', toggle: false },
                ].map((setting, index) => (
                  <TouchableOpacity key={index} style={styles.settingItem} onPress={() => Alert.alert('🔔 ' + setting.title, `${setting.title} is ${setting.toggle ? 'enabled' : 'disabled'}`)}>
                    <View style={styles.settingIcon}>
                      <Ionicons name={setting.icon} size={20} color="#10b981" />
                    </View>
                    <View style={styles.settingContent}>
                      <Text style={styles.settingTitle}>{setting.title}</Text>
                      <Text style={styles.settingSubtitle}>{setting.subtitle}</Text>
                    </View>
                    <View style={[styles.toggleSwitch, setting.toggle && styles.toggleSwitchActive]}>
                      <View style={[styles.toggleKnob, setting.toggle && styles.toggleKnobActive]} />
                    </View>
                  </TouchableOpacity>
                ))}
              </View>

              {/* Content & Display Section */}
              <View style={styles.settingsSection}>
                <Text style={styles.settingsSectionTitle}>Content & Display</Text>
                {[
                  { title: 'Dark Mode', icon: 'moon-outline', subtitle: 'Always on', toggle: true },
                  { title: 'Auto-play Videos', icon: 'play-circle-outline', subtitle: 'Play videos automatically', toggle: true },
                  { title: 'Data Saver', icon: 'cellular-outline', subtitle: 'Reduce data usage', toggle: false },
                  { title: 'Language', icon: 'language-outline', subtitle: 'English', value: 'English' },
                ].map((setting, index) => (
                  <TouchableOpacity key={index} style={styles.settingItem} onPress={() => Alert.alert('⚙️ ' + setting.title, setting.subtitle)}>
                    <View style={styles.settingIcon}>
                      <Ionicons name={setting.icon} size={20} color="#10b981" />
                    </View>
                    <View style={styles.settingContent}>
                      <Text style={styles.settingTitle}>{setting.title}</Text>
                      <Text style={styles.settingSubtitle}>{setting.subtitle}</Text>
                    </View>
                    {setting.toggle !== undefined ? (
                      <View style={[styles.toggleSwitch, setting.toggle && styles.toggleSwitchActive]}>
                        <View style={[styles.toggleKnob, setting.toggle && styles.toggleKnobActive]} />
                      </View>
                    ) : (
                      <Ionicons name="chevron-forward" size={16} color="#666" />
                    )}
                  </TouchableOpacity>
                ))}
              </View>

              {/* Support Section */}
              <View style={styles.settingsSection}>
                <Text style={styles.settingsSectionTitle}>Support</Text>
                {[
                  { title: 'Help Center', icon: 'help-circle-outline', subtitle: 'Get help and support' },
                  { title: 'Report a Problem', icon: 'flag-outline', subtitle: 'Report issues or bugs' },
                  { title: 'Community Guidelines', icon: 'document-text-outline', subtitle: 'Read our guidelines' },
                  { title: 'Terms of Service', icon: 'document-outline', subtitle: 'Legal information' },
                ].map((setting, index) => (
                  <TouchableOpacity key={index} style={styles.settingItem} onPress={() => Alert.alert('🛠️ ' + setting.title, setting.subtitle)}>
                    <View style={styles.settingIcon}>
                      <Ionicons name={setting.icon} size={20} color="#10b981" />
                    </View>
                    <View style={styles.settingContent}>
                      <Text style={styles.settingTitle}>{setting.title}</Text>
                      <Text style={styles.settingSubtitle}>{setting.subtitle}</Text>
                    </View>
                    <Ionicons name="chevron-forward" size={16} color="#666" />
                  </TouchableOpacity>
                ))}
              </View>

              {/* About Section */}
              <View style={styles.settingsSection}>
                <Text style={styles.settingsSectionTitle}>About</Text>
                {[
                  { title: 'App Version', icon: 'information-circle-outline', subtitle: 'v2.1.0', value: 'v2.1.0' },
                  { title: 'Rate Us', icon: 'star-outline', subtitle: 'Rate Encore on the App Store' },
                  { title: 'Share App', icon: 'share-outline', subtitle: 'Share Encore with friends' },
                ].map((setting, index) => (
                  <TouchableOpacity key={index} style={styles.settingItem} onPress={() => {
                    if (setting.title === 'Rate Us') {
                      Alert.alert('⭐ Rate Encore', 'Thank you for rating us! This would open the App Store.');
                    } else if (setting.title === 'Share App') {
                      Alert.alert('📱 Share Encore', 'Sharing Encore with friends! This would open the share dialog.');
                    } else {
                      Alert.alert('ℹ️ ' + setting.title, setting.subtitle);
                    }
                  }}>
                    <View style={styles.settingIcon}>
                      <Ionicons name={setting.icon} size={20} color="#10b981" />
                    </View>
                    <View style={styles.settingContent}>
                      <Text style={styles.settingTitle}>{setting.title}</Text>
                      <Text style={styles.settingSubtitle}>{setting.subtitle}</Text>
                    </View>
                    {setting.value ? (
                      <Text style={styles.settingValue}>{setting.value}</Text>
                    ) : (
                      <Ionicons name="chevron-forward" size={16} color="#666" />
                    )}
                  </TouchableOpacity>
                ))}
              </View>

              {/* Logout Section */}
              <View style={styles.settingsSection}>
                <TouchableOpacity style={[styles.settingItem, styles.logoutItem]} onPress={() => {
                  Alert.alert(
                    '🚪 Log Out',
                    'Are you sure you want to log out?',
                    [
                      { text: 'Cancel', style: 'cancel' },
                      { text: 'Log Out', style: 'destructive', onPress: () => Alert.alert('👋 Logged Out', 'You have been logged out successfully!') }
                    ]
                  );
                }}>
                  <View style={styles.settingIcon}>
                    <Ionicons name="log-out-outline" size={20} color="#ef4444" />
                  </View>
                  <View style={styles.settingContent}>
                    <Text style={[styles.settingTitle, styles.logoutText]}>Log Out</Text>
                    <Text style={styles.settingSubtitle}>Sign out of your account</Text>
                  </View>
                </TouchableOpacity>
              </View>

              <View style={styles.settingsFooter}>
                <Text style={styles.footerText}>Encore Music App</Text>
                <Text style={styles.footerSubtext}>Made with ❤️ for music lovers</Text>
              </View>
            </ScrollView>
          </View>
        </View>
      )}

      {/* Floating Action Button */}
      <TouchableOpacity 
        style={styles.fab}
        onPress={handleCreatePost}
        activeOpacity={0.8}
      >
        <LinearGradient
          colors={['#10b981', '#059669']}
          style={styles.fabGradient}
        >
          <Ionicons name="add" size={32} color="#fff" />
        </LinearGradient>
      </TouchableOpacity>

      {/* Bottom Tab Bar */}
      <View style={styles.tabBar}>
        {[
          { name: 'Home', icon: 'home-outline' },
          { name: 'Discover', icon: 'search-outline' },
          { name: 'Community', icon: 'people-outline' },
          { name: 'Encore Points', icon: 'person-outline' },
          { name: 'Profile', icon: 'menu-outline' },
        ].map((tab) => (
          <TouchableOpacity
            key={tab.name}
            style={[styles.tabItem, currentTab === tab.name && styles.activeTab]}
            onPress={() => handleTabChange(tab.name)}
          >
            <Ionicons 
              name={tab.icon} 
              size={24} 
              color={currentTab === tab.name ? '#10b981' : '#666'} 
            />
            <Text style={[styles.tabLabel, currentTab === tab.name && styles.activeTabLabel]}>
              {tab.name === 'Encore Points' ? 'Points' : tab.name}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Create Post Modal */}
      <Modal
        visible={showCreatePostModal}
        animationType="slide"
        presentationStyle="pageSheet"
        onRequestClose={() => setShowCreatePostModal(false)}
      >
        <SafeAreaView style={styles.createPostModal}>
          <View style={styles.createPostHeader}>
            <TouchableOpacity 
              style={styles.createPostClose}
              onPress={() => setShowCreatePostModal(false)}
            >
              <Ionicons name="close" size={24} color="#fff" />
            </TouchableOpacity>
          </View>

          <View style={styles.createPostContent}>
            {/* Create Post Option */}
            <TouchableOpacity 
              style={styles.createPostOption}
              onPress={() => handleCreatePostOption('photo')}
              activeOpacity={0.8}
            >
              <View style={styles.createPostIcon}>
                <Ionicons name="camera-outline" size={32} color="#fff" />
              </View>
              <Text style={styles.createPostTitle}>Create Post</Text>
            </TouchableOpacity>

            {/* Friend Zone Option */}
            <TouchableOpacity 
              style={styles.createPostOption}
              onPress={() => handleCreatePostOption('friend')}
              activeOpacity={0.8}
            >
              <View style={styles.createPostIcon}>
                <Ionicons name="person-add-outline" size={32} color="#fff" />
              </View>
              <Text style={styles.createPostTitle}>Friend Zone</Text>
            </TouchableOpacity>

            {/* Reels Option */}
            <TouchableOpacity 
              style={styles.createPostOption}
              onPress={() => handleCreatePostOption('reel')}
              activeOpacity={0.8}
            >
              <View style={styles.createPostIcon}>
                <Ionicons name="videocam-outline" size={32} color="#fff" />
              </View>
              <Text style={styles.createPostTitle}>Reels</Text>
              <View style={styles.reelPreview}>
                <View style={styles.reelBar} />
                <View style={styles.reelBar} />
                <View style={styles.reelBar} />
              </View>
            </TouchableOpacity>

            {/* Community Option */}
            <TouchableOpacity 
              style={styles.createPostOption}
              onPress={() => handleCreatePostOption('community')}
              activeOpacity={0.8}
            >
              <View style={styles.createPostIcon}>
                <Ionicons name="people-outline" size={32} color="#fff" />
              </View>
              <Text style={styles.createPostTitle}>Community</Text>
            </TouchableOpacity>
          </View>
        </SafeAreaView>
      </Modal>

      {/* Video Upload Modal */}
      <Modal
        visible={showVideoUploadModal}
        animationType="slide"
        presentationStyle="fullScreen"
        onRequestClose={() => setShowVideoUploadModal(false)}
      >
        <View style={styles.videoUploadModal}>
          <SafeAreaView style={styles.videoUploadHeader}>
            <TouchableOpacity 
              style={styles.videoUploadClose}
              onPress={() => setShowVideoUploadModal(false)}
            >
              <Ionicons name="close" size={24} color="#fff" />
            </TouchableOpacity>
            <Text style={styles.videoUploadTitle}>Create Reel</Text>
            <TouchableOpacity 
              style={styles.videoUploadNext}
              onPress={handleVideoUpload}
            >
              <Text style={styles.videoUploadNextText}>Next</Text>
            </TouchableOpacity>
          </SafeAreaView>

          <View style={styles.videoUploadContent}>
            {/* Camera Preview Area */}
            <View style={styles.cameraPreview}>
              <View style={styles.cameraPlaceholder}>
                <Ionicons name="videocam-outline" size={64} color="#666" />
                <Text style={styles.cameraPlaceholderText}>Tap to record</Text>
              </View>
            </View>

            {/* Recording Controls */}
            <View style={styles.recordingControls}>
              <TouchableOpacity style={styles.flipCameraButton}>
                <Ionicons name="camera-reverse-outline" size={24} color="#fff" />
              </TouchableOpacity>
              
              <TouchableOpacity style={styles.recordButton}>
                <View style={styles.recordButtonInner} />
              </TouchableOpacity>
              
              <TouchableOpacity style={styles.galleryButton}>
                <Ionicons name="images-outline" size={24} color="#fff" />
              </TouchableOpacity>
            </View>

            {/* Recording Options */}
            <View style={styles.recordingOptions}>
              <TouchableOpacity style={styles.recordingOption}>
                <Text style={styles.recordingOptionText}>15s</Text>
              </TouchableOpacity>
              <TouchableOpacity style={[styles.recordingOption, styles.recordingOptionActive]}>
                <Text style={[styles.recordingOptionText, styles.recordingOptionActiveText]}>30s</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.recordingOption}>
                <Text style={styles.recordingOptionText}>60s</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* Camera Screen */}
      {showCameraScreen && (
        <Modal
          visible={showCameraScreen}
          animationType="slide"
          presentationStyle="fullScreen"
          onRequestClose={() => setShowCameraScreen(false)}
        >
          <CameraScreen
            onClose={() => setShowCameraScreen(false)}
            onCapture={handleCameraCapture}
            onMediaCaptured={handleMediaCaptured}
          />
        </Modal>
      )}

      {/* Post Creation Screen */}
      {showPostCreation && (
        <Modal
          visible={showPostCreation}
          animationType="slide"
          presentationStyle="fullScreen"
          onRequestClose={() => setShowPostCreation(false)}
        >
          <PostCreationScreen
            route={{ params: { media: capturedMedia } }}
            onClose={() => setShowPostCreation(false)}
            onPostCreated={handlePostCreated}
          />
        </Modal>
      )}
      </View>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  app: {
    flex: 1,
    backgroundColor: '#000',
  },
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  header: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 1000,
  },
  headerGradient: {
    paddingHorizontal: 16,
    paddingTop: 8,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#333',
  },
  headerContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  headerTitle: {
    color: '#fff',
    fontSize: 28,
    fontWeight: 'bold',
  },
  headerActions: {
    flexDirection: 'row',
    gap: 16,
  },
  headerButton: {
    padding: 4,
    position: 'relative',
  },
  badge: {
    position: 'absolute',
    top: -2,
    right: -2,
    backgroundColor: '#ff3040',
    borderRadius: 10,
    minWidth: 20,
    height: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  badgeCount: {
    color: '#fff',
    fontSize: 12,
    fontWeight: 'bold',
  },

  // Professional Discover Screen Styles
  discoverHeaderPro: {
    paddingHorizontal: 24,
    paddingTop: 50,
    paddingBottom: 24,
    backgroundColor: '#000',
    borderBottomWidth: 1,
    borderBottomColor: '#1a1a1a',
  },
  headerTopRowPro: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 24,
  },
  discoverTitlePro: {
    color: '#fff',
    fontSize: 28,
    fontWeight: '700',
    letterSpacing: -0.5,
  },
  discoverSubtitlePro: {
    color: '#888',
    fontSize: 14,
    marginTop: 4,
  },
  filterButtonPro: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#1a1a1a',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#333',
  },
  searchBarPro: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1a1a1a',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 14,
    gap: 12,
    borderWidth: 1,
    borderColor: '#333',
  },
  searchInputPro: {
    flex: 1,
    color: '#fff',
    fontSize: 15,
  },
  micButtonPro: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: '#10b981' + '15',
    justifyContent: 'center',
    alignItems: 'center',
  },
  discoverContentPro: {
    flex: 1,
    backgroundColor: '#000',
  },
  


  // Professional Section Styles
  sectionHeaderPro: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  sectionTitlePro: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '600',
    letterSpacing: -0.3,
  },
  viewAllTextPro: {
    color: '#10b981',
    fontSize: 14,
    fontWeight: '500',
  },

  // Professional Featured Section
  featuredSectionPro: {
    paddingHorizontal: 24,
    paddingVertical: 20,
  },
  featuredCardPro: {
    borderRadius: 16,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  featuredGradientPro: {
    padding: 20,
    minHeight: 120,
    justifyContent: 'space-between',
  },
  featuredContentPro: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  featuredTextPro: {
    flex: 1,
  },
  featuredTitlePro: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
  },
  featuredSubtitlePro: {
    color: '#ccc',
    fontSize: 13,
    marginBottom: 8,
  },
  featuredStatsPro: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  featuredStatsTextPro: {
    color: '#888',
    fontSize: 12,
  },
  playButtonPro: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(255,255,255,0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 16,
  },
  featuredArtPro: {
    position: 'absolute',
    top: 16,
    right: 16,
  },
  featuredArtGradient: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  featuredCard: {
    borderRadius: 20,
    overflow: 'hidden',
  },
  featuredGradient: {
    padding: 20,
    flexDirection: 'row',
    alignItems: 'center',
  },
  featuredContent: {
    flex: 1,
  },
  featuredTitle: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  featuredSubtitle: {
    color: '#fff',
    fontSize: 14,
    opacity: 0.8,
    marginBottom: 12,
  },
  playButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.2)',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    alignSelf: 'flex-start',
    gap: 6,
  },
  playButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
  },
  featuredArt: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: 'rgba(255,255,255,0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  featuredEmoji: {
    fontSize: 24,
  },

  // Professional Genre Section
  genreSectionPro: {
    paddingHorizontal: 24,
    paddingVertical: 20,
  },
  genreGridPro: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  genreCardPro: {
    width: '47%',
    borderRadius: 12,
    overflow: 'hidden',
  },
  genreGradientPro: {
    padding: 16,
    minHeight: 100,
    justifyContent: 'space-between',
  },
  genreIconPro: {
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  genreNamePro: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 4,
  },
  genreTracksPro: {
    color: '#888',
    fontSize: 11,
  },

  // Professional Artists Section
  artistsSectionPro: {
    paddingVertical: 20,
    marginBottom: 24,
  },
  artistsScrollPro: {
    paddingLeft: 24,
  },
  artistCardPro: {
    backgroundColor: '#1a1a1a',
    borderRadius: 12,
    padding: 16,
    marginRight: 16,
    width: 160,
    borderWidth: 1,
    borderColor: '#333',
  },
  artistAvatarPro: {
    alignItems: 'center',
    marginBottom: 12,
    position: 'relative',
  },
  artistAvatarGradient: {
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
  },
  artistInitialPro: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  verifiedBadgePro: {
    position: 'absolute',
    bottom: -2,
    right: 12,
    backgroundColor: '#000',
    borderRadius: 8,
    padding: 1,
  },
  artistInfoPro: {
    alignItems: 'center',
    marginBottom: 12,
  },
  artistNamePro: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
    textAlign: 'center',
    marginBottom: 2,
  },
  artistGenrePro: {
    color: '#10b981',
    fontSize: 11,
    fontWeight: '500',
    marginBottom: 4,
  },
  artistFollowersPro: {
    color: '#888',
    fontSize: 11,
  },
  followBtnPro: {
    backgroundColor: '#10b981',
    paddingHorizontal: 20,
    paddingVertical: 8,
    borderRadius: 20,
    alignSelf: 'center',
  },
  followBtnTextPro: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '600',
  },

  // Recent Section
  recentSection: {
    paddingHorizontal: 20,
    marginBottom: 24,
  },
  recentList: {
    gap: 12,
  },
  recentItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
    backgroundColor: '#111',
    borderRadius: 12,
  },
  recentIcon: {
    marginRight: 12,
  },
  recentInfo: {
    flex: 1,
  },
  recentQuery: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '500',
  },
  recentType: {
    color: '#666',
    fontSize: 12,
  },
  recentClose: {
    padding: 4,
  },
  createButton: {
    backgroundColor: '#10b981',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
  },
  createButtonText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 14,
  },
  comingSoon: {
    color: '#666',
    fontSize: 16,
    textAlign: 'center',
    marginTop: 100,
  },

  // Stories Styles

  feedContainer: {
    flex: 1,
    marginTop: 110,
  },
  feed: {
    flex: 1,
    paddingBottom: 100, // Account for tab bar
  },


  // Load More Styles
  loadMoreContainer: {
    padding: 20,
    alignItems: 'center',
  },
  loadMoreButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 24,
    backgroundColor: '#111',
    borderRadius: 24,
    gap: 8,
  },
  loadMoreText: {
    color: '#10b981',
    fontSize: 14,
    fontWeight: '500',
  },

  // FAB Styles
  fab: {
    position: 'absolute',
    bottom: 140,
    right: 20,
    elevation: 10,
    shadowColor: '#10b981',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.4,
    shadowRadius: 12,
    zIndex: 1000,
  },
  fabGradient: {
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
  },

  // Wallet Styles
  walletHeader: {
    padding: 30,
    alignItems: 'center',
    marginBottom: 20,
  },
  walletTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 20,
  },
  balanceContainer: {
    alignItems: 'center',
    marginBottom: 20,
  },
  balanceLabel: {
    fontSize: 16,
    color: '#fff',
    opacity: 0.8,
  },
  balanceAmount: {
    fontSize: 48,
    fontWeight: 'bold',
    color: '#fff',
    marginVertical: 8,
  },
  balanceSubtext: {
    fontSize: 16,
    color: '#fff',
    opacity: 0.8,
  },
  purchaseButton: {
    backgroundColor: 'rgba(255,255,255,0.2)',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 25,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.3)',
  },
  purchaseButtonText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 16,
  },

  // Profile Styles
  profileHeader: {
    alignItems: 'center',
    paddingTop: 60,
    paddingHorizontal: 20,
    paddingBottom: 30,
  },
  profileAvatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  profileImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
  },
  displayName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 4,
  },
  username: {
    fontSize: 16,
    color: '#10b981',
    marginBottom: 12,
  },
  bio: {
    fontSize: 16,
    color: '#fff',
    textAlign: 'center',
    marginBottom: 20,
    lineHeight: 22,
  },
  statsContainer: {
    flexDirection: 'row',
    marginBottom: 24,
  },
  statItem: {
    alignItems: 'center',
    marginHorizontal: 20,
  },
  statNumber: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#fff',
  },
  statLabel: {
    fontSize: 14,
    color: '#666',
    marginTop: 4,
  },
  editButton: {
    backgroundColor: '#10b981',
    paddingHorizontal: 32,
    paddingVertical: 12,
    borderRadius: 25,
  },
  editButtonText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 16,
  },
  postsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: 2,
  },
  gridPost: {
    width: '33.33%',
    aspectRatio: 1,
    padding: 2,
  },
  gridPostImage: {
    width: '100%',
    height: '100%',
    borderRadius: 4,
  },

  // Modal Styles
  modalOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.8)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1000,
  },
  fullScreenOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: '#000',
    zIndex: 1000,
  },
  commentsModal: {
    backgroundColor: '#111',
    width: '90%',
    maxHeight: '80%',
    borderRadius: 20,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#333',
  },
  userProfileModal: {
    backgroundColor: '#111',
    width: '90%',
    maxHeight: '80%',
    borderRadius: 20,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#333',
  },
  purchaseModal: {
    backgroundColor: '#111',
    width: '90%',
    maxHeight: '80%',
    borderRadius: 20,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#333',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#333',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
  },
  closeButton: {
    fontSize: 24,
    color: '#10b981',
  },

  // Comments Modal Styles
  commentsList: {
    maxHeight: 300,
    padding: 20,
  },
  commentItem: {
    marginBottom: 16,
    padding: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#333',
  },
  commentHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  commentAvatar: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: 'rgba(16,185,129,0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  commentAvatarText: {
    fontSize: 14,
  },
  commentContent: {
    flex: 1,
  },
  commentUsername: {
    fontSize: 14,
    fontWeight: '600',
    color: '#10b981',
    marginBottom: 4,
  },
  commentText: {
    fontSize: 14,
    color: '#fff',
    lineHeight: 20,
    marginBottom: 8,
  },
  commentMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  commentLikeButton: {
    padding: 4,
  },
  noCommentsContainer: {
    padding: 40,
    alignItems: 'center',
  },
  noCommentsText: {
    color: '#666',
    fontSize: 14,
    textAlign: 'center',
  },
  commentTime: {
    fontSize: 12,
    color: '#666',
    marginRight: 16,
  },
  commentLikes: {
    fontSize: 12,
    color: '#666',
  },
  commentInput: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    padding: 20,
    borderTopWidth: 1,
    borderTopColor: '#333',
  },
  commentTextInput: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#333',
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 12,
    marginRight: 12,
    maxHeight: 100,
    backgroundColor: '#000',
    color: '#fff',
  },
  sendButton: {
    backgroundColor: '#10b981',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 20,
  },
  sendButtonText: {
    color: '#fff',
    fontWeight: '600',
  },

  // User Profile Modal Styles
  userProfileContent: {
    padding: 20,
    alignItems: 'center',
  },
  modalAvatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    marginBottom: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalDisplayName: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 4,
  },
  modalUsername: {
    fontSize: 16,
    color: '#10b981',
    marginBottom: 12,
  },
  modalBio: {
    fontSize: 14,
    color: '#fff',
    textAlign: 'center',
    marginBottom: 20,
    lineHeight: 20,
  },
  modalStats: {
    flexDirection: 'row',
    marginBottom: 24,
  },
  modalStatItem: {
    alignItems: 'center',
    marginHorizontal: 20,
  },
  modalStatNumber: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
  },
  modalStatLabel: {
    fontSize: 12,
    color: '#666',
    marginTop: 4,
  },
  followButton: {
    backgroundColor: '#10b981',
    paddingHorizontal: 32,
    paddingVertical: 12,
    borderRadius: 25,
  },
  followButtonText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 16,
  },

  // Purchase Modal Styles
  packagesList: {
    padding: 20,
  },
  packageCard: {
    backgroundColor: '#222',
    padding: 20,
    borderRadius: 12,
    marginBottom: 16,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: 'transparent',
  },
  popularPackage: {
    borderColor: '#10b981',
    backgroundColor: '#0a2e1a',
  },
  popularBadge: {
    position: 'absolute',
    top: -8,
    backgroundColor: '#10b981',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
  },
  popularText: {
    color: '#fff',
    fontSize: 10,
    fontWeight: 'bold',
  },
  packagePoints: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 4,
  },
  packagePrice: {
    fontSize: 18,
    color: '#10b981',
    fontWeight: '600',
    marginBottom: 4,
  },
  packageBonus: {
    fontSize: 12,
    color: '#10b981',
    fontWeight: '600',
  },

  // Notifications Styles
  notificationsModal: {
    backgroundColor: '#111',
    width: '90%',
    maxHeight: '80%',
    borderRadius: 20,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#333',
  },
  notificationsList: {
    maxHeight: 400,
    padding: 20,
  },
  notificationItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#333',
  },
  notificationAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  notificationContent: {
    flex: 1,
  },
  notificationText: {
    color: '#fff',
    fontSize: 14,
    lineHeight: 20,
  },
  notificationUser: {
    fontWeight: '600',
    color: '#10b981',
  },
  notificationTime: {
    color: '#666',
    fontSize: 12,
    marginTop: 4,
  },
  unreadDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#10b981',
  },

  // Chats Styles
  chatsModal: {
    backgroundColor: '#000',
    width: '100%',
    height: '100%',
    borderRadius: 0,
    overflow: 'hidden',
  },
  chatsList: {
    flex: 1,
    padding: 20,
    paddingTop: 60,
  },
  chatItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#333',
  },
  chatAvatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  chatContent: {
    flex: 1,
  },
  chatHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  chatUser: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  chatTime: {
    color: '#666',
    fontSize: 12,
  },
  chatMessage: {
    color: '#ccc',
    fontSize: 14,
  },
  unreadBadge: {
    backgroundColor: '#10b981',
    borderRadius: 12,
    minWidth: 24,
    height: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
  unreadCount: {
    color: '#fff',
    fontSize: 12,
    fontWeight: 'bold',
  },

  // Individual Chat Styles
  chatModal: {
    backgroundColor: '#000',
    width: '100%',
    height: '100%',
    borderRadius: 0,
    overflow: 'hidden',
  },
  messagesList: {
    flex: 1,
    padding: 20,
    paddingTop: 60,
  },
  messageItem: {
    marginBottom: 12,
    maxWidth: '80%',
  },
  myMessage: {
    alignSelf: 'flex-end',
  },
  theirMessage: {
    alignSelf: 'flex-start',
  },
  messageText: {
    padding: 12,
    borderRadius: 18,
    fontSize: 14,
    lineHeight: 20,
  },
  myMessageText: {
    backgroundColor: '#10b981',
    color: '#fff',
  },
  theirMessageText: {
    backgroundColor: '#333',
    color: '#fff',
  },
  messageTime: {
    color: '#666',
    fontSize: 11,
    marginTop: 4,
    textAlign: 'center',
  },
  messageInput: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    padding: 20,
    borderTopWidth: 1,
    borderTopColor: '#333',
  },
  messageTextInput: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#333',
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 12,
    marginRight: 12,
    maxHeight: 100,
    backgroundColor: '#000',
    color: '#fff',
  },
  sendMessageButton: {
    backgroundColor: '#10b981',
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },

  // Full Screen Modal Styles
  fullScreenHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 50,
    paddingBottom: 15,
    backgroundColor: '#000',
    borderBottomWidth: 1,
    borderBottomColor: '#333',
  },
  fullScreenTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
    flex: 1,
    textAlign: 'center',
  },
  backButton: {
    padding: 5,
  },
  headerAction: {
    padding: 5,
  },
  headerSpacer: {
    width: 34,
  },

  // Tab Bar Styles
  tabBar: {
    flexDirection: 'row',
    backgroundColor: '#000',
    borderTopWidth: 1,
    borderTopColor: '#333',
    paddingBottom: 34,
    paddingTop: 12,
    height: 90,
  },
  tabItem: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  activeTab: {
    // Active tab styling handled by icon/label colors
  },
  tabIcon: {
    fontSize: 24,
    marginBottom: 4,
    color: '#666',
  },
  activeTabIcon: {
    color: '#10b981',
  },
  tabLabel: {
    fontSize: 10,
    color: '#666',
    fontWeight: '500',
  },
  activeTabLabel: {
    color: '#10b981',
    fontWeight: '600',
  },

  // Discover Screen Styles
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 16,
    paddingHorizontal: 16,
  },
  horizontalScroll: {
    paddingLeft: 16,
  },
  trendingCard: {
    width: 140,
    marginRight: 12,
    backgroundColor: 'rgba(255,255,255,0.1)',
    borderRadius: 12,
    padding: 12,
  },
  trackImage: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: 'rgba(255,255,255,0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'center',
    marginBottom: 8,
  },
  trackEmoji: {
    fontSize: 24,
  },
  trackTitle: {
    color: '#fff',
    fontSize: 14,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 4,
  },
  trackArtist: {
    color: '#ccc',
    fontSize: 12,
    textAlign: 'center',
    marginBottom: 4,
  },
  trackPlays: {
    color: '#10b981',
    fontSize: 11,
    textAlign: 'center',
  },
  genreGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: 16,
    gap: 12,
  },
  genreCard: {
    width: '30%',
    aspectRatio: 1,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  genreEmoji: {
    fontSize: 24,
    marginBottom: 8,
  },
  genreName: {
    color: '#fff',
    fontSize: 12,
    fontWeight: 'bold',
  },
  artistCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.1)',
    marginHorizontal: 16,
    marginBottom: 12,
    padding: 16,
    borderRadius: 12,
  },
  artistAvatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#10b981',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  artistInitial: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  artistInfo: {
    flex: 1,
  },
  artistNameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  artistName: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
    marginRight: 6,
  },
  artistGenre: {
    color: '#ccc',
    fontSize: 14,
    marginBottom: 2,
  },
  artistFollowers: {
    color: '#666',
    fontSize: 12,
  },
  followButton: {
    backgroundColor: '#10b981',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
  },
  followButtonText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: 'bold',
  },

  // Community Screen Styles
  communityStats: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    marginBottom: 24,
    gap: 12,
  },
  statCard: {
    flex: 1,
    backgroundColor: 'rgba(255,255,255,0.1)',
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  statNumber: {
    color: '#10b981',
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  statLabel: {
    color: '#ccc',
    fontSize: 12,
    textAlign: 'center',
  },
  eventCard: {
    backgroundColor: 'rgba(255,255,255,0.1)',
    marginHorizontal: 16,
    marginBottom: 16,
    padding: 16,
    borderRadius: 12,
  },
  eventHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  eventTypeTag: {
    backgroundColor: '#10b981',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  eventTypeText: {
    color: '#fff',
    fontSize: 10,
    fontWeight: 'bold',
  },
  eventDate: {
    color: '#ccc',
    fontSize: 12,
  },
  eventTitle: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  eventHost: {
    color: '#10b981',
    fontSize: 14,
    marginBottom: 12,
  },
  eventDetails: {
    marginBottom: 16,
  },
  eventDetailItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 6,
  },
  eventDetailText: {
    color: '#ccc',
    fontSize: 12,
    marginLeft: 8,
  },
  joinEventButton: {
    backgroundColor: '#10b981',
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  joinEventText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: 'bold',
  },
  discussionCard: {
    backgroundColor: 'rgba(255,255,255,0.1)',
    marginHorizontal: 16,
    marginBottom: 12,
    padding: 16,
    borderRadius: 12,
  },
  discussionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  discussionCategory: {
    color: '#10b981',
    fontSize: 12,
    fontWeight: 'bold',
  },
  discussionTime: {
    color: '#666',
    fontSize: 11,
  },
  discussionTitle: {
    color: '#fff',
    fontSize: 14,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  discussionFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  discussionAuthor: {
    color: '#ccc',
    fontSize: 12,
  },
  discussionReplies: {
    color: '#666',
    fontSize: 12,
  },

  // Profile Screen Styles
  profileTabs: {
    flexDirection: 'row',
    backgroundColor: 'rgba(255,255,255,0.1)',
    marginHorizontal: 16,
    marginBottom: 24,
    borderRadius: 12,
    padding: 4,
  },
  profileTab: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    borderRadius: 8,
  },
  activeProfileTab: {
    backgroundColor: 'rgba(16,185,129,0.2)',
  },
  profileTabText: {
    color: '#666',
    fontSize: 12,
    marginLeft: 6,
  },
  activeProfileTabText: {
    color: '#10b981',
    fontWeight: 'bold',
  },
  activityItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.1)',
    marginHorizontal: 16,
    marginBottom: 8,
    padding: 12,
    borderRadius: 8,
  },
  activityIcon: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: 'rgba(16,185,129,0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  activityContent: {
    flex: 1,
  },
  activityText: {
    color: '#fff',
    fontSize: 14,
    marginBottom: 2,
  },
  activityTime: {
    color: '#666',
    fontSize: 11,
  },
  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.1)',
    marginHorizontal: 16,
    marginBottom: 8,
    padding: 16,
    borderRadius: 12,
  },
  settingIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255,255,255,0.1)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  settingContent: {
    flex: 1,
  },
  settingTitle: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 2,
  },
  settingSubtitle: {
    color: '#ccc',
    fontSize: 12,
  },

  // Profile Top Header Styles
  profileTopHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingTop: 50,
    paddingBottom: 16,
    backgroundColor: 'rgba(0,0,0,0.95)',
  },
  profileScreenTitle: {
    color: '#fff',
    fontSize: 20,
    fontWeight: 'bold',
  },
  settingsIconButton: {
    padding: 8,
    borderRadius: 20,
    backgroundColor: 'rgba(255,255,255,0.1)',
  },

  // Settings Modal Styles
  settingsModal: {
    flex: 1,
    backgroundColor: '#000',
  },
  settingsContent: {
    flex: 1,
  },
  settingsSection: {
    marginBottom: 32,
  },
  settingsSectionTitle: {
    color: '#10b981',
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 16,
    paddingHorizontal: 16,
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  toggleSwitch: {
    width: 44,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#333',
    justifyContent: 'center',
    paddingHorizontal: 2,
  },
  toggleSwitchActive: {
    backgroundColor: '#10b981',
  },
  toggleKnob: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: '#fff',
    alignSelf: 'flex-start',
  },
  toggleKnobActive: {
    alignSelf: 'flex-end',
  },
  settingValue: {
    color: '#666',
    fontSize: 14,
  },
  logoutItem: {
    borderTopWidth: 1,
    borderTopColor: 'rgba(239,68,68,0.2)',
    marginTop: 16,
    paddingTop: 16,
  },
  logoutText: {
    color: '#ef4444',
  },
  settingsFooter: {
    alignItems: 'center',
    paddingVertical: 32,
    paddingHorizontal: 16,
  },
  footerText: {
    color: '#10b981',
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  footerSubtext: {
    color: '#666',
    fontSize: 12,
  },

  // New Wallet Screen Styles
  walletContainer: {
    flex: 1,
    backgroundColor: '#000',
    position: 'relative',
  },
  starryBackground: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 0,
  },
  star: {
    position: 'absolute',
    width: 2,
    height: 2,
    backgroundColor: '#10b981',
    borderRadius: 1,
    opacity: 0.8,
  },
  walletContent: {
    flex: 1,
    zIndex: 1,
  },
  walletHeaderNew: {
    paddingTop: 60,
    paddingHorizontal: 24,
    paddingBottom: 40,
    alignItems: 'center',
  },
  walletTitleNew: {
    color: '#ccc',
    fontSize: 18,
    textAlign: 'center',
    lineHeight: 24,
  },
  balanceSection: {
    alignItems: 'center',
    marginBottom: 40,
    paddingHorizontal: 24,
  },
  balanceLabelNew: {
    color: '#999',
    fontSize: 16,
    marginBottom: 12,
  },
  balanceAmountNew: {
    color: '#fff',
    fontSize: 48,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  balancePointsNew: {
    color: '#10b981',
    fontSize: 14,
    opacity: 0.8,
  },
  actionButtons: {
    flexDirection: 'row',
    paddingHorizontal: 24,
    marginBottom: 48,
    gap: 16,
  },
  addFundsButton: {
    flex: 1,
    backgroundColor: '#10b981',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    borderRadius: 12,
    gap: 8,
  },
  addFundsText: {
    color: '#000',
    fontSize: 16,
    fontWeight: 'bold',
  },
  withdrawButton: {
    flex: 1,
    backgroundColor: '#374151',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    borderRadius: 12,
    gap: 8,
  },
  withdrawText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  bonusSection: {
    paddingHorizontal: 24,
    marginBottom: 40,
  },
  bonusTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
    gap: 8,
  },
  bonusTitle: {
    color: '#fff',
    fontSize: 20,
    fontWeight: 'bold',
  },
  tiersList: {
    gap: 12,
  },
  tierCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.05)',
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
  },
  tierCardActive: {
    backgroundColor: 'rgba(16,185,129,0.1)',
    borderColor: '#10b981',
  },
  tierInfo: {
    flex: 1,
  },
  tierName: {
    color: '#ccc',
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  tierNameActive: {
    color: '#10b981',
  },
  tierRequirement: {
    color: '#666',
    fontSize: 12,
  },
  tierBonus: {
    alignItems: 'center',
    marginRight: 12,
  },
  tierBonusText: {
    color: '#ccc',
    fontSize: 18,
    fontWeight: 'bold',
  },
  tierBonusActive: {
    color: '#10b981',
  },
  tierBonusLabel: {
    color: '#666',
    fontSize: 10,
  },
  tierBadge: {
    marginLeft: 8,
  },
  supportSection: {
    paddingHorizontal: 24,
    marginBottom: 40,
  },
  supportTitle: {
    color: '#fff',
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  supportSubtitle: {
    color: '#999',
    fontSize: 14,
    marginBottom: 20,
  },
  artistSupportList: {
    gap: 12,
  },
  artistSupportCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.05)',
    padding: 16,
    borderRadius: 12,
  },
  artistSupportAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(16,185,129,0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  artistSupportEmoji: {
    fontSize: 18,
  },
  artistSupportInfo: {
    flex: 1,
  },
  artistSupportName: {
    color: '#fff',
    fontSize: 14,
    fontWeight: 'bold',
    marginBottom: 2,
  },
  artistSupportTime: {
    color: '#666',
    fontSize: 12,
  },
  artistSupportAmount: {
    alignItems: 'flex-end',
  },
  artistSupportAmountText: {
    color: '#10b981',
    fontSize: 14,
    fontWeight: 'bold',
  },
  transactionsSection: {
    paddingHorizontal: 24,
    marginBottom: 40,
  },
  transactionsTitle: {
    color: '#fff',
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  transactionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.05)',
    padding: 16,
    borderRadius: 12,
    marginBottom: 8,
  },
  transactionIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255,255,255,0.1)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  transactionDetails: {
    flex: 1,
  },
  transactionDescription: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '500',
    marginBottom: 2,
  },
  transactionDate: {
    color: '#666',
    fontSize: 12,
  },
  transactionAmount: {
    fontSize: 14,
    fontWeight: 'bold',
  },
  walletFooter: {
    alignItems: 'center',
    paddingVertical: 32,
    paddingHorizontal: 24,
  },
  walletFooterText: {
    color: '#10b981',
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  walletFooterSubtext: {
    color: '#666',
    fontSize: 12,
    textAlign: 'center',
  },

  // Enhanced Community Screen Styles
  communityContainer: {
    flex: 1,
    backgroundColor: '#000',
  },
  communityHeaderGradient: {
    paddingTop: 50,
    paddingBottom: 20,
  },
  communityHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  communityHeaderContent: {
    flex: 1,
  },
  communityTitle: {
    color: '#fff',
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  communitySubtitle: {
    color: '#ccc',
    fontSize: 14,
    opacity: 0.8,
  },
  createEventButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(16,185,129,0.2)',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#10b981',
    gap: 6,
  },
  createEventText: {
    color: '#10b981',
    fontSize: 14,
    fontWeight: 'bold',
  },
  communityContent: {
    flex: 1,
  },
  liveActivityBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(239,68,68,0.1)',
    marginHorizontal: 16,
    marginBottom: 20,
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(239,68,68,0.3)',
  },
  liveBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    marginRight: 12,
    gap: 4,
  },
  liveIndicator: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#fff',
  },
  liveText: {
    color: '#fff',
    fontSize: 10,
    fontWeight: 'bold',
  },
  liveContent: {
    flex: 1,
  },
  liveTitle: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 2,
  },
  liveViewers: {
    color: '#ef4444',
    fontSize: 12,
  },
  joinLiveButton: {
    backgroundColor: '#ef4444',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 16,
  },
  joinLiveText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: 'bold',
  },

  communityStatsNew: {
    paddingHorizontal: 16,
    marginBottom: 32,
  },
  statsTitle: {
    color: '#fff',
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  statCardNew: {
    flex: 1,
    minWidth: '45%',
    backgroundColor: 'rgba(255,255,255,0.05)',
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  statIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  statNumberNew: {
    color: '#fff',
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  statLabelNew: {
    color: '#ccc',
    fontSize: 12,
    textAlign: 'center',
  },
  featuredSection: {
    marginBottom: 32,
  },
  sectionHeaderNew: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    marginBottom: 16,
  },
  sectionTitleNew: {
    color: '#fff',
    fontSize: 20,
    fontWeight: 'bold',
  },
  seeAllText: {
    color: '#10b981',
    fontSize: 14,
    fontWeight: '600',
  },
  eventsScroll: {
    paddingLeft: 16,
  },
  eventCardNew: {
    width: 280,
    backgroundColor: 'rgba(255,255,255,0.05)',
    borderRadius: 16,
    marginRight: 16,
    overflow: 'hidden',
  },
  eventGradient: {
    height: 120,
    justifyContent: 'space-between',
    padding: 16,
  },
  eventEmojiContainer: {
    alignSelf: 'flex-start',
  },
  eventEmoji: {
    fontSize: 32,
  },
  eventTypeTagNew: {
    alignSelf: 'flex-end',
    backgroundColor: 'rgba(255,255,255,0.2)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  eventTypeTextNew: {
    color: '#fff',
    fontSize: 10,
    fontWeight: 'bold',
  },
  eventContent: {
    padding: 16,
  },
  eventTitleNew: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  eventHostNew: {
    color: '#10b981',
    fontSize: 12,
    marginBottom: 12,
  },
  eventMetaNew: {
    flexDirection: 'row',
    gap: 16,
    marginBottom: 12,
  },
  eventMetaItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  eventMetaText: {
    color: '#ccc',
    fontSize: 12,
  },
  eventFooterNew: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  attendeesInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  attendeesText: {
    color: '#666',
    fontSize: 12,
  },
  joinButtonNew: {
    backgroundColor: '#10b981',
    paddingHorizontal: 16,
    paddingVertical: 6,
    borderRadius: 12,
  },
  joinButtonText: {
    color: '#000',
    fontSize: 12,
    fontWeight: 'bold',
  },
  discussionsSection: {
    paddingHorizontal: 16,
    marginBottom: 32,
  },
  discussionCardNew: {
    backgroundColor: 'rgba(255,255,255,0.05)',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    position: 'relative',
  },
  trendingBadge: {
    position: 'absolute',
    top: 12,
    right: 12,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(239,68,68,0.2)',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 8,
    gap: 2,
  },
  trendingText: {
    color: '#ef4444',
    fontSize: 10,
    fontWeight: 'bold',
  },
  discussionAuthorInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  discussionAvatar: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: 'rgba(16,185,129,0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  discussionAvatarEmoji: {
    fontSize: 16,
  },
  discussionAuthorName: {
    color: '#fff',
    fontSize: 14,
    fontWeight: 'bold',
    marginBottom: 2,
  },
  discussionCategoryContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  discussionCategoryDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
  },
  discussionCategoryNew: {
    fontSize: 11,
    fontWeight: '600',
  },
  discussionTimeNew: {
    color: '#666',
    fontSize: 11,
  },
  discussionTitleNew: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
    marginVertical: 12,
    lineHeight: 22,
  },
  discussionStats: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  discussionStat: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  discussionStatText: {
    color: '#666',
    fontSize: 12,
  },
  replyButton: {
    marginLeft: 'auto',
    backgroundColor: 'rgba(16,185,129,0.2)',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
  },
  replyButtonText: {
    color: '#10b981',
    fontSize: 11,
    fontWeight: 'bold',
  },
  guidelinesSection: {
    backgroundColor: 'rgba(16,185,129,0.1)',
    marginHorizontal: 16,
    marginBottom: 32,
    padding: 20,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: 'rgba(16,185,129,0.3)',
  },
  guidelinesTitle: {
    color: '#10b981',
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  guidelinesText: {
    color: '#ccc',
    fontSize: 14,
    lineHeight: 20,
    marginBottom: 16,
  },
  guidelinesButton: {
    backgroundColor: '#10b981',
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 8,
    alignSelf: 'flex-start',
  },
  guidelinesButtonText: {
    color: '#000',
    fontSize: 12,
    fontWeight: 'bold',
  },

  // Clean Community & Discovery Styles
  cleanHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingTop: 50,
    paddingBottom: 16,
    backgroundColor: 'rgba(0,0,0,0.95)',
  },
  createButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(16,185,129,0.1)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#10b981',
    gap: 4,
  },
  createButtonText: {
    color: '#10b981',
    fontSize: 12,
    fontWeight: 'bold',
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    marginBottom: 12,
  },
  viewAllText: {
    color: '#10b981',
    fontSize: 12,
    fontWeight: '600',
  },
  
  // Live Event Card
  liveEventCard: {
    backgroundColor: 'rgba(239,68,68,0.1)',
    marginHorizontal: 16,
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(239,68,68,0.3)',
    marginBottom: 8,
  },
  liveIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
    gap: 6,
  },
  liveDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#ef4444',
  },
  liveText: {
    color: '#ef4444',
    fontSize: 12,
    fontWeight: 'bold',
  },
  liveEventTitle: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  liveEventHost: {
    color: '#ccc',
    fontSize: 14,
    marginBottom: 12,
  },
  joinLiveButton: {
    backgroundColor: '#ef4444',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 8,
    alignSelf: 'flex-start',
  },
  joinLiveText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: 'bold',
  },

  // Event Cards
  eventCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.05)',
    marginHorizontal: 16,
    marginBottom: 8,
    padding: 16,
    borderRadius: 12,
  },
  eventInfo: {
    flex: 1,
  },
  eventTitle: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  eventHost: {
    color: '#10b981',
    fontSize: 12,
    marginBottom: 6,
  },
  eventMeta: {
    flexDirection: 'row',
    gap: 12,
  },
  eventDate: {
    color: '#ccc',
    fontSize: 12,
  },
  eventAttendees: {
    color: '#666',
    fontSize: 12,
  },
  joinButton: {
    backgroundColor: '#10b981',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
  },
  joinButtonText: {
    color: '#000',
    fontSize: 12,
    fontWeight: 'bold',
  },

  // Discussion Cards
  discussionCard: {
    backgroundColor: 'rgba(255,255,255,0.05)',
    marginHorizontal: 16,
    marginBottom: 8,
    padding: 16,
    borderRadius: 12,
  },
  discussionContent: {
    flex: 1,
  },
  discussionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  discussionCategory: {
    color: '#10b981',
    fontSize: 11,
    fontWeight: 'bold',
    textTransform: 'uppercase',
  },
  discussionTime: {
    color: '#666',
    fontSize: 11,
  },
  discussionTitle: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 8,
    lineHeight: 20,
  },
  discussionFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  discussionAuthor: {
    color: '#ccc',
    fontSize: 12,
  },
  discussionReplies: {
    color: '#666',
    fontSize: 12,
  },

  // Discovery Screen Styles
  searchIcon: {
    marginRight: 8,
  },
  
  // Track Cards
  trackCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.05)',
    marginHorizontal: 16,
    marginBottom: 8,
    padding: 12,
    borderRadius: 12,
  },
  trackImageContainer: {
    width: 50,
    height: 50,
    borderRadius: 8,
    backgroundColor: 'rgba(16,185,129,0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  trackInfo: {
    flex: 1,
  },
  trackTitle: {
    color: '#fff',
    fontSize: 14,
    fontWeight: 'bold',
    marginBottom: 2,
  },
  trackArtist: {
    color: '#ccc',
    fontSize: 12,
    marginBottom: 2,
  },
  trackStats: {
    color: '#666',
    fontSize: 11,
  },
  playButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: 'rgba(16,185,129,0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },

  // Release Cards
  releaseCard: {
    width: 120,
    marginRight: 12,
    backgroundColor: 'rgba(255,255,255,0.05)',
    borderRadius: 12,
    padding: 12,
  },
  releaseImage: {
    width: 60,
    height: 60,
    borderRadius: 8,
    backgroundColor: 'rgba(16,185,129,0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'center',
    marginBottom: 8,
  },
  releaseEmoji: {
    fontSize: 24,
  },
  releaseTitle: {
    color: '#fff',
    fontSize: 12,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 2,
  },
  releaseArtist: {
    color: '#ccc',
    fontSize: 11,
    textAlign: 'center',
    marginBottom: 4,
  },
  releaseDate: {
    color: '#10b981',
    fontSize: 10,
    textAlign: 'center',
  },

  // Artist Stats
  artistStats: {
    flexDirection: 'row',
    gap: 8,
  },
  artistGrowth: {
    color: '#10b981',
    fontSize: 11,
  },

  // Playlist Cards
  playlistCard: {
    width: 120,
    marginRight: 12,
    backgroundColor: 'rgba(255,255,255,0.05)',
    borderRadius: 12,
    padding: 12,
  },
  playlistImage: {
    width: 60,
    height: 60,
    borderRadius: 8,
    backgroundColor: 'rgba(16,185,129,0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'center',
    marginBottom: 8,
  },
  playlistEmoji: {
    fontSize: 24,
  },
  playlistName: {
    color: '#fff',
    fontSize: 12,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 2,
  },
  playlistInfo: {
    color: '#ccc',
    fontSize: 11,
    textAlign: 'center',
    marginBottom: 2,
  },
  playlistCurator: {
    color: '#666',
    fontSize: 10,
    textAlign: 'center',
  },

  // Loading & Error States
  loadingContainer: {
    padding: 20,
    alignItems: 'center',
  },
  loadingText: {
    color: '#666',
    fontSize: 14,
  },
  errorContainer: {
    padding: 20,
    alignItems: 'center',
  },
  errorText: {
    color: '#ef4444',
    fontSize: 14,
    textAlign: 'center',
  },
  retryButton: {
    backgroundColor: '#10b981',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
    marginTop: 12,
  },
  retryButtonText: {
    color: '#000',
    fontSize: 12,
    fontWeight: 'bold',
  },

  // Loading Screen Styles
  loadingScreen: {
    flex: 1,
    backgroundColor: '#000',
  },
  loadingGradient: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingContent: {
    alignItems: 'center',
  },
  loadingLogo: {
    fontSize: 60,
    marginBottom: 20,
  },
  loadingTitle: {
    color: '#10b981',
    fontSize: 32,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  loadingSubtitle: {
    color: '#ccc',
    fontSize: 16,
    marginBottom: 40,
    textAlign: 'center',
  },
  loadingIndicator: {
    flexDirection: 'row',
    gap: 8,
  },
  loadingDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#10b981',
    opacity: 0.3,
  },

  // New Community Screen Styles
  communityHeaderNew: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 50,
    paddingBottom: 20,
    backgroundColor: '#000',
  },
  communityTitleSection: {
    flex: 1,
  },
  communityTitleNew: {
    color: '#fff',
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 2,
  },
  communitySubtitleNew: {
    color: '#999',
    fontSize: 14,
  },
  communityHeaderActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  notificationButton: {
    position: 'relative',
    padding: 8,
  },
  notificationDot: {
    position: 'absolute',
    top: 6,
    right: 6,
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#ef4444',
  },
  createPostButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#10b981',
    justifyContent: 'center',
    alignItems: 'center',
  },
  communityScrollView: {
    flex: 1,
    backgroundColor: '#000',
  },
  
  // Quick Stats Banner
  quickStatsBanner: {
    marginHorizontal: 16,
    marginBottom: 24,
    borderRadius: 16,
    overflow: 'hidden',
  },
  statsGradient: {
    padding: 20,
  },
  quickStatsContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  quickStat: {
    alignItems: 'center',
    flex: 1,
  },
  quickStatNumber: {
    color: '#fff',
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  quickStatLabel: {
    color: 'rgba(255,255,255,0.9)',
    fontSize: 12,
    textAlign: 'center',
  },
  statDivider: {
    width: 1,
    height: 30,
    backgroundColor: 'rgba(255,255,255,0.3)',
    marginHorizontal: 16,
  },

  // Featured Live Section
  featuredLiveSection: {
    marginBottom: 32,
  },
  sectionTitleNew: {
    color: '#fff',
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 16,
    paddingHorizontal: 16,
  },
  featuredLiveCard: {
    marginHorizontal: 16,
    borderRadius: 16,
    overflow: 'hidden',
  },
  liveCardGradient: {
    padding: 20,
  },
  liveCardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  liveBadgeNew: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.2)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    gap: 4,
  },
  livePulse: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#fff',
  },
  liveTextNew: {
    color: '#fff',
    fontSize: 10,
    fontWeight: 'bold',
  },
  liveViewerCount: {
    color: 'rgba(255,255,255,0.9)',
    fontSize: 12,
  },
  liveSessionTitle: {
    color: '#fff',
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  liveSessionHost: {
    color: 'rgba(255,255,255,0.9)',
    fontSize: 16,
    marginBottom: 16,
  },
  joinLiveButtonNew: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.2)',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 20,
    alignSelf: 'flex-start',
    gap: 6,
  },
  joinLiveTextNew: {
    color: '#fff',
    fontSize: 14,
    fontWeight: 'bold',
  },

  // Community Spaces
  communitySpacesSection: {
    marginBottom: 32,
  },
  spacesScroll: {
    paddingLeft: 16,
  },
  spaceCard: {
    width: 140,
    marginRight: 12,
    borderRadius: 12,
    overflow: 'hidden',
  },
  spaceCardGradient: {
    padding: 16,
    height: 160,
    justifyContent: 'space-between',
  },
  spaceHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  spaceEmoji: {
    fontSize: 24,
  },
  activeSpaceDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#10b981',
  },
  spaceName: {
    color: '#fff',
    fontSize: 14,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  spaceMembers: {
    color: '#ccc',
    fontSize: 11,
    marginBottom: 12,
  },
  joinSpaceButton: {
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 12,
    alignSelf: 'flex-start',
  },
  joinSpaceText: {
    color: '#fff',
    fontSize: 11,
    fontWeight: 'bold',
  },

  // Trending Topics
  trendingTopicsSection: {
    marginBottom: 32,
  },
  sectionHeaderWithIcon: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    marginBottom: 16,
  },
  seeMoreButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  seeMoreText: {
    color: '#10b981',
    fontSize: 14,
    fontWeight: '600',
  },
  trendingTopicCard: {
    backgroundColor: 'rgba(255,255,255,0.05)',
    marginHorizontal: 16,
    marginBottom: 12,
    padding: 16,
    borderRadius: 12,
  },
  topicHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  topicParticipants: {
    flexDirection: 'row',
    gap: 4,
  },
  participantEmoji: {
    fontSize: 16,
  },
  trendBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(16,185,129,0.2)',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 8,
    gap: 2,
  },
  trendText: {
    color: '#10b981',
    fontSize: 10,
    fontWeight: 'bold',
  },
  topicTitle: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  topicStats: {
    color: '#666',
    fontSize: 12,
  },

  // Activity Feed
  activityFeedSection: {
    marginBottom: 32,
  },
  activityCard: {
    backgroundColor: 'rgba(255,255,255,0.05)',
    marginHorizontal: 16,
    marginBottom: 12,
    padding: 16,
    borderRadius: 12,
  },
  activityHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  activityAvatar: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: 'rgba(16,185,129,0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  activityAvatarEmoji: {
    fontSize: 16,
  },
  activityInfo: {
    flex: 1,
  },
  activityText: {
    fontSize: 14,
    marginBottom: 2,
  },
  activityUser: {
    color: '#10b981',
    fontWeight: 'bold',
  },
  activityAction: {
    color: '#ccc',
  },
  activityTime: {
    color: '#666',
    fontSize: 11,
  },
  activityContent: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 12,
    lineHeight: 20,
  },
  activityEngagement: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  engagementButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  engagementText: {
    color: '#666',
    fontSize: 12,
  },

  // Guidelines Card
  guidelinesCard: {
    backgroundColor: 'rgba(16,185,129,0.1)',
    marginHorizontal: 16,
    marginBottom: 32,
    padding: 20,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: 'rgba(16,185,129,0.3)',
  },
  guidelinesHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
    gap: 8,
  },
  guidelinesTitle: {
    color: '#10b981',
    fontSize: 18,
    fontWeight: 'bold',
  },
  guidelinesText: {
    color: '#ccc',
    fontSize: 14,
    lineHeight: 20,
    marginBottom: 16,
  },
  guidelinesButton: {
    backgroundColor: '#10b981',
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 8,
    alignSelf: 'flex-start',
  },
  guidelinesButtonText: {
    color: '#000',
    fontSize: 12,
    fontWeight: 'bold',
  },

  // Clean Community Styles
  communityHeaderClean: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingTop: 50,
    paddingBottom: 16,
    backgroundColor: 'rgba(0,0,0,0.95)',
  },
  communityTitleClean: {
    color: '#fff',
    fontSize: 24,
    fontWeight: 'bold',
  },
  createButtonClean: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(16,185,129,0.1)',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#10b981',
    zIndex: 1000,
    elevation: 5,
  },

  // Live Now Card
  liveNowCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(239,68,68,0.1)',
    marginHorizontal: 16,
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(239,68,68,0.3)',
    marginBottom: 8,
  },
  liveIndicatorClean: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 12,
    gap: 6,
  },
  liveDotClean: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#ef4444',
  },
  liveTextClean: {
    color: '#ef4444',
    fontSize: 12,
    fontWeight: 'bold',
  },
  liveContentClean: {
    flex: 1,
  },
  liveTitle: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 2,
  },
  liveHost: {
    color: '#ccc',
    fontSize: 14,
  },
  joinLiveClean: {
    backgroundColor: '#ef4444',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 16,
  },
  joinLiveTextClean: {
    color: '#fff',
    fontSize: 12,
    fontWeight: 'bold',
  },

  // Spaces Grid
  spacesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    paddingHorizontal: 16,
  },
  spaceCardClean: {
    width: '47%',
    backgroundColor: 'rgba(255,255,255,0.05)',
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  spaceEmojiClean: {
    fontSize: 24,
    marginBottom: 8,
  },
  spaceNameClean: {
    color: '#fff',
    fontSize: 14,
    fontWeight: 'bold',
    marginBottom: 4,
    textAlign: 'center',
  },
  spaceMembersClean: {
    color: '#666',
    fontSize: 12,
  },

  // Topic Cards
  topicCardClean: {
    backgroundColor: 'rgba(255,255,255,0.05)',
    marginHorizontal: 16,
    marginBottom: 8,
    padding: 16,
    borderRadius: 12,
  },
  topicTitleClean: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  topicStatsClean: {
    color: '#666',
    fontSize: 12,
  },

  // Activity Cards
  activityCardClean: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.05)',
    marginHorizontal: 16,
    marginBottom: 8,
    padding: 16,
    borderRadius: 12,
  },
  activityAvatarClean: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(16,185,129,0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  activityEmojiClean: {
    fontSize: 18,
  },
  activityContentClean: {
    flex: 1,
  },
  activityUserClean: {
    color: '#10b981',
    fontSize: 14,
    fontWeight: 'bold',
    marginBottom: 2,
  },
  activityTextClean: {
    color: '#fff',
    fontSize: 14,
    marginBottom: 2,
  },
  activityTimeClean: {
    color: '#666',
    fontSize: 12,
  },

  // Create Post Modal Styles
  createPostModal: {
    flex: 1,
    backgroundColor: '#000',
  },
  createPostHeader: {
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 20,
  },
  createPostClose: {
    alignSelf: 'flex-end',
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#333',
    justifyContent: 'center',
    alignItems: 'center',
  },
  createPostContent: {
    flex: 1,
    paddingHorizontal: 40,
    paddingTop: 20,
    paddingBottom: 40,
    justifyContent: 'space-evenly',
  },
  createPostOption: {
    alignItems: 'center',
    paddingVertical: 12,
  },
  createPostIcon: {
    width: 70,
    height: 70,
    borderRadius: 35,
    backgroundColor: '#333',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
    borderWidth: 2,
    borderColor: '#555',
  },
  createPostTitle: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '600',
    textAlign: 'center',
  },
  reelPreview: {
    flexDirection: 'row',
    gap: 4,
    marginTop: 8,
  },
  reelBar: {
    width: 20,
    height: 3,
    backgroundColor: '#10b981',
    borderRadius: 2,
  },

  // Video Upload Modal Styles
  videoUploadModal: {
    flex: 1,
    backgroundColor: '#000',
  },
  videoUploadHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
  },
  videoUploadClose: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#333',
    justifyContent: 'center',
    alignItems: 'center',
  },
  videoUploadTitle: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '600',
  },
  videoUploadNext: {
    backgroundColor: '#10b981',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 20,
  },
  videoUploadNextText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  videoUploadContent: {
    flex: 1,
  },
  cameraPreview: {
    flex: 1,
    backgroundColor: '#111',
    margin: 20,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  cameraPlaceholder: {
    alignItems: 'center',
    gap: 16,
  },
  cameraPlaceholderText: {
    color: '#666',
    fontSize: 16,
  },
  recordingControls: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 40,
    paddingVertical: 30,
  },
  flipCameraButton: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#333',
    justifyContent: 'center',
    alignItems: 'center',
  },
  recordButton: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 4,
    borderColor: '#333',
  },
  recordButtonInner: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#ff4444',
  },
  galleryButton: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#333',
    justifyContent: 'center',
    alignItems: 'center',
  },
  recordingOptions: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 20,
    paddingBottom: 40,
  },
  recordingOption: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 20,
    backgroundColor: '#333',
  },
  recordingOptionActive: {
    backgroundColor: '#10b981',
  },
  recordingOptionText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '500',
  },
  recordingOptionActiveText: {
    fontWeight: '600',
  },
});