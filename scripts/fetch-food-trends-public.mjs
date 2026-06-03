import 'dotenv/config';

import { CULINARY_SUBREDDITS } from './culinary-subreddits.mjs';

const USER_AGENT =
  process.env.REDDIT_USER_AGENT ??
  'chefaidio:food-trends:v1.0.0 (by /u/chefaidio)';

async function getAppOnlyToken() {
  const clientId = process.env.REDDIT_CLIENT_ID;
  const clientSecret = process.env.REDDIT_CLIENT_SECRET;
  if (!clientId || !clientSecret) {
    return null;
  }

  const auth = Buffer.from(`${clientId}:${clientSecret}`).toString('base64');
  const res = await fetch('https://www.reddit.com/api/v1/access_token', {
    method: 'POST',
    headers: {
      Authorization: `Basic ${auth}`,
      'User-Agent': USER_AGENT,
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: 'grant_type=client_credentials',
  });

  if (!res.ok) {
    throw new Error(`OAuth failed: HTTP ${res.status}`);
  }

  const { access_token: token } = await res.json();
  return token;
}

async function fetchTop(subreddit, limit, token) {
  const url = `https://oauth.reddit.com/r/${subreddit}/top?t=month&limit=${limit}`;
  const headers = { 'User-Agent': USER_AGENT };
  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  const res = await fetch(url, { headers });
  if (!res.ok) {
    throw new Error(`r/${subreddit}: HTTP ${res.status}`);
  }

  const data = await res.json();
  return data.data.children.map(({ data: post }) => ({
    subreddit,
    id: post.id,
    title: post.title,
    score: post.ups,
    numComments: post.num_comments,
    url: `https://www.reddit.com${post.permalink}`,
    link: post.url,
    createdAt: new Date(post.created_utc * 1000).toISOString(),
    flair: post.link_flair_text ?? null,
  }));
}

const token = await getAppOnlyToken();
if (!token) {
  console.error(
    'Add REDDIT_CLIENT_ID and REDDIT_CLIENT_SECRET to .env (from reddit.com/prefs/apps), then run again.'
  );
  process.exit(1);
}

const posts = [];
for (const sub of CULINARY_SUBREDDITS) {
  posts.push(...(await fetchTop(sub, 10, token)));
}
posts.sort((a, b) => b.score - a.score);
console.log(JSON.stringify(posts.slice(0, 25), null, 2));
