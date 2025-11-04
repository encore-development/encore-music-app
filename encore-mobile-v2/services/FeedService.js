// Feed Service - Manages feed generation and caching
// Easy to swap algorithm implementations

import PostService from './PostService';
import FeedAlgorithm from './FeedAlgorithm';

class FeedService {
  static feedCache = {};
  static cacheExpiry = 5 * 60 * 1000; // 5 minutes cache

  // Generate personalized feed for user
  static async generatePersonalizedFeed(userId, options = {}) {
    try {
      const cacheKey = `feed_${userId}`;
      const now = Date.now();

      // Check cache first
      if (this.feedCache[cacheKey] && 
          (now - this.feedCache[cacheKey].timestamp) < this.cacheExpiry) {
        return {
          success: true,
          posts: this.feedCache[cacheKey].posts,
          cached: true,
          algorithm: this.feedCache[cacheKey].algorithm
        };
      }

      // Get all posts
      const allPosts = await PostService.getAllPosts();
      
      if (allPosts.length === 0) {
        return {
          success: true,
          posts: [],
          message: 'No posts available'
        };
      }

      // Get user preferences (mock for now)
      const userPreferences = await this.getUserPreferences(userId);

      // Generate feed using algorithm
      const feedResult = await FeedAlgorithm.generateFeed(userId, allPosts, userPreferences);

      if (feedResult.success) {
        // Cache the result
        this.feedCache[cacheKey] = {
          posts: feedResult.posts,
          timestamp: now,
          algorithm: feedResult.algorithm
        };
      }

      return feedResult;
    } catch (error) {
      console.error('Feed generation error:', error);
      
      // Fallback to chronological feed
      const allPosts = await PostService.getAllPosts();
      return {
        success: false,
        posts: allPosts.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp)),
        error: error.message,
        fallback: true
      };
    }
  }

  // Get trending posts
  static async getTrendingFeed(timeframe = 24) {
    try {
      const cacheKey = `trending_${timeframe}h`;
      const now = Date.now();

      // Check cache
      if (this.feedCache[cacheKey] && 
          (now - this.feedCache[cacheKey].timestamp) < this.cacheExpiry) {
        return {
          success: true,
          posts: this.feedCache[cacheKey].posts,
          cached: true
        };
      }

      const allPosts = await PostService.getAllPosts();
      const trendingPosts = await FeedAlgorithm.getTrendingPosts(allPosts, timeframe);

      // Cache result
      this.feedCache[cacheKey] = {
        posts: trendingPosts,
        timestamp: now
      };

      return {
        success: true,
        posts: trendingPosts
      };
    } catch (error) {
      console.error('Trending feed error:', error);
      return {
        success: false,
        posts: [],
        error: error.message
      };
    }
  }

  // Get chronological feed (no algorithm)
  static async getChronologicalFeed() {
    try {
      const allPosts = await PostService.getAllPosts();
      return {
        success: true,
        posts: allPosts.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp)),
        algorithm: 'chronological'
      };
    } catch (error) {
      console.error('Chronological feed error:', error);
      return {
        success: false,
        posts: [],
        error: error.message
      };
    }
  }

  // Get user preferences (mock implementation)
  static async getUserPreferences(userId) {
    // In real app, this would fetch from user profile or preferences API
    return {
      videoPreference: 0.7,    // User likes videos
      photoPreference: 0.5,    // Neutral on photos
      musicPreference: 0.8,    // Loves music content
      contentTypes: ['music', 'video', 'photo'],
      followedUsers: [],       // Users they follow
      blockedUsers: [],        // Users they've blocked
      interests: ['music', 'production', 'beats']
    };
  }

  // Update user interaction (for algorithm learning)
  static async recordInteraction(userId, postId, interactionType, metadata = {}) {
    try {
      const interaction = {
        userId,
        postId,
        type: interactionType, // 'like', 'comment', 'share', 'view', 'skip'
        timestamp: new Date().toISOString(),
        metadata // Additional data like view duration, etc.
      };

      // Update algorithm preferences
      FeedAlgorithm.updateUserPreferences(userId, interaction);

      // Clear relevant caches
      this.clearUserCache(userId);

      return {
        success: true,
        interaction
      };
    } catch (error) {
      console.error('Interaction recording error:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }

  // Clear cache for specific user
  static clearUserCache(userId) {
    const keysToDelete = Object.keys(this.feedCache).filter(key => 
      key.includes(userId) || key.includes('trending')
    );
    
    keysToDelete.forEach(key => {
      delete this.feedCache[key];
    });
  }

  // Clear all cache
  static clearAllCache() {
    this.feedCache = {};
  }

  // Get feed stats (for debugging/analytics)
  static getFeedStats() {
    return {
      cacheSize: Object.keys(this.feedCache).length,
      cacheKeys: Object.keys(this.feedCache),
      cacheExpiry: this.cacheExpiry,
      lastGenerated: Math.max(...Object.values(this.feedCache).map(cache => cache.timestamp))
    };
  }

  // Switch algorithm (for A/B testing or updates)
  static setAlgorithm(algorithmClass) {
    // This allows you to easily swap in your real algorithm later
    FeedAlgorithm = algorithmClass;
    this.clearAllCache(); // Clear cache when switching algorithms
  }
}

export default FeedService;