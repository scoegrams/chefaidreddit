import { redis, reddit } from '@devvit/web/server';
import { CULINARY_SUBREDDITS, type FoodTrendPost } from '../../shared/food-trends';

const CACHE_KEY = 'food-trends:month:v3:culinary';
const CACHE_TTL_MS = 60 * 60 * 1000;
const POSTS_PER_SUBREDDIT = 3;
const TOP_POST_COUNT = 25;

export async function fetchFoodTrends(): Promise<{
  posts: FoodTrendPost[];
  cached: boolean;
}> {
  const cached = await redis.get(CACHE_KEY);
  if (cached) {
    return { posts: JSON.parse(cached) as FoodTrendPost[], cached: true };
  }

  const posts: FoodTrendPost[] = [];

  for (const subredditName of CULINARY_SUBREDDITS) {
    try {
      const listing = await reddit.getTopPosts({
        subredditName,
        timeframe: 'month',
        limit: POSTS_PER_SUBREDDIT,
      });
      const batch = await listing.all();
      for (const post of batch) {
        posts.push({
          subreddit: post.subredditName,
          title: post.title,
          score: post.score,
          numComments: post.numberOfComments,
          permalink: post.permalink,
        });
      }
    } catch (error) {
      console.warn(`Skipping r/${subredditName}:`, error);
    }
  }

  posts.sort((a, b) => b.score - a.score);
  const top = posts.slice(0, TOP_POST_COUNT);

  await redis.set(CACHE_KEY, JSON.stringify(top), {
    expiration: new Date(Date.now() + CACHE_TTL_MS),
  });

  return { posts: top, cached: false };
}
