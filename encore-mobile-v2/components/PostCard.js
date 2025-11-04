import React, { useState } from 'react';
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  Alert,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';

const { width } = Dimensions.get('window');

export default function PostCard({
  post,
  onLike,
  onComment,
  onShare,
  onBookmark,
  onUserPress,
}) {
  const formatTimeAgo = (timestamp) => {
    const now = new Date();
    const postTime = new Date(timestamp);
    const diffInMinutes = Math.floor((now - postTime) / (1000 * 60));
    
    if (diffInMinutes < 1) return 'now';
    if (diffInMinutes < 60) return `${diffInMinutes}m ago`;
    if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)}h ago`;
    return `${Math.floor(diffInMinutes / 1440)}d ago`;
  };

  const formatCount = (count) => {
    if (count >= 1000000) return (count / 1000000).toFixed(1) + 'M';
    if (count >= 1000) return (count / 1000).toFixed(1) + 'K';
    return count.toString();
  };

  const handleDoublePress = () => {
    if (!post.isLiked && onLike) {
      onLike();
    }
  };

  const handleLike = () => {
    if (onLike) onLike();
  };

  const handleShare = () => {
    if (onShare) onShare();
  };

  const handleComment = () => {
    if (onComment) onComment();
  };

  const handleBookmark = () => {
    if (onBookmark) onBookmark();
  };

  const handleVideoLoad = (status) => {
    if (status.isLoaded) {
      setIsPlaying(status.isPlaying);
    }
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={onUserPress}>
          <LinearGradient
            colors={['#667eea', '#764ba2']}
            style={styles.avatar}
          >
            <Text style={styles.avatarText}>
              {post.displayName ? post.displayName.split(' ').map(n => n[0]).join('') : 'AR'}
            </Text>
          </LinearGradient>
        </TouchableOpacity>
        <View style={styles.userInfo}>
          <View style={styles.userRow}>
            <Text style={styles.username}>{post.displayName || post.username}</Text>
            {post.verified && (
              <Ionicons name="checkmark-circle" size={16} color="#10b981" style={styles.verifiedIcon} />
            )}
            <Text style={styles.time}>{formatTimeAgo(post.timestamp)}</Text>
          </View>
          <Text style={styles.handle}>@{post.username}</Text>
        </View>
        <TouchableOpacity style={styles.moreButton}>
          <Ionicons name="ellipsis-horizontal" size={20} color="#fff" />
        </TouchableOpacity>
      </View>

      {/* Description */}
      <View style={styles.descriptionContainer}>
        <Text style={styles.description}>{post.content}</Text>
        {post.tags && (
          <View style={styles.hashtagContainer}>
            {post.tags.map((tag, index) => (
              <TouchableOpacity key={`${post.id || 'post'}-tag-${index}-${tag}-${Math.random().toString(36).substr(2, 9)}`}>
                <Text style={styles.hashtag}>#{tag} </Text>
              </TouchableOpacity>
            ))}
          </View>
        )}
      </View>

      {/* Media (Image/Video) */}
      {(post.media?.uri || post.imageUrl || post.image) && (
        <TouchableOpacity
          activeOpacity={0.8}
          onPress={handleDoublePress}
          style={styles.imageContainer}
        >
          {post.media?.type === 'video' ? (
            <View style={styles.videoContainer}>
              <Image 
                source={{ uri: post.media.uri || post.imageUrl || post.image }} 
                style={styles.image} 
              />
              <View style={styles.videoOverlay}>
                <Ionicons name="play-circle" size={50} color="rgba(255,255,255,0.8)" />
              </View>
            </View>
          ) : (
            <Image 
              source={{ uri: post.media?.uri || post.imageUrl || post.image }} 
              style={styles.image} 
            />
          )}
        </TouchableOpacity>
      )}

      {/* Audio Player */}
      {post.audio && (
        <View style={styles.audioPlayer}>
          <TouchableOpacity style={styles.playButton}>
            <Ionicons name="play" size={16} color="#10b981" />
          </TouchableOpacity>
          <View style={styles.audioInfo}>
            <Text style={styles.audioTitle}>{post.audio.title}</Text>
            <Text style={styles.audioDuration}>{post.audio.duration}</Text>
          </View>
          <View style={styles.waveform}>
            {[12, 20, 15, 25, 10, 18].map((height, index) => (
              <View 
                key={`${post.id || 'post'}-wave-${index}-${height}`} 
                style={[styles.waveBar, { height }]} 
              />
            ))}
          </View>
        </View>
      )}

      {/* Actions */}
      <View style={styles.actions}>
        <TouchableOpacity style={styles.actionButton} onPress={handleLike}>
          <Ionicons
            name={post.isLiked ? 'heart' : 'heart-outline'}
            size={28}
            color={post.isLiked ? '#10b981' : '#fff'}
          />
          <Text style={styles.actionText}>{formatCount(post.likes)}</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.actionButton} onPress={handleComment}>
          <Ionicons name="chatbubble-outline" size={28} color="#fff" />
          <Text style={styles.actionText}>{formatCount(post.comments)}</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.actionButton} onPress={handleShare}>
          <Ionicons name="share-outline" size={28} color="#fff" />
          <Text style={styles.actionText}>{formatCount(post.shares)}</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.actionButton, { marginLeft: 'auto' }]}
          onPress={handleBookmark}
        >
          <Ionicons
            name={post.isBookmarked ? 'bookmark' : 'bookmark-outline'}
            size={28}
            color={post.isBookmarked ? '#10b981' : '#fff'}
          />
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#000',
    borderBottomWidth: 1,
    borderBottomColor: '#333',
    marginBottom: 8,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#111',
  },
  avatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  verifiedIcon: {
    marginLeft: 4,
  },
  userInfo: {
    flex: 1,
    marginLeft: 12,
  },
  userRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  handle: {
    color: '#666',
    fontSize: 12,
    marginTop: 2,
  },
  username: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  badge: {
    backgroundColor: '#01302e',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 12,
    marginLeft: 8,
  },
  badgeText: {
    color: '#10b981',
    fontSize: 12,
    fontWeight: '500',
    textTransform: 'capitalize',
  },
  time: {
    color: '#666',
    fontSize: 12,
    marginLeft: 8,
  },
  moreButton: {
    padding: 4,
  },
  descriptionContainer: {
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  description: {
    color: '#fff',
    fontSize: 15,
    lineHeight: 22,
    marginBottom: 8,
  },
  hashtagContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  hashtag: {
    color: '#10b981',
    fontSize: 14,
    marginRight: 8,
    marginBottom: 4,
  },
  imageContainer: {
    paddingHorizontal: 8,
    marginBottom: 8,
  },
  imageWrapper: {
    position: 'relative',
  },
  image: {
    width: width - 16,
    height: 400,
    borderRadius: 12,
  },
  videoContainer: {
    position: 'relative',
  },
  videoOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.3)',
    borderRadius: 12,
  },
  heartOverlay: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    marginTop: -40,
    marginLeft: -40,
  },
  audioPlayer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#111',
    marginHorizontal: 16,
    borderRadius: 12,
    marginBottom: 12,
  },
  audioInfo: {
    flex: 1,
    marginLeft: 12,
  },
  audioTitle: {
    color: '#fff',
    fontSize: 14,
    fontWeight: 'bold',
  },
  audioDuration: {
    color: '#666',
    fontSize: 12,
    marginTop: 2,
  },
  playButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#01302e',
    justifyContent: 'center',
    alignItems: 'center',
  },
  waveform: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginHorizontal: 16,
    gap: 2,
  },
  waveBar: {
    width: 3,
    height: 12,
    backgroundColor: '#10b981',
    borderRadius: 2,
  },
  audioTime: {
    color: '#666',
    fontSize: 12,
  },
  actions: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 16,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 24,
  },
  actionText: {
    color: '#fff',
    fontSize: 14,
    marginLeft: 6,
  },
});