import './index.css';

import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { navigateTo } from '@devvit/web/client';
import { useFoodTrends } from './hooks/useFoodTrends';

function formatScore(score: number): string {
  if (score >= 1000) {
    return `${(score / 1000).toFixed(1)}k`;
  }
  return String(score);
}

export const App = () => {
  const { posts, cached, loading, error } = useFoodTrends();

  return (
    <div className="flex relative flex-col min-h-screen bg-white dark:bg-gray-900">
      <header className="sticky top-0 z-10 border-b border-gray-200 dark:border-gray-800 bg-white/95 dark:bg-gray-900/95 backdrop-blur px-4 py-3">
        <h1 className="text-lg font-bold text-gray-900 dark:text-white">
          ChefAid — Food trends
        </h1>
        <p className="text-sm text-gray-600 dark:text-gray-400">
          Pizza, tacos, fried &amp; fast food — top posts this month
          {cached && !loading ? ' · cached' : ''}
        </p>
      </header>

      <main className="flex-1 overflow-y-auto px-4 py-3 pb-16">
        {loading && (
          <p className="text-center text-gray-500 dark:text-gray-400 py-8">
            Loading trends…
          </p>
        )}

        {error && (
          <p className="text-center text-red-600 dark:text-red-400 py-8">
            {error}
          </p>
        )}

        {!loading && !error && posts.length === 0 && (
          <p className="text-center text-gray-500 dark:text-gray-400 py-8">
            No posts found.
          </p>
        )}

        <ul className="flex flex-col gap-2">
          {posts.map((post) => (
            <li key={`${post.subreddit}-${post.permalink}`}>
              <button
                type="button"
                className="w-full text-left rounded-lg border border-gray-200 dark:border-gray-700 p-3 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                onClick={() =>
                  navigateTo(`https://www.reddit.com${post.permalink}`)
                }
              >
                <div className="flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400 mb-1">
                  <span className="font-medium text-[#d93900] dark:text-orange-500">
                    r/{post.subreddit}
                  </span>
                  <span>▲ {formatScore(post.score)}</span>
                  <span>{post.numComments} comments</span>
                </div>
                <p className="text-sm font-medium text-gray-900 dark:text-gray-100 line-clamp-2">
                  {post.title}
                </p>
              </button>
            </li>
          ))}
        </ul>
      </main>

      <footer className="absolute bottom-0 left-0 right-0 border-t border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 px-4 py-2 text-center text-xs text-gray-500 dark:text-gray-400">
        Powered by Reddit · refreshes hourly
      </footer>
    </div>
  );
};

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>
);
