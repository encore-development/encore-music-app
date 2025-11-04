// Simple in-memory post service for immediate testing
// This will work without external dependencies

class SimplePostService {
  static posts = [];
  static userPosts = {};
  static likedPosts = {};
  static comments = {};

  // Generate unique ID for posts
  static generateId() {
    return Date.now().toString() + Math.random().toString(36).substr(2, 9);
  }

  // Create a new post (simplified version)
  static async createPost(postData) {
    try {
      const postId = this.generateId();
      const timestamp = new Date().toISOString();
      
      const newPost = {
        id: postId,
        userId: 'current_user',
        username: 'alexmusic',
        displayName: 'Alex Rodriguez',
        avatar: null,
        verified: true,
        content: postData.content || '',
        media: postData.media || null,
        type: postData.type || 'post',
        likes: 0,
        comments: 0,
        shares: 0,
        views: 0,
        timestamp: timestamp,
        location: postData.location || null,
        tags: postData.tags || [],
        musicTrack: postData.musicTrack || null,
        isPublic: postData.isPublic !== false,
      };

      // Add to posts array (in memory)
      this.posts.unshift(newPost);
      
      // Add to user's posts
      if (!this.userPosts['current_user']) {
        this.userPosts['current_user'] = [];
      }
      this.userPosts['current_user'].unshift(postId);

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

  // Get all posts (for feed)
  static async getAllPosts() {
    return [...this.posts]; // Return copy
  }

  // Get posts by user
  static async getUserPosts(userId) {
    const userPostIds = this.userPosts[userId] || [];
    return this.posts.filter(post => userPostIds.includes(post.id));
  }

  // Get single post by ID
  static async getPost(postId) {
    return this.posts.find(post => post.id === postId);
  }

  // Update post
  static async updatePost(postId, updates) {
    const postIndex = this.posts.findIndex(post => post.id === postId);
    if (postIndex === -1) {
      throw new Error('Post not found');
    }

    this.posts[postIndex] = { ...this.posts[postIndex], ...updates };
    return this.posts[postIndex];
  }

  // Toggle like
  static async toggleLike(postId, userId) {
    try {
      const post = await this.getPost(postId);
      if (!post) throw new Error('Post not found');

      if (!this.likedPosts[userId]) {
        this.likedPosts[userId] = [];
      }

      const isLiked = this.likedPosts[userId].includes(postId);
      let updatedLikes = post.likes;

      if (isLiked) {
        // Unlike
        this.likedPosts[userId] = this.likedPosts[userId].filter(id => id !== postId);
        updatedLikes = Math.max(0, post.likes - 1);
      } else {
        // Like
        this.likedPosts[userId].push(postId);
        updatedLikes = post.likes + 1;
      }

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

  // Add comment
  static async addComment(postId, userId, commentText) {
    try {
      const commentId = this.generateId();
      const comment = {
        id: commentId,
        postId,
        userId,
        username: 'alexmusic',
        displayName: 'Alex Rodriguez',
        text: commentText,
        timestamp: new Date().toISOString(),
        likes: 0,
      };

      if (!this.comments[postId]) {
        this.comments[postId] = [];
      }
      this.comments[postId].push(comment);

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

  // Get comments
  static async getComments(postId) {
    return this.comments[postId] || [];
  }

  // Delete post
  static async deletePost(postId, userId) {
    try {
      this.posts = this.posts.filter(post => post.id !== postId);
      
      if (this.userPosts[userId]) {
        this.userPosts[userId] = this.userPosts[userId].filter(id => id !== postId);
      }

      return { success: true, message: 'Post deleted successfully' };
    } catch (error) {
      console.error('Error deleting post:', error);
      return { success: false, error: error.message };
    }
  }
}

export default SimplePostService;