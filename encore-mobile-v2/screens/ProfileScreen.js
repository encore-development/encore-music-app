import { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
  TextInput,
  Modal,
  Share,
  Dimensions,
  StatusBar,
  Image,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import PostService from '../services/PostService';
import EventBus from '../services/EventBus';

const { width } = Dimensions.get('window');

export default function ProfileScreen() {
  const insets = useSafeAreaInsets();
  const [userProfile, setUserProfile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [editModalVisible, setEditModalVisible] = useState(false);
  const [editedProfile, setEditedProfile] = useState({});
  const [activeTab, setActiveTab] = useState('videos');
  const [achievements, setAchievements] = useState([]);
  const [recentActivity, setRecentActivity] = useState([]);
  const [userPosts, setUserPosts] = useState([]);

  useEffect(() => {
    loadUserProfile();
    loadUserPosts();
    
    // Listen for new posts
    const handlePostCreated = (post) => {
      if (post.userId === 'current_user') {
        loadUserPosts(); // Refresh user posts
        loadUserProfile(); // Update post count
      }
    };
    
    EventBus.on('postCreated', handlePostCreated);
    
    return () => {
      EventBus.off('postCreated', handlePostCreated);
    };
  }, []);

  const loadUserProfile = async () => {
    try {
      // Get actual post count from PostService
      const posts = await PostService.getUserPosts('current_user');
      
      const profile = {
        id: 'current_user',
        username: 'alexmusic',
        displayName: 'Alex Rodriguez',
        bio: '🎵 Producer & DJ • Creating beats that move souls\n📍 Los Angeles • 🎧 Booking: alex@music.com',
        avatarColor: ['#667eea', '#764ba2'],
        followers: 12547,
        following: 892,
        posts: posts.length, // Use actual post count

        level: 'Pro Artist',
        totalPlays: '2.1M',
        monthlyListeners: '45.2K',
        joinDate: 'March 2023',
        location: 'Los Angeles, CA'
      };
      
      const userAchievements = [
        { id: 1, title: 'Rising Star', description: 'Reached 10K followers', icon: 'star', color: '#f59e0b' },
        { id: 2, title: 'Hit Maker', description: '1M+ total plays', icon: 'musical-notes', color: '#10b981' },
        { id: 3, title: 'Community Leader', description: 'Top 1% engagement', icon: 'trophy', color: '#8b5cf6' },
        { id: 4, title: 'Verified Artist', description: 'Official verification', icon: 'checkmark-circle', color: '#3b82f6' }
      ];
      
      const activity = [
        { id: 1, type: 'release', title: 'Released new track "Midnight Vibes"', time: '2 hours ago', icon: 'musical-notes' },
        { id: 2, type: 'collab', title: 'Started collaboration with @sarahbeats', time: '1 day ago', icon: 'people' },
        { id: 3, type: 'milestone', title: 'Reached 45K monthly listeners', time: '3 days ago', icon: 'trending-up' },
        { id: 4, type: 'post', title: 'Shared behind-the-scenes studio content', time: '1 week ago', icon: 'camera' }
      ];
      
      setUserProfile(profile);
      setEditedProfile(profile);
      setAchievements(userAchievements);
      setRecentActivity(activity);
    } catch (error) {
      console.error('Error loading profile:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadUserPosts = async () => {
    try {
      const posts = await PostService.getUserPosts('current_user');
      setUserPosts(posts);
    } catch (error) {
      console.error('Error loading user posts:', error);
    }
  };

  const handleEditProfile = () => {
    setEditModalVisible(true);
  };

  const handleSaveProfile = async () => {
    try {
      setLoading(true);
      await new Promise(resolve => setTimeout(resolve, 1000));
      setUserProfile(editedProfile);
      setEditModalVisible(false);
      Alert.alert('✅ Success', 'Profile updated successfully!');
    } catch (error) {
      Alert.alert('❌ Error', 'Failed to update profile. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleShare = async () => {
    try {
      await Share.share({
        message: `Check out ${userProfile?.displayName}'s profile on Encore! 🎵`,
        url: `https://encore.app/profile/${userProfile?.username}`,
      });
    } catch (error) {
      console.error('Error sharing profile:', error);
    }
  };



  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#000" />
      
      {/* Header */}
      <View style={[styles.header, { paddingTop: insets.top }]}>
        <View style={styles.headerContent}>
          <View style={styles.headerSpacer} />
          <Text style={styles.headerTitle}>Profile</Text>
          <TouchableOpacity style={styles.menuButton}>
            <Ionicons name="ellipsis-horizontal" size={24} color="#fff" />
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Profile Header */}
        <View style={styles.profileHeader}>
          <LinearGradient
            colors={userProfile?.avatarColor || ['#667eea', '#764ba2']}
            style={styles.avatar}
          >
            <Text style={styles.avatarText}>
              {userProfile?.displayName?.split(' ').map(n => n[0]).join('') || 'AR'}
            </Text>

          </LinearGradient>

          <View style={styles.profileInfo}>
            <Text style={styles.displayName}>{userProfile?.displayName}</Text>
            <Text style={styles.username}>@{userProfile?.username}</Text>
            
            {userProfile?.level && (
              <View style={styles.levelBadge}>
                <Text style={styles.levelText}>{userProfile.level}</Text>
              </View>
            )}

            <Text style={styles.bio}>{userProfile?.bio}</Text>
          </View>

          {/* Stats Row */}
          <View style={styles.statsRow}>
            <TouchableOpacity style={styles.statItem}>
              <Text style={styles.statNumber}>{userProfile?.posts}</Text>
              <Text style={styles.statLabel}>Videos</Text>
            </TouchableOpacity>
            <View style={styles.statDivider} />
            <TouchableOpacity style={styles.statItem}>
              <Text style={styles.statNumber}>{userProfile?.followers?.toLocaleString()}</Text>
              <Text style={styles.statLabel}>Followers</Text>
            </TouchableOpacity>
            <View style={styles.statDivider} />
            <TouchableOpacity style={styles.statItem}>
              <Text style={styles.statNumber}>{userProfile?.following}</Text>
              <Text style={styles.statLabel}>Following</Text>
            </TouchableOpacity>
          </View>

          {/* Action Buttons */}
          <View style={styles.actionButtons}>
            <TouchableOpacity style={styles.primaryButton} onPress={handleEditProfile}>
              <Ionicons name="create-outline" size={18} color="#fff" />
              <Text style={styles.primaryButtonText}>Edit Profile</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.secondaryButton} onPress={handleShare}>
              <Ionicons name="share-outline" size={18} color="#10b981" />
              <Text style={styles.secondaryButtonText}>Share</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Music Stats Cards */}
        <View style={styles.statsSection}>
          <View style={styles.statsGrid}>
            <View style={styles.statCard}>
              <View style={styles.statCardHeader}>
                <Ionicons name="play-circle" size={24} color="#10b981" />
                <Text style={styles.statCardTitle}>Total Plays</Text>
              </View>
              <Text style={styles.statCardNumber}>{userProfile?.totalPlays}</Text>
              <Text style={styles.statCardGrowth}>+12% this month</Text>
            </View>
            
            <View style={styles.statCard}>
              <View style={styles.statCardHeader}>
                <Ionicons name="headset" size={24} color="#3b82f6" />
                <Text style={styles.statCardTitle}>Monthly Listeners</Text>
              </View>
              <Text style={styles.statCardNumber}>{userProfile?.monthlyListeners}</Text>
              <Text style={styles.statCardGrowth}>+8% this month</Text>
            </View>
          </View>
        </View>

        {/* Tab Navigation - TikTok Style */}
        <View style={styles.tabSection}>
          <View style={styles.tabNavigation}>
            {[
              { key: 'videos', label: 'Videos', icon: 'videocam' },
              { key: 'music', label: 'Music', icon: 'musical-notes' },
              { key: 'liked', label: 'Liked', icon: 'heart' },
            ].map((tab) => (
              <TouchableOpacity
                key={tab.key}
                style={[styles.tab, activeTab === tab.key && styles.activeTab]}
                onPress={() => setActiveTab(tab.key)}
              >
                <Ionicons 
                  name={tab.icon} 
                  size={20} 
                  color={activeTab === tab.key ? '#fff' : '#666'} 
                />
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* TikTok-Style Video Grid */}
        {activeTab === 'videos' && (
          <View style={styles.videoSection}>
            {userPosts.length === 0 ? (
              <View style={styles.emptyState}>
                <Ionicons name="videocam-outline" size={48} color="#666" />
                <Text style={styles.emptyStateTitle}>No posts yet</Text>
                <Text style={styles.emptyStateText}>Start creating content to see it here!</Text>
              </View>
            ) : (
              <View style={styles.videoGrid}>
                {userPosts.map((post, index) => (
                  <TouchableOpacity key={post.id} style={styles.videoItem}>
                    {post.media && post.media.uri ? (
                      <View style={styles.postMediaContainer}>
                        {post.media.type === 'video' ? (
                          <View style={styles.videoContainer}>
                            <Image source={{ uri: post.media.uri }} style={styles.videoThumbnail} />
                            <View style={styles.playOverlay}>
                              <Ionicons name="play" size={24} color="#fff" />
                            </View>
                          </View>
                        ) : (
                          <Image source={{ uri: post.media.uri }} style={styles.postImage} />
                        )}
                        
                        {/* Post Stats Overlay */}
                        <View style={styles.videoOverlay}>
                          <View style={styles.videoStats}>
                            <View style={styles.videoStat}>
                              <Ionicons name="heart" size={12} color="#fff" />
                              <Text style={styles.videoStatText}>{post.likes || 0}</Text>
                            </View>
                            <View style={styles.videoStat}>
                              <Ionicons name="chatbubble" size={12} color="#fff" />
                              <Text style={styles.videoStatText}>{post.comments || 0}</Text>
                            </View>
                          </View>
                        </View>
                      </View>
                    ) : (
                      <LinearGradient
                        colors={[
                          ['#ff6b6b', '#ee5a52'],
                          ['#4ecdc4', '#44a08d'],
                          ['#45b7d1', '#96c93d'],
                          ['#f9ca24', '#f0932b'],
                          ['#eb4d4b', '#6c5ce7'],
                          ['#a55eea', '#26de81'],
                          ['#ff9ff3', '#f368e0'],
                          ['#54a0ff', '#2e86de'],
                          ['#5f27cd', '#341f97']
                        ][index % 9]}
                        style={styles.videoBackground}
                      >
                        <View style={styles.videoContent}>
                          <Ionicons name="musical-notes" size={24} color="rgba(255,255,255,0.8)" />
                          <Text style={styles.videoTitle} numberOfLines={2}>
                            {post.content || 'New Post'}
                          </Text>
                        </View>
                        
                        <View style={styles.videoOverlay}>
                          <View style={styles.videoStats}>
                            <View style={styles.videoStat}>
                              <Ionicons name="heart" size={12} color="#fff" />
                              <Text style={styles.videoStatText}>{post.likes || 0}</Text>
                            </View>
                            <View style={styles.videoStat}>
                              <Ionicons name="chatbubble" size={12} color="#fff" />
                              <Text style={styles.videoStatText}>{post.comments || 0}</Text>
                            </View>
                          </View>
                        </View>
                      </LinearGradient>
                    )}
                  </TouchableOpacity>
                ))}
              </View>
            )}
          </View>
        )}

        {/* Music Tab - Album Style Grid */}
        {activeTab === 'music' && (
          <View style={styles.musicSection}>
            <View style={styles.musicGrid}>
              {Array.from({ length: 9 }, (_, index) => (
                <TouchableOpacity key={index} style={styles.musicItem}>
                  <LinearGradient
                    colors={[
                      ['#667eea', '#764ba2'],
                      ['#f093fb', '#f5576c'],
                      ['#4facfe', '#00f2fe'],
                      ['#43e97b', '#38f9d7'],
                      ['#fa709a', '#fee140'],
                      ['#a8edea', '#fed6e3']
                    ][index % 6]}
                    style={styles.musicBackground}
                  >
                    <View style={styles.musicContent}>
                      <Ionicons name="musical-notes" size={20} color="#fff" />
                      <Text style={styles.musicTitle}>Track {index + 1}</Text>
                    </View>
                    
                    <View style={styles.musicOverlay}>
                      <View style={styles.musicStats}>
                        <Ionicons name="play" size={10} color="#fff" />
                        <Text style={styles.musicPlays}>{Math.floor(Math.random() * 100)}K</Text>
                      </View>
                    </View>
                  </LinearGradient>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        )}

        {/* Liked Tab - Mixed Content */}
        {activeTab === 'liked' && (
          <View style={styles.likedSection}>
            <View style={styles.likedGrid}>
              {Array.from({ length: 8 }, (_, index) => (
                <TouchableOpacity key={index} style={index % 3 === 0 ? styles.videoItem : styles.musicItem}>
                  <LinearGradient
                    colors={[
                      ['#ff6b6b', '#ee5a52'],
                      ['#4ecdc4', '#44a08d'],
                      ['#45b7d1', '#96c93d'],
                      ['#f9ca24', '#f0932b']
                    ][index % 4]}
                    style={index % 3 === 0 ? styles.videoBackground : styles.musicBackground}
                  >
                    <View style={styles.likedContent}>
                      <Ionicons 
                        name={index % 3 === 0 ? "play" : "musical-notes"} 
                        size={index % 3 === 0 ? 24 : 20} 
                        color="rgba(255,255,255,0.8)" 
                      />
                      <Text style={styles.likedTitle}>
                        {index % 3 === 0 ? `Video ${index + 1}` : `Song ${index + 1}`}
                      </Text>
                    </View>
                    
                    <View style={styles.likedOverlay}>
                      <View style={styles.likedStats}>
                        <Ionicons name="heart" size={10} color="#ff6b6b" />
                        <Text style={styles.likedCount}>{Math.floor(Math.random() * 50)}</Text>
                      </View>
                    </View>
                  </LinearGradient>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        )}




      </ScrollView>

      {/* Edit Profile Modal */}
      <Modal
        visible={editModalVisible}
        animationType="slide"
        presentationStyle="pageSheet"
        onRequestClose={() => setEditModalVisible(false)}
      >
        <View style={[styles.modalContainer, { paddingTop: insets.top }]}>
          <View style={styles.modalHeader}>
            <TouchableOpacity onPress={() => setEditModalVisible(false)}>
              <Text style={styles.modalCancel}>Cancel</Text>
            </TouchableOpacity>
            <Text style={styles.modalTitle}>Edit Profile</Text>
            <TouchableOpacity onPress={handleSaveProfile} disabled={loading}>
              <Text style={[styles.modalSave, loading && styles.modalSaveDisabled]}>
                {loading ? 'Saving...' : 'Save'}
              </Text>
            </TouchableOpacity>
          </View>

          <ScrollView style={styles.modalContent}>
            <View style={styles.editSection}>
              <Text style={styles.editLabel}>Display Name</Text>
              <TextInput
                style={styles.editInput}
                value={editedProfile.displayName}
                onChangeText={(text) => setEditedProfile({...editedProfile, displayName: text})}
                placeholder="Enter display name"
                placeholderTextColor="#666"
              />
            </View>

            <View style={styles.editSection}>
              <Text style={styles.editLabel}>Username</Text>
              <TextInput
                style={styles.editInput}
                value={editedProfile.username}
                onChangeText={(text) => setEditedProfile({...editedProfile, username: text})}
                placeholder="Enter username"
                placeholderTextColor="#666"
              />
            </View>

            <View style={styles.editSection}>
              <Text style={styles.editLabel}>Bio</Text>
              <TextInput
                style={[styles.editInput, styles.editTextArea]}
                value={editedProfile.bio}
                onChangeText={(text) => setEditedProfile({...editedProfile, bio: text})}
                placeholder="Tell us about yourself..."
                placeholderTextColor="#666"
                multiline
                numberOfLines={4}
              />
            </View>

            <View style={styles.editSection}>
              <Text style={styles.editLabel}>Location</Text>
              <TextInput
                style={styles.editInput}
                value={editedProfile.location}
                onChangeText={(text) => setEditedProfile({...editedProfile, location: text})}
                placeholder="Enter your location"
                placeholderTextColor="#666"
              />
            </View>
          </ScrollView>
        </View>
      </Modal>


    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },

  header: {
    backgroundColor: '#000',
    borderBottomWidth: 1,
    borderBottomColor: '#333',
  },
  headerContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
  },
  headerSpacer: {
    width: 40,
    height: 40,
  },
  headerTitle: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '600',
  },
  menuButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#111',
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: {
    flex: 1,
  },
  profileHeader: {
    alignItems: 'center',
    paddingTop: 24,
    paddingBottom: 32,
    paddingHorizontal: 20,
    backgroundColor: '#000',
  },
  avatar: {
    width: 90,
    height: 90,
    borderRadius: 45,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
    position: 'relative',
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
  },
  avatarText: {
    color: '#fff',
    fontSize: 28,
    fontWeight: 'bold',
  },

  profileInfo: {
    alignItems: 'center',
    marginBottom: 24,
  },
  displayName: {
    color: '#fff',
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  username: {
    color: '#10b981',
    fontSize: 15,
    fontWeight: '500',
    marginBottom: 12,
  },
  levelBadge: {
    backgroundColor: '#10b981',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    marginBottom: 16,
  },
  levelText: {
    color: '#fff',
    fontSize: 11,
    fontWeight: '600',
  },
  bio: {
    color: '#ccc',
    fontSize: 14,
    textAlign: 'center',
    lineHeight: 20,
    maxWidth: width - 60,
  },
  statsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#111',
    borderRadius: 16,
    paddingVertical: 16,
    paddingHorizontal: 20,
    marginBottom: 20,
    width: '100%',
  },
  statItem: {
    flex: 1,
    alignItems: 'center',
  },
  statDivider: {
    width: 1,
    height: 30,
    backgroundColor: '#333',
  },
  statNumber: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 2,
  },
  statLabel: {
    color: '#666',
    fontSize: 11,
  },
  actionButtons: {
    flexDirection: 'row',
    gap: 12,
    width: '100%',
  },
  primaryButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#10b981',
    paddingVertical: 12,
    borderRadius: 12,
    gap: 8,
  },
  primaryButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
  },
  secondaryButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#111',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#333',
    gap: 6,
  },
  secondaryButtonText: {
    color: '#10b981',
    fontSize: 14,
    fontWeight: '500',
  },
  statsSection: {
    paddingHorizontal: 20,
    paddingVertical: 20,
    backgroundColor: '#000',
  },
  statsGrid: {
    flexDirection: 'row',
    gap: 12,
  },
  statCard: {
    flex: 1,
    backgroundColor: '#111',
    padding: 16,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#222',
  },
  statCardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
    gap: 8,
  },
  statCardTitle: {
    color: '#ccc',
    fontSize: 12,
    fontWeight: '500',
  },
  statCardNumber: {
    color: '#fff',
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  statCardGrowth: {
    color: '#10b981',
    fontSize: 11,
    fontWeight: '500',
  },
  tabSection: {
    paddingHorizontal: 20,
    paddingVertical: 16,
    backgroundColor: '#000',
    borderBottomWidth: 1,
    borderBottomColor: '#111',
  },
  tabNavigation: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 40,
  },
  tab: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderBottomWidth: 2,
    borderBottomColor: 'transparent',
  },
  activeTab: {
    borderBottomColor: '#10b981',
  },
  
  // TikTok-Style Video Grid
  videoSection: {
    paddingHorizontal: 2,
    paddingBottom: 20,
    backgroundColor: '#000',
  },
  videoGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 2,
  },
  videoItem: {
    width: (width - 8) / 3,
    aspectRatio: 9/16, // TikTok aspect ratio
    borderRadius: 8,
    overflow: 'hidden',
    marginBottom: 2,
  },
  videoBackground: {
    flex: 1,
    justifyContent: 'space-between',
    padding: 8,
  },
  videoContent: {
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
  },
  videoTitle: {
    color: '#fff',
    fontSize: 10,
    fontWeight: '600',
    marginTop: 8,
    textAlign: 'center',
  },
  videoOverlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: 8,
  },
  videoStats: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  videoStat: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 2,
  },
  videoStatText: {
    color: '#fff',
    fontSize: 8,
    fontWeight: '600',
  },
  durationBadge: {
    position: 'absolute',
    top: -20,
    right: 8,
    backgroundColor: 'rgba(0,0,0,0.7)',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  durationText: {
    color: '#fff',
    fontSize: 8,
    fontWeight: '600',
  },
  
  // Empty State
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 60,
    paddingHorizontal: 40,
  },
  emptyStateTitle: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '600',
    marginTop: 16,
    marginBottom: 8,
  },
  emptyStateText: {
    color: '#666',
    fontSize: 14,
    textAlign: 'center',
    lineHeight: 20,
  },
  
  // Post Media
  postMediaContainer: {
    flex: 1,
    position: 'relative',
  },
  postImage: {
    width: '100%',
    height: '100%',
    borderRadius: 8,
  },
  videoContainer: {
    flex: 1,
    position: 'relative',
  },
  videoThumbnail: {
    width: '100%',
    height: '100%',
    borderRadius: 8,
  },
  playOverlay: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: [{ translateX: -12 }, { translateY: -12 }],
    backgroundColor: 'rgba(0,0,0,0.6)',
    borderRadius: 12,
    padding: 8,
  },
  
  // Music Grid (Square format)
  musicSection: {
    paddingHorizontal: 2,
    paddingBottom: 20,
    backgroundColor: '#000',
  },
  musicGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 2,
  },
  musicItem: {
    width: (width - 8) / 3,
    aspectRatio: 1, // Square format for music
    borderRadius: 8,
    overflow: 'hidden',
    marginBottom: 2,
  },
  musicBackground: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 8,
  },
  musicContent: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  musicTitle: {
    color: '#fff',
    fontSize: 9,
    fontWeight: '600',
    marginTop: 6,
    textAlign: 'center',
  },
  musicOverlay: {
    position: 'absolute',
    bottom: 4,
    right: 4,
  },
  musicStats: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 2,
    backgroundColor: 'rgba(0,0,0,0.6)',
    paddingHorizontal: 4,
    paddingVertical: 2,
    borderRadius: 8,
  },
  musicPlays: {
    color: '#fff',
    fontSize: 7,
    fontWeight: '600',
  },
  
  // Liked Section (Mixed content)
  likedSection: {
    paddingHorizontal: 2,
    paddingBottom: 20,
    backgroundColor: '#000',
  },
  likedGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 2,
  },
  likedContent: {
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
  },
  likedTitle: {
    color: '#fff',
    fontSize: 9,
    fontWeight: '600',
    marginTop: 6,
    textAlign: 'center',
  },
  likedOverlay: {
    position: 'absolute',
    bottom: 4,
    left: 4,
  },
  likedStats: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 2,
    backgroundColor: 'rgba(0,0,0,0.6)',
    paddingHorizontal: 4,
    paddingVertical: 2,
    borderRadius: 8,
  },
  likedCount: {
    color: '#fff',
    fontSize: 7,
    fontWeight: '600',
  },
  
  // Section Headers
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  sectionTitle: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '600',
  },
  sectionAction: {
    color: '#10b981',
    fontSize: 14,
    fontWeight: '500',
  },
  
  // Achievements Section
  achievementsSection: {
    paddingHorizontal: 20,
    paddingVertical: 20,
    backgroundColor: '#000',
  },
  achievementsScroll: {
    paddingLeft: 0,
  },
  achievementCard: {
    backgroundColor: '#111',
    padding: 14,
    borderRadius: 14,
    marginRight: 12,
    width: 120,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#222',
  },
  achievementIcon: {
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  achievementTitle: {
    color: '#fff',
    fontSize: 11,
    fontWeight: '600',
    textAlign: 'center',
    marginBottom: 4,
  },
  achievementDescription: {
    color: '#666',
    fontSize: 9,
    textAlign: 'center',
    lineHeight: 12,
  },
  
  // Activity Section
  activitySection: {
    paddingHorizontal: 20,
    paddingVertical: 20,
    backgroundColor: '#000',
  },
  activityItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    paddingHorizontal: 12,
    backgroundColor: '#111',
    borderRadius: 12,
    marginBottom: 8,
    gap: 12,
    borderWidth: 1,
    borderColor: '#222',
  },
  activityIcon: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#222',
    justifyContent: 'center',
    alignItems: 'center',
  },
  activityContent: {
    flex: 1,
  },
  activityTitle: {
    color: '#fff',
    fontSize: 13,
    fontWeight: '500',
    marginBottom: 2,
  },
  activityTime: {
    color: '#666',
    fontSize: 11,
  },
  
  // Profile Footer
  profileFooter: {
    paddingHorizontal: 20,
    paddingVertical: 20,
    alignItems: 'center',
    gap: 6,
    backgroundColor: '#000',
    borderTopWidth: 1,
    borderTopColor: '#111',
  },
  footerText: {
    color: '#666',
    fontSize: 11,
  },

  
  // Modal Styles
  modalContainer: {
    flex: 1,
    backgroundColor: '#000',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#333',
  },
  modalTitle: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '600',
  },
  modalCancel: {
    color: '#666',
    fontSize: 16,
  },
  modalSave: {
    color: '#10b981',
    fontSize: 16,
    fontWeight: '600',
  },
  modalSaveDisabled: {
    color: '#666',
  },
  modalContent: {
    flex: 1,
    paddingHorizontal: 20,
  },
  editSection: {
    marginVertical: 16,
  },
  editLabel: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 8,
  },
  editInput: {
    backgroundColor: '#111',
    color: '#fff',
    fontSize: 16,
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#333',
  },
  editTextArea: {
    height: 100,
    textAlignVertical: 'top',
  },
});