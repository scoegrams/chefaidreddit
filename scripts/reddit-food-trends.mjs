import Snoowrap from 'snoowrap';
import { CULINARY_SUBREDDITS } from './culinary-subreddits.mjs';

function createClient() {
  const {
    REDDIT_CLIENT_ID,
    REDDIT_CLIENT_SECRET,
    REDDIT_USERNAME,
    REDDIT_PASSWORD,
    REDDIT_USER_AGENT,
  } = process.env;

  const missing = [
    ['REDDIT_CLIENT_ID', REDDIT_CLIENT_ID],
    ['REDDIT_CLIENT_SECRET', REDDIT_CLIENT_SECRET],
    ['REDDIT_USERNAME', REDDIT_USERNAME],
    ['REDDIT_PASSWORD', REDDIT_PASSWORD],
    ['REDDIT_USER_AGENT', REDDIT_USER_AGENT],
  ]
    .filter(([, value]) => !value)
    .map(([name]) => name);

  if (missing.length > 0) {
    throw new Error(
      `Missing env: ${missing.join(', ')}. Copy .env.example to .env and fill in values.`
    );
  }

  return new Snoowrap({
    userAgent: REDDIT_USER_AGENT,
    clientId: REDDIT_CLIENT_ID,
    clientSecret: REDDIT_CLIENT_SECRET,
    username: REDDIT_USERNAME,
    password: REDDIT_PASSWORD,
  });
}

/**
 * @param {object} [options]
 * @param {string[]} [options.subreddits]
 * @param {number} [options.limitPerSub] posts per subreddit (default 10)
 * @param {'hour'|'day'|'week'|'month'|'year'|'all'} [options.time] default 'month'
 * @param {number} [options.topN] max posts returned after merge (default 25)
 */
export async function getFoodTrends(options = {}) {
  const subreddits = options.subreddits ?? CULINARY_SUBREDDITS;
  const limitPerSub = options.limitPerSub ?? 10;
  const time = options.time ?? 'month';
  const topN = options.topN ?? 25;

  const reddit = createClient();
  const posts = [];

  for (const subreddit of subreddits) {
    const listing = await reddit
      .getSubreddit(subreddit)
      .getTop({ time, limit: limitPerSub });

    for (const post of listing) {
      posts.push({
        subreddit,
        id: post.id,
        title: post.title,
        score: post.score,
        numComments: post.num_comments,
        url: `https://www.reddit.com${post.permalink}`,
        link: post.url,
        createdAt: new Date(post.created_utc * 1000).toISOString(),
        flair: post.link_flair_text ?? null,
      });
    }
  }

  posts.sort((a, b) => b.score - a.score);
  return posts.slice(0, topN);
}
