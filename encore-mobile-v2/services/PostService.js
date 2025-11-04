import AsyncStorage from '@react-native-async-storage/async-storage';
import * as FileSystem from 'expo-file-system';

class PostService {
  static POSTS_KEY = 'encore_posts';
  static USER_POSTS_KEY = 'encore_user_posts';

  // Generate unique ID for posts
  static generateId() {
    return Date.now().toString() + Math.random().toString(36).substr(2, 9);
  }

  // Create a new post
  static async createPost(postData) {
    try {
      const postId = this.generateId();
      const timestamp = new Date().toISOString();
      
      // Process media if provided
      let processedMedia = null;
      if (postData.media) {
        processedMedia = await this.processMedia(postData.media, postId);
      }

      const newPost = {
        id: postId,
        userId: 'current_user', // In real app, get from auth
        username: 'alexmusic',
        displayName: 'Alex Rodriguez',
        avatar: null,
        verified: true,
        content: postData.content || '',
        media: processedMedia,
        type: postData.type || 'post', // 'post', 'reel', 'story'
        likes: 0,
        comments: 0,
        shares: 0,
        views: 0,
        timestamp: timestamp,
        location: postData.location || null,
        tags: postData.tags || [],
        musicTrack: postData.musicTrack || null,
        isPublic: postData.isPublic !== false, // Default to public
      };

      // Save to posts collection
      await this.savePost(newPost);
      
      // Add to user's posts
      await this.addToUserPosts(newPost.userId, postId);

      return {
        success: true,
        post: newPost,
        message: 'Post created successfully!'
      };
    } catch (error) {
      console.error('Error creating post:', error);
      return {
        success: false,
        error: error.message,
        message: 'Failed to create post'
      };
    }
  }

  // Process media (copy to app directory and generate thumbnails)
  static async processMedia(media, postId) {
    try {
      const mediaDir = `${FileSystem.documentDirectory}media/`;
      
      // Ensure media directory exists
      const dirInfo = await FileSystem.getInfoAsync(mediaDir);
      if (!dirInfo.exists) {
        await FileSystem.makeDirectoryAsync(mediaDir, { intermediates: true });
      }

      const fileExtension = media.uri.split('.').pop();
      const fileName = `${postId}_${Date.now()}.${fileExtension}`;
      const newPath = `${mediaDir}${fileName}`;

      // Copy file to app directory
      await FileSystem.copyAsync({
        from: media.uri,
        to: newPath,
      });

      return {
        id: this.generateId(),
        type: media.type || (media.uri.includes('video') ? 'video' : 'image'),
        uri: newPath,
        originalUri: media.uri,
        width: media.width || 1080,
        height: media.height || 1920,
        duration: media.duration || null,
        size: media.fileSize || null,
        mimeType: media.mimeType || null,
      };
    } catch (error) {
      console.error('Error processing media:', error);
      throw new Error('Failed to process media');
    }
  }

  // Save post to storage
  static async savePost(post) {
    try {
      const existingPosts = await this.getAllPosts();
      const updatedPosts = [post, ...existingPosts]; // Add to beginning
      await AsyncStorage.setItem(this.POSTS_KEY, JSON.stringify(updatedPosts));
    } catch (error) {
      throw new Error('Failed to save post');
    }
  }

  // Add post to user's posts list
  static async addToUserPosts(userId, postId) {
    try {
      const userPostsKey = `${this.USER_POSTS_KEY}_${userId}`;
      const existingUserPosts = await AsyncStorage.getItem(userPostsKey);
      const userPosts = existingUserPosts ? JSON.parse(existingUserPosts) : [];
      
      userPosts.unshift(postId); // Add to beginning
      await AsyncStorage.setItem(userPostsKey, JSON.stringify(userPosts));
    } catch (error) {
      throw new Error('Failed to update user posts');
    }
  }

  // Get all posts (for feed)
  static async getAllPosts() {
    try {
      const posts = await AsyncStorage.getItem(this.POSTS_KEY);
      return posts ? JSON.parse(posts) : [];
    } catch (error) {
      console.error('Error getting posts:', error);
      return [];
    }
  }

  // Get posts by user
  static async getUserPosts(userId) {
    try {
      const userPostsKey = `${this.USER_POSTS_KEY}_${userId}`;
      const userPostIds = await AsyncStorage.getItem(userPostsKey);
      
      if (!userPostIds) return [];
      
      const postIds = JSON.parse(userPostIds);
      const allPosts = await this.getAllPosts();
      
      return allPosts.filter(post => postIds.includes(post.id));
    } catch (error) {
      console.error('Error getting user posts:', error);
      return [];
    }
  }

  // Get single post by ID
  static async getPost(postId) {
    try {
      const allPosts = await this.getAllPosts();
      return allPosts.find(post => post.id === postId);
    } catch (error) {
      console.error('Error getting post:', error);
      return null;
    }
  }

  // Update post (for likes, comments, etc.)
  static async updatePost(postId, updates) {
    try {
      const allPosts = await this.getAllPosts();
      const postIndex = allPosts.findIndex(post => post.id === postId);
      
      if (postIndex === -1) {
        throw new Error('Post not found');
      }

      allPosts[postIndex] = { ...allPosts[postIndex], ...updates };
      await AsyncStorage.setItem(this.POSTS_KEY, JSON.stringify(allPosts));
      
      return allPosts[postIndex];
    } catch (error) {
      console.error('Error updating post:', error);
      throw error;
    }
  }

  // Delete post
  static async deletePost(postId, userId) {
    try {
      // Remove from all posts
      const allPosts = await this.getAllPosts();
      const updatedPosts = allPosts.filter(post => post.id !== postId);
      await AsyncStorage.setItem(this.POSTS_KEY, JSON.stringify(updatedPosts));

      // Remove from user posts
      const userPostsKey = `${this.USER_POSTS_KEY}_${userId}`;
      const userPostIds = await AsyncStorage.getItem(userPostsKey);
      if (userPostIds) {
        const updatedUserPosts = JSON.parse(userPostIds).filter(id => id !== postId);
        await AsyncStorage.setItem(userPostsKey, JSON.stringify(updatedUserPosts));
      }

      // Delete media file if exists
      const post = allPosts.find(p => p.id === postId);
      if (post && post.media && post.media.uri) {
        try {
          await FileSystem.deleteAsync(post.media.uri);
        } catch (mediaError) {
          console.warn('Could not delete media file:', mediaError);
        }
      }

      return { success: true, message: 'Post deleted successfully' };
    } catch (error) {
      console.error('Error deleting post:', error);
      return { success: false, error: error.message };
    }
  }

  // Like/Unlike post
  static async toggleLike(postId, userId) {
    try {
      const post = await this.getPost(postId);
      if (!post) throw new Error('Post not found');

      // Get user's liked posts
      const likedPostsKey = `liked_posts_${userId}`;
      const likedPosts = await AsyncStorage.getItem(likedPostsKey);
      const likedPostsArray = likedPosts ? JSON.parse(likedPosts) : [];

      const isLiked = likedPostsArray.includes(postId);
      let updatedLikes = post.likes;

      if (isLiked) {
        // Unlike
        const updatedLikedPosts = likedPostsArray.filter(id => id !== postId);
        await AsyncStorage.setItem(likedPostsKey, JSON.stringify(updatedLikedPosts));
        updatedLikes = Math.max(0, post.likes - 1);
      } else {
        // Like
        likedPostsArray.push(postId);
        await AsyncStorage.setItem(likedPostsKey, JSON.stringify(likedPostsArray));
        updatedLikes = post.likes + 1;
      }

      // Update post likes count
      await this.updatePost(postId, { likes: updatedLikes });

      return {
        success: true,
        isLiked: !isLiked,
        likes: updatedLikes
      };
    } catch (error) {
      console.error('Error toggling like:', error);
      return { success: false, error: error.message };
    }
  }

  // Add comment to post
  static async addComment(postId, userId, commentText) {
    try {
      const commentId = this.generateId();
      const comment = {
        id: commentId,
        postId,
        userId,
        username: 'alexmusic', // In real app, get from user data
        displayName: 'Alex Rodriguez',
        text: commentText,
        timestamp: new Date().toISOString(),
        likes: 0,
      };

      // Save comment
      const commentsKey = `comments_${postId}`;
      const existingComments = await AsyncStorage.getItem(commentsKey);
      const comments = existingComments ? JSON.parse(existingComments) : [];
      comments.push(comment);
      await AsyncStorage.setItem(commentsKey, JSON.stringify(comments));

      // Update post comments count
      const post = await this.getPost(postId);
      if (post) {
        await this.updatePost(postId, { comments: post.comments + 1 });
      }

      return {
        success: true,
        comment,
        message: 'Comment added successfully'
      };
    } catch (error) {
      console.error('Error adding comment:', error);
      return { success: false, error: error.message };
    }
  }

  // Get comments for post
  static async getComments(postId) {
    try {
      const commentsKey = `comments_${postId}`;
      const comments = await AsyncStorage.getItem(commentsKey);
      return comments ? JSON.parse(comments) : [];
    } catch (error) {
      console.error('Error getting comments:', error);
      return [];
    }
  }
}

export default PostService;