// Simple Feed Algorithm - Easy to replace with real algorithm later
// This provides basic content ranking and personalization

class FeedAlgorithm {
  // Algorithm configuration - easy to adjust
  static config = {
    // Scoring weights (0-1)
    recencyWeight: 0.4,        // How much recent posts are prioritized
    engagementWeight: 0.3,     // Likes, comments, shares impact
    userInteractionWeight: 0.2, // Posts from users you interact with
    contentTypeWeight: 0.1,    // Video vs photo preference
    
    // Time decay settings
    maxAgeHours: 72,          // Posts older than this get heavily penalized
    peakEngagementHours: 24,  // Posts perform best in first 24h
    
    // Content diversity
    maxSameUserInRow: 2,      // Prevent too many posts from same user
    videoBoostMultiplier: 1.2, // Slight boost for video content
  };

  // Main feed generation function
  static async generateFeed(userId, posts, userPreferences = {}) {
    try {
      // Step 1: Filter and prepare posts
      const validPosts = this.filterPosts(posts);
      
      // Step 2: Score each post
      const scoredPosts = validPosts.map(post => ({
        ...post,
        feedScore: this.calculatePostScore(post, userId, userPreferences)
      }));

      // Step 3: Sort by score
      const sortedPosts = scoredPosts.sort((a, b) => b.feedScore - a.feedScore);

      // Step 4: Apply diversity rules
      const diversifiedFeed = this.applyDiversityRules(sortedPosts);

      // Step 5: Add some randomization to prevent staleness
      const finalFeed = this.addRandomization(diversifiedFeed);

      return {
        success: true,
        posts: finalFeed,
        algorithm: 'simple_v1',
        generatedAt: new Date().toISOString()
      };
    } catch (error) {
      console.error('Feed generation error:', error);
      return {
        success: false,
        posts: posts.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp)), // Fallback to chronological
        error: error.message
      };
    }
  }

  // Filter out invalid or inappropriate posts
  static filterPosts(posts) {
    const now = new Date();
    const maxAge = this.config.maxAgeHours * 60 * 60 * 1000;

    return posts.filter(post => {
      // Remove posts that are too old
      const postAge = now - new Date(post.timestamp);
      if (postAge > maxAge) return false;

      // Remove private posts (if not from current user)
      if (!post.isPublic && post.userId !== 'current_user') return false;

      // Remove deleted or flagged posts
      if (post.deleted || post.flagged) return false;

      return true;
    });
  }

  // Calculate score for a single post
  static calculatePostScore(post, userId, userPreferences) {
    let score = 0;

    // 1. Recency Score (0-1)
    const recencyScore = this.calculateRecencyScore(post);
    score += recencyScore * this.config.recencyWeight;

    // 2. Engagement Score (0-1)
    const engagementScore = this.calculateEngagementScore(post);
    score += engagementScore * this.config.engagementWeight;

    // 3. User Interaction Score (0-1)
    const interactionScore = this.calculateUserInteractionScore(post, userId);
    score += interactionScore * this.config.userInteractionWeight;

    // 4. Content Type Score (0-1)
    const contentTypeScore = this.calculateContentTypeScore(post, userPreferences);
    score += contentTypeScore * this.config.contentTypeWeight;

    // 5. Apply multipliers
    if (post.type === 'reel' || (post.media && post.media.type === 'video')) {
      score *= this.config.videoBoostMultiplier;
    }

    // 6. Normalize score (0-1)
    return Math.min(Math.max(score, 0), 1);
  }

  // Calculate how recent the post is (newer = higher score)
  static calculateRecencyScore(post) {
    const now = new Date();
    const postTime = new Date(post.timestamp);
    const ageHours = (now - postTime) / (1000 * 60 * 60);

    // Peak performance in first 24 hours, then decay
    if (ageHours <= this.config.peakEngagementHours) {
      return 1.0;
    } else {
      const decayFactor = Math.max(0, 1 - (ageHours - this.config.peakEngagementHours) / this.config.maxAgeHours);
      return decayFactor;
    }
  }

  // Calculate engagement score based on likes, comments, shares
  static calculateEngagementScore(post) {
    const totalEngagement = (post.likes || 0) + (post.comments || 0) * 2 + (post.shares || 0) * 3;
    
    // Normalize based on typical engagement levels
    // This is a simple logarithmic scale - adjust based on your app's metrics
    const normalizedScore = Math.log(totalEngagement + 1) / Math.log(100); // Assumes 100 is high engagement
    
    return Math.min(normalizedScore, 1);
  }

  // Calculate user interaction score (posts from users you interact with more)
  static calculateUserInteractionScore(post, userId) {
    // For now, return neutral score
    // In real implementation, this would check:
    // - How often user likes this author's posts
    // - How often user comments on this author's posts
    // - If users follow each other
    // - Recent interactions
    
    if (post.userId === userId) {
      return 0.1; // Slightly demote own posts to show diverse content
    }
    
    return 0.5; // Neutral score for now
  }

  // Calculate content type preference score
  static calculateContentTypeScore(post, userPreferences) {
    // Default preferences if none provided
    const defaultPrefs = {
      videoPreference: 0.6,  // Slight preference for videos
      photoPreference: 0.4,
      musicPreference: 0.7,  // Higher preference for music content
    };
    
    const prefs = { ...defaultPrefs, ...userPreferences };
    
    if (post.type === 'reel' || (post.media && post.media.type === 'video')) {
      return prefs.videoPreference;
    } else if (post.media && post.media.type === 'image') {
      return prefs.photoPreference;
    } else if (post.musicTrack) {
      return prefs.musicPreference;
    }
    
    return 0.5; // Neutral for text posts
  }

  // Apply diversity rules to prevent monotonous feed
  static applyDiversityRules(posts) {
    const diversifiedPosts = [];
    const userPostCount = {};
    
    for (const post of posts) {
      const userCount = userPostCount[post.userId] || 0;
      
      // If we haven't hit the limit for this user, add the post
      if (userCount < this.config.maxSameUserInRow) {
        diversifiedPosts.push(post);
        userPostCount[post.userId] = userCount + 1;
      } else {
        // Skip this post for now, could be added later with lower priority
        continue;
      }
      
      // Reset counter if we've added posts from other users
      if (diversifiedPosts.length > 0) {
        const lastPost = diversifiedPosts[diversifiedPosts.length - 1];
        if (lastPost.userId !== post.userId) {
          // Reset all counters when we switch users
          Object.keys(userPostCount).forEach(userId => {
            if (userId !== post.userId) {
              userPostCount[userId] = 0;
            }
          });
        }
      }
    }
    
    return diversifiedPosts;
  }

  // Add slight randomization to prevent completely predictable feeds
  static addRandomization(posts) {
    return posts.map(post => ({
      ...post,
      // Add small random factor to final score
      feedScore: post.feedScore + (Math.random() - 0.5) * 0.1
    })).sort((a, b) => b.feedScore - a.feedScore);
  }

  // Update user preferences based on interactions
  static updateUserPreferences(userId, interaction) {
    // This would be called when user likes, shares, comments, or spends time on posts
    // For now, just log the interaction
    console.log('User interaction logged:', { userId, interaction });
    
    // In real implementation:
    // - Track which content types user engages with
    // - Track which users they interact with most
    // - Update preference weights accordingly
    // - Store in user profile or separate preferences table
  }

  // Get trending posts (separate from personalized feed)
  static async getTrendingPosts(posts, timeframe = 24) {
    const cutoffTime = new Date(Date.now() - timeframe * 60 * 60 * 1000);
    
    const recentPosts = posts.filter(post => 
      new Date(post.timestamp) > cutoffTime
    );
    
    // Sort by engagement rate (engagement per hour)
    const trendingPosts = recentPosts.map(post => {
      const ageHours = (Date.now() - new Date(post.timestamp)) / (1000 * 60 * 60);
      const engagementRate = ((post.likes || 0) + (post.comments || 0) + (post.shares || 0)) / Math.max(ageHours, 1);
      
      return {
        ...post,
        engagementRate,
        trendingScore: engagementRate
      };
    }).sort((a, b) => b.trendingScore - a.trendingScore);
    
    return trendingPosts.slice(0, 20); // Top 20 trending
  }
}

export default FeedAlgorithm;