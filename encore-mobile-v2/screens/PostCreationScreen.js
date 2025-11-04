import { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  Image,
  Alert,
  ScrollView,
  Dimensions,
  StatusBar,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import PostService from '../services/PostService';
import EventBus from '../services/EventBus';

const { width } = Dimensions.get('window');

export default function PostCreationScreen({ route, onClose, onPostCreated }) {
  const insets = useSafeAreaInsets();
  const { media } = route?.params || {};
  
  const [content, setContent] = useState('');
  const [isPosting, setIsPosting] = useState(false);
  const [location, setLocation] = useState('');
  const [tags, setTags] = useState('');

  const handlePost = async () => {
    if (!content.trim() && !media) {
      Alert.alert('Empty Post', 'Please add some content or media to your post.');
      return;
    }

    setIsPosting(true);

    try {
      const postData = {
        content: content.trim(),
        media: media,
        type: media?.type === 'video' ? 'reel' : 'post',
        location: location.trim() || null,
        tags: tags.split('#').filter(tag => tag.trim()).map(tag => tag.trim()),
        isPublic: true,
      };

      const result = await PostService.createPost(postData);

      if (result.success) {
        // Emit event to refresh feeds
        EventBus.emit('postCreated', result.post);
        
        Alert.alert(
          '🎉 Posted!', 
          'Your content has been shared successfully!',
          [
            {
              text: 'OK',
              onPress: () => {
                if (onPostCreated) onPostCreated(result.post);
                if (onClose) onClose();
              }
            }
          ]
        );
      } else {
        Alert.alert('Error', result.message || 'Failed to create post');
      }
    } catch (error) {
      Alert.alert('Error', 'Something went wrong. Please try again.');
      console.error('Post creation error:', error);
    } finally {
      setIsPosting(false);
    }
  };

  const handleDiscard = () => {
    Alert.alert(
      'Discard Post?',
      'Are you sure you want to discard this post?',
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Discard', 
          style: 'destructive',
          onPress: () => onClose && onClose()
        }
      ]
    );
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#000" />
      
      {/* Header */}
      <View style={[styles.header, { paddingTop: insets.top }]}>
        <TouchableOpacity style={styles.headerButton} onPress={handleDiscard}>
          <Ionicons name="close" size={24} color="#fff" />
        </TouchableOpacity>
        
        <Text style={styles.headerTitle}>Create Post</Text>
        
        <TouchableOpacity 
          style={[styles.postButton, isPosting && styles.postButtonDisabled]} 
          onPress={handlePost}
          disabled={isPosting}
        >
          <Text style={[styles.postButtonText, isPosting && styles.postButtonTextDisabled]}>
            {isPosting ? 'Posting...' : 'Post'}
          </Text>
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* User Info */}
        <View style={styles.userInfo}>
          <LinearGradient
            colors={['#667eea', '#764ba2']}
            style={styles.avatar}
          >
            <Text style={styles.avatarText}>AR</Text>
          </LinearGradient>
          <View style={styles.userDetails}>
            <Text style={styles.username}>Alex Rodriguez</Text>
            <Text style={styles.handle}>@alexmusic</Text>
          </View>
        </View>

        {/* Media Preview */}
        {media && (
          <View style={styles.mediaPreview}>
            {media.type === 'video' ? (
              <View style={styles.videoPreview}>
                <LinearGradient
                  colors={['#ff4757', '#ff3838']}
                  style={styles.videoPlaceholder}
                >
                  <Ionicons name="play" size={40} color="#fff" />
                  <Text style={styles.videoText}>Video Ready</Text>
                </LinearGradient>
              </View>
            ) : (
              <Image source={{ uri: media.uri }} style={styles.imagePreview} />
            )}
            <TouchableOpacity style={styles.removeMedia} onPress={() => Alert.alert('Remove Media', 'Feature coming soon!')}>
              <Ionicons name="close-circle" size={24} color="#ff4757" />
            </TouchableOpacity>
          </View>
        )}

        {/* Content Input */}
        <View style={styles.contentSection}>
          <TextInput
            style={styles.contentInput}
            placeholder="What's on your mind?"
            placeholderTextColor="#666"
            multiline
            value={content}
            onChangeText={setContent}
            maxLength={500}
          />
          <Text style={styles.characterCount}>{content.length}/500</Text>
        </View>

        {/* Additional Options */}
        <View style={styles.optionsSection}>
          {/* Location */}
          <View style={styles.optionItem}>
            <Ionicons name="location-outline" size={20} color="#10b981" />
            <TextInput
              style={styles.optionInput}
              placeholder="Add location"
              placeholderTextColor="#666"
              value={location}
              onChangeText={setLocation}
            />
          </View>

          {/* Tags */}
          <View style={styles.optionItem}>
            <Ionicons name="pricetag-outline" size={20} color="#10b981" />
            <TextInput
              style={styles.optionInput}
              placeholder="Add tags (#music #producer)"
              placeholderTextColor="#666"
              value={tags}
              onChangeText={setTags}
            />
          </View>
        </View>

        {/* Post Settings */}
        <View style={styles.settingsSection}>
          <Text style={styles.sectionTitle}>Post Settings</Text>
          
          <TouchableOpacity style={styles.settingItem}>
            <View style={styles.settingLeft}>
              <Ionicons name="globe-outline" size={20} color="#10b981" />
              <Text style={styles.settingText}>Public</Text>
            </View>
            <Ionicons name="chevron-forward" size={16} color="#666" />
          </TouchableOpacity>

          <TouchableOpacity style={styles.settingItem}>
            <View style={styles.settingLeft}>
              <Ionicons name="notifications-outline" size={20} color="#10b981" />
              <Text style={styles.settingText}>Allow Comments</Text>
            </View>
            <View style={styles.toggle}>
              <View style={styles.toggleActive} />
            </View>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#333',
  },
  headerButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#111',
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerTitle: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '600',
  },
  postButton: {
    backgroundColor: '#10b981',
    paddingHorizontal: 20,
    paddingVertical: 8,
    borderRadius: 20,
  },
  postButtonDisabled: {
    backgroundColor: '#666',
  },
  postButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
  },
  postButtonTextDisabled: {
    color: '#ccc',
  },
  content: {
    flex: 1,
  },
  userInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#111',
  },
  avatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  avatarText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  userDetails: {
    flex: 1,
  },
  username: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  handle: {
    color: '#10b981',
    fontSize: 14,
  },
  mediaPreview: {
    margin: 20,
    borderRadius: 16,
    overflow: 'hidden',
    position: 'relative',
  },
  imagePreview: {
    width: '100%',
    height: 300,
    borderRadius: 16,
  },
  videoPreview: {
    width: '100%',
    height: 300,
    borderRadius: 16,
    overflow: 'hidden',
  },
  videoPlaceholder: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    gap: 10,
  },
  videoText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  removeMedia: {
    position: 'absolute',
    top: 10,
    right: 10,
    backgroundColor: 'rgba(0,0,0,0.7)',
    borderRadius: 12,
    padding: 4,
  },
  contentSection: {
    paddingHorizontal: 20,
    paddingVertical: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#111',
  },
  contentInput: {
    color: '#fff',
    fontSize: 16,
    minHeight: 100,
    textAlignVertical: 'top',
    lineHeight: 24,
  },
  characterCount: {
    color: '#666',
    fontSize: 12,
    textAlign: 'right',
    marginTop: 10,
  },
  optionsSection: {
    paddingHorizontal: 20,
    paddingVertical: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#111',
    gap: 16,
  },
  optionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  optionInput: {
    flex: 1,
    color: '#fff',
    fontSize: 14,
    paddingVertical: 8,
  },
  settingsSection: {
    paddingHorizontal: 20,
    paddingVertical: 20,
  },
  sectionTitle: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 16,
  },
  settingItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
  },
  settingLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  settingText: {
    color: '#fff',
    fontSize: 14,
  },
  toggle: {
    width: 40,
    height: 20,
    backgroundColor: '#10b981',
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'flex-end',
    paddingHorizontal: 2,
  },
  toggleActive: {
    width: 16,
    height: 16,
    backgroundColor: '#fff',
    borderRadius: 8,
  },
});