import { redis, reddit } from '@devvit/web/server';
import type { FoodTrendPost } from '../../shared/food-trends';

const CACHE_KEY = 'food-trends:month:v2:pizza-tacos-fried';
const CACHE_TTL_MS = 60 * 60 * 1000;

const FOOD_SUBREDDITS = [
  'pizza',
  'tacos',
  'mexicanfood',
  'fastfood',
  'JunkFood',
  'streetfood',
  'deepfried',
  'fried',
  'FoodPorn',
  'wings',
];

export async function fetchFoodTrends(): Promise<{
  posts: FoodTrendPost[];
  cached: boolean;
}> {
  const cached = await redis.get(CACHE_KEY);
  if (cached) {
    return { posts: JSON.parse(cached) as FoodTrendPost[], cached: true };
  }

  const posts: FoodTrendPost[] = [];

  for (const subredditName of FOOD_SUBREDDITS) {
    const listing = await reddit.getTopPosts({
      subredditName,
      timeframe: 'month',
      limit: 5,
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
  }

  posts.sort((a, b) => b.score - a.score);
  const top = posts.slice(0, 20);

  await redis.set(CACHE_KEY, JSON.stringify(top), {
    expiration: new Date(Date.now() + CACHE_TTL_MS),
  });

  return { posts: top, cached: false };
}
